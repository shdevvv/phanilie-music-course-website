using System.Security.Cryptography;
using System.Text;
using BackendAPI.Data;
using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILocalizationService _localizationService;
        private readonly IConfiguration _configuration;

        public PaymentController(AppDbContext context, ILocalizationService localizationService, IConfiguration configuration)
        {
            _context = context;
            _localizationService = localizationService;
            _configuration = configuration;
        }

        [HttpPost("checkout")]
        public async Task<ActionResult<CheckoutResponseDto>> InitiateCheckout([FromBody] CheckoutRequestDto request)
        {
            var currency = _localizationService.DetectCurrency(request.CountryCode);
            var gatewayName = _localizationService.DetectGateway(currency);

            decimal amount = currency == "IDR" ? 149000 : 9.99m;

            var order = new Order
            {
                UserId = 1, // Demo user ID
                OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}",
                TotalAmount = amount,
                Currency = currency,
                PaymentGateway = gatewayName,
                PaymentStatus = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var checkoutUrlOrToken = gatewayName == "Midtrans"
                ? $"snap-token-{Guid.NewGuid():N}"
                : $"https://checkout.stripe.com/c/pay/cs_test_{Guid.NewGuid():N}";

            return Ok(new CheckoutResponseDto
            {
                OrderNumber = order.OrderNumber,
                Amount = amount,
                Currency = currency,
                GatewayName = gatewayName,
                CheckoutUrlOrToken = checkoutUrlOrToken
            });
        }

        [HttpPost("midtrans-webhook")]
        public async Task<IActionResult> MidtransWebhook([FromBody] MidtransNotificationDto notification)
        {
            var serverKey = _configuration["Midtrans:ServerKey"] ?? "SB-Mid-server-default-key-12345";
            
            // Validate SHA-512 Signature Key if serverKey is provided and not default
            if (!string.IsNullOrEmpty(notification.signature_key) && serverKey != "SB-Mid-server-default-key-12345")
            {
                var rawString = $"{notification.order_id}{notification.status_code}{notification.gross_amount}{serverKey}";
                using var sha512 = SHA512.Create();
                var hashBytes = sha512.ComputeHash(Encoding.UTF8.GetBytes(rawString));
                var expectedSignature = Convert.ToHexString(hashBytes).ToLower();

                if (!string.Equals(expectedSignature, notification.signature_key, StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest(new { error = "Invalid Midtrans Webhook Signature" });
                }
            }

            if (notification.transaction_status == "settlement" || notification.transaction_status == "capture")
            {
                await FulfillOrderAsync(notification.order_id);
            }

            return Ok(new { status = "OK", message = "Midtrans notification processed" });
        }

        [HttpPost("stripe-webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            using var reader = new StreamReader(Request.Body);
            var json = await reader.ReadToEndAsync();
            
            // Fulfill stripe order if JSON contains order number
            if (json.Contains("order_id") || json.Contains("ORD-"))
            {
                var orderIdMatch = System.Text.RegularExpressions.Regex.Match(json, @"ORD-\d{8}-\d{4}");
                if (orderIdMatch.Success)
                {
                    await FulfillOrderAsync(orderIdMatch.Value);
                }
            }

            return Ok(new { status = "OK", message = "Stripe webhook processed" });
        }

        [HttpPost("simulate-payment-success")]
        public async Task<IActionResult> SimulatePaymentSuccess([FromQuery] string orderNumber)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
            if (order == null)
            {
                // Create a simulated order if not found
                order = new Order
                {
                    UserId = 1,
                    OrderNumber = string.IsNullOrEmpty(orderNumber) ? $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}" : orderNumber,
                    TotalAmount = 149000,
                    Currency = "IDR",
                    PaymentGateway = "Midtrans",
                    PaymentStatus = "Pending",
                    CreatedAt = DateTime.UtcNow
                };
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
            }

            await FulfillOrderAsync(order.OrderNumber);

            return Ok(new
            {
                status = "Success",
                orderNumber = order.OrderNumber,
                paymentStatus = order.PaymentStatus,
                message = "Payment successfully simulated and order fulfilled!"
            });
        }

        private async Task FulfillOrderAsync(string orderId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderNumber == orderId);
            if (order != null)
            {
                order.PaymentStatus = "Paid";

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == order.UserId);
                if (user != null)
                {
                    user.IsSubscribed = true;
                    user.SubscriptionExpiresAt = DateTime.UtcNow.AddDays(30);
                }

                await _context.SaveChangesAsync();
            }
        }
    }
}
