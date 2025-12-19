#!/bin/bash
# Deploy Linera Frontend to VPS

set -e

VPS_IP="152.42.199.50"
VPS_USER="root"
DEPLOY_DIR="/opt/ai-power-trade"

echo "🚀 Deploying Linera Frontend to VPS..."
echo ""

# Upload HTML file
echo "📤 Uploading AI-POWER-TRADE-LINERA.html..."
scp AI-POWER-TRADE-LINERA.html ${VPS_USER}@${VPS_IP}:${DEPLOY_DIR}/

# Create HTTP server script with proper CORS headers
echo "🔧 Creating HTTP server with CORS headers..."
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
cd /opt/ai-power-trade

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Create server script
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
    // Set CORS headers for Linera WASM
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './AI-POWER-TRADE-LINERA.html';
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
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
});
SERVEREOF

# Stop existing server
pkill -f "node linera-server.js" || true

# Start server
echo "🚀 Starting Linera frontend server..."
nohup node linera-server.js > /var/log/linera-frontend.log 2>&1 &

sleep 2

# Test server
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server started successfully"
else
    echo "❌ Server failed to start"
    exit 1
fi

EOF

# Update Nginx to proxy port 3000
echo "🔧 Updating Nginx configuration..."
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
# Backup existing config
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Update Nginx config
cat > /etc/nginx/sites-available/default << 'NGINXEOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /opt/ai-power-trade;
    index AI-POWER-TRADE-LINERA.html;
    
    server_name _;
    
    # Linera frontend with CORS headers
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers for Linera WASM
        add_header Cross-Origin-Opener-Policy same-origin always;
        add_header Cross-Origin-Embedder-Policy require-corp always;
    }
    
    # GraphQL endpoint
    location /graphql {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;
        
        if ($request_method = OPTIONS) {
            return 204;
        }
    }
}
NGINXEOF

# Test and reload Nginx
nginx -t && systemctl reload nginx

echo "✅ Nginx updated"
EOF

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Access your app at:"
echo "   http://${VPS_IP}/"
echo ""
echo "📊 Check logs:"
echo "   ssh ${VPS_USER}@${VPS_IP} 'tail -f /var/log/linera-frontend.log'"
echo ""
