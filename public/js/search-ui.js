// رابط کاربری سیستم جستجو
class SearchUI {
    constructor() {
        this.currentTab = 'results';
        this.currentPreview = null;
        this.init();
    }

    init() {
        console.log("🎨 رابط کاربری جستجو در حال راه‌اندازی...");
        this.bindEvents();
        this.loadInitialView();
    }

    bindEvents() {
        // دکمه اجرای جستجو
        const executeBtn = document.getElementById('executeSearch');
        if (executeBtn) {
            executeBtn.addEventListener('click', () => this.executeSearch());
        }

        // جستجو با Enter
        const searchInput = document.getElementById('searchQuery');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.executeSearch();
            });
        }

        // تب‌ها
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.getAttribute('data-tab'));
            });
        });

        // مودال
        const closeModal = document.getElementById('closeModal');
        const modal = document.getElementById('previewModal');
        
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closePreview());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closePreview();
            });
        }

        // بستن مودال با ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closePreview();
        });
    }

    loadInitialView() {
        // نمایش تمام صفحات در ابتدا
        const allResults = searchEngine.getAllResults();
        this.displayResults(allResults, '');
        this.updateStats();
    }

    executeSearch() {
        const query = document.getElementById('searchQuery').value.trim();
        const type = document.getElementById('searchType').value;
        const page = document.getElementById('pageFilter').value;
        const limit = parseInt(document.getElementById('resultLimit').value);

        // نمایش loading
        this.showLoading();

        // اجرای جستجو
        setTimeout(() => {
            const results = searchEngine.search(query, type, page, limit);
            this.displayResults(results, query);
            this.displayAnalytics(query, results);
            
            // رفتن به تب نتایج
            this.switchTab('results');
        }, 500);
    }

    displayResults(results, query) {
        const container = document.getElementById('resultsContainer');
        
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = this.getNoResultsHTML(query);
            return;
        }

        container.innerHTML = results.map(item => this.getResultItemHTML(item)).join('');
        
        // آپدیت آمار
        this.updateRecentResults(results.length);
    }

    getResultItemHTML(item) {
        return `
            <div class="result-item">
                <div class="result-header">
                    <div>
                        <h3 class="result-title">${item.title}</h3>
                        <div class="result-meta">
                            <span>📁 صفحه: ${item.page}</span>
                            <span>🏷️ نوع: ${item.type}</span>
                            <span>📅 بروزرسانی: ${item.lastUpdate}</span>
                            <span>📊 حجم: ${item.size}</span>
                        </div>
                    </div>
                </div>
                
                <p class="result-description">${item.description}</p>
                
                ${item.matches.length > 0 ? `
                <div class="matches-section">
                    <strong>🔗 مطابقت‌ها (${item.matches.length} مورد):</strong>
                    <div class="matches-list">
                        ${item.matches.map(match => 
                            `<div class="match-item">${match}</div>`
                        ).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="tags-section">
                    ${item.tags.map(tag => 
                        `<span class="tag">${tag}</span>`
                    ).join('')}
                </div>
                
                <div class="result-footer">
                    <span class="relevance">⭐ مرتبط بودن: ${item.relevance}</span>
                    <button class="preview-btn" onclick="searchUI.showPreview('${item.page}', '${item.title}')">
                        👁️ پیش‌نمایش صفحه
                    </button>
                </div>
            </div>
        `;
    }

    getNoResultsHTML(query) {
        return `
            <div class="no-results">
                <h3>🔍 نتیجه‌ای برای "${query}" پیدا نشد</h3>
                <p>پیشنهادات:</p>
                <ul>
                    <li>عبارت جستجو را تغییر دهید</li>
                    <li>از کلمات کلیدی عمومی‌تر استفاده کنید</li>
                    <li>نوع جستجو را تغییر دهید</li>
                    <li>فیلتر صفحات را بردارید</li>
                </ul>
            </div>
        `;
    }

    showLoading() {
        const container = document.getElementById('resultsContainer');
        if (container) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>🔍 در حال جستجو...</h3>
                    <p>لطفاً کمی صبر کنید</p>
                </div>
            `;
        }
    }

    showPreview(pageUrl, pageTitle) {
        const modal = document.getElementById('previewModal');
        const modalTitle = document.getElementById('modalTitle');
        const previewFrame = document.getElementById('previewFrame');
        
        if (modal && modalTitle && previewFrame) {
            modalTitle.textContent = `پیش‌نمایش: ${pageTitle}`;
            previewFrame.src = pageUrl;
            modal.style.display = 'block';
            this.currentPreview = pageUrl;
            
            // رفتن به تب پیش‌نمایش
            this.switchTab('preview');
        }
    }

    closePreview() {
        const modal = document.getElementById('previewModal');
        const previewFrame = document.getElementById('previewFrame');
        
        if (modal && previewFrame) {
            modal.style.display = 'none';
            previewFrame.src = '';
            this.currentPreview = null;
        }
    }

    switchTab(tabName) {
        // غیرفعال کردن همه تب‌ها
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // فعال کردن تب انتخاب شده
        const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const activeTabPane = document.getElementById(tabName + 'Tab');
        
        if (activeTabBtn) activeTabBtn.classList.add('active');
        if (activeTabPane) activeTabPane.classList.add('active');
        
        this.currentTab = tabName;
        
        // اگر تب پیش‌نمایش فعال است و قبلاً صفحه‌ای انتخاب شده بود، نمایش بده
        if (tabName === 'preview' && this.currentPreview) {
            this.showPreviewInTab();
        }
    }

    showPreviewInTab() {
        const previewContainer = document.getElementById('previewContainer');
        if (previewContainer && this.currentPreview) {
            previewContainer.innerHTML = `
                <div style="height: 600px; border: 2px dashed #e9ecef; border-radius: 10px; overflow: hidden;">
                    <iframe src="${this.currentPreview}" 
                            style="width: 100%; height: 100%; border: none;"></iframe>
                </div>
            `;
        }
    }

    displayAnalytics(query, results) {
        const analytics = searchEngine.getSearchAnalytics(query, results);
        const container = document.getElementById('analyticsContainer');
        
        if (!container) return;

        container.innerHTML = `
            <div class="analytics-panel">
                <h3>📊 تحلیل جستجو</h3>
                
                <div class="analytics-grid">
                    <div class="analytics-item">
                        <div class="analytics-label">عبارت جستجو</div>
                        <div class="analytics-value">${analytics.query || 'همه موارد'}</div>
                    </div>
                    
                    <div class="analytics-item">
                        <div class="analytics-label">تعداد نتایج</div>
                        <div class="analytics-value">${analytics.totalResults}</div>
                    </div>
                    
                    <div class="analytics-item">
                        <div class="analytics-label">زمان جستجو</div>
                        <div class="analytics-value">${analytics.searchTime}</div>
                    </div>
                </div>
                
                <div class="analytics-section">
                    <h4>📁 توزیع بر اساس نوع صفحه</h4>
                    <div class="types-list">
                        ${Object.entries(analytics.pageTypes).map(([type, count]) => `
                            <div class="type-item">
                                <span class="type-name">${type}</span>
                                <span class="type-count">${count} مورد</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="analytics-section">
                    <h4>🏷️ پرتکرارترین تگ‌ها</h4>
                    <div class="tags-list">
                        ${Object.entries(analytics.topTags).map(([tag, count]) => `
                            <div class="tag-item">
                                <span class="tag-name">${tag}</span>
                                <span class="tag-count">${count} بار</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    updateStats() {
        const indexedPages = document.getElementById('indexedPages');
        const uniqueTags = document.getElementById('uniqueTags');
        const systemStatus = document.getElementById('systemStatus');
        
        if (indexedPages) indexedPages.textContent = Object.keys(searchEngine.pages).length;
        
        if (uniqueTags) {
            const allTags = new Set();
            Object.values(searchEngine.pages).forEach(page => {
                page.tags.forEach(tag => allTags.add(tag));
            });
            uniqueTags.textContent = allTags.size;
        }
        
        if (systemStatus) {
            systemStatus.textContent = 'فعال';
            systemStatus.className = 'status-active';
        }
    }

    updateRecentResults(count) {
        const recentResults = document.getElementById('recentResults');
        if (recentResults) {
            recentResults.textContent = count;
        }
    }
}

// راه‌اندازی رابط کاربری
const searchUI = new SearchUI();

// توابع全局 برای استفاده در HTML
window.searchUI = searchUI;
