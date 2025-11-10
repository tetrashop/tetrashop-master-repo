#!/bin/bash

echo "⚡ استقرار سریع در حال اجرا..."
echo "============================="

# بروزرسانی GitHub
echo "🔄 بروزرسانی GitHub..."
git add . > /dev/null 2>&1
git commit -m "Quick deploy: $(date)" > /dev/null 2>&1
git push origin main > /dev/null 2>&1

# استقرار پروژه‌های اصلی در Vercel
echo "🌐 استقرار در Vercel..."
for project in tetrashop-complete-platform tetrashop-commercial-platform tetrashop-pro-platform; do
    if [ -d "$project" ] && [ -f "$project/package.json" ]; then
        echo "📦 $project..."
        cd "$project"
        npx vercel --prod --yes > /dev/null 2>&1 &
        cd ..
    fi
done

# منتظر تمام شدن پردازه‌ها
wait

echo "✅ استقرار سریع کامل شد!"
