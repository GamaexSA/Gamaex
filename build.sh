#!/bin/bash
set -e

echo "--- Installing dependencies ---"
pnpm install --no-frozen-lockfile

echo "--- Generating Prisma client ---"
(cd packages/database && pnpm run db:generate)

echo "--- Building API ---"
(cd apps/api && pnpm run build)

echo "--- Done ---"
