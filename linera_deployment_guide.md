# 🚀 Panduan Lengkap: Deploy AI Power Trade di Linera

## 📋 Daftar Isi
1. [Memahami Linera](#memahami-linera)
2. [Setup Environment](#setup-environment)
3. [Struktur Project AI Trading](#struktur-project)
4. [Step-by-Step Deployment](#deployment-steps)
5. [Testing & Troubleshooting](#testing)

---

## 🎯 Memahami Linera

### Apa itu Linera?
Linera adalah blockchain Layer-1 yang menggunakan konsep **microchains** - setiap user punya blockchain sendiri yang ringan dan cepat.

### Mengapa Cocok untuk Trading?
✅ **Ultra Fast**: Finality < 0.5 detik  
✅ **Scalable**: Unlimited parallel chains  
✅ **Low Latency**: Ideal untuk high-frequency trading  
✅ **GraphQL Native**: API yang mudah digunakan  
✅ **No Gas Wars**: Setiap user punya chain sendiri  

### Konsep Kunci

```
┌─────────────────────────────────────────────┐
│  TRADITIONAL BLOCKCHAIN                     │
│  Semua user compete untuk 1 blockchain     │
│  ❌ Slow, ❌ Expensive, ❌ Congested       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  LINERA - MICROCHAINS                       │
│  Setiap user/app punya chain sendiri       │
│  ✅ Fast, ✅ Cheap, ✅ Scalable            │
└─────────────────────────────────────────────┘

User A Chain ──┐
User B Chain ──┼─→ Validators (sync semua chain)
User C Chain ──┤
App Chain   ───┘
```

---

## ⚙️ Setup Environment

### 1. Install Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install wasm32 target (untuk Linera apps)
rustup target add wasm32-unknown-unknown

# Verify
rustc --version
cargo --version
```

### 2. Install Linera CLI

```bash
# Clone Linera repository
git clone https://github.com/linera-io/linera-protocol.git
cd linera-protocol

# Build Linera binaries
cargo build -p linera-storage-service -p linera-service --bins --release

# Add to PATH
export PATH="$PWD/target/release:$PATH"

# Verify installation
linera --version
```

### 3. Setup Wallet

**Option A: Local Development Network**
```bash
# Create temporary directory untuk testing
export LINERA_TMP_DIR=$(mktemp -d)

# Start local test network
linera net up --with-faucet --faucet-port 8080

# Set wallet paths
export LINERA_WALLET="$LINERA_TMP_DIR/wallet.json"
export LINERA_KEYSTORE="$LINERA_TMP_DIR/keystore.json"
export LINERA_STORAGE="rocksdb:$LINERA_TMP_DIR/client.db"
```

**Option B: Testnet (Recommended)**
```bash
# Initialize wallet dengan testnet faucet
linera wallet init --with-new-chain \
  --faucet https://faucet.testnet-babbage.linera.net

# Simpan wallet configuration
export LINERA_WALLET="$HOME/.config/linera/wallet.json"
export LINERA_KEYSTORE="$HOME/.config/linera/keystore.json"
export LINERA_STORAGE="rocksdb:$HOME/.config/linera/linera.db"
```

### 4. Verify Setup

```bash
# Check wallet info
linera wallet show

# Sync dengan network
linera sync

# Query balance
linera query-balance
```

---

## 📦 Struktur Project AI Trading

### Directory Structure

```
ai-trading-linera/
├── Cargo.toml              # Workspace configuration
├── README.md
│
├── abi/                    # Shared types library
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs          # Main exports
│       ├── trading.rs      # Trading types
│       ├── prediction.rs   # AI signal types
│       └── portfolio.rs    # Portfolio types
│
├── token_pool/             # Token management app
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs
│       ├── contract.rs     # Token operations
│       ├── service.rs      # GraphQL service
│       └── state.rs        # Chain state
│
├── trading/                # Main trading app
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs
│       ├── contract.rs     # Trading logic
│       ├── service.rs      # GraphQL service
│       ├── state.rs        # Trading state
│       └── chains/         # Chain-specific logic
│           ├── mod.rs
│           ├── user_chain.rs
│           ├── trade_chain.rs
│           ├── public_chain.rs
│           └── master_chain.rs
│
└── frontend/               # Web interface
    ├── package.json
    ├── next.config.js
    └── src/
        ├── pages/
        ├── components/
        └── lib/
            └── graphql/    # GraphQL queries
```

---

## 🔨 Step-by-Step Deployment

### STEP 1: Create Project Structure

```bash
# Create project directory
mkdir ai-trading-linera
cd ai-trading-linera

# Initialize Cargo workspace
cat > Cargo.toml << 'EOF'
[workspace]
members = ["abi", "token_pool", "trading"]

[workspace.dependencies]
linera-sdk = "0.12"
serde = { version = "1.0", features = ["derive"] }
async-graphql = "7.0"
EOF

# Create sub-projects
cargo new --lib abi
cargo new --lib token_pool
cargo new --lib trading
```

### STEP 2: Implement ABI Library

```bash
cd abi
```

Edit `Cargo.toml`:
```toml
[package]
name = "ai-trading-abi"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { workspace = true }
linera-sdk = { workspace = true }
```

Edit `src/lib.rs`: (gunakan code dari artifact sebelumnya)

### STEP 3: Implement Token Pool Application

```bash
cd ../token_pool
```

Edit `Cargo.toml`:
```toml
[package]
name = "token-pool"
version = "0.1.0"
edition = "2021"

[dependencies]
ai-trading-abi = { path = "../abi" }
linera-sdk = { workspace = true }
serde = { workspace = true }
async-graphql = { workspace = true }

[lib]
crate-type = ["cdylib"]
```

Buat `src/state.rs`:
```rust
use linera_sdk::base::ContractAbi;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenPoolState {
    pub total_supply: u128,
    pub balances: std::collections::BTreeMap<String, u128>,
}

// Define ABI
pub struct TokenPoolAbi;

impl ContractAbi for TokenPoolAbi {
    type Operation = (); // Define operations
    type Response = ();  // Define responses
}
```

### STEP 4: Implement Trading Application

Trading app adalah aplikasi utama yang mengelola logika trading.

```bash
cd ../trading
```

Edit `Cargo.toml`:
```toml
[package]
name = "ai-trading"
version = "0.1.0"
edition = "2021"

[dependencies]
ai-trading-abi = { path = "../abi" }
token-pool = { path = "../token_pool" }
linera-sdk = { workspace = true }
serde = { workspace = true }
async-graphql = { workspace = true }

[lib]
crate-type = ["cdylib"]
```

Buat `src/contract.rs`:
```rust
use linera_sdk::{
    base::{ChainId, Owner, Timestamp},
    Contract, ContractRuntime,
};
use ai_trading_abi::*;

pub struct TradingContract {
    state: TradingState,
    runtime: ContractRuntime<Self>,
}

impl TradingContract {
    // Execute trade based on AI signal
    pub async fn execute_trade(
        &mut self,
        signal: TradingSignal,
    ) -> Result<TradeRecord, String> {
        // Validate signal
        if !signal.should_execute(&self.state.risk_limits) {
            return Err("Signal does not meet criteria".to_string());
        }
        
        // Create trade request
        let trade = TradeRequest {
            user_chain_id: self.runtime.chain_id().to_string(),
            symbol: signal.symbol.clone(),
            trade_type: TradeType::Market,
            amount: signal.risk_assessment.max_position_size,
            price: 0.0, // Market price
        };
        
        // Validate trade
        let validation = trade.validate(
            &self.state.portfolio,
            &self.state.risk_limits,
        );
        
        if !validation.valid {
            return Err(validation.reasons.join(", "));
        }
        
        // Execute trade (interact with token pool)
        // Send cross-chain message to token pool
        
        Ok(TradeRecord {
            id: format!("trade_{}", self.state.trade_count),
            user_chain_id: trade.user_chain_id,
            symbol: trade.symbol,
            side: if matches!(signal.signal_type, SignalType::Buy) {
                TradeSide::Buy
            } else {
                TradeSide::Sell
            },
            amount: trade.amount,
            price: trade.price,
            timestamp: self.runtime.system_time(),
            status: TradeStatus::Executed,
            pnl: 0.0,
        })
    }
}
```

### STEP 5: Build Applications

```bash
# Kembali ke root project
cd ..

# Build semua applications
cargo build --release --target wasm32-unknown-unknown

# Verify builds
ls target/wasm32-unknown-unknown/release/*.wasm
```

### STEP 6: Publish to Linera

**A. Publish Token Pool Application**
```bash
# Publish token pool
linera publish-bytecode \
  target/wasm32-unknown-unknown/release/token_pool.wasm \
  target/wasm32-unknown-unknown/release/token_pool_contract.wasm

# Simpan bytecode ID (output dari command di atas)
export TOKEN_POOL_BYTECODE_ID="<bytecode-id-from-output>"
```

**B. Create Token Pool Application**
```bash
# Create application instance
linera create-application $TOKEN_POOL_BYTECODE_ID

# Simpan application ID
export TOKEN_POOL_APP_ID="<app-id-from-output>"
```

**C. Publish Trading Application**
```bash
# Publish trading app
linera publish-bytecode \
  target/wasm32-unknown-unknown/release/ai_trading.wasm \
  target/wasm32-unknown-unknown/release/ai_trading_contract.wasm

export TRADING_BYTECODE_ID="<bytecode-id-from-output>"

# Create trading application (dengan dependency ke token pool)
linera create-application $TRADING_BYTECODE_ID \
  --required-application-ids $TOKEN_POOL_APP_ID

export TRADING_APP_ID="<app-id-from-output>"
```

### STEP 7: Start Linera Service (untuk GraphQL)

```bash
# Start service dengan port 8080
linera service --port 8080 &

# Service akan expose GraphQL API di:
# http://localhost:8080/chains/<your-chain-id>/applications/<app-id>
```

### STEP 8: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install next react react-dom graphql-request

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_LINERA_ENDPOINT=http://localhost:8080
NEXT_PUBLIC_TRADING_APP_ID=$TRADING_APP_ID
NEXT_PUBLIC_CHAIN_ID=$(linera wallet show | grep "Public Key" | head -1 | cut -d: -f2)
EOF

# Start development server
npm run dev
```

---

## 🧪 Testing

### Test 1: Query Balance

```bash
# Using curl
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ balance }"
  }'
```

### Test 2: Get Trading Signal

```graphql
query GetSignal {
  tradingSignal(symbol: "BTC") {
    signalType
    confidence
    indicators {
      rsi
      macd_value
    }
    riskAssessment {
      riskScore
      maxPositionSize
    }
  }
}
```

### Test 3: Execute Trade

```graphql
mutation ExecuteTrade {
  executeTrade(input: {
    symbol: "BTC"
    amount: 0.1
    tradeType: MARKET
  }) {
    id
    status
    price
    pnl
  }
}
```

### Test 4: Query Portfolio

```graphql
query Portfolio {
  portfolio {
    balance
    totalValue
    positions {
      symbol
      amount
      unrealizedPnl
    }
  }
}
```

---

## 🔧 Troubleshooting

### Error: "wallet not found"
```bash
# Re-initialize wallet
linera wallet init --with-new-chain \
  --faucet https://faucet.testnet-babbage.linera.net
```

### Error: "failed to build wasm"
```bash
# Ensure wasm target is installed
rustup target add wasm32-unknown-unknown

# Clean and rebuild
cargo clean
cargo build --release --target wasm32-unknown-unknown
```

### Error: "GraphQL endpoint not responding"
```bash
# Restart service
pkill linera
linera service --port 8080
```

### Error: "insufficient balance"
```bash
# Request tokens from faucet
curl -X POST https://faucet.testnet-babbage.linera.net \
  -H "Content-Type: application/json" \
  -d "{\"chain_id\": \"$(linera wallet show | grep 'Chain ID' | cut -d: -f2)\"}"
```

---

## 📚 Resources

### Official Documentation
- **Linera Docs**: https://linera.dev
- **SDK Reference**: https://docs.rs/linera-sdk
- **Developer Manual**: https://linera.dev/developers

### Example Projects
- **Microcard**: https://github.com/hasToDev/microcard
- **Fungible Token**: https://github.com/linera-io/linera-protocol/tree/main/examples/fungible

### Community
- **Discord**: https://discord.gg/linera
- **Telegram**: https://t.me/linera_official
- **Twitter**: https://twitter.com/linera_io

---

## 🎯 Next Steps

1. **Add AI Prediction Logic**
   - Implement RSI, MACD calculations
   - Add ML model integration
   - Connect to price oracles

2. **Enhance Risk Management**
   - Add stop-loss automation
   - Implement position sizing
   - Add daily loss limits

3. **Improve Frontend**
   - Add real-time charts
   - Show trade history
   - Portfolio analytics

4. **Deploy to Production**
   - Test on testnet extensively
   - Prepare for mainnet
   - Setup monitoring

---

## ✅ Checklist Deploy

- [ ] Rust installed
- [ ] Linera CLI installed
- [ ] Wallet initialized
- [ ] ABI library created
- [ ] Token pool deployed
- [ ] Trading app deployed
- [ ] Frontend connected
- [ ] GraphQL working
- [ ] Trades executing
- [ ] Portfolio tracking

---

**Selamat! Anda sekarang punya AI Trading System di Linera! 🎉**
