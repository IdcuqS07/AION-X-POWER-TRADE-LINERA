# 🌐 Setup Domain aion-x.xyz untuk AI Power Trade

**Status**: ✅ Nginx configured, ⏳ Waiting for DNS update

---

## ✅ Yang Sudah Selesai

1. ✅ Nginx config updated untuk `aion-x.xyz` dan `www.aion-x.xyz`
2. ✅ CORS headers configured untuk WASM
3. ✅ Frontend files deployed di `/var/www/ai-power-trade`
4. ✅ Cache control configured

---

## 📋 Yang Perlu Anda Lakukan

### Step 1: Update DNS Records

Login ke DNS provider Anda (kemungkinan Vercel atau domain registrar) dan update records:

**Current DNS** (pointing ke Vercel):
```
aion-x.xyz → 216.198.79.1 (Vercel)
www.aion-x.xyz → 216.198.79.65 (Vercel)
```

**New DNS** (point ke VPS):
```
Type: A
Name: @
Value: 152.42.199.50
TTL: 3600 (or Auto)

Type: A
Name: www
Value: 152.42.199.50
TTL: 3600 (or Auto)
```

**Atau jika pakai CNAME untuk www**:
```
Type: A
Name: @
Value: 152.42.199.50

Type: CNAME
Name: www
Value: aion-x.xyz
```

### Step 2: Wait for DNS Propagation

**Time**: 5-30 minutes (sometimes up to 48 hours)

**Check DNS**:
```bash
# Check if updated
dig aion-x.xyz +short
dig www.aion-x.xyz +short

# Should return: 152.42.199.50
```

**Online checker**: https://dnschecker.org

### Step 3: Install SSL Certificate

Once DNS is pointing to VPS (shows 152.42.199.50):

```bash
ssh root@152.42.199.50
certbot --nginx -d aion-x.xyz -d www.aion-x.xyz
```

This will:
- Get free SSL certificate from Let's Encrypt
- Auto-configure Nginx for HTTPS
- Enable automatic renewal (every 90 days)

---

## 🎯 Expected Result

After DNS propagation and SSL setup:

- ✅ http://aion-x.xyz → redirects to https://aion-x.xyz
- ✅ http://www.aion-x.xyz → redirects to https://www.aion-x.xyz
- ✅ https://aion-x.xyz → AI Power Trade
- ✅ https://www.aion-x.xyz → AI Power Trade

---

## 🔍 Verification Steps

### 1. Check DNS (After Update)

```bash
# Should return 152.42.199.50
dig aion-x.xyz +short
dig www.aion-x.xyz +short
```

### 2. Test HTTP Access

```bash
curl -I http://aion-x.xyz
curl -I http://www.aion-x.xyz
```

Should return `200 OK`

### 3. Test in Browser

Visit:
- http://aion-x.xyz
- http://www.aion-x.xyz

Should show AI Power Trade interface

### 4. After SSL Setup

Visit:
- https://aion-x.xyz
- https://www.aion-x.xyz

Should show:
- ✅ Secure padlock icon
- ✅ AI Power Trade interface
- ✅ No certificate errors

---

## 📝 Current Nginx Configuration

```nginx
server {
    listen 80;
    server_name aion-x.xyz www.aion-x.xyz;
    
    root /var/www/ai-power-trade;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # CORS headers for WASM
    add_header Cross-Origin-Opener-Policy "same-origin" always;
    add_header Cross-Origin-Embedder-Policy "require-corp" always;
    
    # Cache control
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|wasm)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Cross-Origin-Opener-Policy "same-origin" always;
        add_header Cross-Origin-Embedder-Policy "require-corp" always;
    }
}
```

**After SSL** (Certbot will add):
```nginx
server {
    listen 443 ssl http2;
    server_name aion-x.xyz www.aion-x.xyz;
    
    ssl_certificate /etc/letsencrypt/live/aion-x.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aion-x.xyz/privkey.pem;
    
    # ... rest of config
}

server {
    listen 80;
    server_name aion-x.xyz www.aion-x.xyz;
    return 301 https://$server_name$request_uri;
}
```

---

## 🚨 Troubleshooting

### DNS Not Updating

**Problem**: `dig` still shows old IP

**Solutions**:
1. Clear local DNS cache:
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

2. Check with different DNS:
   ```bash
   dig @8.8.8.8 aion-x.xyz +short
   dig @1.1.1.1 aion-x.xyz +short
   ```

3. Wait longer (up to 48 hours for full propagation)

### SSL Certificate Fails

**Problem**: Certbot fails with "unauthorized" error

**Cause**: DNS not propagated yet

**Solution**: Wait for DNS to fully propagate, then retry

### Site Not Loading

**Problem**: Browser shows error

**Check**:
1. DNS pointing to correct IP
2. Nginx running: `systemctl status nginx`
3. Files exist: `ls /var/www/ai-power-trade/`
4. Nginx logs: `tail -f /var/log/nginx/error.log`

---

## 📞 Quick Commands Reference

```bash
# Check DNS
dig aion-x.xyz +short

# Test HTTP
curl -I http://aion-x.xyz

# Install SSL (after DNS updated)
ssh root@152.42.199.50
certbot --nginx -d aion-x.xyz -d www.aion-x.xyz

# Check Nginx status
ssh root@152.42.199.50 "systemctl status nginx"

# View Nginx logs
ssh root@152.42.199.50 "tail -f /var/log/nginx/access.log"

# Restart Nginx
ssh root@152.42.199.50 "systemctl restart nginx"

# Redeploy frontend
cd frontend-linera
npm run build
scp -r dist/* root@152.42.199.50:/var/www/ai-power-trade/
```

---

## ✅ Checklist

- [x] Nginx configured
- [x] Frontend deployed
- [x] CORS headers added
- [ ] **DNS updated** ← YOU ARE HERE
- [ ] DNS propagated
- [ ] SSL certificate installed
- [ ] HTTPS working
- [ ] Update hackathon submission

---

## 🎉 Final Result

Once everything is done:

**Live Demo**: https://www.aion-x.xyz

**Features**:
- ✅ Professional custom domain
- ✅ HTTPS secure connection
- ✅ Fast loading with cache
- ✅ WASM working properly
- ✅ All AI Power Trade features

---

**Next Action**: Update DNS records at your domain provider, then wait 5-30 minutes and run SSL setup command.
