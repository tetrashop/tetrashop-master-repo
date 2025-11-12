// سیستم جستجوی پیشرفته تتراشاپ
class SearchEngine {
    constructor() {
        this.pages = {};
        this.searchIndex = {};
        this.searchHistory = [];
        this.init();
    }

    init() {
        console.log("🚀 سیستم جستجوی تتراشاپ در حال راه‌اندازی...");
        this.loadPagesData();
        this.buildSearchIndex();
        this.loadSearchHistory();
    }

    loadPagesData() {
        // داده‌های واقعی صفحات با محتوای کامل
        this.pages = {
            "index-complete.html": {
                title: "نمای کامل پروژه",
                content: "سیستم مدیریت کامل تتراشاپ با قابلیت‌های پیشرفته هوش مصنوعی و تحلیل داده‌ها. این سیستم توسط تیم توسعه به سرپرستی رامین اجلال ایجاد شده و شامل ماژول‌های مختلفی از جمله مدیریت کاربران، تحلیل آماری، و سیستم گزارش‌دهی پیشرفته می‌باشد.",
                description: "داشبورد مدیریت کامل پروژه تتراشاپ",
                tags: ["مدیریت", "داشبورد", "کش", "آنالیز", "رامین اجلال", "تیم توسعه", "هوش مصنوعی"],
                type: "dashboard",
                lastUpdate: "2025-01-20",
                size: "45KB",
                relevance: 95,
                searchableContent: "تتراشاپ سیستم مدیریت پروژه هوش مصنوعی تحلیل داده رامین اجلال تیم توسعه داشبورد پیشرفته گزارش‌دهی آنالیز آماری"
            },
            "index-advanced-fixed.html": {
                title: "نسخه پیشرفته",
                content: "سیستم پیشرفته تتراشاپ با قابلیت کش و جستجوی پیشرفته. این سیستم امکان مدیریت کارآمد داده‌ها و عملکرد بهینه را فراهم می‌کند. طراحی شده توسط تیم فنی به سرپرستی رامین اجلال با تمرکز بر سرعت و امنیت.",
                description: "سیستم پیشرفته با قابلیت کش و جستجو",
                tags: ["جستجو", "کش", "پیشرفته", "عملکرد", "بهینه سازی", "رامین اجلال", "امنیت"],
                type: "application",
                lastUpdate: "2025-01-20",
                size: "38KB",
                relevance: 88,
                searchableContent: "جستجوی پیشرفته سیستم کش عملکرد بهینه سازی تتراشاپ مدیریت داده امنیت سرعت رامین اجلال"
            },
            "index-test.html": {
                title: "نسخه تستی",
                content: "صفحه تست و توسعه ویژگی‌های جدید تتراشاپ. این محیط برای آزمایش قابلیت‌های جدید و بهبود رابط کاربری استفاده می‌شود. تحت نظارت مستقیم رامین اجلال و تیم کنترل کیفیت.",
                description: "صفحه تست و توسعه ویژگی‌ها",
                tags: ["تست", "توسعه", "آزمایش", "ویژگی‌های جدید", "رابط کاربری", "رامین اجلال"],
                type: "test",
                lastUpdate: "2025-01-19",
                size: "22KB",
                relevance: 75,
                searchableContent: "تست توسعه ویژگی جدید آزمایش رابط کاربری کنترل کیفیت رامین اجلال تیم تست"
            },
            "index.html": {
                title: "صفحه اصلی",
                content: "صفحه اصلی و مرکزی پروژه تتراشاپ. معرفی کامل قابلیت‌های سیستم و دسترسی سریع به ماژول‌های مختلف. طراحی شده با تمرکز بر تجربه کاربری بهینه و دسترسی آسان.",
                description: "صفحه اصلی و مرکزی پروژه",
                tags: ["اصلی", "لندینگ", "معرفی", "دسترسی سریع", "راهنمایی", "شروع"],
                type: "landing",
                lastUpdate: "2025-01-20",
                size: "28KB",
                relevance: 92,
                searchableContent: "صفحه اصلی تتراشاپ معرفی قابلیت‌ها دسترسی سریع ماژول تجربه کاربری راهنمایی شروع"
            }
        };
    }

    buildSearchIndex() {
        console.log("📚 در حال ساخت ایندکس جستجو...");
        this.searchIndex = {};
        
        Object.entries(this.pages).forEach(([pageName, pageData]) => {
            // ایجاد متن کامل برای ایندکس
            const fullText = `
                ${pageData.title}
                ${pageData.content}
                ${pageData.description}
                ${pageData.searchableContent}
                ${pageData.tags.join(' ')}
            `.toLowerCase();
            
            // تجزیه به کلمات و اضافه کردن به ایندکس
            const words = fullText.split(/\\s+/).filter(word => word.length > 2);
            
            words.forEach(word => {
                const cleanWord = word.replace(/[^\\w\\u0600-\\u06FF]/g, '');
                if (cleanWord && cleanWord.length > 2) {
                    if (!this.searchIndex[cleanWord]) {
                        this.searchIndex[cleanWord] = [];
                    }
                    if (!this.searchIndex[cleanWord].includes(pageName)) {
                        this.searchIndex[cleanWord].push(pageName);
                    }
                }
            });
        });
        
        console.log(`✅ ایندکس ساخته شد. ${Object.keys(this.searchIndex).length} کلمه کلیدی`);
    }

