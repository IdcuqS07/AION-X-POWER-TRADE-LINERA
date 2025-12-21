#!/bin/bash

echo "🎨 Deploying Professional Design to VPS..."
echo "=========================================="

# Build frontend
echo "📦 Building frontend..."
cd frontend-linera
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Deploy to VPS
echo "🚀 Deploying to VPS..."
scp -r dist/* root@152.42.199.50:/var/www/ai-power-trade/

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo "✅ Deployment successful!"
echo ""
echo "🌐 Your site is live at: http://152.42.199.50"
echo "💡 Remember to hard refresh (Cmd+Shift+R) or use incognito mode"
echo ""
echo "📝 Changes applied:"
echo "   - Professional dark theme (TradingView style)"
echo "   - Clean layout with 2-column grid"
echo "   - Improved typography and spacing"
echo "   - Better color scheme and borders"
echo "   - All functionality preserved"
