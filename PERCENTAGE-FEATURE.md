# 💰 Trade Percentage Feature

## Overview
Added trade percentage slider (10%-100%) to AI Trading Signal for better risk management and position sizing.

## Features

### 1. **Percentage Slider**
- Range: 10% - 100%
- Step: 5%
- Visual gradient indicator
- Real-time updates

### 2. **Amount Calculation**
- Automatically calculates USD amount based on portfolio value
- Formula: `tradeAmount = (portfolioValue × percentage) / 100`
- Default: 25% ($2,500 of $10,000 portfolio)

### 3. **UI Integration**
- Display in signal card
- Show in execute button: `Execute BUY BTC (25% - $2,500)`
- Include in trade history with percentage and amount

## Usage

### For Users:
1. Generate AI signal
2. Adjust percentage slider (10%-100%)
3. See real-time amount calculation
4. Execute trade with selected percentage

### Example:
```
Portfolio: $10,000
Slider: 50%
Trade Amount: $5,000
Button: "Execute BUY BTC (50% - $5,000)"
```

## Files Modified

### 1. `frontend-linera/index.html`
```html
<div class="trade-amount-section">
    <div class="amount-header">
        <label>💰 Trade Amount</label>
        <span class="amount-display">
            <span id="trade-percentage">25</span>% 
            (<span id="trade-amount-usd">$2,500</span>)
        </span>
    </div>
    <input type="range" id="trade-percentage-slider" 
           min="10" max="100" value="25" step="5" />
</div>
```

### 2. `frontend-linera/src/style.css`
- Added `.trade-amount-section` styling
- Gradient slider with custom thumb
- Responsive percentage marks

### 3. `frontend-linera/src/main.js`
- Added `tradePercentage` state variable
- Added `updateTradeAmount()` function
- Updated `executeAITrade()` to use percentage
- Updated `generateSignalEnhanced()` to show percentage in button
- Updated `updateHistoryEnhanced()` to display percentage in history

## Code Changes

### State Management:
```javascript
let tradePercentage = 25; // Default 25%
```

### Event Listener:
```javascript
elements.tradePercentageSlider.addEventListener('input', (e) => {
    tradePercentage = parseInt(e.target.value);
    updateTradeAmount();
});
```

### Amount Calculation:
```javascript
function updateTradeAmount() {
    const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
    elements.tradePercentage.textContent = tradePercentage;
    elements.tradeAmountUsd.textContent = `$${tradeAmount.toFixed(0)}`;
}
```

### Trade Execution:
```javascript
const tradeAmount = (portfolio.totalValue * tradePercentage) / 100;
const trade = {
    amount: tradeAmount,
    percentage: tradePercentage,
    // ... other fields
};
```

## Testing

### Quick Test:
```bash
./test-percentage-feature.sh
```

### Manual Test:
1. Open `frontend-linera/test-percentage.html` in browser
2. Move slider and verify calculations
3. Check button text updates

### Full Integration Test:
```bash
cd frontend-linera
npm run dev
# Open http://localhost:5173
# Test with real trading flow
```

## Benefits

1. **Risk Management**: Control position size per trade
2. **Flexibility**: Quick adjustment from 10% to 100%
3. **Transparency**: See exact USD amount before execution
4. **History Tracking**: Review past trades with percentages
5. **User Experience**: Visual feedback with gradient slider

## Future Enhancements

- [ ] Save default percentage preference
- [ ] Add preset buttons (10%, 25%, 50%, 100%)
- [ ] Show risk level based on percentage
- [ ] Add max loss calculation
- [ ] Portfolio allocation visualization

## Screenshots

### Slider at 25%:
```
💰 Trade Amount: 25% ($2,500)
[====|--------------------] 10% 25% 50% 75% 100%
```

### Slider at 75%:
```
💰 Trade Amount: 75% ($7,500)
[===============|-----] 10% 25% 50% 75% 100%
```

### Trade History:
```
BUY BTC/USD
12:34:56 PM • 50%
$42,500
85% conf • $5,000
```

---

**Status**: ✅ Implemented and Ready
**Version**: 1.0.0
**Date**: December 19, 2025
