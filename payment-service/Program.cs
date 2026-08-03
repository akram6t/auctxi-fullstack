using Microsoft.EntityFrameworkCore;
using PaymentService.Models;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Configure CORS so API Gateway/Frontend can reach it
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// Automatically create the auctxi-payment database and tables on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();

app.MapOpenApi();
app.MapScalarApiReference(options =>
{
    options.Title = "Payment Service API";
    options.Theme = ScalarTheme.Mars;
    options.DefaultHttpClient = new(ScalarTarget.CSharp, ScalarClient.HttpClient);
});

// Add a simple root endpoint for checking server status in the browser
app.MapGet("/", () => "Payment Service is running");

// Lightweight health check endpoint for the API Gateway
app.MapGet("/api/payments/ping", () => new { status = "Payment Service is running", timestamp = DateTime.UtcNow });

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
