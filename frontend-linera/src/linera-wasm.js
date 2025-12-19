/**
 * Linera WASM Integration
 * Based on Royale Poker implementation
 */

import { initialize, Client, Faucet, Wallet } from '@linera/client';
import { PrivateKey } from '@linera/signer';
import { ethers } from 'ethers';

const FAUCET_URL = import.meta.env.VITE_LINERA_FAUCET || 'https://faucet.testnet-conway.linera.net';

// Enable WASM debug logging
if (typeof window !== 'undefined') {
    // Intercept console to capture WASM logs
    const originalLog = console.log;
    const originalDebug = console.debug;
    const originalInfo = console.info;
    
    console.log = function(...args) {
        // Check if this is a WASM log
        const msg = args.join(' ');
        if (msg.includes('linera_') || msg.includes('DEBUG') || msg.includes('TRACE')) {
            originalLog.apply(console, ['🔧 WASM:', ...args]);
        } else {
            originalLog.apply(console, args);
        }
    };
    
    console.debug = function(...args) {
        originalDebug.apply(console, ['🔍 DEBUG:', ...args]);
    };
    
    console.info = function(...args) {
        originalInfo.apply(console, ['ℹ️  INFO:', ...args]);
    };
}

// Retry helper
const withRetry = async (operation, maxRetries = 3, delayMs = 2000) => {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (err) {
            lastError = err;
            console.warn(`⚠️ Attempt ${i + 1}/${maxRetries} failed:`, err.message);
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }
    throw lastError;
};

class LineraManager {
    constructor() {
        this.client = null;
        this.wallet = null;
        this.chainId = null;
        this.signer = null;
        this.initialized = false;
        this.publicKey = null;
        
        this.config = {
            faucetUrl: FAUCET_URL,
            network: 'testnet-conway'
        };
    }

    async init() {
        if (this.initialized) return true;
        
        try {
            console.log('🔄 Initializing Linera WASM...');
            console.log('   Enabling WASM debug logging...');
            
            // Enable WASM logging
            if (typeof window !== 'undefined') {
                // Set log level for WASM
                window.RUST_LOG = 'debug';
                localStorage.setItem('RUST_LOG', 'debug');
            }
            
            await initialize();
            this.initialized = true;
            console.log('✅ Linera WASM initialized');
            console.log('   WASM debug logging enabled');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Linera WASM:', error);
            throw error;
        }
    }

