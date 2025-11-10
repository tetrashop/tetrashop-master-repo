#!/bin/bash

echo "📊 بررسی وضعیت استقرار..."
echo "========================"

# بررسی وضعیت Git
echo "🔍 وضعیت Git:"
git status --short

# بررسی آخرین کامیت
echo ""
echo "📝 آخرین کامیت:"
git log --oneline -1

# بررسی اتصال به GitHub
echo ""
echo "🌐 اتصال به GitHub:"
if git remote -v | grep -q "origin"; then
    echo "✅ متصل به GitHub"
else
    echo "❌ عدم اتصال به GitHub"
fi

# بررسی پروژه‌های مستقر شده
echo ""
echo "🚀 پروژه‌های مستقر شده:"
for project in */; do
    if [ -f "${project}package.json" ]; then
        if [ -f "${project}vercel.json" ] || [ -f "${project}.vercel/project.json" ]; then
            echo "✅ $project - پیکربندی Vercel دارد"
        else
            echo "⚠️  $project - پیکربندی Vercel ندارد"
        fi
    fi
done

# بررسی توکن Vercel
echo ""
echo "🔐 وضعیت توکن Vercel:"
if [ -f "/data/data/com.termux/files/home/.vercel-token" ]; then
    echo "✅ توکن Vercel ذخیره شده است"
else
    echo "❌ توکن Vercel یافت نشد"
fi

echo ""
echo "🎯 برای استقرار کامل اجرا کنید: ./auto-deploy-all.sh"
