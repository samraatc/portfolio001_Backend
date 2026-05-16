FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Install dependencies (cached when package.json unchanged)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy source
COPY src ./src

# Create a non-root user
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]
