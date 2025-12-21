#!/bin/bash

echo "🧠 Testing AI Explainer Deployment..."
echo ""

# Test main page
echo "1. Testing main dashboard..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://152.42.199.50/)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Main dashboard: OK"
else
    echo "   ❌ Main dashboard: FAILED (HTTP $STATUS)"
fi

# Test AI Explainer page
echo "2. Testing AI Explainer page..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://152.42.199.50/ai-explainer.html)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ AI Explainer page: OK"
else
    echo "   ❌ AI Explainer page: FAILED (HTTP $STATUS)"
fi

# Test JavaScript modules
echo "3. Testing JavaScript modules..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://152.42.199.50/assets/explainer-Dh9S8-dc.js)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Explainer module: OK"
else
    echo "   ❌ Explainer module: FAILED (HTTP $STATUS)"
fi

STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://152.42.199.50/assets/market-DkFMRwLL.js)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Market module: OK"
else
    echo "   ❌ Market module: FAILED (HTTP $STATUS)"
fi

# Test CSS
echo "4. Testing CSS..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://152.42.199.50/assets/market-CBlfo33G.css)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ CSS file: OK"
else
    echo "   ❌ CSS file: FAILED (HTTP $STATUS)"
fi

echo ""
echo "🎉 AI Explainer Deployment Test Complete!"
echo ""
echo "📍 URLs:"
echo "   Main Dashboard: http://152.42.199.50/"
echo "   AI Explainer:   http://152.42.199.50/ai-explainer.html"
echo ""
echo "💡 Test in browser with hard refresh (Cmd+Shift+R) or incognito mode"
