# 🌐 Cloudflare DNS Update Guide

**Domain**: aion-x.xyz  
**Target VPS**: 152.42.199.50

---

## 📋 What You Need to Change in Cloudflare

### Current DNS Records (OLD - pointing to Vercel):
```
Type: A
Name: aion-x.xyz (or @)
Content: 216.198.79.1
Status: ❌ DELETE or UPDATE

Type: CNAME
Name: www
Content: bbc0df20c94445fa.vercel-dns-017.com
Status: ❌ DELETE or UPDATE
```

### New DNS Records (NEW - pointing to VPS):
```
Type: A
Name: aion-x.xyz (or @)
Content: 152.42.199.50
Proxy: OFF (DNS only - gray cloud)
TTL: Auto

Type: CNAME
Name: www
Content: aion-x.xyz
Proxy: OFF (DNS only - gray cloud)
TTL: Auto
```

---

## 🎯 Step-by-Step Instructions

### Step 1: Update Main Domain (aion-x.xyz)

1. Find the A record for `aion-x.xyz` or `@`
2. Click **Edit** button
3. Change **Content** from `216.198.79.1` to `152.42.199.50`
4. Make sure **Proxy status** is OFF (gray cloud icon, not orange)
5. Click **Save**

### Step 2: Update WWW Subdomain

1. Find the CNAME record for `www`
2. Click **Edit** button
3. Change **Content** from `bbc0df20c94445fa.vercel-dns-017.com` to `aion-x.xyz`
4. Make sure **Proxy status** is OFF (gray cloud icon, not orange)
5. Click **Save**

---

## ⚠️ Important: Proxy Status

**MUST be OFF (gray cloud)** for SSL certificate installation to work!

- ❌ Orange cloud = Cloudflare proxy (will block SSL setup)
- ✅ Gray cloud = DNS only (allows direct SSL setup)

You can enable Cloudflare proxy AFTER SSL is installed if you want.

---

## ⏱️ DNS Propagation Time

After saving changes:
- **Minimum**: 1-5 minutes
- **Typical**: 5-15 minutes
- **Maximum**: 30 minutes (rarely up to 48 hours)

---

## ✅ Verify DNS Update

### Option 1: Command Line (Mac/Linux)

```bash
# Check main domain
dig aion-x.xyz +short

# Check www subdomain
dig www.aion-x.xyz +short

# Both should return: 152.42.199.50
```

### Option 2: Online Tool

Visit: https://dnschecker.org
- Enter: `aion-x.xyz`
- Should show: `152.42.199.50` globally

---

## 🔐 After DNS is Updated

Once DNS shows `152.42.199.50`, run this command:

```bash
./check-and-setup-ssl.sh
```

This will:
1. ✅ Verify DNS is correct
2. ✅ Install SSL certificate automatically
3. ✅ Configure HTTPS redirect
4. ✅ Enable your site at https://www.aion-x.xyz

---

## 🎉 Final Result

After DNS update + SSL installation:

- ✅ http://aion-x.xyz → redirects to https://aion-x.xyz
- ✅ http://www.aion-x.xyz → redirects to https://www.aion-x.xyz
- ✅ https://aion-x.xyz → AI Power Trade (secure)
- ✅ https://www.aion-x.xyz → AI Power Trade (secure)

---

## 🚨 Troubleshooting

### DNS Not Updating?

**Clear your local DNS cache**:
```bash
# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

**Check with Google DNS**:
```bash
dig @8.8.8.8 aion-x.xyz +short
```

### Still Shows Old IP?

- Wait a bit longer (up to 30 minutes)
- Make sure you saved changes in Cloudflare
- Make sure proxy is OFF (gray cloud)
- Try incognito/private browser window

---

**Next Step**: Update DNS in Cloudflare, then run `./check-and-setup-ssl.sh` 🚀
