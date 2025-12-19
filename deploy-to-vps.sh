#!/bin/bash

VPS_IP="152.42.199.50"
VPS_USER="root"

echo "🚀 Deploying AI POWER TRADE to VPS: $VPS_IP"
echo "============================================="

# Test connection
echo "🔍 Testing VPS connection..."
if ! ssh -o ConnectTimeout=10 $VPS_USER@$VPS_IP "echo 'Connection OK'"; then
    echo "❌ Cannot connect to VPS. Check:"
    echo "   - SSH key setup: ssh-copy-id $VPS_USER@$VPS_IP"
    echo "   - Or use password: ssh $VPS_USER@$VPS_IP"
    exit 1
fi

# Upload project files
echo "📤 Uploading project files..."
ssh $VPS_USER@$VPS_IP "mkdir -p /opt/ai-power-trade"
scp -r . $VPS_USER@$VPS_IP:/opt/ai-power-trade/

# Deploy on VPS
echo "🔧 Running deployment on VPS..."
ssh $VPS_USER@$VPS_IP << 'EOF'
cd /opt/ai-power-trade

# Make scripts executable
chmod +x *.sh

# Run production deployment
./deploy-production.sh

# Check status
echo ""
echo "✅ Deployment Complete!"
echo "======================"
echo "🌐 Main App: http://152.42.199.50/AI-POWER-TRADE-FINAL.html"
echo "🔍 Judge Verification: http://152.42.199.50/JUDGE-VERIFICATION.html"
echo "📊 GraphQL: http://152.42.199.50/graphql"
echo ""
echo "🔍 Status Check:"
./check-status.sh
EOF

echo ""
echo "🎉 AI POWER TRADE deployed to VPS!"
echo "=================================="
echo "🌐 Live Demo: http://$VPS_IP/AI-POWER-TRADE-FINAL.html"
echo "🏆 Ready for hackathon judges!"