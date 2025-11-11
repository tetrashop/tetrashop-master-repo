#!/bin/bash

# 🎨 رنگ‌های ترمینال
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 📊 متغیرهای جهانی
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$PROJECT_ROOT/monitor.log"
BACKUP_DIR="$PROJECT_ROOT/backups"
CONFIG_FILE="$PROJECT_ROOT/monitor-config.json"
ALGORITHM_DB="$PROJECT_ROOT/algorithm-database.json"

# 🔧 توابع کمکی
log_message() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success_msg() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning_msg() {
    echo -e "${YELLOW}⚠️ $1${NC}" | tee -a "$LOG_FILE"
}

error_msg() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

info_msg() {
    echo -e "${CYAN}ℹ️ $1${NC}" | tee -a "$LOG_FILE"
}

# 📁 ایجاد ساختار اولیه
initialize_monitor() {
    log_message "🔄 راه‌اندازی سیستم مانیتورینگ..."
    
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$PROJECT_ROOT/health-checks"
    mkdir -p "$PROJECT_ROOT/algorithm-fixes"
    
    # ایجاد فایل پیکربندی اگر وجود ندارد
    if [[ ! -f "$CONFIG_FILE" ]]; then
        cat > "$CONFIG_FILE" << 'CONFIG_EOF'
{
    "monitoring": {
        "interval_seconds": 30,
        "max_log_size_mb": 10,
        "backup_retention_days": 7,
        "auto_fix_enabled": true,
        "health_check_timeout": 10
    },
    "repositories": {
        "main": "~/tetrashop-master-repo",
        "frontend": "~/tetrashop-master-repo/frontend",
        "public": "~/tetrashop-master-repo/public"
    },
    "algorithms": {
        "cache_repair": true,
        "git_recovery": true,
        "service_monitor": true,
        "performance_optimizer": true
    },
    "notifications": {
        "enable_sound": true,
        "enable_desktop": false,
        "critical_errors_only": true
    }
}
CONFIG_EOF
        success_msg "فایل پیکربندی ایجاد شد"
    fi
    
    # ایجاد پایگاه داده الگوریتم‌ها
    if [[ ! -f "$ALGORITHM_DB" ]]; then
        cat > "$ALGORITHM_DB" << 'ALGO_EOF'
{
    "known_issues": {
        "git_conflicts": {
            "detection": "git status | grep -i conflict",
            "fix_command": "git add . && git commit -m 'Auto-resolve conflicts'",
            "severity": "high"
        },
        "port_conflicts": {
            "detection": "netstat -tulpn | grep -E '(8000|3003)' | grep -v grep",
            "fix_command": "pkill -f 'python3\\|node' && sleep 2",
            "severity": "medium"
        },
        "cache_corruption": {
            "detection": "grep -r 'localStorage' public/ | grep -i error",
            "fix_command": "echo 'localStorage.clear()' > public/cache-fix.js",
            "severity": "low"
        },
        "service_down": {
            "detection": "! ps aux | grep -E '(python3.*8000|node.*3003)' | grep -v grep",
            "fix_command": "cd public && python3 -m http.server 8000 & && node simple-proxy.js &",
            "severity": "critical"
        }
    },
    "optimization_rules": {
        "performance": {
            "check": "find public/ -name '*.html' -exec grep -l 'console.log' {} \\;",
            "action": "sed -i 's/console.log/\\/\\/ console.log/g'",
            "description": "حذف لاگ‌های کنسول برای تولید"
        },
        "security": {
            "check": "grep -r 'password\\|token\\|key' public/ --include='*.js' --include='*.html'",
            "action": "echo '⚠️ اطلاعات حساس شناسایی شد'",
            "description": "بررسی اطلاعات حساس"
        }
    }
}
ALGO_EOF
        success_msg "پایگاه داده الگوریتم‌ها ایجاد شد"
    fi
}

