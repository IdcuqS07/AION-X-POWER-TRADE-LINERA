#!/bin/bash

VPS_IP="152.42.199.50"
VPS_USER="root"

echo "🚀 Clean Deploy - Percentage Feature"
echo "====================================="
echo ""

# Build fresh
echo "📦 Building fresh..."
cd frontend-linera
rm -rf dist node_modules/.vite
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ Build complete!"
echo ""

# Create clean package
cd ..
echo "📦 Creating deployment package..."
tar -czf clean-deploy.tar.gz -C frontend-linera/dist .

echo ""
echo "📤 Uploading to VPS..."
scp clean-deploy.tar.gz $VPS_USER@$VPS_IP:/tmp/

echo ""
echo "🔧 Deploying on VPS..."
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    echo "🗑️  Removing old files..."
    rm -rf /var/www/ai-power-trade/*
    
    echo "📂 Extracting new files..."
    cd /var/www/ai-power-trade
    tar -xzf /tmp/clean-deploy.tar.gz
    
    echo "🔧 Setting permissions..."
    chown -R www-data:www-data /var/www/ai-power-trade
    chmod -R 755 /var/www/ai-power-trade
    
    echo "📋 Listing deployed files..."
    ls -lh /var/www/ai-power-trade/
    
    echo ""
    echo "🔍 Verifying percentage slider in HTML..."
    if grep -q "trade-percentage-slider" /var/www/ai-power-trade/index.html; then
        echo "✅ Percentage slider found in HTML!"
    else
        echo "❌ Percentage slider NOT found!"
    fi
    
    echo ""
    echo "🔄 Restarting nginx..."
    systemctl restart nginx
    
    echo "🧹 Cleaning up..."
    rm -f /tmp/clean-deploy.tar.gz
    
    echo ""
    echo "✅ Deployment complete!"
ENDSSH

# Cleanup
rm -f clean-deploy.tar.gz

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Clean Deployment Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 URL: http://$VPS_IP"
echo ""
echo "🔄 IMPORTANT: Clear browser cache!"
echo "  • Hard Refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R"
echo "  • Or use Incognito/Private mode"
echo "  • Or clear all browser cache"
echo ""
echo "✨ Look for: Trade Amount slider (10%-100%)"
echo ""
