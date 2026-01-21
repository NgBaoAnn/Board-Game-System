# Các Công Nghệ Nổi Bật Trong Frontend

## Tổng Quan

Frontend của **Board Game System** được xây dựng với các công nghệ hiện đại nhất năm 2025-2026, tập trung vào hiệu suất, trải nghiệm người dùng cao cấp và khả năng mở rộng.

---

## 1. Core Framework & Build Tools

### React 19.2
- **Phiên bản mới nhất** với Concurrent Features
- Sử dụng **React Strict Mode** cho development
- **Lazy Loading** với `React.lazy()` và `Suspense` cho code splitting
- Custom hooks: `useAuth`, `useFormValidation`

### Vite 7.2
- **Build tool thế hệ mới** - siêu nhanh với ESBuild
- Hot Module Replacement (HMR) tức thì
- Plugin ecosystem: `@vitejs/plugin-react`, `@tailwindcss/vite`
- Path alias: `@` → `src/`

---

## 2. UI Framework & Styling

### Ant Design 6.1
- Thư viện component enterprise-grade
- Components: Tables, Forms, Modals, Tabs, Cards, Notifications
- Tích hợp theming và dark mode

### TailwindCSS 4.1 (Mới nhất)
- Utility-first CSS framework
- **Custom Variant** cho dark mode: `@custom-variant dark`
- Custom design tokens trong `@theme`:
  - Gaming theme: Cosmic Arcade colors
  - Motion timing variables
  - Custom fonts: Orbitron, Space Grotesk, JetBrains Mono

### Custom CSS Features
| Feature | Mô tả |
|---------|-------|
| **Glassmorphism** | `backdrop-filter: blur()` cho hiệu ứng kính mờ |
| **Neon Glow Effects** | Box-shadow animations cho gaming aesthetic |
| **Rarity System** | Common → Rare → Epic → Legendary với glow khác nhau |
| **Tier Badges** | Bronze → Diamond → Grandmaster gradients |
| **Responsive Utilities** | Media queries cho mobile optimization |

### Animation Keyframes (18+ animations)
- `shake`, `float`, `pulse-glow`, `neon-glow-pulse`
- `shimmer`, `ambient-flow`, `particle-rise`
- `legendary-glow`, `metallic-shine`, `rank-up/down-pulse`
- **Accessibility**: `prefers-reduced-motion` support

---

## 3. State Management

### Zustand 5.0
- **Lightweight** global state (< 1KB)
- Không cần boilerplate như Redux
- Sử dụng cho authentication state:
```javascript
export const useAuth = create((set) => ({
  user: null,
  authenticated: false,
  isAppLoading: true,
  setUser: (user) => set({ user, authenticated: true }),
  clearUser: () => set({ user: null, authenticated: false }),
}));
```

### React Context API
- `AuthProvider` - Quản lý authentication
- `ThemeProvider` - Dark/Light mode switching

---

## 4. Internationalization (i18n)

### i18next + react-i18next
- **Đa ngôn ngữ**: Tiếng Việt (vi) & English (en)
- **Browser Language Detection** tự động
- LocalStorage caching với key `i18n_language`
- Namespace-based translations: `common.json`

---

## 5. Routing & Navigation

### React Router DOM 7.11
- `createBrowserRouter` API mới
- Nested routes với `children`
- **Route Guards**:
  - `RequireAuth` - Yêu cầu đăng nhập
  - `RequireAdmin` - Yêu cầu quyền admin
  - `RedirectIfAuth` - Redirect nếu đã đăng nhập

### Lazy Loading Routes
Tất cả pages được lazy load:
```javascript
const HomePage = lazy(() => import('../pages/user/HomePage'))
const AdminPage = lazy(() => import('../pages/admin/AdminPage'))
```

---

## 6. Animations & Visual Effects

### Framer Motion 12.24
- Production-grade motion library
- Page transitions, hover effects
- Gesture-based animations

### Lottie Animations
- **lottie-react** + **@lottiefiles/dotlottie-react**
- Vector animations cho loading states, illustrations
- Hiệu suất cao với file .lottie

### tsparticles (Slim bundle)
- **@tsparticles/react** + **@tsparticles/slim**
- Particle effects cho backgrounds
- Optimized bundle size

---

## 7. Icons & Assets

### Lucide React 0.562
- **Modern icon library** - fork của Feather Icons
- Tree-shakable - chỉ import icons cần thiết
- Consistent 24x24 grid

---

## 8. HTTP Client & API

### Axios 1.13
- Promise-based HTTP client
- Request/Response interceptors
- Centralized API configuration

---

## 9. Form Validation

### Joi 18
- Schema-based validation
- Custom validation rules
- Error messages localization

---

## 10. Cấu Trúc Thư Mục

```
frontend/src/
├── api/            # API clients (11 files)
├── assets/         # Static assets
├── components/     # Reusable components (78 files)
│   ├── common/     # AnimatedSection, Guards, Loaders
│   ├── layout/     # ClientLayout, AdminLayout
│   ├── Game/       # Game-related components
│   ├── Profile/    # Profile tabs & cards
│   └── ...
├── configs/        # App configurations
├── context/        # React Context providers
├── hooks/          # Custom React hooks
├── i18n/           # i18next setup & locales
├── pages/          # Page components (22 files)
│   ├── user/       # User-facing pages
│   ├── admin/      # Admin dashboard pages
│   └── common/     # Login, Register, Error pages
├── routes/         # Router configuration
├── store/          # Zustand stores
├── styles/         # Global CSS (900+ lines)
└── utils/          # Utility functions
```

---

## 11. Development Tools

### ESLint 9.39
- React Hooks plugin
- React Refresh plugin
- Modern flat config (`eslint.config.js`)

### TypeScript Support
- Type definitions: `@types/react`, `@types/react-dom`
- JSConfig for better IDE support

---

## 12. Deployment

### Vercel
- Zero-config deployment
- `vercel.json` configuration
- Automatic HTTPS & CDN

---

## Tổng Kết Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 19, Vite 7 |
| **UI Library** | Ant Design 6, TailwindCSS 4 |
| **State** | Zustand 5, Context API |
| **Routing** | React Router 7 |
| **Animations** | Framer Motion 12, Lottie, tsparticles |
| **i18n** | i18next |
| **HTTP** | Axios |
| **Validation** | Joi |
| **Icons** | Lucide React |
| **Build** | Vite, ESLint |
| **Deploy** | Vercel |

---

*Tài liệu được tạo tự động từ codebase - Tháng 01/2026*
