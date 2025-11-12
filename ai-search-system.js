// سیستم جستجوی هوشمند تتراشاپ
class AdvancedAISearch {
    constructor() {
        this.knowledgeBase = {};
        this.semanticIndex = {};
        this.userContext = {};
        this.init();
    }

    init() {
        console.log("🧠 سیستم جستجوی هوشمند در حال راه‌اندازی...");
        this.buildKnowledgeBase();
        this.setupSemanticSearch();
    }

    buildKnowledgeBase() {
        // پایگاه دانش شامل مفاهیم، سوالات و پاسخ‌های مرتبط
        this.knowledgeBase = {
            "رامین اجلال": {
                concepts: ["مدیر پروژه", "توسعه دهنده", "هوش مصنوعی", "تتراشاپ"],
                questions: [
                    "رامین اجلال کیست؟",
                    "چه پروژه‌هایی توسط رامین اجلال توسعه یافته؟",
                    "مهارت‌های رامین اجلال چیست؟"
                ],
                answers: [
                    "رامین اجلال توسعه دهنده اصلی و مدیر پروژه تتراشاپ است.",
                    "پروژه تتراشاپ با قابلیت‌های هوش مصنوعی و جستجوی پیشرفته.",
                    "متخصص در زمینه هوش مصنوعی، سیستم‌های پیشرفته و مدیریت پروژه."
                ],
                related: ["تیم توسعه", "هوش مصنوعی", "پروژه تتراشاپ"],
                context: "مدیریت و توسعه"
            },
            "تتراشاپ": {
                concepts: ["پروژه", "سیستم تجارت الکترونیک", "هوش مصنوعی", "جستجو"],
                questions: [
                    "تتراشاپ چیست؟",
                    "ویژگی‌های اصلی تتراشاپ چیست؟",
                    "چگونه از تتراشاپ استفاده کنم؟"
                ],
                answers: [
                    "تتراشاپ یک سیستم پیشرفته تجارت الکترونیک با قابلیت‌های هوش مصنوعی است.",
                    "جستجوی پیشرفته، هوش مصنوعی، مدیریت چندسکویی، آنالیز داده.",
                    "از طریق رابط کاربری پیشرفته یا APIهای موجود."
                ],
                related: ["رامین اجلال", "تیم توسعه", "هوش مصنوعی"],
                context: "پروژه اصلی"
            },
            "هوش مصنوعی": {
                concepts: ["AI", "یادگیری ماشین", "پردازش زبان", "جستجوی هوشمند"],
                questions: [
                    "قابلیت‌های هوش مصنوعی در تتراشاپ چیست؟",
                    "چگونه هوش مصنوعی به جستجو کمک می‌کند؟"
                ],
                answers: [
                    "جستجوی معنایی، پیشنهادات هوشمند، آنالیز خودکار محتوا.",
                    "با درک مفهوم سوالات و پیدا کردن محتوای مرتبط حتی بدون تطابق دقیق کلمات."
                ],
                related: ["رامین اجلال", "تتراشاپ", "جستجوی پیشرفته"],
                context: "فناوری"
            }
        };
    }

    setupSemanticSearch() {
        // ایجاد ایندکس معنایی برای جستجوی هوشمند
        this.semanticIndex = {};
        
        Object.entries(this.knowledgeBase).forEach(([topic, data]) => {
            // اضافه کردن تمام کلمات مرتبط به ایندکس
            const allTerms = [
                ...data.concepts,
                ...data.questions,
                ...data.answers.join(' ').split(' '),
                ...data.related
            ];
            
            allTerms.forEach(term => {
                const normalized = term.toLowerCase().trim();
                if (!this.semanticIndex[normalized]) {
                    this.semanticIndex[normalized] = [];
                }
                if (!this.semanticIndex[normalized].includes(topic)) {
                    this.semanticIndex[normalized].push(topic);
                }
            });
        });
    }

    // تحلیل سوال و استخراج مفهوم
    analyzeQuery(query) {
        const normalized = query.toLowerCase().trim();
        const words = normalized.split(/\\s+/).filter(word => word.length > 2);
        
        const analysis = {
            originalQuery: query,
            detectedConcepts: [],
            possibleQuestions: [],
            suggestedTopics: [],
            confidence: 0
        };

        // تشخیص مفاهیم
        words.forEach(word => {
            if (this.semanticIndex[word]) {
                analysis.detectedConcepts.push(...this.semanticIndex[word]);
            }
        });

        // تشخیص سوالات احتمالی
        Object.entries(this.knowledgeBase).forEach(([topic, data]) => {
            data.questions.forEach(question => {
                if (question.includes(query) || query.includes(topic)) {
                    analysis.possibleQuestions.push(question);
                }
            });
        });

        // پیشنهاد موضوعات مرتبط
        analysis.detectedConcepts.forEach(concept => {
            if (this.knowledgeBase[concept]?.related) {
                analysis.suggestedTopics.push(...this.knowledgeBase[concept].related);
            }
        });

        analysis.confidence = analysis.detectedConcepts.length > 0 ? 0.8 : 0.3;
        
        return analysis;
    }

