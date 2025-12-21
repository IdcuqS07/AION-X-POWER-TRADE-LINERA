/**
 * Binance CEX Trading Simulation
 * Provides realistic order execution experience
 * 
 * This module enhances trade execution with:
 * - Realistic delays (100-300ms total)
 * - Fee calculation (0.1% Binance taker fee)
 * - Slippage simulation (0.01-0.02%)
 * - Execution phases (placing → matching → executing → filled)
 */

export class BinanceSimulation {
    constructor() {
        // Binance spot trading fees
        this.MAKER_FEE = 0.001;  // 0.1%
        this.TAKER_FEE = 0.001;  // 0.1% (we use market orders)
        
        // Platform info
        this.PLATFORM_NAME = 'Binance';
        this.PLATFORM_TYPE = 'CEX';
    }

    /**
     * Calculate realistic execution with fees and slippage
     */
    calculateExecution(signal, tradeAmount) {
        // Calculate slippage based on trade size
        const slippage = this.calculateSlippage(tradeAmount);
        
        // Execution price with slippage
        // For BUY: price goes up slightly
        // For SELL: price goes down slightly
        const slippageDirection = signal.signal === 'BUY' ? 1 : -1;
        const executionPrice = signal.targetPrice * (1 + (slippage * slippageDirection));
        
        // Calculate fee (0.1% of trade amount)
        const fee = tradeAmount * this.TAKER_FEE;
        
        // Net amount after fee
        const netAmount = tradeAmount - fee;
        
        // Coin amount received/sold
        const coinAmount = netAmount / executionPrice;
        
        return {
            executionPrice: executionPrice,
            slippage: slippage,
            slippagePercent: (slippage * 100).toFixed(3),
            fee: fee,
            feePercent: (this.TAKER_FEE * 100).toFixed(1),
            netAmount: netAmount,
            coinAmount: coinAmount,
            platform: this.PLATFORM_NAME,
            platformType: this.PLATFORM_TYPE
        };
    }

    /**
     * Calculate slippage based on trade size
     * Binance has high liquidity, so slippage is minimal
     */
    calculateSlippage(amount) {
        const baseSlippage = 0.0001; // 0.01% base
        
        // Larger trades have slightly more slippage
        if (amount > 10000) {
            return 0.0002; // 0.02%
        } else if (amount > 5000) {
            return 0.00015; // 0.015%
        } else {
            return baseSlippage; // 0.01%
        }
    }

    /**
     * Simulate realistic order execution with phases
     */
    async executeOrder(signal, tradeAmount, callbacks) {
        const startTime = Date.now();
        
        try {
            // Phase 1: Placing order (100-200ms)
            if (callbacks.onStatus) {
                callbacks.onStatus('📤 Placing order on Binance...', 25);
            }
            await this.delay(this.randomBetween(100, 200));
            
            // Phase 2: Order matching (50-100ms)
            if (callbacks.onStatus) {
                callbacks.onStatus('🔄 Matching order...', 50);
            }
            await this.delay(this.randomBetween(50, 100));
            
            // Phase 3: Executing trade (50-100ms)
            if (callbacks.onStatus) {
                callbacks.onStatus('⚡ Executing trade...', 75);
            }
            await this.delay(this.randomBetween(50, 100));
            
            // Calculate execution details
            const execution = this.calculateExecution(signal, tradeAmount);
            
            // Add execution time
            execution.executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
            execution.executionTimeMs = Date.now() - startTime;
            
            // Phase 4: Order filled (50ms)
            if (callbacks.onStatus) {
                callbacks.onStatus('✅ Order filled!', 100);
            }
            await this.delay(50);
            
            // Call completion callback
            if (callbacks.onComplete) {
                callbacks.onComplete(execution);
            }
            
            return execution;
            
        } catch (error) {
            console.error('Binance simulation error:', error);
            if (callbacks.onError) {
                callbacks.onError(error);
            }
            throw error;
        }
    }

    /**
     * Format execution details for display
     */
    formatExecutionSummary(execution, signal) {
        return {
            title: `✅ Trade Executed on ${this.PLATFORM_NAME}`,
            details: [
                { label: 'Platform', value: `${this.PLATFORM_NAME} (${this.PLATFORM_TYPE})` },
                { label: 'Type', value: `${signal.signal} ${signal.coin}` },
                { label: 'Execution Price', value: `$${execution.executionPrice.toFixed(2)}` },
                { label: 'Amount', value: `${execution.coinAmount.toFixed(5)} ${signal.coin}` },
                { label: 'Fee', value: `$${execution.fee.toFixed(2)} (${execution.feePercent}%)` },
                { label: 'Slippage', value: `${execution.slippagePercent}%` },
                { label: 'Execution Time', value: `${execution.executionTime}s` },
                { label: 'Status', value: '✅ Filled' }
            ]
        };
    }

    /**
     * Helper: Delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Helper: Random number between min and max
     */
    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Get platform badge HTML
     */
    getPlatformBadge() {
        return `
            <span class="platform-badge binance">
                <span class="binance-icon">🟡</span>
                ${this.PLATFORM_NAME}
            </span>
        `;
    }
}

// Export singleton instance
export const binanceSimulation = new BinanceSimulation();

export default BinanceSimulation;
