#!/bin/bash

echo "🔗 Connecting to Linera Conway Testnet..."

# Conway testnet faucet endpoints (common patterns)
CONWAY_FAUCETS=(
    "http://faucet.conway.linera.net:40080"
    "https://faucet.conway.linera.net"
    "http://conway-faucet.linera.io:40080"
    "https://conway-faucet.linera.io"
    "http://testnet.linera.net:40080"
)

# Try each faucet endpoint
for faucet in "${CONWAY_FAUCETS[@]}"; do
    echo "🔍 Trying faucet: $faucet"
    
    if linera wallet init --faucet "$faucet" 2>/dev/null; then
        echo "✅ Connected to Conway testnet via $faucet"
        
        # Start GraphQL service for testnet
        echo "📡 Starting Conway testnet GraphQL service..."
        nohup linera service --port 8082 > conway-graphql.log 2>&1 &
        
        # Test connection
        sleep 3
        if curl -s http://localhost:8082/graphql >/dev/null; then
            echo "✅ Conway testnet GraphQL ready on port 8082"
            echo "🎯 Update frontend to use Conway testnet"
            exit 0
        fi
    else
        echo "❌ Failed to connect to $faucet"
    fi
done

echo "⚠️ Conway testnet not accessible, using local network"
echo "📝 Check Linera docs for current Conway testnet endpoints"