#!/bin/bash

echo "🚀 Starting Linera Validator for AI POWER TRADE..."

# Kill any existing processes
pkill -f "linera"

# Start validator with verbose logging
echo "Starting validator on port 8080..."
RUST_LOG=debug linera net up --testing-prng-seed 37 --port 8080 &

# Wait for validator to start
sleep 10

echo "✅ Validator started on http://localhost:8080"
echo "📊 GraphQL endpoint: http://localhost:8080/graphql"
echo "🔍 Check validator status:"
echo "curl http://localhost:8080/chains"

# Keep running
wait