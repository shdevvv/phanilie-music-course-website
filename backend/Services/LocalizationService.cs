using BackendAPI.Models;

namespace BackendAPI.Services
{
    public class LocalizationService : ILocalizationService
    {
        public string DetectCurrency(string? countryCode)
        {
            var code = (countryCode ?? "ID").Trim().ToUpperInvariant();
            return code == "ID" || code == "INDONESIA" ? "IDR" : "USD";
        }

        public string DetectGateway(string currency)
        {
            return currency.ToUpperInvariant() == "IDR" ? "Midtrans" : "Stripe";
        }

        public GeoLocationDto ResolveCountryFromIp(string? ipAddress, string? userAgent)
        {
            // Geo-IP inspection rule: Default to Indonesia (ID / IDR) unless IP indicates international header
            if (string.IsNullOrWhiteSpace(ipAddress) || ipAddress.StartsWith("127.0.0.1") || ipAddress.StartsWith("::1") || ipAddress.StartsWith("10.") || ipAddress.StartsWith("192.168."))
            {
                return new GeoLocationDto { CountryCode = "ID", CountryName = "Indonesia", Currency = "IDR" };
            }

            // International Geo-IP fallback simulation
            return new GeoLocationDto { CountryCode = "US", CountryName = "United States", Currency = "USD" };
        }
    }
}
