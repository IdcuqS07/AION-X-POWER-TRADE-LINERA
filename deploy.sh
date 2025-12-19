#!/bin/bash

echo "🚀 Deploying AI POWER TRADE to Linera Network..."

# Set Linera configuration
export LINERA_WALLET="$HOME/.config/linera/wallet.json"
export LINERA_STORAGE="rocksdb:$HOME/.config/linera/client.db"

# Initialize Linera client if needed
if [ ! -f "$LINERA_WALLET" ]; then
    echo "📝 Initializing Linera wallet..."
    linera wallet init --with-new-chain
fi

# Deploy trading application
echo "📦 Deploying trading application..."
TRADING_APP=$(linera project publish-and-create \
    --path ./trading \
    --name ai-power-trading \
    --json | jq -r '.application_id')

echo "Trading App ID: $TRADING_APP"

# Deploy wallet application  
echo "📦 Deploying wallet application..."
WALLET_APP=$(linera project publish-and-create \
    --path ./wallet \
    --name ai-power-wallet \
    --json | jq -r '.application_id')

echo "Wallet App ID: $WALLET_APP"

# Start GraphQL service
echo "🌐 Starting GraphQL service..."
linera service --port 8080 &

echo "✅ Deployment complete!"
echo "🔗 GraphQL endpoint: http://localhost:8080/graphql"
echo "📱 Trading App: $TRADING_APP"
echo "💰 Wallet App: $WALLET_APP"