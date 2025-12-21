# Quick Test Guide - Signal Persistence

## 🚀 Quick Start (2 minutes)

### 1. Open App
```
http://152.42.199.50
```

### 2. Connect Wallet
- Click "Connect Wallet"
- Create new wallet or import existing

### 3. Test Signal Persistence
```
1. Select ETH → Generate Signal
   ✅ See: "HOLD ETH" with badge

2. Click BTC button
   ✅ See: Signal STILL shows "HOLD ETH"
   ✅ See: Risk Management STILL visible
   ✅ See: Execute button STILL active

3. Success! 🎉
```

## 🎯 What to Look For

### Visual Indicators
- **Coin Badge**: Small colored badge next to signal action
  - Example: "HOLD **ETH**"
  - Color matches signal type (green/red/orange)

### Persistent Elements
- Signal card stays visible
- Risk Management section stays visible
- Stop Loss / Take Profit fields stay filled
- Execute button stays enabled

### Console Logs (F12)
```
✅ Active signal saved for ETH
📊 Active signal exists for: ETH
✅ Active signal displayed
```

## 🐛 If Something's Wrong

### Signal Disappears
1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Clear cache
3. Check console for errors

### Badge Not Showing
1. Verify CSS loaded
2. Check `.coin-badge` class exists
3. Hard refresh

### Risk Management Hidden
1. Check if signal expired (>15 min)
2. Generate new signal
3. Check console logs

## 📊 Expected vs Actual

### Before (Old Behavior)
```
Generate ETH signal → Switch to BTC → Signal GONE ❌
```

### After (New Behavior)
```
Generate ETH signal → Switch to BTC → Signal PERSISTS ✅
```

## ⏱️ Signal Expiry

Signals expire after **15 minutes**:
- Countdown visible in button
- Auto-cleared when expired
- Must generate new signal

## 🎮 Advanced Testing

### Test Scenario 1: Multi-Coin Monitoring
```
1. Generate signal for ETH
2. Switch to BTC to check price
3. Switch to SOL to check price
4. Back to ETH
5. Execute trade (should work!)
```

### Test Scenario 2: Signal Replacement
```
1. Generate signal for ETH
2. Switch to BTC
3. Generate signal for BTC
4. ETH signal replaced with BTC signal
```

### Test Scenario 3: Execute from Different Coin
```
1. Generate signal for ETH
2. Switch to BTC
3. Click Execute
4. Trade executes for ETH (not BTC!)
```

## 📱 Mobile Testing

Works on mobile browsers:
- iOS Safari
- Android Chrome
- Mobile Firefox

## 🔗 Links

- **Production**: http://152.42.199.50
- **GitHub**: https://github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA
- **Full Docs**: SIGNAL-PERSISTENCE-FEATURE.md
- **Test Checklist**: test-signal-persistence.sh

## ✅ Success Checklist

- [ ] Signal shows coin badge
- [ ] Signal persists when switching coins
- [ ] Risk Management stays visible
- [ ] Execute button stays active
- [ ] Trade executes for correct coin
- [ ] Signal expires after 15 minutes
- [ ] New signal replaces old signal

---

**All checks passed?** Feature working perfectly! 🎉