# 🔍 الگوریتم تشخیص مشکلات
detect_issues() {
    log_message "🔍 در حال تشخیص مشکلات سیستم..."
    
    local issues_found=0
    declare -A detected_issues
    
    # بررسی وضعیت Git
    if git status | grep -q -i "conflict"; then
        detected_issues["git_conflicts"]="تعارض در فایل‌های Git"
        ((issues_found++))
    fi
    
    # بررسی سرویس‌های فعال
    if ! ps aux | grep -q "[p]ython3.*8000"; then
        detected_issues["service_down"]="سرور فرانت‌اند متوقف شده"
        ((issues_found++))
    fi
    
    if ! ps aux | grep -q "[n]ode.*3003"; then
        detected_issues["proxy_down"]="سرور پروکسی متوقف شده"
        ((issues_found++))
    fi
    
    # بررسی پورت‌ها
    if netstat -tulpn 2>/dev/null | grep -q ":8000.*LISTEN"; then
        if ! ps aux | grep -q "[p]ython3.*8000"; then
            detected_issues["port_conflict"]="پورت 8000 توسط پروسه دیگری استفاده می‌شود"
            ((issues_found++))
        fi
    fi
    
    # بررسی فایل‌های خراب
    if find public/ -name "*.html" -exec grep -l "syntax error\\|undefined" {} \; | grep -q "."; then
        detected_issues["file_errors"]="خطاهای سینتکس در فایل‌ها شناسایی شد"
        ((issues_found++))
    fi
    
    # بررسی فضای دیسک
    local disk_usage=$(df . | awk 'NR==2 {print $5}' | sed 's/%//')
    if [[ $disk_usage -gt 90 ]]; then
        detected_issues["disk_space"]="فضای دیسک به اتمام نزدیک است: $disk_usage%"
        ((issues_found++))
    fi
    
    # نمایش نتایج تشخیص
    if [[ $issues_found -eq 0 ]]; then
        success_msg "هیچ مشکل جدی شناسایی نشد"
        return 0
    else
        warning_msg "تعداد $issues_found مشکل شناسایی شد:"
        for issue in "${!detected_issues[@]}"; do
            echo "  - ${detected_issues[$issue]}"
        done
        return $issues_found
    fi
}

# 🔧 الگوریتم ترمیم خودکار
auto_repair() {
    log_message "🔧 شروع ترمیم خودکار..."
    
    local repair_count=0
    
    # ترمیم Git
    if git status | grep -q -i "conflict"; then
        info_msg "ترمیم تعارضات Git..."
        git add . > /dev/null 2>&1
        git commit -m "Auto-repair: Conflict resolution $(date '+%Y-%m-%d %H:%M:%S')" > /dev/null 2>&1
        ((repair_count++))
    fi
    
    # راه‌اندازی سرویس‌های متوقف شده
    if ! ps aux | grep -q "[p]ython3.*8000"; then
        info_msg "راه‌اندازی مجدد سرور فرانت‌اند..."
        cd public && nohup python3 -m http.server 8000 > ../logs/frontend.log 2>&1 &
        sleep 3
        ((repair_count++))
    fi
    
    if ! ps aux | grep -q "[n]ode.*3003"; then
        info_msg "راه‌اندازی مجدد سرور پروکسی..."
        cd public && nohup node simple-proxy.js > ../logs/proxy.log 2>&1 &
        sleep 3
        ((repair_count++))
    fi
    
    # رهایی پورت‌های قفل شده
    if netstat -tulpn 2>/dev/null | grep -q ":8000.*LISTEN" && ! ps aux | grep -q "[p]ython3.*8000"; then
        info_msg "آزاد کردن پورت 8000..."
        fuser -k 8000/tcp > /dev/null 2>&1
        sleep 2
        ((repair_count++))
    fi
    
    # پاکسازی کش‌های موقت
    info_msg "پاکسازی فایل‌های موقت..."
    find . -name "*.tmp" -delete 2>/dev/null
    find . -name "*.log" -size +10M -delete 2>/dev/null
    
    if [[ $repair_count -gt 0 ]]; then
        success_msg "تعداد $repair_count مشکل ترمیم شد"
    else
        info_msg "هیچ ترمیمی لازم نبود"
    fi
}

