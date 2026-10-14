#!/bin/sh
set -eu

: "${APP_KEY:?Set a stable Laravel APP_KEY in Render before starting the service.}"
: "${FRONTEND_URL:?Set FRONTEND_URL to your Vercel origin.}"

if [ "${APP_ENV:-}" = "production" ] && [ "${DB_CONNECTION:-}" != "pgsql" ]; then
    echo "Production requires DB_CONNECTION=pgsql for Supabase." >&2
    exit 1
fi

PORT="${PORT:-10000}"
case "$PORT" in
    ''|*[!0-9]*) echo "PORT must be a number." >&2; exit 1 ;;
esac

printf 'Listen %s\n' "$PORT" > /etc/apache2/ports.conf
sed -i "s/__PORT__/$PORT/g" /etc/apache2/sites-available/000-default.conf

php artisan config:cache
php artisan migrate --force
php artisan db:seed --class=AdminUserSeeder --force
php artisan route:cache
php artisan view:cache

exec docker-php-entrypoint apache2-foreground

