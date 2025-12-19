# Migration Plan: linera-ai-trading.html → frontend-linera

## Current Status
- ✅ Vite build system working
- ✅ Linera WASM integration working
- ✅ Connect Wallet dropdown working
- ⏳ Need to update UI to match linera-ai-trading.html

## Design Differences

### linera-ai-trading.html (Target Design)
**Features:**
- 7 cards layout
- Live market data from Binance API
- Portfolio overview with P&L
- Multi-platform selector (CEX & DEX)
- AI signals with confidence & risk bars
- Trade history with filters
- Linera network status
- Hover effects & animations

### Current frontend-linera
**Features:**
- 3 cards layout
- Connect Wallet dropdown (Alethea style)
- Linera WASM integration
- Basic trading signals
- Simple trade history

## Migration Strategy

### Option A: Full Redesign (Recommended)
**Time**: 30-45 minutes
**Steps**:
1. Keep current WASM integration (`linera-wasm.js`)
2. Replace HTML structure with 7-card layout
3. Replace CSS with new design
4. Add market data fetching (Binance API)
5. Add portfolio tracking
6. Add platform selector
7. Keep Connect Wallet dropdown in header
8. Test & deploy

**Pros**:
- Professional, feature-rich UI
- Real market data
- Better for demo/presentation
- More impressive for judges

**Cons**:
- Takes time to implement
- More code to maintain

### Option B: Hybrid Approach (Quick)
**Time**: 10-15 minutes
**Steps**:
1. Keep current 3-card layout
2. Add market data card
3. Improve styling (hover effects, animations)
4. Keep everything else as-is

**Pros**:
- Quick to implement
- Less risk of breaking WASM
- Minimal changes

**Cons**:
- Less impressive UI
- Missing features

## Recommendation

**Go with Option A** if you have time before deadline.

The full redesign will make the app much more impressive for hackathon judges, and we can keep all the Linera WASM integration working.

## Implementation Checklist

- [ ] Backup current files
- [ ] Update CSS with new styles
- [ ] Update HTML with 7-card layout
- [ ] Add market data module
- [ ] Add portfolio tracking
- [ ] Add platform selector
- [ ] Integrate with existing WASM
- [ ] Test wallet creation
- [ ] Test all features
- [ ] Build & deploy
- [ ] Verify on VPS

## Files to Modify

1. `frontend-linera/src/style.css` - Complete redesign
2. `frontend-linera/index.html` - New layout
3. `frontend-linera/src/main.js` - Add new features
4. `frontend-linera/src/trading.js` - Enhance trading logic
5. Keep `frontend-linera/src/linera-wasm.js` - No changes needed

## Estimated Time

- CSS updates: 10 min
- HTML updates: 10 min
- JavaScript updates: 15 min
- Testing: 10 min
- Deploy: 5 min
**Total: ~50 minutes**
