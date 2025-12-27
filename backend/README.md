# 🎲 Board Game Backend – Docker Guide

Hướng dẫn run môi trường **Node.js backend (Knex + Docker)**

---

## 🚀 Chạy bằng Node (không dùng Docker)

### 1️⃣ Cài đặt dependencies

```bash
npm install
```

### 2️⃣ Chạy migration (tạo bảng)

```bash
npx knex migrate:latest
```

### 3️⃣ Chạy seed (dữ liệu mẫu)

```bash
npx knex seed:run
```

### 4️⃣ Run server (development)

```bash
npm run dev
```

### ▶️ Preview / Production

```bash
npm run start
```

---

## 🐳 Chạy project backend bằng Docker

Hỗ trợ **2 cách**:

- Dockerfile
- Docker Compose

---

## 🐳 Cách 1: Chạy bằng Dockerfile

### 1️⃣ Build image

```bash
docker build -t board-game-backend .
```

### 2️⃣ Run container

```bash
docker run \
  --name board-game-backend \
  -p 8080:8080 \
  --env-file .env.development \
  board-game-backend
```

### 3️⃣ Chạy migration trong container

```bash
docker exec -it board-game-backend npx knex migrate:latest
```

### 4️⃣ Chạy seed trong container

```bash
docker exec -it board-game-backend npx knex seed:run
```

### 5️⃣ Dừng & xoá container

```bash
docker stop board-game-backend
docker rm board-game-backend
```

---

## 🐳 Cách 2: Chạy bằng Docker Compose (Khuyến nghị)

### 1️⃣ Build & run

```bash
docker compose up --build
```

### 2️⃣ Run background (detach mode)

```bash
docker compose up -d --build
```

### 3️⃣ Chạy migration

```bash
docker compose exec backend npx knex migrate:latest
```

### 4️⃣ Chạy seed

```bash
docker compose exec backend npx knex seed:run
```

> `backend` là **service name** trong `docker-compose.yml`

### 5️⃣ Stop & remove containers

```bash
docker compose down
```

---

## 🌐 Truy cập ứng dụng

Sau khi chạy thành công, backend hoạt động tại:

```
http://localhost:8080
```

---

## 📌 Lưu ý quan trọng

- Phải **chạy migration trước seed**
- Đảm bảo tồn tại file:
  ```
  .env.development
  ```
- Port `8080` chưa bị chiếm
- Docker version **>= 20.x**
- Nếu đổi environment:

```bash
npx knex migrate:latest --env production
```

---

## ✅ Thứ tự chuẩn khi setup DB mới

```text
npm install
→ migrate
→ seed
→ run server
```
