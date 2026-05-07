# Knowledge Management System — UML Diagrams

> **Tech Stack:** React 19 (Vite) · Node.js/Express 5 · MongoDB/Mongoose · JWT (httpOnly cookie) · Multer · Tailwind CSS

---

## 1. System Architecture Diagram

### 1a — Three-Tier Overview

```mermaid
graph TB
    FE["CLIENT — React 19 + Vite<br/>Pages & Components<br/>AppContext / React Router v7<br/>Custom Hooks / axios"]

    BE["SERVER — Node.js + Express 5<br/>REST Routes → Middleware → Controllers<br/>Utils / Multer / PDF Parser"]

    DB[("DATA LAYER<br/>MongoDB<br/>/uploads/ Files")]

    FE -->|"HTTP REST + JWT cookie"| BE
    BE -->|"Mongoose ODM"| DB
```

### 1b — Server Internal Pipeline

```mermaid
graph LR
    REQ(["HTTP Request"])
    MW["MIDDLEWARE<br/>cors · cookieParser · userAuth · adminAuth"]
    CTRL["CONTROLLERS<br/>auth · material · comment<br/>category · subject · notification · user"]
    UTIL["UTILITIES<br/>generateToken · bcrypt · pdfHelpers<br/>fileHelpers · notificationService"]
    DB[("MongoDB")]
    FS["/uploads/"]

    REQ --> MW --> CTRL --> UTIL
    CTRL --> DB
    CTRL --> FS
```

---

## 2. Entity-Relationship (ER) Diagram

#### 2a — Entity Relationship Overview

```mermaid
graph TB
    USER(["USER"])
    MATERIAL(["MATERIAL"])
    COMMENT(["COMMENT"])
    CATEGORY(["CATEGORY"])
    SUBJECT(["SUBJECT"])
    NOTIFICATION(["NOTIFICATION"])

    USER     -- "uploads 1→N" --> MATERIAL
    USER     -- "writes 1→N" --> COMMENT
    USER     -. "bookmarks N→N" .-> MATERIAL
    MATERIAL -- "has 1→N" --> COMMENT
    MATERIAL -- "classified in" --> CATEGORY
    MATERIAL -- "tagged with" --> SUBJECT
    NOTIFICATION -- "sent to" --> USER
    NOTIFICATION -- "about" --> MATERIAL
    NOTIFICATION -- "triggered by" --> COMMENT
```

#### 2b — Entity Attributes

| Entity | Key Fields |
|---|---|
| **USER** | _id (PK) · name · email · password · role (student\|teacher) · isActive · bookmarks[ ] |
| **MATERIAL** | _id (PK) · title · description · subject · category · type (PDF\|VIDEO\|IMAGE) · fileUrl · contentText · uploadedBy (FK) · downloads · views · commentsCount |
| **COMMENT** | _id (PK) · material (FK) · author (FK) · parent (FK, self-ref) · content |
| **NOTIFICATION** | _id (PK) · recipient (FK) · actor (FK) · material (FK) · comment (FK) · type (material_comment\|comment_reply) · isRead |
| **CATEGORY** | _id (PK) · name |
| **SUBJECT** | _id (PK) · name |

---

## 3. Use Case Diagram

#### 3a — Student Use Cases

```mermaid
flowchart TB
    STU(["Student"])

    STU --> A["Register · Login · Logout · View Profile"]
    STU --> B["Browse & Search · View · Download · Upload · Edit · Delete Own"]
    STU --> C["Comment · Reply · Bookmark · View Notifications"]
```

#### 3b — Teacher Use Cases

```mermaid
flowchart TB
    TEA(["Teacher"])

    TEA --> A["Register · Login · Logout · View Profile"]
    TEA --> B["Browse & Search · View · Download · Upload · Manage All Materials"]
    TEA --> C["Comment · Reply · Bookmark · View Notifications"]
    TEA --> D["Create Category & Subject · Manage Students · Admin Dashboard"]
```

---

## 4. Sequence Diagrams

### 4.1a — User Registration

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend
    participant BE as Server
    participant DB as MongoDB

    U->>FE: Fill name / email / password / role
    FE->>BE: POST /api/auth/register
    BE->>DB: findOne({ email })
    DB-->>BE: null (email free)
    BE->>BE: hashPassword()
    BE->>DB: User.create(...)
    DB-->>BE: User document
    BE-->>FE: 201 { success, user }
    FE-->>U: "Registration successful. Please log in."
