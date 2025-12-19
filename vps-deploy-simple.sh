#!/bin/bash

echo "🚀 AI POWER TRADE - Simple VPS Deployment"
echo "=========================================="
echo ""
echo "VPS IP: 152.42.199.50"
echo "User: root"
echo ""

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf ai-power-trade-deploy.tar.gz \
    --exclude='target' \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='venv' \
    --exclude='*.log' \
    .

echo "✅ Package created: ai-power-trade-deploy.tar.gz"
echo ""
echo "📤 Now upload to VPS with:"
echo "   scp ai-power-trade-deploy.tar.gz root@152.42.199.50:/root/"
echo ""
echo "🔧 Then SSH to VPS and run:"
echo "   ssh root@152.42.199.50"
echo "   cd /root"
echo "   tar -xzf ai-power-trade-deploy.tar.gz -C /opt/ai-power-trade"
echo "   cd /opt/ai-power-trade"
echo "   chmod +x deploy-production.sh"
echo "   ./deploy-production.sh"
echo ""
echo "⏱️  Total time: ~20 minutes"
