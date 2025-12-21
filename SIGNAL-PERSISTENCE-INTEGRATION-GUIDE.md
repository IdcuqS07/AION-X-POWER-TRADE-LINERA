# Signal Persistence Integration Guide

## Quick Integration Steps

### Step 1: Import SignalPersistenceManager
Di `frontend-linera/src/main.js`, tambahkan import setelah WalletManager:

```javascript
import WalletManager from './wallet-manager.js';
import SignalPersistenceManager from './signal-persistence.js';  // ← ADD THIS
```

### Step 2: Initialize Manager
Setelah `const walletManager = new WalletManager();`, tambahkan:

```javascript
const walletManager = new WalletManager();
const signalPersistence = new SignalPersistenceManager();  // ← ADD THIS
```

### Step 3: Update generateSignalEnhanced()
Cari baris ini (sekitar line 1018):
```javascript
currentSignal = generateRealSignal(selectedCoin, currentPrice, aiExplainer, info);
```

Ganti dengan:
```javascript
const generatedSignal = generateRealSignal(selectedCoin, currentPrice, aiExplainer, info);
currentSignal = generatedSignal;
activeSignal = signalPersistence.saveActiveSignal(generatedSignal, selectedCoin);
```

### Step 4: Add Coin Badge
Cari baris ini (sekitar line 1027):
```javascript
elements.signalAction.textContent = `${signal} ${selectedCoin}`;
```

Ganti dengan:
```javascript
elements.signalAction.innerHTML = `${signal} <span class="coin-badge">${selectedCoin}</span>`;
```

### Step 5: Update selectCoin()
Cari fungsi `selectCoin()` (sekitar line 905), setelah:
```javascript
console.log('💰 Selected coin:', coin);
```

Tambahkan:
```javascript
// Check if there's an active signal (persistent across coin changes)
const persistedSignal = signalPersistence.getActiveSignal();
if (persistedSignal) {
    console.log('📊 Active signal exists for:', persistedSignal.coin);
    activeSignal = persistedSignal;
    displayActiveSignal();
}
```

### Step 6: Update displayActiveSignal()
Cari fungsi `displayActiveSignal()` (sekitar line 935), ganti bagian awal:

DARI:
```javascript
function displayActiveSignal() {
    if (!activeSignal) {
        console.log('⚠️ No active signal to display');
        return;
    }
    
    // Check if signal is still valid (within 15 minutes)
    const signalAge = Date.now() - activeSignal.timestamp;
    const FIFTEEN_MINUTES = 15 * 60 * 1000;
    
    if (signalAge > FIFTEEN_MINUTES) {
        console.log('⏱️ Active signal expired, clearing...');
        activeSignal = null;
        currentSignal = null;
        elements.riskManagement.style.display = 'none';
        elements.btnExecute.disabled = true;
        return;
    }
```

MENJADI:
```javascript
function displayActiveSignal() {
    // Get active signal from persistence manager
    const persistedSignal = signalPersistence.getActiveSignal();
    
    if (!persistedSignal) {
        console.log('⚠️ No active signal to display');
        elements.riskManagement.style.display = 'none';
        elements.btnExecute.disabled = true;
        return;
    }
    
    // Set as active signal
    activeSignal = persistedSignal;
    currentSignal = persistedSignal;
```

### Step 7: Update executeAITrade()
Cari fungsi `executeAITrade()` (sekitar line 1090), setelah execute trade berhasil, tambahkan:

```javascript
// Clear active signal after execution
signalPersistence.clearActiveSignal();
activeSignal = null;
```

## Testing

### Test 1: Basic Persistence
1. Generate signal untuk ETH
2. Lihat badge "ETH" muncul
3. Switch ke BTC
4. Verify signal ETH masih tampil
5. Risk Management section masih visible

### Test 2: Execute Trade
1. Generate signal untuk ETH
2. Switch ke BTC
3. Execute trade (harus execute ETH, bukan BTC)
4. Verify signal cleared setelah execute

### Test 3: Signal Expiry
1. Generate signal
2. Wait 15 minutes
3. Switch coin
4. Verify signal auto-cleared

### Test 4: New Signal
1. Generate signal untuk ETH
2. Switch ke BTC
3. Generate signal untuk BTC
4. Verify ETH signal replaced dengan BTC signal

## Verification Commands

```bash
# Build
cd frontend-linera
npm run build

# Deploy to VPS
scp -r dist/* root@152.42.199.50:/var/www/ai-power-trade/

# Test locally
npm run dev
# Open http://localhost:5173
```

## Rollback

If issues occur, revert these changes:
1. Remove `import SignalPersistenceManager`
2. Remove `const signalPersistence`
3. Revert `generateSignalEnhanced()` changes
4. Revert `selectCoin()` changes
5. Revert `displayActiveSignal()` changes
6. Change `.innerHTML` back to `.textContent`

## Files Modified
- ✅ `frontend-linera/src/main.js` (7 changes)
- ✅ `frontend-linera/src/style.css` (coin badge styles already added)

## Files Created
- ✅ `frontend-linera/src/signal-persistence.js`
- ✅ `frontend-linera/src/signal-persistence-patch.js`
- ✅ `SIGNAL-PERSISTENCE-FEATURE.md`
- ✅ `SIGNAL-PERSISTENCE-INTEGRATION-GUIDE.md`

## Support
If you encounter issues:
1. Check browser console for errors
2. Verify all imports are correct
3. Check if `signalPersistence` is initialized
4. Test with `console.log(signalPersistence.getActiveSignal())`
