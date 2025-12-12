# --------------------------
# 1. Builder Stage
# --------------------------
FROM node:24-alpine AS builder
WORKDIR /app

# Enable Corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency definitions
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (dev + prod) for building
RUN pnpm install --frozen-lockfile

# Copy TypeScript config & source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript → JavaScript
RUN pnpm build

# --------------------------
# 2. Production Stage (Lightweight)
# --------------------------
FROM node:24-alpine AS production
WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Enable Corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only necessary files for production
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built output from builder
COPY --from=builder /app/dist ./dist

# Optional: copy static assets if needed
# COPY --from=builder /app/public ./public

# Expose the API port
EXPOSE 5000

# Start the API
CMD ["node", "dist/index.js"]
