#!/bin/sh
set -e
cd /app/apps/backend

# Safety: local containers must only ever talk to the bundled Postgres, never a hosted/production DB.
case "$DATABASE_URL" in
  *@db:5432/*|*@localhost:*|*@127.0.0.1:*) ;;
  *) echo "Refusing to start: DATABASE_URL does not point at the local 'db' container." >&2; exit 1 ;;
esac

# Wait for Postgres (compose also gates on a healthcheck; this is a safety net)
until node -e "const n=require('net');const u=new URL(process.env.DATABASE_URL);const s=n.connect(+u.port||5432,u.hostname).on('connect',()=>{s.end();process.exit(0)}).on('error',()=>process.exit(1))"; do
  echo "waiting for database..."; sleep 1
done

npx prisma generate
# The committed migrations don't cover the whole schema yet, so local dev syncs it directly.
npx prisma db push --skip-generate

if [ "${SEED_ON_START:-0}" = "1" ]; then
  pnpm db:seed
  ALLOW_DEMO_SEED=1 pnpm db:seed:demo
fi

exec pnpm exec next dev --turbopack --port 3001 --hostname 0.0.0.0
