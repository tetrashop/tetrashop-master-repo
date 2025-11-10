# 🏪 تتراشاپ - مخزن اصلی

## پروژه‌های موجود:

$(for project in tetrashop-*/; do 
    if [ -d "$project" ]; then
        echo "- \`$project\`"
    fi
done)

## راهنمای استفاده:

```bash
# استقرار تمام پروژه‌ها
./scripts/deploy-all.sh

# بروزرسانی خودکار
./scripts/auto-update.sh
