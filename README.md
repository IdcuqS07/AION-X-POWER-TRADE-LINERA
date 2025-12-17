# AI POWER TRADE on Linera

A decentralized AI-powered trading platform built on the Linera blockchain platform. Execute trades across multiple microchains with AI-generated signals, real-time portfolio management, and cross-application token management.

## Quick Start

### 1. Start Local Linera Network
```bash
./start-local.sh
```

### 2. Build Applications
```bash
./build.sh
```

### 3. Deploy to Network
```bash
./deploy.sh
```

### 4. Open Trading Interface
```bash
open linera-ai-trading.html
```

## Architecture

### Multi-Chain Design

1. **Master Chain**: Administrative operations
2. **User Chains**: Individual trader state  
3. **AI Chains**: Signal generation
4. **Market Chains**: Price feeds

### Applications

- **Trading App**: AI signals, trade execution, portfolio management
- **Wallet App**: Balance management, cross-chain transfers

## Features

- **AI-Powered Signals**: Automated trading recommendations
- **Multi-Chain Portfolio**: Distributed portfolio management
- **Real-Time Trading**: Cross-chain trade execution
- **Risk Management**: Built-in risk metrics and controls
- **GraphQL Integration**: Real blockchain connectivity

## Development

The platform automatically falls back to simulation mode if Linera network is unavailable.

Built with ❤️ on [Linera](https://linera.io)