# 📈 الگوریتم بهینه‌سازی عملکرد
performance_optimize() {
    log_message "📈 شروع بهینه‌سازی عملکرد..."
    
    local optimizations=0
    
    # فشرده‌سازی فایل‌های CSS و JS
    if command -v uglifyjs &> /dev/null; then
        info_msg "فشرده‌سازی فایل‌های JavaScript..."
        find public/ -name "*.js" -not -name "*.min.js" -exec uglifyjs {} -o {}.min \; -exec mv {}.min {} \;
        ((optimizations++))
    fi
    
    # حذف کامنت‌های HTML برای کاهش حجم
    info_msg "حذف کامنت‌های غیرضروری HTML..."
    find public/ -name "*.html" -exec sed -i '/<!--.*-->/d' {} \;
    ((optimizations++))
    
    # ایجاد فایل‌های کش برای عملکرد بهتر
    info_msg "ایجاد فایل‌های کش استاتیک..."
    cat > public/static-cache.js << 'CACHE_EOF'
// Static cache for better performance
const staticCache = {
    version: '1.0.' + Date.now(),
    resources: {
        css: [],
        js: [],
        html: []
    },
    init: function() {
        if (!localStorage.getItem('staticCacheVersion') || 
            localStorage.getItem('staticCacheVersion') !== this.version) {
            localStorage.clear();
            localStorage.setItem('staticCacheVersion', this.version);
        }
    }
};
staticCache.init();
CACHE_EOF
    ((optimizations++))
    
    success_msg "تعداد $optimizations بهینه‌سازی انجام شد"
}

# 🔄 الگوریتم بروزرسانی هوشمند
smart_update() {
    log_message "🔄 شروع بروزرسانی هوشمند..."
    
    # پشتیبان‌گیری قبل از بروزرسانی
    local backup_name="backup_$(date '+%Y%m%d_%H%M%S')"
    info_msg "ایجاد پشتیبان: $backup_name"
    mkdir -p "$BACKUP_DIR/$backup_name"
    cp -r public/ "$BACKUP_DIR/$backup_name/" 2>/dev/null
    cp -r frontend/ "$BACKUP_DIR/$backup_name/" 2>/dev/null
    
    # بروزرسانی از Git
    if git status &> /dev/null; then
        info_msg "بروزرسانی از مخزن Git..."
        git fetch origin
        git pull origin main
        
        # نصب وابستگی‌های جدید
        if [[ -f "package.json" ]]; then
            info_msg "نصب وابستگی‌های Node.js..."
            npm install
        fi
    fi
    
    # بروزرسانی الگوریتم‌ها
    info_msg "بروزرسانی پایگاه داده الگوریتم‌ها..."
    if [[ -f "$ALGORITHM_DB" ]]; then
        local current_version=$(jq -r '.version // "1.0.0"' "$ALGORITHM_DB" 2>/dev/null || echo "1.0.0")
        # در اینجا می‌توانید الگوریتم‌های جدید را اضافه کنید
        jq '.version = "1.0.'$(date +%s)'"' "$ALGORITHM_DB" > "$ALGORITHM_DB.tmp" && mv "$ALGORITHM_DB.tmp" "$ALGORITHM_DB"
    fi
    
    success_msg "بروزرسانی هوشمند کامل شد"
}

# 📊 الگوریتم گزارش‌دهی
generate_report() {
    log_message "📊 تولید گزارش وضعیت..."
    
    local report_file="$PROJECT_ROOT/health-report_$(date '+%Y%m%d_%H%M%S').json"
    
    cat > "$report_file" << REPORT_EOF
{
    "timestamp": "$(date '+%Y-%m-%d %H:%M:%S')",
    "system_health": {
        "git_status": "$(git status --porcelain | wc -l) تغییرات",
        "services_running": {
            "frontend": $(ps aux | grep -q "[p]ython3.*8000" && echo "true" || echo "false"),
            "proxy": $(ps aux | grep -q "[n]ode.*3003" && echo "true" || echo "false")
        },
        "disk_usage": "$(df . | awk 'NR==2 {print $5}')",
        "memory_usage": "$(free -m | awk 'NR==2{printf "%.2f%%", $3*100/$2}')"
    },
    "recent_activities": {
        "last_commit": "$(git log -1 --pretty=format:'%h - %s' 2>/dev/null || echo 'N/A')",
        "last_backup": "$(ls -t $BACKUP_DIR | head -1 || echo 'N/A')",
        "issues_fixed": "$(grep -c "مشکل ترمیم شد" $LOG_FILE 2>/dev/null || echo 0)"
    },
    "recommendations": {
        "optimizations": [
            "بررسی منظم لاگ‌ها",
            "پشتیبان‌گیری هفتگی",
            "آپدیت وابستگی‌ها"
        ]
    }
}
REPORT_EOF
    
    success_msg "گزارش کامل در $report_file ذخیره شد"
}

