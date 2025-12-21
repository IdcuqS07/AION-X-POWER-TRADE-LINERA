/**
 * AI Explainability Module
 * Provides transparent analysis of AI trading decisions
 */

export class AIExplainer {
    constructor(marketManager) {
        this.marketManager = marketManager;
    }

    /**
     * Calculate RSI (Relative Strength Index)
     */
    calculateRSI(prices, period = 14) {
        if (prices.length < period) return 50; // Neutral default
        
        let gains = 0;
        let losses = 0;
        
        for (let i = 1; i <= period; i++) {
            const change = prices[i] - prices[i - 1];
            if (change > 0) gains += change;
            else losses += Math.abs(change);
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        
        if (avgLoss === 0) return 100;
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }

    /**
     * Calculate MACD
     */
    calculateMACD(prices) {
        if (prices.length < 26) return { macd: 0, signal: 0, histogram: 0 };
        
        const ema12 = this.calculateEMA(prices, 12);
        const ema26 = this.calculateEMA(prices, 26);
        const macd = ema12 - ema26;
        
        return {
            macd: macd,
            signal: macd * 0.8, // Simplified
            histogram: macd * 0.2
        };
    }

    /**
     * Calculate EMA (Exponential Moving Average)
     */
    calculateEMA(prices, period) {
        const k = 2 / (period + 1);
        let ema = prices[0];
        
        for (let i = 1; i < prices.length; i++) {
            ema = prices[i] * k + ema * (1 - k);
        }
        
        return ema;
    }

    /**
     * Calculate Moving Averages
     */
    calculateMA(prices, period) {
        if (prices.length < period) return prices[prices.length - 1];
        
        const slice = prices.slice(-period);
        return slice.reduce((sum, price) => sum + price, 0) / period;
    }

    /**
     * Calculate Bollinger Bands
     */
    calculateBollingerBands(prices, period = 20) {
        const ma = this.calculateMA(prices, period);
        const slice = prices.slice(-period);
        
        const variance = slice.reduce((sum, price) => {
            return sum + Math.pow(price - ma, 2);
        }, 0) / period;
        
        const stdDev = Math.sqrt(variance);
        
        return {
            upper: ma + (stdDev * 2),
            middle: ma,
            lower: ma - (stdDev * 2)
        };
    }

    /**
     * Generate price history (mock for now)
     */
    generatePriceHistory(currentPrice, days = 30) {
        const prices = [];
        let price = currentPrice * 0.95; // Start 5% lower
        
        for (let i = 0; i < days; i++) {
            const change = (Math.random() - 0.48) * price * 0.02; // Slight upward bias
            price += change;
            prices.push(price);
        }
        
        return prices;
    }

    /**
     * Analyze coin and generate explanation
     */
    analyzeSignal(coin) {
        const marketData = this.marketManager.getMarketData();
        const coinData = marketData[coin];
        
        if (!coinData || !coinData.price) {
            return this.getDefaultAnalysis(coin);
        }

        const currentPrice = coinData.price;
        const priceHistory = this.generatePriceHistory(currentPrice);
        
        // Calculate indicators
        const rsi = this.calculateRSI(priceHistory);
        const macd = this.calculateMACD(priceHistory);
        const ma5 = this.calculateMA(priceHistory, 5);
        const ma20 = this.calculateMA(priceHistory, 20);
        const bb = this.calculateBollingerBands(priceHistory);
        
        // Determine signals
        const rsiSignal = rsi < 30 ? 'BUY' : rsi > 70 ? 'SELL' : 'NEUTRAL';
        const macdSignal = macd.macd > 0 ? 'BUY' : 'SELL';
        const maSignal = ma5 > ma20 ? 'BUY' : 'SELL';
        const bbSignal = currentPrice < bb.lower ? 'BUY' : currentPrice > bb.upper ? 'SELL' : 'NEUTRAL';
        
        // Calculate scores
        let buyScore = 0;
        let sellScore = 0;
        
        const reasoning = [];
        
        // RSI Analysis
        if (rsi < 30) {
            buyScore += 2.0;
            reasoning.push({
                indicator: 'RSI',
                value: rsi.toFixed(1),
                signal: 'BUY',
                impact: 2.0,
                explanation: `RSI at ${rsi.toFixed(1)} indicates oversold conditions - strong buy signal`
            });
        } else if (rsi > 70) {
            sellScore += 2.0;
            reasoning.push({
                indicator: 'RSI',
                value: rsi.toFixed(1),
                signal: 'SELL',
                impact: -2.0,
                explanation: `RSI at ${rsi.toFixed(1)} indicates overbought conditions - sell signal`
            });
        } else {
            reasoning.push({
                indicator: 'RSI',
                value: rsi.toFixed(1),
                signal: 'NEUTRAL',
                impact: 0,
                explanation: `RSI at ${rsi.toFixed(1)} is in neutral zone`
            });
        }
        
        // MACD Analysis
        if (macd.macd > 0) {
            buyScore += 1.5;
            reasoning.push({
                indicator: 'MACD',
                value: macd.macd.toFixed(2),
                signal: 'BUY',
                impact: 1.5,
                explanation: `MACD is positive (${macd.macd.toFixed(2)}) - bullish momentum`
            });
        } else {
            sellScore += 1.5;
            reasoning.push({
                indicator: 'MACD',
                value: macd.macd.toFixed(2),
                signal: 'SELL',
                impact: -1.5,
                explanation: `MACD is negative (${macd.macd.toFixed(2)}) - bearish momentum`
            });
        }
        
        // Moving Average Analysis
        if (ma5 > ma20) {
            buyScore += 1.0;
            reasoning.push({
                indicator: 'MA Cross',
                value: `${ma5.toFixed(0)} > ${ma20.toFixed(0)}`,
                signal: 'BUY',
                impact: 1.0,
                explanation: 'Golden Cross detected - short-term MA above long-term MA'
            });
        } else {
            sellScore += 1.0;
            reasoning.push({
                indicator: 'MA Cross',
                value: `${ma5.toFixed(0)} < ${ma20.toFixed(0)}`,
                signal: 'SELL',
                impact: -1.0,
                explanation: 'Death Cross detected - short-term MA below long-term MA'
            });
        }
        
        // Bollinger Bands Analysis
        const bbPosition = ((currentPrice - bb.lower) / (bb.upper - bb.lower)) * 100;
        if (currentPrice < bb.lower) {
            buyScore += 1.5;
            reasoning.push({
                indicator: 'Bollinger Bands',
                value: `${bbPosition.toFixed(0)}%`,
                signal: 'BUY',
                impact: 1.5,
                explanation: 'Price near lower band - potentially undervalued'
            });
        } else if (currentPrice > bb.upper) {
            sellScore += 1.5;
            reasoning.push({
                indicator: 'Bollinger Bands',
                value: `${bbPosition.toFixed(0)}%`,
                signal: 'SELL',
                impact: -1.5,
                explanation: 'Price near upper band - potentially overvalued'
            });
        } else {
            reasoning.push({
                indicator: 'Bollinger Bands',
                value: `${bbPosition.toFixed(0)}%`,
                signal: 'NEUTRAL',
                impact: 0,
                explanation: 'Price within normal range'
            });
        }
        
        // Determine final signal
        const totalScore = buyScore - sellScore;
        let finalSignal, confidence;
        
        if (totalScore > 2) {
            finalSignal = 'BUY';
            confidence = Math.min(95, 60 + (totalScore * 5));
        } else if (totalScore < -2) {
            finalSignal = 'SELL';
            confidence = Math.min(95, 60 + (Math.abs(totalScore) * 5));
        } else {
            finalSignal = 'HOLD';
            confidence = 50 + Math.abs(totalScore) * 5;
        }
        
        // Calculate risk score
        const volatility = Math.abs(coinData.change || 2);
        const riskScore = Math.min(100, Math.max(0, 
            (volatility * 10) + (Math.abs(50 - rsi) * 0.5)
        ));
        
        return {
            coin,
            signal: finalSignal,
            confidence: confidence.toFixed(1),
            buyScore: buyScore.toFixed(1),
            sellScore: sellScore.toFixed(1),
            currentPrice: currentPrice.toFixed(2),
            indicators: {
                rsi: {
                    value: rsi.toFixed(1),
                    signal: rsiSignal,
                    zone: rsi < 30 ? 'oversold' : rsi > 70 ? 'overbought' : 'neutral'
                },
                macd: {
                    value: macd.macd.toFixed(2),
                    signal: macdSignal,
                    histogram: macd.histogram.toFixed(2)
                },
                ma: {
                    ma5: ma5.toFixed(2),
                    ma20: ma20.toFixed(2),
                    signal: maSignal,
                    diff: (ma5 - ma20).toFixed(2)
                },
                bb: {
                    upper: bb.upper.toFixed(2),
                    middle: bb.middle.toFixed(2),
                    lower: bb.lower.toFixed(2),
                    position: bbPosition.toFixed(1),
                    signal: bbSignal
                }
            },
            reasoning,
            risk: {
                score: riskScore.toFixed(0),
                volatility: volatility.toFixed(2),
                level: riskScore < 40 ? 'Low' : riskScore < 70 ? 'Medium' : 'High',
                positionSize: riskScore < 40 ? 15 : riskScore < 70 ? 10 : 5
            }
        };
    }

    /**
     * Get default analysis when no data available
     */
    getDefaultAnalysis(coin) {
        return {
            coin,
            signal: 'HOLD',
            confidence: '50.0',
            buyScore: '0.0',
            sellScore: '0.0',
            currentPrice: '0.00',
            indicators: {
                rsi: { value: '50.0', signal: 'NEUTRAL', zone: 'neutral' },
                macd: { value: '0.00', signal: 'NEUTRAL', histogram: '0.00' },
                ma: { ma5: '0.00', ma20: '0.00', signal: 'NEUTRAL', diff: '0.00' },
                bb: { upper: '0.00', middle: '0.00', lower: '0.00', position: '50.0', signal: 'NEUTRAL' }
            },
            reasoning: [{
                indicator: 'No Data',
                value: '-',
                signal: 'HOLD',
                impact: 0,
                explanation: 'Insufficient market data for analysis'
            }],
            risk: {
                score: '50',
                volatility: '0.00',
                level: 'Medium',
                positionSize: 10
            }
        };
    }
}

export default AIExplainer;
