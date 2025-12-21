# Wallet Management - Quick User Guide

## 🎯 Quick Access

**Live Site:** http://152.42.199.50

---

## 📝 How to Use

### 1️⃣ Connect Wallet - Two Options

When you click **"Connect Wallet"**, you'll see two options:

**Option A: Create New Wallet**
1. Click **"Create New Wallet"**
2. Wait for wallet creation (3 steps)
3. **Mnemonic modal appears automatically** 📋
4. Write down all 12 words in order
5. Click **"Copy to Clipboard"** to copy mnemonic
6. Check ✅ **"I have written down my recovery phrase"**
7. Click **"Continue"**

**Option B: Import Existing Wallet** ⭐ NEW!
1. Click **"📥 Import Existing Wallet"**
2. Import modal opens
3. Select your backup .json file
4. Enter backup password
5. Click **"Import Wallet"**
6. Wallet restores and page reloads

**⚠️ WARNING:** Without your mnemonic, you CANNOT recover your wallet!

---

### 2️⃣ Backup Mnemonic (After Creating Wallet)

1. Click wallet button (shows your chain ID)
2. Click **"📦 Export Wallet"**
3. Enter a strong password (min 8 characters)
4. Confirm password
5. Click **"Export Wallet"**
6. Backup file downloads automatically
7. **Save this file safely!**

**File name format:** `ai-power-trade-backup-2025-12-21-14-30-45.json`

---

### 4️⃣ Import Wallet (Two Ways)

**Method 1: From Connect Dropdown** ⭐ RECOMMENDED
1. Click **"Connect Wallet"**
2. Click **"📥 Import Existing Wallet"**
3. Select your backup .json file
4. Enter your backup password
5. Click **"Import Wallet"**
6. Page reloads automatically
7. ✅ Wallet restored!

**Method 2: From Connected Wallet**
1. If already connected, click wallet → **"Disconnect"**
2. Then follow Method 1 above

---

## 🔐 Security Tips

### DO:
✅ Write down your mnemonic on paper
✅ Store backup file in secure location
✅ Use strong passwords (8+ characters)
✅ Keep multiple backups in different locations
✅ Test import/export before storing large amounts

### DON'T:
❌ Share your mnemonic with anyone
❌ Store mnemonic in plain text files
❌ Use weak passwords
❌ Store backup file in public locations
❌ Screenshot your mnemonic

---

## 🆘 Troubleshooting

### "Invalid password or corrupted file"
- Check you're using the correct password
- Ensure backup file hasn't been modified
- Try exporting a new backup

### "No wallet found to export"
- Make sure you're connected to a wallet
- Check wallet status in dropdown

### Import not working
- Verify file is .json format
- Check file isn't corrupted
- Ensure password is correct
- Try hard refresh (Cmd+Shift+R)

---

## 📊 What Gets Backed Up?

Your backup file contains:
- ✅ Mnemonic phrase (12 words)
- ✅ Chain ID
- ✅ Owner address
- ✅ Balance

All data is **encrypted** with your password.

---

## 🎨 UI Features

### Mnemonic Modal
- 12 words in clean grid layout
- Copy to clipboard button
- Confirmation checkbox
- Professional warning message

### Export Modal
- Password input with confirmation
- Strength validation
- Success/error messages
- Auto-download

### Import Modal
- File upload
- Password input
- Validation
- Auto-reload on success

---

## 🚀 Quick Commands

### For Developers

**Build:**
```bash
cd frontend-linera
npm run build
```

**Deploy:**
```bash
scp -r dist/* root@152.42.199.50:/var/www/ai-power-trade/
```

**Test:**
```bash
./test-wallet-management.sh
```

---

## 📱 Mobile Support

All wallet management features work on mobile:
- Responsive modals
- Touch-friendly buttons
- Mobile file picker
- Clipboard support

---

## ⚡ Pro Tips

1. **Backup Immediately:** Create backup right after wallet creation
2. **Test Recovery:** Import your backup once to verify it works
3. **Multiple Backups:** Keep backups in 2-3 different locations
4. **Password Manager:** Use password manager for backup passwords
5. **Regular Exports:** Export new backup after significant balance changes

---

## 🔄 Workflow Example

**First Time Setup:**
1. Create wallet → Backup mnemonic
2. Export wallet → Save backup file
3. Test import → Verify backup works
4. Claim faucet → Get test tokens
5. Start trading

**Daily Use:**
1. Open site → Wallet auto-connects
2. Trade as normal
3. Export backup after big wins

**Recovery:**
1. Lost access → Find backup file
2. Import wallet → Enter password
3. Wallet restored → Continue trading

---

## 📞 Support

**Issues?**
- Check browser console (F12)
- Try hard refresh (Cmd+Shift+R)
- Clear cache and reload
- Test in incognito mode

**Still stuck?**
- Check `WALLET-MANAGEMENT-PHASE-1.md` for technical details
- Review test checklist in `test-wallet-management.sh`

---

*Last Updated: December 21, 2025*
*Version: Phase 1 - Production Ready*
