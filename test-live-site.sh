#!/bin/bash

echo "🧪 Testing Live Site: http://152.42.199.50"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: Check if site is accessible
echo ""
echo "Test 1: Site Accessibility"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://152.42.199.50)
if [ "$STATUS" = "200" ]; then
    echo "✅ Site is accessible (HTTP $STATUS)"
else
    echo "❌ Site returned HTTP $STATUS"
fi

# Test 2: Check for 7 cards
echo ""
echo "Test 2: Card Count"
CARD_COUNT=$(curl -s http://152.42.199.50 | grep -o '<div class="card">' | wc -l)
echo "Found $CARD_COUNT cards"
if [ "$CARD_COUNT" = "7" ]; then
    echo "✅ All 7 cards present"
else
    echo "❌ Expected 7 cards, found $CARD_COUNT"
fi

# Test 3: Check card titles
echo ""
echo "Test 3: Card Titles"
curl -s http://152.42.199.50 | grep -o '<h3>[^<]*</h3>' | grep -E '(User Wallet|Portfolio|Market Data|Platform|Signal|Network|Trades)' | while read line; do
    echo "  ✓ $line"
done

# Test 4: Check for JavaScript files
echo ""
echo "Test 4: JavaScript Files"
JS_FILE=$(curl -s http://152.42.199.50 | grep -o 'src="[^"]*\.js"' | head -1 | sed 's/src="//;s/"//')
if [ ! -z "$JS_FILE" ]; then
    echo "✅ JavaScript file found: $JS_FILE"
    JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://152.42.199.50/$JS_FILE")
    echo "   HTTP Status: $JS_STATUS"
else
    echo "❌ No JavaScript file found"
fi

# Test 5: Check for CSS files
echo ""
echo "Test 5: CSS Files"
CSS_FILE=$(curl -s http://152.42.199.50 | grep -o 'href="[^"]*\.css"' | head -1 | sed 's/href="//;s/"//')
if [ ! -z "$CSS_FILE" ]; then
    echo "✅ CSS file found: $CSS_FILE"
    CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://152.42.199.50/$CSS_FILE")
    echo "   HTTP Status: $CSS_STATUS"
else
    echo "❌ No CSS file found"
fi

# Test 6: Check for WASM file
echo ""
echo "Test 6: WASM Files"
WASM_COUNT=$(curl -s http://152.42.199.50/assets/ 2>/dev/null | grep -o '\.wasm' | wc -l)
if [ "$WASM_COUNT" -gt "0" ]; then
    echo "✅ WASM files present"
else
    echo "⚠️  Cannot verify WASM files (directory listing disabled)"
fi

# Test 7: Check for specific elements
echo ""
echo "Test 7: Key Elements"
HTML=$(curl -s http://152.42.199.50)

if echo "$HTML" | grep -q 'id="btc-price"'; then
    echo "✅ BTC price element found"
else
    echo "❌ BTC price element missing"
fi

if echo "$HTML" | grep -q 'id="btn-update-market"'; then
    echo "✅ Update market button found"
else
    echo "❌ Update market button missing"
fi

if echo "$HTML" | grep -q 'id="defi-platform"'; then
    echo "✅ Platform selector found"
else
    echo "❌ Platform selector missing"
fi

if echo "$HTML" | grep -q 'class="coin-btn"'; then
    echo "✅ Coin selector buttons found"
else
    echo "❌ Coin selector buttons missing"
fi

if echo "$HTML" | grep -q 'id="confidence-bar"'; then
    echo "✅ Confidence bar found"
else
    echo "❌ Confidence bar missing"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Testing Complete"
echo ""
echo "🌐 Visit: http://152.42.199.50"
echo "📱 Test in browser for full functionality"
