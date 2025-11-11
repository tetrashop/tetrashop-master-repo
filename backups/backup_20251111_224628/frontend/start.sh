#!/bin/bash

echo "🚀 راه‌اندازی واسط کاربری تتراشاپ..."
echo "======================================"

# بررسی وجود پایتون
if command -v python3 &> /dev/null; then
    echo "✅ Python3 پیدا شد"
    echo "🌐 در حال راه‌اندازی سرور روی http://localhost:8000"
    python3 -m http.server 8000
elif command -v php &> /dev/null; then
    echo "✅ PHP پیدا شد"
    echo "🌐 در حال راه‌اندازی سرور روی http://localhost:8000"
    php -S localhost:8000
else
    echo "❌ هیچ سرور داخلی پیدا نشد"
    echo "📦 لطفاً Node.js یا Python یا PHP نصب کنید"
    exit 1
fi
