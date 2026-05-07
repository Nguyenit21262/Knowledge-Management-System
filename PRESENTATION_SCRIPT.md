# Presentation Script — System Design Diagrams
## Knowledge Management System for Schools — Group 4

---

## SUMMARY SLIDE CONTENT

> Copy this into your PowerPoint slide:

---

### Slide Title: System Design — Diagram Summary

| # | Diagram | Purpose |
|---|---------|---------|
| 1 | System Architecture (1a + 1b) | 3-tier structure & server pipeline |
| 2 | ER Diagram (2a + 2b) | Data models & relationships |
| 3 | Use Case Diagram (3a + 3b) | What Student & Teacher can do |
| 4 | Sequence Diagrams (4.1–4.5) | Step-by-step feature flows |
| 5 | Class Diagram (5a + 5b + 5c) | Code structure & dependencies |
| 6 | Component & Deployment (6.1 + 6.2) | Frontend tree & deployment |
| 7 | Data Flow Diagram | How data moves through the system |
| 8 | Material Lifecycle State | States of a material end-to-end |
| 9 | Authentication State (9a + 9b) | Login / logout / token flow |

---

## PRESENTATION SCRIPT

---

### [Opening]

"Hello everyone. My name is Vo Huynh Duy Thinh, and my responsibility in this project
is the System Design section — specifically, drawing and explaining all the UML and
architecture diagrams for our Knowledge Management System.

I will walk you through 9 diagrams that together describe how the system is structured,
how data flows through it, and how users interact with it."

---

### [Slide: Diagram 1 — System Architecture]

"Let's start with the **System Architecture**.

Our system follows a classic **three-tier architecture**.

- The **Client tier** is built with React 19 and Vite. It contains all the pages,
  manages global authentication state via AppContext, and communicates with the
  server through an axios HTTP layer using JWT cookies.

- The **Server tier** runs on Node.js with Express 5. Every request goes through
  a pipeline: Routes receive it, Middleware verifies the JWT and checks roles,
  Controllers handle the business logic, and Utilities handle tasks like PDF text
  extraction, file management, and notification creation.

- The **Data tier** consists of MongoDB managed by Mongoose, plus a local file
  system that stores uploaded PDFs, videos, and images."

---

### [Slide: Diagram 2 — ER Diagram]

"Next is the **Entity-Relationship Diagram**, which shows our 6 data models and
how they connect.

- A **User** can upload many **Materials** and write many **Comments**.
  They can also bookmark Materials in a many-to-many relationship.

- A **Material** belongs to one **Category** and one **Subject**, and can have
  many Comments attached to it.

- A **Comment** can have a parent Comment, which is how threaded replies work.

- A **Notification** is created whenever someone comments on a material or
  replies to a comment. It references the recipient User, the triggering Comment,
  and the related Material."

---

### [Slide: Diagram 3 — Use Case Diagram]

"The **Use Case Diagram** shows what each actor can do in the system.

We have two roles: **Student** and **Teacher**.

Both roles share common features:
- Register, login, logout, and view their profile
- Browse, search, view, and download materials
- Upload, edit, and delete their own materials
- Post comments and replies, bookmark materials, and view notifications

**Teachers additionally** have admin-only privileges:
- Create new categories and subjects
- View and manage all student accounts — activating or deactivating them
- Access the admin dashboard to oversee the entire knowledge base"

---

### [Slide: Diagram 4 — Sequence Diagrams]

"The **Sequence Diagrams** show the step-by-step communication between components
for our key features. I will highlight four flows:

**Registration (4.1a):**
The user submits their details. The server checks that the email is unique,
hashes the password with bcrypt, and creates the user account in MongoDB.

**Login (4.1b):**
The server retrieves the user, verifies the password hash, checks the account
is active, then generates a JWT token stored as an httpOnly cookie. This cookie
is automatically sent with every subsequent request.

**Upload Material (4.2a + 4.2b):**
After JWT verification, Multer saves the file to disk and detects whether it is
a PDF, video, or image. If it is a PDF, the server extracts the text content for
full-text search. Then the material is saved to MongoDB with all metadata.

**Comment & Notification (4.3a + 4.3b):**
When a user posts a comment, it is saved and a Mongoose post-save hook
automatically syncs the comment count on the material. The Notification Service
then creates a notification — a reply notification if it is a reply, or a
material comment notification sent to the uploader if it is a top-level comment."

