#!/bin/bash

echo "🚀 Deploying AI Trading to Linera..."

# Build first
./build.sh

if [ $? -ne 0 ]; then
    echo "❌ Build failed, aborting deployment"
    exit 1
fi

echo ""
echo "📡 Publishing to Linera..."

# Publish bytecode
BYTECODE_ID=$(linera publish-bytecode \
  target/wasm32-unknown-unknown/release/ai_trading.wasm \
  target/wasm32-unknown-unknown/release/ai_trading_contract.wasm 2>/dev/null | \
  grep -o 'Bytecode ID: [a-f0-9]*' | cut -d' ' -f3)

if [ -z "$BYTECODE_ID" ]; then
    echo "❌ Failed to publish bytecode"
    exit 1
fi

echo "✅ Bytecode published: $BYTECODE_ID"

# Create application
APP_ID=$(linera create-application $BYTECODE_ID 2>/dev/null | \
  grep -o 'Application ID: [a-f0-9]*' | cut -d' ' -f3)

if [ -z "$APP_ID" ]; then
    echo "❌ Failed to create application"
    exit 1
fi

echo "✅ Application created: $APP_ID"

# Get chain ID
CHAIN_ID=$(linera wallet show | grep "Chain ID" | head -1 | awk '{print $3}')

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "📊 Application Details:"
echo "   Bytecode ID: $BYTECODE_ID"
echo "   App ID:      $APP_ID"
echo "   Chain ID:    $CHAIN_ID"
echo ""
echo "🔗 GraphQL Endpoint:"
echo "   http://localhost:8080/chains/$CHAIN_ID/applications/$APP_ID"
echo ""
echo "▶️  Start service:"
echo "   linera service --port 8080"