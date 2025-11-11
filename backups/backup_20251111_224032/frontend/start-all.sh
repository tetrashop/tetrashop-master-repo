#!/bin/bash

echo "🚀 راه‌اندازی کامل سیستم تتراشاپ"
echo "=================================="

# توقف سرویس‌های قبلی
echo "🛑 توقف سرویس‌های قبلی..."
pkill -f "node.*local-proxy" 2>/dev/null
pkill -f "python3 -m http.server" 2>/dev/null
sleep 2

# راه‌اندازی پروکسی
echo "🔧 راه‌اندازی پروکسی محلی (پورت 3003)..."
node local-proxy.js &
PROXY_PID=$!
echo "📝 PID پروکسی: $PROXY_PID"

# انتظار برای راه‌اندازی پروکسی
sleep 3

# تست پروکسی
echo "🔍 تست اتصال پروکسی..."
if curl -s "http://localhost:3003/?url=https://backend-itlhc5q0v-ramin-edjlal-s-projects.vercel.app/health" > /dev/null; then
    echo "✅ پروکسی با موفقیت راه‌اندازی شد"
else
    echo "❌ مشکل در راه‌اندازی پروکسی"
    echo "💡 در حال تلاش مجدد..."
    sleep 2
    # تلاش مجدد
    if curl -s "http://localhost:3003/?url=https://backend-itlhc5q0v-ramin-edjlal-s-projects.vercel.app/health" > /dev/null; then
        echo "✅ پروکسی در تلاش دوم موفق شد"
    else
        echo "❌ مشکل در راه‌اندازی پروکسی ادامه دارد"
        exit 1
    fi
fi

# راه‌اندازی فرانت‌اند
echo "🌐 راه‌اندازی واسط کاربری (پورت 8000)..."
python3 -m http.server 8000 &
FRONTEND_PID=$!
echo "📝 PID فرانت‌اند: $FRONTEND_PID"

sleep 2

echo ""
echo "🎉 سیستم با موفقیت راه‌اندازی شد!"
echo ""
echo "📊 آدرس‌های دسترسی:"
echo "   🌐 واسط کاربری: http://localhost:8000"
echo "   🔧 پروکسی: http://localhost:3003"
echo ""
echo "🛑 برای توقف:"
echo "   pkill -f 'node.*local-proxy'"
echo "   pkill -f 'python3 -m http.server'"
echo ""
echo "📝 لاگ پروکسی در ترمینال اول نمایش داده می‌شود"

# نگه داشتن اسکریپت
wait
