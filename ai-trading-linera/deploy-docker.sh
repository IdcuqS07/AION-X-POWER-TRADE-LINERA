#!/bin/bash

echo "🚀 AI Power Trade - Linera Docker Deployment"

# Setup Linera network
export PATH="/usr/local/cargo/bin:$PATH"
source /dev/stdin <<<$(linera net helper 2>/dev/null)
linera_spawn linera net up --initial-amount 1000000000000 --with-faucet --faucet-port 8080

sleep 5

# Initialize wallet
linera wallet init --faucet http://localhost:8080

# Deploy trading app
BYTECODE_ID=$(linera project publish-and-create . trading --json-argument "10000")
echo "✅ Trading app deployed: $BYTECODE_ID"

# Start service
linera service --port 8081 &

echo "✅ AI Power Trade ready!"
echo "📡 GraphQL: http://localhost:8081"
echo "🌐 Frontend: Connect to http://localhost:8081/graphql"

# Keep container running
tail -f /dev/null