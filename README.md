# 🎲 Board Game System

Hệ thống quản lý trò chơi Board Game.

---

## 📁 Cấu trúc dự án

```
Board-Game-System/
├── api-docs/           # API Documentation (OpenAPI)
├── backend/            # Node.js Express Server
└── frontend/           # React + Vite Application
```

---

## Hướng dẫn chạy dự án

### ⚙️ Backend

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Cài đặt dependencies
npm install

# 3. Chạy database migration
npx knex migrate:latest

# 4. Chạy seed data (dữ liệu mẫu)
npx knex seed:run

# 5. Khởi động server
npm start
```

> ✅ Backend chạy tại: **http://localhost:8080**

---

### 🎨 Frontend

```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt dependencies
npm install

# 3. Khởi động development server
npm run dev
```

> ✅ Frontend chạy tại: **http://localhost:5173**

---

## 📚 API Documentation

Sau khi khởi động backend, truy cập API docs tại:

```
http://localhost:8080/docs
```

---

## ✅ Checklist chạy dự án

1. `cd backend && npm install`
2. `npx knex migrate:latest`
3. `npx knex seed:run`
4. `npm start`
5. `cd frontend && npm install`
6. `npm run dev`
7. Truy cập http://localhost:5173

---

## � Thành viên nhóm

| Họ và Tên       | MSSV     |
| --------------- | -------- |
| Ngô Gia An      | 23120205 |
| Nguyễn Bảo An   | 23120207 |
| Nguyễn Ngọc Đại | 23120226 |
| Trương Nhật Đạt | 23120231 |

---

© 2026 Board Game System
