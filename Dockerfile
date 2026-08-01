# syntax=docker/dockerfile:1

# =========================================================================
# Base: Node 22 sobre Alpine + iputils (ping ICMP con soporte de -W para el
# sondeo de estado). El acceso a la red local (WoL / ICMP) exige que el
# contenedor use la red del host (network_mode: host) en el compose.
# =========================================================================
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache iputils

# --- Dependencias completas (incluye dev, necesarias para el build) ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --- Build de Astro (genera dist/server/entry.mjs + dist/client) ---
FROM deps AS build
COPY . .
RUN npm run build

# --- Solo dependencias de producción, para una imagen final ligera ---
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# =========================================================================
# Runtime (staging / prod): imagen mínima con el servidor SSR standalone.
# =========================================================================
FROM base AS runtime
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ENV DATA_FILE=/data/devices.json

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 4321
VOLUME ["/data"]
CMD ["node", "./dist/server/entry.mjs"]

# =========================================================================
# Dev: hot reload. El código fuente se monta por volumen desde el compose.
# =========================================================================
FROM deps AS dev
ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV DATA_FILE=/data/devices.json

EXPOSE 4321
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
