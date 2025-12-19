# 🖥️ VPS Requirements for AI POWER TRADE

## 💻 Minimum Specs

### Basic Deployment (Recommended)
```
CPU: 1 vCPU
RAM: 2GB
Storage: 25GB SSD
Bandwidth: 1TB/month
OS: Ubuntu 22.04 LTS
```

**Cost Examples:**
- DigitalOcean: $12/month
- Vultr: $10/month  
- Linode: $12/month
- AWS t3.small: ~$15/month

### Ultra-Budget (Works but slower)
```
CPU: 1 vCPU
RAM: 1GB
Storage: 20GB SSD
Bandwidth: 500GB/month
```

**Cost Examples:**
- Vultr: $6/month
- DigitalOcean: $6/month
- Contabo: $4/month

### Premium (Smooth performance)
```
CPU: 2 vCPU
RAM: 4GB
Storage: 50GB SSD
Bandwidth: 2TB/month
```

**Cost Examples:**
- DigitalOcean: $24/month
- AWS t3.medium: ~$30/month

## 📊 Resource Usage Breakdown

### Linera Blockchain
- **RAM**: ~500MB (network + contracts)
- **CPU**: Low (unless heavy trading)
- **Storage**: ~2GB (blockchain data)
- **Network**: ~100MB/day

### Web Server (Nginx)
- **RAM**: ~50MB
- **CPU**: Minimal
- **Storage**: ~500MB (static files)

### System (Ubuntu)
- **RAM**: ~300MB base
- **Storage**: ~8GB OS

### Total Usage
- **RAM**: ~850MB used / 2GB = 42%
- **Storage**: ~10GB used / 25GB = 40%
- **CPU**: <20% average

## 🎯 Recommended VPS Providers

### 1. DigitalOcean (Best for beginners)
```
Droplet: Basic $12/month
- 1 vCPU, 2GB RAM, 50GB SSD
- Easy setup, good docs
- 1-click Ubuntu install
```

### 2. Vultr (Best value)
```
Regular Performance: $10/month  
- 1 vCPU, 2GB RAM, 55GB SSD
- Multiple locations
- Hourly billing
```

### 3. Contabo (Cheapest)
```
VPS S: $4/month
- 4 vCPU, 8GB RAM, 50GB SSD  
- Great specs for price
- Europe-based
```

## 🚀 Quick Setup Commands

### 1-Click Deploy Script
```bash
# For 2GB RAM VPS
curl -sSL https://raw.githubusercontent.com/[user]/AI-POWER-TRADE-LINERA/main/deploy-production.sh | sudo bash

# Estimated time: 15-20 minutes
```

### Manual Resource Check
```bash
# Check available resources
free -h                 # RAM usage
df -h                   # Disk usage  
htop                    # CPU usage
```

## ⚠️ Important Notes

### Minimum Requirements
- **RAM**: 1.5GB minimum (2GB recommended)
- **Storage**: 20GB minimum (25GB+ recommended)  
- **Network**: Stable connection required
- **OS**: Ubuntu 20.04+ or Debian 11+

### Performance Tips
```bash
# Optimize for low RAM
echo 'vm.swappiness=10' >> /etc/sysctl.conf

# Enable swap (if <2GB RAM)
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

## 💰 Cost Comparison (Monthly)

| Provider | Specs | Price | Best For |
|----------|-------|-------|----------|
| **Vultr** | 1CPU/2GB/55GB | $10 | **Recommended** |
| DigitalOcean | 1CPU/2GB/50GB | $12 | Beginners |
| Linode | 1CPU/2GB/50GB | $12 | Reliability |
| Contabo | 4CPU/8GB/50GB | $4 | **Budget** |
| AWS t3.small | 2CPU/2GB/20GB | $15 | Enterprise |

## 🎯 Final Recommendation

### For Hackathon: **Vultr $10/month**
- Perfect specs for Linera
- Hourly billing (pay only when needed)
- Fast deployment
- Good performance

### Setup Time: **20 minutes total**
1. Create VPS (2 minutes)
2. Run deploy script (15 minutes)  
3. Test & verify (3 minutes)

**Result:** Public AI POWER TRADE with real Linera blockchain! 🚀