#!/bin/bash

echo "🚀 Deploying AI Power Trade Contract to Linera Testnet Conway"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Build
echo ""
echo "Step 1: Building contract..."
cd linera-protocol/examples
cargo build --release --target wasm32-unknown-unknown -p ai-trading
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
cd ../..
echo "✅ Build successful"

# Step 2: Check wallet
echo ""
echo "Step 2: Checking Linera wallet..."
linera wallet show > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ No wallet found. Run: linera wallet init --faucet https://faucet.testnet-conway.linera.net"
    exit 1
fi
echo "✅ Wallet found"

# Step 3: Deploy
echo ""
echo "Step 3: Publishing and creating application..."
APP_OUTPUT=$(linera publish-and-create \
  linera-protocol/examples/target/wasm32-unknown-unknown/release/ai_trading_contract.wasm \
  linera-protocol/examples/target/wasm32-unknown-unknown/release/ai_trading_service.wasm \
  --json-argument 0 2>&1)

echo "$APP_OUTPUT"

# Extract application ID from output
APP_ID=$(echo "$APP_OUTPUT" | tail -1)

if [ -z "$APP_ID" ]; then
    echo "❌ Failed to create application"
    exit 1
fi
echo "✅ Application created: $APP_ID"

# Step 4: Save IDs
echo ""
echo "Step 4: Saving application ID..."
cat > app_ids.json << EOF
{
  "ai_trading_app_id": "$APP_ID",
  "deployed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "network": "testnet-conway",
  "features": [
    "IncrementTrades",
    "GenerateSignal",
    "ExecuteTrade"
  ],
  "queries": [
    "trade_count",
    "signals",
    "trades"
  ]
}
EOF
echo "✅ Saved to app_ids.json"

# Step 5: Update frontend env
echo ""
echo "Step 5: Updating frontend environment..."
cat > frontend-linera/.env << EOF
VITE_AI_TRADING_APP_ID=$APP_ID
VITE_LINERA_FAUCET=https://faucet.testnet-conway.linera.net
EOF
echo "✅ Updated frontend-linera/.env"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Application Details:"
echo "   Application ID: $APP_ID"
echo "   Network: Testnet Conway"
echo ""
echo "🚀 Next Steps:"
echo "   1. Start GraphQL service: linera service --port 8080"
echo "   2. Test queries: bash test-ai-trading.sh"
echo "   3. Rebuild frontend: cd frontend-linera && npm run build"
echo "   4. Deploy frontend: bash deploy-production.sh"
echo ""
