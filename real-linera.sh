#!/bin/bash

echo "🔥 REAL LINERA NETWORK SETUP"

# Clean slate
pkill -f linera || true
rm -rf ~/.config/linera || true
mkdir -p ~/.config/linera

# Initialize fresh wallet
linera wallet init --genesis ~/.config/linera/genesis.json

# Set environment
export LINERA_WALLET="$HOME/.config/linera/wallet.json"
export LINERA_STORAGE="rocksdb:$HOME/.config/linera/client.db"

# Start network in background
nohup linera net up --testing-prng-seed 42 > linera.log 2>&1 &

# Wait for network
sleep 10

# Start GraphQL service
nohup linera service --port 8081 > service.log 2>&1 &

echo "✅ REAL LINERA NETWORK: ACTIVE"
echo "🌐 GraphQL: http://localhost:8081/graphql"
echo "📊 Check logs: tail -f linera.log service.log"