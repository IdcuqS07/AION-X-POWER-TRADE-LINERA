#!/bin/bash

set -e

TRADING_APP_ID=$1
WALLET_APP_ID=$2

if [ -z "$TRADING_APP_ID" ] || [ -z "$WALLET_APP_ID" ]; then
    echo "Usage: $0 <TRADING_APP_ID> <WALLET_APP_ID>"
    exit 1
fi

echo "🧪 Testing AI POWER TRADE Deployment"

# Test wallet balance
echo "💰 Testing wallet balance..."
BALANCE=$(linera query-application $WALLET_APP_ID \
    --json-argument '{"Balance": {"owner": "User:7136460f0c87ae46f966f898d494c4b40c4ae8c527f4d1c0b1fa0f7cff91d20f"}}')
echo "Wallet balance: $BALANCE"

# Generate AI signal
echo "🤖 Generating AI signal..."
linera request-application $TRADING_APP_ID \
    --json-argument '{"GenerateSignal": {"symbol": "BTC/USD", "model_version": "v1.0"}}'

# Create test trade
echo "📈 Creating test trade..."
linera request-application $TRADING_APP_ID \
    --json-argument '{"CreateTrade": {"symbol": "BTC/USD", "amount": 100, "price": 50000, "trade_type": "buy"}}'

# Check portfolio
echo "📊 Checking portfolio..."
PORTFOLIO=$(linera query-application $TRADING_APP_ID \
    --json-argument '{"GetPortfolio": {}}')
echo "Portfolio: $PORTFOLIO"

echo "✅ Deployment test completed successfully!"