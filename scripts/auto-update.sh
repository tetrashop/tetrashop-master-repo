#!/bin/bash
echo "🔄 بروزرسانی خودکار مخزن تتراشاپ"
echo "================================"
cd /data/data/com.termux/files/home/tetrashop-master-repo
git add .
git commit -m "Auto-update: $(date +'%Y-%m-%d %H:%M:%S')" || true
git push origin main
echo "✅ بروزرسانی کامل شد"
