#!/usr/bin/env bash
# Spins up a throwaway Postgres cluster, applies the stubs, migration and seed, then runs the RLS tests.
# Needs Postgres 15+ binaries. On Debian/Ubuntu: /usr/lib/postgresql/16/bin. Run as root or any user that may su to postgres.
set -euo pipefail
PGBIN=${PGBIN:-/usr/lib/postgresql/16/bin}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
DATA=$(mktemp -d /tmp/pgtest.XXXXXX); chmod 777 "$DATA"
PORT=${PGPORT:-54329}
RUN="su postgres -c"
$RUN "$PGBIN/initdb -D $DATA/db -A trust >/dev/null"
$RUN "$PGBIN/pg_ctl -D $DATA/db -o '-p $PORT -k /tmp' -l $DATA/log -w start >/dev/null"
trap '$RUN "$PGBIN/pg_ctl -D $DATA/db -m immediate stop >/dev/null" || true; rm -rf "$DATA"' EXIT
PSQL="psql -h /tmp -p $PORT -U postgres -v ON_ERROR_STOP=1 -q"
$RUN "$PSQL -c 'create database app'" 
PSQL="$PSQL -d app"
for f in supabase/tests/00_stub.sql supabase/migrations/0001_schema.sql supabase/migrations/0002_contact.sql supabase/migrations/0003_grants.sql supabase/seed.sql supabase/tests/10_rls.sql; do
  echo "-- applying $f"; $RUN "$PSQL -f $ROOT/$f"
done
