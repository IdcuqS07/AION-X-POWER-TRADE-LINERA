#!/bin/bash

VPS_IP="152.42.199.50"
VPS_USER="root"

echo "🔧 Setting Up Nginx Correctly"
echo "=============================="
echo ""

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    echo "1️⃣ Creating nginx config..."
    cat > /etc/nginx/sites-available/ai-power-trade << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/ai-power-trade;
    index index.html;
    
    server_name 152.42.199.50 _;
    
    # Disable cache for HTML
    location ~* \.html$ {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
        try_files $uri =404;
    }
    
    # Cache static assets
    location ~* \.(js|css|wasm|png|jpg|jpeg|gif|ico|svg)$ {
        add_header Cache-Control "public, max-age=31536000";
        try_files $uri =404;
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
    
    echo "2️⃣ Removing old default config..."
    rm -f /etc/nginx/sites-enabled/default
    
    echo "3️⃣ Enabling ai-power-trade config..."
    ln -sf /etc/nginx/sites-available/ai-power-trade /etc/nginx/sites-enabled/
    
    echo "4️⃣ Testing nginx config..."
    nginx -t
    
    echo "5️⃣ Restarting nginx..."
    systemctl restart nginx
    
    echo ""
    echo "6️⃣ Verifying serve..."
    sleep 2
    if curl -s http://localhost/ | grep -q "trade-amount-section"; then
        echo "✅ SUCCESS! Nginx serving correct file with slider!"
    else
        echo "❌ Still not working"
    fi
    
    echo ""
    echo "7️⃣ Nginx status..."
    systemctl status nginx --no-pager | head -10
ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Nginx Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 URL: http://$VPS_IP"
echo ""
echo "🔄 Open in NEW Incognito window!"
echo ""
