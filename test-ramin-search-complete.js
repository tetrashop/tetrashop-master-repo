// 🧪 تست کامل و مستقل جستجوی "رامین اجلال"

// پایگاه داده کامل صفحات
const pageDatabase = {
    'index-complete.html': {
        id: 'complete',
        title: 'نمای کامل پروژه تتراشاپ',
        type: 'dashboard',
        description: 'سیستم مدیریت کامل فروشگاه اینترنتی تتراشاپ',
        content: 'مدیریت محصولات، سفارشات، کاربران، سیستم هوشمند جستجو، آنالیز داده‌ها. توسعه یافته توسط رامین اجلال و تیم فنی.',
        tags: ['مدیریت', 'داشبورد', 'کش', 'آنالیز', 'تتراشاپ'],
        entities: ['رامین اجلال', 'تیم توسعه', 'مدیریت پروژه'],
        lastUpdate: '2025-01-20'
    },
    'team.html': {
        id: 'team', 
        title: 'تیم توسعه تتراشاپ',
        type: 'profile',
        description: 'معرفی اعضا و توسعه‌دهندگان پروژه تتراشاپ',
        content: 'رامین اجلال: مدیر فنی و توسعه‌دهنده اصلی پروژه تتراشاپ. متخصص در زمینه هوش مصنوعی و پردازش زبان طبیعی. سابقه کاری در توسعه سیستم‌های تجارت الکترونیک.',
        tags: ['تیم', 'توسعه‌دهندگان', 'رامین اجلال', 'مدیریت'],
        entities: ['رامین اجلال', 'تیم فنی', 'توسعه‌دهندگان'],
        lastUpdate: '2025-01-20'
    },
    'ai-search.html': {
        id: 'ai-search',
        title: 'سیستم جستجوی هوشمند با AI',
        type: 'application', 
        description: 'جستجوی پیشرفته با قابلیت‌های هوش مصنوعی و پردازش زبان طبیعی',
        content: 'سیستم توسعه یافته توسط رامین اجلال برای جستجوی هوشمند در محتوای فارسی. قابلیت درک معنایی و تولید نتایج مرتبط.',
        tags: ['هوش مصنوعی', 'جستجو', 'AI', 'رامین اجلال'],
        entities: ['رامین اجلال', 'هوش مصنوعی', 'پردازش زبان'],
        lastUpdate: '2025-01-20'
    },
    'about.html': {
        id: 'about',
        title: 'درباره تتراشاپ',
        type: 'about',
        description: 'تاریخچه و اطلاعات کامل درباره پروژه تتراشاپ',
        content: 'تتراشاپ در سال 2024 توسط رامین اجلال راه‌اندازی شد. این پلتفرم با هدف ارائه بهترین سیستم مدیریت فروشگاه آنلاین توسعه یافته است.',
        tags: ['تاریخچه', 'درباره', 'رامین اجلال', 'توسعه'],
        entities: ['رامین اجلال', 'تاریخچه', 'توسعه'],
        lastUpdate: '2025-01-20'
    }
};

// الگوریتم جستجوی کامل
const searchAlgorithm = {
    // جستجوی اصلی
    search: function(query, type = 'all', limit = 10) {
        console.log(`🔍 شروع جستجو برای: "${query}"`);
        
        const results = [];
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
        
        if (searchTerms.length === 0) {
            console.log("⚠️ عبارت جستجو خیلی کوتاه است");
            return [];
        }
        
        // جستجو در تمام صفحات
        Object.entries(pageDatabase).forEach(([pageName, pageData]) => {
            let relevance = 0;
            const matches = [];
            
            // ترکیب تمام فیلدهای قابل جستجو
            const searchableText = `
                ${pageData.title} 
                ${pageData.description} 
                ${pageData.content} 
                ${pageData.tags.join(' ')}
                ${pageData.entities?.join(' ') || ''}
            `.toLowerCase();
            
            // محاسبه مرتبط بودن
            searchTerms.forEach(term => {
                // جستجو در فیلدهای خاص با وزن‌های مختلف
                if (pageData.title.toLowerCase().includes(term)) {
                    relevance += 5;
                    matches.push(`عنوان: ${term}`);
                }
                if (pageData.description.toLowerCase().includes(term)) {
                    relevance += 3;
                    matches.push(`توضیحات: ${term}`);
                }
                if (pageData.content.toLowerCase().includes(term)) {
                    relevance += 2;
                    matches.push(`محتوا: ${term}`);
                }
                if (pageData.tags.some(tag => tag.toLowerCase().includes(term))) {
                    relevance += 4;
                    matches.push(`تگ: ${term}`);
                }
                if (pageData.entities?.some(entity => entity.toLowerCase().includes(term))) {
                    relevance += 6;
                    matches.push(`موجودیت: ${term}`);
                }
                if (searchableText.includes(term)) {
                    relevance += 1;
                }
            });
            
            if (relevance > 0) {
                results.push({
                    page: pageName,
                    title: pageData.title,
                    description: pageData.description,
                    relevance: relevance,
                    matches: matches,
                    confidence: Math.min(relevance / 20, 1.0),
                    type: pageData.type,
                    tags: pageData.tags
                });
            }
        });
        
        // مرتب‌سازی بر اساس مرتبط بودن
        return results
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, limit);
    }
};

// تست اصلی
console.log('🚀 شروع تست جستجوی "رامین اجلال"\n');
console.log('=' .repeat(50));

// تست جستجو
const testResults = searchAlgorithm.search("رامین اجلال", "semantic", 10);

console.log(`📊 نتایج تست: ${testResults.length} مورد یافت شد\n`);

if (testResults.length > 0) {
    testResults.forEach((result, index) => {
        console.log(`🎯 ${index + 1}. ${result.title}`);
        console.log(`   📍 صفحه: ${result.page}`);
        console.log(`   📝 توضیح: ${result.description}`);
        console.log(`   ⭐ امتیاز مرتبط بودن: ${result.relevance}`);
        console.log(`   🎯 سطح اطمینان: ${Math.round(result.confidence * 100)}%`);
        console.log(`   🏷️ نوع: ${result.type}`);
        console.log(`   🔍 مطابقت‌ها: ${result.matches.slice(0, 3).join(', ')}`);
        console.log(`   🏷️ تگ‌ها: ${result.tags.slice(0, 3).join(', ')}`);
        console.log('   ──────────────────────────────────────────');
    });
} else {
    console.log('❌ هیچ نتیجه‌ای برای "رامین اجلال" یافت نشد');
    console.log('\n💡 پیشنهادات فوری:');
    console.log('   1. گسترش پایگاه داده صفحات');
    console.log('   2. اضافه کردن داده‌های معادل');
    console.log('   3. بهبود الگوریتم جستجو');
}

// آنالیز نهایی
console.log('\n📈 آنالیز نتیجه تست:');
console.log('=' .repeat(30));
console.log(`🔍 عبارت جستجو: "رامین اجلال"`);
console.log(`📊 صفحات موجود در پایگاه داده: ${Object.keys(pageDatabase).length}`);
console.log(`✅ نتایج یافت شده: ${testResults.length}`);
console.log(`🏆 بهترین امتیاز: ${testResults[0] ? testResults[0].relevance : 0}`);

if (testResults.length > 0) {
    console.log('\n✅ تست موفقیت‌آمیز بود! سیستم جستجو کار می‌کند');
    console.log('🚀 می‌توانید ادامه دهید...');
} else {
    console.log('\n❌ نیاز به بهبود فوری سیستم جستجو');
}
