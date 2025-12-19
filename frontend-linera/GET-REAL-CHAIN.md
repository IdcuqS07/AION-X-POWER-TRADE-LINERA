# 🎯 How to Get Real Chain ID for WASM Logs

## Problem
WASM debug logs hanya muncul ketika Client berhasil connect ke validators dengan chain ID yang valid.

## Solution: Use CLI to Get Valid Chain

### Step 1: Create Wallet via CLI

```bash
cd frontend-linera

# Initialize wallet
linera wallet init --faucet https://faucet.testnet-conway.linera.net

# Request chain
linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net
```

### Step 2: Get Chain Info

```bash
# Show wallet info
linera wallet show

# List chains
linera wallet list
```

Output akan seperti:
```
Chain 0: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65
  Balance: 10.0
  Owner: 0x1234...
```

### Step 3: Export Wallet Data

```bash
# Get mnemonic (if available)
cat ~/.config/linera/wallet.json | grep -A 20 "mnemonic"

# Or on macOS
cat ~/Library/Application\ Support/linera/wallet.json
```

### Step 4: Import to Web App

Open browser console dan run:

```javascript
// Set chain ID dari CLI
localStorage.setItem('linera_chain_id', 'YOUR_CHAIN_ID_FROM_CLI');

// Set owner address
localStorage.setItem('linera_owner', 'YOUR_OWNER_ADDRESS');

// Set mnemonic (if you have it)
localStorage.setItem('linera_mnemonic', 'YOUR_MNEMONIC_PHRASE');

// Reload page
location.reload();
```

### Step 5: Verify

Setelah reload, aplikasi akan:
1. ✅ Restore wallet dari localStorage
2. ✅ Create Client dengan chain ID yang valid
3. ✅ Connect ke validators
4. ✅ **WASM debug logs akan muncul!**

## Alternative: Manual Chain ID Input

Tambahkan UI untuk input chain ID manual:

```javascript
// In browser console
const chainId = prompt('Enter your chain ID from CLI:');
const owner = prompt('Enter your owner address:');

localStorage.setItem('linera_chain_id', chainId);
localStorage.setItem('linera_owner', owner);
location.reload();
```

## Why This Works

1. CLI berhasil connect ke faucet (lebih reliable)
2. Chain ID yang didapat valid dan terdaftar di network
3. Validators recognize chain ID
4. Client bisa sync dengan validators
5. WASM internal operations triggered
6. Debug logs muncul!

## Expected WASM Logs

Setelah berhasil, Anda akan melihat:

```
DEBUG run{enable_background_sync=true}: linera_core::updater: starting
DEBUG communicate_with_quorum total_validators=4
DEBUG handle_chain_info_query{address="https://validator-1..."}: linera_rpc::grpc::client: sending gRPC request
DEBUG download_certificates_by_heights{chain_id=...}: linera_rpc::grpc::client: sending gRPC request
DEBUG background_sync_received_certificates{chain_id=...}
```

## Quick Test Script

```bash
#!/bin/bash
# quick-import-chain.sh

echo "Getting chain info from CLI..."
CHAIN_ID=$(linera wallet list | grep "Chain 0:" | awk '{print $3}')
OWNER=$(linera wallet show | grep "Owner:" | awk '{print $2}')

echo "Chain ID: $CHAIN_ID"
echo "Owner: $OWNER"

echo ""
echo "Run this in browser console:"
echo "localStorage.setItem('linera_chain_id', '$CHAIN_ID');"
echo "localStorage.setItem('linera_owner', '$OWNER');"
echo "location.reload();"
```

---

**TL;DR:** Faucet API bermasalah di web, tapi CLI works. Gunakan CLI untuk get chain ID, lalu import ke web app untuk trigger WASM logs.
