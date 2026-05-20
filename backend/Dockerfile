FROM richarvey/nginx-php-fpm:latest
WORKDIR /var/www/html

COPY . .

# لا توقف composer
ENV SKIP_COMPOSER=0

ENV WEBROOT=/var/www/html/public
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PHP_FPM_LISTEN=9000
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

# تثبيت dependencies بشكل إجباري
RUN composer install --no-dev --optimize-autoloader

# إصلاح صلاحيات Laravel
RUN chmod -R 777 storage bootstrap/cache

# تنظيف كاش Laravel (مهم جدًا)
RUN php artisan config:clear || true
RUN php artisan cache:clear || true

CMD ["/start.sh"]
