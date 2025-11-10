# 🏪 تتراشاپ - مخزن اصلی تمام پروژه‌ها

## 📁 پروژه‌های موجود:

$(for project in tetrashop-*/; do 
    if [ -d "$project" ] && [ "$project" != "tetrashop-master-repo/" ]; then
        echo "- \`$project\`"
    fi
done)

## 🚀 راهنمای استفاده:

```bash
# استقرار تمام پروژه‌ها
./scripts/deploy-all.sh

# بروزرسانی خودکار
./scripts/auto-update.sh

## 💾 ذخیره در Git

```bash
# اضافه کردن تمام تغییرات
git add .

# بررسی وضعیت قبل از کامیت
echo "🔍 وضعیت قبل از کامیت:"
git status

# کامیت تغییرات
git commit -m "UPDATE: Add new projects and cleanup

$(for project in tetrashop-*/; do 
    if [ -d "$project" ] && [ "$project" != "tetrashop-master-repo/" ]; then
        echo "- $project"
    fi
done)

تغییرات:
- اضافه شدن پروژه‌های جدید
- پاک‌سازی فایل‌های غیرضروری
- بروزرسانی مستندات

تاریخ: $(date +'%Y-%m-%d %H:%M:%S')
تعداد پروژه‌ها: $(find . -maxdepth 1 -type d -name "tetrashop-*" | wc -l)"
