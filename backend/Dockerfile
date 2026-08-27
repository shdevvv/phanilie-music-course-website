# Multi-stage Dockerfile for ASP.NET Core Web API (.NET 10)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["BackendAPI.csproj", "./"]
RUN dotnet restore "BackendAPI.csproj"

# Copy full source and build release binary
COPY . .
RUN dotnet build "BackendAPI.csproj" -c Release -o /app/build
RUN dotnet publish "BackendAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Production Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 5013
ENV ASPNETCORE_URLS=http://+:5013
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=publish /app/publish .

# Ensure uploads directory exists
RUN mkdir -p /app/uploads

ENTRYPOINT ["dotnet", "BackendAPI.dll"]
