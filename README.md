# Knowledge Management System

Dự án Knowledge Management System gồm frontend React/Vite và backend Node.js/Express, sử dụng MongoDB để lưu dữ liệu. Ứng dụng hỗ trợ quản lý tài liệu học tập, danh mục, bình luận, thông báo, tài khoản người dùng và khu vực quản trị dành cho giảng viên.

## Công nghệ sử dụng

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Lucide React
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer, GridFS
- Xác thực: JWT lưu qua cookie HTTP-only

## Cấu trúc dự án

```text
Knowledge-Management-System/
|-- client/                         # Frontend React + Vite
|   |-- public/                     # Icon, favicon và tài nguyên tĩnh
|   |-- src/
|   |   |-- api/                    # Cấu hình HTTP client và API modules
|   |   |-- assets/                 # Hình ảnh/tài nguyên dùng trong app
|   |   |-- components/             # Component dùng chung
|   |   |-- components/admin/       # Component riêng cho trang admin
|   |   |-- context/                # App context
|   |   |-- hooks/                  # Custom hooks
|   |   |-- layouts/                # Layout chính
|   |   |-- pages/                  # Trang người dùng
|   |   |-- pages/admin/            # Trang quản trị
|   |   |-- routes/                 # Định nghĩa route frontend
|   |   `-- utils/                  # Hàm tiện ích
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
|
|-- Server/                         # Backend Node.js + Express
|   |-- config/                     # Cấu hình env, database, CORS, upload
|   |-- controllers/                # Xử lý logic request
|   |-- middleware/                 # Auth, phân quyền, error handler
|   |-- models/                     # Mongoose models
|   |-- routes/                     # API routes
|   |-- scripts/                    # Script hỗ trợ, ví dụ migrate uploads
|   |-- utils/                      # Hàm tiện ích backend
|   |-- app.js                      # Tạo Express app và đăng ký middleware/routes
|   |-- server.js                   # Kết nối DB và chạy server
|   `-- package.json
|
`-- README.md
```

## Yêu cầu trước khi chạy

- Node.js và npm
- MongoDB local hoặc MongoDB Atlas

## Cấu hình môi trường

Tạo file `.env` trong thư mục `Server/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/knowledge-management-system
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Nếu frontend cần trỏ tới backend khác mặc định, tạo file `.env` trong thư mục `client/`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Cách chạy dự án ở môi trường development

Mở terminal thứ nhất để chạy backend:

```bash
cd Server
npm install
npm run dev
```

Backend mặc định chạy tại:

```text
http://localhost:5000
```

Mở terminal thứ hai để chạy frontend:

```bash
cd client
npm install
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

## Build và chạy bản production

Build frontend:

```bash
cd client
npm install
npm run build
```

Chạy backend:

```bash
cd ../Server
npm install
npm run server
```

Khi thư mục `client/dist` tồn tại, backend sẽ tự phục vụ frontend build và các route không thuộc `/api` sẽ trả về ứng dụng React.

## API chính

Backend đăng ký các route dưới prefix `/api`:

```text
/api/auth
/api/materials
/api/comments
/api/categories
/api/notifications
/api/subjects
/api/users
```

## Script hữu ích

Trong `Server/`:

```bash
npm run dev              # Chạy backend bằng nodemon
npm run server           # Chạy backend bằng node
npm run build:client     # Build frontend từ backend
npm run migrate:uploads  # Migrate file upload cũ sang GridFS
```

Trong `client/`:

```bash
npm run dev      # Chạy Vite dev server
npm run build    # Build frontend
npm run preview  # Preview bản build
npm run lint     # Kiểm tra lint
```
