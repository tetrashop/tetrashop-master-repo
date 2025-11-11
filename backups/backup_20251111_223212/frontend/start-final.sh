#!/bin/bash

echo "🚀 راه‌اندازی نهایی سیستم تتراشاپ"
echo "=================================="

# توقف سرویس‌های قبلی
echo "🛑 توقف سرویس‌های قبلی..."
pkill -f "node.*local-proxy" 2>/dev/null
pkill -f "python3 -m http.server" 2>/dev/null
sleep 2

# راه‌اندازی پروکسی پیشرفته
echo "🔧 راه‌اندازی پروکسی پیشرفته..."
node local-proxy-enhanced.js &
PROXY_PID=$!
echo "📝 PID پروکسی: $PROXY_PID"
sleep 3

# تست اتصال
echo "🔍 تست اتصال..."
curl -s "http://localhost:3003/?url=https://backend-itlhc5q0v-ramin-edjlal-s-projects.vercel.app/health" > /dev/null && echo "✅ پروکسی فعال" || echo "⚠️ پروکسی ممکن است مشکل داشته باشد"

# راه‌اندازی فرانت‌اند
echo "🌐 راه‌اندازی واسط کاربری..."
python3 -m http.server 8000 &
FRONTEND_PID=$!
echo "📝 PID فرانت‌اند: $FRONTEND_PID"

echo ""
echo "🎉 سیستم آماده است!"
echo "🌐 آدرس: http://localhost:8000"
echo ""
echo "💡 برای تست:"
echo "1. مرورگر رو باز کن"
echo "2. منتظر باش 'اتصال برقرار شد' رو ببینی"  
echo "3. روی دکمه جستجو کلیک کن"
echo ""
echo "🛑 برای توقف: ./stop-all.sh"

# ایجاد اسکریپت توقف
cat > stop-all.sh << 'STOP_EOF'
#!/bin/bash
echo "🛑 توقف سرویس‌ها..."
pkill -f "node.*local-proxy-enhanced"
pkill -f "python3 -m http.server"
echo "✅ سرویس‌ها متوقف شدند"
STOP_EOF
chmod +x stop-all.sh

wait
