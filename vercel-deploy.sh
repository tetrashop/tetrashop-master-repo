#!/bin/bash

echo "🚀 شروع استقرار در Vercel..."
echo "============================"

# فایل ذخیره توکن
TOKEN_FILE="/data/data/com.termux/files/home/.vercel-token"

# بررسی توکن Vercel
check_vercel_token() {
    if [ -f "$TOKEN_FILE" ]; then
        VERCEL_TOKEN=$(cat "$TOKEN_FILE")
        echo "🔑 توکن Vercel یافت شد"
        return 0
    fi
    
    if [ -n "$VERCEL_TOKEN" ]; then
        echo "🔑 توکن از متغیر محیطی خوانده شد"
        echo "$VERCEL_TOKEN" > "$TOKEN_FILE"
        chmod 600 "$TOKEN_FILE"
        return 0
    fi
    
    return 1
}

# دریافت توکن
get_vercel_token() {
    echo ""
    echo "🔐 برای استقرار نیاز به توکن Vercel دارید:"
    echo "📝 مراحل دریافت توکن:"
    echo "   1. به https://vercel.com/account/tokens بروید"
    echo "   2. با حساب GitHub خود وارد شوید"
    echo "   3. روی 'Create Token' کلیک کنید"
    echo "   4. نام 'TetraShop' را وارد کنید"
    echo "   5. توکن تولید شده را کپی کنید"
    echo ""
    read -s -p "🔑 توکن Vercel را وارد کنید: " token
    echo ""
    
    if [ -n "$token" ]; then
        VERCEL_TOKEN="$token"
        echo "$token" > "$TOKEN_FILE"
        chmod 600 "$TOKEN_FILE"
        echo "✅ توکن ذخیره شد"
        return 0
    else
        echo "❌ توکن وارد نشد"
        return 1
    fi
}

# تابع استقرار هر پروژه
deploy_project() {
    local project=$1
    echo ""
    echo "🔄 در حال استقرار $project..."
    
    if [ ! -d "$project" ]; then
        echo "❌ پوشه $project یافت نشد"
        return 1
    fi
    
    cd "$project"
    
    # بررسی وجود package.json
    if [ ! -f "package.json" ]; then
        echo "⏭️  پروژه Node.js نیست - رد شد"
        cd ..
        return 0
    fi
    
    echo "📦 تشخیص پروژه Node.js"
    
    # استقرار با Vercel
    echo "🌐 در حال استقرار در Vercel..."
    if npx vercel --prod --yes --token="$VERCEL_TOKEN" 2>&1 | tee deploy.log; then
        # استخراج URL از خروجی
        URL=$(grep -o 'https://[^ ]*' deploy.log | head -1)
        if [ -n "$URL" ]; then
            echo "✅ $project مستقر شد: $URL"
            echo "$URL" > "../${project}-url.txt"
        else
            echo "✅ $project مستقر شد (آدرس در فایل log ذخیره شد)"
        fi
    else
        echo "❌ خطا در استقرار $project"
    fi
    
    cd ..
    return 0
}

# اصلی
echo "🏁 شروع فرآیند استقرار..."

# بررسی توکن
if ! check_vercel_token; then
    if ! get_vercel_token; then
        echo "❌ بدون توکن نمی‌توان ادامه داد"
        exit 1
    fi
fi

# لیست پروژه‌های اصلی برای استقرار
PROJECTS=(
    "tetrashop-complete-platform"
    "tetrashop-commercial-platform"
    "tetrashop-pro-platform"
    "tetrashop-fixed-platform"
    "tetrashop-final-fixed"
    "tetrashop-final-perfect"
    "tetrashop-cloud-system"
)

echo "📋 پروژه‌های شناسایی شده برای استقرار:"
printf "• %s\n" "${PROJECTS[@]}"
echo ""

# استقرار هر پروژه
SUCCESSFUL_DEPLOYS=0
TOTAL_PROJECTS=${#PROJECTS[@]}

for project in "${PROJECTS[@]}"; do
    if deploy_project "$project"; then
        SUCCESSFUL_DEPLOYS=$((SUCCESSFUL_DEPLOYS + 1))
    fi
    echo "---"
done

# گزارش نهایی
echo ""
echo "🎉 استقرار کامل شد!"
echo "📊 گزارش نهایی:"
echo "   • کل پروژه‌ها: $TOTAL_PROJECTS"
echo "   • مستقر شده: $SUCCESSFUL_DEPLOYS"
echo "   • ناموفق: $((TOTAL_PROJECTS - SUCCESSFUL_DEPLOYS))"

if [ $SUCCESSFUL_DEPLOYS -gt 0 ]; then
    echo ""
    echo "🌐 آدرس‌های مستقر شده:"
    for project in "${PROJECTS[@]}"; do
        if [ -f "${project}-url.txt" ]; then
            URL=$(cat "${project}-url.txt")
            echo "   • $project: $URL"
        fi
    done
fi

echo ""
echo "📱 داشبورد Vercel: https://vercel.com/dashboard"
