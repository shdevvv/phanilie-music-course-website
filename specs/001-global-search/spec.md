# Feature Specification: SPEC-001 Global Navbar Search

**Module Directory**: `docs/specs/001-global-search`  
**Status**: Approved Specification  
**Target Workflow**: `/speckit.specify`  

---

## 1. Feature Overview & Core Purpose

### 1.1 Overview
The **Global Navbar Search** feature embeds an instant, real-time search interface directly inside the top navigation bar across all pages of the Phanilie Music Platform. It enables visitors and students to search across Video Lessons, Performance Cover Videos, and Sheet Music Arrangements in a single query.

### 1.2 Core Purpose
* Minimize navigation friction for users seeking specific songs, artists, or piano tutorial topics.
* Increase catalog content discovery by surfacing related video covers and sheet music side-by-side.

---

## 2. Target Audience & Problem Statement

### 2.1 Target Audience
* **Guest Visitors**: Searching for song covers or sheet music previews.
* **Registered Students & Subscribers**: Searching for specific curriculum lessons or arrangements to practice.

### 2.2 Core Problem Statement
Traditional music platforms require users to navigate separate pages for course lessons, sheet music, and cover videos. This fragmented navigation leads to user frustration and lower engagement.

---

## 3. Functional Requirements

### 3.1 Search Query Requirements
* **FR-001-1**: The search input MUST be accessible from the top navbar on all device viewports.
* **FR-001-2**: Input queries MUST perform case-insensitive partial string matching across:
  * Lesson titles and topic descriptions.
  * Performance Cover video titles and song artist names.
  * Sheet Music arrangement titles, composer names, and genres.
* **FR-001-3**: Search execution MUST be debounced (300ms) on the client side to avoid superfluous network requests.

### 3.2 Search Result Formatting Requirements
* **FR-001-4**: Results MUST be categorized into three distinct groups: `Lessons`, `Performance Covers`, and `Sheet Music`.
* **FR-001-5**: Each result item MUST display a thumbnail image, content title, secondary metadata (e.g., Difficulty Level or Duration), and a content-type badge.
* **FR-001-6**: Results per category MUST be capped at 20 items to guarantee sub-200ms API response times.

---

## 4. User Experience & Interaction Guidelines

### 4.1 UI Component Behavior
* **Overlay Dropdown**: Typing in the search input opens a sleek glassmorphism dropdown overlay below the navbar.
* **Keyboard Navigation**: Users can navigate results using `ArrowUp` / `ArrowDown` keys and press `Enter` to select.
* **Empty State**: Searching for non-existent queries renders a friendly "No matching music content found" message with suggested search terms.
