# Quickstart Guide: Core Database Infrastructure & Initial Data Seeding

This guide details how to verify database migrations and initial seeding end-to-end.

## Prerequisites

- .NET 10 SDK
- PostgreSQL database instance running locally or via Docker connection string in `appsettings.json` / `ConnectionStrings__DefaultConnection`.

## Validation Scenarios

### Scenario 1: Clean Startup Initialization

1. Point backend connection string to a fresh PostgreSQL database instance.
2. Launch the backend API:
   ```bash
   dotnet run --project backend/BackendAPI.csproj
   ```
3. Observe console startup logs verifying migration application and seeding completion in < 3 seconds.
4. Execute health check:
   ```bash
   curl http://localhost:5000/health
   ```
5. Confirm Super Admin login with seeded credentials (`admin@phanilie.com` / `Admin@Phanilie2026!`).

### Scenario 2: Repeat Startup Idempotency

1. Restart the backend API against the populated database.
2. Confirm no duplicate records or seed errors are logged.
