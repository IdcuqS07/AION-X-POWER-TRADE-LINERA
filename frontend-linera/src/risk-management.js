/**
 * Risk Management Module
 * Handles Stop Loss, Take Profit, and Trade Monitoring
 */

export class RiskManager {
    constructor() {
        this.activeTrades = [];
        this.monitorInterval = null;
        this.MONITOR_INTERVAL_MS = 5000; // Check every 5 seconds
    }

    /**
     * Calculate AI-suggested stop loss and take profit
     */
    calculateAISuggestion(entryPrice, confidence, signalType) {
        let takeProfitPercent, stopLossPercent;

        // Higher confidence = higher target, tighter stop
        if (confidence >= 0.90) {
            takeProfitPercent = signalType === 'BUY' ? 8 : 8;
            stopLossPercent = 3;
        } else if (confidence >= 0.85) {
            takeProfitPercent = signalType === 'BUY' ? 6 : 6;
            stopLossPercent = 3;
        } else if (confidence >= 0.80) {
            takeProfitPercent = signalType === 'BUY' ? 5 : 5;
            stopLossPercent = 4;
        } else {
            takeProfitPercent = signalType === 'BUY' ? 4 : 4;
            stopLossPercent = 5;
        }

        const takeProfit = signalType === 'BUY' 
            ? entryPrice * (1 + takeProfitPercent / 100)
            : entryPrice * (1 - takeProfitPercent / 100);

        const stopLoss = signalType === 'BUY'
            ? entryPrice * (1 - stopLossPercent / 100)
            : entryPrice * (1 + stopLossPercent / 100);

        return {
            takeProfit: Math.round(takeProfit * 100) / 100,
            takeProfitPercent,
            stopLoss: Math.round(stopLoss * 100) / 100,
            stopLossPercent,
            riskRewardRatio: (takeProfitPercent / stopLossPercent).toFixed(2)
        };
    }

    /**
     * Calculate profit/loss amounts
     */
    calculateProfitLoss(entryPrice, targetPrice, amount, signalType) {
        const priceDiff = targetPrice - entryPrice;
        const profitLoss = signalType === 'BUY' ? priceDiff * amount : -priceDiff * amount;
        return Math.round(profitLoss * 100) / 100;
    }

    /**
     * Calculate percentage from price
     */
    calculatePercentFromPrice(entryPrice, targetPrice, signalType) {
        const diff = targetPrice - entryPrice;
        const percent = (diff / entryPrice) * 100;
        return signalType === 'BUY' ? percent : -percent;
    }

    /**
     * Calculate price from percentage
     */
    calculatePriceFromPercent(entryPrice, percent, signalType) {
        if (signalType === 'BUY') {
            return entryPrice * (1 + percent / 100);
        } else {
            return entryPrice * (1 - percent / 100);
        }
    }

