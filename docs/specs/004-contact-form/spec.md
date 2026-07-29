# Feature Specification: SPEC-004 Contact Form

**Module Directory**: `docs/specs/004-contact-form`  
**Status**: Approved Specification  

## 1. Feature Overview & Core Purpose
The **Contact Form** module provides a secure public communication channel in the site footer for visitors and students to submit support requests, business inquiries, and feedback.

## 2. Target Audience & Problem Statement
* **Audience**: Public Visitors, Registered Students.
* **Problem Solved**: Solves visitor communication friction by delivering instant confirmation auto-replies while logging inquiry records for administrative review.

## 3. Functional Requirements
* **FR-004-1**: The site footer MUST provide a public contact form requiring Name, Email, Subject, and Message.
* **FR-004-2**: Submissions MUST be validated on both client and server sides.
* **FR-004-3**: Valid submissions MUST save a record to the database and trigger an automated confirmation email to the sender.
* **FR-004-4**: Endpoint MUST enforce IP-based rate limiting (max 3 submissions per 10 minutes) to prevent bot spam.

## 4. User Experience Guidelines
* Inline form validation, clear success/error toasts, and auto-clearing inputs upon successful submission.
