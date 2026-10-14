FROM php:8.4-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libpq-dev libonig-dev libzip-dev libsqlite3-dev \
    && docker-php-ext-install pdo_pgsql pdo_sqlite mbstring zip bcmath opcache \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html
COPY . .

ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts \
    && php artisan package:discover --ansi \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwX storage bootstrap/cache

COPY apache.conf /etc/apache2/sites-available/000-default.conf
RUN sed -i 's/\r$//' start.sh

EXPOSE 10000
CMD ["sh", "/var/www/html/start.sh"]

