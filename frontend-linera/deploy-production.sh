#!/bin/bash

# AI Power Trade Linera - Production Deployment
# This script builds and deploys the application

set -e

echo "🚀 AI POWER TRADE LINERA - Production Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
VPS_HOST="152.42.199.50"
VPS_USER="root"
DEPLOY_PATH="/var/www/ai-power-trade"

echo -e "${BLUE}Step 1: Building application...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${YELLOW}❌ Build failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 2: Preparing deployment package...${NC}"

# Create deployment archive
cd dist
tar -czf ../ai-power-trade-production.tar.gz .
cd ..

echo -e "${GREEN}✅ Package created: ai-power-trade-production.tar.gz${NC}"

echo ""
echo -e "${BLUE}Step 3: Uploading to VPS...${NC}"

# Upload to VPS
scp ai-power-trade-production.tar.gz ${VPS_USER}@${VPS_HOST}:/tmp/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Upload successful${NC}"
else
    echo -e "${YELLOW}❌ Upload failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 4: Deploying on VPS...${NC}"

# Deploy on VPS
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
    # Create deployment directory
    mkdir -p /var/www/ai-power-trade
    
    # Backup existing deployment
    if [ -d "/var/www/ai-power-trade/current" ]; then
        mv /var/www/ai-power-trade/current /var/www/ai-power-trade/backup-$(date +%Y%m%d-%H%M%S)
    fi
    
    # Extract new deployment
    mkdir -p /var/www/ai-power-trade/current
    tar -xzf /tmp/ai-power-trade-production.tar.gz -C /var/www/ai-power-trade/current
    
    # Set permissions
    chown -R www-data:www-data /var/www/ai-power-trade/current
    chmod -R 755 /var/www/ai-power-trade/current
    
    # Clean up
    rm /tmp/ai-power-trade-production.tar.gz
    
    echo "✅ Deployment complete"
ENDSSH

echo ""
echo -e "${BLUE}Step 5: Configuring Nginx...${NC}"

# Configure Nginx
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
    # Create Nginx config
    cat > /etc/nginx/sites-available/ai-power-trade << 'EOF'
server {
    listen 80;
    server_name 152.42.199.50;
    
    root /var/www/ai-power-trade/current;
    index index.html;
    
    # CORS and Security Headers for WASM
    add_header Cross-Origin-Opener-Policy "same-origin" always;
    add_header Cross-Origin-Embedder-Policy "credentialless" always;
    add_header Access-Control-Allow-Origin "*" always;
    
    # WASM MIME type
    types {
        application/wasm wasm;
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|wasm)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Cross-Origin-Opener-Policy "same-origin" always;
        add_header Cross-Origin-Embedder-Policy "credentialless" always;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json application/wasm;
}
EOF
    
    # Enable site
    ln -sf /etc/nginx/sites-available/ai-power-trade /etc/nginx/sites-enabled/
    
    # Test Nginx config
    nginx -t
    
    # Reload Nginx
    systemctl reload nginx
    
    echo "✅ Nginx configured"
ENDSSH

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Application URL:${NC} http://152.42.199.50"
echo ""
echo -e "${BLUE}Features:${NC}"
echo "  ✅ Linera WASM Integration"
echo "  ✅ Wallet Creation (Testnet Conway)"
echo "  ✅ AI Trading Signals"
echo "  ✅ Trading History"
echo "  ✅ Real-time Updates"
echo ""
echo -e "${BLUE}Network:${NC} Linera Testnet Conway"
echo -e "${BLUE}Faucet:${NC} https://faucet.testnet-conway.linera.net"
echo ""
echo -e "${YELLOW}Note:${NC} Users can create wallets directly in browser!"
echo ""
