# Board Game Backend – Docker Guide

Hướng dẫn run môi trường node

## Development

```bash
npm run dev
```

## Preview & Production

```bash
npm run start
```

---

Hướng dẫn chạy project backend bằng Docker theo 2 cách:

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

### 3️⃣ Dừng & xoá container

```bash
docker stop board-game-backend
docker rm board-game-backend
```

---

## 🐳 Cách 2: Chạy bằng Docker Compose

### 1️⃣ Build & run

```bash
docker compose up --build
```

### 2️⃣ Run background (detach mode)

```bash
docker compose up -d --build
```

### 3️⃣ Stop & remove containers

```bash
docker compose down
```

---

## 🌐 Truy cập ứng dụng

Sau khi chạy thành công, backend sẽ hoạt động tại:

```
http://localhost:8080
```

---

## 📌 Lưu ý

- Đảm bảo file `.env.development` tồn tại
- Port `8080` chưa bị chiếm
- Docker version >= 20.x
