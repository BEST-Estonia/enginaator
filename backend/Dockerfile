# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install only what's needed to generate Prisma Client
COPY package*.json ./
RUN npm ci

# Copy app sources (incl. prisma/)
COPY . .

# Generate Prisma Client (uses prisma devDependency)
RUN npx prisma generate

# ---------- runtime stage ----------
FROM node:20-alpine
WORKDIR /app

# Recommended in prod
ENV NODE_ENV=production

# Copy node_modules (incl. generated Prisma Client) ja kood
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./

EXPOSE 8000

CMD ["node", "src/server.js"]
