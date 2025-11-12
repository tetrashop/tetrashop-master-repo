// سیستم جستجوی جامع تتراشاپ
class TetraSearch {
    constructor() {
        this.index = {};
        this.pages = {};
        this.init();
    }

    init() {
        console.log("🔧 سیستم جستجوی تتراشاپ در حال راه‌اندازی...");
        this.loadInitialData();
        this.setupEventListeners();
    }

    loadInitialData() {
        // داده‌های اولیه شامل رامین اجلال و محتوای مرتبط
        this.pages = {
            "index-complete.html": {
                title: "نمای کامل پروژه - مدیریت رامین اجلال",
                content: "سیستم کامل مدیریت تتراشاپ تحت سرپرستی رامین اجلال. شامل ماژول‌های هوش مصنوعی، جستجوی پیشرفته و آنالیز داده‌ها.",
                description: "داشبورد اصلی مدیریت پروژه تتراشاپ",
                tags: ["رامین اجلال", "مدیریت", "هوش مصنوعی", "داشبورد", "تتراشاپ"],
                type: "dashboard",
                lastUpdate: "2025-01-20",
                score: 95
            },
            "index-advanced-fixed.html": {
                title: "سیستم پیشرفته - تیم توسعه رامین اجلال",
                content: "نسخه پیشرفته تتراشاپ با قابلیت‌های توسعه‌یافته توسط تیم تحت مدیریت رامین اجلال.",
                description: "سیستم پیشرفته با قابلیت کش و جستجو",
                tags: ["رامین اجلال", "تیم توسعه", "پیشرفته", "جستجو", "کش"],
                type: "application", 
                lastUpdate: "2025-01-20",
                score: 88
            },
            "index.html": {
                title: "صفحه اصلی تتراشاپ - پروژه رامین اجلال",
                content: "پروژه اصلی تتراشاپ به مدیریت رامین اجلال. سیستم تجارت الکترونیک پیشرفته با قابلیت‌های هوش مصنوعی.",
                description: "صفحه اصلی و مرکزی پروژه",
                tags: ["تتراشاپ", "رامین اجلال", "پروژه", "اصلی", "هوش مصنوعی"],
                type: "landing",
                lastUpdate: "2025-01-20",
                score: 92
            },
            "index-test.html": {
                title: "تست و توسعه - آزمایش رامین اجلال",
                content: "صفحه تست و توسعه ویژگی‌های جدید تحت نظارت رامین اجلال. آزمایش رابط کاربری و عملکرد سیستم.",
                description: "صفحه تست و توسعه ویژگی‌ها",
                tags: ["رامین اجلال", "تست", "توسعه", "آزمایش", "ویژگی‌های جدید"],
                type: "test",
                lastUpdate: "2025-01-19",
                score: 85
            }
        };

        this.buildIndex();
    }

    buildIndex() {
        console.log("📚 در حال ساختن ایندکس جستجو...");
        this.index = {};
        
        Object.entries(this.pages).forEach(([pageName, pageData]) => {
            // ایندکس کردن تمام محتوا
            const allText = `
                ${pageData.title}
                ${pageData.content} 
                ${pageData.description}
                ${pageData.tags.join(' ')}
            `.toLowerCase();
            
            // اضافه کردن به ایندکس
            const words = allText.split(/\\s+/).filter(word => word.length > 2);
            words.forEach(word => {
                if (!this.index[word]) {
                    this.index[word] = [];
                }
                if (!this.index[word].includes(pageName)) {
                    this.index[word].push(pageName);
                }
            });
        });
        
        console.log("✅ ایندکس ساخته شد. کلمات کلیدی:", Object.keys(this.index).length);
    }

    search(query, type = "all", page = "all") {
        if (!query || query.trim() === '') {
            return this.getAllResults();
        }

        const normalizedQuery = query.toLowerCase().trim();
        console.log("🔍 جستجو برای:", normalizedQuery);

        const results = [];
        const queryWords = normalizedQuery.split(/\\s+/).filter(word => word.length > 2);

        Object.entries(this.pages).forEach(([pageName, pageData]) => {
            // فیلتر بر اساس نوع و صفحه
            if (type !== "all" && pageData.type !== type) return;
            if (page !== "all" && pageName !== page) return;

            let relevance = 0;
            const matches = [];

            // محاسبه مرتبط بودن
            queryWords.forEach(word => {
                const searchText = `
                    ${pageData.title}
                    ${pageData.content}
                    ${pageData.description} 
                    ${pageData.tags.join(' ')}
                `.toLowerCase();

                if (searchText.includes(word)) {
                    relevance += 5; // امتیاز برای تطابق کلمه
                    
                    // پیدا کردن محل تطابق
                    if (pageData.title.toLowerCase().includes(word)) {
                        matches.push(`عنوان: ${pageData.title}`);
                        relevance += 10; // امتیاز بیشتر برای تطابق در عنوان
                    }
                    if (pageData.content.toLowerCase().includes(word)) {
                        matches.push(`محتوا: ${pageData.content.substring(0, 100)}...`);
                    }
                    if (pageData.tags.some(tag => tag.toLowerCase().includes(word))) {
                        matches.push(`تگ: ${word}`);
                        relevance += 8; // امتیاز بیشتر برای تطابق در تگ
                    }
                }
            });

            if (relevance > 0) {
                results.push({
                    ...pageData,
                    page: pageName,
                    relevance: relevance + pageData.score,
                    matches: matches.slice(0, 5) // حداکثر ۵ تطابق
                });
            }
        });

        // مرتب‌سازی بر اساس مرتبط بودن
        results.sort((a, b) => b.relevance - a.relevance);
        
        console.log(`🎯 ${results.length} نتیجه برای "${query}" یافت شد`);
        return results;
    }

    getAllResults() {
        return Object.entries(this.pages).map(([pageName, pageData]) => ({
            ...pageData,
            page: pageName,
            relevance: pageData.score,
            matches: []
        }));
    }

    setupEventListeners() {
        // برای استفاده در مرورگر
        if (typeof window !== 'undefined') {
            window.tetraSearch = this;
            console.log("✅ سیستم جستجو برای مرورگر آماده شد");
        }
    }

    // آنالیز جستجو
    getSearchAnalytics(query, results) {
        return {
            query: query,
            totalResults: results.length,
            searchTime: new Date().toLocaleTimeString('fa-IR'),
            pageTypes: this.groupByPageType(results),
            tagCounts: this.countTags(results)
        };
    }

    groupByPageType(results) {
        const types = {};
        results.forEach(result => {
            types[result.type] = (types[result.type] || 0) + 1;
        });
        return types;
    }

    countTags(results) {
        const tags = {};
        results.forEach(result => {
            result.tags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        });
        return tags;
    }
}

// ایجاد نمونه اصلی
const tetraSearch = new TetraSearch();

// تست فوری سیستم
console.log("🧪 تست سیستم جستجو:");
console.log("جستجوی خالی:", tetraSearch.search('').length + " نتیجه");
console.log("جستجوی 'رامین اجلال':", tetraSearch.search('رامین اجلال').length + " نتیجه");
console.log("جستجوی 'تتراشاپ':", tetraSearch.search('تتراشاپ').length + " نتیجه");
console.log("جستجوی 'هوش مصنوعی':", tetraSearch.search('هوش مصنوعی').length + " نتیجه");

module.exports = tetraSearch;
