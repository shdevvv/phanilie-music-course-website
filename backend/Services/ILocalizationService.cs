using BackendAPI.Models;

namespace BackendAPI.Services
{
    public interface ILocalizationService
    {
        string DetectCurrency(string? countryCode);
        string DetectGateway(string currency);
        GeoLocationDto ResolveCountryFromIp(string? ipAddress, string? userAgent);
    }
}
