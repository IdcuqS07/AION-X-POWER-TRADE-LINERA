# 🌐 Linera Testnet Conway Setup

## Overview

This guide helps you set up a wallet and interact with the latest Linera Testnet (Conway).

## Prerequisites

- Linera CLI installed
- Internet connection
- Terminal access

## Quick Setup

### Option 1: Automated Script

```bash
cd frontend-linera
./setup-wallet.sh
```

### Option 2: Manual Commands

```bash
# Initialize wallet with faucet
linera wallet init --faucet https://faucet.testnet-conway.linera.net

# Request a new chain
linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net
```

## Verify Setup

### Check Wallet Info

```bash
linera wallet show
```

**Expected output:**
```
Wallet:
  Public Key: ...
  Address: ...
```

### List Your Chains

```bash
linera wallet list
```

**Expected output:**
```
Chain 0: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65
  Balance: 10.0
  Owner: ...
```

### Check Balance

```bash
linera query-balance
```

## Faucet Information

- **URL**: https://faucet.testnet-conway.linera.net
- **Purpose**: Provides test tokens and creates chains
- **Rate Limit**: May have delays during high usage

## Common Commands

### View Wallet Configuration

```bash
cat ~/.config/linera/wallet.json
```

### Reset Wallet (Start Fresh)

```bash
rm -rf ~/.config/linera/wallet.json
./setup-wallet.sh
```

### Export Private Key

```bash
linera wallet export
```

## Integration with Frontend

The frontend application (`src/linera.js`) is configured to use the same faucet:

```javascript
this.config = {
    faucetUrl: 'https://faucet.testnet-conway.linera.net',
    applicationId: null,
};
```

## Troubleshooting

### Issue: "Wallet already exists"

**Solution:**
```bash
# Backup existing wallet
mv ~/.config/linera/wallet.json ~/.config/linera/wallet.json.backup

# Create new wallet
linera wallet init --faucet https://faucet.testnet-conway.linera.net
```

### Issue: "Failed to connect to faucet"

**Possible causes:**
- Network connectivity issues
- Faucet is temporarily down
- Rate limiting

**Solution:**
- Wait a few minutes and try again
- Check internet connection
- Verify faucet URL is correct

### Issue: "Insufficient balance"

**Solution:**
```bash
# Request more tokens from faucet
linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net
```

## Next Steps

After wallet setup:

1. ✅ Start the frontend: `npm run dev`
2. ✅ Create wallet in browser
3. ✅ Generate trading signals
4. ✅ Deploy your application

## Resources

- **Linera Documentation**: https://linera.dev/
- **Testnet Status**: Check official Linera channels
- **Support**: Linera Discord/Telegram

---

**Ready to build on Linera!** 🚀
