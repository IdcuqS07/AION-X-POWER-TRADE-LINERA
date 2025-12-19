#!/bin/bash

echo "🚀 Deploying AI Power Trade Frontend with Contract Integration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Check environment
echo ""
echo "Step 1: Checking environment..."
if [ ! -f "frontend-linera/.env" ]; then
    echo "❌ .env file not found"
    exit 1
fi
echo "✅ Environment configured"

# Step 2: Install dependencies
echo ""
echo "Step 2: Installing dependencies..."
cd frontend-linera
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi
echo "✅ Dependencies installed"

# Step 3: Build frontend
echo ""
echo "Step 3: Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"

# Step 4: Deploy to VPS
echo ""
echo "Step 4: Deploying to VPS..."
rsync -avz --delete dist/ root@152.42.199.50:/var/www/html/
if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi
echo "✅ Deployed to VPS"

cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Frontend URL: http://152.42.199.50/"
echo ""
echo "📋 Features:"
echo "   • Wallet connection"
echo "   • Live market data from Binance"
echo "   • AI trading signals (mock + contract)"
echo "   • Trade execution"
echo "   • Portfolio tracking"
echo ""
echo "🔗 Contract Integration:"
echo "   • Application ID: 5ac79e62627dd2fb380176f93e701d91fe6fc01e5a25b56801ace1de13399c0d"
echo "   • Fallback: Automatic fallback to mock data if contract unavailable"
echo ""
echo "🚀 To enable real contract data:"
echo "   1. Start GraphQL service: bash start-graphql-service.sh"
echo "   2. Frontend will auto-detect and use real contract"
echo ""
