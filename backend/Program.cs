using Microsoft.EntityFrameworkCore;
using BackendAPI.Data;
using BackendAPI.Services;

var builder = WebApplication.CreateBuilder(args);

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
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Configure EF Core with PostgreSQL (Supabase) or SQLite Fallback
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connString = builder.Configuration.GetConnectionString("DefaultConnection");
    bool isPlaceholder = string.IsNullOrEmpty(connString) || 
                         connString.Contains("your-supabase") || 
                         connString.Contains("your_project") || 
                         connString.Contains("your-password");

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
