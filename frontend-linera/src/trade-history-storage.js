/**
 * Trade History Storage - localStorage-based persistence
 * Fallback when blockchain is unavailable
 */

export class TradeHistoryStorage {
    constructor() {
        this.storageKey = 'blockchain_trade_history';
    }

    /**
     * Initialize storage for owner
     */
    initialize(owner) {
        this.owner = owner;
        console.log('✅ Trade History Storage initialized for:', owner);
    }

    /**
     * Save trade to localStorage (simulating blockchain)
     */
    async saveTrade(trade) {
        if (!this.owner) {
            throw new Error('Storage not initialized');
        }

        try {
            // Get existing trades
            const trades = this.getAllTrades();
            
            // Add new trade with ID
            const newTrade = {
                id: Date.now(),
                user: this.owner,
                coin: trade.coin,
                tradeType: trade.type,
                entryPrice: trade.entryPrice,
                exitPrice: trade.exitPrice,
                amount: trade.amount,
                profitLoss: trade.profitLoss || 0,
                timestamp: Date.now(),
                savedAt: new Date().toISOString()
            };
            
            trades.push(newTrade);
            
            // Save to localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(trades));
            
            console.log('✅ Trade saved to storage:', newTrade);
            return newTrade;
        } catch (error) {
            console.error('❌ Failed to save trade to storage:', error);
            throw error;
        }
    }

    /**
     * Get all trades from storage
     */
    getAllTrades() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ Failed to load trades from storage:', error);
            return [];
        }
    }

    /**
     * Get trades for specific user
     */
    getUserTrades(user) {
        const allTrades = this.getAllTrades();
        return allTrades.filter(trade => trade.user === user);
    }

    /**
     * Get user's total P&L
     */
    getUserTotalPnL(user) {
        const userTrades = this.getUserTrades(user);
        return userTrades.reduce((total, trade) => total + (trade.profitLoss || 0), 0);
    }

    /**
     * Get total number of trades
     */
    getTotalTrades() {
        return this.getAllTrades().length;
    }

    /**
     * Clear all trades (for testing)
     */
    clearAll() {
        localStorage.removeItem(this.storageKey);
        console.log('🗑️ All trades cleared from storage');
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
            date: new Date(trade.timestamp).toLocaleString(),
            onChain: true // Simulated blockchain
        };
    }
}

// Export singleton instance
export const tradeHistoryStorage = new TradeHistoryStorage();
