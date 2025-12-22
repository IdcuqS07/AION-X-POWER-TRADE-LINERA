/**
 * Trade Counter Smart Contract Integration
 * 
 * Connects frontend to deployed Linera smart contract
 * Application ID: 4819de606012d48a692759f04c833e06191544cdf56bdec9e6fe13ece1fce718
 * Network: Testnet Conway
 */

// Deployed contract configuration
export const TRADE_COUNTER_CONFIG = {
    applicationId: '4819de606012d48a692759f04c833e06191544cdf56bdec9e6fe13ece1fce718',
    network: 'testnet-conway',
    graphqlEndpoint: 'https://testnet-conway.linera.net/graphql',
};

/**
 * Trade Counter Contract Interface
 * Provides methods to interact with on-chain smart contract
 */
export class TradeCounterContract {
    constructor(wallet) {
        this.wallet = wallet;
        this.appId = TRADE_COUNTER_CONFIG.applicationId;
        this.endpoint = TRADE_COUNTER_CONFIG.graphqlEndpoint;
    }

    /**
     * Query current trade count from blockchain
     * @returns {Promise<number>} Current trade count
     */
    async getTradeCount() {
        try {
            const query = `
                query {
                    application(id: "${this.appId}") {
                        state {
                            tradeCount
                        }
                    }
                }
            `;

            const response = await this._executeQuery(query);
            return response?.application?.state?.tradeCount || 0;
        } catch (error) {
            console.error('Error getting trade count:', error);
            // Fallback to local storage if on-chain query fails
            return this._getLocalTradeCount();
        }
    }

    /**
     * Query current signal count from blockchain
     * @returns {Promise<number>} Current signal count
     */
    async getSignalCount() {
        try {
            const query = `
                query {
                    application(id: "${this.appId}") {
                        state {
                            signalCount
                        }
                    }
                }
            `;

            const response = await this._executeQuery(query);
            return response?.application?.state?.signalCount || 0;
        } catch (error) {
            console.error('Error getting signal count:', error);
            return this._getLocalSignalCount();
        }
    }

    /**
     * Increment trade counter on blockchain
     * @returns {Promise<boolean>} Success status
     */
    async incrementTradeCount() {
        try {
            if (!this.wallet || !this.wallet.chainId) {
                console.warn('Wallet not connected, using local storage');
                return this._incrementLocalTradeCount();
            }

            const mutation = `
                mutation {
                    executeOperation(
                        chainId: "${this.wallet.chainId}",
                        applicationId: "${this.appId}",
                        operation: "increment"
                    ) {
                        success
                        transactionHash
                    }
                }
            `;

            const response = await this._executeMutation(mutation);
            
            if (response?.executeOperation?.success) {
                console.log('✅ Trade count incremented on-chain!');
                console.log('TX Hash:', response.executeOperation.transactionHash);
                return true;
            }

            // Fallback to local if on-chain fails
            return this._incrementLocalTradeCount();
        } catch (error) {
            console.error('Error incrementing trade count:', error);
            return this._incrementLocalTradeCount();
        }
    }

    /**
     * Increment signal counter on blockchain
     * @returns {Promise<boolean>} Success status
     */
    async incrementSignalCount() {
        try {
            if (!this.wallet || !this.wallet.chainId) {
                console.warn('Wallet not connected, using local storage');
                return this._incrementLocalSignalCount();
            }

            const mutation = `
                mutation {
                    executeOperation(
                        chainId: "${this.wallet.chainId}",
                        applicationId: "${this.appId}",
                        operation: "incrementSignal"
                    ) {
                        success
                        transactionHash
                    }
                }
            `;

            const response = await this._executeMutation(mutation);
            
            if (response?.executeOperation?.success) {
                console.log('✅ Signal count incremented on-chain!');
                console.log('TX Hash:', response.executeOperation.transactionHash);
                return true;
            }

            return this._incrementLocalSignalCount();
        } catch (error) {
            console.error('Error incrementing signal count:', error);
            return this._incrementLocalSignalCount();
        }
    }

    /**
     * Get complete contract state
     * @returns {Promise<Object>} Contract state
     */
    async getContractState() {
        try {
            const query = `
                query {
                    application(id: "${this.appId}") {
                        state {
                            tradeCount
                            signalCount
                        }
                        lastUpdated
                    }
                }
            `;

            const response = await this._executeQuery(query);
            return {
                tradeCount: response?.application?.state?.tradeCount || 0,
                signalCount: response?.application?.state?.signalCount || 0,
                lastUpdated: response?.application?.lastUpdated || new Date().toISOString(),
                source: 'on-chain'
            };
        } catch (error) {
            console.error('Error getting contract state:', error);
            return {
                tradeCount: this._getLocalTradeCount(),
                signalCount: this._getLocalSignalCount(),
                lastUpdated: new Date().toISOString(),
                source: 'local-storage'
            };
        }
    }

