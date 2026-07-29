using System;
using System.Collections.Generic;

namespace BackendAPI.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = Guid.NewGuid().ToString("N");
        public int UserId { get; set; }
        public User? User { get; set; }
        public string ItemType { get; set; } = "SheetMusic"; // SheetMusic, MembershipPlan
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = "IDR";
        public string PaymentGateway { get; set; } = "Midtrans"; // Midtrans, Stripe
        public string PaymentStatus { get; set; } = "Pending"; // Pending, Paid, Failed, Expired
        public string TransactionId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order? Order { get; set; }
        public int? SheetMusicId { get; set; }
        public SheetMusic? SheetMusic { get; set; }
        public int? MembershipPlanId { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
    }

    public class UserLibrary
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int SheetMusicId { get; set; }
        public SheetMusic? SheetMusic { get; set; }
        public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;
    }
}
