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
        const url = `https://conway1.linera.blockhunters.services/chains/${this.chainId}/applications/${this.appId}`;
        
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
            console.error('❌ Failed to query user trades:', error);
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
            console.error('❌ Failed to query user P&L:', error);
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
        const url = `https://conway1.linera.blockhunters.services/chains/${this.chainId}/applications/${this.appId}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`Contract query failed: ${response.statusText}`);
        }

        return await response.json();
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