    /**
     * Subscribe to contract events
     * @param {Function} callback - Called when events occur
     * @returns {Function} Unsubscribe function
     */
    subscribeToEvents(callback) {
        // WebSocket subscription for real-time updates
        const ws = new WebSocket(`wss://testnet-conway.linera.net/ws`);
        
        ws.onopen = () => {
            console.log('📡 Connected to Linera WebSocket');
            ws.send(JSON.stringify({
                type: 'subscribe',
                applicationId: this.appId
            }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                callback(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Return unsubscribe function
        return () => {
            ws.close();
            console.log('📡 Disconnected from Linera WebSocket');
        };
    }

    /**
     * Execute GraphQL query
     * @private
     */
    async _executeQuery(query) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`GraphQL query failed: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }

        return result.data;
    }

    /**
     * Execute GraphQL mutation
     * @private
     */
    async _executeMutation(mutation) {
        return this._executeQuery(mutation);
    }

    /**
     * Fallback: Get trade count from local storage
     * @private
     */
    _getLocalTradeCount() {
        const trades = JSON.parse(localStorage.getItem('tradeHistory') || '[]');
        return trades.length;
    }

    /**
     * Fallback: Get signal count from local storage
     * @private
     */
    _getLocalSignalCount() {
        const signals = JSON.parse(localStorage.getItem('signalHistory') || '[]');
        return signals.length;
    }

    /**
     * Fallback: Increment trade count in local storage
     * @private
     */
    _incrementLocalTradeCount() {
        const count = this._getLocalTradeCount();
        localStorage.setItem('localTradeCount', (count + 1).toString());
        return true;
    }

    /**
     * Fallback: Increment signal count in local storage
     * @private
     */
    _incrementLocalSignalCount() {
        const count = this._getLocalSignalCount();
        localStorage.setItem('localSignalCount', (count + 1).toString());
        return true;
    }
}

/**
 * Display contract statistics in UI
 */
export async function displayContractStats(contract) {
    try {
        const state = await contract.getContractState();
        
        const statsHTML = `
            <div class="contract-stats" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 15px;
                border-radius: 10px;
                margin: 10px 0;
                color: white;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin: 0 0 10px 0;">📊 On-Chain Statistics</h4>
                        <div style="display: flex; gap: 20px;">
                            <div>
                                <div style="font-size: 12px; opacity: 0.8;">Total Trades</div>
                                <div style="font-size: 24px; font-weight: bold;">${state.tradeCount}</div>
                            </div>
                            <div>
                                <div style="font-size: 12px; opacity: 0.8;">Total Signals</div>
                                <div style="font-size: 24px; font-weight: bold;">${state.signalCount}</div>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 10px; opacity: 0.7;">Data Source</div>
                        <div style="font-size: 12px; font-weight: bold;">
                            ${state.source === 'on-chain' ? '✅ Blockchain' : '💾 Local'}
                        </div>
                        <div style="font-size: 10px; opacity: 0.7; margin-top: 5px;">
                            App ID: ${TRADE_COUNTER_CONFIG.applicationId.substring(0, 8)}...
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert stats into page
        const container = document.querySelector('.portfolio-section') || document.body;
        const existingStats = container.querySelector('.contract-stats');
        
        if (existingStats) {
            existingStats.outerHTML = statsHTML;
        } else {
            container.insertAdjacentHTML('afterbegin', statsHTML);
        }

        return state;
    } catch (error) {
        console.error('Error displaying contract stats:', error);
        return null;
    }
}

/**
 * Initialize contract integration
 */
export async function initializeContractIntegration(wallet) {
    console.log('🚀 Initializing Trade Counter Contract Integration...');
    console.log('📝 Application ID:', TRADE_COUNTER_CONFIG.applicationId);
    console.log('🌐 Network:', TRADE_COUNTER_CONFIG.network);

    const contract = new TradeCounterContract(wallet);

    // Display initial stats
    await displayContractStats(contract);

    // Subscribe to real-time updates
    const unsubscribe = contract.subscribeToEvents((event) => {
        console.log('📡 Contract event received:', event);
        displayContractStats(contract);
    });

    // Return contract instance and cleanup function
    return {
        contract,
        unsubscribe
    };
}

// Export for use in main app
export default TradeCounterContract;
