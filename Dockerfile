# --- GIAI ĐOẠN 1: BUILD ---
FROM node:20-alpine AS builder

WORKDIR /app

# Sao chép package files
COPY package*.json ./

# Cài đặt tất cả dependencies (bao gồm dev)
RUN npm ci

# Sao chép toàn bộ source code
COPY . .

# Biên dịch Next.js (tạo .next folder)
# next.config.ts phải có: output: 'standalone' để tối ưu kích thước image
RUN npm run build

# --- GIAI ĐOẠN 2: RUN ---
FROM node:20-alpine

WORKDIR /app

# Cài đặt dumb-init để quản lý process signals
RUN apk add --no-cache dumb-init

# Tạo user không phải root (bảo mật)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Sao chép package files
COPY package*.json ./

# Cài đặt chỉ production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Chỉ lấy file được biên dịch từ builder (GIAI ĐOẠN 1)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Thay đổi quyền sở hữu file
RUN chown -R nodejs:nodejs /app

# Chuyển sang user không phải root
USER nodejs

# Mở cổng
EXPOSE 3000

# Biến môi trường
ENV NODE_ENV=production
ENV PORT=3000

# Health check - kiểm tra sức khỏe ứng dụng
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Lệnh "bật công tắc" để chạy ứng dụng
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
