/**
 * Risk Management Integration Patch
 * Add this code to generateSignalEnhanced function after line 803
 */

// REPLACE THIS SECTION (lines 799-807):
/*
    // Enable execute button with percentage
    elements.btnExecute.disabled = false;
    const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
    elements.btnExecute.textContent = `Execute ${signal} ${selectedCoin} (${tradePercentage}% - ${tradeAmount.toFixed(0)})`;
    
    updateStatus(elements.globalStatus, `✅ AI Signal: ${signal} ${selectedCoin}`, 'success');
    console.log('🧠 Signal generated:', currentSignal);
}
*/

// WITH THIS:
/*
    // Enable execute button with percentage
    elements.btnExecute.disabled = false;
    const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
    elements.btnExecute.textContent = `Execute ${signal} ${selectedCoin} (${tradePercentage}% - ${tradeAmount.toFixed(0)})`;
    
    // Show risk management section
    elements.riskManagement.style.display = 'block';
    
    // Calculate and populate AI suggestions for stop loss and take profit
    const aiSuggestion = riskManager.calculateAISuggestion(
        currentPrice,
        confidence,
        signal
    );
    
    // Populate fields with AI suggestions
    elements.takeProfitPrice.value = aiSuggestion.takeProfit;
    elements.takeProfitPercent.value = aiSuggestion.takeProfitPercent;
    elements.stopLossPrice.value = aiSuggestion.stopLoss;
    elements.stopLossPercent.value = aiSuggestion.stopLossPercent;
    elements.riskRatio.textContent = `R:R ${aiSuggestion.riskRewardRatio}:1`;
    
    // Store in currentSignal for later use
    currentSignal.type = signal;
    currentSignal.price = currentPrice;
    
    // Update profit/loss display
    updateProfitLossDisplay();
    
    updateStatus(elements.globalStatus, `✅ AI Signal: ${signal} ${selectedCoin} | TP: ${aiSuggestion.takeProfitPercent}% | SL: ${aiSuggestion.stopLossPercent}%`, 'success');
    console.log('🧠 Signal generated:', currentSignal);
    console.log('🎯 Risk Management:', aiSuggestion);
}
*/

// ============================================
// ALSO UPDATE executeAITrade function
// ============================================

// ADD THIS CODE at the beginning of executeAITrade (after line 812):
/*
    // Get stop loss and take profit values
    const takeProfit = parseFloat(elements.takeProfitPrice.value);
    const stopLoss = parseFloat(elements.stopLossPrice.value);
    
    // Validate risk management
    const validation = riskManager.validate(
        currentSignal.price,
        stopLoss,
        takeProfit,
        currentSignal.type
    );
    
    if (!validation.valid) {
        updateStatus(elements.globalStatus, `❌ ${validation.errors.join(', ')}`, 'error');
        return;
    }
*/

// ADD THIS CODE after creating trade record (after line 835):
/*
    // Add trade to risk manager for monitoring
    const monitoredTrade = riskManager.addTrade({
        pair: `${trade.coin}/USD`,
        signalType: currentSignal.type,
        entryPrice: currentSignal.price,
        takeProfit,
        stopLoss,
        amount: tradeAmount / currentSignal.price, // Convert USD to coin amount
        amountUSD: tradeAmount,
        percentage: tradePercentage,
        onClose: async (closedTrade) => {
            // Handle trade closure
            console.log('📊 Trade auto-closed:', closedTrade);
            
            // Update balance based on P&L
            const lineraAmount = closedTrade.pnl / LINERA_TO_USD;
            updateBlockchainBalance(lineraAmount);
            
            // Refresh portfolio
            await updatePortfolioStats();
            
            // Show notification
            const message = closedTrade.closeReason === 'take_profit'
                ? `🎯 Take Profit Hit! Profit: +$${closedTrade.pnl.toFixed(2)}`
                : closedTrade.closeReason === 'stop_loss'
                ? `🛡️ Stop Loss Hit! Loss: -$${Math.abs(closedTrade.pnl).toFixed(2)}`
                : `✋ Trade Closed Manually! P&L: ${closedTrade.pnl >= 0 ? '+' : ''}$${closedTrade.pnl.toFixed(2)}`;
            
            updateStatus(elements.globalStatus, message, 
                closedTrade.pnl > 0 ? 'success' : 'error');
            
            // Update history
            updateHistoryEnhanced();
        }
    });
    
    console.log('📊 Trade added to monitoring:', monitoredTrade);
*/
