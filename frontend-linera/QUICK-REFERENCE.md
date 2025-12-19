# Quick Reference Guide

## 🚀 Live Demo
**URL:** http://152.42.199.50

## 📋 Quick Test Checklist

### 1. Initial Load (5 seconds)
- [ ] Page loads successfully
- [ ] Header shows "AI POWER TRADE"
- [ ] "Connect Wallet" button visible (top-right)
- [ ] 7 cards displayed
- [ ] Market data loads automatically (~2s)
- [ ] Prices show for BTC, ETH, SOL, BNB

### 2. Wallet Connection (10 seconds)
- [ ] Click "Connect Wallet" button
- [ ] Dropdown appears
- [ ] Click "Create New Wallet"
- [ ] Loading steps show (1→2→3)
- [ ] Wallet created successfully
- [ ] Chain ID displayed
- [ ] Owner address displayed
- [ ] Button changes to chain ID (e.g., "5f650b...")

### 3. Market Data (5 seconds)
- [ ] BTC price displayed (e.g., $95,234)
- [ ] ETH price displayed (e.g., $3,456)
- [ ] SOL price displayed (e.g., $98.45)
- [ ] BNB price displayed (e.g., $612.34)
- [ ] 24h change % shown (green ↑ or red ↓)
- [ ] Click "Update Prices" - data refreshes

### 4. Platform Selection (5 seconds)
- [ ] Platform dropdown shows 7 options
- [ ] Select "Binance"
- [ ] Platform info updates
- [ ] Click "Connect to Platform"
- [ ] Status changes to "Connected" (green)

### 5. AI Signal Generation (10 seconds)
- [ ] Click coin button (BTC/ETH/SOL/BNB)
- [ ] Selected coin highlighted (green)
- [ ] Click "Generate New Signal"
- [ ] Signal displays (BUY/SELL/HOLD)
- [ ] Confidence bar shows (60-100%)
- [ ] Risk bar shows (20-80)
- [ ] Target price displayed
- [ ] "Execute" button enabled

### 6. Trade Execution (5 seconds)
- [ ] Click "Execute AI Trade"
- [ ] Success message appears
- [ ] Trade appears in history
- [ ] Portfolio updates (P&L, trades count)
- [ ] Execute button disabled

### 7. Portfolio Tracking (5 seconds)
- [ ] Total Value shows (e.g., $10,000)
- [ ] P&L updates after trade
- [ ] Win Rate calculates
- [ ] Total Trades increments
- [ ] Click "Refresh Portfolio" - updates

### 8. Network Status (5 seconds)
- [ ] Network Status: 🟢 Online
- [ ] Active Chains: 3
- [ ] Block Height: ~12,000+
- [ ] Applications: 5 Deployed
- [ ] Click "Check Status" - updates

### 9. Trade History (5 seconds)
- [ ] Recent trades listed
- [ ] Trade type shown (BUY/SELL/HOLD)
- [ ] Price displayed
- [ ] Confidence % shown
- [ ] Timestamp visible
- [ ] Hover effect works
- [ ] Click "Clear History" - clears

### 10. Copy Functions (5 seconds)
- [ ] Click "Connect Wallet" dropdown
- [ ] Click copy button next to Chain ID
- [ ] Icon changes to ✓
- [ ] Chain ID copied to clipboard
- [ ] Click copy button next to Owner
- [ ] Owner address copied

## 🎯 Key Features to Verify

### Live Market Data
```
Expected: Real prices from Binance API
BTC: $90,000 - $100,000
ETH: $3,000 - $4,000
SOL: $90 - $110
BNB: $600 - $650
```

### AI Signal Format
```
BUY BNB                    85%
Confidence: 85%
████████░░ 85%
Risk Score: 45/100
████░░░░░░ 45%
Target Price: $615.23
```

### Trade History Format
```
┌─────────────────────────────────────┐
│ BUY BNB/USD          $612.34   85% │
│ 14:23:45                            │
└─────────────────────────────────────┘
```

### Portfolio Display
```
Total Value: $10,000
P&L: +$0 (green if positive, red if negative)
Win Rate: 0%
Total Trades: 0
```

## 🔍 Browser Console Checks

### Expected Console Logs:
```javascript
🚀 AI POWER TRADE - Initializing...
📦 Found saved wallet data: (if wallet exists)
✅ App initialized
📊 Fetching live market data...
📊 Market data updated: {BTC: {...}, ETH: {...}, ...}
✅ Market data updated from Binance
```

### After Wallet Creation:
```javascript
✅ Wallet setup complete: {chainId: "...", owner: "..."}
✅ Client connected (or warning if timeout)
```

