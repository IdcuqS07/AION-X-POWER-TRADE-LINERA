/**
 * Linera WASM Client Wrapper for AI POWER TRADE
 * Provides simplified interface to Linera blockchain via WASM
 */

class LineraWasmClient {
    constructor() {
        this.client = null;
        this.wallet = null;
        this.chainId = null;
        this.signer = null;
        this.application = null;
        this.initialized = false;
        this.loading = false;
        
        // Configuration
        this.config = {
            faucetUrl: 'https://faucet.devnet.linera.io',
            serviceUrl: 'http://152.42.199.50:8080',
            applicationId: null,
        };
    }

    async init() {
        if (this.initialized) return true;
        if (this.loading) return false;
        
        this.loading = true;
        
        try {
            console.log('🔄 Initializing Linera WASM...');
            
            if (typeof window.linera === 'undefined') {
                throw new Error('Linera WASM module not loaded');
            }
            
            await window.linera.default();
            
            console.log('✅ Linera WASM initialized');
            this.initialized = true;
            this.loading = false;
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Linera WASM:', error);
            this.loading = false;
            throw error;
        }
    }

    async createWallet(mnemonic = null) {
        await this.init();
        
        try {
            console.log('🔐 Creating Linera wallet...');
            
            let walletMnemonic = mnemonic || localStorage.getItem('linera_mnemonic');
            if (!walletMnemonic) {
                walletMnemonic = this.generateMnemonic();
                localStorage.setItem('linera_mnemonic', walletMnemonic);
            }
            
            this.signer = window.linera.PrivateKey.fromMnemonic(walletMnemonic);
            const owner = this.signer.address();
            
            const faucet = new window.linera.Faucet(this.config.faucetUrl);
            this.wallet = await faucet.createWallet();
            
            console.log('✅ Wallet created, owner:', owner);
            
            return { mnemonic: walletMnemonic, owner, wallet: this.wallet };
        } catch (error) {
            console.error('❌ Failed to create wallet:', error);
            throw error;
        }
    }

    async claimChain() {
        if (!this.wallet || !this.signer) {
            throw new Error('Wallet not created');
        }
        
        try {
            console.log('⛓️ Claiming chain...');
            
            const faucet = new window.linera.Faucet(this.config.faucetUrl);
            const owner = this.signer.address();
            
            this.chainId = await faucet.claimChain(this.wallet, owner);
            localStorage.setItem('linera_chain_id', this.chainId);
            
            console.log('✅ Chain claimed:', this.chainId);
            return this.chainId;
        } catch (error) {
            console.error('❌ Failed to claim chain:', error);
            throw error;
        }
    }

    async createClient() {
        if (!this.wallet || !this.signer) {
            throw new Error('Wallet not created');
        }
        
        try {
            this.client = await new window.linera.Client(this.wallet, this.signer, false);
            console.log('✅ Client created');
            return this.client;
        } catch (error) {
            console.error('❌ Failed to create client:', error);
            throw error;
        }
    }

    async getApplication(applicationId) {
        if (!this.client) await this.createClient();
        
        try {
            const frontend = this.client.frontend();
            this.application = await frontend.application(applicationId);
            console.log('✅ Application loaded');
            return this.application;
        } catch (error) {
            console.error('❌ Failed to get application:', error);
            throw error;
        }
    }

    async query(queryString, variables = {}) {
        if (!this.application) throw new Error('Application not loaded');
        return await this.application.query(queryString, variables);
    }

    async mutate(mutationString, variables = {}) {
        if (!this.application) throw new Error('Application not loaded');
        return await this.application.mutate(mutationString, variables);
    }

    generateMnemonic() {
        const words = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident'];
        return Array.from({length: 12}, () => words[Math.floor(Math.random() * words.length)]).join(' ');
    }

    getWalletInfo() {
        return {
            chainId: this.chainId,
            owner: this.signer ? this.signer.address() : null,
            initialized: this.initialized,
            hasWallet: !!this.wallet,
            hasClient: !!this.client
        };
    }

    reset() {
        localStorage.removeItem('linera_mnemonic');
        localStorage.removeItem('linera_chain_id');
        this.client = null;
        this.wallet = null;
        this.chainId = null;
        this.signer = null;
        this.application = null;
        console.log('🔄 Wallet reset');
    }
}

window.LineraWasmClient = LineraWasmClient;
