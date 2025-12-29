#!/bin/bash

echo "🚀 Wave 6 Deployment: On-Chain Trade History"
echo "============================================="
echo ""

# Check if we're on VPS
if [ -f "/etc/nginx/sites-available/aion-x" ]; then
    echo "📍 Detected VPS environment"
    IS_VPS=true
else
    echo "📍 Detected local environment"
    IS_VPS=false
fi

echo ""
echo "📦 Step 1: Building frontend..."
cd frontend-linera
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

if [ "$IS_VPS" = true ]; then
    echo "📤 Step 2: Deploying to production..."
    
    # Backup current version
    if [ -d "/var/www/aion-x" ]; then
        echo "💾 Backing up current version..."
        sudo cp -r /var/www/aion-x /var/www/aion-x.backup.$(date +%Y%m%d_%H%M%S)
    fi
    
    # Deploy new version
    echo "🔄 Copying files to /var/www/aion-x..."
    sudo rm -rf /var/www/aion-x/*
    sudo cp -r dist/* /var/www/aion-x/
    
    # Set permissions
    sudo chown -R www-data:www-data /var/www/aion-x
    sudo chmod -R 755 /var/www/aion-x
    
    # Reload nginx
    echo "🔄 Reloading nginx..."
    sudo nginx -t && sudo systemctl reload nginx
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "🌐 Live at: https://www.aion-x.xyz/"
    echo ""
    echo "📊 Wave 6 Features:"
    echo "   ✓ Smart contract deployed: 17f27b3394c1dfced349fcf477e4b344f374417bde79d628b4345fb430a3747c"
    echo "   ✓ Trade history stored on blockchain"
    echo "   ✓ GraphQL queries for user trades"
    echo "   ✓ Total P&L calculation"
    echo "   ✓ Blockchain history UI"
    echo ""
    echo "🧪 Test the new features:"
    echo "   1. Connect wallet"
    echo "   2. Execute a trade"
    echo "   3. Check 'Blockchain Trade History' section"
    echo "   4. Click 'Refresh from Blockchain'"
    echo ""
else
    echo "📤 Step 2: Preparing for deployment..."
    echo ""
    echo "To deploy to VPS, run this script on the server:"
    echo "  ssh root@152.42.199.50"
    echo "  cd /root/ai-power-trade"
    echo "  ./deploy-wave-6.sh"
    echo ""
    echo "Or use rsync to upload:"
    echo "  rsync -avz --delete frontend-linera/dist/ root@152.42.199.50:/var/www/aion-x/"
    echo ""
fi

echo "✅ Wave 6 deployment ready!"
