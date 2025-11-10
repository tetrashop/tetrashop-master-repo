#!/bin/bash

echo "🏪 مدیریت حرفه‌ای تمام پروژه‌های تتراشاپ"
echo "========================================"

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# تابع برای نمایش وضعیت پروژه‌ها
show_status() {
    echo -e "${BLUE}📊 وضعیت پروژه‌ها:${NC}"
    echo "----------------"
    
    total_projects=0
    total_size=0
    total_files=0
    
    for project in tetrashop-*/; do
        if [ -d "$project" ]; then
            size=$(du -sh "$project" 2>/dev/null | cut -f1)
            files=$(find "$project" -type f 2>/dev/null | wc -l)
            echo -e "${GREEN}✅ $project${NC} | حجم: $size | فایل‌ها: $files"
            
            total_projects=$((total_projects + 1))
            total_files=$((total_files + files))
        fi
    done
    
    echo "----------------"
    echo -e "${YELLOW}📈 جمع کل: $total_projects پروژه | $total_files فایل${NC}"
    echo ""
}

# تابع برای دیپلوی پروژه
deploy_project() {
    local project=$1
    echo -e "${BLUE}🚀 در حال استقرار $project...${NC}"
    
    if [ -d "$project" ]; then
        cd "$project"
        
        # بررسی وجود package.json
        if [ -f "package.json" ]; then
            echo -e "${YELLOW}📦 نصب dependencies...${NC}"
            npm install --silent
            
            echo -e "${YELLOW}🌐 استقرار روی Vercel...${NC}"
            npx vercel --prod --yes --quiet
        else
            echo -e "${RED}❌ فایل package.json یافت نشد${NC}"
        fi
        
        cd ..
        echo -e "${GREEN}✅ $project با موفقیت استقرار یافت${NC}"
    else
        echo -e "${RED}❌ پروژه $project یافت نشد${NC}"
    fi
}

# منوی اصلی
while true; do
    echo -e "${BLUE}🎯 انتخاب عملیات:${NC}"
    echo "1) نمایش وضعیت تمام پروژه‌ها"
    echo "2) استقرار تمام پروژه‌ها"
    echo "3) استقرار پروژه خاص"
    echo "4) بروزرسانی از GitHub"
    echo "5) پوش به GitHub"
    echo "6) خروج"
    echo ""
    
    read -p "لطفاً عدد مورد نظر را وارد کنید (1-6): " choice
    
    case $choice in
        1)
            show_status
            ;;
        2)
            echo -e "${BLUE}🚀 استقرار تمام پروژه‌ها...${NC}"
            for project in tetrashop-*/; do
                if [ -d "$project" ]; then
                    deploy_project "${project%/}"
                    echo "---"
                fi
            done
            echo -e "${GREEN}🎉 تمام پروژه‌ها استقرار یافتند!${NC}"
            ;;
        3)
            echo -e "${YELLOW}📁 پروژه‌های موجود:${NC}"
            for project in tetrashop-*/; do
                if [ -d "$project" ]; then
                    echo "- ${project%/}"
                fi
            done
            echo ""
            read -p "نام پروژه را وارد کنید: " project_name
            deploy_project "$project_name"
            ;;
        4)
            echo -e "${BLUE}📥 بروزرسانی از GitHub...${NC}"
            git pull origin main
            echo -e "${GREEN}✅ بروزرسانی کامل شد${NC}"
            ;;
        5)
            echo -e "${BLUE}📤 آپلود به GitHub...${NC}"
            git add .
            git commit -m "Auto-update: $(date +'%Y-%m-%d %H:%M:%S')"
            git push origin main
            echo -e "${GREEN}✅ آپلود کامل شد${NC}"
            ;;
        6)
            echo -e "${GREEN}👋 خداحافظ!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ انتخاب نامعتبر! لطفاً عدد 1 تا 6 وارد کنید.${NC}"
            ;;
    esac
    
    echo ""
    read -p "ادامه می‌دهید؟ (y/n): " continue
    if [ "$continue" != "y" ] && [ "$continue" != "Y" ]; then
        echo -e "${GREEN}👋 خداحافظ!${NC}"
        exit 0
    fi
    echo ""
done
