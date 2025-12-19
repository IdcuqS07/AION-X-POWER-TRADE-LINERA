#!/bin/bash

echo "🚀 Deploying AI Power Trade Contract to Linera"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Build
echo ""
echo "Step 1: Building contract..."
cargo build --release --target wasm32-unknown-unknown
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
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

# Step 3: Publish and create application
echo ""
echo "Step 3: Publishing module and creating application..."
APP_OUTPUT=$(linera publish-and-create \
  target/wasm32-unknown-unknown/release/ai_power_trading.wasm \
  target/wasm32-unknown-unknown/release/ai_power_trading.wasm 2>&1)

echo "$APP_OUTPUT"

# Extract application ID from output
APP_ID=$(echo "$APP_OUTPUT" | grep -oE '[a-f0-9]{64}[0-9]{24}' | tail -1)

if [ -z "$APP_ID" ]; then
    echo "❌ Failed to create application"
    exit 1
fi
echo "✅ Application created: $APP_ID"

# Extract bytecode ID (module ID) from output
BYTECODE_ID=$(echo "$APP_OUTPUT" | grep -oE '[a-f0-9]{64}[0-9]{24}' | head -1)
if [ -z "$BYTECODE_ID" ]; then
    BYTECODE_ID="$APP_ID"
fi
echo "✅ Module ID: $BYTECODE_ID"

# Step 5: Save IDs
echo ""
echo "Step 5: Saving application IDs..."
cat > app_ids.json << EOF
{
  "trading_app_id": "$APP_ID",
  "bytecode_id": "$BYTECODE_ID",
  "deployed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "graphql_endpoint": "http://localhost:8080/graphql"
}
EOF
echo "✅ Saved to app_ids.json"

# Step 6: Update frontend env
echo ""
echo "Step 6: Updating frontend environment..."
cat > frontend-linera/.env << EOF
VITE_TRADING_APP_ID=$APP_ID
VITE_GRAPHQL_ENDPOINT=http://localhost:8080/graphql
VITE_LINERA_FAUCET=https://faucet.testnet-conway.linera.net
EOF
echo "✅ Updated frontend-linera/.env"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Application Details:"
echo "   Bytecode ID: $BYTECODE_ID"
echo "   Application ID: $APP_ID"
echo ""
echo "🚀 Next Steps:"
echo "   1. Start GraphQL service: linera service --port 8080"
echo "   2. Test contract: bash test-contract.sh"
echo "   3. Rebuild frontend: cd frontend-linera && npm run build"
echo "   4. Deploy frontend: bash deploy-production.sh"
echo ""
