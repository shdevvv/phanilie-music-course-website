using System;
using System.IO;
using System.Threading.Tasks;
using BackendAPI.Data;
using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IStorageService _storageService;
        private readonly IMediaValidationService _validationService;
        private readonly IMediaTokenService _tokenService;

        public MediaController(
            AppDbContext db,
            IStorageService storageService,
            IMediaValidationService validationService,
            IMediaTokenService tokenService)
        {
            _db = db;
            _storageService = storageService;
            _validationService = validationService;
            _tokenService = tokenService;
        }

        [HttpPost("upload")]
        [RequestSizeLimit(104_857_600)] // 100MB max
        public async Task<IActionResult> UploadMedia([FromForm] IFormFile file, [FromForm] string? entityType, [FromForm] int? entityId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file was uploaded.");

            using var stream = file.OpenReadStream();
            if (!_validationService.ValidateHeaderAndExtension(stream, file.FileName, out var mimeType, out var errorMsg))
            {
                return BadRequest(errorMsg);
            }

            var storagePath = await _storageService.SaveFileAsync(stream, file.FileName, mimeType);

            var mediaRecord = new StoredMediaFile
            {
                OriginalFileName = file.FileName,
                StoragePath = storagePath,
                MimeType = mimeType,
                FileSizeBytes = file.Length,
                StorageProvider = _storageService.ProviderName,
                AttachedEntityType = entityType,
                AttachedEntityId = entityId,
                IsOrphaned = !(entityId.HasValue && entityId > 0 && !string.IsNullOrEmpty(entityType)),
                CreatedAt = DateTime.UtcNow
            };

            _db.StoredMediaFiles.Add(mediaRecord);
            await _db.SaveChangesAsync();

            var response = new MediaFileResponseDto
            {
                FileId = mediaRecord.FileId,
                OriginalFileName = mediaRecord.OriginalFileName,
                PublicUrl = _storageService.GetPublicUrl(storagePath),
                MimeType = mediaRecord.MimeType,
                FileSizeBytes = mediaRecord.FileSizeBytes,
                StorageProvider = mediaRecord.StorageProvider,
                CreatedAt = mediaRecord.CreatedAt
            };

            return Ok(response);
        }

        [HttpGet("token/{fileId:guid}")]
        public async Task<IActionResult> GetSignedToken(Guid fileId)
        {
            var media = await _db.StoredMediaFiles.FirstOrDefaultAsync(f => f.FileId == fileId);
            if (media == null) return NotFound("Media file not found.");

            var token = _tokenService.GenerateSignedToken(fileId, TimeSpan.FromMinutes(5));
            var response = new SignedTokenResponseDto
            {
                FileId = fileId,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                StreamUrl = $"/api/media/stream/{media.StoragePath}?token={token}"
            };

            return Ok(response);
        }

        [HttpPost("attach")]
        public async Task<IActionResult> AttachMedia([FromBody] AttachMediaDto dto)
        {
            var media = await _db.StoredMediaFiles.FirstOrDefaultAsync(f => f.FileId == dto.FileId);
            if (media == null) return NotFound("Media file not found.");

            media.AttachedEntityType = dto.EntityType;
            media.AttachedEntityId = dto.EntityId;
            media.IsOrphaned = false;

            await _db.SaveChangesAsync();
            return Ok(new { success = true, message = "Media attached successfully." });
        }

        [HttpGet("stream/{*storagePath}")]
        public async Task<IActionResult> StreamMedia(string storagePath, [FromQuery] string? token)
        {
            var fileStream = await _storageService.GetFileStreamAsync(storagePath);
            if (fileStream == null) return NotFound("Requested media asset not found.");

            var ext = Path.GetExtension(storagePath).ToLowerInvariant();
            var contentType = ext switch
            {
                ".pdf" => "application/pdf",
                ".mp3" => "audio/mpeg",
                ".mp4" => "video/mp4",
                ".png" => "image/png",
                ".jpg" or ".jpeg" => "image/jpeg",
                _ => "application/octet-stream"
            };

            // Range-supported media streaming result (HTTP 206 Partial Content support)
            return File(fileStream, contentType, enableRangeProcessing: true);
        }
    }
}
