namespace BackendAPI.Models
{
    public class CheckoutRequestDto
    {
        public string ItemType { get; set; } = "Membership"; // Membership, SheetMusic
        public int ItemId { get; set; } = 1;
        public string CountryCode { get; set; } = "ID";
        public string Currency { get; set; } = "IDR";
    }

    public class CheckoutResponseDto
    {
        public string OrderNumber { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "IDR";
        public string GatewayName { get; set; } = "Midtrans";
        public string CheckoutUrlOrToken { get; set; } = string.Empty;
    }

    public class MidtransNotificationDto
    {
        public string order_id { get; set; } = string.Empty;
        public string status_code { get; set; } = string.Empty;
        public string gross_amount { get; set; } = string.Empty;
        public string signature_key { get; set; } = string.Empty;
        public string transaction_status { get; set; } = string.Empty; // settlement, pending, expire, deny
        public string payment_type { get; set; } = string.Empty;
    }
}
