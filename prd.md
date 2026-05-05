📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)
🎯 Nama Produk

Platform Terintegrasi Penelitian dan Pengabdian Masyarakat IAIMU (ABDImu)

1. 🎯 OBJECTIVE

Membangun platform publikasi ilmiah modern yang memungkinkan:

Pengelolaan jurnal, penelitian, dan riset
Workflow review akademik (peer review)
Publikasi digital terstruktur
Pengalaman UI/UX kelas internasional
2. 🧠 PRODUCT VISION

“A modern, scalable, and intuitive academic publishing platform that rivals global systems in usability, performance, and credibility.”

Inspirasi:

Open Journal Systems
Google Scholar

3. 👥 USER ROLES
3.1 Super Admin
Full system control
Manage roles & permissions
System configuration
3.2 Admin
Approve submissions
Assign reviewers
Manage publications
3.3 Reviewer
Review submissions
Submit decisions & comments
3.4 Author (Dosen)
Submit papers
Track status
Submit revisions.

4. 🔄 CORE WORKFLOW
Author submits paper → status: pending
Admin validates → assign reviewer → under_review
Reviewer decision:
Accept → accepted
Revision → revision
Reject → rejected
Accepted → published.

5. 🧩 FEATURE REQUIREMENTS
5.1 Submission System
Upload PDF + metadata:
Title
Abstract
Keywords
Authors (multi-author)
Versioning (revision tracking)
5.2 Review System
Assign reviewer
Comment system (rich text)
Decision types:
Accept
Minor Revision
Major Revision
Reject
5.3 User Management
CRUD users
Role assignment
Account activation/deactivation
Password reset
5.4 Publication System
Public listing
Advanced search & filter
Detail page (SEO optimized)
5.5 Notification System
Email-based events:
Submission
Review result
Revision request
5.6 Analytics Dashboard
Submission trends
Acceptance rate
Reviewer activity

6. 🧱 SYSTEM ARCHITECTURE
6.1 Overview
Frontend: React (SPA)
Backend: Laravel (REST API)
Auth: Token-based via Laravel Sanctum
Database: MySQL / PostgreSQL
6.2 Architecture Pattern
RESTful API
Layered architecture:
Controller
Service
Repository

7. 🗄️ DATABASE DESIGN
Tables
users
id
name
email
password
role
is_active
timestamps
papers
id
title
abstract
file_path
author_id
status
version
timestamps
paper_authors
id
paper_id
name
institution
reviews
id
paper_id
reviewer_id
comment
decision
timestamps
activity_logs
id
user_id
action
description
timestamps

8. 🔌 API DESIGN
Authentication
POST /login
POST /logout
GET /user
Papers
POST /papers
GET /papers
GET /papers/{id}
PUT /papers/{id}
DELETE /papers/{id}
Review
POST /reviews
GET /reviews/{paper_id}
User Management
GET /users
POST /users
PUT /users/{id}
DELETE /users/{id}

9. ⚛️ FRONTEND ARCHITECTURE (React)
Tech Stack
React + Vite
Tailwind CSS
Axios
React Router
Folder Structure
src/
├── components/
├── pages/
├── layouts/
├── services/
├── hooks/
└── utils/
Pages
Admin
Dashboard
User Management
Paper Management
Author
My Papers
Submit Paper
Reviewer
Review Queue

10. 🎨 UI/UX DESIGN SYSTEM
🎨 Color Palette
Role	Color
Primary	#005F02
Secondary	#427A43
Accent	#C0B87A
Background	#F2E3BB
🎯 Design Principles
Minimalist
Clean layout
Card-based UI
Consistent spacing (8px grid system)
🧩 Components
Navbar
Sidebar
Card
Table
Modal
Badge
💡 UX Enhancements
Loading skeleton
Toast notifications
Status badges
Pagination & filtering

11. ⚡ PERFORMANCE REQUIREMENTS
API response < 300ms
Page load < 2s
Lazy loading components
Optimized queries (indexing)

12. 🔐 SECURITY
JWT / Sanctum authentication
Role-based access control
Input validation
File upload validation
CSRF protection

13. 🚀 DEPLOYMENT
Frontend
Vercel / Netlify
Backend
VPS / Docker / Railway
Database
Managed DB (PlanetScale / Supabase / RDS)

14. 📈 FUTURE ROADMAP
DOI integration (Crossref)
Citation generator
AI-based summarization
Plagiarism detection
ORCID integration

15. 🎯 SUCCESS METRICS
Number of submissions
Review turnaround time
Acceptance rate
User engagement

16. 🧠 ENGINEERING STANDARDS
Clean Code
SOLID Principles
RESTful best practices
Git workflow (feature branching)
Code review mandatory

17. 🧾 NON-FUNCTIONAL REQUIREMENTS
Scalability
Maintainability
Accessibility (WCAG)
Cross-browser compatibility
