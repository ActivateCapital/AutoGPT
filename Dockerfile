# Production Dockerfile for CreAI Platform (Monorepo)
# This Dockerfile builds from the repository root and targets apps/web

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files from apps/web
COPY apps/web/package.json apps/web/package-lock.json* ./
COPY packages/db/package.json packages/db/

# Install dependencies
RUN npm ci

# Stage 2: Database Setup
FROM node:20-alpine AS db-setup
WORKDIR /app

# Copy database package
COPY packages/db ./packages/db/
COPY --from=deps /app/node_modules ./node_modules

# Generate Prisma client
WORKDIR /app/packages/db
RUN npx prisma generate

# Stage 3: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy database package with generated Prisma client
COPY --from=db-setup /app/packages/db ./packages/db

# Copy web app source
COPY apps/web ./apps/web

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the Next.js app
WORKDIR /app/apps/web
RUN npm run build

# Stage 4: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Copy Prisma client
COPY --from=builder --chown=nextjs:nodejs /app/packages/db ./packages/db

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the app (standalone build puts server.js at root of standalone folder)
CMD ["node", "server.js"]
