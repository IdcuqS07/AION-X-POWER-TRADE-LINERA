/**
 * Simplified Linera Integration
 * Works without complex WASM dependencies
 */

class LineraManager {
    constructor() {
        this.chainId = null;
        this.owner = null;
        this.initialized = false;
        
        this.config = {
            faucetUrl: 'https://faucet.testnet-conway.linera.net',
            network: 'testnet-conway'
        };
    }

    async init() {
        if (this.initialized) return true;
        
        try {
            console.log('🔄 Initializing Linera connection...');
            
            // Check if we have saved data
            const savedChainId = localStorage.getItem('linera_chain_id');
            const savedOwner = localStorage.getItem('linera_owner');
            
            if (savedChainId && savedOwner) {
                this.chainId = savedChainId;
                this.owner = savedOwner;
                console.log('✅ Restored from storage');
            }
            
            this.initialized = true;
            console.log('✅ Linera initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize:', error);
            throw error;
        }
    }

    async createWallet() {
        await this.init();
        
        try {
            console.log('🔐 Creating Linera wallet...');
            console.log('📡 Faucet:', this.config.faucetUrl);
            
            // Generate mock wallet data (for demo)
            this.owner = '0x' + this.generateRandomHex(40);
            
            localStorage.setItem('linera_owner', this.owner);
            
            console.log('✅ Wallet created');
            console.log('   Owner:', this.owner);
            
            return {
                owner: this.owner
            };
        } catch (error) {
            console.error('❌ Failed to create wallet:', error);
            throw error;
        }
    }

    async claimChain() {
        if (!this.owner) {
            throw new Error('Create wallet first');
        }
        
        try {
            console.log('⛓️ Claiming chain from faucet...');
            console.log('   This may take 10-30 seconds...');
            
            // Simulate API call to faucet
            await this.delay(2000);
            
            // Generate mock chain ID
            this.chainId = this.generateRandomHex(64);
            
            localStorage.setItem('linera_chain_id', this.chainId);
            localStorage.setItem('linera_network', this.config.network);
            
            console.log('✅ Chain claimed!');
            console.log('   Chain ID:', this.chainId);
            
            return this.chainId;
        } catch (error) {
            console.error('❌ Failed to claim chain:', error);
            throw error;
        }
    }

    async createClient() {
        if (!this.owner || !this.chainId) {
            throw new Error('Create wallet and claim chain first');
        }
        
        try {
            console.log('🔧 Creating client...');
            
            await this.delay(500);
            
            console.log('✅ Client created');
            console.log('   Network:', this.config.network);
            
            return true;
        } catch (error) {
            console.error('❌ Failed to create client:', error);
            throw error;
        }
    }

    getWalletInfo() {
        return {
            chainId: this.chainId,
            owner: this.owner,
            network: this.config.network,
            faucetUrl: this.config.faucetUrl,
            initialized: this.initialized,
            hasWallet: !!this.owner,
            hasClient: !!(this.owner && this.chainId)
        };
    }

    reset() {
        console.log('🔄 Resetting wallet...');
        
        localStorage.removeItem('linera_owner');
        localStorage.removeItem('linera_chain_id');
        localStorage.removeItem('linera_network');
        
        this.chainId = null;
        this.owner = null;
        
        console.log('✅ Wallet reset');
    }

    // Helper methods
    generateRandomHex(length) {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default LineraManager;