### After Signal Generation:
```javascript
💰 Selected coin: BNB
🧠 Signal generated: {coin: "BNB", signal: "BUY", ...}
```

### After Trade Execution:
```javascript
⚡ Trade executed: {coin: "BNB", type: "BUY", ...}
💰 Portfolio updated: {totalValue: 10000, pnl: 0, ...}
```

## 🐛 Common Issues & Solutions

### Issue: Market data shows $0
**Solution:** Wait 2-3 seconds for API call, or click "Update Prices"

### Issue: "Execute" button disabled
**Solution:** Generate a signal first by clicking "Generate New Signal"

### Issue: Wallet creation fails
**Solution:** Check console for errors, try again (faucet might be busy)

### Issue: Platform status shows "Not Connected"
**Solution:** Click "Connect to Platform" button

### Issue: No trades in history
**Solution:** Execute at least one trade first

## 📱 Mobile Testing

### Responsive Breakpoints:
- **Desktop:** > 768px (7-card grid)
- **Tablet:** 768px (2-column grid)
- **Mobile:** < 768px (1-column stack)

### Mobile Checks:
- [ ] Header stacks vertically
- [ ] Connect Wallet button centered
- [ ] Dropdown centered on screen
- [ ] Cards stack in single column
- [ ] All buttons touch-friendly
- [ ] Text readable without zoom

## 🎨 Visual Checks

### Colors:
- **Primary:** #00ff88 (green)
- **Secondary:** #0088ff (blue)
- **Danger:** #ff4444 (red)
- **Warning:** #ffaa00 (orange)
- **Background:** Dark gradient (#0a0a0a → #16213e)

### Hover Effects:
- Cards lift up (-5px translateY)
- Shadow appears (0 10px 30px)
- Border color brightens
- Buttons scale up (1.05)

### Animations:
- Loading dots pulse
- Loading icons spin
- Smooth transitions (0.3s ease)
- Progress bars animate

## 📊 Performance Checks

### Load Times:
- **Initial Load:** < 3s
- **Market Data:** < 2s
- **Wallet Creation:** 3-5s
- **Signal Generation:** < 1s
- **Trade Execution:** < 1s

### Bundle Sizes:
- **HTML:** ~16KB
- **CSS:** ~10KB
- **JS:** ~217KB
- **WASM:** ~14MB
- **Total:** ~14.2MB

## 🔗 API Endpoints

### Binance API:
```
https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT
https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT
https://api.binance.com/api/v3/ticker/24hr?symbol=SOLUSDT
https://api.binance.com/api/v3/ticker/24hr?symbol=BNBUSDT
```

### Linera Faucet:
```
https://faucet.testnet-conway.linera.net
```

## 📝 LocalStorage Keys

### Wallet Data:
```javascript
linera_mnemonic      // BIP39 mnemonic phrase
linera_chain_id      // Chain ID from faucet
linera_owner         // Owner public key
```

### Check in Console:
```javascript
localStorage.getItem('linera_chain_id')
localStorage.getItem('linera_owner')
```

## 🎯 Success Criteria

### Must Have:
- ✅ All 7 cards visible
- ✅ Wallet creation works
- ✅ Market data loads
- ✅ Signals generate
- ✅ Trades execute
- ✅ History displays

### Should Have:
- ✅ Hover effects work
- ✅ Animations smooth
- ✅ Copy buttons work
- ✅ Auto-refresh works
- ✅ Mobile responsive

### Nice to Have:
- ✅ Console logs clear
- ✅ No errors in console
- ✅ Fast load times
- ✅ Professional appearance

## 🚀 Quick Demo Script

**For judges/reviewers (2 minutes):**

1. **Open:** http://152.42.199.50
2. **Wait:** 2 seconds for market data
3. **Click:** "Connect Wallet" (top-right)
4. **Click:** "Create New Wallet"
5. **Wait:** 5 seconds for wallet creation
6. **Observe:** 7 cards with live data
7. **Click:** "BTC" coin button
8. **Click:** "Generate New Signal"
9. **Observe:** AI signal with confidence bars
10. **Click:** "Execute AI Trade"
11. **Observe:** Trade in history, portfolio updated
12. **Done:** Full demo complete!

## 📞 Support

### Documentation:
- `README.md` - Project overview
- `IMPLEMENTATION-DETAILS.md` - Technical details
- `BEFORE-AFTER.md` - Visual comparison
- `VERIFICATION.md` - Verification guide
- `QUICK-REFERENCE.md` - This file

### Live Demo:
- **URL:** http://152.42.199.50
- **Network:** Linera Testnet Conway
- **Status:** ✅ Live & Functional

### Repository:
- **GitHub:** https://github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA
- **Branch:** main
- **Folder:** frontend-linera/
