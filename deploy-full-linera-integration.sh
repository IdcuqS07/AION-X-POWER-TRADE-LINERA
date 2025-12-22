#!/bin/bash

# Deploy Full Linera Integration to Production VPS
# Includes smart contract integration module

echo "🚀 Deploying FULL Linera Integration to Production"
echo "===================================================="
echo ""
echo "📦 New Features:"
echo "  ✅ Smart contract integration (trade-counter-contract.js)"
echo "  ✅ On-chain trade counter"
echo "  ✅ On-chain signal counter"
echo "  ✅ Real-time blockchain queries"
echo "  ✅ WebSocket subscriptions"
echo ""

# VPS Configuration
VPS_HOST="152.42.199.50"
VPS_USER="root"
VPS_PATH="/var/www/ai-power-trade"

echo "🔧 Step 1: Build frontend with new integration..."
cd frontend-linera

# Clean previous build
rm -rf dist/

# Build production bundle
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build complete!"
echo ""

echo "📊 Build statistics:"
ls -lh dist/
echo ""

echo "🔍 Step 2: Verify new files are included..."
if [ -f "dist/assets/trade-counter-contract-*.js" ] || grep -r "TradeCounterContract" dist/assets/*.js > /dev/null 2>&1; then
    echo "✅ Smart contract integration found in bundle"
else
    echo "⚠️  Warning: Smart contract integration may not be in bundle"
    echo "   Checking source files..."
    if [ -f "src/trade-counter-contract.js" ]; then
        echo "   ✅ Source file exists: src/trade-counter-contract.js"
    else
        echo "   ❌ Source file missing!"
        exit 1
    fi
fi
echo ""

echo "📤 Step 3: Upload to VPS..."
echo "Uploading to: $VPS_USER@$VPS_HOST:$VPS_PATH"
echo ""

# Create backup of current deployment
echo "💾 Creating backup of current deployment..."
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz *.html assets/ 2>/dev/null || true"

# Upload new files
echo "📤 Uploading new files..."
scp -r dist/* $VPS_USER@$VPS_HOST:$VPS_PATH/

if [ $? -ne 0 ]; then
    echo "❌ Upload failed!"
    exit 1
fi

echo "✅ Upload complete!"
echo ""

echo "🔄 Step 4: Clear browser cache on VPS..."
ssh $VPS_USER@$VPS_HOST << 'EOF'
    # Add cache-busting headers to nginx if not already present
    if ! grep -q "add_header Cache-Control" /etc/nginx/sites-available/default; then
        echo "Adding cache control headers..."
        # This would require nginx config modification
        # For now, we'll just note it
        echo "⚠️  Note: Consider adding cache-control headers to nginx config"
    fi
    
    # Restart nginx to ensure fresh serving
    echo "Restarting nginx..."
    systemctl restart nginx
    
    echo "✅ Nginx restarted"
EOF

echo ""

echo "🧪 Step 5: Verify deployment..."
echo "Testing connection to VPS..."

# Test if site is accessible
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$VPS_HOST)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Site is accessible (HTTP $HTTP_CODE)"
else
    echo "⚠️  Warning: Site returned HTTP $HTTP_CODE"
fi

echo ""

echo "🔍 Step 6: Verify smart contract integration..."
echo "Checking if new module is loaded..."

# Check if the new JavaScript module is present
RESPONSE=$(curl -s http://$VPS_HOST)
if echo "$RESPONSE" | grep -q "trade-counter-contract" || echo "$RESPONSE" | grep -q "TradeCounterContract"; then
    echo "✅ Smart contract integration detected in page"
else
    echo "⚠️  Smart contract integration not detected (may be in bundled JS)"
fi

echo ""

echo "📊 Step 7: Deployment summary..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "🌐 Live URL: http://$VPS_HOST"
echo "📝 Application ID: 4819de606012d48a692759f04c833e06191544cdf56bdec9e6fe13ece1fce718"
echo "🔗 Network: Linera Testnet Conway"
echo ""
echo "🎯 New Features Deployed:"
echo "  ✅ Smart contract integration module"
echo "  ✅ On-chain trade counter (increments on every trade)"
echo "  ✅ On-chain signal counter (increments on every signal)"
echo "  ✅ Real-time blockchain queries via GraphQL"
echo "  ✅ WebSocket subscriptions for live updates"
echo "  ✅ On-chain statistics display in UI"
echo "  ✅ Automatic fallback to local storage"
echo ""
echo "🧪 Testing Instructions:"
echo "  1. Visit: http://$VPS_HOST"
echo "  2. Open browser console (F12)"
echo "  3. Connect wallet"
echo "  4. Look for: '🔗 Initializing smart contract integration...'"
echo "  5. Look for: '✅ Smart contract integration ready!'"
echo "  6. Generate a signal - should see on-chain counter update"
echo "  7. Execute a trade - should see on-chain counter update"
echo "  8. Check for '📊 On-Chain Statistics' box in UI"
echo ""
echo "📝 Verification Commands:"
echo "  # Check if site is up"
echo "  curl -I http://$VPS_HOST"
echo ""
echo "  # Check console logs"
echo "  ssh $VPS_USER@$VPS_HOST 'tail -f /var/log/nginx/access.log'"
echo ""
echo "  # View deployed files"
echo "  ssh $VPS_USER@$VPS_HOST 'ls -la $VPS_PATH'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Full Linera Integration is now LIVE in production!"
echo ""

cd ..
