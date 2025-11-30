# Landing Page Website

Website giới thiệu sản phẩm với landing page, blog, form liên hệ và admin panel.

## Công nghệ

- Next.js 14 (App Router)
- PostgreSQL + Prisma
- NextAuth.js
- Nodemailer
- Tailwind CSS

## Cấu hình Development

### Subdomain Setup

Website sử dụng subdomain cho admin panel:
- **Public site**: `localhost:3000` hoặc `www.localhost:3000`
- **Admin panel**: `admin.localhost:3000`

### Cấu hình /etc/hosts

Để test subdomain locally, cần thêm vào file `/etc/hosts`:

**Linux/macOS:**
```bash
sudo nano /etc/hosts
```

Thêm các dòng sau:
```
127.0.0.1       localhost
127.0.0.1       admin.localhost
```

**Windows:**
Mở file `C:\Windows\System32\drivers\etc\hosts` với quyền Administrator và thêm:
```
127.0.0.1       localhost
127.0.0.1       admin.localhost
```

Sau khi lưu file, truy cập:
- Main site: http://localhost:3000
- Admin panel: http://admin.localhost:3000

## Cài đặt

### Cách 1: Production với Docker (Khuyến nghị)

```bash
# 1. Tạo file .env từ .env.example (hoặc Makefile sẽ tự động tạo)
cp .env.example .env

# 2. Chỉnh sửa file .env với các giá trị thực tế
# Đặc biệt quan trọng: NEXTAUTH_SECRET (generate bằng: openssl rand -base64 32)

# 3. Build Docker image
make build

# 4. Start containers (postgres + app)
make up

# 5. Chạy migrations
make migrate-deploy

# 6. (Optional) Seed database với dữ liệu mẫu
make seed
```

### Cách 2: Development local (không dùng Docker)

```bash
# 1. Setup PostgreSQL database (có thể dùng Docker chỉ cho DB)
docker-compose up -d postgres

# 2. Tạo file .env từ .env.example
cp .env.example .env

# 3. Chỉnh sửa DATABASE_URL trong .env (dùng localhost)
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/landingpage?schema=public

# 4. Cài đặt dependencies
npm install

# 5. Generate Prisma client
npx prisma generate

# 6. Chạy migrations
npx prisma migrate dev

# 7. (Optional) Seed database
npm run db:seed

# 8. Chạy dev server
npm run dev
```

## Docker Commands

Xem tất cả commands có sẵn:
```bash
make help
```

Các commands chính:
```bash
make build          # Build Docker image
make up             # Start containers (postgres + app)
make down           # Stop containers (giữ volumes)
make logs           # Xem logs của containers
make migrate-dev    # Chạy dev migrations (interactive)
make migrate-deploy # Chạy production migrations (non-interactive)
make seed           # Chạy seed script
make reset          # Reset database (xóa volumes và chạy lại migrations)
```

**Lưu ý:** 
- `make build` và `make up` sẽ tự động tạo file `.env` từ `.env.example` nếu chưa có
- Trong Docker, `DATABASE_URL` sẽ tự động dùng hostname `postgres` thay vì `localhost`

## Tạo Admin User

Sau khi setup database, bạn có thể:
1. Chạy seed để tạo admin user mẫu (nếu có seed script):
   ```bash
   make seed
   ```
   Hoặc nếu chạy local:
   ```bash
   npm run db:seed
   ```

2. Hoặc tạo user mới thủ công qua Prisma Studio:
   ```bash
   # Trong Docker
   docker-compose exec app npx prisma studio
   
   # Hoặc local
   npx prisma studio
   ```

## Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Hoặc Makefile sẽ tự động tạo khi chạy `make build` hoặc `make up`.

Sau đó chỉnh sửa file `.env` và điền các giá trị:

### Database
- **POSTGRES_USER**: Username cho PostgreSQL (mặc định: `postgres`)
- **POSTGRES_PASSWORD**: Password cho PostgreSQL (mặc định: `postgres`)
- **POSTGRES_DB**: Tên database (mặc định: `landingpage`)
- **POSTGRES_PORT**: Port PostgreSQL (mặc định: `5432`)
- **DATABASE_URL**: Connection string cho PostgreSQL
  - Local: `postgresql://postgres:postgres@localhost:5432/landingpage?schema=public`
  - Docker: Sẽ tự động dùng hostname `postgres` thay vì `localhost`

### App
- **APP_PORT**: Port của ứng dụng (mặc định: `3000`)
- **NODE_ENV**: Environment (`production` hoặc `development`)

### NextAuth
- **NEXTAUTH_SECRET**: Secret key cho NextAuth (bắt buộc, generate: `openssl rand -base64 32`)
- **NEXTAUTH_URL**: URL của ứng dụng (mặc định: `http://localhost:3000`)

### SMTP Email Configuration
- **SMTP_HOST**: SMTP server host
- **SMTP_PORT**: SMTP port (mặc định: `587`)
- **SMTP_USER**: SMTP username
- **SMTP_PASS**: SMTP password

### Admin & Webhook
- **ADMIN_EMAIL**: Email nhận thông báo từ contact form
- **WEBHOOK_URL**: (Optional) URL webhook cho third-party integrations
- **NEXT_PUBLIC_ADMIN_SUBDOMAIN**: Subdomain cho admin panel (mặc định: `admin`)

**Lưu ý:** 
- Đối với Gmail, bạn cần tạo App Password thay vì dùng mật khẩu thường
- **NEXTAUTH_SECRET** là bắt buộc và phải được generate ngẫu nhiên
- Trong Docker, `DATABASE_URL` sẽ tự động được build từ các biến `POSTGRES_*` với hostname là `postgres`

## Production Setup

### DNS Configuration

Cần cấu hình DNS records:
- `A` record cho domain chính → server IP
- `A` record cho `admin.yourdomain.com` → server IP
- Hoặc `CNAME` record cho `admin.yourdomain.com` → `yourdomain.com`

### Vercel

Vercel tự động hỗ trợ subdomain routing. Chỉ cần:
1. Add domain trong Vercel dashboard
2. Add subdomain `admin.yourdomain.com`
3. Deploy và subdomain sẽ tự động hoạt động

### Self-hosted

Cần reverse proxy (Nginx/Caddy) để route subdomain:
- Main domain → Next.js app
- Admin subdomain → Next.js app (middleware sẽ handle routing)
