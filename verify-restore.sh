#!/bin/bash

echo "🔍 Verifying Deployment Restore..."
echo ""

echo "1️⃣ Checking if site is accessible..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://152.42.199.50/)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Site is accessible (HTTP $HTTP_CODE)"
else
    echo "❌ Site returned HTTP $HTTP_CODE"
fi
echo ""

echo "2️⃣ Checking CSS file..."
CSS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://152.42.199.50/assets/index-CF4Hzrl8.css)
if [ "$CSS_CODE" = "200" ]; then
    echo "✅ CSS file is accessible (HTTP $CSS_CODE)"
else
    echo "❌ CSS file returned HTTP $CSS_CODE"
fi
echo ""

echo "3️⃣ Checking HTML structure..."
if curl -s http://152.42.199.50/ | grep -q "Portfolio Overview"; then
    echo "✅ Portfolio Overview section found"
else
    echo "❌ Portfolio Overview section missing"
fi

if curl -s http://152.42.199.50/ | grep -q "User Wallet"; then
    echo "✅ User Wallet section found"
else
    echo "❌ User Wallet section missing"
fi

if curl -s http://152.42.199.50/ | grep -q "portfolio-grid"; then
    echo "✅ Portfolio grid structure found"
else
    echo "❌ Portfolio grid structure missing"
fi
echo ""

echo "4️⃣ Checking JavaScript..."
JS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://152.42.199.50/assets/index-CxiYPTcK.js)
if [ "$JS_CODE" = "200" ]; then
    echo "✅ JavaScript file is accessible (HTTP $JS_CODE)"
else
    echo "❌ JavaScript file returned HTTP $JS_CODE"
fi
echo ""

echo "5️⃣ Checking WASM file..."
WASM_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://152.42.199.50/assets/index_bg-DRCV9dQt.wasm)
if [ "$WASM_CODE" = "200" ]; then
    echo "✅ WASM file is accessible (HTTP $WASM_CODE)"
else
    echo "❌ WASM file returned HTTP $WASM_CODE"
fi
echo ""

echo "✨ Verification Complete!"
echo ""
echo "🌐 Site URL: http://152.42.199.50"
echo "📝 Please test in browser with hard refresh (Cmd+Shift+R)"
