# Phanilie Music Platform - Deployment & Quickstart Guide

Welcome to the **Phanilie Music & Learning Platform** deployment guide. This repository contains the complete full-stack code for the hybrid EdTech and E-Commerce music platform.

---

## 🚀 Quickstart Local Running

### 1. Run Backend API (.NET 10)
```bash
cd backend
dotnet run --urls "http://localhost:5013"
```
* Swagger UI: `http://localhost:5013/swagger`
* Health Check: `http://localhost:5013/health`

### 2. Run Frontend Web UI (React + Vite)
```bash
cd frontend
npm run dev
```
* Web App URL: `http://localhost:5173`

---

## 🐳 Docker Deployment (Docker Compose)

Run the entire platform (PostgreSQL Database + Backend API + Frontend Nginx) with a single command:

```bash
docker-compose up --build -d
```

* Frontend Web UI: `http://localhost:80`
* Backend API: `http://localhost:5013`
* PostgreSQL Database: `localhost:5432`

---

## ☁️ Cloud Deployment Options

### Option A: Render / Railway (Recommended for Backend + DB)
1. Link your GitHub repository to **Render** or **Railway**.
2. Select **Docker** environment and point to `docker-compose.yml` or `backend/Dockerfile`.
3. Set environment variables from `.env.example`.

### Option B: Vercel / Netlify (Recommended for Frontend)
1. Import the `frontend/` directory to Vercel.
2. Set Framework Preset to **Vite**.
3. Set `VITE_API_BASE_URL` to your live Backend API URL.

---

## 🏆 Default Admin Credentials

* **Super Admin Email**: `admin@phanilie.com`
* **Super Admin Password**: `Admin@Phanilie2026!`
