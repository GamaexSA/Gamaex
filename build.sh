#!/bin/bash
set -e

echo "--- Installing dependencies ---"
pnpm install --no-frozen-lockfile

echo "--- Building @gamaex/types ---"
(cd packages/types && pnpm build)

echo "--- Generating Prisma client ---"
(cd packages/database && pnpm db:generate)

echo "--- Building @gamaex/api ---"
(cd apps/api && pnpm build)

echo "--- Done ---"
