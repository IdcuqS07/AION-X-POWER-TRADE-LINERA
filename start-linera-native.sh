#!/bin/bash

echo "🚀 Starting AI POWER TRADE - Linera Native"

# Start Linera network
echo "🔗 Starting Linera network..."
nohup linera net up --testing-prng-seed 42 > linera.log 2>&1 &
sleep 5

# Start GraphQL service
echo "📡 Starting Linera GraphQL service..."
export LINERA_WALLET="$HOME/.config/linera/wallet.json"
export LINERA_STORAGE="rocksdb:$HOME/.config/linera/client.db"
nohup linera service --port 8082 > graphql.log 2>&1 &
sleep 3

# Start frontend server
echo "🌐 Starting frontend server..."
nohup python3 -m http.server 3000 > frontend.log 2>&1 &

echo "✅ AI POWER TRADE Linera Native Ready!"
echo ""
echo "🎯 Frontend: http://localhost:3000/linera-ai-trading.html"
echo "📡 GraphQL: http://localhost:8082/graphql"
echo "🔗 Linera Network: Active"
echo ""
echo "📊 Logs:"
echo "  - Linera: tail -f linera.log"
echo "  - GraphQL: tail -f graphql.log"
echo "  - Frontend: tail -f frontend.log"