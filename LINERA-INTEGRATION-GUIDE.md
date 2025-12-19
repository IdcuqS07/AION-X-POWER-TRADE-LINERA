# 🚀 Linera Frontend Integration - AI POWER TRADE

## 📋 Yang Sudah Dibuat

### **1. AI-POWER-TRADE-LINERA.html**
Frontend standalone dengan integrasi Linera WASM yang proper, mengikuti pattern dari deadkeys example.

**Fitur:**
- ✅ Auto-initialize Linera WASM on page load
- ✅ Create wallet dengan mnemonic generation
- ✅ Claim chain dari Linera faucet
- ✅ Restore wallet dari localStorage
- ✅ AI Trading signals integration
- ✅ Trading history tracking
- ✅ Proper error handling & fallbacks

**Teknologi:**
- `@linera/client@0.15.6` - Linera WASM client
- `@linera/signer@0.15.6` - Wallet signer
- Vanilla JavaScript (no bundler needed)
- ES6 modules via unpkg CDN

### **2. deploy-linera-frontend.sh**
Script deployment otomatis ke VPS dengan:
- Node.js HTTP server dengan CORS headers yang proper
- Nginx reverse proxy configuration
- Auto-start service
- Log monitoring

## 🎯 Cara Kerja

### **Linera Integration Flow:**

```
1. Load page
   ↓
2. Import @linera/client & @linera/signer from CDN
   ↓
3. Initialize Linera WASM (linera.default())
   ↓
4. Check localStorage for existing wallet
   ├─ Found → Restore wallet
   └─ Not found → Show "Create Wallet" button
   ↓
5. User clicks "Create Wallet"
   ↓
6. Generate mnemonic → Create PrivateKey
   ↓
7. Connect to Linera Faucet (faucet.devnet.linera.io)
   ↓
8. Create wallet via faucet.createWallet()
   ↓
9. Claim chain via faucet.claimChain()
   ↓
10. Create Linera Client
   ↓
11. Ready to trade! 🎉
```

### **Key Components:**

```javascript
// 1. Initialize WASM
await linera.default();

// 2. Create signer from mnemonic
const signer = PrivateKey.fromMnemonic(mnemonic);
const owner = signer.address();

// 3. Connect to faucet
const faucet = new linera.Faucet('https://faucet.devnet.linera.io');

// 4. Create wallet
const wallet = await faucet.createWallet();

// 5. Claim chain
const chainId = await faucet.claimChain(wallet, owner);

// 6. Create client
const client = await new linera.Client(wallet, signer, false);
```

## 🚀 Deployment

### **Quick Deploy:**

```bash
chmod +x deploy-linera-frontend.sh
./deploy-linera-frontend.sh
```

### **Manual Steps:**

```bash
# 1. Upload file
scp AI-POWER-TRADE-LINERA.html root@152.42.199.50:/opt/ai-power-trade/

# 2. SSH to VPS
ssh root@152.42.199.50

# 3. Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 4. Create server with CORS headers
cd /opt/ai-power-trade
cat > linera-server.js << 'EOF'
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const server = http.createServer((req, res) => {
    // CORS headers for Linera WASM
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    let filePath = req.url === '/' ? './AI-POWER-TRADE-LINERA.html' : '.' + req.url;
    const extname = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
    };
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': mimeTypes[extname] || 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running at http://0.0.0.0:${PORT}/`);
});
EOF

# 5. Start server
pkill -f "node linera-server.js" || true
nohup node linera-server.js > /var/log/linera-frontend.log 2>&1 &

# 6. Update Nginx
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        add_header Cross-Origin-Opener-Policy same-origin always;
        add_header Cross-Origin-Embedder-Policy require-corp always;
    }
    
    location /graphql {
        proxy_pass http://localhost:8080;
        add_header Access-Control-Allow-Origin * always;
    }
}
EOF

nginx -t && systemctl reload nginx
```

## 🧪 Testing

### **1. Check Server:**
```bash
ssh root@152.42.199.50 "curl -I http://localhost:3000"
```

Should see:
```
HTTP/1.1 200 OK
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

### **2. Access Frontend:**
```
http://152.42.199.50/
```

### **3. Test Wallet Creation:**
1. Open browser console (F12)
2. Click "Create Wallet"
3. Watch console logs:
   - ✅ Linera modules loaded
   - ✅ Initializing Linera WASM
   - ✅ Creating wallet
   - ✅ Claiming chain from faucet
   - ✅ Wallet created successfully

### **4. Check localStorage:**
```javascript
// In browser console
localStorage.getItem('linera_mnemonic')
localStorage.getItem('linera_chain_id')
```

## 📊 Monitoring

```bash
# Frontend logs
ssh root@152.42.199.50 "tail -f /var/log/linera-frontend.log"

# Nginx logs
ssh root@152.42.199.50 "tail -f /var/log/nginx/error.log"

# Check processes
ssh root@152.42.199.50 "ps aux | grep -E 'node|nginx'"
```

## 🔧 Troubleshooting

### **Issue: CORS errors**
**Solution:** Pastikan headers sudah set di Node.js server:
```javascript
res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
```

### **Issue: SharedArrayBuffer not available**
**Solution:** CORS headers wajib ada. Cek dengan:
```bash
curl -I http://152.42.199.50/
```

### **Issue: Faucet connection failed**
**Solution:** 
- Cek internet connection VPS
- Pastikan bisa akses `https://faucet.devnet.linera.io`
- Fallback: Pakai local validator + service

### **Issue: Module not found**
**Solution:** CDN unpkg kadang lambat, tunggu atau ganti ke:
```javascript
import * as linera from 'https://cdn.jsdelivr.net/npm/@linera/client@0.15.6/+esm';
```

## 🎨 Customization

### **Change Faucet URL:**
```javascript
window.lineraState.config.faucetUrl = 'http://your-faucet-url';
```

### **Add Application ID:**
```javascript
window.lineraState.config.applicationId = 'your-app-id';

// Then get application
const app = await client.frontend().application(applicationId);
```

### **Custom GraphQL Queries:**
```javascript
const result = await application.query(`
    query {
        chains {
            list
        }
    }
`);
```

## 📚 References

- **Linera Docs:** https://linera.dev/
- **@linera/client:** https://www.npmjs.com/package/@linera/client
- **Deadkeys Example:** `/deadkeys/frontend/src/linera/`
- **Faucet:** https://faucet.devnet.linera.io

## ✅ Next Steps

1. ✅ Deploy frontend ke VPS
2. ⏳ Test wallet creation
3. ⏳ Integrate AI trading logic
4. ⏳ Connect to real Linera application
5. ⏳ Add transaction signing
6. ⏳ Deploy for hackathon demo

---

**Built with ❤️ for Linera Hackathon** 🏆
