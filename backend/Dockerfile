# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma schema BEFORE npm ci (needed for postinstall script)
COPY prisma ./prisma

# Install dependencies (this will run postinstall which does prisma generate)
RUN npm ci

# Copy rest of app sources
COPY . .

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
