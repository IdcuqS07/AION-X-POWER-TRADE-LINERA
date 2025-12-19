/**
 * AI Trading Module
 * Handles signal generation and trading history
 */

export class TradingManager {
    constructor() {
        this.signals = [];
        this.history = [];
    }

    /**
     * Generate AI trading signal
     */
    generateSignal(chainId) {
        const signalTemplates = [
            {
                type: 'BUY',
                pair: 'BTC/USD',
                price: 42500 + Math.random() * 1000,
                confidence: 0.85 + Math.random() * 0.1,
                reason: 'Strong uptrend detected with high volume'
            },
            {
                type: 'SELL',
                pair: 'ETH/USD',
                price: 2250 + Math.random() * 100,
                confidence: 0.78 + Math.random() * 0.1,
                reason: 'Resistance level reached, profit taking recommended'
            },
            {
                type: 'BUY',
                pair: 'SOL/USD',
                price: 98 + Math.random() * 10,
                confidence: 0.92 + Math.random() * 0.05,
                reason: 'Breakout pattern forming with strong momentum'
            },
            {
                type: 'BUY',
                pair: 'LINERA/USD',
                price: 1.25 + Math.random() * 0.5,
                confidence: 0.88 + Math.random() * 0.1,
                reason: 'New blockchain momentum, early adoption phase'
            },
            {
                type: 'SELL',
                pair: 'AVAX/USD',
                price: 35 + Math.random() * 5,
                confidence: 0.75 + Math.random() * 0.1,
                reason: 'Overbought conditions, correction expected'
            }
        ];

        const template = signalTemplates[Math.floor(Math.random() * signalTemplates.length)];
        
        const signal = {
            ...template,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            chainId: chainId ? chainId.substring(0, 8) + '...' : 'demo',
            price: Math.round(template.price * 100) / 100,
            confidence: Math.min(0.99, template.confidence)
        };

        this.signals.push(signal);
        this.addToHistory(signal);
        
        return signal;
    }

    /**
     * Add signal to history
     */
    addToHistory(signal) {
        this.history.unshift({
            ...signal,
            executedAt: new Date().toLocaleTimeString()
        });

        // Keep only last 10
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }
    }

    /**
     * Get latest signal
     */
    getLatestSignal() {
        return this.signals[this.signals.length - 1] || null;
    }

    /**
     * Get trading history
     */
    getHistory() {
        return this.history;
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.signals = [];
        this.history = [];
    }
}

export default TradingManager;
