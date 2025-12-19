#!/bin/bash

echo "🚀 Building AI POWER TRADE on Linera..."

# Build all applications
cargo build --release

# Create application bytecode
echo "📦 Creating application bytecode..."
linera project publish-and-create \
    --path ./trading \
    --name ai-power-trading

linera project publish-and-create \
    --path ./wallet \
    --name ai-power-wallet

echo "✅ Build complete!"
echo "🔗 Applications ready for deployment to Linera network"