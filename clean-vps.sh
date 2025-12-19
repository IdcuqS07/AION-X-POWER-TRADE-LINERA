#!/bin/bash

echo "🧹 Cleaning VPS for AI POWER TRADE deployment..."
echo "==============================================="

# Stop existing services that might conflict
echo "🛑 Stopping conflicting services..."
systemctl stop apache2 2>/dev/null || true
systemctl stop nginx 2>/dev/null || true
systemctl stop linera 2>/dev/null || true

# Remove old web files
echo "🗑️ Cleaning web directories..."
rm -rf /var/www/html/*
rm -rf /opt/ai-power-trade 2>/dev/null || true

# Clean nginx config
echo "⚙️ Resetting nginx config..."
rm -f /etc/nginx/sites-available/default
rm -f /etc/nginx/sites-enabled/default

# Remove old services
echo "🔧 Removing old services..."
systemctl disable linera 2>/dev/null || true
rm -f /etc/systemd/system/linera.service
systemctl daemon-reload

# Clean processes
echo "💀 Killing old processes..."
pkill -f "linera" 2>/dev/null || true
pkill -f "python3 -m http.server" 2>/dev/null || true

# Clean ports
echo "🔌 Checking port usage..."
netstat -tulpn | grep -E ":(80|8082|3000)" || echo "Ports are free"

# Update system
echo "📦 Updating system..."
apt update && apt upgrade -y

# Install required packages
echo "🔧 Installing dependencies..."
apt install -y curl build-essential nginx python3 git

echo ""
echo "✅ VPS Cleaned and Ready!"
echo "========================"
echo "🚀 Now run: ./deploy-production.sh"
echo "📁 Project directory: /opt/ai-power-trade"