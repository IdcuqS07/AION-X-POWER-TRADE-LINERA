/**
 * Signal Persistence Patch
 * Adds persistent signal display across coin changes
 * 
 * Usage: Import this file AFTER main.js to patch the functionality
 */

import SignalPersistenceManager from './signal-persistence.js';

// Initialize persistence manager
const signalPersistence = new SignalPersistenceManager();

// Store reference to original functions
let originalGenerateSignalEnhanced = null;
let originalSelectCoin = null;
let originalExecuteAITrade = null;

/**
 * Patch generateSignalEnhanced to save to persistent storage
 */
export function patchGenerateSignal(generateSignalFn, elements, marketManager, aiExplainer, lineraManager, signalCooldown, generateRealSignal, riskManager, portfolio, tradePercentage, updateStatus) {
    return function generateSignalEnhancedPatched() {
        const info = lineraManager.getWalletInfo();
        
        if (!info.chainId) {
            alert('Please create a wallet first');
            return;
        }
        
        // Get selected coin from UI
        const selectedCoinBtn = document.querySelector('.coin-btn.active');
        const selectedCoin = selectedCoinBtn ? selectedCoinBtn.dataset.coin : 'BTC';
        
        // Check cooldown (15 minutes)
        if (!signalCooldown.canGenerate(selectedCoin)) {
            const remaining = signalCooldown.getRemainingTimeFormatted(selectedCoin);
            alert(`⏱️ Please wait ${remaining} before generating a new signal for ${selectedCoin}\n\nSignals update every 15 minutes for accuracy.`);
            return;
        }
        
        updateStatus(elements.globalStatus, `🧠 AI analyzing ${selectedCoin}...`, 'info');
        
        // Get current price
        const currentPrice = marketManager.getPrice(selectedCoin);
        if (!currentPrice) {
            alert('Market data not available. Please update prices first.');
            return;
        }
        
        // Generate REAL AI signal using technical analysis
        const generatedSignal = generateRealSignal(selectedCoin, currentPrice, aiExplainer, info);
        const signal = generatedSignal.signal;
        const confidence = generatedSignal.confidence;
        const riskScore = generatedSignal.riskScore;
        const targetPrice = generatedSignal.targetPrice;
        
        // Save to persistent storage (GLOBAL - not tied to coin)
        const activeSignal = signalPersistence.saveActiveSignal(generatedSignal, selectedCoin);
        
        // Save signal with cooldown
        signalCooldown.saveSignal(selectedCoin, generatedSignal);
        
        // Update UI with coin badge
        elements.currentSignal.className = `signal signal-${signal.toLowerCase()}`;
        elements.signalAction.innerHTML = `${signal} <span class="coin-badge">${selectedCoin}</span>`;
        elements.signalConfidence.textContent = `${(confidence * 100).toFixed(1)}%`;
        elements.confidenceText.textContent = `${(confidence * 100).toFixed(1)}%`;
        elements.confidenceBar.style.width = `${confidence * 100}%`;
        elements.riskText.textContent = `${riskScore}/100`;
        elements.riskBar.style.width = `${riskScore}%`;
        elements.targetPrice.textContent = `${targetPrice.toFixed(2)}`;
        
        // Enable execute button with percentage
        elements.btnExecute.disabled = false;
        const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
        elements.btnExecute.textContent = `Execute ${signal} ${selectedCoin} (${tradePercentage}% - ${tradeAmount.toFixed(0)})`;
        
        // Show risk management section
        console.log('🎯 Showing Risk Management section');
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
        
        // Update profit/loss display
        if (window.updateProfitLossDisplay) {
            window.updateProfitLossDisplay();
        }
        
        updateStatus(elements.globalStatus, `✅ AI Signal: ${signal} ${selectedCoin} | TP: +${aiSuggestion.takeProfitPercent}% | SL: -${aiSuggestion.stopLossPercent}%`, 'success');
        console.log('🧠 Signal generated with PERSISTENCE:', activeSignal);
        
        return activeSignal;
    };
}

/**
 * Patch selectCoin to maintain signal display
 */
export function patchSelectCoin(selectCoinFn, elements) {
    return function selectCoinPatched(event) {
        const coin = event.target.dataset.coin;
        if (!coin) return;
        
        // Update UI - FAST, no heavy operations
        document.querySelectorAll('.coin-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        console.log('💰 Selected coin:', coin);
        
        // Check if there's an active signal (persistent across coin changes)
        const activeSignal = signalPersistence.getActiveSignal();
        if (activeSignal) {
            console.log('📊 Active signal exists for:', activeSignal.coin);
            // Keep showing the active signal even if different coin selected
            displayActiveSignal(activeSignal, elements);
        }
        
        // Update AI Explainer link
        const explainerBtn = document.getElementById('btn-ai-explainer');
        if (explainerBtn) {
            explainerBtn.href = `/ai-explainer.html?coin=${coin}`;
        }
    };
}

/**
 * Display active signal (persistent across coin changes)
 */
function displayActiveSignal(activeSignal, elements) {
    if (!activeSignal) {
        console.log('⚠️ No active signal to display');
        return;
    }
    
    const signal = activeSignal.signal;
    const confidence = activeSignal.confidence;
    const riskScore = activeSignal.riskScore;
    const targetPrice = activeSignal.targetPrice;
    const signalCoin = activeSignal.coin;
    
    // Update UI with coin badge
    elements.currentSignal.className = `signal signal-${signal.toLowerCase()}`;
    elements.signalAction.innerHTML = `${signal} <span class="coin-badge">${signalCoin}</span>`;
    elements.signalConfidence.textContent = `${(confidence * 100).toFixed(1)}%`;
    elements.confidenceText.textContent = `${(confidence * 100).toFixed(1)}%`;
    elements.confidenceBar.style.width = `${confidence * 100}%`;
    elements.riskText.textContent = `${riskScore}/100`;
    elements.riskBar.style.width = `${riskScore}%`;
    elements.targetPrice.textContent = `${targetPrice.toFixed(2)}`;
    
    // Show risk management section
    elements.riskManagement.style.display = 'block';
    
    // Enable execute button
    elements.btnExecute.disabled = false;
    
    console.log('✅ Active signal displayed:', {
        coin: signalCoin,
        signal: signal,
        age: signalPersistence.getSignalAgeFormatted()
    });
}

/**
 * Patch executeAITrade to use active signal
 */
export function patchExecuteAITrade(executeAITradeFn, elements, signalPersistence) {
    return function executeAITradePatched() {
        const activeSignal = signalPersistence.getActiveSignal();
        
        if (!activeSignal) {
            alert('Please generate a signal first');
            return;
        }
        
        // Execute with active signal (not selected coin)
        console.log(`⚡ Executing trade for ${activeSignal.coin} (active signal)`);
        
        // Call original function with active signal
        return executeAITradeFn.call(this, activeSignal);
    };
}

/**
 * Initialize persistence on page load
 */
export function initSignalPersistence(elements) {
    // Check if there's an active signal on page load
    const activeSignal = signalPersistence.getActiveSignal();
    if (activeSignal) {
        console.log('🔄 Restoring active signal from previous session');
        displayActiveSignal(activeSignal, elements);
    }
}

// Export persistence manager for external use
export { signalPersistence };
export default {
    patchGenerateSignal,
    patchSelectCoin,
    patchExecuteAITrade,
    initSignalPersistence,
    signalPersistence
};
