#!/bin/bash

VPS_IP="152.42.199.50"
VPS_USER="root"
VPS_PATH="/var/www/ai-power-trade"

echo "🚀 Deploying Percentage Feature to VPS"
echo "========================================"
echo ""
echo "VPS: $VPS_IP"
echo "Path: $VPS_PATH"
echo ""

# Build frontend
echo "📦 Building frontend..."
cd frontend-linera
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""

# Create deployment package
echo "📦 Creating deployment package..."
cd ..
tar -czf percentage-update.tar.gz \
    frontend-linera/dist/ \
    frontend-linera/index.html \
    frontend-linera/package.json

echo ""
echo "📤 Uploading to VPS..."
scp percentage-update.tar.gz $VPS_USER@$VPS_IP:/tmp/

echo ""
echo "🔧 Deploying on VPS..."
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    echo "📂 Extracting files..."
    cd /tmp
    tar -xzf percentage-update.tar.gz
    
    echo "🔄 Backing up current version..."
    cp -r /var/www/ai-power-trade /var/www/ai-power-trade.backup.$(date +%Y%m%d_%H%M%S)
    
    echo "📋 Copying new files..."
    cp -r frontend-linera/dist/* /var/www/ai-power-trade/
    
    echo "🔧 Setting permissions..."
    chown -R www-data:www-data /var/www/ai-power-trade
    chmod -R 755 /var/www/ai-power-trade
    
    echo "🔄 Restarting nginx..."
    systemctl restart nginx
    
    echo "🧹 Cleaning up..."
    rm -rf /tmp/percentage-update.tar.gz /tmp/frontend-linera
    
    echo ""
    echo "✅ Deployment complete!"
ENDSSH

# Cleanup local
rm -f percentage-update.tar.gz

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Deployment Successful!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Live URL: http://$VPS_IP"
echo ""
echo "✨ New Features Deployed:"
echo "  • Trade Percentage Slider (10%-100%)"
echo "  • Real-time USD Amount Calculation"
echo "  • Enhanced Execute Button"
echo "  • Trade History with Percentage"
echo ""
echo "🧪 Test the features:"
echo "  1. Open: http://$VPS_IP"
echo "  2. Connect Wallet"
echo "  3. Update Market Data"
echo "  4. Adjust Percentage Slider"
echo "  5. Generate Signal"
echo "  6. Execute Trade"
echo ""