    /**
     * Validate stop loss and take profit
     */
    validate(entryPrice, stopLoss, takeProfit, signalType) {
        const errors = [];

        if (!stopLoss || stopLoss <= 0) {
            errors.push('Stop loss must be greater than 0');
        }

        if (!takeProfit || takeProfit <= 0) {
            errors.push('Take profit must be greater than 0');
        }

        if (signalType === 'BUY') {
            if (stopLoss >= entryPrice) {
                errors.push('Stop loss must be below entry price for BUY');
            }
            if (takeProfit <= entryPrice) {
                errors.push('Take profit must be above entry price for BUY');
            }
        } else {
            if (stopLoss <= entryPrice) {
                errors.push('Stop loss must be above entry price for SELL');
            }
            if (takeProfit >= entryPrice) {
                errors.push('Take profit must be below entry price for SELL');
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Add trade to monitoring
     */
    addTrade(trade) {
        this.activeTrades.push({
            ...trade,
            id: Date.now(),
            status: 'active',
            openedAt: new Date().toISOString()
        });

        console.log(`📊 Trade added to monitoring:`, trade);

        // Start monitoring if not already running
        if (!this.monitorInterval) {
            this.startMonitoring();
        }

        return this.activeTrades[this.activeTrades.length - 1];
    }

    /**
     * Start price monitoring
     */
    startMonitoring() {
        if (this.monitorInterval) {
            return; // Already monitoring
        }

        console.log('🔍 Starting trade monitoring...');

        this.monitorInterval = setInterval(() => {
            this.checkTrades();
        }, this.MONITOR_INTERVAL_MS);
    }

    /**
     * Stop price monitoring
     */
    stopMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
            console.log('⏸️ Trade monitoring stopped');
        }
    }

    /**
     * Check all active trades
     */
    async checkTrades() {
        if (this.activeTrades.length === 0) {
            this.stopMonitoring();
            return;
        }

        console.log(`🔍 Checking ${this.activeTrades.length} active trades...`);

        for (const trade of this.activeTrades) {
            if (trade.status !== 'active') continue;

            // Get current price (mock for now)
            const currentPrice = await this.getCurrentPrice(trade.pair);

            // Check stop loss
            if (this.shouldTriggerStopLoss(trade, currentPrice)) {
                await this.closeTrade(trade, currentPrice, 'stop_loss');
                continue;
            }

            // Check take profit
            if (this.shouldTriggerTakeProfit(trade, currentPrice)) {
                await this.closeTrade(trade, currentPrice, 'take_profit');
                continue;
            }
        }
    }

    /**
     * Check if stop loss should trigger
     */
    shouldTriggerStopLoss(trade, currentPrice) {
        if (trade.signalType === 'BUY') {
            return currentPrice <= trade.stopLoss;
        } else {
            return currentPrice >= trade.stopLoss;
        }
    }

    /**
     * Check if take profit should trigger
     */
    shouldTriggerTakeProfit(trade, currentPrice) {
        if (trade.signalType === 'BUY') {
            return currentPrice >= trade.takeProfit;
        } else {
            return currentPrice <= trade.takeProfit;
        }
    }

    /**
     * Close trade
     */
    async closeTrade(trade, exitPrice, reason) {
        trade.status = 'closed';
        trade.exitPrice = exitPrice;
        trade.closedAt = new Date().toISOString();
        trade.closeReason = reason;

        // Calculate final P&L
        const pnl = this.calculateProfitLoss(
            trade.entryPrice,
            exitPrice,
            trade.amount,
            trade.signalType
        );

        trade.pnl = pnl;

        console.log(`✅ Trade closed:`, {
            pair: trade.pair,
            reason,
            entry: trade.entryPrice,
            exit: exitPrice,
            pnl: pnl
        });

        // Trigger callback if provided
        if (trade.onClose) {
            trade.onClose(trade);
        }

        // Remove from active trades
        this.activeTrades = this.activeTrades.filter(t => t.id !== trade.id);

        return trade;
    }

    /**
     * Get current price (mock - should integrate with real market data)
     */
    async getCurrentPrice(pair) {
        // Mock price movement
        const basePrice = {
            'BTC/USD': 42500,
            'ETH/USD': 2250,
            'SOL/USD': 98,
            'BNB/USD': 310,
            'LINERA/USD': 1.25
        }[pair] || 100;

        // Simulate price movement ±2%
        const volatility = 0.02;
        const change = (Math.random() - 0.5) * 2 * volatility;
        return basePrice * (1 + change);
    }

    /**
     * Get active trades
     */
    getActiveTrades() {
        return this.activeTrades.filter(t => t.status === 'active');
    }

    /**
     * Get closed trades
     */
    getClosedTrades() {
        return this.activeTrades.filter(t => t.status === 'closed');
    }

    /**
     * Manually close trade
     */
    async manualClose(tradeId, currentPrice) {
        const trade = this.activeTrades.find(t => t.id === tradeId);
        if (!trade) {
            throw new Error('Trade not found');
        }

        return await this.closeTrade(trade, currentPrice, 'manual');
    }
}

export default RiskManager;
