// Static cache for better performance
const staticCache = {
    version: '1.0.' + Date.now(),
    resources: {
        css: [],
        js: [],
        html: []
    },
    init: function() {
        if (!localStorage.getItem('staticCacheVersion') || 
            localStorage.getItem('staticCacheVersion') !== this.version) {
            localStorage.clear();
            localStorage.setItem('staticCacheVersion', this.version);
        }
    }
};
staticCache.init();
