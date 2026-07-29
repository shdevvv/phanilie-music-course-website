# Feature Specification: SPEC-000 Core Database Infrastructure & Initial Data Seeding

**Module Directory**: `docs/specs/000-core-database-infrastructure`  
**Status**: Approved Specification  
**Target Process**: `/speckit.specify`  

---

## 1. Feature Overview & Core Purpose

### 1.1 Overview
The **Core Database Infrastructure & Initial Data Seeding** module establishes the relational data persistence foundation for the Phanilie Music Platform. It guarantees that upon backend API deployment, all entity schemas are automatically provisioned and pre-populated with essential baseline data—including the Super Admin account, default Membership Plans, and baseline Achievement Badges.

### 1.2 Core Purpose
* Provide zero-downtime, automated schema migrations.
* Eliminate manual database setup procedures across development, staging, and production environments.
* Ensure a functional administrative account and default pricing tiers exist out of the box.

---

## 2. Target Audience & Problem Statement

### 2.1 Target Audience
* **Platform Administrators**: Rely on pre-provisioned Super Admin accounts for immediate system access.
* **System Engineers & CI/CD Pipelines**: Benefit from automated schema application during deployment cycles.

### 2.2 Core Problem Statement
Without automated database initialization and data seeding:
1. Environment provisioning requires manual SQL script execution, risking schema drift and human error.
2. Initial deployment lacks administrative credentials, locking managers out of content management.
3. Pricing plans and achievement badges must be manually inserted before the platform can accept users or track student progress.

---

## 3. Functional Requirements

### 3.1 Schema Migration Requirements
* **FR-000-1**: The system MUST automatically detect and apply pending database migrations upon API startup.
* **FR-000-2**: If the database does not exist, the system MUST create the database schema automatically.

### 3.2 Super Admin Seeding Requirements
* **FR-000-3**: The system MUST inspect the database for administrative accounts during initialization.
* **FR-000-4**: If no administrative account is found, the system MUST seed a Super Admin user:
  * **Email**: `admin@phanilie.com`
  * **Full Name**: `Phanilie Super Admin`
  * **Role**: `Admin`
  * **Status**: `Active`

### 3.3 Membership Plan Seeding Requirements
* **FR-000-5**: The system MUST seed default Membership Plans with dual-currency pricing if the plans table is empty:
  * **Monthly Plan**: 1 Month duration, IDR 149,000 / USD 9.99
  * **Quarterly Plan**: 3 Months duration, IDR 399,000 / USD 26.99 (Save 10%)
  * **Annual Plan**: 12 Months duration, IDR 1,299,000 / USD 89.99 (Best Value - Save 27%)

### 3.4 Achievement Badge Seeding Requirements
* **FR-000-6**: The system MUST seed default Achievement Badges if the badges table is empty:
  * **Badge 1**: `First Song Mastered` (Completed 1 lesson)
  * **Badge 2**: `Dedicated Learner` (Completed 5 lessons)
  * **Badge 3**: `Practice Enthusiast` (Logged 100 total practice minutes)
  * **Badge 4**: `Weekly Warrior` (Logged 5 consecutive days of practice)

---

## 4. User Experience & System Interaction Guidelines

### 4.1 System Behavior & Failure Handling
* **Silent Execution**: Initialization MUST execute during startup before HTTP requests are accepted.
* **Error Termination**: If migration or seeding fails, the API MUST log an error and terminate safely to prevent partial data corruption.
