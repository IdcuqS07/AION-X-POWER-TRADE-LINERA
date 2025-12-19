#!/bin/bash

VPS_IP="152.42.199.50"
VPS_USER="root"

echo "🔄 Force Cache Clear on VPS"
echo "============================"
echo ""

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    echo "1️⃣ Adding cache-busting headers to nginx..."
    
    # Update nginx config to disable cache
    cat > /etc/nginx/sites-available/ai-power-trade << 'EOF'
server {
    listen 80;
    server_name 152.42.199.50;
    
    root /var/www/ai-power-trade;
    index index.html;
    
    # Disable cache for HTML
    location ~* \.html$ {
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
        add_header Pragma "no-cache";
        add_header Expires "0";
        try_files $uri $uri/ =404;
    }
    
    # Cache static assets with versioning
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|wasm)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
    
    echo "2️⃣ Testing nginx config..."
    nginx -t
    
    echo "3️⃣ Reloading nginx..."
    systemctl reload nginx
    
    echo "4️⃣ Clearing nginx cache..."
    rm -rf /var/cache/nginx/*
    
    echo "5️⃣ Restarting nginx..."
    systemctl restart nginx
    
    echo ""
    echo "✅ Cache cleared!"
ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Cache Cleared Successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Now open: http://$VPS_IP"
echo ""
echo "💡 If still cached in browser:"
echo "  • Chrome/Edge: Ctrl+Shift+R (Cmd+Shift+R on Mac)"
echo "  • Firefox: Ctrl+F5 (Cmd+Shift+R on Mac)"
echo "  • Safari: Cmd+Option+R"
echo "  • Or open in Incognito/Private mode"
echo ""
