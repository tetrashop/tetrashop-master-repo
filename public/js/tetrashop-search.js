// سیستم جستجوی تتراشاپ - نسخه مرورگر
(function() {
    'use strict';
    
    const TetraSearch = {
        data: {},
        init: function() {
            console.log("🚀 سیستم جستجوی تتراشاپ بارگذاری شد");
            this.loadData();
            this.bindEvents();
        },
        
        loadData: function() {
            this.data = {
                pages: {
                    "index-complete.html": {
                        title: "نمای کامل پروژه - مدیریت رامین اجلال",
                        content: "سیستم کامل مدیریت تتراشاپ تحت سرپرستی رامین اجلال",
                        tags: ["رامین اجلال", "مدیریت", "هوش مصنوعی", "تتراشاپ"],
                        type: "dashboard",
                        score: 95
                    },
                    "index-advanced-fixed.html": {
                        title: "سیستم پیشرفته - تیم توسعه رامین اجلال", 
                        content: "تیم توسعه تتراشاپ تحت مدیریت رامین اجلال",
                        tags: ["تیم توسعه", "رامین اجلال", "پیشرفته", "جستجو"],
                        type: "application",
                        score: 88
                    },
                    "index.html": {
                        title: "صفحه اصلی تتراشاپ - پروژه رامین اجلال",
                        content: "پروژه اصلی تتراشاپ به مدیریت رامین اجلال",
                        tags: ["تتراشاپ", "رامین اجلال", "پروژه", "اصلی"],
                        type: "landing", 
                        score: 92
                    }
                }
            };
        },
        
        search: function(query) {
            if (!query) return this.getAllResults();
            
            const results = [];
            const normalizedQuery = query.toLowerCase();
            
            Object.entries(this.data.pages).forEach(([page, pageData]) => {
                const searchText = `
                    ${pageData.title}
                    ${pageData.content}
                    ${pageData.tags.join(' ')}
                `.toLowerCase();
                
                if (searchText.includes(normalizedQuery)) {
                    results.push({
                        ...pageData,
                        page: page,
                        relevance: pageData.score,
                        matches: [`تطابق با: ${query}`]
                    });
                }
            });
            
            return results;
        },
        
        getAllResults: function() {
            return Object.entries(this.data.pages).map(([page, pageData]) => ({
                ...pageData,
                page: page,
                relevance: pageData.score,
                matches: []
            }));
        },
        
        bindEvents: function() {
            // اگر در صفحه جستجو هستیم، فرم را ببند
            const searchForm = document.getElementById('search-form');
            const searchInput = document.getElementById('search-input');
            
            if (searchForm && searchInput) {
                searchForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.executeSearch(searchInput.value);
                });
            }
        },
        
        executeSearch: function(query) {
            const results = this.search(query);
            this.displayResults(results, query);
        },
        
        displayResults: function(results, query) {
            const container = document.getElementById('results-container');
            if (!container) return;
            
            if (results.length === 0) {
                container.innerHTML = `
                    <div class="no-results">
                        <h3>🔍 نتیجه‌ای برای "${query}" پیدا نشد</h3>
                        <p>پیشنهادات:</p>
                        <ul>
                            <li>عبارت جستجو را تغییر دهید</li>
                            <li>از کلمات کلیدی عمومی‌تر استفاده کنید</li>
                            <li>"رامین اجلال" یا "تتراشاپ" را امتحان کنید</li>
                        </ul>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="results-found">
                        <h3>🎯 ${results.length} نتیجه برای "${query}" پیدا شد</h3>
                        ${results.map(item => `
                            <div class="result-item" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
                                <h4><a href="${item.page}" style="color: #007bff;">${item.title}</a></h4>
                                <p>${item.content}</p>
                                <div class="tags" style="margin: 10px 0;">
                                    ${item.tags.map(tag => `<span style="background: #f0f0f0; padding: 2px 8px; border-radius: 4px; margin: 0 5px; font-size: 12px;">${tag}</span>`).join('')}
                                </div>
                                <span class="score" style="background: #28a745; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">امتیاز: ${item.relevance}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }
    };
    
    // راه‌اندازی وقتی DOM آماده شد
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => TetraSearch.init());
    } else {
        TetraSearch.init();
    }
    
    // در معرض قرار دادن برای استفاده جهانی
    window.TetraSearch = TetraSearch;
})();