```

### 4.1b — User Login

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend
    participant BE as Server
    participant DB as MongoDB

    U->>FE: Enter email / password
    FE->>BE: POST /api/auth/login
    BE->>DB: findOne({ email }).select("+password")
    DB-->>BE: User document
    BE->>BE: comparePassword()
    alt Valid & active
        BE->>BE: generateToken() → set httpOnly cookie
        BE-->>FE: 200 { token, user }
        FE-->>U: Redirect to Home
    else Invalid / inactive
        BE-->>FE: 401 / 403 error
        FE-->>U: Show error toast
    end
```

---

### 4.2a — Upload Material (Auth & File Save)

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend
    participant BE as Server
    participant DB as MongoDB

    U->>FE: Fill form (title, subject, category, file)
    FE->>BE: POST /api/materials [JWT cookie]
    BE->>DB: User.findById() — verify token
    DB-->>BE: User document
    BE->>BE: Multer saves file → /uploads/
    BE->>BE: detectFileType() → PDF|VIDEO|IMAGE
    BE-->>FE: (continues in 4.2b)
```

### 4.2b — Upload Material (PDF Extract & Persist)

```mermaid
sequenceDiagram
    participant BE as Server
    participant FS as File System
    participant DB as MongoDB
    actor U as User
    participant FE as Frontend

    alt File is PDF
        BE->>FS: Read file bytes
        BE->>BE: extractPdfText() → contentText
    end
    BE->>DB: Subject.findOne / create
    BE->>DB: Category.findOne / create
    BE->>DB: Material.create({ ...data, fileUrl, contentText })
    DB-->>BE: Material document
    BE-->>FE: 201 { message, material }
    FE-->>U: Success toast + redirect
```

---

### 4.3a — Post Comment

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend
    participant BE as Server
    participant DB as MongoDB

    U->>FE: Type comment & submit
    FE->>BE: POST /api/comments/:materialId [JWT cookie]
    BE->>DB: Material.findById(materialId)
    DB-->>BE: Material (with uploadedBy)
    BE->>DB: Comment.create({ material, author, parent?, content })
    DB-->>BE: Comment document
    Note over DB: post save hook → sync commentsCount
    BE-->>FE: 201 { comment }
    FE-->>U: Comment appears in thread
```

### 4.3b — Trigger Notification

```mermaid
sequenceDiagram
    participant BE as Server
    participant NS as NotificationService
    participant DB as MongoDB
    participant FE as Frontend

    BE->>NS: createNotification(comment, material, actor)
    alt Reply to a comment
        NS->>DB: Notification.create({ type: comment_reply, recipient: parentAuthor })
    else Top-level comment
        NS->>DB: Notification.create({ type: material_comment, recipient: uploader })
    end
    DB-->>NS: Notification saved
    Note over FE: Bell icon updates on next poll
```

---

### 4.4 — Search Materials

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React Frontend
    participant BE as Express Server
    participant DB as MongoDB

    U->>FE: Type in search bar
    FE->>BE: GET /api/materials/search/suggestions?q=...
    BE->>DB: Material.find({ $or: [title, subject, category] }).limit(20)
    DB-->>BE: Matching materials
    BE->>BE: buildSuggestionsFromMaterials() → top 10 unique
    BE-->>FE: { suggestions: [...] }
    FE-->>U: Dropdown suggestions shown

    U->>FE: Press Enter / click Search
    FE->>BE: GET /api/materials/search?q=...&subject=...&sortBy=...
    BE->>DB: Material.find({ $or: [title, desc, subject, category, contentText] })
    DB-->>BE: Filtered & sorted materials
    BE->>BE: materials.map(formatMaterial)
    BE-->>FE: { success, total, materials }
    FE-->>U: Results displayed on Search page
```

---

### 4.5 — Delete Material (cascade)

```mermaid
sequenceDiagram
    actor U as Authenticated User
    participant FE as React Frontend
    participant BE as Express Server
    participant DB as MongoDB
    participant FS as File System

    U->>FE: Click "Delete" on material
    FE->>BE: DELETE /api/materials/:id  [JWT cookie]
    BE->>DB: Material.findById(id)
    DB-->>BE: Material document
    BE->>BE: canManageMaterial() → owner OR teacher?
    alt Authorized
        BE->>FS: deleteUploadedFile(material.fileUrl)
        BE->>DB: Comment.find({ material: id })
        DB-->>BE: Related comments list
        loop For each comment (triggers post hook)
            BE->>DB: Comment.findByIdAndDelete(commentId)
            Note over DB: post hook → sync commentsCount
        end
        BE->>DB: Material.findByIdAndDelete(id)
        BE-->>FE: 200 { message: "deleted" }
        FE-->>U: Success toast + redirect Home
    else Not authorized
        BE-->>FE: 403 { message: "No permission" }
        FE-->>U: Error toast
    end
