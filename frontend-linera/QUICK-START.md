# ⚡ QUICK START GUIDE

## 🚀 Setup & Run (5 minutes)

### Step 0: Setup Linera Wallet (First Time Only)

If you haven't created a Linera wallet yet:

```bash
cd frontend-linera
./setup-wallet.sh
```

Or manually:
```bash
linera wallet init --faucet https://faucet.testnet-conway.linera.net
linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net
```

**Expected output:**
```
🔐 Setting up Linera Wallet for Testnet Conway...
✅ Wallet initialized successfully!
✅ Chain requested successfully!
🎉 Wallet setup complete!
```

### Step 1: Install Dependencies

```bash
cd frontend-linera
npm install
```

**Expected output:**
```
added 50 packages in 15s
```

### Step 2: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Step 3: Open Browser

Open: **http://localhost:3000**

You should see:
- 🚀 AI POWER TRADE header
- ⛓️ Linera Wallet card
- 🤖 AI Trading Signals card
- 📊 Trading History card

### Step 4: Create Wallet

1. Click **"Create Wallet"** button
2. Wait 10-30 seconds (faucet claiming chain)
3. Watch console logs (F12):
   ```
   🔄 Initializing Linera WASM...
   ✅ Linera WASM initialized
   🔐 Creating Linera wallet...
   ✅ Signer created, owner: ...
   ✅ Wallet created via faucet
   ⛓️ Claiming chain from faucet...
   ✅ Chain claimed: ...
   🔧 Creating Linera client...
   ✅ Client created
   ✅ Wallet setup complete
   ```

4. Wallet info should appear:
   - Chain ID: `abc123...`
   - Owner: `owner_xyz...`
   - Status: `Connected`

### Step 5: Generate Trading Signal

1. Click **"Generate Signal"** button
2. AI signal appears:
   ```
   BUY BTC/USD
   Price: $42,500
   Confidence: 85%
   Strong uptrend detected with high volume
   Chain: abc123...
   ```

3. Signal added to Trading History

### Step 6: Test Features

- **Wallet Info**: Click to see full details
- **Generate Signal**: Click multiple times
- **Reset**: Clear wallet and start over

## 🧪 Verify Everything Works

### ✅ Checklist:

- [ ] Dev server starts on port 3000
- [ ] Page loads without errors
- [ ] Console shows "Initializing..."
- [ ] "Create Wallet" button works
- [ ] Wallet info displays after creation
- [ ] "Generate Signal" button enabled
- [ ] Signals appear and update
- [ ] Trading history updates
- [ ] "Wallet Info" shows details
- [ ] "Reset" clears everything

## 🐛 Common Issues

### Issue: `npm install` fails

**Solution:**
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

### Issue: CORS errors in console

**Solution:**
- Already configured in `vite.config.js`
- Restart dev server: `Ctrl+C` then `npm run dev`

### Issue: Wallet creation hangs

**Solution:**
- Faucet can be slow (wait 30-60 seconds)
- Check internet connection
- Check console for errors
- Try again

### Issue: WASM loading failed

**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Try different browser (Chrome recommended)

## 📊 Expected Console Output

### On Page Load:
```
🚀 AI POWER TRADE - Initializing...
💡 Create a new wallet to start
✅ App initialized
```

### On Create Wallet:
```
🔄 Initializing Linera WASM...
✅ Linera WASM initialized
🔐 Creating Linera wallet...
✅ Signer created, owner: 0x1234...
✅ Wallet created via faucet
⛓️ Claiming chain from faucet...
✅ Chain claimed: abc123def456...
🔧 Creating Linera client...
✅ Client created
✅ Wallet setup complete: { chainId: "...", owner: "..." }
```

### On Generate Signal:
```
📊 Signal generated: {
  type: "BUY",
  pair: "BTC/USD",
  price: 42500,
  confidence: 0.85,
  ...
}
```

## 🎯 Next Steps

### Local Development:
- ✅ Modify UI in `src/style.css`
- ✅ Add features in `src/main.js`
- ✅ Customize signals in `src/trading.js`
- ✅ Extend Linera integration in `src/linera.js`

### Production Build:
```bash
npm run build
```

Output in `dist/` folder, ready to deploy!

### Deploy to VPS:
```bash
# Build
npm run build

# Upload
scp -r dist/* root@152.42.199.50:/opt/ai-power-trade/

# Serve with Nginx (already configured)
```

## 🏆 Success!

If you see:
- ✅ Wallet created
- ✅ Chain ID displayed
- ✅ Signals generating
- ✅ History updating

**You're ready for the hackathon demo!** 🎉

---

**Need help?** Check `README.md` for detailed documentation.
