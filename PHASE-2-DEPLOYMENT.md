# Phase 2: Smart Contract Deployment

## 📋 Status Check

### ✅ Yang Sudah Ada:
- Smart contract code di `trading/`
- ABI definitions di `abi/`
- Wallet contract di `wallet/`
- Cargo workspace configured
- Linera CLI installed (v0.15.6)

### 🎯 Yang Perlu Dilakukan:
1. Build contract ke WASM
2. Publish bytecode ke Linera
3. Create application
4. Test contract functions
5. Integrate dengan frontend

---

## Step 1: Build Contract

```bash
# Build semua contracts dalam workspace
cargo build --release --target wasm32-unknown-unknown

# Output akan ada di:
# target/wasm32-unknown-unknown/release/ai_power_trading.wasm
```

### Expected Output:
```
Compiling ai-power-trade-abi v0.1.0
Compiling ai-power-trading v0.1.0
Finished release [optimized] target(s) in X.XXs
```

---

## Step 2: Setup Linera Wallet

Kita sudah punya chain dari frontend, tapi perlu setup CLI wallet untuk deploy:

```bash
# Check current wallet
linera wallet show

# Atau buat wallet baru untuk deployment
linera wallet init --faucet https://faucet.testnet-conway.linera.net
```

### Get Chain ID:
```bash
# List chains
linera wallet show

# Set default chain
export LINERA_WALLET_DEFAULT_CHAIN=<your-chain-id>
```

---

## Step 3: Publish Bytecode

```bash
# Publish trading contract bytecode
linera publish-bytecode \
  target/wasm32-unknown-unknown/release/ai_power_trading.wasm \
  --with-service target/wasm32-unknown-unknown/release/ai_power_trading.wasm

# Save the bytecode ID yang muncul
# Format: <chain-id>:<bytecode-hash>
```

### Expected Output:
```
Bytecode published successfully!
Bytecode ID: e476187f6ddfeb9d588c7e73d83c5f9dcd382b614c64840d7de4a404f828a5f4010000000000000000000000e476187f6ddfeb9d588c7e73d83c5f9dcd382b614c64840d7de4a404f828a5f4030000000000000000000000
```

---

## Step 4: Create Application

```bash
# Create application dari bytecode
linera create-application <bytecode-id>

# Save the Application ID yang muncul
# Format: <chain-id>:<application-hash>
```

### Expected Output:
```
Application created successfully!
Application ID: e476187f6ddfeb9d588c7e73d83c5f9dcd382b614c64840d7de4a404f828a5f4020000000000000000000000e476187f6ddfeb9d588c7e73d83c5f9dcd382b614c64840d7de4a404f828a5f4030000000000000000000000
```

---

## Step 5: Test Contract Functions

### 5.1 Generate AI Signal

```bash
# Test generate signal operation
linera query-application <application-id> \
  --operation '{"GenerateSignal": {"coin": "BTC"}}'
```

### 5.2 Execute Trade

```bash
# Test execute trade
linera query-application <application-id> \
  --operation '{
    "ExecuteTrade": {
      "signal": {
        "coin": "BTC",
        "signal": "BUY",
        "confidence": 0.85,
        "risk_score": 45,
        "target_price": 45000.0,
        "timestamp": 1234567890
      },
      "amount": "100"
    }
  }'
```

### 5.3 Query Portfolio

```bash
# Query portfolio
linera query-application <application-id> \
  --query '{"GetPortfolio": {}}'
```

### 5.4 Query Trade History

```bash
# Query trade history
linera query-application <application-id> \
  --query '{"GetTradeHistory": {}}'
```

---

## Step 6: Start GraphQL Service

```bash
# Start GraphQL service untuk application
linera service --port 8080

# GraphQL endpoint akan tersedia di:
# http://localhost:8080/graphql
```

### Test GraphQL:
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ chains { list } }"
  }'