    search(query, type = "all", page = "all", limit = 25) {
        if (!query || query.trim() === '') {
            return this.getAllResults(limit);
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
                const cleanWord = word.replace(/[^\\w\\u0600-\\u06FF]/g, '');
                if (!cleanWord) return;

                const searchText = `
                    ${pageData.title}
                    ${pageData.content}
                    ${pageData.description}
                    ${pageData.searchableContent}
                    ${pageData.tags.join(' ')}
                `.toLowerCase();

                if (searchText.includes(cleanWord)) {
                    relevance += 2;
                    
                    // پیدا کردن محل‌های تطابق
                    if (pageData.title.toLowerCase().includes(cleanWord)) {
                        matches.push(`عنوان: "${pageData.title}"`);
                        relevance += 10;
                    }
                    if (pageData.content.toLowerCase().includes(cleanWord)) {
                        const contentMatch = this.highlightMatch(pageData.content, cleanWord);
                        matches.push(`محتوا: ${contentMatch}`);
                        relevance += 5;
                    }
                    if (pageData.tags.some(tag => tag.toLowerCase().includes(cleanWord))) {
                        matches.push(`تگ: ${cleanWord}`);
                        relevance += 8;
                    }
                    if (pageData.description.toLowerCase().includes(cleanWord)) {
                        matches.push(`توضیحات: ${this.highlightMatch(pageData.description, cleanWord)}`);
                        relevance += 6;
                    }
                }
            });

            if (relevance > 0) {
                results.push({
                    title: pageData.title,
                    page: pageName,
                    description: pageData.description,
                    type: pageData.type,
                    lastUpdate: pageData.lastUpdate,
                    size: pageData.size,
                    tags: pageData.tags,
                    relevance: relevance + pageData.relevance,
                    matches: matches.slice(0, 5), // حداکثر ۵ تطابق
                    score: Math.min(100, relevance + pageData.relevance)
                });
            }
        });

        // مرتب‌سازی بر اساس مرتبط بودن
        const sortedResults = results.sort((a, b) => b.relevance - a.relevance).slice(0, limit);
        
        // ذخیره در تاریخچه
        this.saveToHistory(query, sortedResults.length);
        
        console.log(`🎯 ${sortedResults.length} نتیجه برای "${query}" یافت شد`);
        return sortedResults;
    }

    highlightMatch(text, word) {
        const regex = new RegExp(`(${word})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>').substring(0, 150) + '...';
    }

    getAllResults(limit = 25) {
        return Object.entries(this.pages)
            .map(([pageName, pageData]) => ({
                title: pageData.title,
                page: pageName,
                description: pageData.description,
                type: pageData.type,
                lastUpdate: pageData.lastUpdate,
                size: pageData.size,
                tags: pageData.tags,
                relevance: pageData.relevance,
                matches: [],
                score: pageData.relevance
            }))
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, limit);
    }

    saveToHistory(query, resultCount) {
        const searchRecord = {
            query: query,
            timestamp: new Date().toLocaleString('fa-IR'),
            resultCount: resultCount
        };
        
        this.searchHistory.unshift(searchRecord);
        this.searchHistory = this.searchHistory.slice(0, 10); // نگه داشتن ۱۰ مورد آخر
        
        // ذخیره در localStorage
        localStorage.setItem('tetrashop-search-history', JSON.stringify(this.searchHistory));
        
        // آپدیت آمار
        this.updateStats();
    }

    loadSearchHistory() {
        try {
            const saved = localStorage.getItem('tetrashop-search-history');
            if (saved) {
                this.searchHistory = JSON.parse(saved);
                this.updateStats();
            }
        } catch (error) {
            console.error('خطا در بارگذاری تاریخچه جستجو:', error);
        }
    }

    updateStats() {
        const recentResults = document.getElementById('recentResults');
        if (recentResults && this.searchHistory.length > 0) {
            recentResults.textContent = this.searchHistory.length;
        }
    }

    getSearchAnalytics(query, results) {
        const pageTypes = {};
        const tagCounts = {};
        
        results.forEach(result => {
            // شمارش انواع صفحات
            pageTypes[result.type] = (pageTypes[result.type] || 0) + 1;
            
            // شمارش تگ‌ها
            result.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        return {
            query: query,
            totalResults: results.length,
            searchTime: new Date().toLocaleTimeString('fa-IR'),
            pageTypes: pageTypes,
            tagCounts: tagCounts,
            topTags: Object.entries(tagCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .reduce((obj, [key, value]) => {
                    obj[key] = value;
                    return obj;
                }, {})
        };
    }
}

// ایجاد نمونه اصلی
const searchEngine = new SearchEngine();

// برای استفاده جهانی
if (typeof window !== 'undefined') {
    window.SearchEngine = SearchEngine;
    window.searchEngine = searchEngine;
}
