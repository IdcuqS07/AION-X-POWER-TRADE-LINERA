# 🚀 Wave 6 Deployment Guide

**Feature**: On-Chain Trade History  
**Status**: Ready for Production Deployment

---

## ✅ Pre-Deployment Checklist

- [x] Smart contract deployed to testnet
- [x] Frontend integration complete
- [x] Local build successful
- [x] UI components added
- [x] Contract API tested
- [ ] Local testing complete
- [ ] Production deployment

---

## 🧪 Local Testing (Optional)

Server is running at: **http://localhost:51871**

### Test Steps:
1. Open http://localhost:51871 in browser
2. Connect wallet (or create new)
3. Verify "Blockchain Trade History" section appears
4. Generate AI signal
5. Execute trade
6. Check trade appears in blockchain history
7. Verify total trades counter increases
8. Click "Refresh from Blockchain" button

### Expected Results:
- ✅ Blockchain history section visible
- ✅ Stats show "-" before trades
- ✅ After trade: counter increases
- ✅ Trade details displayed with ⛓️ badge
- ✅ P&L calculated correctly
- ✅ Refresh button works

---

## 🚀 Production Deployment

### Method 1: Automated Deployment (Recommended)

```bash
# On VPS
ssh root@152.42.199.50
cd /root/ai-power-trade
git pull
./deploy-wave-6.sh
```

### Method 2: Manual Deployment

```bash
# 1. Build locally
cd frontend-linera
npm run build

# 2. Upload to VPS
rsync -avz --delete dist/ root@152.42.199.50:/var/www/aion-x/

# 3. Set permissions on VPS
ssh root@152.42.199.50 << 'EOF'
sudo chown -R www-data:www-data /var/www/aion-x
sudo chmod -R 755 /var/www/aion-x
sudo nginx -t && sudo systemctl reload nginx
EOF
```

### Method 3: Direct on VPS

```bash
# SSH to VPS
ssh root@152.42.199.50

# Navigate to project
cd /root/ai-power-trade

# Pull latest changes
git pull

# Build and deploy
cd frontend-linera
npm install
npm run build
sudo rm -rf /var/www/aion-x/*
sudo cp -r dist/* /var/www/aion-x/
sudo chown -R www-data:www-data /var/www/aion-x
sudo chmod -R 755 /var/www/aion-x
sudo systemctl reload nginx
```

---

## 🧪 Production Testing

After deployment, test at: **https://www.aion-x.xyz/**

### Critical Tests:
1. **Page Load**
   - [ ] Site loads without errors
   - [ ] No console errors
   - [ ] All assets load correctly

2. **Wallet Connection**
   - [ ] Connect wallet works
   - [ ] Wallet info displays
   - [ ] Blockchain history section appears

3. **Trade Execution**
   - [ ] Generate signal works
   - [ ] Execute trade completes
   - [ ] Trade saved to blockchain
   - [ ] Blockchain history updates

4. **Blockchain History**
   - [ ] Total trades counter shows
   - [ ] Total P&L displays
   - [ ] Trade list appears
   - [ ] ⛓️ badge visible
   - [ ] Refresh button works

5. **Data Persistence**
   - [ ] Refresh page - history persists
   - [ ] Disconnect/reconnect - history loads
   - [ ] Multiple trades accumulate

---

## 🔍 Troubleshooting

### Issue: Blockchain history not loading

**Check:**
```bash
# Check browser console for errors
# Verify contract initialized:
# Should see: "✅ Trade history contract initialized"
```

**Fix:**
- Ensure wallet is connected
- Check chain ID matches
- Verify contract app ID is correct

### Issue: Trade not saving to blockchain

**Check:**
```bash
# Browser console should show:
# "✅ Trade saved to blockchain!"
```

**Fix:**
- Check network connection
- Verify contract app ID
- Check testnet status

### Issue: Stats show "-"

**Cause:** No trades yet or wallet not connected

**Fix:**
- Connect wallet first
- Execute at least one trade
- Click refresh button

---

## 📊 Monitoring

### Check Deployment Success

```bash
# On VPS
curl -I https://www.aion-x.xyz/
# Should return: 200 OK

# Check files deployed
ls -la /var/www/aion-x/
# Should see: index.html, assets/, etc.

# Check nginx status
sudo systemctl status nginx
# Should be: active (running)
```

### Check Smart Contract

```bash
# Query contract directly
curl -X POST https://conway1.linera.blockhunters.services/chains/YOUR_CHAIN_ID/applications/17f27b3394c1dfced349fcf477e4b344f374417bde79d628b4345fb430a3747c \
  -H 'Content-Type: application/json' \
  -d '{"query": "{ totalTrades }"}'
```

---

## 📈 Success Metrics

After deployment, verify:

- ✅ Site accessible at https://www.aion-x.xyz/
- ✅ No console errors
- ✅ Blockchain history section visible
- ✅ Trades save to blockchain
- ✅ Stats update correctly
- ✅ Refresh works
- ✅ Data persists across sessions

---

## 🎯 Wave 6 Features Live

Once deployed, users will have:

1. **Complete Trade History** - All trades stored on blockchain
2. **Transparent Records** - Verifiable on-chain data
3. **Analytics** - Total trades and P&L from blockchain
4. **Permanence** - Immutable trade records
5. **Trust** - Blockchain-verified trading history

---

## 📝 Post-Deployment

### Update Documentation
- [ ] Update README with Wave 6 features
- [ ] Add blockchain history to user guide
- [ ] Document GraphQL queries

### Announce
- [ ] Update hackathon submission
- [ ] Social media announcement
- [ ] Demo video

### Monitor
- [ ] Check error logs
- [ ] Monitor user feedback
- [ ] Track blockchain queries

---

## 🔗 Resources

**Production Site**: https://www.aion-x.xyz/  
**Smart Contract**: `17f27b3394c1dfced349fcf477e4b344f374417bde79d628b4345fb430a3747c`  
**Testnet**: Linera Conway  
**Endpoint**: https://conway1.linera.blockhunters.services

**Documentation**:
- Wave 6 Guide: `WAVE-6-TRADE-HISTORY.md`
- Integration: `WAVE-6-INTEGRATION-COMPLETE.md`
- Testing: `test-trade-history.sh`

---

**Ready to deploy?** Run: `./deploy-wave-6.sh`

