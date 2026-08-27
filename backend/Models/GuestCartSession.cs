using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Models
{
    [Table("GuestCartSessions")]
    public class GuestCartSession
    {
        [Key]
        public Guid SessionId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(128)]
        public string GuestCookieToken { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime LastAccessedAt { get; set; } = DateTime.UtcNow;

        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(30);

        public virtual ICollection<GuestCartItem> Items { get; set; } = new List<GuestCartItem>();
    }

    [Table("GuestCartItems")]
    public class GuestCartItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid SessionId { get; set; }

        [ForeignKey("SessionId")]
        public virtual GuestCartSession Session { get; set; } = null!;

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

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}
