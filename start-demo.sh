#!/bin/bash

echo "🚀 Starting AI POWER TRADE Hackathon Demo..."
echo "=================================="

# Check if Linera is installed
if ! command -v linera &> /dev/null; then
    echo "⚠️  Linera not found. Installing..."
    curl -sSf https://install.linera.io | sh
    source ~/.bashrc
fi

# Start Linera network
echo "🔗 Starting Linera network..."
linera net up --extra-wallets 2 &
LINERA_PID=$!

# Wait for network to start
sleep 5

# Build applications
echo "🔨 Building smart contracts..."
if [ -d "trading" ]; then
    cd trading && cargo build --release && cd ..
fi

if [ -d "wallet" ]; then
    cd wallet && cargo build --release && cd ..
fi

# Deploy applications (if contracts exist)
echo "📦 Deploying applications..."
if [ -f "Cargo.toml" ]; then
    linera project publish-and-create --wait-for-outbox || echo "⚠️  Deploy failed - using simulation mode"
fi

# Start web server
echo "🌐 Starting web server..."
python3 -m http.server 3000 &
WEB_PID=$!

echo ""
echo "✅ AI POWER TRADE Demo Ready!"
echo "=================================="
echo "🌐 Open: http://localhost:3000/AI-POWER-TRADE-FINAL.html"
echo "🔍 Judge Verification: http://localhost:3000/JUDGE-VERIFICATION.html"
echo "📋 Documentation: http://localhost:3000/HACKATHON-DEMO.md"
echo ""
echo "For Judges:"
echo "1. Test real wallet creation (Ed25519)"
echo "2. Check console (F12) for crypto verification"
echo "3. Execute AI trades (real or simulation)"
echo "4. Verify multi-platform support"
echo ""
echo "Press Ctrl+C to stop demo"

# Keep running
trap "kill $LINERA_PID $WEB_PID 2>/dev/null; exit" INT
wait