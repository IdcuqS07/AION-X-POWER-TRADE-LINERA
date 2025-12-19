#!/bin/bash

echo "🌐 Opening AI Power Trade..."
echo ""

# Check which port is being used
if lsof -i :5173 | grep -q LISTEN; then
    PORT=5173
elif lsof -i :3001 | grep -q LISTEN; then
    PORT=3001
elif lsof -i :3000 | grep -q LISTEN; then
    PORT=3000
else
    echo "❌ Dev server not running!"
    echo ""
    echo "Start it with:"
    echo "  cd frontend-linera && npm run dev"
    echo ""
    exit 1
fi

URL="http://localhost:$PORT"

echo "✅ Found server at: $URL"
echo ""
echo "Opening in browser..."

# Open in default browser
open "$URL"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🎯 URL: $URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ New Features to Test:"
echo "  1. Connect Wallet"
echo "  2. Update Market Data"
echo "  3. Adjust Trade Percentage Slider (10%-100%)"
echo "  4. Generate AI Signal"
echo "  5. Execute Trade"
echo "  6. Check Trade History"
echo ""
