using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PaymentService.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Razorpay.Api;
using Razorpay.Api.Errors;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace PaymentService.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public PaymentController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetAllTransactions()
        {
            return await _context.Transactions.ToListAsync();
        }

        [HttpGet("config")]
        public ActionResult GetConfig()
        {
            // Only expose the public KeyId to the frontend
            return Ok(new { keyId = _configuration["Razorpay:KeyId"] });
        }

        [HttpPost]
        public async Task<ActionResult<Transaction>> ProcessTransaction(Transaction transaction)
        {
            transaction.Date = DateTime.UtcNow;
            if (string.IsNullOrEmpty(transaction.Status))
            {
                transaction.Status = "Pending";
            }
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            return Ok(transaction);
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult<Transaction>> UpdateTransactionStatus(long id, [FromBody] Dictionary<string, string> payload)
        {
            if (!payload.TryGetValue("status", out var status) || string.IsNullOrEmpty(status))
            {
                return BadRequest("Status is required");
            }

            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound("Transaction not found");
            }

            transaction.Status = status;
            await _context.SaveChangesAsync();
            return Ok(transaction);
        }

        [HttpPost("create-order")]
        public ActionResult CreateOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                string keyId = _configuration["Razorpay:KeyId"];
                string keySecret = _configuration["Razorpay:KeySecret"];

                RazorpayClient client = new RazorpayClient(keyId, keySecret);
                
                Dictionary<string, object> options = new Dictionary<string, object>();
                // Amount should be in paisa (smallest unit)
                options.Add("amount", request.Amount * 100); 
                options.Add("currency", "INR");
                options.Add("receipt", "rcpt_" + Guid.NewGuid().ToString().Substring(0, 8));
                
                Order order = client.Order.Create(options);
                return Ok(new { orderId = order["id"].ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("verify")]
        public async Task<ActionResult> VerifyPayment([FromBody] VerifyPaymentRequest request)
        {
            try
            {
                string keySecret = _configuration["Razorpay:KeySecret"];
                
                Dictionary<string, string> attributes = new Dictionary<string, string>();
                attributes.Add("razorpay_payment_id", request.RazorpayPaymentId);
                attributes.Add("razorpay_order_id", request.RazorpayOrderId);
                attributes.Add("razorpay_signature", request.RazorpaySignature);

                Utils.verifyPaymentSignature(attributes);

                // If verification succeeds, create the transaction record
                var transaction = new Transaction
                {
                    Date = DateTime.UtcNow,
                    Reference = "Funds Added via Razorpay (" + request.RazorpayPaymentId + ")",
                    Amount = (double)request.Amount,
                    Type = "Credit",
                    Status = "Completed",
                    TeamName = request.TeamName
                };

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                // Trigger email notification asynchronously
                if (!string.IsNullOrEmpty(request.OwnerEmail))
                {
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            using var client = new HttpClient();
                            var payload = new
                            {
                                to = request.OwnerEmail,
                                subject = "Wallet Top-up Successful!",
                                html = $"<h3>Payment Received</h3><p>Your wallet has been successfully credited with ₹{request.Amount}.</p><p>Transaction ID: {request.RazorpayPaymentId}</p>"
                            };
                            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                            await client.PostAsync("http://127.0.0.1:3000/api/notification/send", content);
                        }
                        catch { /* Fire and forget */ }
                    });
                }

                return Ok(new { success = true, transaction });
            }
            catch (SignatureVerificationError ex)
            {
                return BadRequest(new { success = false, message = "Invalid payment signature", error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }

    public class CreateOrderRequest
    {
        public decimal Amount { get; set; }
    }

    public class VerifyPaymentRequest
    {
        public string? RazorpayPaymentId { get; set; }
        public string? RazorpayOrderId { get; set; }
        public string? RazorpaySignature { get; set; }
        public decimal Amount { get; set; }
        public string? TeamName { get; set; }
        public string? OwnerEmail { get; set; }
    }
}
