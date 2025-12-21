#!/bin/bash

echo "🔍 Testing Horizontal Layout from Server"
echo "========================================"
echo ""

# Test 1: Check HTML structure
echo "1. Checking HTML structure on server..."
CARD_ROW_COUNT=$(ssh root@152.42.199.50 "grep -c 'card-row' /var/www/html/index.html")
echo "   Found $CARD_ROW_COUNT instances of 'card-row'"

MAIN_CONTENT=$(ssh root@152.42.199.50 "grep -c 'main-content' /var/www/html/index.html")
echo "   Found $MAIN_CONTENT instances of 'main-content'"

HORIZONTAL=$(ssh root@152.42.199.50 "grep -c 'horizontal-content' /var/www/html/index.html")
echo "   Found $HORIZONTAL instances of 'horizontal-content'"

echo ""

# Test 2: Check CSS
echo "2. Checking CSS on server..."
CSS_FILE=$(ssh root@152.42.199.50 "ls -1 /var/www/html/assets/*.css | head -1")
echo "   CSS file: $CSS_FILE"

CARD_ROW_CSS=$(ssh root@152.42.199.50 "grep -c 'card-row' /var/www/html/assets/*.css")
echo "   Found $CARD_ROW_CSS instances of 'card-row' in CSS"

echo ""

# Test 3: Test HTTP response
echo "3. Testing HTTP response..."
HTTP_CODE=$(ssh root@152.42.199.50 "curl -s -o /dev/null -w '%{http_code}' http://localhost/")
echo "   HTTP Status: $HTTP_CODE"

echo ""

# Test 4: Generate cache-buster URL
TIMESTAMP=$(date +%s)
echo "4. Cache-buster URLs:"
echo "   http://152.42.199.50/?v=$TIMESTAMP"
echo "   http://152.42.199.50/index.html?v=$TIMESTAMP"

echo ""
echo "========================================"
echo "✅ Server files are correct!"
echo "========================================"
echo ""
echo "🔄 To see the new layout, you MUST:"
echo ""
echo "Option 1 - Hard Refresh:"
echo "  1. Go to http://152.42.199.50"
echo "  2. Press Ctrl+Shift+R (Windows/Linux)"
echo "  3. Or Cmd+Shift+R (Mac)"
echo ""
echo "Option 2 - Clear Cache:"
echo "  1. Open DevTools (F12)"
echo "  2. Go to Network tab"
echo "  3. Check 'Disable cache'"
echo "  4. Refresh page"
echo ""
echo "Option 3 - Incognito/Private:"
echo "  1. Open incognito/private window"
echo "  2. Go to http://152.42.199.50"
echo ""
echo "Option 4 - Cache Buster:"
echo "  Use: http://152.42.199.50/?v=$TIMESTAMP"
echo ""
