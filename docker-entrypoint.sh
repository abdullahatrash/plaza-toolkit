#!/bin/sh
set -e

# Enable corepack (pnpm)
corepack enable

# Check if database exists, if not initialize it
if [ ! -f /app/packages/database/prisma/dev.db ]; then
  echo "🌱 Database not found. Initializing..."
  cd /app/packages/database
  pnpm db:push
  pnpm db:seed
  echo "✅ Database initialized successfully"
else
  echo "📦 Database already exists, skipping initialization"
fi

# Start the application from workspace root
echo "🚀 Starting Next.js application..."
cd /app
exec pnpm --filter web start

