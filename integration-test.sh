#!/bin/bash

set -e

echo "🔗 Testing AI POWER TRADE Integration..."

# Start Linera network
echo "Starting Linera network..."
linera net up --testing-prng-seed 37 &
sleep 5

# Build and deploy
echo "Building applications..."
./build.sh

echo "Deploying master chain..."
MASTER_ID=$(linera publish-and-create bytecode/master_chain.wasm --json-argument "null")

echo "Deploying wallet..."
WALLET_ID=$(linera publish-and-create bytecode/wallet.wasm --json-argument "1000000")

echo "Deploying trading..."
TRADING_ID=$(linera publish-and-create bytecode/trading.wasm --json-argument "100000")

echo "Deploying AI signals..."
AI_ID=$(linera publish-and-create bytecode/ai_signals.wasm --json-argument "null")

echo "Deploying market data..."
MARKET_ID=$(linera publish-and-create bytecode/market_data.wasm --json-argument "null")

# Register applications with master
echo "Registering applications..."
linera request-application $MASTER_ID --json-argument "{\"RegisterApp\": {\"app_type\": \"Wallet\", \"app_id\": \"$WALLET_ID\", \"chain_id\": \"$(linera wallet show)\"}}"

linera request-application $MASTER_ID --json-argument "{\"RegisterApp\": {\"app_type\": \"Trading\", \"app_id\": \"$TRADING_ID\", \"chain_id\": \"$(linera wallet show)\"}}"

# Connect applications
echo "Connecting applications..."
linera request-application $MASTER_ID --json-argument "{\"ConnectApps\": {\"trading_chain\": \"$(linera wallet show)\", \"wallet_chain\": \"$(linera wallet show)\"}}"

# Start trading
echo "Starting trading..."
linera request-application $MASTER_ID --json-argument "{\"StartTrading\": {\"user_chain\": \"$(linera wallet show)\"}}"

# Generate AI signal
echo "Generating AI signal..."
linera request-application $AI_ID --json-argument "{\"GenerateSignal\": {\"symbol\": \"BTC\", \"market_data\": []}}"

# Update market data
echo "Updating market data..."
linera request-application $MARKET_ID --json-argument "{\"UpdatePrice\": {\"symbol\": \"BTC\", \"price\": 45000}}"

echo "✅ Integration test complete!"