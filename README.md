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

### Cách 1: Development với Docker (Khuyến nghị)

```bash
# Chạy cả app và database trong Docker
make dev-docker

# Hoặc thủ công:
docker-compose -f docker-compose.dev.yml up
```

Sau khi containers chạy, mở terminal khác để chạy migrations:
```bash
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate dev
```

### Cách 2: Development local (chỉ database trong Docker)

```bash
# Setup database với Docker
make db-up

# Cài đặt dependencies
make install

# Generate Prisma client
make db-generate

# Chạy migrations
make db-migrate

# Chạy dev server
make dev
```

### Cách 3: Production với Docker

```bash
# Build và chạy production
make docker-build
make docker-up

# Chạy migrations trong container
docker-compose exec app npx prisma migrate deploy
```

## Chạy Development Server

```bash
# Với Makefile (local)
make dev

# Với Docker
make dev-docker

# Hoặc thủ công
npm run dev
```

## Docker Commands

Xem tất cả commands có sẵn:
```bash
make help
```

Một số commands hữu ích:
```bash
make docker-up          # Khởi động tất cả services
make docker-down        # Dừng tất cả services
make docker-logs        # Xem logs
make docker-restart     # Restart services
make docker-clean       # Xóa containers và volumes
```

## Database Commands

```bash
make db-up              # Khởi động PostgreSQL
make db-down            # Dừng PostgreSQL
make db-migrate         # Chạy migrations
make db-reset           # Reset database
make db-seed            # Seed database (tạo admin user mẫu)
make db-studio          # Mở Prisma Studio
```

## Tạo Admin User

Sau khi setup database, bạn có thể:
1. Chạy seed để tạo admin user mẫu:
   ```bash
   make db-seed
   ```
   Email: `admin@example.com`
   Password: `admin123`

2. Hoặc tạo user mới thủ công qua Prisma Studio:
   ```bash
   make db-studio
   ```

## Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Sau đó chỉnh sửa file `.env` và điền các giá trị:

- **DATABASE_URL**: Connection string cho PostgreSQL
- **NEXTAUTH_SECRET**: Secret key cho NextAuth (generate random string)
- **NEXTAUTH_URL**: URL của ứng dụng
- **SMTP_***: Cấu hình email SMTP để gửi thông báo
- **ADMIN_EMAIL**: Email nhận thông báo từ contact form
- **WEBHOOK_URL**: (Optional) URL webhook cho third-party integrations

**Lưu ý:** 
- Đối với Gmail, bạn cần tạo App Password thay vì dùng mật khẩu thường
- Generate NEXTAUTH_SECRET: `openssl rand -base64 32`

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
