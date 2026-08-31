using System.IO;
using Microsoft.EntityFrameworkCore;
using BackendAPI.Data;
using BackendAPI.Services;

// Automatically load .env if present
var currentDir = Directory.GetCurrentDirectory();
var envPath = Path.Combine(currentDir, ".env");
if (!File.Exists(envPath))
{
    envPath = Path.Combine(Directory.GetParent(currentDir)?.FullName ?? "", ".env");
}
if (File.Exists(envPath))
{
    foreach (var line in File.ReadAllLines(envPath))
    {
        var trimmed = line.Trim();
        if (string.IsNullOrWhiteSpace(trimmed) || trimmed.StartsWith("#")) continue;
        var parts = trimmed.Split('=', 2);
        if (parts.Length == 2)
        {
            var key = parts[0].Trim();
            var val = parts[1].Trim();
            Environment.SetEnvironmentVariable(key, val);
        }
    }
}

var builder = WebApplication.CreateBuilder(args);

// Configure port if specified in environment
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddScoped<ISearchService, SearchService>();
builder.Services.AddScoped<IDbInitializer, DbInitializer>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<ILocalizationService, LocalizationService>();
builder.Services.AddScoped<ISheetMusicService, SheetMusicService>();
builder.Services.AddScoped<IPracticeLogService, PracticeLogService>();
builder.Services.AddScoped<IBadgeService, BadgeService>();
builder.Services.AddScoped<IForumService, ForumService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IMediaValidationService, MediaValidationService>();
builder.Services.AddScoped<IMediaTokenService, MediaTokenService>();
builder.Services.AddScoped<IStorageService, LocalStorageService>();
builder.Services.AddHostedService<OrphanedMediaCleanupService>();

// Configure CORS for Vite React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteFrontend",
        policy => policy.WithOrigins("http://localhost:5173", "http://localhost:8080", "http://localhost:80")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Configure EF Core with PostgreSQL (Neon) or SQLite Fallback
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connString = builder.Configuration.GetConnectionString("DefaultConnection");

    // Dynamic fallback to individual DB environment variables (e.g. from .env or cloud provider)
    var dbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? builder.Configuration["DB_HOST"];
    var dbUser = Environment.GetEnvironmentVariable("DB_USER") ?? builder.Configuration["DB_USER"];
    var dbPass = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? builder.Configuration["DB_PASSWORD"];
    var dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? builder.Configuration["DB_NAME"] ?? "neondb";
    var dbPort = Environment.GetEnvironmentVariable("DB_PORT") ?? builder.Configuration["DB_PORT"] ?? "5432";

    if (!string.IsNullOrEmpty(dbHost) && !dbHost.Contains("your_project") && !string.IsNullOrEmpty(dbUser) && !string.IsNullOrEmpty(dbPass))
    {
        connString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPass};SslMode=Require;TrustServerCertificate=true";
    }

    bool isPlaceholder = string.IsNullOrEmpty(connString) || 
                         connString.Contains("your-neon") || 
                         connString.Contains("your_project") || 
                         connString.Contains("your-password") ||
                         connString.Contains("ep-sample");

    if (!isPlaceholder && (connString.Contains("Host=") || connString.Contains("postgres")))
    {
        options.UseNpgsql(connString);
    }
    else
    {
        options.UseSqlite("Data Source=phanilie_local.db");
    }
});

var app = builder.Build();

// Run Database Initialization & Migration Scope
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbInitializer = services.GetRequiredService<IDbInitializer>();
        dbInitializer.Initialize();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogWarning(ex, "Database initialization warning: {Message}", ex.Message);
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/openapi/v1.json", "Phanilie Music API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowViteFrontend");

app.MapGet("/", () => Results.Ok(new { 
    service = "Phanilie Music Platform Web API", 
    status = "Online", 
    frontendUrl = "http://localhost:5173",
    healthUrl = "http://localhost:5013/api/health"
}));

app.MapControllers();

app.Run();
