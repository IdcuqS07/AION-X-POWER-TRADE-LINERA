# 🔗 Integrasi Frontend AI Power Trade dengan Linera Backend

## 📋 Overview

**Ya, frontend yang sudah ada di Vercel BISA langsung diintegrasikan dengan Linera!**

Frontend saat ini menggunakan:
- Next.js + React
- FastAPI backend di Render/VPS
- REST API calls

Yang perlu dilakukan:
- **Replace** FastAPI backend calls → **Linera GraphQL**
- Update API endpoints
- Modify data fetching logic
- Keep UI/UX sama

---

## 🎯 Strategi Integrasi

### Option 1: Full Migration (Recommended)
Replace semua backend calls dengan Linera GraphQL

### Option 2: Hybrid Approach
- Keep FastAPI untuk AI prediction (heavy computation)
- Use Linera untuk trading execution & portfolio

### Option 3: Proxy Pattern
- Create middleware yang translate REST → GraphQL
- Minimal code changes di frontend

---

## 🔧 Implementation Guide

### STEP 1: Setup Linera Service

```bash
# Start Linera service dengan public access
linera service --port 8080 --listen-address 0.0.0.0:8080

# Get your application URLs
export LINERA_ENDPOINT="http://YOUR_SERVER_IP:8080"
export CHAIN_ID="your-chain-id"
export APP_ID="your-trading-app-id"

# GraphQL endpoint will be:
# http://YOUR_SERVER_IP:8080/chains/$CHAIN_ID/applications/$APP_ID
```

### STEP 2: Create API Adapter Layer

Create `lib/linera-client.ts` di frontend:

```typescript
// lib/linera-client.ts
import { GraphQLClient } from 'graphql-request';

const LINERA_ENDPOINT = process.env.NEXT_PUBLIC_LINERA_ENDPOINT || 'http://localhost:8080';
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
const APP_ID = process.env.NEXT_PUBLIC_APP_ID;

export class LineraClient {
  private client: GraphQLClient;
  
  constructor() {
    const endpoint = `${LINERA_ENDPOINT}/chains/${CHAIN_ID}/applications/${APP_ID}`;
    this.client = new GraphQLClient(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Portfolio queries
  async getPortfolio() {
    const query = `
      query {
        portfolio {
          balance
          totalValue
          unrealizedPnl
          positions {
            symbol
            amount
            entryPrice
            currentPrice
            unrealizedPnl
            pnlPercent
          }
        }
      }
    `;
    
    return this.client.request(query);
  }

  // Trading signal
  async getSignal(symbol: string) {
    const query = `
      query GetSignal($symbol: String!) {
        signal(symbol: $symbol) {
          symbol
          signalType
          confidence
          price
          rsi
          recommendation
        }
      }
    `;
    
    return this.client.request(query, { symbol });
  }

  // Execute trade
  async executeTrade(symbol: string, side: 'BUY' | 'SELL', amount: number) {
    const mutation = `
      mutation ExecuteTrade($symbol: String!, $side: TradeSideEnum!, $amount: Float!) {
        executeTrade(symbol: $symbol, side: $side, amount: $amount) {
          id
          symbol
          side
          amount
          price
          timestamp
          pnl
        }
      }
    `;
    
    return this.client.request(mutation, { symbol, side, amount });
  }

  // Update signal (dari AI prediction service)
  async updateSignal(symbol: string, price: number, rsi: number) {
    const mutation = `
      mutation UpdateSignal($symbol: String!, $price: Float!, $rsi: Float!) {
        updateSignal(symbol: $symbol, price: $price, rsi: $rsi)
      }
    `;
    
    return this.client.request(mutation, { symbol, price, rsi });
  }

  // Get trade history
  async getTrades(limit: number = 10) {
    const query = `
      query GetTrades($limit: Int) {
        trades(limit: $limit) {
          id
          symbol
          side
          amount
          price
          timestamp
          pnl
        }
      }
    `;
    
    return this.client.request(query, { limit });
  }

  // Get risk metrics
  async getRiskMetrics() {
    const query = `
      query {
        riskMetrics {
          maxPositionPercent
          maxDailyTrades
          dailyTradesRemaining
          currentExposure
        }
      }
    `;
    
    return this.client.request(query);
  }

  // Update price (from market data service)
  async updatePrice(symbol: string, price: number) {
    const mutation = `
      mutation UpdatePrice($symbol: String!, $price: Float!) {
        updatePrice(symbol: $symbol, price: $price)
      }
    `;
    
    return this.client.request(mutation, { symbol, price });
  }

  // Health check
  async health() {
    const query = `
      query {
        health
      }
    `;
    
    return this.client.request(query);
  }
}

export const lineraClient = new LineraClient();
```

