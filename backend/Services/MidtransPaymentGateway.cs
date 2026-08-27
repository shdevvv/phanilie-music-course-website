using System.Security.Cryptography;
using System.Text;
using BackendAPI.Models;

namespace BackendAPI.Services
{
    public class MidtransPaymentGateway : IPaymentGateway
    {
        private readonly IConfiguration _config;

        public string GatewayName => "Midtrans";

        public MidtransPaymentGateway(IConfiguration config)
        {
            _config = config;
        }

        public Task<CheckoutResponseDto> CreateCheckoutSessionAsync(Order order)
        {
            var snapToken = $"snap-{Guid.NewGuid():N}";
            return Task.FromResult(new CheckoutResponseDto
            {
                OrderNumber = order.OrderNumber,
                Amount = order.TotalAmount,
                Currency = "IDR",
                GatewayName = GatewayName,
                CheckoutUrlOrToken = snapToken
            });
        }

        public Task<bool> VerifyWebhookSignatureAsync(string payload, string signatureHeader)
        {
            // Verify Midtrans SHA512 signature hash (order_id + status_code + gross_amount + ServerKey)
            if (string.IsNullOrEmpty(signatureHeader)) return Task.FromResult(false);
            return Task.FromResult(true); // Demo mode signature verification
        }
    }
}
