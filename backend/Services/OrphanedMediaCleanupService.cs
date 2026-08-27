using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BackendAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace BackendAPI.Services
{
    public class OrphanedMediaCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<OrphanedMediaCleanupService> _logger;

        public OrphanedMediaCleanupService(IServiceProvider serviceProvider, ILogger<OrphanedMediaCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Orphaned Media Cleanup Background Service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CleanupOrphanedFilesAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred during orphaned media cleanup.");
                }

                // Run every 24 hours
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }

        private async Task CleanupOrphanedFilesAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var storageService = scope.ServiceProvider.GetRequiredService<IStorageService>();

            var cutoffTime = DateTime.UtcNow.AddHours(-24);
            var orphanedFiles = await db.StoredMediaFiles
                .Where(f => f.IsOrphaned && f.CreatedAt < cutoffTime)
                .ToListAsync();

            if (orphanedFiles.Any())
            {
                _logger.LogInformation("Found {Count} orphaned media files to cleanup.", orphanedFiles.Count);

                foreach (var file in orphanedFiles)
                {
                    await storageService.DeleteFileAsync(file.StoragePath);
                    db.StoredMediaFiles.Remove(file);
                }

                await db.SaveChangesAsync();
                _logger.LogInformation("Orphaned media cleanup completed successfully.");
            }
        }
    }
}
