#!/bin/bash

# Deploy AI Power Trade to aion-x.xyz
# Usage: ./deploy-to-domain.sh

DOMAIN="aion-x.xyz"
VPS_IP="152.42.199.50"
VPS_USER="root"

echo "🚀 Deploying AI Power Trade to https://www.$DOMAIN"
echo ""

# Step 1: Build frontend
echo "📦 Step 1/4: Building frontend..."
cd frontend-linera
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Check VPS setup
echo "🔍 Step 2/4: Checking VPS configuration..."
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
# Check if domain config exists
if [ -f /etc/nginx/sites-available/aion-x.xyz ]; then
    echo "✅ Domain config found"
    
    # Check for CORS headers
    if grep -q "Cross-Origin-Opener-Policy" /etc/nginx/sites-available/aion-x.xyz; then
        echo "✅ CORS headers already configured"
    else
        echo "⚠️  CORS headers missing - will add them"
        
        # Backup original config
        cp /etc/nginx/sites-available/aion-x.xyz /etc/nginx/sites-available/aion-x.xyz.backup
        
        # Add CORS headers before the closing brace of server block
        sed -i '/listen 443 ssl;/a \    add_header Cross-Origin-Opener-Policy "same-origin" always;\n    add_header Cross-Origin-Embedder-Policy "require-corp" always;' /etc/nginx/sites-available/aion-x.xyz
        
        # Test nginx config
        nginx -t && systemctl reload nginx
        echo "✅ CORS headers added and Nginx reloaded"
    fi
else
    echo "❌ Domain config not found at /etc/nginx/sites-available/aion-x.xyz"
    echo "Please check your Nginx configuration"
    exit 1
fi

# Check document root
DOC_ROOT=$(grep -oP 'root \K[^;]+' /etc/nginx/sites-available/aion-x.xyz | head -1)
echo "📁 Document root: $DOC_ROOT"

# Create directory if not exists
mkdir -p $DOC_ROOT
ENDSSH

if [ $? -ne 0 ]; then
    echo "❌ VPS check failed!"
    exit 1
fi

echo ""

# Step 3: Get document root from VPS
echo "📂 Step 3/4: Getting deployment path..."
DOC_ROOT=$(ssh $VPS_USER@$VPS_IP "grep -oP 'root \K[^;]+' /etc/nginx/sites-available/aion-x.xyz | head -1")

if [ -z "$DOC_ROOT" ]; then
    echo "⚠️  Could not detect document root, using default: /var/www/aion-x"
    DOC_ROOT="/var/www/aion-x"
fi

echo "📁 Deploying to: $DOC_ROOT"
echo ""

# Step 4: Upload files
echo "⬆️  Step 4/4: Uploading files to VPS..."
scp -r dist/* $VPS_USER@$VPS_IP:$DOC_ROOT/

if [ $? -ne 0 ]; then
    echo "❌ Upload failed!"
    exit 1
fi

echo "✅ Files uploaded successfully!"
echo ""

# Final check
echo "🔍 Verifying deployment..."
ssh $VPS_USER@$VPS_IP "ls -lh $DOC_ROOT/index.html"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app is now live at:"
echo "   https://www.$DOMAIN"
echo "   https://$DOMAIN"
echo ""
echo "📝 Next steps:"
echo "   1. Visit https://www.$DOMAIN to test"
echo "   2. Clear browser cache (Ctrl+Shift+R)"
echo "   3. Update hackathon submission with new URL"
echo ""
