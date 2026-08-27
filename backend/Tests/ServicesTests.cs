using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using BackendAPI.Data;
using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace BackendAPI.Tests
{
    public class ServicesTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        private IConfiguration GetMockConfiguration()
        {
            var inMemorySettings = new Dictionary<string, string?> {
                {"Jwt:Secret", "SuperSecretKeyForPhanilieTesting12345!"},
                {"Jwt:Issuer", "PhanilieTest"},
                {"Jwt:Audience", "PhanilieAudience"}
            };

            return new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();
        }

        [Fact]
        public async Task AuthService_Register_And_Login_Should_Succeed()
        {
            // Arrange
            using var db = GetInMemoryDbContext();
            var config = GetMockConfiguration();
            var authService = new AuthService(db, config);

            var registerDto = new RegisterDto
            {
                Name = "Test Student",
                Email = "student@phanilie.com",
                Password = "Password123!",
                CountryCode = "ID"
            };

            // Act
            var registerResult = await authService.RegisterAsync(registerDto);

            // Assert
            Assert.NotNull(registerResult);
            Assert.True(registerResult.Success);
            Assert.NotNull(registerResult.User);
            Assert.Equal("student@phanilie.com", registerResult.User.Email);
            Assert.False(string.IsNullOrEmpty(registerResult.AccessToken));

            // Test Login
            var loginDto = new LoginDto
            {
                Email = "student@phanilie.com",
                Password = "Password123!"
            };

            var loginResult = await authService.LoginAsync(loginDto);
            Assert.NotNull(loginResult);
            Assert.True(loginResult.Success);
            Assert.Equal("Test Student", loginResult.User!.Name);
        }

        [Fact]
        public void MediaValidationService_Should_Validate_PDF_And_Media_Files()
        {
            // Arrange
            var validator = new MediaValidationService();

            // PDF Magic Header %PDF
            var pdfBytes = Encoding.UTF8.GetBytes("%PDF-1.4 sample content");
            using var pdfStream = new MemoryStream(pdfBytes);

            // Act
            bool isValid = validator.ValidateHeaderAndExtension(pdfStream, "score.pdf", out string mimeType, out string error);

            // Assert
            Assert.True(isValid);
            Assert.Equal("application/pdf", mimeType);
            Assert.Empty(error);

            // Disallowed file extension test
            using var exeStream = new MemoryStream(Encoding.UTF8.GetBytes("MZ_sample_exe"));
            bool isExeValid = validator.ValidateHeaderAndExtension(exeStream, "malicious.exe", out _, out string exeError);
            Assert.False(isExeValid);
            Assert.NotEmpty(exeError);
        }

        [Fact]
        public async Task CartService_Guest_Cart_Management_Should_Work()
        {
            // Arrange
            using var db = GetInMemoryDbContext();
            var cartService = new CartService(db);
            var guestToken = Guid.NewGuid().ToString();

            // Add sample sheet music item to DB
            db.SheetMusics.Add(new SheetMusic
            {
                Id = 101,
                Title = "Amazing Grace Piano Arrangement",
                Composer = "John Newton",
                PriceIDR = 49000,
                PriceUSD = 3.99m,
                CoverImageUrl = "/covers/sheet1.png"
            });
            await db.SaveChangesAsync();

            // Act
            var cart = await cartService.AddItemToGuestCartAsync(guestToken, new AddToCartDto { MusicItemId = "101", Quantity = 1 });

            // Assert
            Assert.NotNull(cart);
            Assert.Single(cart.Items);
            Assert.Equal(49000, cart.SubtotalIDR);
            Assert.Equal("Amazing Grace Piano Arrangement", cart.Items[0].Title);
        }
    }
}
