// Quick fix to add Risk Management to generateSignalEnhanced
// Insert this code after line 942 in main.js

// After: elements.btnExecute.textContent = `Execute ${signal} ${selectedCoin} (${tradePercentage}% - ${tradeAmount.toFixed(0)})`;
// Add:

// Show risk management section
console.log('🎯 Showing Risk Management section');
elements.riskManagement.style.display = 'block';
console.log('🎯 Risk Management display:', elements.riskManagement.style.display);

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

// Update profit/loss display
updateProfitLossDisplay();

// Update status message
updateStatus(elements.globalStatus, `✅ AI Signal: ${signal} ${selectedCoin} | TP: +${aiSuggestion.takeProfitPercent}% | SL: -${aiSuggestion.stopLossPercent}%`, 'success');
console.log('🎯 Risk Management:', aiSuggestion);
