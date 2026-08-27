using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace BackendAPI.Services
{
    public class LocalStorageService : IStorageService
    {
        private readonly string _storageRoot;

        public LocalStorageService(IWebHostEnvironment env)
        {
            _storageRoot = Path.Combine(env.ContentRootPath, "uploads");
            if (!Directory.Exists(_storageRoot))
            {
                Directory.CreateDirectory(_storageRoot);
            }
        }

        public string ProviderName => "Local";

        public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string mimeType)
        {
            var uniqueFileName = $"{Guid.NewGuid():N}_{Path.GetFileName(fileName)}";
            var relativePath = Path.Combine(DateTime.UtcNow.ToString("yyyyMMdd"), uniqueFileName);
            var fullPath = Path.Combine(_storageRoot, relativePath);

            var dir = Path.GetDirectoryName(fullPath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            using (var destinationStream = File.Create(fullPath))
            {
                await fileStream.CopyToAsync(destinationStream);
            }

            return relativePath.Replace('\\', '/');
        }

        public Task<Stream?> GetFileStreamAsync(string storagePath)
        {
            var fullPath = Path.Combine(_storageRoot, storagePath.Replace('/', Path.DirectorySeparatorChar));
            if (!File.Exists(fullPath))
            {
                return Task.FromResult<Stream?>(null);
            }

            Stream stream = File.OpenRead(fullPath);
            return Task.FromResult<Stream?>(stream);
        }

        public Task<bool> DeleteFileAsync(string storagePath)
        {
            var fullPath = Path.Combine(_storageRoot, storagePath.Replace('/', Path.DirectorySeparatorChar));
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }

        public string GetPublicUrl(string storagePath)
        {
            return $"/api/media/stream/{storagePath}";
        }
    }
}
