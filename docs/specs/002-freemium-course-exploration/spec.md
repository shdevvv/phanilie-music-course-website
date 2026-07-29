# Feature Specification: SPEC-002 Freemium Course Exploration & Paywall Guard

**Module Directory**: `docs/specs/002-freemium-course-exploration`  
**Status**: Approved Specification  
**Target Workflow**: `/speckit.specify`  

---

## 1. Feature Overview & Core Purpose

### 1.1 Overview
The **Freemium Course Exploration & Paywall Guard** module powers the platform's primary conversion engine. It allows unauthenticated visitors and free registered students to explore the full curriculum hierarchy (Levels, Topics, Lesson metadata) while strictly securing video streaming and PDF downloads behind active membership subscription tiers.

### 1.2 Core Purpose
* Eliminate friction for potential subscribers by allowing transparent inspection of course depth and lesson quality.
* Secure premium instructional video assets and downloadable PDF sheet music scores against unauthorized access.

---

## 2. Target Audience & Problem Statement

### 2.1 Target Audience
* **Visitors & Free Students**: Evaluating course content structure before upgrading.
* **Active Subscribers**: Consuming full video lessons and downloading course PDFs.

### 2.2 Core Problem Statement
* Rigid paywalls that block all course visibility discourage potential students from enrolling.
* Weak paywall security allows non-subscribers to scrape video URLs or download lesson PDFs directly.

---

## 3. Functional Requirements

### 3.1 Freemium Curriculum Exploration Requirements
* **FR-002-1**: The system MUST allow public browsing of the entire course tree (`GET /api/courses`):
  * **Level Hierarchy**: Beginner, Intermediate, Advanced.
  * **Topic Groupings**: Music Theory, Sight Reading, Classical Masterpieces, Contemporary Jazz.
  * **Lesson Metadata**: Title, Description, Duration, Prerequisites, Learning Objectives.

### 3.2 Paywall Security Guard Requirements
* **FR-002-2**: Streaming lesson videos or downloading lesson PDFs MUST require an active subscription (`Subscriber` or `Admin` role).
* **FR-002-3**: Requests to restricted media endpoints from non-subscribers MUST return an HTTP `403 Forbidden` response containing a payload indicating membership requirements.
* **FR-002-4**: Active Subscribers MUST receive signed, temporary streaming URLs or byte streams.

---

## 4. User Experience & Interaction Guidelines

### 4.1 Paywall Modal UX
* Clicking a locked lesson video MUST NOT produce raw browser errors.
* The frontend MUST intercept `403 Forbidden` responses and render a visually striking `PaywallUpgradeModal` showcasing plan benefits (`Monthly`, `Quarterly`, `Annual`) with instant regional checkout CTAs.
