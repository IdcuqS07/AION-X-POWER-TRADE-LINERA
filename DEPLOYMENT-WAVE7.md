# Wave 7 Deployment Guide

Complete guide for deploying Wave 7 Interactive Charts & Analytics features.

---

## Prerequisites

- Node.js 18+ and npm
- Nginx web server
- SSL certificate (Let's Encrypt recommended)
- Domain name (optional but recommended)

---

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend-linera
npm install
```

This will install:
- `lightweight-charts@4.1.3` - Chart library
- `date-fns@4.1.0` - Date manipulation
- Other existing dependencies

### 2. Build Frontend

```bash
npm run build
```

Output will be in `frontend-linera/dist/` directory.

### 3. Configure Nginx Proxy

Add Binance API proxy to your nginx configuration:

```nginx
# /etc/nginx/sites-available/your-site

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    root /var/www/your-app;
    index index.html;

    # SSL Configuration
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    
    # Binance API proxy (REQUIRED for Wave 7)
    location /api/binance/ {
        rewrite ^/api/binance/(.*)$ /$1 break;
        
        proxy_pass https://api.binance.com;
        proxy_ssl_server_name on;
        proxy_ssl_protocols TLSv1.2 TLSv1.3;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
        
        # Handle preflight
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Length' 0;
            return 204;
        }
        
        # Proxy headers
        proxy_set_header Host api.binance.com;
        proxy_set_header X-Real-IP $remote_addr;
        
        # Cache for 5 seconds
        proxy_cache_valid 200 5s;
    }
    
    # Your other locations...
}
```

### 4. Test Nginx Configuration

```bash
sudo nginx -t
```

If successful, reload nginx:

```bash
sudo systemctl reload nginx
```

### 5. Deploy Files

Copy built files to your web server:

```bash
# Local to remote
rsync -avz --delete frontend-linera/dist/ user@server:/var/www/your-app/

# Or if already on server
cp -r frontend-linera/dist/* /var/www/your-app/
```

### 6. Verify Deployment

Test the Binance proxy:

```bash
curl -I https://your-domain.com/api/binance/api/v3/ticker/24hr?symbol=BTCUSDT
```

Should return `HTTP/2 200` with CORS headers.

---

## Verification

### 1. Check Console (Browser DevTools)

Open https://your-domain.com and check console (F12):

**Expected messages**:
```
✅ Wave 7 modules loaded and ready
🚀 Starting Wave 7 initialization...
✅ Chart initialized
✅ Loaded 500 candles for BTC 1h
✅ Wave 7 initialized successfully
📊 Market data updated: {BTC: {...}, ETH: {...}, ...}
```

**No errors should appear**:
- ❌ No CORS errors
- ❌ No "addCandlestickSeries is not a function" errors
- ❌ No failed fetch requests

### 2. Check Network Tab

Verify API requests are successful:

```
/api/binance/api/v3/ticker/24hr?symbol=BTCUSDT → 200 OK
/api/binance/api/v3/ticker/24hr?symbol=ETHUSDT → 200 OK
/api/binance/api/v3/klines?symbol=BTCUSDT&... → 200 OK
```

### 3. Visual Verification

Scroll to Wave 7 section and verify:
- ✅ Interactive chart with candlesticks visible
- ✅ Timeframe buttons (1m, 5m, 15m, 1h, 4h, 1d) working
- ✅ Filter dropdowns functional
- ✅ Export buttons (CSV, JSON) working
- ✅ Analytics cards showing data
- ✅ Market prices updating

---

## Troubleshooting

### Issue: CORS Errors

**Symptom**: Console shows "blocked by CORS policy"

**Solution**:
1. Verify nginx proxy configuration is correct
2. Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
3. Ensure CORS headers are being added
4. Test proxy directly: `curl -I https://your-domain.com/api/binance/api/v3/ticker/24hr?symbol=BTCUSDT`

### Issue: Chart Not Initializing

**Symptom**: "addCandlestickSeries is not a function"

**Solution**:
1. Verify `lightweight-charts` version is 4.1.3 in `package.json`
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. Rebuild: `npm run build`
5. Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)

### Issue: Old Files Cached

**Symptom**: Changes not appearing after deployment

**Solution**:
1. Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Use Incognito mode: Cmd+Shift+N (Mac) or Ctrl+Shift+N (Windows)
3. Clear browser cache completely
4. Check if correct file is being served:
   ```bash
   curl -s https://your-domain.com/ | grep "main-"
   ```

### Issue: Market Data Not Updating

**Symptom**: Prices showing as $0 or not updating

**Solution**:
1. Check nginx proxy is working
2. Verify Binance API is accessible from server
3. Check browser console for API errors
4. Test API directly from server:
   ```bash
   curl https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT
   ```

---

## Performance Optimization

### 1. Enable Gzip Compression

Add to nginx configuration:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

### 2. Cache Static Assets

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    add_header Cache-Control "public, max-age=3600";
    try_files $uri =404;
}
```

### 3. Disable HTML Caching

```nginx
location ~* \.html$ {
    add_header Cache-Control "no-store, no-cache, must-revalidate";
    try_files $uri $uri/ =404;
}
```

---

## Monitoring

### Check Nginx Access Logs

```bash
sudo tail -f /var/log/nginx/access.log | grep binance
```

### Check Application Logs

Browser console (F12) will show:
- Chart initialization status
- API request/response logs
- Error messages if any

### Monitor API Usage

Binance API has rate limits:
- Weight-based system
- Our proxy caches for 5 seconds to reduce calls
- Monitor if you see 429 (Too Many Requests) errors

---

## Rollback Procedure

If issues occur, rollback to previous version:

### 1. Restore Previous Build

```bash
# If you kept backup
cp -r /var/www/your-app.backup/* /var/www/your-app/
```

### 2. Remove Binance Proxy

Comment out or remove the `/api/binance/` location block from nginx config.

### 3. Reload Nginx

```bash
sudo systemctl reload nginx
```

---

## Security Considerations

### 1. Rate Limiting

Add to nginx to prevent abuse:

```nginx
limit_req_zone $binary_remote_addr zone=binance:10m rate=10r/s;

location /api/binance/ {
    limit_req zone=binance burst=20;
    # ... rest of config
}
```

### 2. IP Whitelisting (Optional)

If you want to restrict access:

```nginx
location /api/binance/ {
    allow 1.2.3.4;  # Your IP
    deny all;
    # ... rest of config
}
```

### 3. SSL/TLS

Ensure strong SSL configuration:

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
ssl_prefer_server_ciphers off;
```

---

## Production Checklist

Before going live:

- [ ] Dependencies installed (`npm install`)
- [ ] Frontend built (`npm run build`)
- [ ] Nginx proxy configured
- [ ] Nginx configuration tested (`nginx -t`)
- [ ] Nginx reloaded (`systemctl reload nginx`)
- [ ] Files deployed to web server
- [ ] SSL certificate valid
- [ ] Binance proxy tested (curl)
- [ ] Browser console shows no errors
- [ ] Chart initializes successfully
- [ ] Market data updates
- [ ] All timeframes work
- [ ] Filters functional
- [ ] Export buttons work
- [ ] Analytics display correctly
- [ ] Mobile responsive
- [ ] Performance acceptable

---

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review nginx error logs
3. Check browser console for errors
4. Test API endpoints directly
5. Open GitHub issue with details

---

**Deployment Guide Version**: 1.0  
**Last Updated**: January 3, 2026  
**Compatible With**: Wave 7 (v1.7.0)
