#!/bin/bash
set -e

echo "🚀 Fixing VPS to serve NEW Linera file..."
echo ""

# Upload
echo "📤 Uploading AI-POWER-TRADE-LINERA.html..."
scp AI-POWER-TRADE-LINERA.html root@152.42.199.50:/opt/ai-power-trade/
echo "✅ Uploaded"
echo ""

# Setup server
echo "🔧 Setting up server..."
ssh root@152.42.199.50 'bash -s' << 'ENDSSH'
cd /opt/ai-power-trade

# Kill all
pkill -f node 2>/dev/null || true
pkill -f python 2>/dev/null || true
sleep 1

# Verify file
if [ ! -f "AI-POWER-TRADE-LINERA.html" ]; then
    echo "❌ File not found!"
    exit 1
fi

echo "✅ File exists: $(ls -lh AI-POWER-TRADE-LINERA.html)"

# Create server
cat > server.js << 'EOF'
require('http').createServer((req, res) => {
    console.log(req.url);
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    require('fs').readFile('./AI-POWER-TRADE-LINERA.html', (e, d) => {
        res.writeHead(e ? 500 : 200, {'Content-Type': 'text/html'});
        res.end(e ? 'Error' : d);
    });
}).listen(3000, '0.0.0.0', () => console.log('Port 3000'));
EOF

# Start
nohup node server.js > /var/log/linera.log 2>&1 &
sleep 2

# Check
if ! pgrep -f "node server.js" > /dev/null; then
    echo "❌ Server failed"
    cat /var/log/linera.log
    exit 1
fi

echo "✅ Server running (PID: $(pgrep -f 'node server.js'))"

# Nginx
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    location / { proxy_pass http://localhost:3000; }
}
EOF

nginx -t && systemctl reload nginx
echo "✅ Nginx updated"

# Test
echo ""
echo "🧪 Testing..."
if curl -s http://localhost:3000 | grep -q "AI POWER TRADE"; then
    echo "✅ Server responding correctly"
else
    echo "⚠️ Server response unexpected"
fi

ENDSSH

echo ""
echo "========================================="
echo "✅ DONE!"
echo "========================================="
echo ""
echo "🌐 Open: http://152.42.199.50/"
echo "🔄 HARD REFRESH: Ctrl+Shift+R"
echo "🔍 Console should show: '✅ Linera modules loaded'"
echo ""
echo "📊 Monitor: ssh root@152.42.199.50 'tail -f /var/log/linera.log'"
echo ""
