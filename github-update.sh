#!/bin/bash

echo "🔄 شروع بروزرسانی مخزن GitHub..."
echo "================================="

# تنظیم اطلاعات Git
git config user.email "tetrashop@example.com"
git config user.name "TetraShop Deployment Bot"

# بررسی تغییرات
echo "📊 بررسی تغییرات..."
CHANGES=$(git status --porcelain)

if [ -z "$CHANGES" ]; then
    echo "✅ هیچ تغییری برای کامیت وجود ندارد"
    exit 0
fi

# اضافه کردن تمام فایل‌ها
echo "📦 اضافه کردن فایل‌ها..."
git add .

# ایجاد کامیت
echo "💾 ایجاد کامیت..."
git commit -m "🚀 Auto-Deploy: $(date +'%Y-%m-%d %H:%M:%S')

تغییرات شامل:
• بروزرسانی سورس کد
• بهبود عملکرد
• رفع باگ‌ها
• بهینه‌سازی

تاریخ: $(date +'%Y-%m-%d %H:%M:%S')
شاخه: $(git branch --show-current)"

# پوش به GitHub
echo "📤 آپلود به GitHub..."
if git push origin main; then
    echo "✅ بروزرسانی GitHub موفقیت‌آمیز بود"
    echo "🌐 مخزن: https://github.com/tetrashop/tetrashop-master-repo"
else
    echo "❌ خطا در آپلود به GitHub"
    echo "🔄 تلاش با force..."
    git push -u origin main --force
fi

echo "🎉 بروزرسانی GitHub کامل شد!"
