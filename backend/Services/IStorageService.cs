using System;
using System.IO;
using System.Threading.Tasks;

namespace BackendAPI.Services
{
    public interface IStorageService
    {
        string ProviderName { get; }
        Task<string> SaveFileAsync(Stream fileStream, string fileName, string mimeType);
        Task<Stream?> GetFileStreamAsync(string storagePath);
        Task<bool> DeleteFileAsync(string storagePath);
        string GetPublicUrl(string storagePath);
    }
}
