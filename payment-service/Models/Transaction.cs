using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Models
{
    [Table("transactions")]
    public class Transaction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long Id { get; set; }

        [Column("date")]
        public DateTime? Date { get; set; }

        [Column("amount")]
        public double? Amount { get; set; }

        [Column("type")]
        public string? Type { get; set; }

        [Column("status")]
        public string? Status { get; set; }

        [Column("reference")]
        public string? Reference { get; set; }

        [Column("team_name")]
        public string? TeamName { get; set; }

        [Column("event_name")]
        public string? EventName { get; set; }

        [Column("player_name")]
        public string? PlayerName { get; set; }
    }
}
