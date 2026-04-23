#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY="$ROOT/deploy"

echo "→ Limpiando deploy anterior..."
rm -rf "$DEPLOY/gamaex-web" "$DEPLOY/gamaex-admin" "$DEPLOY/gamaex-api"
mkdir -p "$DEPLOY"

# ── Web ──────────────────────────────────────────────────────────────────────
echo "→ Preparando gamaex-web..."
cp -r "$ROOT/apps/web/.next/standalone/." "$DEPLOY/gamaex-web"
mkdir -p "$DEPLOY/gamaex-web/apps/web/.next"
cp -r "$ROOT/apps/web/.next/static" "$DEPLOY/gamaex-web/apps/web/.next/"
[ -d "$ROOT/apps/web/public" ] && cp -r "$ROOT/apps/web/public/." "$DEPLOY/gamaex-web/apps/web/public/"
echo "require('./apps/web/server.js');" > "$DEPLOY/gamaex-web/server.js"
echo '{"scripts":{"start":"node server.js"}}' > "$DEPLOY/gamaex-web/package.json"

# ── Admin ─────────────────────────────────────────────────────────────────────
echo "→ Preparando gamaex-admin..."
cp -r "$ROOT/apps/admin/.next/standalone/." "$DEPLOY/gamaex-admin"
mkdir -p "$DEPLOY/gamaex-admin/apps/admin/.next"
cp -r "$ROOT/apps/admin/.next/static" "$DEPLOY/gamaex-admin/apps/admin/.next/"
[ -d "$ROOT/apps/admin/public" ] && cp -r "$ROOT/apps/admin/public/." "$DEPLOY/gamaex-admin/apps/admin/public/"
echo "require('./apps/admin/server.js');" > "$DEPLOY/gamaex-admin/server.js"
echo '{"scripts":{"start":"node server.js"}}' > "$DEPLOY/gamaex-admin/package.json"

# ── API ───────────────────────────────────────────────────────────────────────
echo "→ Preparando gamaex-api..."
mkdir -p "$DEPLOY/gamaex-api/prisma"
cp -r "$ROOT/apps/api/dist" "$DEPLOY/gamaex-api/"
cp "$ROOT/packages/database/prisma/schema.prisma" "$DEPLOY/gamaex-api/prisma/"
echo "require('./dist/main');" > "$DEPLOY/gamaex-api/app.js"

cat > "$DEPLOY/gamaex-api/package.json" << 'JSON'
{
  "name": "gamaex-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node app.js",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.10",
    "@nestjs/core": "^10.3.10",
    "@nestjs/config": "^3.2.3",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-fastify": "^10.3.10",
    "@nestjs/schedule": "^4.1.0",
    "@nestjs/throttler": "^6.2.1",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "bcrypt": "^5.1.1",
    "ioredis": "^5.3.2",
    "axios": "^1.7.2",
    "class-validator": "^0.14.1",
    "class-transformer": "^0.5.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "@prisma/client": "^5.15.0",
    "prisma": "^5.15.0"
  }
}
JSON

echo ""
echo "✓ Packages listos en $DEPLOY"
du -sh "$DEPLOY"/*/
