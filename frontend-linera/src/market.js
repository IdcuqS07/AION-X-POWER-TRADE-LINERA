/**
 * Market Data Module
 * Handles market data fetching and updates
 */

export class MarketManager {
    constructor() {
        this.data = {
            BTC: { price: 0, change: 0 },
            ETH: { price: 0, change: 0 },
            SOL: { price: 0, change: 0 },
            BNB: { price: 0, change: 0 }
        };
    }

    /**
     * Fetch market data from Binance API
     */
    async updateMarketData() {
        try {
            const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
            const promises = symbols.map(symbol => 
                fetch(`/api/binance/api/v3/ticker/24hr?symbol=${symbol}`)
                    .then(res => res.json())
            );
            
            const results = await Promise.all(promises);
            
            // Update market data
            this.data.BTC = {
                price: parseFloat(results[0].lastPrice),
                change: parseFloat(results[0].priceChangePercent)
            };
            this.data.ETH = {
                price: parseFloat(results[1].lastPrice),
                change: parseFloat(results[1].priceChangePercent)
            };
            this.data.SOL = {
                price: parseFloat(results[2].lastPrice),
                change: parseFloat(results[2].priceChangePercent)
            };
            this.data.BNB = {
                price: parseFloat(results[3].lastPrice),
                change: parseFloat(results[3].priceChangePercent)
            };
            
            console.log('📊 Market data updated:', this.data);
            return this.data;
        } catch (error) {
            console.error('Failed to fetch market data:', error);
            throw error;
        }
    }

    /**
     * Get current price for a coin
     */
    getPrice(coin) {
        return this.data[coin]?.price || 0;
    }

    /**
     * Get all market data
     */
    getData() {
        return this.data;
    }

    /**
     * Alias for getData() - for compatibility
     */
    getMarketData() {
        return this.data;
    }
}

export default MarketManager;
