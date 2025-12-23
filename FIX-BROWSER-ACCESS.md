# 🔧 Fix Browser Access Issue

**Problem**: ERR_CONNECTION_REFUSED di browser  
**Status**: Domain sudah bekerja (DNS ✅, Nginx ✅, VPS ✅)  
**Cause**: Browser cache atau DNS cache lokal

---

## ✅ Domain Sudah Bekerja!

Saya sudah test dari terminal dan domain **sudah berfungsi**:
- ✅ DNS pointing ke 152.42.199.50
- ✅ Nginx merespons dengan benar
- ✅ File frontend tersedia
- ✅ http://aion-x.xyz → 200 OK
- ✅ http://www.aion-x.xyz → 200 OK

---

## 🔧 Solusi: Clear Browser Cache

### Solusi 1: Hard Refresh (Paling Mudah)

**Di browser, tekan**:
- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`

Atau:
- **Mac**: `Cmd + Option + R`
- **Windows/Linux**: `Ctrl + F5`

### Solusi 2: Clear DNS Cache (Recommended)

**Jalankan command ini**:
```bash
# Clear DNS cache macOS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Clear browser DNS cache
# Buka browser dan ketik di address bar:
# Chrome: chrome://net-internals/#dns
# Klik "Clear host cache"
```

### Solusi 3: Incognito/Private Window

1. Buka **Incognito/Private window** di browser
2. Coba akses: http://www.aion-x.xyz
3. Atau: http://aion-x.xyz

### Solusi 4: Clear Browser Cache Completely

**Chrome**:
1. Settings → Privacy and Security
2. Clear browsing data
3. Pilih "Cached images and files"
4. Time range: "All time"
5. Clear data

**Safari**:
1. Safari → Preferences → Advanced
2. Check "Show Develop menu"
3. Develop → Empty Caches
4. Atau: `Cmd + Option + E`

### Solusi 5: Restart Browser

1. Tutup browser sepenuhnya
2. Buka lagi
3. Coba akses domain

---

## 🧪 Test Akses

Setelah clear cache, coba akses:

1. **HTTP** (tanpa SSL dulu):
   - http://aion-x.xyz
   - http://www.aion-x.xyz

2. **Jangan pakai HTTPS dulu** karena SSL belum diinstall

---

## 📊 Verification

Kalau masih tidak bisa, coba test dari terminal:

```bash
# Test DNS
dig www.aion-x.xyz +short
# Harus return: 152.42.199.50 atau aion-x.xyz

# Test HTTP
curl -I http://www.aion-x.xyz
# Harus return: HTTP/1.1 200 OK

# Test dari browser
# Buka: http://www.aion-x.xyz
```

---

## 🎯 Next Step: Install SSL

Setelah browser bisa akses HTTP, jalankan:

```bash
./check-and-setup-ssl.sh
```

Ini akan install SSL certificate dan enable HTTPS.

---

## ⚠️ Common Issues

### Issue 1: Browser Cache
**Symptom**: ERR_CONNECTION_REFUSED  
**Solution**: Hard refresh atau incognito window

### Issue 2: DNS Cache
**Symptom**: Domain tidak resolve  
**Solution**: Flush DNS cache (command di atas)

### Issue 3: HTTPS Too Early
**Symptom**: Connection refused on HTTPS  
**Solution**: Pakai HTTP dulu (http://), bukan HTTPS (https://)

### Issue 4: Cloudflare Proxy
**Symptom**: Connection issues  
**Solution**: Pastikan proxy OFF (gray cloud) di Cloudflare

---

## 🚀 Quick Fix Commands

```bash
# 1. Clear DNS cache
sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder

# 2. Test domain
curl -I http://www.aion-x.xyz

# 3. If working, install SSL
./check-and-setup-ssl.sh
```

---

**Status**: Domain sudah live, tinggal clear cache browser! 🎉
