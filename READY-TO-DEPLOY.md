# ✅ READY TO DEPLOY - AI POWER TRADE LINERA

## 📦 Yang Sudah Dibuat

### **1. AI-POWER-TRADE-LINERA.html**
Frontend lengkap dengan integrasi Linera WASM yang proper:
- ✅ Auto-initialize Linera WASM
- ✅ Wallet creation dengan mnemonic
- ✅ Chain claiming dari faucet
- ✅ AI trading signals
- ✅ Trading history
- ✅ LocalStorage persistence

### **2. deploy-linera-frontend.sh**
Script deployment otomatis (belum dijalankan)

### **3. DEPLOY-LINERA-COMMANDS.txt**
Step-by-step manual commands untuk deploy

### **4. LINERA-INTEGRATION-GUIDE.md**
Dokumentasi lengkap cara kerja & troubleshooting

## 🚀 CARA DEPLOY (PILIH SALAH SATU)

### **Opsi A: Otomatis (Recommended)**
```bash
bash deploy-linera-frontend.sh
```

### **Opsi B: Manual (Step by Step)**
Ikuti commands di file: `DEPLOY-LINERA-COMMANDS.txt`

Copy paste satu per satu ke terminal.

## 🎯 Setelah Deploy

### **1. Akses Frontend:**
```
http://152.42.199.50/
```

### **2. Test Wallet Creation:**
- Buka browser
- Tekan F12 (console)
- Klik "Create Wallet"
- Lihat logs di console

### **3. Expected Flow:**
```
✅ Linera modules loaded
✅ Initializing Linera WASM...
✅ Linera WASM Ready
🔐 Creating wallet...
⛓️ Claiming chain from faucet...
🔧 Creating client...
✅ Wallet created successfully!
```

### **4. Check Wallet Info:**
Di browser console:
```javascript
localStorage.getItem('linera_mnemonic')
localStorage.getItem('linera_chain_id')
```

## 📊 Monitoring

```bash
# Frontend logs
ssh root@152.42.199.50 "tail -f /var/log/linera-frontend.log"

# Nginx logs
ssh root@152.42.199.50 "tail -f /var/log/nginx/error.log"

# Check services
ssh root@152.42.199.50 "ps aux | grep -E 'node|nginx'"
```

## 🔧 Troubleshooting

### **CORS Error:**
Cek headers:
```bash
curl -I http://152.42.199.50/
```

Harus ada:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

### **Server Not Running:**
```bash
ssh root@152.42.199.50
cd /opt/ai-power-trade
pkill -f "node linera-server.js"
nohup node linera-server.js > /var/log/linera-frontend.log 2>&1 &
```

### **Faucet Connection Failed:**
- Cek internet VPS
- Pastikan bisa akses: https://faucet.devnet.linera.io
- Lihat error di browser console

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `AI-POWER-TRADE-LINERA.html` | Main frontend dengan Linera integration |
| `deploy-linera-frontend.sh` | Auto deployment script |
| `DEPLOY-LINERA-COMMANDS.txt` | Manual deployment commands |
| `LINERA-INTEGRATION-GUIDE.md` | Full documentation |
| `READY-TO-DEPLOY.md` | This file (quick start) |

## ✨ Key Features

### **Linera Integration:**
- ✅ Real Linera WASM client (`@linera/client@0.15.6`)
- ✅ Proper wallet management (`@linera/signer@0.15.6`)
- ✅ Faucet integration (devnet)
- ✅ Chain claiming
- ✅ LocalStorage persistence

### **AI Trading:**
- ✅ Signal generation
- ✅ Trading history
- ✅ Buy/Sell recommendations
- ✅ Confidence scores

### **UX:**
- ✅ Auto-initialize on load
- ✅ Wallet restore from localStorage
- ✅ Clear status messages
- ✅ Error handling
- ✅ Responsive design

## 🎬 Next Steps

1. **Deploy** → Jalankan `bash deploy-linera-frontend.sh`
2. **Test** → Buka http://152.42.199.50/
3. **Create Wallet** → Klik button, lihat console
4. **Verify** → Check localStorage & chain ID
5. **Demo** → Show to judges! 🏆

## 💡 Tips

- **Browser Console** adalah teman terbaik untuk debugging
- **localStorage** menyimpan wallet, jangan clear browser data
- **Faucet** kadang lambat, tunggu 10-30 detik
- **CORS headers** wajib ada untuk WASM

---

**Status:** ✅ READY TO DEPLOY
**Next Action:** Run deployment script atau manual commands
**Goal:** Real Linera integration untuk hackathon! 🚀
