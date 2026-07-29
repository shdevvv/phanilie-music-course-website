# Master Feature Specification: Phanilie Music & Learning Platform

**Document**: Master Feature Specification (`spec.md`)  
**Scope**: Enterprise-Wide Product & Functional Architecture  
**Status**: Approved Specification  
**Target Workflow**: `/speckit.specify`  

---

## 1. Executive Summary & Strategic Purpose

### 1.1 Executive Summary
**Phanilie Music Platform** is a premier digital music education ecosystem and sheet music e-commerce platform. It combines structured, self-paced video curriculum, interactive student practice management, exclusive live masterclass sessions, and a digital sheet music store protected by dynamic buyer watermarking.

The platform is designed from the ground up for global reach, operating a dual-currency localization architecture (IDR for Indonesia and USD for International markets) and dual payment gateway integrations (Midtrans for local Indonesian rails and Stripe for global card/PayPal processing).

### 1.2 Core Business Value & Problem Matrix

| Strategic Challenge | Core Platform Solution | Value Created |
| :--- | :--- | :--- |
| **Digital Sheet Music Piracy** | **Dynamic Buyer Watermarking Engine**: Automatically stamps buyer identity (*Full Name & Email*) onto every page footer of downloaded PDF sheet music scores. | Prevents unauthorized file sharing; protects composer IP and platform revenue. |
| **Cross-Border Payment Friction** | **Dual-Currency & Adaptive Gateway Routing**: Geo-IP detection routes Indonesian buyers to local QRIS/VA rails via Midtrans and global buyers to USD Card/PayPal rails via Stripe. | Eliminates checkout abandonments caused by payment incompatibility. |
| **Low Student Retention** | **Gamified Student Learning Board**: Tracks weekly practice intensity, overall course progress %, to-do items, and milestone achievement badges. | Increases student lifetime value (LTV) and course completion rates. |
| **Pre-Purchase Friction** | **Freemium Curriculum Exploration & Audio Preview**: Open curriculum metadata structure paired with 30-second audio/MIDI preview players for sheet music. | Reduces buyer hesitation by providing transparent quality evaluation. |

---

## 2. Target Audience Personas & User Journeys

### 2.1 Target Audience Personas

1. **Guest Visitor (Unauthenticated)**
   * *Behavior*: Browsing catalog, evaluating course structures, testing 30-second sheet music previews, submitting contact inquiries.
   * *Goals*: Discover quality arrangements, preview course topics, determine subscription value proposition.

2. **Registered Free Student (Authenticated)**
   * *Behavior*: Managing personal practice goals, tracking to-do items, purchasing individual sheet music scores, accessing digital library.
   * *Goals*: Organize personal piano practice, build a personal digital sheet music library.

3. **Active Subscriber (Paid Tier - Monthly / Quarterly / Annual)**
   * *Behavior*: Streaming lesson videos, downloading lesson PDFs, attending live masterclasses, earning achievement badges.
   * *Goals*: Master piano playing, participate in masterclasses, track long-term skill acquisition.

4. **Platform Administrator**
   * *Behavior*: Managing curriculum hierarchy (Levels, Topics, Lessons), uploading media assets, reviewing transactions, responding to support inquiries.
   * *Goals*: Operational control, content management, financial oversight, customer support.

---

## 3. Comprehensive Functional Requirements

### 3.1 Module 000: Core System Infrastructure & Initialization
* **FR-000-1**: The system MUST automatically execute pending database schema migrations on API launch.
* **FR-000-2**: The system MUST auto-seed a baseline Super Admin account (`admin@phanilie.com`) if no administrative account exists.
* **FR-000-3**: The system MUST auto-seed baseline Membership Plans (`Monthly`, `Quarterly`, `Annual`) with dual-currency pricing (`Price_IDR` & `Price_USD`).
* **FR-000-4**: The system MUST auto-seed initial system Achievement Badges (`First Song Mastered`, `5-Day Practice Streak`, `100 Minutes Practice`).

### 3.2 Module 001: Global Search Bar
* **FR-001-1**: The search input MUST be accessible from the global top navbar on every page.
* **FR-001-2**: Search queries MUST perform real-time, case-insensitive partial matching across Lesson titles, Performance Covers, and Sheet Music titles.
* **FR-001-3**: Search results MUST be grouped by content category (Lessons, Covers, Sheet Music) with thumbnail previews, content type badges, and direct navigation links.
* **FR-001-4**: Results MUST be paginated and capped at a maximum of 20 items per category to guarantee sub-200ms rendering.

### 3.3 Module 002: Freemium Course Exploration & Paywall Security
* **FR-002-1**: Unauthenticated visitors MUST be allowed to navigate the entire curriculum tree (Course Levels, Topics, Lesson titles, descriptions, and duration metadata).
* **FR-002-2**: The system MUST strictly block unauthenticated users and non-subscriber students from streaming lesson videos or downloading lesson sheet music PDFs.
* **FR-002-3**: Attempting to access restricted media without an active subscription MUST return an authorization restriction signal (`403 Forbidden`).
* **FR-002-4**: Active Subscribers and Administrators MUST be granted full, unrestricted streaming and download permissions.

