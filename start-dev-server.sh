#!/bin/bash

echo "🚀 Starting AI Power Trade Development Server"
echo "=============================================="
echo ""

cd frontend-linera

# Kill any existing process on port 5173
echo "🔍 Checking for existing processes..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building once to verify..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Starting development server..."
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  🎯 Local:   http://localhost:5173"
    echo "  🎯 Network: http://$(ipconfig getifaddr en0 2>/dev/null || echo "N/A"):5173"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "✨ New Features:"
    echo "  • Trade Percentage Slider (10%-100%)"
    echo "  • Real-time Amount Calculation"
    echo "  • Enhanced Trade History"
    echo ""
    echo "Press Ctrl+C to stop"
    echo ""
    
    npm run dev
else
    echo ""
    echo "❌ Build failed. Please check errors above."
    exit 1
fi
