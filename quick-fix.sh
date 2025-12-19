#!/bin/bash
# Quick fix - force upload and serve new file

echo "🔍 Step 1: Check current VPS files"
ssh root@152.42.199.50 "ls -lh /opt/ai-power-trade/*.html | tail -5"

echo ""
echo "📤 Step 2: Upload NEW file"
scp AI-POWER-TRADE-LINERA.html root@152.42.199.50:/opt/ai-power-trade/

echo ""
echo "🔧 Step 3: Force serve new file"
ssh root@152.42.199.50 << 'EOF'
cd /opt/ai-power-trade

# Kill all servers
pkill -f "node linera-server.js" || true
pkill -f "python3 -m http.server" || true
pkill -f "http.server" || true

# Verify file exists
echo "Files in directory:"
ls -lh *.html

# Create simple server
cat > serve-new.js << 'JSEOF'
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    console.log('Request:', req.url);
    
    // CORS headers for Linera WASM
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Always serve the new file
    const file = './AI-POWER-TRADE-LINERA.html';
    
    fs.readFile(file, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error: ' + err.message);
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        }
    });
}).listen(3000, '0.0.0.0', () => {
    console.log('✅ Serving AI-POWER-TRADE-LINERA.html on port 3000');
});
JSEOF

# Start server
nohup node serve-new.js > /var/log/linera-new.log 2>&1 &
sleep 2

# Check if running
ps aux | grep "node serve-new.js" | grep -v grep

# Test
echo ""
echo "Testing localhost:3000..."
curl -s http://localhost:3000 | head -20

EOF

echo ""
echo "🔧 Step 4: Update Nginx to proxy port 3000"
ssh root@152.42.199.50 << 'EOF'
cat > /etc/nginx/sites-available/default << 'NGINXEOF'
server {
    listen 80 default_server;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_pass_header Cross-Origin-Opener-Policy;
        proxy_pass_header Cross-Origin-Embedder-Policy;
    }
}
NGINXEOF

nginx -t && systemctl reload nginx
echo "✅ Nginx reloaded"
EOF

echo ""
echo "✅ DONE! Now test:"
echo "   1. Open: http://152.42.199.50/"
echo "   2. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)"
echo "   3. Check console - should see 'Linera modules loaded'"
echo ""
