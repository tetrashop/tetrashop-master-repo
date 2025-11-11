const http = require('http');
const https = require('https');

const PORT = 3003;

const server = http.createServer(async (req, res) => {
    console.log('📡 دریافت درخواست:', req.url);
    
    // تنظیم هدرهای CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }
    
    try {
        // استفاده از یک API تستی عمومی به جای API اصلی
        const testUrl = 'https://jsonplaceholder.typicode.com/posts';
        
        https.get(testUrl, (apiRes) => {
            let data = '';
            
            apiRes.on('data', (chunk) => {
                data += chunk;
            });
            
            apiRes.on('end', () => {
                console.log('✅ داده دریافت شد');
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                
                // ساخت پاسخ شبیه‌سازی شده
                const mockResponse = {
                    success: true,
                    data: {
                        results: [
                            {
                                id: 1,
                                title: "نتیجه تستی ۱",
                                content: "این یک نتیجه تستی برای نمایش کارکرد سیستم است",
                                relevance: 0.95
                            },
                            {
                                id: 2, 
                                title: "نتیجه تستی ۲",
                                content: "نتیجه دوم برای اطمینان از عملکرد صحیح",
                                relevance: 0.87
                            }
                        ]
                    }
                };
                
                res.end(JSON.stringify(mockResponse, null, 2));
            });
        }).on('error', (error) => {
            console.error('❌ خطا:', error.message);
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ 
                success: false,
                error: 'خطا در ارتباط',
                message: error.message
            }));
        });
        
    } catch (error) {
        console.error('❌ خطای پردازش:', error);
        res.writeHead(500, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
            success: false,
            error: 'خطا در پردازش'
        }));
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 سرور تستی راه‌اندازی شد!');
    console.log(`📡 پورت: ${PORT}`);
    console.log(`🌐 آدرس: http://localhost:${PORT}`);
    console.log('✅ آماده دریافت درخواست...');
});
