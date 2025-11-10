#!/bin/bash

echo "⚡ استقرار فوق‌سریع پلتفرم تتراشاپ..."
echo "======================================"

# تنظیمات بهینه‌سازی سیستم
export NODE_OPTIONS="--max-old-space-size=4096 --experimental-vm-modules"
export UV_THREADPOOL_SIZE=128

# تابع استقرار فوق‌سریع
deploy_ultra_fast() {
    local project=$1
    echo "🚀 استقرار فوق‌سریع: $project"
    
    cd "$project"
    
    # ساخت بهینه
    if [ -f "package.json" ]; then
        echo "📦 ساخت بهینه $project..."
        
        # نصب فوق‌سریع با parallel
        npm ci --production --prefer-offline --no-audit --no-fund &
        PID1=$!
        
        # ساخت همزمان
        npm run build --if-present &
        PID2=$!
        
        # منتظر تمام شدن پردازه‌ها
        wait $PID1 $PID2
        
        # استقرار با Vercel
        if command -v vercel &> /dev/null; then
            echo "🌐 استقرار در Vercel..."
            vercel --prod --yes --token=$VERCEL_TOKEN 2>&1 | grep -E "(https://|deployment|ready)" &
        fi
    fi
    
    cd ..
}

# لیست پروژه‌ها برای استقرار موازی
PROJECTS=(
    "tetrashop-complete-platform"
    "tetrashop-commercial-platform"
    "tetrashop-pro-platform"
    "tetrashop-cloud-system"
    "tetrashop-chess-production"
)

# استقرار موازی
echo "🔄 شروع استقرار موازی..."
for project in "${PROJECTS[@]}"; do
    deploy_ultra_fast "$project" &
done

# منتظر تمام شدن همه پردازه‌ها
wait

echo "✅ استقرار فوق‌سریع کامل شد!"
echo "📊 زمان اتمام: $(date)"
