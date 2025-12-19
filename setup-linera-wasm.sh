#!/bin/bash
# Setup Linera WASM files on VPS

echo "🔧 Setting up Linera WASM on VPS..."
echo ""

ssh root@152.42.199.50 << 'EOF'
cd /opt/ai-power-trade

# Create directory for Linera files
mkdir -p linera-lib

# Install npm packages locally to get WASM files
if ! command -v npm &> /dev/null; then
    echo "📦 Installing Node.js & npm..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

echo "📦 Installing @linera/client..."
npm install @linera/client@0.15.6 @linera/signer@0.15.6

# Check what files we got
echo ""
echo "📂 Files in node_modules/@linera/client:"
ls -lh node_modules/@linera/client/

echo ""
echo "📂 Checking for WASM files:"
find node_modules/@linera -name "*.wasm" -o -name "*.js" | head -20

echo ""
echo "📂 Package structure:"
ls -lR node_modules/@linera/client/ | head -50

EOF

echo ""
echo "✅ Check complete!"
echo ""
echo "Next: Analyze output to find correct WASM path"
echo ""
