#!/bin/bash

echo "🚀 STARTING AI POWER TRADE - FINAL FRONTEND"
echo "=========================================="

# Start HTTP server
echo "🌐 Starting frontend server..."
python3 -m http.server 3000 > frontend.log 2>&1 &

# Wait for server
sleep 2

echo ""
echo "✅ AI POWER TRADE FINAL FRONTEND READY!"
echo ""
echo "🎯 PRODUCTION URL:"
echo "   http://localhost:3000/AI-POWER-TRADE-FINAL.html"
echo ""
echo "📊 FEATURES:"
echo "   ✅ Multi-Platform Trading (13+ platforms)"
echo "   ✅ Real Binance Market Data"
echo "   ✅ AI Signal Generation"
echo "   ✅ Linera Blockchain Integration"
echo "   ✅ Professional UI/UX"
echo ""
echo "🚀 READY FOR PRODUCTION DEPLOYMENT!"

# Open in browser
open http://localhost:3000/AI-POWER-TRADE-FINAL.html