# --- Base Stage ---
FROM node:24.20-slim AS base

# Configure pnpm home directory and update PATH
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install pnpm globally using npm (recommended for Node 24+)
RUN npm install -g pnpm@latest

WORKDIR /app

# --- Dependencies Stage ---
FROM base AS dependencies

# Copy package configuration files
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies using BuildKit caching
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# --- Build Stage ---
FROM dependencies AS build

# Copy remaining source code and build the project
COPY . .
RUN pnpm run build

# --- Production Stage ---
FROM base AS production

ENV NODE_ENV=production

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies (tsx needed for runtime)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# Copy source and tsconfig for tsx runtime resolution
COPY --from=build /app/src ./src
COPY --from=build /app/tsconfig.json ./

EXPOSE 3000

CMD [ "pnpm", "exec", "tsx", "src/server.ts" ]
