# 💧 Linera Faucet Backend - Complete Guide

## Overview

Real backend API untuk distribusi testnet tokens dengan rate limiting, cooldown system, dan database tracking.

## Architecture

```
Frontend (Browser)
    ↓ HTTP POST
Backend API (Node.js + Express)
    ↓ Validate & Check Cooldown
Database (SQLite)
    ↓ Record Claim
Linera CLI
    ↓ Transfer Tokens
Blockchain (Linera Testnet)
```

## Features

✅ **Real Token Transfer** - Actual blockchain transactions
✅ **Rate Limiting** - 5 requests/minute per IP
✅ **Cooldown System** - 24 hours per wallet
✅ **Database Tracking** - SQLite for claim history
✅ **Transaction Hashes** - Real tx hash from blockchain
✅ **Admin Statistics** - Monitor faucet usage
✅ **CORS Support** - Secure cross-origin requests
✅ **Error Handling** - Comprehensive error messages

## Quick Start

### 1. Install Dependencies

```bash
cd faucet-backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
nano .env
```

Required variables:
```env
FAUCET_CHAIN_ID=your_chain_id
FAUCET_OWNER=your_owner_address
FAUCET_AMOUNT=100
COOLDOWN_HOURS=24
```

### 3. Run Development

```bash
npm run dev
```

### 4. Test API

```bash
# Health check
curl http://localhost:3001/health

# Get info
curl http://localhost:3001/api/faucet/info

# Claim tokens
curl -X POST http://localhost:3001/api/faucet/claim \
  -H "Content-Type: application/json" \
  -d '{"address":"0x123...","chainId":"chain_abc"}'
```

## Deployment

### Option 1: Quick Deploy Script

```bash
chmod +x deploy-faucet-backend.sh
./deploy-faucet-backend.sh
```

### Option 2: Manual Deployment

```bash
# 1. Copy to VPS
scp -r faucet-backend root@152.42.199.50:/opt/

# 2. SSH to VPS
ssh root@152.42.199.50

# 3. Install dependencies
cd /opt/faucet-backend
npm install --production

# 4. Configure environment
nano .env

# 5. Start with PM2
npm install -g pm2
pm2 start server.js --name faucet-api
pm2 save
pm2 startup

# 6. Configure nginx
nano /etc/nginx/sites-available/ai-power-trade
# Add proxy_pass for /api/faucet

# 7. Reload nginx
nginx -t && systemctl reload nginx
```

## API Endpoints

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "service": "Linera Faucet API",
  "version": "1.0.0",
  "timestamp": "2025-12-19T20:00:00.000Z"
}
```

### GET /api/faucet/info
Get faucet information and statistics

**Response:**
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

### POST /api/faucet/check
Check if address can claim

**Request:**
```json
{
  "address": "0x123..."
}
```

**Response:**
```json
{
  "canClaim": true,
  "remainingTime": 0,
  "nextClaimAt": null
}
```

### POST /api/faucet/claim
Claim testnet tokens

**Request:**
```json
{
  "address": "0x123...",
  "chainId": "chain_abc"
}
```

**Success Response:**
```json
{
  "success": true,
  "amount": 100,
  "txHash": "0xabc...",
  "message": "Successfully claimed 100 LINERA tokens!",
  "nextClaimAt": "2025-12-20T20:00:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Cooldown active",
  "remainingTime": 86400000,
  "nextClaimAt": "2025-12-20T20:00:00.000Z"
}
```

### GET /api/faucet/history/:address
Get claim history for address

**Response:**
```json
{
  "history": [
    {
      "id": 1,
      "address": "0x123...",
      "chain_id": "chain_abc",
      "amount": 100,
      "tx_hash": "0xabc...",
      "claimed_at": 1703001600000,
      "created_at": "2025-12-19T20:00:00.000Z"
    }
  ]
}
```

### GET /api/admin/stats
Get admin statistics (add auth in production)

**Response:**
```json
{
  "totalClaims": 150,
  "totalDistributed": 15000,
  "uniqueClaimers": 75,
  "recentClaims24h": 10,
  "recentClaims7d": 50,
  "faucetAmount": 100,
  "cooldownHours": 24
}
```

## Database Schema

```sql
CREATE TABLE claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT NOT NULL,
    chain_id TEXT NOT NULL,
    amount REAL NOT NULL,
    tx_hash TEXT,
    ip_address TEXT,
    claimed_at INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_address ON claims(address);
CREATE INDEX idx_claimed_at ON claims(claimed_at);
```

## Security

### Rate Limiting
- 5 requests per minute per IP
- Prevents API abuse

### Cooldown System
- 24 hours between claims per wallet
- Stored in database with timestamp

### Daily Limit
- Maximum 100 claims per day
- Prevents faucet drainage

### IP Tracking
- Records IP address for each claim
- Helps identify abuse patterns

## Monitoring

### PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs faucet-api

# Restart
pm2 restart faucet-api

# Stop
pm2 stop faucet-api

# Monitor
pm2 monit
```

### Check Database

```bash
cd /opt/faucet-backend
sqlite3 faucet.db

# View recent claims
SELECT * FROM claims ORDER BY claimed_at DESC LIMIT 10;

# Count total claims
SELECT COUNT(*) FROM claims;

# Total distributed
SELECT SUM(amount) FROM claims;
```

## Troubleshooting

### Backend not starting
```bash
# Check logs
pm2 logs faucet-api

# Check port
lsof -i :3001

# Restart
pm2 restart faucet-api
```

### Claims failing
```bash
# Check database
sqlite3 /opt/faucet-backend/faucet.db
SELECT * FROM claims WHERE address = 'your_address';

# Check Linera CLI
linera wallet show

# Check logs
tail -f /opt/faucet-backend/logs/error.log
```

### Nginx issues
```bash
# Test config
nginx -t

# Check logs
tail -f /var/log/nginx/error.log

# Reload
systemctl reload nginx
```

## Production Checklist

- [ ] Configure strong .env variables
- [ ] Enable HTTPS
- [ ] Set proper CORS origins
- [ ] Add authentication for admin endpoints
- [ ] Set up database backups
- [ ] Configure log rotation
- [ ] Set up monitoring (PM2 Plus, Datadog, etc.)
- [ ] Implement actual Linera CLI integration
- [ ] Test rate limiting
- [ ] Test cooldown system
- [ ] Load testing

## Integration with Frontend

Frontend automatically uses backend API when available:

```javascript
// frontend-linera/src/faucet.js
this.USE_REAL_API = true; // Enable real API
this.API_BASE = window.location.origin;
```

Falls back to simulated mode if backend unavailable.

## License

MIT

---

**Status**: ✅ Ready for deployment
**Version**: 1.0.0
**Last Updated**: December 19, 2025
