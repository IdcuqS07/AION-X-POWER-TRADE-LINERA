#!/bin/bash

# Auto-check DNS and setup SSL for aion-x.xyz
# Run this after you've updated DNS records

DOMAIN="aion-x.xyz"
WWW_DOMAIN="www.aion-x.xyz"
VPS_IP="152.42.199.50"
VPS_USER="root"

echo "🔍 Checking DNS for $DOMAIN..."
echo ""

# Check main domain
CURRENT_IP=$(dig +short $DOMAIN | tail -1)
echo "Current IP for $DOMAIN: $CURRENT_IP"

# Check www subdomain
WWW_IP=$(dig +short $WWW_DOMAIN | tail -1)
echo "Current IP for $WWW_DOMAIN: $WWW_IP"

echo ""

# Check if DNS is correct
if [ "$CURRENT_IP" = "$VPS_IP" ] && [ "$WWW_IP" = "$VPS_IP" ]; then
    echo "✅ DNS is correctly pointing to VPS!"
    echo ""
    echo "🔐 Installing SSL certificate..."
    echo ""
    
    ssh $VPS_USER@$VPS_IP << 'ENDSSH'
certbot --nginx -d aion-x.xyz -d www.aion-x.xyz --non-interactive --agree-tos --email idchuq@gmail.com --redirect
ENDSSH
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SSL certificate installed successfully!"
        echo ""
        echo "🎉 Your site is now live at:"
        echo "   https://aion-x.xyz"
        echo "   https://www.aion-x.xyz"
        echo ""
    else
        echo ""
        echo "❌ SSL installation failed. Check the error above."
        echo ""
    fi
else
    echo "⚠️  DNS not updated yet!"
    echo ""
    echo "Expected IP: $VPS_IP"
    echo "Current $DOMAIN: $CURRENT_IP"
    echo "Current $WWW_DOMAIN: $WWW_IP"
    echo ""
    echo "📝 To fix this:"
    echo "1. Login to Cloudflare dashboard"
    echo "2. Update DNS records:"
    echo "   - A Record: aion-x.xyz → $VPS_IP (change from 216.198.79.1)"
    echo "   - CNAME: www → aion-x.xyz (change from Vercel)"
    echo "   - Make sure Proxy is OFF (gray cloud, not orange)"
    echo ""
    echo "3. Wait 1-5 minutes for DNS propagation"
    echo "4. Run this script again: ./check-and-setup-ssl.sh"
    echo ""
    echo "📖 See detailed guide: CLOUDFLARE-DNS-UPDATE.md"
    echo ""
fi
