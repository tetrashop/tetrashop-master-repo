const aiSearch = require('./ai-search-system.js');

console.log("🧠 تست پیشرفته سیستم جستجوی هوشمند\\n");

const advancedQueries = [
    "رامین اجلال چه مهارت‌هایی دارد؟",
    "ویژگی‌های تتراشاپ چیست؟",
    "هوش مصنوعی چگونه در پروژه استفاده شده؟",
    "مدیریت پروژه توسط چه کسی انجام می‌شود؟",
    "توسعه دهندگان اصلی پروژه"
];

advancedQueries.forEach(query => {
    console.log(`\\n🔍 سوال: "${query}"`);
    const result = aiSearch.intelligentSearch(query);
    const structured = aiSearch.generateStructuredResponse(result);
    
    console.log(`📊 تعداد نتایج: ${structured.results.length}`);
    console.log(`🎯 اطمینان سیستم: ${Math.round(structured.metadata.confidence * 100)}%`);
    
    structured.results.forEach((result, index) => {
        console.log(`\\n   ${index + 1}. ${result.title}`);
        console.log(`      نوع: ${result.type}`);
        console.log(`      محتوا: ${result.content}`);
        console.log(`      مرتبط بودن: ${result.relevance}`);
        console.log(`      داده ساختاریافته:`, result.structuredData);
    });
    
    console.log(`\\n   💡 پیشنهادات: ${structured.suggestions.relatedQueries.join(', ')}`);
});

console.log("\\n✅ تست سیستم جستجوی هوشمند کامل شد!");
