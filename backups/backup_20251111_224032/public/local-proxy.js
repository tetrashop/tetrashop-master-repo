const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3003; // تغییر به پورت 3003

const server = http.createServer((req, res) => {
    // تنظیم هدرهای CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    console.log('📡 دریافت درخواست:', req.url);
    
    // استخراج آدرس واقعی از query parameter
    const parsedUrl = url.parse(req.url, true);
    const targetUrl = parsedUrl.query.url;
    
    if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'پارامتر url الزامی است' }));
        return;
    }
    
    try {
        const options = {
            method: req.method,
            headers: {
                'User-Agent': 'Tetrashop-Local-Proxy/1.0',
                'Accept': 'application/json'
            }
        };
        
        // انتخاب ماژول مناسب بر اساس پروتکل
        const requestModule = targetUrl.startsWith('https://') ? https : http;
        
        const proxyReq = requestModule.request(targetUrl, options, (proxyRes) => {
            console.log('📊 وضعیت پاسخ:', proxyRes.statusCode);
            
            res.writeHead(proxyRes.statusCode, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            
            let data = '';
            proxyRes.on('data', (chunk) => {
                data += chunk;
            });
            
            proxyRes.on('end', () => {
                console.log('✅ پاسخ ارسال شد');
                res.end(data);
            });
        });
        
        proxyReq.on('error', (error) => {
            console.error('❌ خطای پروکسی:', error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                error: 'خطا در ارتباط با سرور',
                message: error.message 
            }));
        });
        
        proxyReq.end();
        
    } catch (error) {
        console.error('❌ خطای پردازش:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            error: 'خطا در پردازش درخواست',
            message: error.message 
        }));
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 سرور پروکسی محلی راه‌اندازی شد!');
    console.log(`📡 پورت: ${PORT}`);
    console.log('✅ آماده دریافت درخواست‌ها...');
    console.log('');
    console.log('💡 استفاده:');
    console.log(`http://localhost:${PORT}/?url=ENCODED_URL`);
});