    // جستجوی هوشمند
    intelligentSearch(query) {
        console.log("🔍 تحلیل سوال:", query);
        
        const analysis = this.analyzeQuery(query);
        const results = [];

        // جستجو در پایگاه دانش
        analysis.detectedConcepts.forEach(concept => {
            if (this.knowledgeBase[concept]) {
                const topicData = this.knowledgeBase[concept];
                
                results.push({
                    type: "topic",
                    title: concept,
                    content: topicData.answers[0],
                    context: topicData.context,
                    concepts: topicData.concepts,
                    relatedQuestions: topicData.questions,
                    answers: topicData.answers,
                    relevance: 95,
                    confidence: analysis.confidence,
                    structuredData: {
                        topic: concept,
                        description: topicData.answers[0],
                        category: topicData.context,
                        tags: topicData.concepts,
                        related: topicData.related
                    }
                });
            }
        });

        // اگر نتیجه مستقیم پیدا نکرد، جستجوی گسترده‌تر
        if (results.length === 0) {
            Object.entries(this.knowledgeBase).forEach(([topic, data]) => {
                const searchText = `
                    ${topic}
                    ${data.concepts.join(' ')}
                    ${data.questions.join(' ')}
                    ${data.answers.join(' ')}
                `.toLowerCase();

                if (searchText.includes(query.toLowerCase())) {
                    results.push({
                        type: "related",
                        title: topic,
                        content: data.answers[0],
                        context: data.context,
                        relevance: 70,
                        confidence: 0.6,
                        structuredData: {
                            topic: topic,
                            description: data.answers[0],
                            category: data.context,
                            tags: data.concepts
                        }
                    });
                }
            });
        }

        console.log(`🎯 ${results.length} نتیجه هوشمند پیدا شد`);
        return {
            queryAnalysis: analysis,
            results: results.sort((a, b) => b.relevance - a.relevance),
            summary: {
                totalResults: results.length,
                mainTopics: [...new Set(results.map(r => r.title))],
                confidence: analysis.confidence
            }
        };
    }

    // تولید پاسخ ساختاریافته
    generateStructuredResponse(searchResult) {
        return {
            metadata: {
                query: searchResult.queryAnalysis.originalQuery,
                timestamp: new Date().toISOString(),
                searchId: 'search_' + Date.now(),
                confidence: searchResult.summary.confidence
            },
            analysis: searchResult.queryAnalysis,
            results: searchResult.results.map(result => ({
                id: 'result_' + Math.random().toString(36).substr(2, 9),
                type: result.type,
                title: result.title,
                content: result.content,
                context: result.context,
                relevance: result.relevance,
                confidence: result.confidence,
                structuredData: result.structuredData,
                relatedConcepts: result.concepts || [],
                suggestedActions: [
                    "نمایش جزئیات بیشتر",
                    "جستجوی مرتبط",
                    "ذخیره نتیجه"
                ]
            })),
            suggestions: {
                relatedQueries: searchResult.queryAnalysis.suggestedTopics,
                nextQuestions: searchResult.queryAnalysis.possibleQuestions.slice(0, 3),
                exploreTopics: searchResult.summary.mainTopics
            },
            display: {
                template: "intelligent-results",
                viewType: "structured",
                showAnalysis: true,
                showSuggestions: true
            }
        };
    }
}

// ایجاد نمونه و تست سیستم
const aiSearch = new AdvancedAISearch();

// تست‌های مختلف
const testQueries = [
    "رامین اجلال کیست؟",
    "تتراشاپ چیست؟",
    "هوش مصنوعی در پروژه",
    "مهارت‌های توسعه",
    "مدیریت پروژه"
];

console.log("🧪 تست سیستم جستجوی هوشمند:\\n");

testQueries.forEach(query => {
    const result = aiSearch.intelligentSearch(query);
    const structured = aiSearch.generateStructuredResponse(result);
    
    console.log(`🔍 سوال: "${query}"`);
    console.log(`📊 تعداد نتایج: ${structured.results.length}`);
    console.log(`🎯 موضوعات اصلی: ${structured.suggestions.exploreTopics.join(', ')}`);
    console.log('---');
});

// برای استفاده در مرورگر
if (typeof window !== 'undefined') {
    window.AdvancedAISearch = AdvancedAISearch;
    window.aiSearch = aiSearch;
    console.log("✅ سیستم جستجوی هوشمند برای مرورگر آماده شد");
}

module.exports = aiSearch;
