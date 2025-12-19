# Pola Integrasi Linera untuk AI Power Trade

## Struktur Multi-Chain yang Diperlukan

### 1. **Master Chain** (Administrative)
- Mint tokens untuk aplikasi
- Mengelola public chains
- Validasi otorisasi via chain ID

### 2. **Public Chains** (Discovery & Routing)
- Directory service untuk trading chains
- Route request trading
- Manage price feeds

### 3. **Trading Chains** (Execution Environment)
- Host active trading sessions
- Execute AI signals
- Broadcast trading state

### 4. **User Chains** (Individual State)
- Store user portfolio
- Maintain trading history
- Handle subscriptions

## Implementasi Minimal

### Cargo.toml Workspace
```toml
[workspace]
members = ["abi", "portfolio", "trading"]

[workspace.dependencies]
linera-sdk = { version = "0.15.7" }
async-graphql = { version = "7.0.17" }
serde = { version = "1.0", features = ["derive"] }
```

### ABI Library (Shared Types)
```rust
// abi/src/lib.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TradingSignal {
    pub symbol: String,
    pub signal_type: SignalType,
    pub confidence: f64,
    pub price: f64,
    pub rsi: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SignalType { Buy, Sell, Hold }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Portfolio {
    pub balance: u128,
    pub positions: Vec<Position>,
    pub total_value: u128,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position {
    pub symbol: String,
    pub amount: f64,
    pub entry_price: f64,
    pub current_price: f64,
}
```

### Trading Contract
```rust
// trading/src/contract.rs
use linera_sdk::{Contract, ContractRuntime};

pub struct TradingContract {
    state: TradingState,
    runtime: ContractRuntime<Self>,
}

impl Contract for TradingContract {
    async fn execute_operation(&mut self, operation: TradingOperation) -> TradingResponse {
        match operation {
            TradingOperation::UpdateSignal { signal } => {
                self.state.signals.insert(signal.symbol.clone(), signal);
                TradingResponse::SignalUpdated
            }
            
            TradingOperation::ExecuteTrade { symbol, side, amount } => {
                let signal = self.state.signals.get(&symbol)
                    .ok_or("No signal available")?;
                
                if signal.confidence < 70.0 {
                    return Err("Signal confidence too low".into());
                }
                
                let trade = self.execute_trade_logic(symbol, side, amount).await?;
                TradingResponse::TradeExecuted(trade)
            }
        }
    }
}
```

### GraphQL Service
```rust
// trading/src/service.rs
use async_graphql::{Object, Schema};

#[Object]
impl QueryRoot {
    async fn portfolio(&self) -> Portfolio {
        self.state.portfolio.get().clone()
    }
    
    async fn signal(&self, symbol: String) -> Option<TradingSignal> {
        self.state.signals.get(&symbol).cloned()
    }
    
    async fn trades(&self, limit: Option<i32>) -> Vec<TradeRecord> {
        let limit = limit.unwrap_or(10) as usize;
        self.state.trades.iter().take(limit).cloned().collect()
    }
}
```

## Frontend Integration

### GraphQL Client
```typescript
// lib/linera-client.ts
import { GraphQLClient } from 'graphql-request';

export class LineraClient {
    private client: GraphQLClient;
    
    constructor() {
        const endpoint = `${process.env.NEXT_PUBLIC_LINERA_ENDPOINT}/chains/${process.env.NEXT_PUBLIC_CHAIN_ID}/applications/${process.env.NEXT_PUBLIC_APP_ID}`;
        this.client = new GraphQLClient(endpoint);
    }
    
    async getPortfolio() {
        const query = `
            query {
                portfolio {
                    balance
                    totalValue
                    positions {
                        symbol
                        amount
                        entryPrice
                        currentPrice
                    }
                }
            }
        `;
        return this.client.request(query);
    }
    
    async executeTrade(symbol: string, side: 'BUY' | 'SELL', amount: number) {
        const mutation = `
            mutation ExecuteTrade($symbol: String!, $side: TradeSide!, $amount: Float!) {
                executeTrade(symbol: $symbol, side: $side, amount: $amount) {
                    id
                    symbol
                    side
                    amount
                    price
                    timestamp
                }
            }
        `;
        return this.client.request(mutation, { symbol, side, amount });
    }
}
```

### React Hook
```typescript
// hooks/useTrading.ts
import { useState, useEffect } from 'react';
import { lineraClient } from '@/lib/linera-client';

export function usePortfolio() {
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const data = await lineraClient.getPortfolio();
                setPortfolio(data.portfolio);
            } catch (error) {
                console.error('Portfolio fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchPortfolio();
        const interval = setInterval(fetchPortfolio, 5000);
        return () => clearInterval(interval);
    }, []);
    
    return { portfolio, loading };
}
```

## Deployment Script

### Build & Deploy
```bash
#!/bin/bash
# build.sh

# Build WebAssembly
cargo build --release --target wasm32-unknown-unknown

# Publish bytecode
BYTECODE_ID=$(linera publish-bytecode \
  target/wasm32-unknown-unknown/release/trading.wasm \
  target/wasm32-unknown-unknown/release/trading_contract.wasm)

# Create application
APP_ID=$(linera create-application $BYTECODE_ID)

# Start service
linera service --port 8080 &

echo "Trading app deployed: $APP_ID"
echo "GraphQL endpoint: http://localhost:8080/chains/$CHAIN_ID/applications/$APP_ID"
```

## Key Patterns dari Microcard

1. **Multi-Chain Architecture**: Setiap fungsi punya chain terpisah
2. **Cross-Chain Messaging**: Komunikasi antar chain via messages
3. **Event Streaming**: Real-time updates via event subscriptions
4. **GraphQL API**: Query dan mutation interface
5. **State Management**: Persistent state dengan RootView
6. **Permission System**: Chain ownership dan authorization

## Implementasi untuk AI Trading

1. **Portfolio Chain**: Manage balance dan positions
2. **Signal Chain**: Store dan validate AI signals  
3. **Execution Chain**: Execute trades berdasarkan signals
4. **Price Chain**: Real-time price feeds
5. **Risk Chain**: Risk management dan limits

Pola ini memungkinkan:
- ⚡ **Ultra-fast execution** (sub-second finality)
- 🔄 **Real-time updates** via event streams
- 📈 **Scalable architecture** (unlimited parallel chains)
- 🔒 **Secure validation** on-chain
- 🎯 **Modular design** (easy to extend)