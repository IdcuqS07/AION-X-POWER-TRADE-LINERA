#!/bin/bash

echo "🔧 Fixing Linera Network Connection..."

# Clean up any existing processes
pkill -f linera || true
sleep 2

# Use Linera helper function
eval "$(linera net helper)"

# Start network with helper
linera_spawn_and_read_wallet_variables linera net up --testing-prng-seed 42

echo "✅ Network started successfully!"
echo "🌐 GraphQL endpoint should be available"

# Start service
linera service --port 8080 &

echo "🚀 AI POWER TRADE ready for deployment!"