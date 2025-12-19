#!/bin/bash

VPS_IP="152.42.199.50"
VPS_USER="root"

echo "🔧 Adding Port 8080 (Fresh Port)"
echo "================================="
echo ""

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    echo "1️⃣ Adding port 8080 to nginx..."
    cat > /etc/nginx/sites-available/ai-power-trade-8080 << 'EOF'
server {
    listen 8080;
    
    root /var/www/ai-power-trade;
    index index.html;
    
    server_name 152.42.199.50;
    
    add_header Cache-Control "no-store, no-cache, must-revalidate";
    add_header Pragma "no-cache";
    add_header X-Fresh-Deploy "percentage-slider-v2";
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
    
    echo "2️⃣ Enabling config..."
    ln -sf /etc/nginx/sites-available/ai-power-trade-8080 /etc/nginx/sites-enabled/
    
    echo "3️⃣ Opening firewall port 8080..."
    ufw allow 8080/tcp 2>/dev/null || echo "UFW not active"
    
    echo "4️⃣ Testing config..."
    nginx -t
    
    echo "5️⃣ Reloading nginx..."
    systemctl reload nginx
    
    echo ""
    echo "6️⃣ Testing port 8080..."
    sleep 1
    if curl -s http://localhost:8080/ | grep -q "trade-amount-section"; then
        echo "✅ Port 8080 serving correct file!"
    else
        echo "❌ Port 8080 not working"
    fi
ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Port 8080 Added!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Try this FRESH URL (no cache):"
echo ""
echo "   http://$VPS_IP:8080"
echo ""
echo "This is a completely new port that has NEVER been cached!"
echo ""
