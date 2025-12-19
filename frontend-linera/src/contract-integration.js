/**
 * AI Trading Contract Integration Layer
 * Handles fallback between real contract and mock data
 */

import { aiTradingContract } from './ai-trading-contract.js';

export class ContractIntegration {
    constructor() {
        this.available = false;
        this.checkingAvailability = false;
    }

    /**
     * Check if contract is available
     */
    async checkAvailability() {
        if (this.checkingAvailability) return this.available;
        
        this.checkingAvailability = true;
        try {
            await aiTradingContract.getTradeCount();
            this.available = true;
            console.log('✅ AI Trading Contract connected');
            return true;
        } catch (error) {
            this.available = false;
            console.warn('⚠️ Contract not available:', error.message);
            return false;
        } finally {
            this.checkingAvailability = false;
        }
    }

    /**
     * Generate AI signal (with fallback)
     */
    async generateSignal(coin) {
        if (this.available) {
            try {
                // Call contract
                await aiTradingContract.generateSignal(coin);
                
                // Fetch signals
                const signals = await aiTradingContract.getSignals();
                const signal = signals.find(s => s.coin === coin);
                
                if (signal) {
                    return {
                        coin: signal.coin,
                        action: signal.action,
                        confidence: signal.confidence,
                        source: 'contract'
                    };
                }
            } catch (error) {
                console.warn('⚠️ Contract call failed:', error);
                this.available = false;
            }
        }
        
        // Fallback to mock
        const actions = ['BUY', 'SELL', 'HOLD'];
        return {
            coin: coin,
            action: actions[Math.floor(Math.random() * actions.length)],
            confidence: Math.floor(Math.random() * 40) + 60, // 60-100
            source: 'mock'
        };
    }

    /**
     * Execute trade (with fallback)
     */
    async executeTrade(coin, amount) {
        if (this.available) {
            try {
                await aiTradingContract.executeTrade(coin, amount);
                return { success: true, source: 'contract' };
            } catch (error) {
                console.warn('⚠️ Contract trade failed:', error);
                this.available = false;
            }
        }
        
        // Fallback to mock
        return { success: true, source: 'mock' };
    }

    /**
     * Get trade count (with fallback)
     */
    async getTradeCount() {
        if (this.available) {
            try {
                const count = await aiTradingContract.getTradeCount();
                return { count, source: 'contract' };
            } catch (error) {
                console.warn('⚠️ Contract query failed:', error);
                this.available = false;
            }
        }
        
        // Fallback to mock
        return { count: 0, source: 'mock' };
    }

    /**
     * Get all signals (with fallback)
     */
    async getSignals() {
        if (this.available) {
            try {
                const signals = await aiTradingContract.getSignals();
                return { signals, source: 'contract' };
            } catch (error) {
                console.warn('⚠️ Contract query failed:', error);
                this.available = false;
            }
        }
        
        // Fallback to mock
        return { signals: [], source: 'mock' };
    }

    /**
     * Get all trades (with fallback)
     */
    async getTrades() {
        if (this.available) {
            try {
                const trades = await aiTradingContract.getTrades();
                return { trades, source: 'contract' };
            } catch (error) {
                console.warn('⚠️ Contract query failed:', error);
                this.available = false;
            }
        }
        
        // Fallback to mock
        return { trades: [], source: 'mock' };
    }

    /**
     * Get status message
     */
    getStatusMessage() {
        if (this.available) {
            return '✅ Connected to AI Trading Contract';
        } else {
            return '⚠️ Using mock data - Start GraphQL service for real contract';
        }
    }
}

// Export singleton
export const contractIntegration = new ContractIntegration();
