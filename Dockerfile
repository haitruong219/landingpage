# Dockerfile (multi-stage) - đã bật Prisma CLI trong runner

# -----------------------
# Stage: base
# -----------------------
    FROM node:20-alpine AS base
    # cần libc6-compat cho 1 số binary
    RUN apk add --no-cache libc6-compat openssl
    WORKDIR /app
    ENV NEXT_TELEMETRY_DISABLED=1
    
    # -----------------------
    # Stage: deps
    # cài dependencies (cho cả dev & prod trong stage này)
    # -----------------------
    FROM base AS deps
    COPY package.json package-lock.json* ./
    # Cài full node_modules (bao gồm devDeps) để builder có thể dùng
    RUN npm ci --legacy-peer-deps
    
    # -----------------------
    # Stage: builder
    # build app, và generate Prisma client
    # -----------------------
    FROM base AS builder
    # copy node_modules đã cài ở deps
    COPY --from=deps /app/node_modules ./node_modules
    # copy source
    COPY . .
    # Set một DATABASE_URL dummy cho prisma generate (không cần DB thật)
    ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
    
    # Generate Prisma client (đảm bảo prisma client tồn tại trước khi build)
    RUN npx prisma generate
    
    # Build Next app
    RUN npm run build
    
    # -----------------------
    # Stage: runner (production)
    # copy output, đảm bảo prisma CLI có trong image
    # -----------------------
    FROM node:20-alpine AS runner
    RUN apk add --no-cache libc6-compat openssl
    WORKDIR /app
    
    # Copy built outputs từ builder
    # Nếu bạn dùng Next standalone output, .next/standalone sẽ được copy
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static
    COPY --from=builder /app/prisma ./prisma
    
    # Copy package.json để Prisma biết output path (cần cho prisma generate)
    COPY --from=builder /app/package.json ./package.json
    
    # Copy node_modules từ deps (chứa dependencies cần thiết để chạy)
    COPY --from=deps /app/node_modules ./node_modules
    
    # Copy Prisma client đã generate từ builder (bao gồm cả .prisma và @prisma)
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
    
    # Cài Prisma CLI vào production image để có `prisma` sẵn
    # Dùng --no-save để không thay package.json
    RUN npm install --legacy-peer-deps --no-save prisma@5.7.0
    
    # Không cần generate lại vì đã copy Prisma client từ builder
    # Prisma client đã được generate với schema đúng trong builder stage
    
    # (Tùy chọn) cài Prisma Client phiên bản tương thích nếu cần
    # RUN npm install --legacy-peer-deps --no-save @prisma/client@5.7.0
    
    ENV NODE_ENV=production
    
    # Tạo user không root
    RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
    
    USER nextjs
    EXPOSE 3000
    
    ENV PORT=3000
    ENV HOSTNAME="0.0.0.0"
    
    # Nếu bạn dùng Next standalone, server.js nằm trong standalone
    CMD ["node", "server.js"]
    