---

### [Slide: Diagram 5 — Class Diagram]

"The **Class Diagram** is split into three parts.

**5a — Data Models:**
Shows our 6 Mongoose schemas — User, Material, Comment, Notification, Category,
and Subject — with their key fields and how they reference each other.

**5b — User Auth Controllers:**
Shows the 4 controllers protected by the userAuth middleware: Auth, Material,
Comment, and Notification. The Comment Controller also calls the Notification
Service after saving a comment.

**5c — Admin Auth Controllers:**
Shows the 3 teacher-only controllers — Category, Subject, and User — protected
by the adminAuth middleware, which checks that the logged-in user has the
teacher role before allowing access."

---

### [Slide: Diagram 6 — Component & Deployment]

"The **Frontend Component Tree** shows how the React application is structured.

Everything starts at main.jsx, which mounts App.jsx with the global AppContext.
AppRoutes then splits traffic into three paths:
- **Public routes** — Login and Register, accessible without authentication
- **MainLayout** — the student-facing pages: Home, Search, DocumentDetail,
  Bookmarks, Profile, Uploads, and UploadNew
- **AdminLayout** — the teacher-facing pages: Dashboard, KnowledgeBase,
  Categories, Students, and AdminSearch

DocumentDetail is the most complex page, containing four sub-components:
DocumentOverview, FileViewer, DocumentComments, and the Notification Bell.

The **Deployment Diagram** shows how the three tiers are physically connected:
the browser loads the React SPA, which communicates with the Express server
on port 5000, which in turn queries MongoDB and reads and writes files from
the uploads directory."

---

### [Slide: Diagram 7 — Data Flow Diagram]

"The **Data Flow Diagram** gives a high-level view of how data moves through
the system.

Both Student and Teacher actors feed into five core services:
Auth, Material, Comment, Notification, and User Service.

All services read and write to a single MongoDB database.

One important internal flow: the **Comment Service automatically triggers
the Notification Service** whenever a comment is saved — this is handled
by a Mongoose post-save hook on the Comment model, with no extra API call
needed from the client."

---

### [Slide: Diagram 8 — Material Lifecycle State]

"The **Material Lifecycle State Diagram** tracks every possible state a
material can be in.

It starts when a user submits the upload form. The file goes through
validation, then taxonomy resolution to match subject and category.
If it is a PDF, text is extracted for search indexing.
Once saved successfully, the material enters the **Published** state.

From Published, it can be:
- Viewed — incrementing the view count
- Downloaded — incrementing the download count
- Commented on — syncing the comment count
- Bookmarked by users
- Edited by the owner or a teacher
- Deleted — which also cascades to delete all related comments"

---

### [Slide: Diagram 9 — Authentication State]

"Finally, the **Authentication State Diagram** shows the session lifecycle.

**9a — Auth Flow:**
A user starts as Unauthenticated. They can register, which returns them to
Unauthenticated with a prompt to log in. On login, a JWT cookie is set and
they enter the Authenticated state. Logging out or having an expired token
returns them to Unauthenticated.

**9b — Authenticated Session:**
Inside the Authenticated state, users are either a Student or a Teacher.
Every request to a protected route triggers token validation — if the token
is valid and the user is active, the session continues. If not, they are
logged out automatically."

---

### [Closing]

"To summarize, these 9 diagrams cover every layer of our system — from the
deployment topology, to the data model, to individual feature flows, to the
frontend component structure.

Together they give a complete picture of how the Knowledge Management System
is designed, how it handles data, and how users of both roles interact with it.

Thank you."

---

## SLIDE-BY-SLIDE TIMING GUIDE

| Slide | Diagram | Suggested Time |
|-------|---------|---------------|
| 1 | System Architecture 1a + 1b | 1.5 min |
| 2 | ER Diagram 2a + table | 1.5 min |
| 3 | Use Case 3a + 3b | 1 min |
| 4 | Sequence 4.1a → 4.3b | 2 min |
| 5 | Class 5a + 5b + 5c | 1.5 min |
| 6 | Component 6.1a–6.1d + Deployment | 1.5 min |
| 7 | Data Flow Diagram | 1 min |
| 8 | Material Lifecycle | 1 min |
| 9 | Auth State 9a + 9b | 1 min |
| — | Summary slide | 0.5 min |
| **Total** | | **~13 min** |
