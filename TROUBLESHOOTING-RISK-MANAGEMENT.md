# 🔧 Troubleshooting: Risk Management (Stop Loss / Take Profit)

## Issue: "Stop Loss/Take Profit hilang"

### ✅ Verification Checklist

#### 1. HTML Structure (VERIFIED ✓)
```bash
curl -s http://152.42.199.50 | grep "risk-management-section"
```
**Result**: ✅ Section exists with `id="risk-management"`

#### 2. CSS Styling (VERIFIED ✓)
```bash
curl -s http://152.42.199.50/assets/*.css | grep "risk-management-section"
```
**Result**: ✅ CSS rules exist

#### 3. JavaScript Functions (VERIFIED ✓)
- `updateProfitLossDisplay()` - ✅ Exists
- `elements.riskManagement.style.display = 'block'` - ✅ Exists in generateSignalEnhanced
- Event listeners for TP/SL inputs - ✅ All attached

---

## 🐛 Possible Issues & Solutions

### Issue 1: Risk Management Not Showing After Generate Signal

**Symptoms:**
- Click "Generate New Signal"
- Signal appears
- But Risk Management section doesn't show

**Solution:**
Check browser console (F12) for errors:

```javascript
// Expected flow:
1. Click "Generate New Signal"
2. generateSignalEnhanced() is called
3. Line 1313: elements.riskManagement.style.display = 'block'
4. Risk management section should appear
```

**Debug Steps:**
1. Open browser console (F12)
2. Click "Generate New Signal"
3. Check for errors
4. Type in console: `document.getElementById('risk-management').style.display`
5. Should return: `"block"` (not `"none"`)

**If still "none":**
```javascript
// Manually show it in console:
document.getElementById('risk-management').style.display = 'block';
```

---

### Issue 2: Section Exists But Not Visible

**Symptoms:**
- Section has `display: block`
- But still not visible on screen

**Possible Causes:**
1. CSS `opacity: 0`
2. CSS `visibility: hidden`
3. CSS `height: 0` or `overflow: hidden`
4. Z-index issue
5. Parent container hiding it

**Solution:**
Check computed styles in browser DevTools:

```javascript
// In console:
const section = document.getElementById('risk-management');
const styles = window.getComputedStyle(section);
console.log({
    display: styles.display,
    opacity: styles.opacity,
    visibility: styles.visibility,
    height: styles.height,
    overflow: styles.overflow
});
```

---

### Issue 3: Elements Not Defined

**Symptoms:**
- Console error: `Cannot read property 'style' of null`
- Or: `elements.riskManagement is undefined`

**Solution:**
Check if element IDs match:

```javascript
// In console:
console.log('Risk Management Element:', document.getElementById('risk-management'));
console.log('TP Price Input:', document.getElementById('take-profit-price'));
console.log('SL Price Input:', document.getElementById('stop-loss-price'));
```

**If any returns `null`:**
- HTML element ID doesn't match
- Element was removed by autofix
- Element is in wrong position in DOM

---

### Issue 4: JavaScript Not Loading

**Symptoms:**
- No errors in console
- But nothing happens when clicking buttons

**Solution:**
Check if JavaScript loaded:

```javascript
// In console:
console.log('Risk Manager:', typeof riskManager);
console.log('Update Function:', typeof updateProfitLossDisplay);
```

**If `undefined`:**
- JavaScript file not loaded
- Build issue
- Cache issue (clear cache!)

---

## 🔍 Manual Testing Steps

### Step 1: Clear Cache
```
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
Or use Incognito mode
```

### Step 2: Open Browser Console
```
Press F12 or Cmd+Option+I (Mac)
Go to Console tab
```

### Step 3: Load Page
```
Visit: http://152.42.199.50
Check console for any errors
```

### Step 4: Connect Wallet
```
Click "Connect Wallet"
Wait for wallet creation
```

### Step 5: Update Market Data
```
Click "Update Prices"
Ensure prices are loaded
```

### Step 6: Generate Signal
```
Click "Generate New Signal"
Watch console for logs
```

### Step 7: Check Risk Management
```
Look for "⚙️ Risk Management" section
Should appear below trade amount slider
```