### STEP 3: Update API Routes

Modify existing API routes untuk use Linera:

```typescript
// pages/api/portfolio.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { lineraClient } from '@/lib/linera-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const portfolio = await lineraClient.getPortfolio();
    res.status(200).json(portfolio);
  } catch (error) {
    console.error('Portfolio error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
}
```

```typescript
// pages/api/trades/execute.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { lineraClient } from '@/lib/linera-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { symbol, side, amount } = req.body;
    
    const result = await lineraClient.executeTrade(symbol, side, amount);
    
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Trade execution error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to execute trade' 
    });
  }
}
```

```typescript
// pages/api/predictions/[symbol].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { lineraClient } from '@/lib/linera-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { symbol } = req.query;
    
    const signal = await lineraClient.getSignal(symbol as string);
    
    res.status(200).json(signal);
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to get prediction' });
  }
}
```

### STEP 4: Update React Components

Modify components untuk use new API structure:

```typescript
// components/Dashboard.tsx
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [signals, setSignals] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Refresh every 5 seconds
    const interval = setInterval(loadDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadDashboardData() {
    try {
      // Fetch portfolio
      const portfolioRes = await fetch('/api/portfolio');
      const portfolioData = await portfolioRes.json();
      setPortfolio(portfolioData.portfolio);

      // Fetch signals for each symbol
      const symbols = ['BTC', 'ETH', 'BNB', 'SOL'];
      const signalsPromises = symbols.map(async (symbol) => {
        const res = await fetch(`/api/predictions/${symbol}`);
        const data = await res.json();
        return [symbol, data.signal];
      });
      
      const signalsData = await Promise.all(signalsPromises);
      setSignals(Object.fromEntries(signalsData));
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  }

  async function executeTrade(symbol: string) {
    try {
      const signal = signals[symbol];
      if (!signal) return;

      const res = await fetch('/api/trades/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          side: signal.signalType, // 'BUY' or 'SELL'
          amount: 0.1, // Calculate based on risk
        }),
      });

      const result = await res.json();
      
      if (res.ok) {
        alert(`Trade executed: ${result.executeTrade.id}`);
        loadDashboardData(); // Refresh
      } else {
        alert(`Trade failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Trade error:', error);
      alert('Failed to execute trade');
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      {/* Portfolio Section */}
      <div className="portfolio">
        <h2>Portfolio</h2>
        <div className="balance">Balance: {portfolio?.balance}</div>
        <div className="total-value">Total Value: {portfolio?.totalValue}</div>
        <div className="pnl">P&L: {portfolio?.unrealizedPnl}</div>
        
        <h3>Positions</h3>
        {portfolio?.positions?.map((pos) => (
          <div key={pos.symbol} className="position">
            <span>{pos.symbol}</span>
            <span>{pos.amount}</span>
            <span>Entry: ${pos.entryPrice}</span>
            <span>Current: ${pos.currentPrice}</span>
            <span className={pos.pnlPercent > 0 ? 'profit' : 'loss'}>
              {pos.pnlPercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Signals Section */}
      <div className="signals">
        <h2>AI Signals</h2>
        {Object.entries(signals).map(([symbol, signal]: [string, any]) => (
          <div key={symbol} className="signal-card">
            <h3>{symbol}</h3>
            <div className="signal-type">{signal?.signalType}</div>
            <div className="confidence">
              Confidence: {signal?.confidence?.toFixed(1)}%
            </div>
            <div className="rsi">RSI: {signal?.rsi?.toFixed(1)}</div>
            <div className="recommendation">{signal?.recommendation}</div>
            
            {signal?.signalType !== 'HOLD' && (
              <button 
                onClick={() => executeTrade(symbol)}
                className={`btn-${signal.signalType.toLowerCase()}`}
              >
                Execute {signal.signalType}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### STEP 5: Environment Configuration

Update `.env.local`:

```bash
# Linera Configuration
NEXT_PUBLIC_LINERA_ENDPOINT=http://YOUR_SERVER_IP:8080
NEXT_PUBLIC_CHAIN_ID=your-chain-id-here
NEXT_PUBLIC_APP_ID=your-trading-app-id-here

# Keep existing if using hybrid approach
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### STEP 6: Install Dependencies

```bash
cd frontend
npm install graphql-request graphql
```

Update `package.json`:

```json
{
  "dependencies": {
    "graphql": "^16.8.1",
    "graphql-request": "^6.1.0",
    // ... existing dependencies
  }
}
```

---

## 🔄 Migration Strategies

### Strategy A: Direct Migration (Fastest)

**Timeline: 1-2 days**

1. ✅ Setup Linera backend
2. ✅ Create `linera-client.ts`
3. ✅ Update API routes (portfolio, trades, signals)
4. ✅ Test thoroughly
5. ✅ Deploy

**Pros:**
- Simple, direct approach
- All logic in Linera
- No redundant systems

**Cons:**
- Need to migrate AI logic to Rust (or keep separate)

### Strategy B: Hybrid Approach (Most Practical)

**Timeline: 2-3 days**

**Keep FastAPI for:**
- AI Prediction (heavy computation)
- Price fetching (CoinGecko, Binance)
- Complex calculations (MACD, Bollinger Bands)

**Use Linera for:**
- Trade execution
- Portfolio management
- On-chain state
- Risk management

**Implementation:**
```typescript
// Hybrid client
class HybridTradingClient {
  private linera: LineraClient;
  private fastapi: FastAPIClient;

  async getSignal(symbol: string) {
    // AI from FastAPI
    const aiSignal = await this.fastapi.getPrediction(symbol);
    
    // Update Linera
    await this.linera.updateSignal(
      symbol, 
      aiSignal.price, 
      aiSignal.rsi
    );
    
    // Get validated signal from Linera
    return this.linera.getSignal(symbol);
  }

  async executeTrade(symbol: string, side: string, amount: number) {
    // Execute on Linera (on-chain)
    return this.linera.executeTrade(symbol, side, amount);
  }
}
```

### Strategy C: Proxy Pattern (Least Changes)

**Timeline: 3-4 days**

Create middleware yang translate REST API calls ke GraphQL:

```typescript
// pages/api/proxy/[...path].ts
import { lineraClient } from '@/lib/linera-client';

export default async function handler(req, res) {
  const { path } = req.query;
  const endpoint = path.join('/');

  // Map REST endpoints to GraphQL
  const mapping = {
    'dashboard': () => lineraClient.getPortfolio(),
    'predictions/:symbol': (symbol) => lineraClient.getSignal(symbol),
    'trades/execute': () => lineraClient.executeTrade(
      req.body.symbol,
      req.body.side,
      req.body.amount
    ),
  };

  // Execute mapped function
  const result = await mapping[endpoint](...args);
  res.json(result);
}
```

---

## 🚀 Deployment Steps

### 1. Deploy Linera Backend

```bash
# On your server (VPS/Cloud)
# Install Linera
git clone https://github.com/linera-io/linera-protocol.git
cd linera-protocol
cargo build --release

# Setup wallet
linera wallet init --with-new-chain \
  --faucet https://faucet.testnet-babbage.linera.net

# Build & deploy your trading app
cd ~/ai-trading-linera
cargo build --target wasm32-unknown-unknown --release
linera publish-bytecode target/wasm32.../ai_trading.wasm
linera create-application <bytecode-id>

# Start service with public access
linera service --port 8080 --listen-address 0.0.0.0:8080
```

### 2. Update Frontend Config

```bash
# Update .env.local
NEXT_PUBLIC_LINERA_ENDPOINT=https://your-server.com:8080
NEXT_PUBLIC_CHAIN_ID=e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65
NEXT_PUBLIC_APP_ID=e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65000000000000000000000000
```

### 3. Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "Integrate Linera backend"
git push

# Vercel will auto-deploy
# Or manual:
vercel --prod
```

### 4. Configure Environment Variables in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add:
   - `NEXT_PUBLIC_LINERA_ENDPOINT`
   - `NEXT_PUBLIC_CHAIN_ID`
   - `NEXT_PUBLIC_APP_ID`

---

## 🧪 Testing

### Test Checklist

```bash
# 1. Test Linera connection
curl http://YOUR_SERVER:8080/chains/$CHAIN_ID/applications/$APP_ID

# 2. Test portfolio query
curl -X POST http://YOUR_SERVER:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ portfolio { balance } }"}'

# 3. Test frontend locally
npm run dev
# Visit http://localhost:3000

# 4. Test trade execution
# Click "Execute Trade" button
# Check Linera logs
```

---

## 📊 Performance Comparison

| Feature | FastAPI Backend | Linera Backend |
|---------|----------------|----------------|
| Trade Latency | 200-500ms | **50-100ms** ✅ |
| Finality | N/A (centralized) | **< 0.5s** ✅ |
| Scalability | Limited by server | **Unlimited** ✅ |
| Cost | Server hosting | **Very low** ✅ |
| Decentralization | ❌ | ✅ |
| On-chain State | ❌ | ✅ |
| AI Computation | ✅ | 🤔 (possible but slower) |

**Recommendation:** Hybrid approach - FastAPI for AI, Linera for trading

---

## 🎯 Next Steps

1. **Week 1:** Setup Linera backend & deploy
2. **Week 2:** Implement adapter layer
3. **Week 3:** Update frontend components
4. **Week 4:** Testing & optimization

---

## 💡 Tips

1. **Start Small:** Migrate one feature at a time (portfolio first)
2. **Keep Backups:** Don't delete FastAPI immediately
3. **Test Thoroughly:** Use testnet before mainnet
4. **Monitor Performance:** Compare latency before/after
5. **User Feedback:** Soft launch with beta testers

---

## 🔧 Troubleshooting

### CORS Issues
```bash
# Start Linera service with CORS
linera service --port 8080 --listen-address 0.0.0.0:8080 --cors-origin "*"
```

### GraphQL Errors
```typescript
// Add error handling
try {
  const result = await lineraClient.getPortfolio();
} catch (error) {
  if (error.response?.errors) {
    console.error('GraphQL errors:', error.response.errors);
  }
}
```

### Connection Issues
```bash
# Check Linera service
curl http://localhost:8080/health

# Check firewall
sudo ufw allow 8080
```

---

## ✅ Benefits of Integration

1. **🚀 Faster:** Sub-second finality
2. **💰 Cheaper:** No gas wars
3. **🔒 Secure:** On-chain validation
4. **📈 Scalable:** Unlimited microchains
5. **🎯 Transparent:** Full audit trail
6. **🤝 Decentralized:** No single point of failure

---

**Ready to integrate? Start with Strategy B (Hybrid) for best results!**