### 3.4 Module 003: Multi-Currency Pricing & Payment Gateways
* **FR-003-1**: All e-commerce items (Sheet Music & Subscriptions) MUST store dual-currency pricing (`Price_IDR` and `Price_USD`).
* **FR-003-2**: Indonesian transactions MUST issue Midtrans SNAP transactions supporting QRIS, Bank Virtual Accounts (BCA, Mandiri, BNI, BRI), and E-Wallets (GoPay, ShopeePay).
* **FR-003-3**: International transactions MUST issue Stripe Checkout Sessions supporting Credit Cards, Debit Cards, and PayPal.
* **FR-003-4**: Upon receiving verified webhook payment notifications, the system MUST mark orders as `Paid` and automatically unlock purchased items in the user's library.

### 3.5 Module 004: Contact Form & Visitor Communication
* **FR-004-1**: The site footer MUST provide a public contact form requiring Name, Email, Subject, and Message.
* **FR-004-2**: Submissions MUST be validated, stored in the database, and trigger an automated confirmation email to the visitor.
* **FR-004-3**: The endpoint MUST enforce strict rate limiting (max 3 submissions per IP per 10 minutes) to prevent spam.

### 3.6 Module 005: Newsletter Subscription
* **FR-005-1**: Visitors MUST be able to subscribe to newsletter updates by submitting their email address.
* **FR-005-2**: Duplicate subscriptions MUST be handled gracefully without displaying errors.
* **FR-005-3**: All outgoing newsletter emails MUST include a unique, secure one-click unsubscribe token link allowing recipients to opt out immediately.

### 3.7 Module 006: Student Learning Board & Gamification
* **FR-006-1**: The system MUST calculate overall course completion percentage and weekly practice duration in minutes.
* **FR-006-2**: The system MUST provide Full CRUD functionality for students to manage personal learning To-Do items.
* **FR-006-3**: The system MUST automatically evaluate milestone thresholds (e.g., completing 5 lessons, logging 100 practice minutes) and unlock achievement badges in real time.
* **FR-006-4**: Unlocking a badge MUST trigger a celebratory modal notification.

### 3.8 Module 007: Covers & Sheet Music Catalog
* **FR-007-1**: The system MUST display a searchable catalog of Sheet Music and Performance Cover videos.
* **FR-007-2**: Sheet music detail cards MUST include an inline 30-second audio/MIDI preview player.
* **FR-007-3**: Items MUST support filtering by difficulty level (Beginner, Intermediate, Advanced), genre, and instrument type.

### 3.9 Module 008: My Library & Dynamic PDF Watermarking
* **FR-008-1**: The system MUST provide a "My Library" dashboard listing all purchased sheet music titles.
* **FR-008-2**: Downloading a sheet music PDF MUST dynamically stamp a permanent footer watermark on every page:  
  `"Purchased by: [User Name] ([User Email]) on Phanilie Music Platform"`.
* **FR-008-3**: Media asset download links MUST use short-lived temporary access tokens (expires in 5 minutes).

### 3.10 Module 009: Live Masterclass & Video Archives
* **FR-009-1**: Active subscribers MUST be provided access to upcoming live masterclass streaming links and event schedules.
* **FR-009-2**: Past masterclass sessions MUST be archived and made available for on-demand video streaming to active subscribers.

### 3.11 Module 010: Shopping Cart & Guest Sync
* **FR-010-1**: Visitors and registered students MUST be able to add, update, and remove sheet music items in a shopping cart.
* **FR-010-2**: Upon user login or registration, local guest cart items MUST automatically merge into the user's backend database cart.

### 3.12 Module 011: Auth & Country Localization
* **FR-011-1**: The system MUST support user registration, login, refresh token rotation, and password recovery.
* **FR-011-2**: Passwords MUST be securely hashed prior to storage.
* **FR-011-3**: User geographic region MUST be detected during auth/onboarding and assigned currency claim (`IDR` if country code is `ID`, otherwise `USD`).

### 3.13 Module 012: Admin Control Panel & Full CRUD
* **FR-012-1**: Endpoints in the Admin module MUST be restricted strictly to users with the `Admin` role.
* **FR-012-2**: Admins MUST have Full CRUD capabilities across Courses, Levels, Topics, Lessons, Sheet Music, Cover Videos, Orders, Contact Messages, and Subscribers.

### 3.14 Module 013: Media File Storage Service
* **FR-013-1**: The system MUST manage secure storage and retrieval of digital media assets (PDF scores, MP3 audio previews, thumbnail images, and MP4 lesson videos).
* **FR-013-2**: File uploads MUST enforce size limits and strict extension/MIME validation.

---

## 4. User Experience & Design Guidelines

### 4.1 Visual Hierarchy & Design Tokens
* **Theme**: Modern dark-mode aesthetic with rich gold/amber accents (`#D4AF37`), sleek glassmorphism panels (`backdrop-filter: blur(12px)`), and premium typography.
* **Layout Consistency**: Uniform navbar header, responsive container grids, and standardized modal overlays across all breakpoints.

### 4.2 Interaction Rules & Edge Handling
* **Paywall Trigger**: Non-subscribers attempting to access locked content MUST receive a smooth overlay modal featuring plan comparisons and immediate checkout CTAs.
* **Badge Celebration**: Milestone completion MUST trigger a celebratory modal with badge artwork and social share options.
* **Cart Sync**: Merging guest cart items MUST preserve existing items without creating duplicates.
