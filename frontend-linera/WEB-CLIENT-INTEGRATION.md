# 🌐 Linera Web Client Integration Guide

## Overview

This guide explains how to integrate Linera blockchain into a web application using the official `@linera/client` and `@linera/signer` packages.

## Architecture

```
┌─────────────────────────────────────────┐
│         Web Application (Browser)       │
├─────────────────────────────────────────┤
│  @linera/client (WASM)                  │
│  ├── Client                             │
│  ├── Faucet                             │
│  └── Wallet                             │
├─────────────────────────────────────────┤
│  @linera/signer                         │
│  └── PrivateKey (EIP-191)               │
├─────────────────────────────────────────┤
│  Testnet Conway Faucet                  │
│  https://faucet.testnet-conway.linera.net│
└─────────────────────────────────────────┘
```

## Installation

```bash
npm install @linera/client @linera/signer
```

## Core Concepts

### 1. Initialize WASM

Before using any Linera functionality, initialize the WASM module:

```javascript
import initialize from '@linera/client';

await initialize();
```

### 2. Create Signer

The signer manages private keys and signs transactions:

```javascript
import { PrivateKey } from '@linera/signer';

// From mnemonic (12 words)
const mnemonic = "word1 word2 word3 ...";
const signer = PrivateKey.fromMnemonic(mnemonic);

// Get owner address
const owner = signer.address();

// Get public key
const publicKey = await signer.getPublicKey(owner);
```

### 3. Create Wallet via Faucet

The faucet provides test tokens and creates wallets:

```javascript
import { Faucet } from '@linera/client';

const faucet = new Faucet('https://faucet.testnet-conway.linera.net');
const wallet = await faucet.createWallet();
```

### 4. Claim Chain

Request a new chain from the faucet:

```javascript
const chainId = await faucet.claimChain(wallet, owner);
console.log('Chain ID:', chainId);
```

### 5. Create Client

The client interacts with the blockchain:

```javascript
import { Client } from '@linera/client';

const client = new Client(wallet, signer, false);
```

### 6. Interact with Applications

```javascript
const frontend = client.frontend();
const app = await frontend.application(applicationId);

// Query application
const result = await app.query(queryString);

// Execute mutation
const txHash = await app.mutate(mutationString);
```

## Complete Integration Example

```javascript
import initialize, { Client, Faucet, Wallet } from '@linera/client';
import { PrivateKey } from '@linera/signer';

class LineraManager {
    constructor() {
        this.client = null;
        this.wallet = null;
        this.chainId = null;
        this.signer = null;
        this.initialized = false;
        
        this.config = {
            faucetUrl: 'https://faucet.testnet-conway.linera.net',
            network: 'testnet-conway'
        };
    }

    async init() {
        if (this.initialized) return;
        
        console.log('Initializing Linera WASM...');
        await initialize();
        this.initialized = true;
        console.log('WASM initialized');
    }

    async createWallet(mnemonic = null) {
        await this.init();
        
        // Generate or use existing mnemonic
        const walletMnemonic = mnemonic || this.generateMnemonic();
        
        // Create signer
        this.signer = PrivateKey.fromMnemonic(walletMnemonic);
        const owner = this.signer.address();
        
        // Create wallet via faucet
        const faucet = new Faucet(this.config.faucetUrl);
        this.wallet = await faucet.createWallet();
        
        console.log('Wallet created for owner:', owner);
        
        return { mnemonic: walletMnemonic, owner };
    }

    async claimChain() {
        if (!this.wallet || !this.signer) {
            throw new Error('Create wallet first');
        }
        
        const faucet = new Faucet(this.config.faucetUrl);
        const owner = this.signer.address();
        
        this.chainId = await faucet.claimChain(this.wallet, owner);
        console.log('Chain claimed:', this.chainId);
        
        return this.chainId;
    }

    async createClient() {
        if (!this.wallet || !this.signer) {
            throw new Error('Create wallet first');
        }
        
        this.client = new Client(this.wallet, this.signer, false);
        console.log('Client created');
        
        return this.client;
    }

    generateMnemonic() {
        // Simple mnemonic generator for demo
        const words = [
            'abandon', 'ability', 'able', 'about', 'above', 'absent',
            'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident'
        ];
        return Array.from({ length: 12 }, () => 
            words[Math.floor(Math.random() * words.length)]
        ).join(' ');
    }
}

// Usage
const manager = new LineraManager();

// Create wallet
const { mnemonic, owner } = await manager.createWallet();
console.log('Mnemonic:', mnemonic);
console.log('Owner:', owner);

// Claim chain
const chainId = await manager.claimChain();
console.log('Chain ID:', chainId);

// Create client
const client = await manager.createClient();
console.log('Ready to interact with blockchain');
```

