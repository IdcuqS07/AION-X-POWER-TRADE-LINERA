/**
 * Trade History Smart Contract Integration
 * Stores complete trade data on Linera blockchain
 */

const TRADE_HISTORY_APP_ID = '17f27b3394c1dfced349fcf477e4b344f374417bde79d628b4345fb430a3747c';

export class TradeHistoryContract {
    constructor() {
        this.appId = TRADE_HISTORY_APP_ID;
        this.chainId = null;
        this.owner = null;
    }

    /**
     * Initialize contract with chain ID and owner
     */
    async initialize(chainId, owner) {
        this.chainId = chainId;
        this.owner = owner;
        console.log('✅ Trade History Contract initialized:', {
            appId: this.appId,
            chainId: this.chainId,
            owner: this.owner
        });
    }

    /**
     * Execute a trade and store on blockchain
     */
    async executeTrade(coin, tradeType, entryPrice, exitPrice, amount) {
        if (!this.chainId || !this.owner) {
            throw new Error('Contract not initialized. Call initialize() first.');
        }

        try {
            const operation = {
                ExecuteTrade: {
                    coin,
                    trade_type: tradeType,
                    entry_price: entryPrice,
                    exit_price: exitPrice,
                    amount
                }
            };

            console.log('📝 Executing trade on blockchain:', operation);

            // Execute operation on contract
            const response = await this.executeOperation(operation);
            
            console.log('✅ Trade stored on blockchain:', response);
            return response;
        } catch (error) {
            console.error('❌ Failed to execute trade:', error);
            throw error;
        }
    }

    /**
     * Execute operation on contract
     */
    async executeOperation(operation) {
        // Use proxy to avoid CORS issues
        const baseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:5173/linera'
            : 'https://aion-x.xyz/linera';
        const url = `${baseUrl}/chains/${this.chainId}/applications/${this.appId}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `mutation { operation(operation: ${JSON.stringify(operation)}) }`
            })
        });

        if (!response.ok) {
            throw new Error(`Contract operation failed: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Query user's trade history from blockchain
     */
    async getUserTrades(user) {
        try {
            const query = `
                query {
                    userTrades(user: "${user}") {
                        id
                        user
                        coin
                        tradeType
                        entryPrice
                        exitPrice
                        amount
                        profitLoss
                        timestamp
                    }
                }
            `;

            const result = await this.queryContract(query);
            return result.data.userTrades;
        } catch (error) {
            console.warn('⚠️ Blockchain unavailable, using localStorage for trades');
            // Fallback to localStorage - use correct key
            const stored = localStorage.getItem('blockchain_trade_history');
            if (stored) {
                const trades = JSON.parse(stored);
                return trades.filter(t => t.user === user);
            }
            return [];
        }
    }

    /**
     * Get total number of trades on platform
     */
    async getTotalTrades() {
        try {
            const query = `
                query {
                    totalTrades
                }
            `;

            const result = await this.queryContract(query);
            return result.data.totalTrades;
        } catch (error) {
            console.error('❌ Failed to query total trades:', error);
            return 0;
        }
    }

    /**
     * Get user's total profit/loss
     */
    async getUserTotalPnL(user) {
        try {
            const query = `
                query {
                    userTotalPnl(user: "${user}")
                }
            `;

            const result = await this.queryContract(query);
            return result.data.userTotalPnl;
        } catch (error) {
            console.warn('⚠️ Blockchain unavailable, calculating P&L from localStorage');
            // Fallback to localStorage - use correct key
            const stored = localStorage.getItem('blockchain_trade_history');
            if (stored) {
                const trades = JSON.parse(stored);
                const userTrades = trades.filter(t => t.user === user);
                return userTrades.reduce((total, trade) => total + (trade.profitLoss || 0), 0);
            }
            return 0;
        }
    }

    /**
     * Get all trades (for analytics)
     */
    async getAllTrades() {
        try {
            const query = `
                query {
                    allTrades {
                        id
                        user
                        coin
                        tradeType
                        entryPrice
                        exitPrice
                        amount
                        profitLoss
                        timestamp
                    }
                }
            `;

            const result = await this.queryContract(query);
            return result.data.allTrades;
        } catch (error) {
            console.error('❌ Failed to query all trades:', error);
            return [];
        }
    }

    /**
     * Query contract via GraphQL
     */
    async queryContract(query) {
        // Use proxy to avoid CORS issues
        const baseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:5173/linera'
            : 'https://aion-x.xyz/linera';
        const url = `${baseUrl}/chains/${this.chainId}/applications/${this.appId}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                console.warn(`⚠️ Contract query returned ${response.status}, falling back to localStorage`);
                throw new Error(`HTTP ${response.status}`);
            }

            // Check if response has content
            const contentLength = response.headers.get('content-length');
            if (contentLength === '0' || contentLength === null) {
                console.warn('⚠️ Empty response from blockchain, falling back to localStorage');
                throw new Error('Empty response');
            }

            const text = await response.text();
            if (!text || text.trim() === '') {
                console.warn('⚠️ Empty response body, falling back to localStorage');
                throw new Error('Empty response body');
            }

            return JSON.parse(text);
        } catch (error) {
            console.warn('⚠️ Blockchain query failed, using localStorage fallback:', error.message);
            // Fallback to localStorage
            throw error; // Let caller handle fallback
        }
    }

    /**
     * Format trade for display
     */
    formatTrade(trade) {
        return {
            id: trade.id,
            coin: trade.coin,
            type: trade.tradeType,
            entry: `$${trade.entryPrice.toFixed(2)}`,
            exit: `$${trade.exitPrice.toFixed(2)}`,
            amount: trade.amount.toFixed(6),
            pnl: trade.profitLoss >= 0 
                ? `+$${trade.profitLoss.toFixed(2)}`
                : `-$${Math.abs(trade.profitLoss).toFixed(2)}`,
            date: new Date(trade.timestamp / 1000).toLocaleString(),
            onChain: true
        };
    }
}

// Export singleton instance
export const tradeHistoryContract = new TradeHistoryContract();