```

---

## 5. Class Diagram

#### 5a — Data Models

```mermaid
graph LR
    USER["User<br/>──────────<br/>name · email<br/>role · isActive<br/>bookmarks[]"]

    MATERIAL["Material<br/>──────────<br/>title · subject<br/>category · type<br/>fileUrl · downloads · views"]

    COMMENT["Comment<br/>──────────<br/>material · author<br/>parent · content"]

    NOTIF["Notification<br/>──────────<br/>recipient · actor<br/>material · comment<br/>type · isRead"]

    CAT["Category<br/>──────────<br/>name"]

    SUB["Subject<br/>──────────<br/>name"]

    USER -- "uploads" --> MATERIAL
    USER -- "writes" --> COMMENT
    MATERIAL -- "has" --> COMMENT
    MATERIAL -- "in" --> CAT
    MATERIAL -- "tagged" --> SUB
    NOTIF -- "notifies" --> USER
    NOTIF -- "about" --> MATERIAL
    NOTIF -- "triggered by" --> COMMENT
```

#### 5b — Controllers & Middleware (User Auth)

```mermaid
classDiagram
    class userAuthMiddleware { +protect() }
    class AuthController {
        +register()
        +login()
        +logout()
        +getMe()
    }
    class MaterialController {
        +getMaterials()
        +getMaterialById()
        +createMaterial()
        +updateMaterial()
        +deleteMaterial()
    }
    class CommentController {
        +getComments()
        +createComment()
        +deleteComment()
    }
    class NotificationController {
        +getNotifications()
        +markAllRead()
    }
    class NotificationService { +createNotification() }

    userAuthMiddleware ..> AuthController
    userAuthMiddleware ..> MaterialController
    userAuthMiddleware ..> CommentController
    userAuthMiddleware ..> NotificationController
    CommentController ..> NotificationService : calls
```

#### 5c — Controllers & Middleware (Admin Auth)

```mermaid
classDiagram
    class adminAuthMiddleware { +isAdmin() }
    class CategoryController {
        +getCategories()
        +createCategory()
    }
    class SubjectController {
        +getSubjects()
        +createSubject()
    }
    class UserController {
        +getAllUsers()
        +getUserProfile()
        +toggleStudentActive()
        +toggleBookmark()
    }

    adminAuthMiddleware ..> CategoryController
    adminAuthMiddleware ..> SubjectController
    adminAuthMiddleware ..> UserController
```

---

## 6. Component & Deployment Diagram

### 6.1 — Frontend Component Tree

#### 6.1a — Entry & Public Routes

```mermaid
graph TD
    MAIN["main.jsx"] --> APP["App.jsx + AppContext"]
    APP --> ROUTES["AppRoutes.jsx"]
    ROUTES --> LOGIN["Login.jsx"]
    ROUTES --> REGISTER["Register.jsx"]
    ROUTES --> PROT["ProtectedRoute.jsx"]
    PROT --> UL["MainLayout\nNavbar + Sidebar"]
    PROT --> AL["AdminLayout\nAdminSidebar"]
```

#### 6.1b — Student Pages (under MainLayout)

```mermaid
graph TD
    UL["MainLayout"] --> HOME["Home.jsx"]
    UL --> SEARCH["Search.jsx"]
    UL --> DETAIL["DocumentDetail.jsx"]
    UL --> BOOKMARKS["Bookmarks.jsx"]
    UL --> PROFILE["Profile.jsx"]
    UL --> UPLOADS["Uploads.jsx"]
    UL --> UPLOAD_NEW["UploadNew.jsx"]
```

#### 6.1c — Admin Pages (under AdminLayout)

```mermaid
graph TD
    AL["AdminLayout"] --> DASHBOARD["AdminDashboard.jsx"]
    AL --> KB["AdminKnowledgeBase.jsx"]
    AL --> CATS["AdminCategories.jsx"]
    AL --> STUDENTS["AdminStudents.jsx"]
    AL --> ASEARCH["AdminSearch.jsx"]