### Step 8: Verify Inputs
```
Should see:
- 🎯 Take Profit (Price & Percentage inputs)
- 🛡️ Stop Loss (Price & Percentage inputs)
- AI Suggest buttons
- R:R ratio display
```

---

## 🧪 Console Debug Commands

### Check if section exists:
```javascript
document.getElementById('risk-management')
```

### Check if section is visible:
```javascript
document.getElementById('risk-management').style.display
```

### Manually show section:
```javascript
document.getElementById('risk-management').style.display = 'block';
```

### Check if inputs exist:
```javascript
console.log({
    tpPrice: document.getElementById('take-profit-price'),
    tpPercent: document.getElementById('take-profit-percent'),
    slPrice: document.getElementById('stop-loss-price'),
    slPercent: document.getElementById('stop-loss-percent'),
    btnAiTp: document.getElementById('btn-ai-tp'),
    btnAiSl: document.getElementById('btn-ai-sl')
});
```

### Check if event listeners attached:
```javascript
// Generate a signal first, then:
console.log('Current Signal:', currentSignal);
console.log('Risk Manager:', riskManager);
```

### Test AI suggestion:
```javascript
// After generating signal:
const suggestion = riskManager.calculateAISuggestion(
    currentSignal.price,
    currentSignal.confidence,
    currentSignal.type
);
console.log('AI Suggestion:', suggestion);
```

---

## 📸 Expected Visual Result

After clicking "Generate New Signal", you should see:

```
🧠 AI Trading Signal
├─ Signal: BUY BTC
├─ Confidence: 85%
├─ Risk Score: 45/100
│
├─ 💰 Trade Amount: 25% ($37.50)
│   └─ [Slider]
│
├─ ⚙️ Risk Management          ← THIS SECTION
│   ├─ R:R 2:1
│   │
│   ├─ 🎯 Take Profit
│   │   ├─ Price: [45050]
│   │   ├─ Percentage: [6]%
│   │   └─ [AI Suggest]
│   │
│   └─ 🛡️ Stop Loss
│       ├─ Price: [41225]
│       ├─ Percentage: [3]%
│       └─ [AI Suggest]
│
└─ [Execute Trade Button]
```

---

## 🔧 Quick Fixes

### Fix 1: Force Show Risk Management
Add this to browser console after generating signal:
```javascript
document.getElementById('risk-management').style.display = 'block';
```

### Fix 2: Re-initialize Event Listeners
```javascript
// In console:
location.reload();
```

### Fix 3: Check Build Version
```javascript
// Check if latest version is loaded:
console.log('Build timestamp:', document.querySelector('script[src*="index"]').src);
```

---

## 📝 Files to Check

If issue persists, verify these files:

1. **frontend-linera/index.html** (lines 343-400)
   - Risk management section HTML

2. **frontend-linera/src/style.css** (lines 1078-1200)
   - Risk management styling

3. **frontend-linera/src/main.js** (lines 1197-1240)
   - updateProfitLossDisplay() function

4. **frontend-linera/src/main.js** (lines 1313-1330)
   - Show risk management in generateSignalEnhanced()

5. **frontend-linera/src/main.js** (lines 962-1058)
   - Event listeners for TP/SL inputs

---

## 🆘 If Still Not Working

1. **Clear ALL browser data**
   - Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
   - Time range: "All time"

2. **Try different browser**
   - Chrome
   - Firefox
   - Safari

3. **Check VPS deployment**
   ```bash
   ssh root@152.42.199.50
   ls -la /var/www/html/
   cat /var/www/html/index.html | grep "risk-management"
   ```

4. **Rebuild and redeploy**
   ```bash
   cd frontend-linera
   npm run build
   cd ..
   ./deploy-clean-percentage.sh
   ```

---

## ✅ Verification

After fixes, verify:
- [ ] Risk management section appears after generate signal
- [ ] Take Profit inputs work (price ↔ percentage sync)
- [ ] Stop Loss inputs work (price ↔ percentage sync)
- [ ] AI Suggest buttons populate correct values
- [ ] Profit/Loss preview shows correct amounts
- [ ] R:R ratio displays correctly
- [ ] No console errors

---

**Last Updated**: December 19, 2025  
**Status**: All components verified present in codebase  
**Deployment**: Live at http://152.42.199.50
