#!/bin/bash

set -e

echo "🚀 Deploying AI POWER TRADE to Linera Network"

# Build applications
echo "📦 Building applications..."
cargo build --release

# Deploy wallet application first
echo "💰 Deploying Wallet Application..."
WALLET_APP_ID=$(linera publish-and-create \
    target/wasm32-unknown-unknown/release/wallet.wasm \
    target/wasm32-unknown-unknown/release/wallet_service.wasm \
    --json-argument '{"master_chain": "e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65", "initial_supply": 1000000}')

echo "Wallet deployed with ID: $WALLET_APP_ID"

# Deploy trading application
echo "📈 Deploying Trading Application..."
TRADING_APP_ID=$(linera publish-and-create \
    target/wasm32-unknown-unknown/release/trading.wasm \
    target/wasm32-unknown-unknown/release/trading_service.wasm \
    --json-argument "{\"master_chain\": \"e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65\", \"wallet\": \"$WALLET_APP_ID\"}")

echo "Trading deployed with ID: $TRADING_APP_ID"

# Initialize master chain
echo "⚙️ Initializing Master Chain..."
linera request-application $TRADING_APP_ID \
    --json-argument '{"AddTradingChain": {"chain_id": "e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65"}}'

echo "✅ Deployment completed successfully!"
echo "Wallet App ID: $WALLET_APP_ID"
echo "Trading App ID: $TRADING_APP_ID"