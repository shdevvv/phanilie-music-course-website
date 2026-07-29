# Technical Implementation Plan: SPEC-011 Auth & Country Localization

**Module Directory**: `docs/specs/011-auth-and-country-localization`  
**Status**: Approved Technical Plan  
**Target Workflow**: `/speckit.plan`  

---

## 1. Selected Tech Stack & Architecture Choices
* **Backend**: ASP.NET Core 10 Web API (`AuthController.cs`, `AuthService.cs`).
* **Libraries**: `BCrypt.Net-Next`, `System.IdentityModel.Tokens.Jwt`.
* **Geo-IP**: Cloudflare / MaxMind Geo-IP header inspection.

## 2. Codebase Architecture & Folder Structure
```text
backend/
├── Controllers/AuthController.cs
├── Services/Implementations/AuthService.cs
├── Models/User.cs
frontend/
├── src/context/AuthContext.jsx
├── src/components/auth/AuthModal.jsx
```

## 3. Implementation Roadmap
1. Create `User` model with JWT & Geo-IP properties.
2. Build `AuthService` JWT token generator & BCrypt hasher.
3. Build `AuthController` endpoints.
4. Build `AuthContext` and `AuthModal` in React.
