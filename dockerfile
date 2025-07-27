# --- Build Stage ---
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false --ignore-scripts

# Copy source files and build
COPY . .
RUN yarn build

# Remove devDependencies (keeping only production deps)
RUN yarn install --frozen-lockfile --production --ignore-scripts && \
    rm -rf /app/.yarn /app/.yarn-cache /app/cache /app/test /app/docs

# --- Runtime Stage: Using Google Distroless (very small) ---
FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

# Copy only what’s needed
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Application runs without a shell
CMD ["dist/main.js"]
