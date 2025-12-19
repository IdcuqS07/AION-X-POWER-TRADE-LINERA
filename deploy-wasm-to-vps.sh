#!/bin/bash
# Deploy WASM files to VPS

VPS_IP="152.42.199.50"
VPS_DIR="/opt/ai-power-trade"

echo "🚀 Deploying WASM Integration to VPS..."
echo ""

# Upload WASM files
echo "📤 Uploading files..."
scp linera-wasm-client.js root@${VPS_IP}:${VPS_DIR}/
scp AI-POWER-TRADE-WASM.html root@${VPS_IP}:${VPS_DIR}/
scp LINERA-WASM-INTEG