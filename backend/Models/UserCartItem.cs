using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Models
{
    [Table("UserCartItems")]
    public class UserCartItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(128)]
        public string UserId { get; set; } = string.Empty;

        [Required]
        [MaxLength(64)]
        public string MusicItemId { get; set; } = string.Empty;

        [Required]
        [MaxLength(128)]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal PriceIDR { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PriceUSD { get; set; }

        public int Quantity { get; set; } = 1;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
