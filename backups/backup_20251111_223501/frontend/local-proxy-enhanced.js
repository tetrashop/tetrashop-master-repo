const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3003;

const server = http.createServer((req, res) => {
    // تنظیم هدرهای CORS کامل
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    console.log('📡 دریافت درخواست:', req.method, req.url);
    
    const parsedUrl = url.parse(req.url, true);
    const targetUrl = parsedUrl.query.url;
    
    if (!targetUrl) {
        res.writeHead(400, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
            success: false,
            error: 'پارامتر url الزامی است' 
        }));
        return;
    }
    
    try {
        const parsedTarget = url.parse(targetUrl, true);
        
        // اضافه کردن پارامترهای اصلی به URL مقصد
        Object.keys(parsedUrl.query).forEach(key => {
            if (key !== 'url' && !parsedTarget.query[key]) {
                parsedTarget.query[key] = parsedUrl.query[key];
            }
        });
        
        const finalTargetUrl = url.format({
            protocol: parsedTarget.protocol,
            host: parsedTarget.host,
            pathname: parsedTarget.pathname,
            query: parsedTarget.query
        });
        
        console.log('🎯 ارسال به:', finalTargetUrl);
        
        const options = {
            method: req.method,
            headers: {
                'User-Agent': 'Tetrashop-Local-Proxy/1.0',
                'Accept': 'application/json, */*',
                'Content-Type': 'application/json'
            },
            timeout: 10000
        };
        
        const requestModule = finalTargetUrl.startsWith('https://') ? https : http;
        
        const proxyReq = requestModule.request(finalTargetUrl, options, (proxyRes) => {
            console.log('📊 وضعیت پاسخ:', proxyRes.statusCode);
            
            let responseData = '';
            proxyRes.on('data', (chunk) => {
                responseData += chunk;
            });
            
            proxyRes.on('end', () => {
                console.log('✅ پاسخ دریافت شد، طول:', responseData.length);
                
                res.writeHead(proxyRes.statusCode, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
                });
                
                res.end(responseData);
            });
        });
        
        proxyReq.on('error', (error) => {
            console.error('❌ خطای ارتباط:', error.message);
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ 
                success: false,
                error: 'خطا در ارتباط با سرور مقصد',
                message: error.message 
            }));
        });
        
        proxyReq.on('timeout', () => {
            console.error('⏰ timeout ارتباط');
            proxyReq.destroy();
            res.writeHead(504, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ 
                success: false,
                error: 'Timeout در ارتباط با سرور'
            }));
        });
        
        // اگر داده‌ای در بدنه باشد، ارسال می‌کنیم
        if (req.method === 'POST' || req.method === 'PUT') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                proxyReq.write(body);
                proxyReq.end();
            });
        } else {
            proxyReq.end();
        }
        
    } catch (error) {
        console.error('❌ خطای پردازش:', error.message);
        res.writeHead(500, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
            success: false,
            error: 'خطا در پردازش درخواست',
            message: error.message 
        }));
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 سرور پروکسی پیشرفته راه‌اندازی شد!');
    console.log(`📡 پورت: ${PORT}`);
    console.log('✅ آماده دریافت درخواست‌ها...');
    console.log('');
    console.log('💡 استفاده:');
    console.log(`http://localhost:${PORT}/?url=ENCODED_URL`);
});

// مدیریت graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 دریافت SIGINT، خروج...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 دریافت SIGTERM، خروج...');
    process.exit(0);
});
