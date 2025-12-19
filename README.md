# 🚀 AI Power Trade - Linera Blockchain

AI-powered trading platform built on Linera blockchain with smart contract integration.

## 🎯 Overview

AI Power Trade is a decentralized trading platform that combines artificial intelligence with blockchain technology to provide automated trading signals and execution on the Linera network.

## ✨ Features

- 🤖 **AI Trading Signals** - Machine learning-powered buy/sell/hold recommendations
- 💼 **Smart Contract Integration** - On-chain signal generation and trade execution
- 💰 **Portfolio Management** - Real-time portfolio tracking and P&L calculation
- 📊 **Live Market Data** - Real-time price feeds from Binance API
- 🔗 **Multi-Platform Support** - Connect to various DeFi platforms
- 🌐 **Linera Blockchain** - Built on Linera's high-performance blockchain

## 🏗️ Architecture

### Smart Contract (Rust)
- **Location**: `linera-protocol/examples/ai-trading/`
- **Network**: Linera Testnet Conway
- **Application ID**: `5ac79e62627dd2fb380176f93e701d91fe6fc01e5a25b56801ace1de13399c0d`

### Frontend (JavaScript/Vite)
- **Location**: `frontend-linera/`
- **Live URL**: http://152.42.199.50/
- **Framework**: Vite + Vanilla JS
- **Integration**: Linera WASM + GraphQL

## 🚀 Quick Start

### Prerequisites
- Rust 1.82.0+
- Node.js 18+
- Linera CLI v0.15.6+

### 1. Deploy Smart Contract

```bash
# Build and deploy contract
bash deploy-ai-trading.sh
```

### 2. Start GraphQL Service

```bash
# Start Linera GraphQL service
bash start-graphql-service.sh
```

### 3. Test Contract

```bash
# Run contract tests
bash test-ai-trading.sh
```

### 4. Deploy Frontend

```bash
# Build and deploy frontend
bash deploy-frontend-integrated.sh
```

## 📋 Smart Contract Operations

### Generate AI Signal
```graphql
mutation {
  executeOperation(
    chainId: "5ac79e62627dd2fb380176f93e701d91fe6fc01e5a25b56801ace1de13399c0d",
    operation: { GenerateSignal: { coin: "BTC" } }
  )
}
```

### Execute Trade
```graphql
mutation {
  executeOperation(
    chainId: "5ac79e62627dd2fb380176f93e701d91fe6fc01e5a25b56801ace1de13399c0d",
    operation: { ExecuteTrade: { coin: "BTC", amount: 1000 } }
  )
}
```

### Query Signals
```graphql
query {
  applications(chainId: "5ac79e62627dd2fb380176f93e701d91fe6fc01e5a25b56801ace1de13399c0d") {
    entry {
      signals {
        coin
        action
        confidence
      }
    }
  }
}
```

## 🔧 Development

### Project Structure
```
.
├── linera-protocol/examples/ai-trading/  # Smart contract
│   ├── src/
│   │   ├── lib.rs          # ABI definitions
│   │   ├── contract.rs     # Contract logic
│   │   ├── service.rs      # GraphQL service
│   │   └── state.rs        # State management
│   └── Cargo.toml
├── frontend-linera/                      # Frontend
│   ├── src/
│   │   ├── main.js                  # Main app
│   │   ├── ai-trading-contract.js   # Contract API
│   │   ├── contract-integration.js  # Fallback handler
│   │   ├── linera-wasm.js          # Linera WASM
│   │   ├── market.js               # Market data
│   │   └── platform.js             # Platform manager
│   ├── index.html
│   └── package.json
├── deploy-ai-trading.sh              # Deploy contract
├── deploy-frontend-integrated.sh     # Deploy frontend
├── start-graphql-service.sh          # Start GraphQL
└── test-ai-trading.sh                # Test contract
```

### Build Contract
```bash
cd linera-protocol/examples
cargo build --release --target wasm32-unknown-unknown -p ai-trading
```

### Run Frontend Locally
```bash
cd frontend-linera
npm install
npm run dev
```

## 📚 Documentation

- [Integration Guide](INTEGRATION-COMPLETE.md) - Complete integration documentation
- [Deployment Guide](DEPLOYMENT-SUCCESS.md) - Deployment instructions
- [Quick Commands](QUICK-COMMANDS.txt) - Command reference

## 🌐 Live Demo

- **Frontend**: http://152.42.199.50/
- **Network**: Linera Testnet Conway
- **Faucet**: https://faucet.testnet-conway.linera.net

## 🔐 Security

- Smart contract audited and tested
- No private keys stored in frontend
- Wallet data encrypted in localStorage
- All transactions signed client-side

## 📊 Contract Features

### Operations
- `GenerateSignal` - Generate AI trading signal for a coin
- `ExecuteTrade` - Execute trade based on signal
- `IncrementTrades` - Increment trade counter

### Queries
- `trade_count` - Get total number of trades
- `signals` - Get all AI signals
- `trades` - Get all executed trades

### State
- Trade counter (u64)
- Signals map (String → Signal)
- Trades map (u64 → Trade)

## 🤝 Contributing

This is a hackathon project. For questions or issues, please open an issue on GitHub.

## 📄 License

MIT License - see LICENSE file for details

## 🏆 Hackathon

Built for Linera Blockchain Hackathon 2025

## 📞 Contact

- GitHub: [@IdcuqS07](https://github.com/IdcuqS07)
- Project: [AION-X-POWER-TRADE-LINERA](https://github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA)

---

**Status**: ✅ Deployed and Live  
**Last Updated**: 2025-12-19  
**Version**: 1.0.0
