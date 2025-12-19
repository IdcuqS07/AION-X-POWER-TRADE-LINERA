#!/bin/bash

echo "🚀 Deploying AI POWER TRADE with Real Data"

# Start Linera network
echo "🔗 Starting Linera network..."
pkill -f linera || true
sleep 2
nohup linera net up --testing-prng-seed 42 > linera.log 2>&1 &
sleep 5

# Deploy trading contracts
echo "📦 Deploying trading contracts..."
if [ -f "$HOME/.config/linera/wallet.json" ]; then
    export LINERA_WALLET="$HOME/.config/linera/wallet.json"
    export LINERA_STORAGE="rocksdb:$HOME/.config/linera/client.db"
    
    # Try to deploy
    linera project publish-and-create ./trading ai-power-trading > deploy.log 2>&1 &
fi

# Start GraphQL service
echo "📡 Starting GraphQL service..."
nohup linera service --port 8082 > graphql.log 2>&1 &
sleep 3

echo "✅ Real Data Integration Ready!"
echo ""
echo "🎯 Frontend: http://localhost:3000/linera-ai-trading.html"
echo "📊 Real Market Data: Binance API"
echo "🔗 Real Blockchain: Linera Network"
echo ""
echo "📈 Features:"
echo "  - Live BTC/ETH/SOL/BNB prices"
echo "  - Real Linera wallet integration"
echo "  - Smart contract deployment"
echo "  - GraphQL blockchain queries"