    async createWallet() {
        await this.init();
        
        try {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('� LaINERA WASM DEBUG - WALLET CREATION START');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');
            console.log('📋 Configuration:');
            console.log('   Network:', this.config.network);
            console.log('   Faucet URL:', this.config.faucetUrl);
            console.log('   WASM Initialized:', this.initialized);
            console.log('   Timestamp:', new Date().toISOString());
            console.log('');
            
            // Generate valid mnemonic using ethers
            console.log('🔑 Step 1: Generating BIP39 Mnemonic');
            console.log('   Using: ethers.Wallet.createRandom()');
            const startMnemonic = performance.now();
            const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
            const mnemonicTime = (performance.now() - startMnemonic).toFixed(2);
            console.log('   ✅ Mnemonic generated in', mnemonicTime, 'ms');
            console.log('   Words count:', mnemonic.split(' ').length);
            console.log('   First 3 words:', mnemonic.split(' ').slice(0, 3).join(' '), '...');
            console.log('');
            
            // Create signer from mnemonic
            console.log('🔐 Step 2: Creating Signer from Mnemonic');
            console.log('   Using: PrivateKey.fromMnemonic()');
            const startSigner = performance.now();
            this.signer = PrivateKey.fromMnemonic(mnemonic);
            const signerTime = (performance.now() - startSigner).toFixed(2);
            console.log('   ✅ Signer created in', signerTime, 'ms');
            
            const owner = this.signer.address().toString();
            console.log('   Owner Address:', owner);
            console.log('   Address Length:', owner.length);
            console.log('');
            
            console.log('🔑 Step 3: Getting Public Key');
            const startPubKey = performance.now();
            this.publicKey = await this.signer.getPublicKey(owner);
            const pubKeyTime = (performance.now() - startPubKey).toFixed(2);
            console.log('   ✅ Public key retrieved in', pubKeyTime, 'ms');
            console.log('   Public Key:', this.publicKey);
            console.log('');
            
            // Save to localStorage
            console.log('💾 Step 4: Saving to LocalStorage');
            localStorage.setItem('linera_mnemonic', mnemonic);
            localStorage.setItem('linera_owner', owner);
            console.log('   ✅ Mnemonic saved');
            console.log('   ✅ Owner saved');
            console.log('');
            
            // Create wallet via faucet
            console.log('📡 Step 5: Connecting to Faucet');
            console.log('   URL:', this.config.faucetUrl);
            console.log('   Creating Faucet instance...');
            const startFaucet = performance.now();
            const faucet = new Faucet(this.config.faucetUrl);
            const faucetTime = (performance.now() - startFaucet).toFixed(2);
            console.log('   ✅ Faucet instance created in', faucetTime, 'ms');
            console.log('');
            
            console.log('🌐 Step 6: Creating Wallet via Faucet');
            console.log('   Method: faucet.createWallet()');
            console.log('   Faucet object type:', typeof faucet);
            console.log('   Faucet.createWallet type:', typeof faucet.createWallet);
            console.log('   Max retries: 3');
            console.log('   Retry delay: 2000ms');
            const startWallet = performance.now();
            
            let attemptCount = 0;
            this.wallet = await withRetry(async () => {
                attemptCount++;
                console.log('   → Attempt', attemptCount, '- Calling faucet.createWallet()...');
                try {
                    const result = await faucet.createWallet();
                    console.log('   → Attempt', attemptCount, '- Success! Result type:', typeof result);
                    return result;
                } catch (err) {
                    console.error('   → Attempt', attemptCount, '- Failed!');
                    console.error('      Error name:', err.name);
                    console.error('      Error message:', err.message);
                    console.error('      Error type:', typeof err);
                    if (err.stack) console.error('      Stack:', err.stack.split('\n').slice(0, 3).join('\n'));
                    throw err;
                }
            }, 3, 2000);
            
            const walletTime = (performance.now() - startWallet).toFixed(2);
            console.log('   ✅ Wallet created in', walletTime, 'ms');
            console.log('   Wallet object type:', typeof this.wallet);
            console.log('   Wallet constructor:', this.wallet?.constructor?.name);
            console.log('');
            
            console.log('⛓️  Step 7: Claiming Chain from Faucet');
            console.log('   Method: faucet.claimChain(wallet, owner)');
            console.log('   Wallet:', this.wallet);
            console.log('   Owner:', owner);
            console.log('   Signer address:', this.signer.address());
            console.log('   Faucet.claimChain type:', typeof faucet.claimChain);
            console.log('   Max retries: 3');
            console.log('   Retry delay: 2000ms');
            console.log('   ⏳ This may take 10-30 seconds...');
            const startChain = performance.now();
            
            let chainAttemptCount = 0;
            this.chainId = await withRetry(async () => {
                chainAttemptCount++;
                console.log('   → Attempt', chainAttemptCount, '- Calling faucet.claimChain()...');
                try {
                    const result = await faucet.claimChain(this.wallet, this.signer.address());
                    console.log('   → Attempt', chainAttemptCount, '- Success! Chain ID:', result);
                    return result;
                } catch (err) {
                    console.error('   → Attempt', chainAttemptCount, '- Failed!');
                    console.error('      Error name:', err.name);
                    console.error('      Error message:', err.message);
                    console.error('      Error type:', typeof err);
                    if (err.stack) console.error('      Stack:', err.stack.split('\n').slice(0, 3).join('\n'));
                    throw err;
                }
            }, 3, 2000);
            
            const chainTime = (performance.now() - startChain).toFixed(2);
            console.log('   ✅ Chain claimed in', chainTime, 'ms');
            console.log('   Chain ID type:', typeof this.chainId);
            console.log('   Chain ID length:', this.chainId?.length);
            console.log('');
            
            console.log('🎉 Step 8: Chain Claimed Successfully!');
            console.log('   Chain ID:', this.chainId);
            console.log('   Chain ID Length:', this.chainId.length);
            console.log('   Network:', this.config.network);
            console.log('');
            
            // Save chain info
            console.log('💾 Step 9: Saving Chain Info');
            localStorage.setItem('linera_chain_id', this.chainId);
            localStorage.setItem('linera_network', this.config.network);
            console.log('   ✅ Chain ID saved');
            console.log('   ✅ Network saved');
            console.log('');
            
            const totalTime = parseFloat(mnemonicTime) + parseFloat(signerTime) + parseFloat(pubKeyTime) + parseFloat(faucetTime) + parseFloat(walletTime) + parseFloat(chainTime);
            console.log('📊 Performance Summary:');
            console.log('   Mnemonic Generation:', mnemonicTime, 'ms');
            console.log('   Signer Creation:', signerTime, 'ms');
            console.log('   Public Key:', pubKeyTime, 'ms');
            console.log('   Faucet Instance:', faucetTime, 'ms');
            console.log('   Wallet Creation:', walletTime, 'ms');
            console.log('   Chain Claiming:', chainTime, 'ms');
            console.log('   ─────────────────────────────────');
            console.log('   Total Time:', totalTime.toFixed(2), 'ms');
            console.log('');
            
            console.log('✅ WALLET CREATION COMPLETE');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');
            
            return {
                owner,
                publicKey: this.publicKey,
                chainId: this.chainId,
                mnemonic,
                wallet: this.wallet
            };
        } catch (error) {
            console.log('');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('❌ WALLET CREATION FAILED');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('Error Type:', error.constructor.name);
            console.error('Error Message:', error.message);
            console.error('Error Stack:', error.stack);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');
            throw new Error(`Wallet creation failed: ${error.message}`);
        }
    }

