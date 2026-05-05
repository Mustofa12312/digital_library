#!/bin/bash
# ABDImu Setup Script - Platform Terintegrasi Penelitian dan Pengabdian Masyarakat IAIMU
# Run: bash setup.sh

set -e
echo "========================================="
echo "  ABDImu Setup - Backend + Frontend"
echo "========================================="

PROJECT_DIR=$(pwd)

# ==========================================
# BACKEND - Laravel
# ==========================================
echo ""
echo ">>> [1/5] Creating Laravel backend..."
composer create-project laravel/laravel backend --prefer-dist -q

cd backend

echo ">>> [2/5] Installing Laravel packages..."
composer require laravel/sanctum -q

echo ">>> [3/5] Setting up .env..."
cp .env.example .env
# Use SQLite for easy local dev
sed -i 's/DB_CONNECTION=mysql/DB_CONNECTION=sqlite/' .env
sed -i 's/DB_HOST=127.0.0.1/# DB_HOST=127.0.0.1/' .env
sed -i 's/DB_PORT=3306/# DB_PORT=3306/' .env
sed -i 's/DB_DATABASE=laravel/# DB_DATABASE=laravel/' .env
sed -i 's/DB_USERNAME=root/# DB_USERNAME=root/' .env
sed -i 's/DB_PASSWORD=/# DB_PASSWORD=/' .env
touch database/database.sqlite

php artisan key:generate --quiet
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" --quiet

echo ">>> [4/5] Running migrations & seeders..."
php artisan migrate --seed --force

echo ""
echo "========================================="
echo "  Backend setup done! Laravel at ./backend"
echo "========================================="

cd "$PROJECT_DIR"

# ==========================================
# FRONTEND - React + Vite
# ==========================================
echo ""
echo ">>> [5/5] Creating React + Vite frontend..."
npm create vite@latest frontend -- --template react --yes 2>/dev/null || npx create-vite@latest frontend --template react

cd frontend
npm install --silent
npm install axios react-router-dom react-hot-toast recharts @headlessui/react --silent
npm install -D tailwindcss postcss autoprefixer --silent
npx tailwindcss init -p --quiet

echo ""
echo "========================================="
echo "  Frontend setup done! React at ./frontend"
echo "========================================="
echo ""
echo ">>> DONE! Run:"
echo "    cd backend && php artisan serve"
echo "    cd frontend && npm run dev"
