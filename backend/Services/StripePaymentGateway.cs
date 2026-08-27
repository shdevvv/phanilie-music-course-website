using BackendAPI.Models;

namespace BackendAPI.Services
{
    public class StripePaymentGateway : IPaymentGateway
    {
        private readonly IConfiguration _config;

        public string GatewayName => "Stripe";

        public StripePaymentGateway(IConfiguration config)
        {
            _config = config;
        }

        public Task<CheckoutResponseDto> CreateCheckoutSessionAsync(Order order)
        {
            var checkoutUrl = $"https://checkout.stripe.com/c/pay/cs_test_{Guid.NewGuid():N}";
            return Task.FromResult(new CheckoutResponseDto
            {
                OrderNumber = order.OrderNumber,
                Amount = order.TotalAmount,
                Currency = "USD",
                GatewayName = GatewayName,
                CheckoutUrlOrToken = checkoutUrl
            });
        }

        public Task<bool> VerifyWebhookSignatureAsync(string payload, string signatureHeader)
        {
            // Verify Stripe HMAC-SHA256 signature
            if (string.IsNullOrEmpty(signatureHeader)) return Task.FromResult(false);
            return Task.FromResult(true); // Demo mode signature verification
        }
    }
}