## Vite Configuration

For proper WASM loading, configure Vite with CORS headers:

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp'
        }
    },
    optimizeDeps: {
        exclude: ['@linera/client']
    }
});
```

## Browser Requirements

- Modern browser with WebAssembly support
- SharedArrayBuffer support
- ES6 modules support

## Security Considerations

### ⚠️ Development Only

The `PrivateKey` signer stores keys in memory and is **NOT secure for production**:

```javascript
// ❌ DO NOT use in production
const signer = PrivateKey.fromMnemonic(mnemonic);
```

### ✅ Production Recommendations

For production, use:
- Hardware wallets
- Browser extension wallets (MetaMask)
- Secure key management services

Example with MetaMask:

```javascript
import { MetaMaskSigner } from '@linera/signer';

const signer = new MetaMaskSigner();
await signer.connect();
```

## Testnet Conway Specifics

### Faucet URL
```
https://faucet.testnet-conway.linera.net
```

### Network Info
- Protocol Version: v0.15.7
- Network: testnet-conway
- Rate Limits: May have delays during high usage

### Getting Test Tokens

1. Create wallet via faucet
2. Request chain (includes initial tokens)
3. Additional tokens: Request new chain

## Common Issues

### Issue: WASM Loading Failed

**Cause:** Missing CORS headers

**Solution:**
```javascript
// vite.config.js
server: {
    headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
    }
}
```

### Issue: Module Import Error

**Cause:** Incorrect import syntax

**Solution:**
```javascript
// ✅ Correct
import initialize, { Client, Faucet } from '@linera/client';
import { PrivateKey } from '@linera/signer';

// ❌ Wrong
import init from '@linera/client'; // No default export named 'init'
```

### Issue: Faucet Timeout

**Cause:** Network congestion or rate limiting

**Solution:**
- Wait 30-60 seconds
- Retry request
- Check network connectivity

### Issue: Invalid Owner Address

**Cause:** Owner address mismatch

**Solution:**
```javascript
const owner = signer.address();
const publicKey = await signer.getPublicKey(owner); // Use same owner
```

## API Reference

### initialize()
```javascript
await initialize();
```
Initializes the Linera WASM module. Must be called before any other operations.

### PrivateKey
```javascript
// From mnemonic
const signer = PrivateKey.fromMnemonic(mnemonic);

// Get address
const address = signer.address();

// Get public key
const publicKey = await signer.getPublicKey(address);

// Sign message
const signature = await signer.sign(owner, message);
```

### Faucet
```javascript
const faucet = new Faucet(url);

// Create wallet
const wallet = await faucet.createWallet();

// Claim chain
const chainId = await faucet.claimChain(wallet, owner);
```

### Client
```javascript
const client = new Client(wallet, signer, isTestMode);

// Get frontend
const frontend = client.frontend();

// Get application
const app = await frontend.application(appId);
```

## Testing

### Unit Tests
```javascript
import { describe, it, expect } from 'vitest';

describe('LineraManager', () => {
    it('should initialize WASM', async () => {
        const manager = new LineraManager();
        await manager.init();
        expect(manager.initialized).toBe(true);
    });
    
    it('should create wallet', async () => {
        const manager = new LineraManager();
        const { owner } = await manager.createWallet();
        expect(owner).toBeDefined();
    });
});
```

### Integration Tests
```javascript
it('should complete full flow', async () => {
    const manager = new LineraManager();
    
    // Create wallet
    const { owner } = await manager.createWallet();
    expect(owner).toBeDefined();
    
    // Claim chain
    const chainId = await manager.claimChain();
    expect(chainId).toBeDefined();
    
    // Create client
    const client = await manager.createClient();
    expect(client).toBeDefined();
});
```

## Resources

- **Linera Docs**: https://linera.dev/
- **@linera/client**: https://www.npmjs.com/package/@linera/client
- **@linera/signer**: https://www.npmjs.com/package/@linera/signer
- **Testnet Conway**: https://faucet.testnet-conway.linera.net

## Next Steps

1. ✅ Initialize WASM
2. ✅ Create wallet with signer
3. ✅ Claim chain from faucet
4. ✅ Create client
5. ✅ Deploy your application
6. ✅ Interact with blockchain

---

**Ready to build on Linera!** 🚀
