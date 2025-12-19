# Linera Testnet Faucet Backend

Backend API for distributing testnet tokens to users.

## Features

- ✅ Token distribution with rate limiting
- ✅ 24-hour cooldown per wallet
- ✅ SQLite database for claim tracking
- ✅ IP-based rate limiting
- ✅ Transaction hash tracking
- ✅ Admin statistics endpoint
- ✅ CORS support for frontend

## Setup

### 1. Install Dependencies

```bash
cd faucet-backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your faucet wallet details
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Run Production Server

```bash
npm start
```

## API Endpoints

### Health Check
```
GET /health
```

### Get Faucet Info
```
GET /api/faucet/info
```

Response:
```json
{
  "amount": 100,
  "cooldownHours": 24,
  "stats": {
    "totalClaims": 150,
    "totalDistributed": 15000,
    "uniqueClaimers": 75,
    "recentClaims": 10
  }
}
```

### Check Eligibility
```
POST /api/faucet/check
Content-Type: application/json

{
  "address": "0x..."
}
```

Response:
```json
{
  "canClaim": true,
  "remainingTime": 0,
  "nextClaimAt": null
}
```

### Claim Tokens
```
POST /api/faucet/claim
Content-Type: application/json

{
  "address": "0x...",
  "chainId": "chain_id_here"
}
```

Response:
```json
{
  "success": true,
  "amount": 100,
  "txHash": "0x...",
  "message": "Successfully claimed 100 LINERA tokens!",
  "nextClaimAt": "2025-12-20T20:00:00.000Z"
}
```

### Get Claim History
```
GET /api/faucet/history/:address
```

### Admin Stats
```
GET /api/admin/stats
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3001 |
| FAUCET_AMOUNT | Tokens per claim | 100 |
| COOLDOWN_HOURS | Hours between claims | 24 |
| MAX_CLAIMS_PER_DAY | Daily claim limit | 100 |

## Database

Uses SQLite for claim tracking. Database file: `faucet.db`

Schema:
```sql
CREATE TABLE claims (
    id INTEGER PRIMARY KEY,
    address TEXT NOT NULL,
    chain_id TEXT NOT NULL,
    amount REAL NOT NULL,
    tx_hash TEXT,
    ip_address TEXT,
    claimed_at INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment

### VPS Deployment

1. Copy files to VPS
2. Install dependencies
3. Configure .env
4. Run with PM2:

```bash
npm install -g pm2
pm2 start server.js --name faucet-api
pm2 save
pm2 startup
```

### Nginx Reverse Proxy

```nginx
location /api/faucet {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Security

- Rate limiting: 5 requests/minute per IP
- Cooldown: 24 hours per wallet
- Daily limit: 100 claims total
- IP tracking for abuse prevention

## Production Checklist

- [ ] Set strong environment variables
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up monitoring
- [ ] Configure backup for database
- [ ] Add authentication for admin endpoints
- [ ] Implement actual Linera CLI integration
- [ ] Set up logging

## License

MIT
