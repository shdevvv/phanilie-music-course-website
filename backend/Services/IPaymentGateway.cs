using BackendAPI.Models;

namespace BackendAPI.Services
{
    public interface IPaymentGateway
    {
        string GatewayName { get; }
        Task<CheckoutResponseDto> CreateCheckoutSessionAsync(Order order);
        Task<bool> VerifyWebhookSignatureAsync(string payload, string signatureHeader);
    }
}
