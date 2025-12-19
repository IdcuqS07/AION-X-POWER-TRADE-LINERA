# 🎯 Risk Management Implementation - Stop Loss & Take Profit

## ✅ Completed

### 1. Real Balance from Blockchain
- ✅ Added `queryBlockchainBalance()` function
- ✅ Added `updateBlockchainBalance()` function  
- ✅ Modified `updatePortfolioStats()` to query real balance
- ✅ Integrated with faucet claim to update balance
- ✅ LINERA to USD conversion (1 LINERA = $1.5)

### 2. Risk Management Module
- ✅ Created `frontend-linera/src/risk-management.js`
- ✅ `RiskManager` class with full functionality:
  - AI-suggested stop loss/take profit based on confidence
  - Manual price/percentage input support
  - Trade validation
  - Active trade monitoring
  - Auto-close on stop loss/take profit trigger
  - Background price monitoring (every 5 seconds)

### 3. UI Components
- ✅ Added HTML for Stop Loss & Take Profit section
- ✅ Added CSS styling for risk management UI
- ✅ Take Profit inputs (price & percentage)
- ✅ Stop Loss inputs (price & percentage)
- ✅ AI Suggest buttons
- ✅ Risk/Reward ratio display
- ✅ Profit/Loss preview

### 4. Integration
- ✅ Imported `RiskManager` in main.js
- ✅ Added DOM element references
- ✅ Initialized `riskManager` instance

## 🔄 In Progress / To Do

### 5. Event Listeners (Need to Add)

```javascript
// Show risk management when signal is generated
elements.btnSignal.addEventListener('click', () => {
    // ... existing code ...
    
    // Show risk management section
    elements.riskManagement.style.display = 'block';
    
    // Calculate AI suggestions
    const aiSuggestion = riskManager.calculateAISuggestion(
        signal.price,
        signal.confidence,
        signal.type
    );
    
    // Populate fields
    elements.takeProfitPrice.value = aiSuggestion.takeProfit;
    elements.takeProfitPercent.value = aiSuggestion.takeProfitPercent;
    elements.stopLossPrice.value = aiSuggestion.stopLoss;
    elements.stopLossPercent.value = aiSuggestion.stopLossPercent;
    elements.riskRatio.textContent = `R:R ${aiSuggestion.riskRewardRatio}:1`;
    
    // Update profit/loss display
    updateProfitLossDisplay();
});

// AI Suggest Take Profit
elements.btnAiTp.addEventListener('click', () => {
    if (!currentSignal) return;
    
    const aiSuggestion = riskManager.calculateAISuggestion(
        currentSignal.price,
        currentSignal.confidence,
        currentSignal.type
    );
    
    elements.takeProfitPrice.value = aiSuggestion.takeProfit;
    elements.takeProfitPercent.value = aiSuggestion.takeProfitPercent;
    updateProfitLossDisplay();
});

// AI Suggest Stop Loss
elements.btnAiSl.addEventListener('click', () => {
    if (!currentSignal) return;
    
    const aiSuggestion = riskManager.calculateAISuggestion(
        currentSignal.price,
        currentSignal.confidence,
        currentSignal.type
    );
    
    elements.stopLossPrice.value = aiSuggestion.stopLoss;
    elements.stopLossPercent.value = aiSuggestion.stopLossPercent;
    updateProfitLossDisplay();
});

// Take Profit Price input - update percentage
elements.takeProfitPrice.addEventListener('input', (e) => {
    if (!currentSignal) return;
    
    const price = parseFloat(e.target.value);
    if (isNaN(price)) return;
    
    const percent = riskManager.calculatePercentFromPrice(
        currentSignal.price,
        price,
        currentSignal.type
    );
    
    elements.takeProfitPercent.value = Math.abs(percent).toFixed(2);
    updateProfitLossDisplay();
});

// Take Profit Percentage input - update price
elements.takeProfitPercent.addEventListener('input', (e) => {
    if (!currentSignal) return;
    
    const percent = parseFloat(e.target.value);
    if (isNaN(percent)) return;
    
    const price = riskManager.calculatePriceFromPercent(
        currentSignal.price,
        percent,
        currentSignal.type
    );
    
    elements.takeProfitPrice.value = price.toFixed(2);
    updateProfitLossDisplay();
});

// Stop Loss Price input - update percentage
elements.stopLossPrice.addEventListener('input', (e) => {
    if (!currentSignal) return;
    
    const price = parseFloat(e.target.value);
    if (isNaN(price)) return;
    
    const percent = riskManager.calculatePercentFromPrice(
        currentSignal.price,
        price,
        currentSignal.type
    );
    
    elements.stopLossPercent.value = Math.abs(percent).toFixed(2);
    updateProfitLossDisplay();
});

// Stop Loss Percentage input - update price
elements.stopLossPercent.addEventListener('input', (e) => {
    if (!currentSignal) return;
    
    const percent = parseFloat(e.target.value);
    if (isNaN(percent)) return;
    
    const price = riskManager.calculatePriceFromPercent(
        currentSignal.price,
        -percent, // Negative for stop loss
        currentSignal.type
    );
    
    elements.stopLossPrice.value = price.toFixed(2);
    updateProfitLossDisplay();
});

// Update profit/loss display
function updateProfitLossDisplay() {
    if (!currentSignal) return;
    
    const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
    const entryPrice = currentSignal.price;
    const tpPrice = parseFloat(elements.takeProfitPrice.value);
    const slPrice = parseFloat(elements.stopLossPrice.value);
    
    if (!isNaN(tpPrice)) {
        const tpProfit = riskManager.calculateProfitLoss(
            entryPrice,
            tpPrice,
            tradeAmount / entryPrice, // Convert USD to coin amount
            currentSignal.type
        );
        elements.tpProfit.textContent = `$${Math.abs(tpProfit).toFixed(2)}`;
    }
    
    if (!isNaN(slPrice)) {
        const slLoss = riskManager.calculateProfitLoss(
            entryPrice,
            slPrice,
            tradeAmount / entryPrice,
            currentSignal.type
        );
        elements.slLoss.textContent = `$${Math.abs(slLoss).toFixed(2)}`;
    }
    
    // Update risk/reward ratio
    if (!isNaN(tpPrice) && !isNaN(slPrice)) {
        const reward = Math.abs(tpPrice - entryPrice);
        const risk = Math.abs(entryPrice - slPrice);
        const ratio = (reward / risk).toFixed(2);
        elements.riskRatio.textContent = `R:R ${ratio}:1`;
    }
}
```

