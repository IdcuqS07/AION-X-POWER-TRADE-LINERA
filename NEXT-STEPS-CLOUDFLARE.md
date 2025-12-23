# 🎯 Next Steps: Update Cloudflare DNS

**Status**: ✅ Removed from Vercel | ⏳ Waiting for Cloudflare DNS update

---

## 📝 What You Need to Do Now

### 1. Open Cloudflare DNS Dashboard

You should already have this open. If not:
- Go to https://dash.cloudflare.com
- Select domain: `aion-x.xyz`
- Click **DNS** tab

---

### 2. Update Two DNS Records

#### Record 1: Main Domain (aion-x.xyz)

**Find this record**:
```
Type: A
Name: aion-x.xyz (or @)
Content: 216.198.79.1 ← OLD (Vercel IP)
```

**Change to**:
```
Type: A
Name: aion-x.xyz (or @)
Content: 152.42.199.50 ← NEW (Your VPS)
Proxy: OFF (gray cloud ☁️, not orange 🟠)
```

#### Record 2: WWW Subdomain

**Find this record**:
```
Type: CNAME
Name: www
Content: bbc0df20c94445fa.vercel-dns-017.com ← OLD (Vercel)
```

**Change to**:
```
Type: CNAME
Name: www
Content: aion-x.xyz ← NEW (Points to main domain)
Proxy: OFF (gray cloud ☁️, not orange 🟠)
```

---

### 3. Save Changes

Click **Save** on both records.

---

### 4. Wait 1-5 Minutes

Cloudflare DNS updates are usually very fast (1-5 minutes).

---

### 5. Run SSL Setup Script

After waiting, run this command in your terminal:

```bash
./check-and-setup-ssl.sh
```

This script will:
- ✅ Check if DNS is updated
- ✅ Install SSL certificate automatically
- ✅ Configure HTTPS
- ✅ Make your site live at https://www.aion-x.xyz

---

## ⚠️ Important Notes

### Proxy Status MUST Be OFF

For SSL certificate installation to work, the Cloudflare proxy MUST be OFF (gray cloud).

- ❌ Orange cloud 🟠 = Proxy ON (will block SSL setup)
- ✅ Gray cloud ☁️ = DNS only (allows SSL setup)

**You can enable proxy AFTER SSL is installed if you want.**

### Why Turn Off Proxy?

Let's Encrypt (SSL provider) needs to verify your domain by connecting directly to your VPS. If Cloudflare proxy is ON, it blocks this verification.

---

## 🎉 Expected Result

After DNS update + SSL installation:

1. **DNS Check**:
   ```bash
   dig aion-x.xyz +short
   # Returns: 152.42.199.50 ✅
   ```

2. **Site Access**:
   - https://aion-x.xyz ✅
   - https://www.aion-x.xyz ✅
   - Secure padlock icon 🔒
   - AI Power Trade fully functional

3. **No More Vercel**:
   - Domain completely moved to your VPS
   - Full control over deployment
   - Professional custom domain for hackathon

---

## 📞 Quick Reference

**Current Status**:
- ✅ Frontend deployed to VPS
- ✅ Nginx configured
- ✅ Removed from Vercel
- ⏳ Waiting for Cloudflare DNS update

**Your Action**:
1. Update 2 DNS records in Cloudflare (see above)
2. Make sure proxy is OFF (gray cloud)
3. Wait 1-5 minutes
4. Run `./check-and-setup-ssl.sh`

**Files to Read**:
- `CLOUDFLARE-DNS-UPDATE.md` - Detailed guide
- `DOMAIN-DEPLOYMENT-STATUS.md` - Current status

---

**Ready?** Update those DNS records in Cloudflare now! 🚀
