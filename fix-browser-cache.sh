#!/bin/bash

echo "🔧 Fixing Browser Access Issue"
echo ""
echo "Domain is working! Just need to clear cache..."
echo ""

# Clear DNS cache
echo "1️⃣ Clearing DNS cache..."
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
echo "✅ DNS cache cleared"
echo ""

# Test DNS
echo "2️⃣ Testing DNS..."
DNS_RESULT=$(dig www.aion-x.xyz +short | tail -1)
echo "DNS result: $DNS_RESULT"
if [ "$DNS_RESULT" = "152.42.199.50" ]; then
    echo "✅ DNS is correct!"
else
    echo "⚠️  DNS shows: $DNS_RESULT"
fi
echo ""

# Test HTTP
echo "3️⃣ Testing HTTP access..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://www.aion-x.xyz)
echo "HTTP status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Site is accessible!"
else
    echo "⚠️  HTTP returned: $HTTP_STATUS"
fi
echo ""

echo "📝 Next steps:"
echo ""
echo "1. Open browser in INCOGNITO/PRIVATE mode"
echo "2. Visit: http://www.aion-x.xyz (use HTTP, not HTTPS)"
echo "3. Or do hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)"
echo ""
echo "If it works, run SSL setup:"
echo "   ./check-and-setup-ssl.sh"
echo ""