### 6. Execute Trade with Risk Management

```javascript
elements.btnExecute.addEventListener('click', async () => {
    // ... existing validation ...
    
    // Get stop loss and take profit
    const takeProfit = parseFloat(elements.takeProfitPrice.value);
    const stopLoss = parseFloat(elements.stopLossPrice.value);
    
    // Validate
    const validation = riskManager.validate(
        currentSignal.price,
        stopLoss,
        takeProfit,
        currentSignal.type
    );
    
    if (!validation.valid) {
        updateStatus(elements.globalStatus, validation.errors.join(', '), 'error');
        return;
    }
    
    // Execute trade
    const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
    
    // Add to risk manager for monitoring
    const trade = riskManager.addTrade({
        pair: `${selectedCoin}/USD`,
        signalType: currentSignal.type,
        entryPrice: currentSignal.price,
        takeProfit,
        stopLoss,
        amount: tradeAmount / currentSignal.price,
        amountUSD: tradeAmount,
        percentage: tradePercentage,
        onClose: (closedTrade) => {
            // Handle trade closure
            console.log('Trade closed:', closedTrade);
            
            // Update balance
            if (closedTrade.pnl > 0) {
                updateBlockchainBalance(closedTrade.pnl / LINERA_TO_USD);
            } else {
                updateBlockchainBalance(closedTrade.pnl / LINERA_TO_USD);
            }
            
            // Refresh portfolio
            updatePortfolioStats();
            
            // Show notification
            const message = closedTrade.closeReason === 'take_profit'
                ? `🎯 Take Profit Hit! +$${closedTrade.pnl.toFixed(2)}`
                : `🛡️ Stop Loss Hit! -$${Math.abs(closedTrade.pnl).toFixed(2)}`;
            
            updateStatus(elements.globalStatus, message, 
                closedTrade.pnl > 0 ? 'success' : 'error');
        }
    });
    
    console.log('Trade added to monitoring:', trade);
    
    // ... rest of existing code ...
});
```

### 7. Display Active Trades

Add a new section to show active trades being monitored:

```html
<!-- Active Trades Monitoring -->
<div class="card">
    <h3>📊 Active Trades</h3>
    <div id="active-trades-container">
        <div class="status info">No active trades</div>
    </div>
</div>
```

## 📋 Testing Checklist

- [ ] Generate signal → Risk management section appears
- [ ] AI Suggest buttons populate correct values
- [ ] Manual price input updates percentage
- [ ] Manual percentage input updates price
- [ ] Validation prevents invalid stop loss/take profit
- [ ] Execute trade adds to monitoring
- [ ] Background monitoring checks prices every 5 seconds
- [ ] Stop loss triggers auto-close
- [ ] Take profit triggers auto-close
- [ ] Balance updates after trade closes
- [ ] Faucet claim updates balance correctly
- [ ] Portfolio displays real balance from blockchain

## 🚀 Next Steps

1. Add event listeners to main.js
2. Test signal generation with risk management
3. Test AI suggestions
4. Test manual input (price ↔ percentage sync)
5. Test trade execution with monitoring
6. Test auto-close on stop loss/take profit
7. Add active trades display
8. Deploy to VPS
9. Test on live site

## 📝 Notes

- Currently using localStorage to simulate blockchain balance
- Price monitoring is mocked (±2% volatility)
- Need to integrate with real market data API
- Need to integrate with real Linera blockchain balance query
- Consider adding trade history persistence
- Consider adding notifications/alerts for trade closures
