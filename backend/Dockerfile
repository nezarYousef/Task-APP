FROM richarvey/nginx-php-fpm:3.1.6

COPY . .

# إعدادات الصورة  osama
ENV SKIP_COMPOSER 0
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# إعدادات Laravel
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# السماح لـ Composer بالعمل
ENV COMPOSER_ALLOW_SUPERUSER 1


RUN composer install --no-dev --optimize-autoloader

RUN chmod -R 777 storage bootstrap/cache
CMD ["/start.sh"]