# 🎯 تابع اصلی مانیتورینگ
start_monitoring() {
    log_message "🚀 شروع سیستم مانیتورینگ هوشمند..."
    
    # راه‌اندازی اولیه
    initialize_monitor
    
    # حلقه مانیتورینگ پیوسته
    while true; do
        echo -e "\n${PURPLE}🔄 چرخه مانیتورینگ - $(date '+%H:%M:%S')${NC}"
        
        # تشخیص مشکلات
        if detect_issues; then
            success_msg "سیستم سالم است"
        else
            # ترمیم خودکار
            if jq -r '.monitoring.auto_fix_enabled' "$CONFIG_FILE" 2>/dev/null | grep -q "true"; then
                auto_repair
            else
                warning_msg "ترمیم خودکار غیرفعال است - مشکلات شناسایی شده نیاز به رسیدگی دستی دارند"
            fi
        fi
        
        # بهینه‌سازی دوره‌ای (هر 10 چرخه)
        local cycle_count=$(($(grep -c "چرخه مانیتورینگ" $LOG_FILE 2>/dev/null || 0) % 10))
        if [[ $cycle_count -eq 0 ]]; then
            performance_optimize
        fi
        
        # بروزرسانی هوشمند (هر 30 چرخه)
        if [[ $cycle_count -eq 0 ]]; then
            smart_update
            generate_report
        fi
        
        # انتظار برای چرخه بعدی
        local interval=$(jq -r '.monitoring.interval_seconds' "$CONFIG_FILE" 2>/dev/null || echo 30)
        info_msg "انتظار برای $interval ثانیه..."
        sleep $interval
    done
}

# 🆘 تابع کمک
show_help() {
    echo -e "${CYAN}
🤖 سیستم مانیتورینگ و ترمیم هوشمند تتراشاپ

استفاده:
  $0 [option]

آپشن‌ها:
  start       شروع مانیتورینگ پیوسته
  detect      فقط تشخیص مشکلات
  repair      ترمیم مشکلات شناسایی شده
  optimize    بهینه‌سازی عملکرد
  update      بروزرسانی هوشمند
  report      تولید گزارش وضعیت
  status      نمایش وضعیت فعلی
  help        نمایش این راهنما

مثال‌ها:
  $0 start    # شروع مانیتورینگ
  $0 detect   # تشخیص مشکلات
  $0 repair   # ترمیم خودکار
${NC}"
}

# 📋 نمایش وضعیت
show_status() {
    echo -e "${CYAN}
📊 وضعیت سیستم مانیتورینگ:

🖥️  سرویس‌ها:
  • فرانت‌اند: $(ps aux | grep -q "[p]ython3.*8000" && echo -e "${GREEN}✅ فعال${NC}" || echo -e "${RED}❌ غیرفعال${NC}")
  • پروکسی: $(ps aux | grep -q "[n]ode.*3003" && echo -e "${GREEN}✅ فعال${NC}" || echo -e "${RED}❌ غیرفعال${NC}")

📁 وضعیت Git:
  • تغییرات: $(git status --porcelain | wc -l) فایل
  • آخرین کامیت: $(git log -1 --pretty=format:'%h - %s' 2>/dev/null || echo 'N/A')

💾 منابع:
  • فضای دیسک: $(df . | awk 'NR==2 {print $5}')
  • حجم لاگ: $(du -h $LOG_FILE 2>/dev/null | cut -f1 || echo '0')

🔧 پیکربندی:
  • ترمیم خودکار: $(jq -r '.monitoring.auto_fix_enabled' $CONFIG_FILE 2>/dev/null || echo 'false')
  • فاصله چک: $(jq -r '.monitoring.interval_seconds' $CONFIG_FILE 2>/dev/null || echo '30') ثانیه
${NC}"
}

# 🎮 مدیریت آرگومان‌ها
case "${1:-}" in
    "start")
        start_monitoring
        ;;
    "detect")
        detect_issues
        ;;
    "repair")
        auto_repair
        ;;
    "optimize")
        performance_optimize
        ;;
    "update")
        smart_update
        ;;
    "report")
        generate_report
        ;;
    "status")
        show_status
        ;;
    "help"|"")
        show_help
        ;;
    *)
        error_msg "آپشن نامعتبر: $1"
        show_help
        exit 1
        ;;
esac
