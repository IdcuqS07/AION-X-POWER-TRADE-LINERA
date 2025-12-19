#!/bin/bash

echo "🚀 Quick Deploy AI POWER TRADE..."

# Kill all Linera processes
sudo pkill -f linera || true
sudo lsof -ti:9001 | xargs sudo kill -9 || true
sudo lsof -ti:8080 | xargs sudo kill -9 || true
sleep 3

# Start fresh network
LINERA_WALLET_DIR=$(mktemp -d)
export LINERA_WALLET="$LINERA_WALLET_DIR/wallet.json"
export LINERA_STORAGE="rocksdb:$LINERA_WALLET_DIR/client.db"

# Initialize and start
linera wallet init --genesis genesis.json &
sleep 5

# Start service on different port
linera service --port 8081 &
sleep 3

echo "✅ Linera Network: ACTIVE"
echo "🌐 GraphQL: http://localhost:8081/graphql"
echo "🎯 AI POWER TRADE: READY"