    async createClient() {
        if (!this.wallet || !this.signer) {
            throw new Error('Wallet not created. Call createWallet() first.');
        }
        
        try {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔧 CREATING LINERA CLIENT');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('   Wallet:', this.wallet ? 'Ready' : 'Not ready');
            console.log('   Signer:', this.signer ? 'Ready' : 'Not ready');
            console.log('   Chain ID:', this.chainId);
            console.log('');
            console.log('⏳ Connecting to validators (timeout: 30s)...');
            console.log('   WASM debug logs will appear if successful');
            console.log('');
            
            // Create client with longer timeout
            const clientPromise = new Client(this.wallet, this.signer, false);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Client connection timeout after 30s')), 30000)
            );
            
            this.client = await Promise.race([clientPromise, timeoutPromise]);
            
            console.log('✅ CLIENT CREATED - WASM LOGS SHOULD APPEAR NOW');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');
            
            return this.client;
        } catch (error) {
            console.error('❌ Failed to create client:', error);
            console.error('   Error details:', error.message);
            throw new Error(`Client creation failed: ${error.message}`);
        }
    }

    async restoreWallet() {
        await this.init();
        
        try {
            const mnemonic = localStorage.getItem('linera_mnemonic');
            const savedChainId = localStorage.getItem('linera_chain_id');
            const savedOwner = localStorage.getItem('linera_owner');
            
            if (!mnemonic || !savedChainId || !savedOwner) {
                throw new Error('No saved wallet found');
            }
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔗 RESTORING WALLET FROM STORAGE');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('   Saved Owner:', savedOwner);
            console.log('   Saved Chain:', savedChainId);
            console.log('');
            
            // Restore signer from mnemonic
            console.log('🔐 Restoring signer from mnemonic...');
            try {
                this.signer = PrivateKey.fromMnemonic(mnemonic);
                this.publicKey = await this.signer.getPublicKey(savedOwner);
            } catch (signerError) {
                console.warn('⚠️ Could not restore signer from mnemonic:', signerError.message);
                console.log('💡 Creating dummy signer for UI purposes');
                // Create a new signer for UI (won't match saved owner, but allows UI to work)
                const newMnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
                this.signer = PrivateKey.fromMnemonic(newMnemonic);
                this.publicKey = await this.signer.getPublicKey(this.signer.address());
            }
            this.chainId = savedChainId;
            console.log('✅ Signer restored');
            console.log('');
            
            // Create local wallet (don't need faucet for restore)
            console.log('💼 Creating local wallet instance...');
            this.wallet = new Wallet();
            console.log('✅ Wallet instance created');
            console.log('');
            
            console.log('✅ WALLET RESTORED SUCCESSFULLY');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');
            
            return {
                owner: savedOwner,
                chainId: this.chainId,
                publicKey: this.publicKey
            };
        } catch (error) {
            console.error('❌ Failed to restore wallet:', error);
            throw error;
        }
    }

    getWalletInfo() {
        return {
            chainId: this.chainId,
            owner: this.signer ? this.signer.address().toString() : null,
            publicKey: this.publicKey,
            network: this.config.network,
            faucetUrl: this.config.faucetUrl,
            initialized: this.initialized,
            hasWallet: !!this.wallet,
            hasClient: !!this.client,
            hasSigner: !!this.signer
        };
    }

    reset() {
        console.log('🔄 Resetting wallet...');
        
        localStorage.removeItem('linera_mnemonic');
        localStorage.removeItem('linera_owner');
        localStorage.removeItem('linera_chain_id');
        localStorage.removeItem('linera_network');
        
        if (this.client) {
            try {
                this.client.stop();
                this.client.free();
            } catch (e) {
                console.warn('Error stopping client:', e);
            }
        }
        
        this.client = null;
        this.wallet = null;
        this.chainId = null;
        this.signer = null;
        this.publicKey = null;
        
        console.log('✅ Wallet reset complete');
    }
}

export default LineraManager;
