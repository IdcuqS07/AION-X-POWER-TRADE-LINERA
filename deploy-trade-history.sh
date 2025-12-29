#!/bin/bash

echo "🚀 Deploying Trade History Smart Contract to Linera Testnet Conway"
echo "=================================================================="

cd trade-history

# Build the contract
echo ""
echo "📦 Building contract..."
cargo build --target wasm32-unknown-unknown --release

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📊 Contract sizes:"
ls -lh target/wasm32-unknown-unknown/release/trade_history_*.wasm

# Deploy to testnet
echo ""
echo "🌐 Deploying to Linera Testnet Conway..."
echo ""

linera project publish-and-create \
    --name trade-history \
    trade_history_contract.wasm \
    trade_history_service.wasm

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📝 Save the Application ID from above output"
    echo "   You'll need it for frontend integration"
else
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi
