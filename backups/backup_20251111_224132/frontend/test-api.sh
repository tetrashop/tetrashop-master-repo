#!/bin/bash

echo "🔍 تست اتصال به API تتراشاپ"
echo "============================"

API_BASE="https://backend-itlhc5q0v-ramin-edjlal-s-projects.vercel.app"

echo "1. تست سلامت API..."
curl -s -o /dev/null -w "کد وضعیت: %{http_code}\n" "$API_BASE/health"

echo ""
echo "2. تست NLP API..."
curl -s "$API_BASE/api/nlp/last-post" | jq '.success' 2>/dev/null || curl -s "$API_BASE/api/nlp/last-post" | grep -o '"success":true'

echo ""
echo "3. تست جستجو..."
curl -s "$API_BASE/api/search?q=گوشی" | jq '.success' 2>/dev/null || curl -s "$API_BASE/api/search?q=گوشی" | grep -o '"success":true'

echo ""
echo "✅ تست کامل شد"
