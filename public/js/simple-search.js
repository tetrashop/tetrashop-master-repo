window.simpleSearch = {
    search: function(query) {
        const data = [
            {title: "رامین اجلال - مدیر پروژه", url: "index.html"},
            {title: "تیم توسعه تتراشاپ", url: "index-advanced.html"}
        ];
        
        if (!query) return data;
        return data.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())
        );
    }
};
console.log("✅ سیستم جستجو ساده بارگذاری شد");
