# 1. Stage Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Stage Builder (KRUSIAL DI SINI)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Terima ARG dari GitHub Actions dan jadikan ENV untuk diproses Next.js saat build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# 3. Stage Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Buat user sistem
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Salin hasil build (Pastikan kepemilikan file oleh nextjs agar sed bisa mengubah file)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# (Entrypoint hack dihapus, jalankan langsung lewat CMD)

# Gunakan user non-root demi keamanan (Pastikan file .next bisa ditulis oleh user ini)
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Perintah ini akan diteruskan oleh exec "$@" di entrypoint.sh
CMD ["npm", "start"]