```

#### 6.1d — DocumentDetail Sub-components

```mermaid
graph TD
    DETAIL["DocumentDetail.jsx"]
    DETAIL --> OVERVIEW["DocumentOverview.jsx\ntitle · metadata · stats"]
    DETAIL --> VIEWER["FileViewer.jsx\nPDF / Video / Image preview"]
    DETAIL --> COMMENTS["DocumentComments.jsx\nthreaded comment tree"]
    DETAIL --> NOTIF["UserNotificationsBell.jsx\nnotification polling"]
```

---

### 6.2 — Deployment Diagram

```mermaid
graph LR
    subgraph UserDevice["👤 User's Browser"]
        SPA["React SPA\n(Vite build)"]
    end

    subgraph AppServer["🖥️ Application Server (Node.js)"]
        EXPRESS["Express App\n:5000"]
        MULTER_STORE["/uploads/ directory\n(static files served)"]
        JWT_ENGINE["JWT Engine\n(httpOnly cookie)"]
        EXPRESS --> MULTER_STORE
        EXPRESS --> JWT_ENGINE
    end

    subgraph DatabaseServer["🗄️ Database Server"]
        MONGO["MongoDB\n(Mongoose ODM)"]
        COLLECTIONS["Collections:\nusers · materials · comments\ncategories · subjects · notifications"]
        MONGO --> COLLECTIONS
    end

    SPA -- "HTTPS + CORS\n(credentialed cookie)" --> EXPRESS
    EXPRESS -- "Mongoose queries" --> MONGO
    SPA -- "Static file requests\n/uploads/*" --> MULTER_STORE
```

---

## 7. Data Flow Diagram (Level 0 — Context)

```mermaid
graph LR
    STU["Student"]
    TEA["Teacher / Admin"]

    subgraph KMS["Knowledge Management System"]
        direction TB
        AUTH["Auth Service"]
        MAT["Material Service"]
        COM["Comment Service"]
        NOTIF["Notification Service"]
        USER_SVC["User Service"]
    end

    DB[("MongoDB")]

    STU & TEA -- "register / login" --> AUTH
    STU -- "upload / search / view / download" --> MAT
    STU -- "comment / reply" --> COM
    STU -- "bookmark" --> USER_SVC
    STU -- "read notifications" --> NOTIF

    TEA -- "upload / manage all materials" --> MAT
    TEA -- "comment / reply" --> COM
    TEA -- "manage students" --> USER_SVC
    TEA -- "create categories / subjects" --> MAT
    TEA -- "read notifications" --> NOTIF

    AUTH --> DB
    MAT --> DB
    COM --> DB
    NOTIF --> DB
    USER_SVC --> DB

    COM -- "triggers" --> NOTIF
```

---

## 8. State Diagram — Material Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Uploading : User submits upload form
    Uploading --> FileValidation : Multer receives file
    FileValidation --> TaxonomyResolution : File valid (≤ 20 MB)
    FileValidation --> UploadError : File invalid / too large

    TaxonomyResolution --> PDFExtraction : type == PDF
    TaxonomyResolution --> Persisting : type == VIDEO or IMAGE

    PDFExtraction --> Persisting : Text extracted
    PDFExtraction --> Persisting : Extraction failed (empty contentText)

    Persisting --> Published : Material.create() success
    Persisting --> UploadError : DB error

    Published --> Viewed : User opens detail page (views++)
    Published --> Downloaded : User downloads file (downloads++)
    Published --> Commented : User posts comment (commentsCount++)
    Published --> Bookmarked : User toggles bookmark
    Published --> Editing : Owner / Teacher edits metadata
    Editing --> Published : Material.save() success
    Published --> Deleted : Owner / Teacher deletes

    Commented --> Notified : notificationService creates Notification
    Deleted --> [*]
    UploadError --> [*]
```

---

## 9. Authentication State Diagram

#### 9a — Auth Flow

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated

    Unauthenticated --> Registering : POST /api/auth/register
    Registering --> Unauthenticated : Success / Error

    Unauthenticated --> LoggingIn : POST /api/auth/login
    LoggingIn --> Authenticated : JWT cookie set
    LoggingIn --> Unauthenticated : Invalid / inactive

    Authenticated --> Unauthenticated : Logout / token expired
```

#### 9b — Authenticated Session

```mermaid
stateDiagram-v2
    [*] --> Authenticated

    state Authenticated {
        [*] --> Student
        [*] --> Teacher
    }

    Authenticated --> TokenValidation : Protected route request
    TokenValidation --> Authenticated : Token valid & user active
    TokenValidation --> Unauthenticated : Token expired / not found
    Unauthenticated --> [*]
```
