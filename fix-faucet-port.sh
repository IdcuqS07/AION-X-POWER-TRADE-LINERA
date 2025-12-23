#!/bin/bash

echo "🔧 Fixing faucet backend port conflict..."
echo ""

ssh root@152.42.199.50 << 'ENDSSH'
# Stop faucet-api
pm2 stop faucet-api

# Update faucet backend to use port 8081
cd /opt/faucet-backend
sed -i 's/PORT=8080/PORT=8081/g' .env || echo "PORT=8081" >> .env

# Restart faucet-api
pm2 restart faucet-api

# Wait for it to start
sleep 3

# Test faucet on new port
echo "Testing faucet on port 8081..."
curl -s http://localhost:8081/api/faucet/status | head -5

# Update Nginx to proxy to port 8081
cat > /etc/nginx/sites-available/aion-x.xyz << 'EOF'
server {
    server_name aion-x.xyz www.aion-x.xyz;
    
    root /var/www/ai-power-trade;
    index index.html;
    
    # API proxy to faucet backend (port 8081)
    location /api/ {
        proxy_pass http://localhost:8081/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # CORS headers for WASM (IMPORTANT!)
    add_header Cross-Origin-Opener-Policy "same-origin" always;
    add_header Cross-Origin-Embedder-Policy "require-corp" always;
    
    # Cache control
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|wasm)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Cross-Origin-Opener-Policy "same-origin" always;
        add_header Cross-Origin-Embedder-Policy "require-corp" always;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/aion-x.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aion-x.xyz/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = www.aion-x.xyz) {
        return 301 https://$host$request_uri;
    }

    if ($host = aion-x.xyz) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name aion-x.xyz www.aion-x.xyz;
    return 404;
}
EOF

# Test and reload nginx
nginx -t && systemctl reload nginx

echo "✅ Faucet backend moved to port 8081"
echo "✅ Nginx updated and reloaded"
ENDSSH

echo ""
echo "Testing faucet API through domain..."
sleep 2
curl -s https://www.aion-x.xyz/api/faucet/status
echo ""
echo ""
echo "✅ Faucet should now work!"
