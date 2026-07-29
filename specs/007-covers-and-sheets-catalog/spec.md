# Feature Specification: SPEC-007 Covers & Sheets Catalog

**Module Directory**: `docs/specs/007-covers-and-sheets-catalog`  
**Status**: Approved Specification  
**Target Workflow**: `/speckit.specify`  

---

## 1. Feature Overview & Core Purpose

### 1.1 Overview
The **Covers & Sheets Catalog** provides a public digital showcase for browsing performance cover videos and purchasing digital sheet music arrangements, equipped with 30-second audio/MIDI preview players.

### 1.2 Core Purpose
* Drive digital sheet music sales by providing transparent 30-second audio previews.
* Engage visitors with high-quality performance cover videos linked directly to purchase sheet music.

---

## 2. Functional Requirements

### 2.1 Catalog Browsing & Filter Requirements
* **FR-007-1**: The system MUST present catalog items in grid/list views with dual pricing (`Price_IDR` & `Price_USD`).
* **FR-007-2**: Users MUST be able to filter arrangements by Difficulty (Beginner, Intermediate, Advanced), Genre (Classical, Pop, Jazz, Anime), and Instrument (Piano, Violin, Vocal).

### 2.2 Audio Preview Player Requirements
* **FR-007-3**: Each sheet music detail card MUST include an inline 30-second audio/MIDI preview player.
* **FR-007-4**: Audio previews MUST stream efficiently without exposing raw backend storage paths.

---

## 3. User Experience Guidelines
Hover card elevation, interactive waveform audio player, filter chips, and instant "Add to Cart" / "Buy Now" CTA buttons.
