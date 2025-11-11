// پیکربندی واسط کاربری تتراشاپ
window.TETRASHOP_CONFIG = {
    // آدرس API بک‌اند
    API_BASE_URL: 'https://backend-itlhc5q0v-ramin-edjlal-s-projects.vercel.app',
    
    // تنظیمات پیش‌فرض
    DEFAULT_SETTINGS: {
        pageSize: 10,
        language: 'fa',
        theme: 'light'
    },
    
    // endpoints API
    ENDPOINTS: {
        NLP: '/api/nlp/last-post',
        SEARCH: '/api/search',
        RECOMMEND: '/api/recommend',
        HEALTH: '/health'
    },
    
    // نسخه
    VERSION: '2.1.0'
};
