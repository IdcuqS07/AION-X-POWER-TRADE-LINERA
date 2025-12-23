# 🌐 Complete Domain Setup Guide

**Domain**: aion-x.xyz → www.aion-x.xyz  
**VPS**: 152.42.199.50  
**Status**: ✅ Backend Ready | ⏳ Waiting for DNS Update

---

## 📊 Current Situation

### ✅ What's Already Done

1. **Frontend Deployed to VPS**
   - Location: `/var/www/ai-power-trade/`
   - Size: ~15MB (includes WASM)
   - Status: Working at http://152.42.199.50

2. **Nginx Configured**
   - Config: `/etc/nginx/sites-available/aion-x.xyz`
   - CORS headers: Configured for WASM
   - Ready for: aion-x.xyz and www.aion-x.xyz

3. **Domain Removed from Vercel**
   - Old project: Disconnected
   - Domain: Free to use with VPS

### ⏳ What's Pending

1. **DNS Update in Cloudflare**
   - Need to point domain to VPS
   - Takes 1-5 minutes after update

2. **SSL Certificate Installation**
   - Will be done automatically after DNS update
   - Uses Let's Encrypt (free)

---

## 🎯 Your Action Items

### Step 1: Update Cloudflare DNS (YOU DO THIS)

Open Cloudflare dashboard and update 2 records:

**Record 1**:
```
Type: A
Name: aion-x.xyz (or @)
Content: 152.42.199.50 (change from 216.198.79.1)
Proxy: OFF (gray cloud)
```

**Record 2**:
```
Type: CNAME
Name: www
Content: aion-x.xyz (change from Vercel domain)
Proxy: OFF (gray cloud)
```

**Important**: Proxy MUST be OFF (gray cloud ☁️, not orange 🟠)

### Step 2: Wait 1-5 Minutes

Cloudflare DNS updates are usually very fast.

### Step 3: Run SSL Setup Script (AUTOMATIC)

```bash
./check-and-setup-ssl.sh
```

This script will:
- ✅ Check if DNS is updated
- ✅ Install SSL certificate
- ✅ Configure HTTPS
- ✅ Make your site live

---

## 📚 Documentation Files

### Quick Reference
- **QUICK-DNS-REFERENCE.txt** - One-page cheat sheet
- **DNS-UPDATE-VISUAL.txt** - Visual diagram with arrows

### Detailed Guides
- **CLOUDFLARE-DNS-UPDATE.md** - Step-by-step Cloudflare guide
- **NEXT-STEPS-CLOUDFLARE.md** - What to do next
- **DOMAIN-DEPLOYMENT-STATUS.md** - Current deployment status
- **SETUP-DOMAIN-AION-X.md** - Complete technical guide

### Scripts
- **check-and-setup-ssl.sh** - Automated DNS check + SSL setup

---

## 🔍 Verification Commands

### Check DNS Update
```bash
# Check main domain
dig aion-x.xyz +short
# Should return: 152.42.199.50

# Check www subdomain
dig www.aion-x.xyz +short
# Should return: 152.42.199.50 or aion-x.xyz
```

### Check Site Access
```bash
# Test HTTP (before SSL)
curl -I http://aion-x.xyz

# Test HTTPS (after SSL)
curl -I https://www.aion-x.xyz
```

### Online DNS Checker
Visit: https://dnschecker.org
- Enter: `aion-x.xyz`
- Should show: `152.42.199.50` globally

---

## 🎉 Expected Final Result

After DNS update + SSL installation:

### URLs
- ✅ https://aion-x.xyz
- ✅ https://www.aion-x.xyz
- ✅ http://aion-x.xyz → redirects to HTTPS
- ✅ http://www.aion-x.xyz → redirects to HTTPS

### Features
- ✅ Secure HTTPS connection (padlock icon 🔒)
- ✅ Professional custom domain
- ✅ All AI Power Trade features working
- ✅ Fast loading with cache
- ✅ WASM working properly
- ✅ Perfect for hackathon submission

---

## ⚠️ Important Notes

### Why Turn Off Cloudflare Proxy?

Let's Encrypt (SSL provider) needs to verify your domain by connecting directly to your VPS. If Cloudflare proxy is ON (orange cloud), it blocks this verification and SSL setup will fail.

**You can enable proxy AFTER SSL is installed if you want.**

### What If DNS Doesn't Update?

1. **Clear local DNS cache**:
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   ```

2. **Check with Google DNS**:
   ```bash
   dig @8.8.8.8 aion-x.xyz +short
   ```

3. **Wait longer**: Sometimes takes up to 30 minutes

4. **Verify in Cloudflare**: Make sure you saved the changes

### What If SSL Setup Fails?

1. **Check DNS first**: Run `dig aion-x.xyz +short`
2. **Make sure proxy is OFF**: Gray cloud, not orange
3. **Wait for DNS propagation**: Give it more time
4. **Check Nginx**: `ssh root@152.42.199.50 "systemctl status nginx"`

---

## 🚀 Quick Start

**TL;DR - Do this now**:

1. Open Cloudflare DNS dashboard
2. Update 2 records (see Step 1 above)
3. Make sure proxy is OFF (gray cloud)
4. Wait 1-5 minutes
5. Run: `./check-and-setup-ssl.sh`
6. Done! Visit: https://www.aion-x.xyz

---

## 📞 Support Files

If you need help, check these files:
- `QUICK-DNS-REFERENCE.txt` - Quick cheat sheet
- `DNS-UPDATE-VISUAL.txt` - Visual guide
- `CLOUDFLARE-DNS-UPDATE.md` - Detailed instructions

---

## ✅ Checklist

- [x] Frontend deployed to VPS
- [x] Nginx configured
- [x] Domain removed from Vercel
- [ ] **DNS updated in Cloudflare** ← YOU ARE HERE
- [ ] DNS propagated (1-5 minutes)
- [ ] SSL certificate installed (automatic)
- [ ] Site live at https://www.aion-x.xyz
- [ ] Update hackathon submission with new URL

---

**Ready?** Update those DNS records in Cloudflare now! 🚀

After DNS is updated, the script will handle everything else automatically.
