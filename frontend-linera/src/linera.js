/**
 * Linera Integration Module
 * Handles wallet creation, chain claiming, and client management
 * Updated for Testnet Conway
 */

import { initialize, Client, Faucet, Wallet } from '@linera/client';
import { PrivateKey } from '@linera/signer';

class LineraManager {
    constructor() {
        this.client = null;
        this.wallet = null;
        this.chainId = null;
        this.signer = null;
        this.initialized = false;
        this.publicKey = null;
        
        this.config = {
            faucetUrl: 'https://faucet.testnet-conway.linera.net',
            applicationId: null,
            network: 'testnet-conway'
        };
    }

    /**
     * Initialize Linera WASM
     */
    async init() {
        if (this.initialized) return true;
        
        try {
            console.log('🔄 Initializing Linera WASM...');
            await initialize();
            this.initialized = true;
            console.log('✅ Linera WASM initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Linera WASM:', error);
            throw error;
        }
    }

    /**
     * Create new wallet and claim chain in one step
     */
    async createWallet() {
        await this.init();
        
        try {
            console.log('🔐 Creating Linera wallet for Testnet Conway...');
            console.log('📡 Faucet URL:', this.config.faucetUrl);
            
            // Get or generate private key
            let privateKey = localStorage.getItem('linera_private_key');
            if (!privateKey) {
                privateKey = this.generatePrivateKey();
                localStorage.setItem('linera_private_key', privateKey);
                console.log('🔑 New private key generated and saved');
            } else {
                console.log('🔑 Using existing private key from storage');
            }
            
            // Create signer from private key
            this.signer = new PrivateKey(privateKey);
            const owner = this.signer.address();
            this.publicKey = await this.signer.getPublicKey(owner);
            
            console.log('✅ Signer created');
            console.log('   Public Key:', this.publicKey);
            console.log('   Owner Address:', owner);
            
            // Create wallet - using local mode for now
            // TODO: Faucet integration needs proper setup with testnet
            console.log('💡 Creating local wallet (development mode)');
            console.log('   Note: For production, connect to faucet:', this.config.faucetUrl);
            
            // Create local wallet
            this.wallet = new Wallet();
            this.chainId = this.generateRandomHex(64);
            
            localStorage.setItem('linera_chain_id', this.chainId);
            localStorage.setItem('linera_network', 'local-dev');
            
            console.log('✅ Local wallet created');
            console.log('   Chain ID:', this.chainId);
            console.log('   Owner:', owner);
            console.log('   Mode: Local Development');
            console.log('');
            console.log('ℹ️  To use real testnet:');
            console.log('   1. Ensure faucet is accessible');
            console.log('   2. Update createWallet() to use Faucet API');
            console.log('   3. URL:', this.config.faucetUrl);
            
            return {
                owner,
                publicKey: this.publicKey,
                chainId: this.chainId,
                wallet: this.wallet
            };
        } catch (error) {
            console.error('❌ Failed to create wallet:', error);
            console.error('   Error details:', error.message);
            throw new Error(`Wallet creation failed: ${error.message}`);
        }
    }

    /**
     * Claim additional chain from faucet
     */
    async claimChain() {
        if (!this.wallet || !this.signer) {
            throw new Error('Wallet not created. Call createWallet() first.');
        }
        
        try {
            console.log('⛓️ Claiming additional chain...');
            
            const faucet = new Faucet(this.config.faucetUrl);
            const owner = this.signer.address();
            
            const newChainId = await faucet.claimChain(this.wallet, owner);
            
            console.log('✅ Additional chain claimed:', newChainId);
            
            return newChainId;
        } catch (error) {
            console.error('❌ Failed to claim chain:', error);
            throw error;
        }
    }

    /**
     * Create Linera client
     */
    async createClient() {
        if (!this.wallet || !this.signer) {
            throw new Error('Wallet not created. Call createWallet() first.');
        }
        
        try {
            console.log('🔧 Creating Linera client...');
            console.log('   Wallet:', this.wallet ? 'Ready' : 'Not ready');
            console.log('   Signer:', this.signer ? 'Ready' : 'Not ready');
            
            this.client = new Client(this.wallet, this.signer, false);
            
            console.log('✅ Client created successfully');
            console.log('   Chain ID:', this.chainId);
            console.log('   Network:', this.config.network);
            
            return this.client;
        } catch (error) {
            console.error('❌ Failed to create client:', error);
            console.error('   Error details:', error.message);
            throw new Error(`Client creation failed: ${error.message}`);
        }
    }

    /**
     * Get application instance
     */
    async getApplication(applicationId) {
        if (!this.client) {
            await this.createClient();
        }
        
        try {
            const frontend = this.client.frontend();
            const application = await frontend.application(applicationId);
            console.log('✅ Application loaded');
            return application;
        } catch (error) {
            console.error('❌ Failed to get application:', error);
            throw error;
        }
    }

    /**
     * Get wallet info
     */
    getWalletInfo() {
        return {
            chainId: this.chainId,
            owner: this.signer ? this.signer.address() : null,
            publicKey: this.publicKey,
            network: this.config.network,
            faucetUrl: this.config.faucetUrl,
            initialized: this.initialized,
            hasWallet: !!this.wallet,
            hasClient: !!this.client,
            hasSigner: !!this.signer
        };
    }

    /**
     * Generate random private key (32 bytes hex)
     */
    generatePrivateKey() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return '0x' + Array.from(array)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    /**
     * Generate random hex string
     */
    generateRandomHex(length) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Reset wallet
     */
    reset() {
        console.log('🔄 Resetting wallet...');
        
        localStorage.removeItem('linera_private_key');
        localStorage.removeItem('linera_chain_id');
        localStorage.removeItem('linera_network');
        
        this.client = null;
        this.wallet = null;
        this.chainId = null;
        this.signer = null;
        this.publicKey = null;
        
        console.log('✅ Wallet reset complete');
    }
    
    /**
     * Get network info
     */
    getNetworkInfo() {
        return {
            network: this.config.network,
            faucetUrl: this.config.faucetUrl,
            connected: !!this.client,
            chainId: this.chainId
        };
    }
}

export default LineraManager;
 m