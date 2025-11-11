#!/bin/bash

echo "🚀 راه‌اندازی سرور تتراشاپ"
echo "=========================="

# پورت پیشفرض
PORT=8000

# توقف سرورهای قبلی
echo "🛑 بررسی و توقف سرورهای قبلی..."
pkill -f "python3 -m http.server" 2>/dev/null

# منتظر آزاد شدن پورت
sleep 2

# بررسی آزاد بودن پورت
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ پورت $PORT هنوز occupied است"
    echo "🔍 جستجوی پروسه‌های مرتبط..."
    lsof -ti:$PORT | xargs kill -9
    sleep 2
fi

# راه‌اندازی سرور
echo "🌐 راه‌اندازی سرور روی پورت $PORT..."
python3 -m http.server $PORT &

# منتظر راه‌اندازی
sleep 3

# بررسی وضعیت
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ سرور با موفقیت راه‌اندازی شد"
    echo "📡 آدرس دسترسی: http://localhost:$PORT"
    echo ""
    echo "🎯 صفحات موجود:"
    echo "   • http://localhost:$PORT/ (نمای کامل)"
    echo "   • http://localhost:$PORT/index-complete.html"
    echo "   • http://localhost:$PORT/index-advanced-fixed.html"
    echo ""
    echo "🛑 برای توقف: pkill -f 'python3 -m http.server'"
else
    echo "❌ خطا در راه‌اندازی سرور"
    echo "💡 تلاش با پورت جایگزین..."
    python3 -m http.server 8080
fi
