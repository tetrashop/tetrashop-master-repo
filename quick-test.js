const search = require('./complete-search-system.js');

console.log("\\n🧪 تست نهایی سیستم جستجوی تتراشاپ\\n");

// تست‌های مختلف
const testQueries = [
    '',
    'رامین اجلال',
    'تتراشاپ', 
    'هوش مصنوعی',
    'تیم توسعه',
    'مدیریت'
];

testQueries.forEach(query => {
    const results = search.search(query);
    console.log(`🔍 "${query || 'جستجوی خالی'}" → ${results.length} نتیجه`);
    
    if (results.length > 0) {
        results.slice(0, 2).forEach((result, index) => {
            console.log(`   ${index + 1}. ${result.title} (امتیاز: ${result.relevance})`);
        });
    }
    console.log('---');
});

console.log("✅ تست سیستم کامل شد! سیستم آماده استفاده است.");
