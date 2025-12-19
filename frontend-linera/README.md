# 🚀 AI POWER TRADE - Linera Edition

AI-powered trading platform built on Linera blockchain with full WASM integration.

## 🌐 Live Demo

**Production URL**: http://152.42.199.50/

## ✨ Features

### Current Implementation
- ✅ **Linera Wallet Integration** - Browser-based wallet creation
- ✅ **Testnet Conway Connection** - Real blockchain integration
- ✅ **WASM Client** - Full Linera WASM client integration
- ✅ **Chain Management** - Create, save, and restore chains
- ✅ **Modern UI** - Alethea Network-style wallet dropdown
- ✅ **Copy to Clipboard** - Easy Chain ID & Owner address copying
- ✅ **AI Trading Signals** - Mock trading signals for demo
- ✅ **Trading History** - Track trading activities

### Tech Stack
- **Frontend**: Vite + Vanilla JavaScript
- **Blockchain**: Linera Protocol (Testnet Conway)
- **WASM**: @linera/client v0.15.8
- **Wallet**: @linera/signer v0.15.6
- **Crypto**: ethers.js v6.16.0

## 🎯 Linera Integration Roadmap

### Phase 1: Wallet Integration ✅ **COMPLETED**
- [x] Create wallet in browser
- [x] Claim chain from faucet
- [x] Save/restore wallet from localStorage
- [x] UI for connect/disconnect
- [x] Copy Chain ID & Owner address
- [x] WASM client initialization

**Status**: Fully functional wallet integration with Linera Testnet Conway

### Phase 2: Smart Contract ⏳ **IN PROGRESS**
- [ ] Build Rust smart contract for trading
- [ ] Compile contract to WASM bytecode
- [ ] Deploy contract to Testnet Conway
- [ ] Obtain Application ID
- [ ] Test contract functions

**Next Steps**: 
```bash
# Create trading contract
cd trading-contract
linera build

# Publish bytecode
linera publish-bytecode target/wasm32-unknown-unknown/release/trading.wasm

# Create application
linera create-application <bytecode-id>
```

### Phase 3: GraphQL Integration ⏳ **PLANNED**
- [ ] Setup GraphQL service for application
- [ ] Deploy GraphQL service to VPS
- [ ] Connect frontend to GraphQL endpoint
- [ ] Implement queries for reading data
- [ ] Implement mutations for writing data

**Architecture**:
```
Frontend (Browser) 
    ↓ GraphQL Query/Mutation
GraphQL Service (VPS:8080)
    ↓ Read/Write
Linera Blockchain (Testnet Conway)
```

### Phase 4: Full Features ⏳ **PLANNED**
- [ ] Create trading signals on-chain
- [ ] Execute trades on-chain
- [ ] Query trading history from blockchain
- [ ] Real-time updates via GraphQL subscriptions
- [ ] Multi-chain support
- [ ] Advanced trading strategies

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Linera CLI (for smart contract development)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build optimized bundle
npm run build

# Output: dist/
```

### Deploy to VPS

```bash
# Deploy to production server
bash deploy-production.sh

# Manual deployment
cd dist
tar -czf ../ai-power-trade.tar.gz .
scp ai-power-trade.tar.gz root@152.42.199.50:/tmp/
ssh root@152.42.199.50 "tar -xzf /tmp/ai-power-trade.tar.gz -C /var/www/ai-power-trade/current"
```

## 📁 Project Structure

```
frontend-linera/
├── src/
│   ├── main.js              # App initialization & wallet flow
│   ├── linera-wasm.js       # Linera WASM integration
│   ├── trading.js           # Trading signals logic
│   └── style.css            # UI styling
├── dist/                    # Production build
├── index.html               # Main HTML
├── vite.config.js           # Vite configuration (WASM support)
├── package.json             # Dependencies
└── deploy-production.sh     # Deployment script
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```env
VITE_LINERA_FAUCET=https://faucet.testnet-conway.linera.net
VITE_GRAPHQL_ENDPOINT=http://localhost:8080/graphql
```

### Vite Config (WASM Support)

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [wasm(), topLevelAwait()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
});
```

## 🌐 Linera Integration Details

### Wallet Creation Flow

1. **Generate Mnemonic** - BIP39 compliant 12-word phrase
2. **Create Signer** - Using @linera/signer
3. **Claim Chain** - Request chain from Testnet Conway faucet
4. **Save Wallet** - Store in browser localStorage
5. **Create Client** - Initialize WASM client for blockchain interaction

### Current Limitations

- **Client Timeout**: New chains need time to propagate to validators (~30s)
- **No Smart Contract**: Trading logic is mock data (Phase 2 in progress)
- **No GraphQL**: Direct blockchain queries not yet implemented (Phase 3 planned)

### Workarounds

- Wallet creation works perfectly
- Chain ID is real and valid
- UI fully functional for demo purposes
- Trading signals use mock data temporarily

## 📊 Performance

- **Build Time**: ~750ms
- **Bundle Size**: ~3.9MB (includes WASM)
- **Wallet Creation**: ~3-5 seconds
  - Mnemonic: ~80ms
  - Signer: ~15ms
  - Faucet: ~900ms
  - Chain Claim: ~2-3s

## 🔐 Security

- Private keys never leave the browser
- Mnemonic stored in localStorage (encrypted in production)
- CORS headers properly configured for WASM
- No server-side key storage

## 🐛 Known Issues

1. **Client Connection Timeout** - New chains take time to sync
   - **Solution**: Use existing chain or wait 30-60s
   
2. **WASM Debug Logs** - Only appear after successful client connection
   - **Solution**: Enable via `window.RUST_LOG = 'debug'`

3. **Browser Cache** - May show old version
   - **Solution**: Hard refresh (Ctrl+Shift+R)

## 📝 API Reference

### LineraManager Class

```javascript
const lineraManager = new LineraManager();

// Initialize WASM
await lineraManager.init();

// Create new wallet
const wallet = await lineraManager.createWallet();
// Returns: { owner, publicKey, chainId, mnemonic, wallet }

// Restore wallet
const restored = await lineraManager.restoreWallet();

// Get wallet info
const info = lineraManager.getWalletInfo();
// Returns: { chainId, owner, publicKey, network, ... }

// Reset wallet
lineraManager.reset();
```

## 🤝 Contributing

This is a hackathon project for Linera blockchain integration.

## 📄 License

MIT

## 🔗 Links

- **Live Demo**: http://152.42.199.50/
- **Linera Docs**: https://linera.dev
- **Testnet Faucet**: https://faucet.testnet-conway.linera.net
- **Linera Discord**: https://discord.gg/linera

## 👥 Team

Built for Linera Hackathon 2025

---

**Note**: This project demonstrates Linera blockchain integration with a focus on wallet management and WASM client integration. Smart contract and GraphQL integration are planned for future phases.
