# Risk Management Auto-Calculate Fix

## Problem Fixed
Risk Management profit/loss calculation was showing "$0.00" when inputting take profit/stop loss prices.

## Root Cause
The `currentSignal` object was missing the `type` and `price` properties that the `updateProfitLossDisplay()` function needed for calculations.

## Changes Made

### 1. Added Missing Properties to currentSignal (line 820-832)
```javascript
currentSignal = {
    coin: selectedCoin,
    signal: signal,
    type: signal,        // ✅ ADDED - needed for risk calculations
    price: currentPrice, // ✅ ADDED - needed for entry price
    confidence: confidence,
    riskScore: riskScore,
    targetPrice: targetPrice,
    currentPrice: currentPrice,
    timestamp: new Date(),
    chainId: info.chainId
};
```

### 2. Added Fallback Logic in updateProfitLossDisplay (line 1260-1262)
```javascript
const entryPrice = currentSignal.price || currentSignal.currentPrice;
const signalType = currentSignal.type || currentSignal.signal;
```

### 3. Updated Display Format (line 1270-1285)
- Changed from `$${value}` to `+$${value}` for take profit
- Changed from `$${value}` to `-$${value}` for stop loss
- Now uses `signalType` variable instead of `currentSignal.type`

## How to Test

### Step 1: Open Application
```
http://152.42.199.50
```

### Step 2: Connect Wallet
1. Click "Connect Wallet" button
2. Wait for wallet creation

### Step 3: Update Market Data
1. Click "Update Prices" button
2. Verify BTC, ETH, SOL, BNB prices are loaded

### Step 4: Generate Signal
1. Select BTC (should be default)
2. Click "Generate AI Signal" button
3. Verify signal appears with confidence and risk score

### Step 5: Test Risk Management Auto-Calculate
1. Look at "⚙️ Risk Management" section
2. You should see AI-suggested values already filled in:
   - Take Profit Price: ~45000 (example)
   - Take Profit %: ~5%
   - Stop Loss Price: ~40000 (example)
   - Stop Loss %: ~3%

3. **TEST 1: Change Take Profit Price**
   - Input: `45000`
   - Expected: 
     - Take Profit % updates automatically
     - Profit shows: `+$XXX.XX` (not $0.00)

4. **TEST 2: Change Take Profit Percentage**
   - Input: `10`
   - Expected:
     - Take Profit Price updates automatically
     - Profit shows: `+$XXX.XX`

5. **TEST 3: Change Stop Loss Price**
   - Input: `40000`
   - Expected:
     - Stop Loss % updates automatically
     - Loss shows: `-$XXX.XX` (not $0.00)

6. **TEST 4: Change Stop Loss Percentage**
   - Input: `5`
   - Expected:
     - Stop Loss Price updates automatically
     - Loss shows: `-$XXX.XX`

7. **TEST 5: Move Trade Amount Slider**
   - Move slider to 50%
   - Expected:
     - Trade Amount USD updates
     - Profit and Loss values recalculate automatically

## Expected Behavior

### Before Fix
- Input TP Price: 45000
- Result: "Profit: +$0.00" ❌

### After Fix
- Input TP Price: 45000
- Result: "Profit: +$125.50" ✅ (example value)

## Technical Details

### Calculation Flow
1. User generates signal → `currentSignal` created with `type` and `price`
2. User inputs TP price → Event listener fires
3. `updateProfitLossDisplay()` called
4. Calculates:
   - `tradeAmount = (portfolioValue * tradePercentage) / 100`
   - `coinAmount = tradeAmount / entryPrice`
   - `profit = riskManager.calculateProfitLoss(entryPrice, tpPrice, coinAmount, signalType)`
5. Updates UI with formatted value: `+$XXX.XX`

### Risk Manager Calculation
```javascript
calculateProfitLoss(entryPrice, targetPrice, amount, signalType) {
    const priceDiff = targetPrice - entryPrice;
    const profitLoss = signalType === 'BUY' ? priceDiff * amount : -priceDiff * amount;
    return Math.round(profitLoss * 100) / 100;
}
```

## Files Modified
- `frontend-linera/src/main.js` (3 changes)

## Deployment
```bash
# Build
cd frontend-linera && npm run build

# Deploy
scp -r frontend-linera/dist/* root@152.42.199.50:/var/www/ai-power-trade/

# Clear cache
ssh root@152.42.199.50 "systemctl reload nginx"
```

## Browser Testing
**IMPORTANT:** Use hard refresh to see changes:
- Chrome/Edge: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or use Incognito/Private mode

## Status
✅ **DEPLOYED** - Live at http://152.42.199.50

## Next Steps
If you still see "$0.00":
1. Open browser console (F12)
2. Generate a signal
3. Input a TP price
4. Check console for any errors
5. Verify `currentSignal` object has `type` and `price` properties
