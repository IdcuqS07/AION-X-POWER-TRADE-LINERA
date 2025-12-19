#!/bin/bash
# Check current VPS status and deploy new Linera frontend

VPS="root@152.42.199.50"

echo "🔍 Checking current VPS status..."
echo ""

# Check what file is currently being served
echo "📄 Current files in /opt/ai-power-trade:"
ssh $VPS "ls -lh /opt/ai-power-trade/*.html"
echo ""

# Check Nginx config
echo "⚙️ Current Nginx root/index:"
ssh $VPS "grep -E 'root|index' /etc/nginx/sites-available/default | head -5"
echo ""

# Check running services
echo "🔌 Running services:"
ssh $VPS "ps aux | grep -E 'node|nginx' | grep -v grep"
echo ""

echo "========================================="
echo "🚀 DEPLOYING NEW LINERA FRONTEND"
echo "========================================="
echo ""

# Upload new file
echo "📤 Uploading AI-POWER-TRADE-LINERA.html..."
scp AI-POWER-TRADE-LINERA.html $VPS:/opt/ai-power-trade/
echo "✅ Uploaded"
echo ""

# Setup Node.js server
echo "🔧 Setting up Node.js server with CORS headers..."
ssh $VPS << 'EOF'
cd /opt/ai-power-trade

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

echo "Node version: $(node --version)"

# Create server
cat > linera-server.js << 'SERVEREOF'
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '0.0.0.0';

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Set CORS headers for Linera WASM
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    let filePath = '.' + req.url;
    if (filePath === './' || filePath === './index.html') {
        filePath = './AI-POWER-TRADE-LINERA.html';
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found: ' + filePath);
            } else {
                res.writeHead(500);
                res.end('500 Internal Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log(`✅ Linera Frontend Server running at http://${HOST}:${PORT}/`);
    console.log(`Serving: AI-POWER-TRADE-LINERA.html`);
});
SERVEREOF

echo "✅ Server script created"

# Stop old server
pkill -f "node linera-server.js" || true
pkill -f "python3 -m http.server" || true
sleep 1

# Start new server
echo "🚀 Starting server..."
nohup node linera-server.js > /var/log/linera-frontend.log 2>&1 &
sleep 2

# Check if running
if ps aux | grep "node linera-server.js" | grep -v grep > /dev/null; then
    echo "✅ Server started (PID: $(pgrep -f 'node linera-server.js'))"
else
    echo "❌ Server failed to start"
    cat /var/log/linera-frontend.log
    exit 1
fi

# Test server
echo "🧪 Testing server..."
curl -I http://localhost:3000 2>&1 | head -10

EOF

echo ""
echo "🔧 Updating Nginx..."
ssh $VPS << 'EOF'
# Backup
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%s)

# New config
cat > /etc/nginx/sites-available/default << 'NGINXEOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    # Linera frontend (proxied to Node.js with CORS headers)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Pass through CORS headers from Node.js
        proxy_pass_header Cross-Origin-Opener-Policy;
        proxy_pass_header Cross-Origin-Embedder-Policy;
    }
    
    # GraphQL endpoint (if needed)
    location /graphql {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;
        
        if ($request_method = OPTIONS) {
            return 204;
        }
    }
}
NGINXEOF

# Test and reload
if nginx -t 2>&1; then
    systemctl reload nginx
    echo "✅ Nginx reloaded"
else
    echo "❌ Nginx config error"
    exit 1
fi

EOF

echo ""
echo "========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "========================================="
echo ""
echo "🌐 Access your app:"
echo "   http://152.42.199.50/"
echo ""
echo "📊 Monitor logs:"
echo "   ssh $VPS 'tail -f /var/log/linera-frontend.log'"
echo ""
echo "🧪 Test CORS headers:"
echo "   curl -I http://152.42.199.50/"
echo ""
echo "Expected headers:"
echo "   Cross-Origin-Opener-Policy: same-origin"
echo "   Cross-Origin-Embedder-Policy: require-corp"
echo ""
