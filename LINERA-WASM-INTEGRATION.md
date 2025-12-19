# 🚀 Linera WASM Integration for AI POWER TRADE

## 📦 Files Created

1. **`linera-wasm-client.js`** - WASM client wrapper
2. **`AI-POWER-TRADE-WASM.html`** - Demo HTML with WASM integration
3. **`LINERA-WASM-INTEGRATION.md`** - This file

## 🎯 Integration Strategy

### **3-Tier Approach:**

1. **WASM Mode** (Best) - Full Linera WASM client
2. **GraphQL Mode** (Good) - Direct GraphQL queries
3. **Simulation Mode** (Fallback) - Demo data

## 📋 Deployment Steps

### **Step 1: Upload Files to VPS**

```bash
# On your local machine
scp linera-wasm-client.js root@152.42.199.50:/opt/ai-power-trade/
scp AI-POWER-TRADE-WASM.html root@152.42.199.50:/opt/ai-power-trade/
```

### **Step 2: Setup GraphQL Mock (Temporary)**

```bash
# On VPS
cd /opt/ai-power-trade

# Create GraphQL mock
cat > graphql-mock.py << 'EOF'
from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class GraphQLHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = {
            "data": {
                "chains": {
                    "list": ["42f7e939d331b7cb8343436fda0f4a0d0a9cc34622adbd0b5cf9f240c2120eed"]
                }
            }
        }
        self.wfile.write(json.dumps(response).encode())

print("GraphQL Mock on :8080")
HTTPServer(('0.0.0.0', 8080), GraphQLHandler).serve_forever()
EOF

# Start mock
pkill -f graphql-mock
nohup python3 graphql-mock.py > /var/log/graphql-mock.log 2>&1 &

# Test
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { chains { list } }"}'
```

### **Step 3: Test Application**

Open in browser:
```
http://152.42.199.50/AI-POWER-TRADE-WASM.html
```

## 🔧 How It Works

### **Linera WASM Client Flow:**

```
1. Initialize WASM
   ↓
2. Create Wallet (from mnemonic)
   ↓
3. Claim Chain (from faucet)
   ↓
4. Create Client
   ↓
5. Get Application
   ↓
6. Query/Mutate
```

### **Fallback Flow:**

```
WASM Available? 
  ├─ Yes → Use WASM Client
  └─ No → Try GraphQL
           ├─ Success → GraphQL Mode
           └─ Fail → Simulation Mode
```

## 📚 API Reference

### **LineraWasmClient Class**

```javascript
const client = new LineraWasmClient();

// Initialize
await client.init();

// Create wallet
const { mnemonic, owner } = await client.createWallet();

// Claim chain
const chainId = await client.claimChain();

// Create client
await client.createClient();

// Get application
await client.getApplication(applicationId);

// Query
const result = await client.query('query { chains { list } }');

// Mutate
const result = await client.mutate('mutation { ... }');

// Get info
const info = client.getWalletInfo();

// Reset
client.reset();
```

## 🎨 Integration with AI POWER TRADE

To integrate with your main `AI-POWER-TRADE-FINAL.html`:

1. **Add script tag:**
```html
<script src="linera-wasm-client.js"></script>
```

2. **Initialize in your code:**
```javascript
const lineraClient = new LineraWasmClient();

async function createNewWallet() {
    try {
        await lineraClient.init();
        const wallet = await lineraClient.createWallet();
        const chainId = await lineraClient.claimChain();
        
        // Update UI
        userWallet.chainId = chainId;
        userWallet.ownerId = wallet.owner;
        updateWalletUI();
    } catch (error) {
        // Fallback to GraphQL or simulation
        console.error(error);
    }
}
```

## 🚀 Production Deployment

### **Option 1: Use Linera Devnet Faucet**
- Faucet URL: `https://faucet.devnet.linera.io`
- Service URL: Your VPS GraphQL endpoint

### **Option 2: Run Local Linera Network**
- Start validator on VPS
- Start service on port 8080
- Update config in `linera-wasm-client.js`

### **Option 3: Hybrid Mode**
- WASM for wallet creation
- GraphQL for queries
- Best of both worlds

## 📊 Current Status

- ✅ WASM client wrapper created
- ✅ Demo HTML with fallback modes
- ✅ GraphQL mock for testing
- ⏳ Linera WASM CDN (pending)
- ⏳ Full validator setup (in progress)

## 🔗 Next Steps

1. **Test WASM demo** on VPS
2. **Integrate with main app** (AI-POWER-TRADE-FINAL.html)
3. **Setup real Linera service** (replace mock)
4. **Deploy to production**

## 📝 Notes

- WASM module needs to be loaded from CDN or bundled
- For now, fallback to GraphQL mode works perfectly
- Simulation mode ensures app always works
- Real WASM integration ready when Linera CDN available

---

**Built with ❤️ for Linera Hackathon** 🏆
