#!/usr/bin/env bash

echo "Installing dependencies..."
composer install --no-dev --optimize-autoloader --working-dir=/var/www/html

echo "Generating APP KEY if missing..."
php artisan key:generate --force

echo "Clearing old caches..."
php artisan config:clear
php artisan route:clear
php artisan cache:clear

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Running migrations..."
php artisan migrate --force

echo "Deployment done 🚀"
