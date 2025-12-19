#!/bin/bash
# Script ini dijalankan DI DALAM VPS setelah upload

echo "🚀 Installing AI POWER TRADE on VPS..."
echo "======================================"

# Update system
echo "📦 Updating system..."
apt update && apt upgrade -y

# Install dependencies
echo "🔧 Installing dependencies..."
apt install -y curl build-essential nginx git

# Install Rust
echo "🦀 Installing Rust..."
if ! command -v cargo &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
fi

# Install Linera CLI
echo "🔗 Installing Linera..."
if ! command -v linera &> /dev/null; then
    cargo install linera-cli --git https://github.com/linera-io/linera-protocol.git --locked
fi

# Setup application directory
echo "📁 Setting up application..."
mkdir -p /opt/ai-power-trade
cd /opt/ai-power-trade

# Extract uploaded files (if tar exists)
if [ -f /root/ai-power-trade-deploy.tar.gz ]; then
    tar -xzf /root/ai-power-trade-deploy.tar.gz
fi

# Start Linera network
echo "🌐 Starting Linera network..."
pkill -f "linera" || true
sleep 2

# Start in background
nohup linera net up --testing-prng-seed 37 > /var/log/linera.log 2>&1 &
sleep 10

# Start GraphQL service
echo "📊 Starting GraphQL service..."
nohup linera service --port 8080 > /var/log/linera-service.log 2>&1 &
sleep 5

# Configure Nginx
echo "⚙️ Configuring Nginx..."
cat > /etc/nginx/sites-available/default << 'NGINX_EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /opt/ai-power-trade;
    index AI-POWER-TRADE-FINAL.html index.html;
    
    server_name _;
    
    # Enable CORS
    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
    
    # Main application
    location / {
        try_files $uri $uri/ =404;
    }
    
    # GraphQL proxy
    location /graphql {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # CORS for GraphQL
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
            return 204;
        }
    }
}
NGINX_EOF

# Test and restart Nginx
nginx -t && systemctl restart nginx
systemctl enable nginx

# Create status check script
cat > /opt/ai-power-trade/check-status.sh << 'STATUS_EOF'
#!/bin/bash
echo "🔍 AI POWER TRADE Status"
echo "======================="

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me)

# Check services
echo ""
echo "Services:"
systemctl is-active nginx && echo "✅ Nginx: Running" || echo "❌ Nginx: Stopped"
pgrep -f "linera net" > /dev/null && echo "✅ Linera Network: Running" || echo "❌ Linera Network: Stopped"
pgrep -f "linera service" > /dev/null && echo "✅ Linera Service: Running" || echo "❌ Linera Service: Stopped"

# Check endpoints
echo ""
echo "Endpoints:"
curl -s http://localhost:8080 > /dev/null && echo "✅ GraphQL: Responding" || echo "❌ GraphQL: Not responding"
curl -s http://localhost/AI-POWER-TRADE-FINAL.html > /dev/null && echo "✅ Web Interface: Accessible" || echo "❌ Web Interface: Not accessible"

echo ""
echo "🌐 Public URLs:"
echo "   Main App: http://$PUBLIC_IP/AI-POWER-TRADE-FINAL.html"
echo "   Judge Verification: http://$PUBLIC_IP/JUDGE-VERIFICATION.html"
echo "   GraphQL API: http://$PUBLIC_IP/graphql"
echo ""
echo "📊 Logs:"
echo "   Linera Network: tail -f /var/log/linera.log"
echo "   Linera Service: tail -f /var/log/linera-service.log"
echo "   Nginx: tail -f /var/log/nginx/error.log"
STATUS_EOF

chmod +x /opt/ai-power-trade/check-status.sh

# Final status
echo ""
echo "✅ Installation Complete!"
echo "========================"
PUBLIC_IP=$(curl -s ifconfig.me)
echo ""
echo "🌐 Your AI POWER TRADE is live at:"
echo "   http://$PUBLIC_IP/AI-POWER-TRADE-FINAL.html"
echo ""
echo "🔍 Check status: /opt/ai-power-trade/check-status.sh"
echo ""
echo "🏆 Ready for demo!"
