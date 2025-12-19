#!/bin/bash

VPS_IP="152.42.199.50"
VPS_USER="root"
BACKEND_PATH="/opt/faucet-backend"

echo "🚀 Deploying Faucet Backend to VPS"
echo "===================================="
echo ""

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf faucet-backend.tar.gz faucet-backend/

echo ""
echo "📤 Uploading to VPS..."
scp faucet-backend.tar.gz $VPS_USER@$VPS_IP:/tmp/

echo ""
echo "🔧 Installing on VPS..."
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    echo "1️⃣ Extracting files..."
    cd /tmp
    tar -xzf faucet-backend.tar.gz
    
    echo "2️⃣ Creating backend directory..."
    mkdir -p /opt/faucet-backend
    cp -r faucet-backend/* /opt/faucet-backend/
    
    echo "3️⃣ Installing Node.js (if not installed)..."
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    fi
    
    echo "4️⃣ Installing dependencies..."
    cd /opt/faucet-backend
    npm install --production
    
    echo "5️⃣ Setting up environment..."
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "⚠️  Please configure .env file manually"
    fi
    
    echo "6️⃣ Installing PM2..."
    npm install -g pm2
    
    echo "7️⃣ Starting faucet service..."
    pm2 stop faucet-api 2>/dev/null || true
    pm2 delete faucet-api 2>/dev/null || true
    pm2 start server.js --name faucet-api
    pm2 save
    
    echo "8️⃣ Configuring nginx..."
    cat > /etc/nginx/sites-available/faucet-api << 'EOF'
location /api/faucet {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
}
EOF
    
    # Add to main nginx config if not exists
    if ! grep -q "include /etc/nginx/sites-available/faucet-api" /etc/nginx/sites-available/ai-power-trade; then
        sed -i '/location \/ {/i\    include /etc/nginx/sites-available/faucet-api;' /etc/nginx/sites-available/ai-power-trade
    fi
    
    echo "9️⃣ Reloading nginx..."
    nginx -t && systemctl reload nginx
    
    echo "🔟 Checking service status..."
    pm2 status
    
    echo ""
    echo "✅ Deployment complete!"
    
    # Cleanup
    rm -rf /tmp/faucet-backend.tar.gz /tmp/faucet-backend
ENDSSH

# Cleanup local
rm -f faucet-backend.tar.gz

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Faucet Backend Deployed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 API Endpoints:"
echo "  • Health: http://$VPS_IP/health"
echo "  • Info: http://$VPS_IP/api/faucet/info"
echo "  • Claim: http://$VPS_IP/api/faucet/claim"
echo ""
echo "📝 Next Steps:"
echo "  1. SSH to VPS: ssh $VPS_USER@$VPS_IP"
echo "  2. Configure .env: nano /opt/faucet-backend/.env"
echo "  3. Restart service: pm2 restart faucet-api"
echo "  4. View logs: pm2 logs faucet-api"
echo ""
