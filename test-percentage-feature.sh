#!/bin/bash

echo "🧪 Testing Trade Percentage Feature"
echo "===================================="
echo ""

cd frontend-linera

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📊 Feature Added:"
    echo "  • Trade percentage slider (10%-100%)"
    echo "  • Real-time amount calculation"
    echo "  • Display in execute button"
    echo "  • Show in trade history"
    echo ""
    echo "🌐 Test the feature:"
    echo "  1. Open: frontend-linera/test-percentage.html"
    echo "  2. Or run: npm run dev"
    echo "  3. Then open: http://localhost:5173"
    echo ""
    echo "📝 Changes made:"
    echo "  ✓ Added percentage slider in index.html"
    echo "  ✓ Added CSS styling in style.css"
    echo "  ✓ Updated main.js with percentage logic"
    echo "  ✓ Updated executeAITrade() function"
    echo "  ✓ Updated generateSignalEnhanced() function"
    echo ""
else
    echo ""
    echo "❌ Build failed. Check errors above."
    exit 1
fi
