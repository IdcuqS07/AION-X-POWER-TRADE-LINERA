#!/bin/bash

echo "🧪 Starting Local Test Server"
echo "============================="
echo ""

cd frontend-linera

echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "🌐 Starting local server on http://localhost:3000"
echo ""
echo "📋 Test Checklist:"
echo "   1. Open http://localhost:3000 in browser"
echo "   2. Connect wallet (or create new)"
echo "   3. Check 'Blockchain Trade History' section appears"
echo "   4. Generate AI signal"
echo "   5. Execute trade"
echo "   6. Verify trade appears in blockchain history"
echo "   7. Check total trades counter increases"
echo "   8. Click 'Refresh from Blockchain' button"
echo ""
echo "Press Ctrl+C to stop server"
echo ""

# Start simple HTTP server
npx serve dist -p 3000
