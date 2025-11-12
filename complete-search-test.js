// 🧪 تست کامل و مستقل سیستم جستجو - تمام وابستگی‌ها داخلی

console.log("🚀 شروع تست کامل سیستم جستجو...\n");

// 1. پایگاه داده صفحات
const pageDatabase = {
    'index-complete.html': {
        id: 'complete',
        title: 'نمای کامل پروژه تتراشاپ',
        type: 'dashboard',
        description: 'سیستم مدیریت کامل فروشگاه اینترنتی تتراشاپ',
        content: 'مدیریت محصولات، سفارشات، کاربران، سیستم هوشمند جستجو، آنالیز داده‌ها. توسعه یافته توسط رامین اجلال و تیم فنی.',
        tags: ['مدیریت', 'داشبورد', 'کش', 'آنالیز', 'تتراشاپ'],
        entities: ['رامین اجلال', 'تیم توسعه', 'مدیریت پروژه']
    },
    'team.html': {
        id: 'team', 
        title: 'تیم توسعه تتراشاپ - رامین اجلال',
        type: 'profile',
        description: 'معرفی اعضا و توسعه‌دهندگان پروژه تتراشاپ',
        content: 'رامین اجلال: مدیر فنی و توسعه‌دهنده اصلی پروژه تتراشاپ. متخصص در زمینه هوش مصنوعی و پردازش زبان طبیعی.',
        tags: ['تیم', 'توسعه‌دهندگان', 'رامین اجلال', 'مدیریت'],
        entities: ['رامین اجلال', 'تیم فنی', 'توسعه‌دهندگان']
    },
    'ai-search.html': {
        id: 'ai-search',
        title: 'سیستم جستجوی هوشمند با AI',
        type: 'application', 
        description: 'جستجوی پیشرفته با قابلیت‌های هوش مصنوعی',
        content: 'سیستم توسعه یافته توسط رامین اجلال برای جستجوی هوشمند در محتوای فارسی.',
        tags: ['هوش مصنوعی', 'جستجو', 'AI', 'رامین اجلال'],
        entities: ['رامین اجلال', 'هوش مصنوعی']
    }
};

// 2. سیستم مترادف
const synonymSystem = {
    synonyms: {
        'رامین اجلال': ['Ramin Ejlal', 'مدیر فنی', 'توسعه‌دهنده اصلی'],
        'تتراشاپ': ['TetraShop', 'فروشگاه آنلاین']
    },
    
    expandQuery: function(query) {
        const terms = query.split(' ');
        const expanded = [query];
        
        terms.forEach(term => {
            if (this.synonyms[term]) {
                expanded.push(...this.synonyms[term]);
            }
        });
        
        return [...new Set(expanded)];
    }
};

// 3. الگوریتم جستجوی کامل
const advancedSearch = {
    search: function(query, options = {}) {
        const expandedQueries = synonymSystem.expandQuery(query);
        const results = [];
        
        console.log(`🔍 جستجو برای: "${query}"`);
        console.log(`📋 عبارت‌های گسترش یافته: ${expandedQueries.join(', ')}`);
        
        // جستجو در هر عبارت گسترش یافته
        expandedQueries.forEach(expandedQuery => {
            Object.entries(pageDatabase).forEach(([pageName, pageData]) => {
                const relevance = this.calculateRelevance(expandedQuery, pageData);
                
                if (relevance > 0.1) {
                    results.push({
                        page: pageName,
                        title: pageData.title,
                        description: pageData.description,
                        relevance: relevance,
                        confidence: Math.min(relevance, 0.95),
                        type: pageData.type,
                        tags: pageData.tags.slice(0, 3)
                    });
                }
            });
        });
        
        // حذف duplicates و مرتب‌سازی
        const uniqueResults = this.removeDuplicates(results);
        return uniqueResults.sort((a, b) => b.relevance - a.relevance);
    },
    
    calculateRelevance: function(query, pageData) {
        let relevance = 0;
        const queryLower = query.toLowerCase();
        
        // جستجو در فیلدهای مختلف با وزن‌های مختلف
        if (pageData.title.toLowerCase().includes(queryLower)) relevance += 0.6;
        if (pageData.description.toLowerCase().includes(queryLower)) relevance += 0.3;
        if (pageData.content.toLowerCase().includes(queryLower)) relevance += 0.1;
        
        // جستجو در تگ‌ها
        if (pageData.tags.some(tag => tag.toLowerCase().includes(queryLower))) relevance += 0.4;
        
        // جستجو در موجودیت‌ها
        if (pageData.entities.some(entity => entity.toLowerCase().includes(queryLower))) relevance += 0.5;
        
        return relevance;
    },
    
    removeDuplicates: function(results) {
        const seen = new Set();
        return results.filter(result => {
            const key = result.page + result.title;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
};

// 4. اجرای تست‌ها
console.log("🎯 تست‌های جستجو:\n");
console.log("=" .repeat(50));

const testQueries = [
    "رامین اجلال",
    "تیم توسعه", 
    "تتراشاپ",
    "هوش مصنوعی"
];

let totalResults = 0;

testQueries.forEach(query => {
    const results = advancedSearch.search(query);
    console.log(`📊 "${query}": ${results.length} نتیجه\n`);
    
    if (results.length > 0) {
        results.forEach((result, index) => {
            console.log(`   ${index + 1}. ${result.title}`);
            console.log(`      📍 صفحه: ${result.page}`);
            console.log(`      🎯 اطمینان: ${Math.round(result.confidence * 100)}%`);
            console.log(`      🏷️ نوع: ${result.type}`);
            console.log(`      🔍 تگ‌ها: ${result.tags.join(', ')}`);
            console.log('      ─────────────────────────────────');
        });
    } else {
        console.log("   ❌ هیچ نتیجه‌ای یافت نشد");
        console.log("   💡 پیشنهاد: گسترش پایگاه داده");
        console.log('      ─────────────────────────────────');
    }
    
    totalResults += results.length;
    console.log('');
});

// 5. نتیجه نهایی
console.log("=" .repeat(50));
console.log("📈 گزارش نهایی تست:");
console.log(`🔢 تعداد تست‌ها: ${testQueries.length}`);
console.log(`📊 کل نتایج یافت شده: ${totalResults}`);
console.log(`🏆 میانگین نتگان: ${(totalResults / testQueries.length).toFixed(1)}`);

if (totalResults > 0) {
    console.log("\n✅ سیستم جستجو کار می‌کند!");
    console.log("🚀 می‌توانید ادامه دهید...");
} else {
    console.log("\n❌ نیاز به بهبود فوری سیستم جستجو");
    console.log("🔧 پیشنهاد: اضافه کردن صفحات و داده‌های بیشتر");
}

console.log("\n🎉 تست کامل به پایان رسید!");
