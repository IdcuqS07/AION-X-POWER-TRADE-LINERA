# AI POWER TRADE Deployment Guide

## Prerequisites

1. Install Linera CLI:
```bash
cargo install linera-cli --git https://github.com/linera-io/linera-protocol.git
```

2. Add WASM target:
```bash
rustup target add wasm32-unknown-unknown
```

## Local Deployment

### 1. Start Linera Network
```bash
linera net up --testing-prng-seed 37
linera service --port 8080
```

### 2. Deploy Applications
```bash
./deploy/deploy.sh
```

### 3. Initialize Chains
```bash
./deploy/init_chains.sh <TRADING_APP_ID> <WALLET_APP_ID>
```

### 4. Test Deployment
```bash
./deploy/test_deployment.sh <TRADING_APP_ID> <WALLET_APP_ID>
```

## Docker Deployment

```bash
make docker-deploy
```

## Manual Deployment Steps

### 1. Build Applications
```bash
cargo build --release --target wasm32-unknown-unknown
```

### 2. Deploy Wallet
```bash
WALLET_APP_ID=$(linera publish-and-create \
    target/wasm32-unknown-unknown/release/wallet.wasm \
    target/wasm32-unknown-unknown/release/wallet_service.wasm \
    --json-argument '{"master_chain": "MASTER_CHAIN_ID", "initial_supply": 1000000}')
```

### 3. Deploy Trading
```bash
TRADING_APP_ID=$(linera publish-and-create \
    target/wasm32-unknown-unknown/release/trading.wasm \
    target/wasm32-unknown-unknown/release/trading_service.wasm \
    --json-argument "{\"master_chain\": \"MASTER_CHAIN_ID\", \"wallet\": \"$WALLET_APP_ID\"}")
```

## Usage Examples

### Create Trade
```bash
linera request-application $TRADING_APP_ID \
    --json-argument '{"CreateTrade": {"symbol": "BTC/USD", "amount": 100, "price": 50000, "trade_type": "buy"}}'
```

### Generate AI Signal
```bash
linera request-application $TRADING_APP_ID \
    --json-argument '{"GenerateSignal": {"symbol": "BTC/USD", "model_version": "v1.0"}}'
```

### Check Portfolio
```bash
linera query-application $TRADING_APP_ID \
    --json-argument '{"GetPortfolio": {}}'
```

## Configuration

Edit `deploy/config.toml` to customize deployment parameters.

## Troubleshooting

1. **Build errors**: Ensure WASM target is installed
2. **Network errors**: Check Linera service is running
3. **Permission errors**: Make scripts executable with `chmod +x deploy/*.sh`