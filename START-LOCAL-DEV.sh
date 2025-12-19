#!/bin/bash
# Start Local Development - AI POWER TRADE LINERA

echo "🚀 Starting AI POWER TRADE - Linera Edition"
echo ""
echo "========================================="
echo "SETUP & RUN LOCAL DEVELOPMENT"
echo "========================================="
echo ""

# Check if in correct directory
if [ ! -d "frontend-linera" ]; then
    echo "❌ Error: frontend-linera directory not found"
    echo "Run this script from the project root"
    exit 1
fi

cd frontend-linera

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    echo ""
    npm install
    echo ""
    echo "✅ Dependencies installed"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

echo "========================================="
echo "🚀 STARTING DEVELOPMENT SERVER"
echo "========================================="
echo ""
echo "Server will start on: http://localhost:3000"
echo ""
echo "📋 Next steps:"
echo "   1. Open http://localhost:3000 in browser"
echo "   2. Open Console (F12) to see logs"
echo "   3. Click 'Create Wallet' button"
echo "   4. Wait 10-30 seconds for faucet"
echo "   5. Generate AI signals!"
echo ""
echo "Press Ctrl+C to stop server"
echo ""
echo "========================================="
echo ""

# Start dev server
npm run dev
