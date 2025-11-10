#!/bin/bash

echo "🏁 شروع فرآیند کامل استقرار..."
echo "=============================="
echo "⏰ زمان شروع: $(date)"
echo ""

# رنگ‌ها برای نمایش زیبا
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# تابع لاگ
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# مرحله ۱: بروزرسانی GitHub
log "مرحله ۱: بروزرسانی مخزن GitHub"
if ./github-update.sh; then
    log "بروزرسانی GitHub موفقیت‌آمیز بود"
else
    error "خطا در بروزرسانی GitHub"
    exit 1
fi

# مرحله ۲: استقرار در Vercel
echo ""
log "مرحله ۲: استقرار در Vercel"
if ./vercel-deploy.sh; then
    log "استقرار Vercel موفقیت‌آمیز بود"
else
    error "خطا در استقرار Vercel"
    exit 1
fi

# گزارش نهایی
echo ""
echo -e "${GREEN}
╔══════════════════════════════════════╗
║          🎉 استقرار کامل شد!        ║
╚══════════════════════════════════════╝
${NC}"

log "زمان پایان: $(date)"
echo ""
info "📋 اطلاعات مهم:"
echo "   • مخزن GitHub: https://github.com/tetrashop/tetrashop-master-repo"
echo "   • داشبورد Vercel: https://vercel.com/dashboard"
echo ""
info "🔧 برای استقرار مجدد اجرا کنید: ./auto-deploy-all.sh"
