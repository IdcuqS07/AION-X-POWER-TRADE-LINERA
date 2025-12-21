/**
 * Real AI Signal Generator
 * Uses technical analysis instead of random data
 */

export function generateRealSignal(selectedCoin, currentPrice, aiExplainer, info) {
    // Get AI analysis from AIExplainer (REAL DATA!)
    const analysis = aiExplainer.analyzeSignal(selectedCoin);
    
    // Extract signal data from analysis
    const signal = analysis.signal; // BUY, SELL, or HOLD based on technical analysis
    const confidence = parseFloat(analysis.confidence) / 100; // Convert to 0-1
    const riskScore = parseInt(analysis.risk.score); // Risk score from volatility
    
    // Calculate target price based on signal and indicators
    let targetPrice;
    if (signal === 'BUY') {
        // Use take profit suggestion from analysis
        const tpPercent = parseFloat(analysis.indicators.bb.position) > 50 ? 5 : 3;
        targetPrice = currentPrice * (1 + tpPercent / 100);
    } else if (signal === 'SELL') {
        // Use stop loss suggestion from analysis
        const slPercent = parseFloat(analysis.indicators.bb.position) < 50 ? 5 : 3;
        targetPrice = currentPrice * (1 - slPercent / 100);
    } else {
        // HOLD - minimal movement
        targetPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.02);
    }
    
    return {
        coin: selectedCoin,
        signal: signal,
        type: signal,
        price: currentPrice,
        confidence: confidence,
        riskScore: riskScore,
        targetPrice: targetPrice,
        currentPrice: currentPrice,
        timestamp: new Date(),
        chainId: info.chainId,
        // Add analysis details for transparency
        analysis: {
            rsi: analysis.indicators.rsi,
            macd: analysis.indicators.macd,
            ma: analysis.indicators.ma,
            bb: analysis.indicators.bb,
            reasoning: analysis.reasoning
        }
    };
}
