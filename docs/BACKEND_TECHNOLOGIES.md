# Các Công Nghệ Nổi Bật Trong Backend

## Tổng Quan

Backend của **Board Game System** được xây dựng theo kiến trúc **Layered Architecture** hiện đại, sử dụng các công nghệ enterprise-grade với focus vào bảo mật và khả năng mở rộng.

---

## 1. Core Framework

### Express.js 5.2 (Mới nhất)
- **Web framework** phổ biến nhất cho Node.js
- Async/await error handling cải tiến
- Middleware chain pattern

```javascript
// app.js structure
app.use(cors(corsConfig));
app.use(cookieParser(cookieConfig.secret));
app.use(apiKeyMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initRoute(app);
app.use(ErrorHandler.handle);
```

### Nodemon 3.1
- Hot reload cho development
- Tự động restart khi code thay đổi

---

## 2. Database & ORM

### PostgreSQL (via Supabase)
- **Cloud-hosted** PostgreSQL database
- SSL connection với `rejectUnauthorized: false`
- Connection pooling: `min: 0, max: 3`

### Knex.js 3.1
- **SQL Query Builder** mạnh mẽ
- Migration system cho version control schema
- Seeding system cho test data

| Feature | Chi tiết |
|---------|----------|
| **Migrations** | 29 files - quản lý schema changes |
| **Seeds** | 12 files - dữ liệu mẫu |
| **Client** | PostgreSQL (`pg` driver 8.16) |

### Supabase JS 2.90
- Cloud storage cho file uploads
- Real-time subscriptions (sẵn sàng)
- Authentication helpers

---

## 3. Authentication & Security

### JWT (jsonwebtoken 9.0)
- **Access Token**: 1 giờ expiry
- **Refresh Token**: 7 ngày expiry
- Bearer token pattern

### bcryptjs 3.0
- Password hashing với salt rounds
- Secure password comparison

### Security Middlewares
| Middleware | Chức năng |
|------------|-----------|
| `auth.middleware` | JWT verification, role authorization |
| `api-key.middleware` | API key validation |
| `validate.middleware` | Request validation via express-validator |

### CORS & Cookie Security
- Configurable CORS origins
- Signed cookies với secret key
- HTTP-only cookie options

---

## 4. Input Validation

### express-validator 7.3
- Schema-based request validation
- Sanitization & normalization
- Custom validation rules

---

## 5. File Upload

### Multer 2.0
- Multipart form handling
- Memory storage for Supabase upload
- File type filtering

### Supabase Storage
- Cloud file storage
- Public URL generation
- Bucket-based organization

---

## 6. Email Service

### Nodemailer 7.0
- SMTP email sending
- HTML email templates
- Password reset flows
- OTP verification emails

---

## 7. API Documentation

### Swagger UI Express 5.0
- Interactive API documentation
- OpenAPI 3.0 specification
- YAML-based definition (`yamljs`)

Route: `/api-docs`

---

## 8. Architecture Pattern

### Layered Architecture

```
┌─────────────────────────────────────┐
│           Routes (12 files)         │  ← Request routing
├─────────────────────────────────────┤
│       Controllers (10 files)        │  ← HTTP handling
├─────────────────────────────────────┤
│        Services (13 files)          │  ← Business logic
├─────────────────────────────────────┤
│      Repositories (7 files)         │  ← Data access
├─────────────────────────────────────┤
│     Database (Knex + PostgreSQL)    │  ← Persistence
└─────────────────────────────────────┘
```

### Routes (12 modules)
| Route | Endpoint Base |
|-------|---------------|
| `auth.route` | `/api/auth` |
| `user.route` | `/api/users` |
| `game.route` | `/api/games` |
| `friend.route` | `/api/friends` |
| `conversation.route` | `/api/conversations` |
| `ranking.route` | `/api/rankings` |
| `achievement.route` | `/api/achievements` |
| `review.route` | `/api/reviews` |
| `upload.route` | `/api/upload` |
| `dashboard.route` | `/api/dashboard` |
| `swagger.route` | `/api-docs` |

### Services (13 modules)
- `auth.service` - Login, register, password reset
- `user.service` - CRUD users
- `game.service` - Game sessions, history
- `friend.service` - Friend requests, management
- `conversation.service` - Messaging
- `ranking.service` - Leaderboards
- `achievement.service` - Badges, rewards
- `review.service` - Game reviews
- `upload.service` - File handling
- `dashboard.service` - Admin analytics
- `jwt.service` - Token generation
- `password.service` - Hashing
- `email.service` - Email sending

---

## 9. Error Handling

### Custom Exception Classes (7 types)
- Centralized error handling
- HTTP status code mapping
- Consistent error response format

### ResponseHandler Utility
- Standardized success/error responses
- Status code constants

---

## 10. Cấu Trúc Thư Mục

```
backend/src/
├── app.js              # Express app setup
├── server.js           # Server entry point
├── configs/            # Configuration files (6 files)
│   ├── cors.config.js
│   ├── cookie.config.js
│   ├── jwt.config.js
│   ├── email.config.js
│   ├── storage.config.js
│   └── swagger.config.js
├── constants/          # HTTP status, enums (6 files)
├── controllers/        # Request handlers (10 files)
├── databases/
│   ├── knex.js         # DB connection
│   ├── migrations/     # Schema migrations (29 files)
│   └── seeds/          # Test data (12 files)
├── docs/               # Swagger YAML
├── errors/             # Custom exceptions (7 files)
├── middlewares/        # Express middlewares (5 files)
├── repositories/       # Data access layer (7 files)
├── routes/             # API routes (12 files)
├── services/           # Business logic (13 files)
├── templates/          # Email templates
├── utils/              # Helper functions
├── validators/         # Validation schemas (4 files)
└── views/              # Server-side views
```

---

## 11. DevOps & Deployment

### Docker
- `Dockerfile` cho containerization
- `docker-compose.yml` cho local development

### Environment Configuration
- `.env` - Production secrets
- `.env.development` - Dev configuration
- `dotenv` 17.2 cho env loading

---

## 12. Tổng Kết Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Express 5 |
| **Database** | PostgreSQL (Supabase) |
| **ORM/Query Builder** | Knex 3 |
| **Authentication** | JWT, bcryptjs |
| **Validation** | express-validator |
| **File Upload** | Multer, Supabase Storage |
| **Email** | Nodemailer |
| **Docs** | Swagger UI |
| **DevOps** | Docker, Nodemon |

---

*Tài liệu được tạo tự động từ codebase - Tháng 01/2026*
