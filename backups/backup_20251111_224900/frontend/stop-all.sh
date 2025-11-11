#!/bin/bash
echo "🛑 توقف سرویس‌ها..."
pkill -f "node.*local-proxy-enhanced"
pkill -f "python3 -m http.server"
echo "✅ سرویس‌ها متوقف شدند"
