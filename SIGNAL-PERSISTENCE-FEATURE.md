# Signal Persistence Feature

## Overview
Implementasi fitur **Signal Persisten dengan Coin Badge** yang memungkinkan signal tetap ditampilkan meskipun user pindah coin.

## Problem Statement
**Sebelumnya:**
- User generate signal untuk ETH
- User pindah ke BTC untuk cek harga
- Signal ETH hilang → Risk Management section hilang
- User tidak bisa execute trade karena tidak ada TP/SL fields

**Sekarang:**
- User generate signal untuk ETH
- User pindah ke BTC untuk cek harga
- Signal ETH **tetap tampil** dengan badge "ETH"
- Risk Management section **tetap muncul**
- User bisa execute trade kapan saja dalam 15 menit

## Features

### 1. Global Persistent Signal
- Signal disimpan di global state, tidak terikat ke coin yang dipilih
- Signal tetap valid selama 15 menit
- Otomatis expired setelah 15 menit

### 2. Coin Badge
- Menampilkan badge coin di signal header
- Contoh: "HOLD **ETH**" atau "BUY **BTC**"
- Badge berwarna sesuai signal type (BUY/SELL/HOLD)

### 3. Risk Management Persistence
- Stop Loss dan Take Profit fields tetap muncul
- User bisa adjust TP/SL meskipun sudah pindah coin
- Execute trade button tetap aktif

### 4. Signal Age Display
- Menampilkan umur signal (e.g., "3 minutes ago")
- Countdown untuk expiry signal
- Auto-clear setelah 15 menit

## Implementation

### Files Created
1. **`frontend-linera/src/signal-persistence.js`**
   - SignalPersistenceManager class
   - Manages global signal state
   - Handles signal expiry

2. **`frontend-linera/src/signal-persistence-patch.js`**
   - Patch functions for existing code
   - Minimal changes to main.js
   - Easy to integrate

3. **CSS Updates in `frontend-linera/src/style.css`**
   - `.coin-badge` styles
   - Color variants for BUY/SELL/HOLD

### Integration Steps

#### Option A: Manual Integration (Recommended)
Add to `frontend-linera/src/main.js`:

```javascript
// At the top with other imports
import SignalPersistenceManager from './signal-persistence.js';

// After other manager initializations
const signalPersistence = new SignalPersistenceManager();

// In generateSignalEnhanced(), after generating signal:
const activeSignal = signalPersistence.saveActiveSignal(generatedSignal, selectedCoin);

// Update UI with coin badge:
elements.signalAction.innerHTML = `${signal} <span class="coin-badge">${selectedCoin}</span>`;

// In selectCoin(), check for active signal:
const activeSignal = signalPersistence.getActiveSignal();
if (activeSignal) {
    displayActiveSignal(activeSignal);
}
```

#### Option B: Use Patch File
Import the patch file at the end of main.js:

```javascript
import signalPersistencePatch from './signal-persistence-patch.js';

// Apply patches
signalPersistencePatch.initSignalPersistence(elements);
```

## User Experience

### Scenario 1: Generate Signal for ETH
1. User selects ETH
2. Clicks "Generate Signal"
3. Signal shows: "HOLD **ETH**" with badge
4. Risk Management section appears with TP/SL

### Scenario 2: Switch to BTC
1. User clicks BTC button
2. Signal **still shows**: "HOLD **ETH**" (with badge)
3. Risk Management section **still visible**
4. User can still execute ETH trade
5. User can check BTC price while keeping ETH signal active

### Scenario 3: Generate New Signal
1. User wants to trade BTC instead
2. Clicks "Generate Signal" for BTC
3. Old ETH signal replaced with new BTC signal
4. Badge updates to "BUY **BTC**"
5. Risk Management updates for BTC

### Scenario 4: Signal Expiry
1. After 15 minutes, signal auto-expires
2. Risk Management section hides
3. Execute button disabled
4. User must generate new signal

## Technical Details

### Signal Data Structure
```javascript
{
    coin: 'ETH',
    signal: 'HOLD',
    confidence: 0.65,
    riskScore: 22,
    targetPrice: 3150.50,
    timestamp: 1703001234567,
    analysis: { ... }
}
```

### Expiry Logic
- Signal valid for: 15 minutes (900,000 ms)
- Checked on:
  - Coin selection
  - Page load
  - Execute trade attempt
- Auto-cleared when expired

### Coin Badge Styling
```css
.coin-badge {
    background: rgba(41, 98, 255, 0.2);
    color: #2962FF;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 600;
    margin-left: 8px;
}
```

## Benefits

### For Users
✅ Can monitor multiple coins without losing signal
✅ More flexible trading workflow
✅ Clear indication of which coin signal is for
✅ No accidental loss of TP/SL settings

### For Platform
✅ Better UX - less frustration
✅ Professional trading platform feel
✅ Reduced support requests
✅ Higher user engagement

## Testing

### Test Cases
1. ✅ Generate signal for ETH → Switch to BTC → Signal persists
2. ✅ Generate signal for ETH → Wait 15 min → Signal expires
3. ✅ Generate signal for ETH → Switch to BTC → Generate BTC signal → ETH signal replaced
4. ✅ Generate signal → Refresh page → Signal restored (if < 15 min)
5. ✅ Generate signal → Execute trade → Signal cleared

### Manual Testing
```bash
# 1. Start dev server
cd frontend-linera
npm run dev

# 2. Open browser
# 3. Connect wallet
# 4. Generate signal for ETH
# 5. Switch to BTC
# 6. Verify signal still shows with "ETH" badge
# 7. Verify Risk Management section still visible
# 8. Verify Execute button still active
```

## Future Enhancements

### Phase 2 (Optional)
- **Multi-Signal Support**: Show signals for multiple coins simultaneously
- **Signal History**: View past signals in a timeline
- **Signal Notifications**: Alert when signal about to expire
- **Signal Sharing**: Share signal with other users

### Phase 3 (Advanced)
- **Signal Comparison**: Compare signals across coins
- **Signal Performance**: Track signal accuracy over time
- **Auto-Execute**: Execute trade automatically when conditions met

## Deployment

### Build
```bash
cd frontend-linera
npm run build
```

### Deploy to VPS
```bash
scp -r dist/* root@152.42.199.50:/var/www/ai-power-trade/
```

### Verify
```bash
# Open in browser
http://152.42.199.50

# Test signal persistence
# 1. Generate signal
# 2. Switch coins
# 3. Verify signal persists
```

## Rollback Plan
If issues occur:
1. Remove import of `signal-persistence.js`
2. Revert `generateSignalEnhanced()` changes
3. Revert `selectCoin()` changes
4. Remove `.coin-badge` CSS
5. Redeploy previous version

## Support
- Documentation: This file
- Code: `frontend-linera/src/signal-persistence.js`
- Patch: `frontend-linera/src/signal-persistence-patch.js`
- CSS: `frontend-linera/src/style.css` (search for `.coin-badge`)

---

**Status**: ✅ Ready for Integration
**Priority**: High
**Complexity**: Medium
**Impact**: High (Better UX)
