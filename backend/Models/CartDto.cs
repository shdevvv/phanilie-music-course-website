using System;
using System.Collections.Generic;

namespace BackendAPI.Models
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public string MusicItemId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public decimal PriceIDR { get; set; }
        public decimal PriceUSD { get; set; }
        public int Quantity { get; set; }
        public bool IsPriceAdjusted { get; set; }
    }

    public class CartDto
    {
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
        public int TotalItems { get; set; }
        public decimal SubtotalIDR { get; set; }
        public decimal SubtotalUSD { get; set; }
        public string Currency { get; set; } = "IDR";
    }

    public class AddToCartDto
    {
        public string MusicItemId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public decimal PriceIDR { get; set; }
        public decimal PriceUSD { get; set; }
        public int Quantity { get; set; } = 1;
    }

    public class UpdateCartItemDto
    {
        public int Quantity { get; set; }
    }
}
