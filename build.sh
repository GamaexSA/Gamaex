#!/bin/bash
set -e

echo "--- Installing dependencies ---"
pnpm install --no-frozen-lockfile

echo "--- Building @gamaex/types ---"
(cd packages/types && pnpm run build)

echo "--- Generating Prisma client ---"
(cd packages/database && pnpm run db:generate)

echo "--- Building @gamaex/api ---"
(cd apps/api && pnpm run build)

echo "--- Done ---"
