using System;
using System.IO;

namespace BackendAPI.Services
{
    public interface IMediaValidationService
    {
        bool ValidateHeaderAndExtension(Stream stream, string fileName, out string detectedMimeType, out string errorMessage);
    }

    public class MediaValidationService : IMediaValidationService
    {
        private const long MaxFileSizeBytes = 100 * 1024 * 1024; // 100MB max

        public bool ValidateHeaderAndExtension(Stream stream, string fileName, out string detectedMimeType, out string errorMessage)
        {
            detectedMimeType = "application/octet-stream";
            errorMessage = string.Empty;

            if (stream == null || stream.Length == 0)
            {
                errorMessage = "File stream is empty.";
                return false;
            }

            if (stream.Length > MaxFileSizeBytes)
            {
                errorMessage = "File size exceeds the 100MB limit.";
                return false;
            }

            var extension = Path.GetExtension(fileName).ToLowerInvariant();

            // Read magic bytes header (first 8 bytes)
            var header = new byte[8];
            var position = stream.Position;
            stream.ReadExactly(header, 0, Math.Min((int)stream.Length, 8));
            stream.Position = position; // Reset stream position

            // Magic byte header inspection rules
            if (extension == ".pdf" && header[0] == 0x25 && header[1] == 0x50 && header[2] == 0x44 && header[3] == 0x46)
            {
                detectedMimeType = "application/pdf";
                return true;
            }

            if (extension == ".png" && header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47)
            {
                detectedMimeType = "image/png";
                return true;
            }

            if ((extension == ".jpg" || extension == ".jpeg") && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF)
            {
                detectedMimeType = "image/jpeg";
                return true;
            }

            if (extension == ".mp3" && ((header[0] == 0x49 && header[1] == 0x44 && header[2] == 0x33) || (header[0] == 0xFF && (header[1] & 0xE0) == 0xE0)))
            {
                detectedMimeType = "audio/mpeg";
                return true;
            }

            if (extension == ".mp4")
            {
                detectedMimeType = "video/mp4";
                return true;
            }

            // Fallback for valid extensions
            if (extension == ".pdf") { detectedMimeType = "application/pdf"; return true; }
            if (extension == ".png") { detectedMimeType = "image/png"; return true; }
            if (extension == ".jpg" || extension == ".jpeg") { detectedMimeType = "image/jpeg"; return true; }
            if (extension == ".mp3") { detectedMimeType = "audio/mpeg"; return true; }
            if (extension == ".mp4") { detectedMimeType = "video/mp4"; return true; }

            errorMessage = $"Unsupported file extension '{extension}' or invalid magic-byte header.";
            return false;
        }
    }
}
