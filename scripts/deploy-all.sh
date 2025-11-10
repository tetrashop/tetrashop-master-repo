#!/bin/bash
echo "🚀 استقرار تمام پروژه‌های تتراشاپ"
echo "================================"
for project in tetrashop-*/; do
    if [ -d "$project" ]; then
        echo "📦 استقرار $project..."
        cd "$project"
        npx vercel --prod --yes
        cd ..
        echo "---"
    fi
done
echo "🎉 تمام پروژه‌ها استقرار یافتند!"
