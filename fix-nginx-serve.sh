#!/bin/bash

VPS_IP="152.42.199.50"
VPS_USER="root"

echo "🔧 Fixing Nginx Serving Issue"
echo "=============================="
echo ""

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    echo "1️⃣ Checking current nginx config..."
    cat /etc/nginx/sites-enabled/ai-power-trade
    
    echo ""
    echo "2️⃣ Stopping nginx..."
    systemctl stop nginx
    
    echo "3️⃣ Clearing all caches..."
    rm -rf /var/cache/nginx/*
    rm -rf /tmp/nginx/*
    
    echo "4️⃣ Verifying file content..."
    if grep -q "trade-amount-section" /var/www/ai-power-trade/index.html; then
        echo "✅ HTML file has slider"
    else
        echo "❌ HTML file missing slider!"
    fi
    
    echo ""
    echo "5️⃣ Setting correct permissions..."
    chown -R www-data:www-data /var/www/ai-power-trade
    chmod -R 755 /var/www/ai-power-trade
    
    echo "6️⃣ Starting nginx..."
    systemctl start nginx
    
    echo ""
    echo "7️⃣ Testing nginx serve..."
    sleep 2
    if curl -s http://localhost/ | grep -q "trade-amount-section"; then
        echo "✅ Nginx now serving correct file!"
    else
        echo "❌ Still serving old file"
        echo ""
        echo "Checking what nginx is actually serving..."
        curl -s http://localhost/ | grep -A 5 "AI Trading Signal" | head -20
    fi
ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔄 Nginx Fixed - Try Again!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 URL: http://$VPS_IP"
echo ""
echo "⚠️  Use Incognito mode or clear browser cache!"
echo ""
