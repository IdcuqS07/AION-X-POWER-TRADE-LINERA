#!/usr/bin/env python3
"""
Trade Confirmation Modal Patch
Adds confirmation modal before executing trades
"""

import re

# Read main.js
with open('frontend-linera/src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace executeAITrade function
old_function_pattern = r'function executeAITrade\(\) \{[^}]*\{[^}]*\}[^}]*\}[\s\S]*?(?=\n\n/\*\*\n \* Update portfolio statistics)'

new_functions = '''function executeAITrade() {
    if (!currentSignal) {
        alert('Please generate a signal first');
        return;
    }
    
    // Show confirmation modal instead of executing directly
    showTradeConfirmationModal();
}

/**
 * Show trade confirmation modal
 */
function showTradeConfirmationModal() {
    if (!currentSignal) return;
    
    // Calculate trade amount based on percentage
    const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
    
    // Get risk management values
    const stopLossPrice = elements.stopLossPrice.value || '-';
    const stopLossPercent = elements.stopLossPercent.textContent || '-';
    const takeProfitPrice = elements.takeProfitPrice.value || '-';
    const takeProfitPercent = elements.takeProfitPercent.textContent || '-';
    
    // Populate modal with trade details
    elements.confirmSignal.innerHTML = `<strong style="color: ${getSignalColor(currentSignal.signal)}">${currentSignal.signal}</strong> ${currentSignal.coin}`;
    elements.confirmAmount.textContent = `${tradeAmount.toFixed(2)} USDT (${tradePercentage}% of portfolio)`;
    elements.confirmPrice.textContent = `$${currentSignal.targetPrice.toFixed(2)}`;
    elements.confirmConfidence.textContent = `${(currentSignal.confidence * 100).toFixed(1)}%`;
    elements.confirmRisk.textContent = `${currentSignal.riskScore}/100`;
    elements.confirmStopLoss.textContent = `$${stopLossPrice} (${stopLossPercent})`;
    elements.confirmTakeProfit.textContent = `$${takeProfitPrice} (${takeProfitPercent})`;
    
    // Show modal
    elements.tradeConfirmModalOverlay.classList.remove('hidden');
    
    console.log('📋 Trade confirmation modal shown');
}

/**
 * Get signal color based on type
 */
function getSignalColor(signal) {
    switch(signal.toUpperCase()) {
        case 'BUY': return '#26A69A';
        case 'SELL': return '#EF5350';
        case 'HOLD': return '#FF9800';
        default: return '#FFFFFF';
    }
}

/**
 * Execute trade after confirmation
 */
function executeTradeConfirmed() {
    if (!currentSignal) {
        alert('No signal to execute');
        return;
    }
    
    // Hide modal
    elements.tradeConfirmModalOverlay.classList.add('hidden');
    
    // Calculate trade amount based on percentage
    const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
    
    updateStatus(elements.globalStatus, `⚡ Executing ${tradePercentage}% trade (${tradeAmount.toFixed(0)})...`, 'info');
    
    // Create trade record
    const trade = {
        id: Date.now(),
        coin: currentSignal.coin,
        type: currentSignal.signal,
        amount: tradeAmount,
        percentage: tradePercentage,
        price: currentSignal.targetPrice,
        confidence: currentSignal.confidence,
        timestamp: new Date(),
        chainId: currentSignal.chainId
    };
    
    // Add to trading manager
    tradingManager.addToHistory({
        ...trade,
        pair: `${trade.coin}/USD`,
        executedAt: trade.timestamp.toLocaleTimeString()
    });
    
    // Update displays
    updateHistoryEnhanced();
    updatePortfolioStats();
    
    updateStatus(elements.globalStatus, `✅ Trade executed: ${trade.type} ${trade.coin} (${tradePercentage}% - ${tradeAmount.toFixed(0)})`, 'success');
    console.log('⚡ Trade executed:', trade);
    
    // Clear active signal after execution
    // Signal cleared (stored per-coin in signalCooldown)
    activeSignal = null;
    currentSignal = null;
    
    // Hide risk management section
    elements.riskManagement.style.display = 'none';
    
    // Update visual indicators (remove highlight)
    updateCoinButtonIndicators();
    
    // Disable execute button until new signal
    elements.btnExecute.disabled = true;
}

/**
 * Close trade confirmation modal
 */
function closeTradeConfirmationModal() {
    elements.tradeConfirmModalOverlay.classList.add('hidden');
    console.log('❌ Trade confirmation cancelled');
}

'''

content = re.sub(old_function_pattern, new_functions, content)

# Write back
with open('frontend-linera/src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Trade confirmation functions patched successfully!")
