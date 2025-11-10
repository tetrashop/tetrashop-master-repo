#!/bin/bash

echo "🚀 شروع دیپلوی در Vercel..."
echo "============================"

# تابع برای دیپلوی هر پروژه
deploy_project() {
    local project=$1
    echo "📦 در حال دیپلوی $project..."
    
    if [ -d "$project" ]; then
        cd "$project"
        
        # بررسی وجود package.json
        if [ -f "package.json" ]; then
            echo "🔧 بررسی پیکربندی $project..."
            
            # دیپلوی در Vercel
            npx vercel --prod --yes --token=$VERCEL_TOKEN
            
            if [ $? -eq 0 ]; then
                echo "✅ $project با موفقیت دیپلوی شد"
            else
                echo "⚠️  خطا در دیپلوی $project"
            fi
        else
            echo "⏭️  $project - فایل package.json یافت نشد (رد شد)"
        fi
        
        cd ..
    else
        echo "❌ پوشه $project یافت نشد"
    fi
    
    echo "---"
}

# لیست پروژه‌های اصلی برای دیپلوی
MAIN_PROJECTS=(
    "tetrashop-complete-platform"
    "tetrashop-commercial-platform"
    "tetrashop-pro-platform"
    "tetrashop-fixed-platform"
    "tetrashop-final-fixed"
    "tetrashop-final-perfect"
    "tetrashop-cloud-system"
)

# دریافت توکن Vercel (اگر وجود ندارد)
if [ -z "$VERCEL_TOKEN" ]; then
    echo "🔑 لطفاً توکن Vercel را وارد کنید:"
    read -s VERCEL_TOKEN
    export VERCEL_TOKEN
fi

# دیپلوی تمام پروژه‌های اصلی
for project in "${MAIN_PROJECTS[@]}"; do
    deploy_project "$project"
done

echo "🎉 دیپلوی تمام پروژه‌ها کامل شد!"
echo "📊 گزارش نهایی در https://vercel.com/dashboard قابل مشاهده است"
