#!/bin/bash

VPS_IP="152.42.199.50"
VPS_USER="root"
TIMESTAMP=$(date +%s)

echo "🔄 Force Reload with Cache Busting"
echo "===================================="
echo "Timestamp: $TIMESTAMP"
echo ""

ssh $VPS_USER@$VPS_IP << ENDSSH
    # Add timestamp to index.html to force reload
    cd /var/www/ai-power-trade
    
    # Add cache-busting meta tag
    sed -i '/<head>/a\    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\n    <meta http-equiv="Pragma" content="no-cache">\n    <meta http-equiv="Expires" content="0">\n    <meta name="version" content="$TIMESTAMP">' index.html
    
    echo "✅ Added cache-busting headers"
    
    # Restart nginx
    systemctl restart nginx
    
    echo "✅ Nginx restarted"
ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Cache Busting Applied!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Now try these URLs (in order):"
echo ""
echo "1. http://$VPS_IP/?v=$TIMESTAMP"
echo "2. http://$VPS_IP/#reload"
echo "3. http://$VPS_IP/index.html?t=$TIMESTAMP"
echo ""
echo "💡 Or use Incognito mode:"
echo "   Chrome: Cmd+Shift+N"
echo "   Safari: Cmd+Shift+N"
echo ""
