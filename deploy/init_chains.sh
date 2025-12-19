#!/bin/bash

set -e

TRADING_APP_ID=$1
WALLET_APP_ID=$2

if [ -z "$TRADING_APP_ID" ] || [ -z "$WALLET_APP_ID" ]; then
    echo "Usage: $0 <TRADING_APP_ID> <WALLET_APP_ID>"
    exit 1
fi

echo "🔗 Initializing AI POWER TRADE Chains"

# Create user chain
echo "👤 Creating User Chain..."
USER_CHAIN=$(linera open-chain --to-public-key ed25519:260d73d58a6a426f0c1b0d7c7d8e8f9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d)
echo "User Chain: $USER_CHAIN"

# Create AI chain
echo "🤖 Creating AI Chain..."
AI_CHAIN=$(linera open-chain --to-public-key ed25519:370e84e69b7b537f1d2c1e8d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e)
echo "AI Chain: $AI_CHAIN"

# Create market chain
echo "📊 Creating Market Chain..."
MARKET_CHAIN=$(linera open-chain --to-public-key ed25519:481f95f7ac8c648f2e3d2f9e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f)
echo "Market Chain: $MARKET_CHAIN"

# Register chains with master
echo "📝 Registering chains with master..."
linera request-application $TRADING_APP_ID \
    --json-argument "{\"AddTradingChain\": {\"chain_id\": \"$USER_CHAIN\"}}"

linera request-application $TRADING_APP_ID \
    --json-argument "{\"AddTradingChain\": {\"chain_id\": \"$AI_CHAIN\"}}"

linera request-application $TRADING_APP_ID \
    --json-argument "{\"AddTradingChain\": {\"chain_id\": \"$MARKET_CHAIN\"}}"

# Initialize market data
echo "💹 Initializing market data..."
linera request-application $TRADING_APP_ID \
    --json-argument "{\"UpdateMarketData\": {\"symbol\": \"BTC/USD\", \"price\": 50000}}"

linera request-application $TRADING_APP_ID \
    --json-argument "{\"UpdateMarketData\": {\"symbol\": \"ETH/USD\", \"price\": 3000}}"

echo "✅ Chain initialization completed!"
echo "User Chain: $USER_CHAIN"
echo "AI Chain: $AI_CHAIN"
echo "Market Chain: $MARKET_CHAIN"