```

---

## Step 7: Save Application IDs

Setelah deploy berhasil, save Application ID ke file:

```bash
# Save ke app_ids.json
cat > app_ids.json << EOF
{
  "trading_app_id": "<your-application-id>",
  "bytecode_id": "<your-bytecode-id>",
  "chain_id": "<your-chain-id>",
  "graphql_endpoint": "http://localhost:8080/graphql"
}
EOF
```

---

## Step 8: Update Frontend

Update `frontend-linera/.env`:

```env
VITE_TRADING_APP_ID=<your-application-id>
VITE_GRAPHQL_ENDPOINT=http://localhost:8080/graphql
```

---

## 🚀 Quick Deploy Script

Saya akan buat script otomatis untuk semua step di atas:

```bash
#!/bin/bash
# deploy-contract.sh

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
linera wallet show
if [ $? -ne 0 ]; then
    echo "❌ No wallet found. Run: linera wallet init --faucet https://faucet.testnet-conway.linera.net"
    exit 1
fi
echo "✅ Wallet found"

# Step 3: Publish bytecode
echo ""
echo "Step 3: Publishing bytecode..."
BYTECODE_OUTPUT=$(linera publish-bytecode \
  target/wasm32-unknown-unknown/release/ai_power_trading.wasm \
  --with-service target/wasm32-unknown-unknown/release/ai_power_trading.wasm 2>&1)

BYTECODE_ID=$(echo "$BYTECODE_OUTPUT" | grep -oE '[a-f0-9]{64}[0-9]{24}' | head -1)

if [ -z "$BYTECODE_ID" ]; then
    echo "❌ Failed to publish bytecode"
    echo "$BYTECODE_OUTPUT"
    exit 1
fi
echo "✅ Bytecode published: $BYTECODE_ID"

# Step 4: Create application
echo ""
echo "Step 4: Creating application..."
APP_OUTPUT=$(linera create-application "$BYTECODE_ID" 2>&1)

APP_ID=$(echo "$APP_OUTPUT" | grep -oE '[a-f0-9]{64}[0-9]{24}' | head -1)

if [ -z "$APP_ID" ]; then
    echo "❌ Failed to create application"
    echo "$APP_OUTPUT"
    exit 1
fi
echo "✅ Application created: $APP_ID"

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
```

---

## 🧪 Test Script

```bash
#!/bin/bash
# test-contract.sh

APP_ID=$(cat app_ids.json | grep trading_app_id | cut -d'"' -f4)

echo "🧪 Testing AI Power Trade Contract"
echo "Application ID: $APP_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: Generate Signal
echo ""
echo "Test 1: Generate AI Signal for BTC"
linera query-application "$APP_ID" \
  --operation '{"GenerateSignal": {"coin": "BTC"}}'

# Test 2: Query Portfolio
echo ""
echo "Test 2: Query Portfolio"
linera query-application "$APP_ID" \
  --query '{"GetPortfolio": {}}'

# Test 3: Query Trade History
echo ""
echo "Test 3: Query Trade History"
linera query-application "$APP_ID" \
  --query '{"GetTradeHistory": {}}'

echo ""
echo "✅ Tests complete"
```

---

## 📝 Notes

### Common Issues:

1. **Build Error: "linera-sdk not found"**
   - Solution: Update Cargo.toml dependencies

2. **Publish Error: "Insufficient balance"**
   - Solution: Request tokens dari faucet

3. **Application Error: "Chain not found"**
   - Solution: Wait 30-60s untuk chain propagation

### Debugging:

```bash
# Check logs
linera wallet show --verbose

# Check chain status
linera query-validators

# Check application status
linera query-application <app-id> --status
```

---

## ✅ Success Criteria

- [ ] Contract builds without errors
- [ ] Bytecode published successfully
- [ ] Application created successfully
- [ ] Generate signal works
- [ ] Execute trade works
- [ ] Query portfolio works
- [ ] Query history works
- [ ] GraphQL service running
- [ ] Frontend can connect to GraphQL

---

**Ready to deploy? Run:**
```bash
bash deploy-contract.sh
```
