# 🚀 Panduan Deploy ke VPS - AI POWER TRADE

## 📋 Informasi VPS Anda
- **IP**: 152.42.199.50
- **User**: root
- **OS**: Ubuntu 5.15
- **RAM**: 1.9GB ✅
- **Storage**: 68GB (56GB free) ✅

## 🎯 Cara Deploy (3 Langkah Mudah)

### **Langkah 1: Upload File ke VPS**

Di komputer lokal Anda, jalankan:

```bash
# Buat package deployment
chmod +x vps-deploy-simple.sh
./vps-deploy-simple.sh

# Upload ke VPS (masukkan password saat diminta)
scp ai-power-trade-deploy.tar.gz root@152.42.199.50:/root/
scp vps-install.sh root@152.42.199.50:/root/
```

### **Langkah 2: SSH ke VPS**

```bash
ssh root@152.42.199.50
```

### **Langkah 3: Install & Deploy**

Di dalam VPS, jalankan:

```bash
# Extract files
mkdir -p /opt/ai-power-trade
cd /root
tar -xzf ai-power-trade-deploy.tar.gz -C /opt/ai-power-trade

# Run installation
chmod +x vps-install.sh
./vps-install.sh
```

⏱️ **Waktu install: ~15-20 menit**

## ✅ Setelah Deploy

### Cek Status:
```bash
cd /opt/ai-power-trade
./check-status.sh
```

### Akses Aplikasi:
```
🌐 Main App: http://152.42.199.50/AI-POWER-TRADE-FINAL.html
🔍 Judge Verification: http://152.42.199.50/JUDGE-VERIFICATION.html
📊 GraphQL API: http://152.42.199.50/graphql
```

## 🔧 Troubleshooting

### Jika Linera tidak jalan:
```bash
# Restart Linera
pkill -f linera
cd /opt/ai-power-trade
nohup linera net up --testing-prng-seed 37 > /var/log/linera.log 2>&1 &
nohup linera service --port 8080 > /var/log/linera-service.log 2>&1 &
```

### Jika Nginx error:
```bash
systemctl restart nginx
tail -f /var/log/nginx/error.log
```

### Cek logs:
```bash
# Linera network
tail -f /var/log/linera.log

# Linera service
tail -f /var/log/linera-service.log

# Nginx
tail -f /var/log/nginx/error.log
```

## 🎉 Selesai!

Aplikasi Anda akan live di:
**http://152.42.199.50/AI-POWER-TRADE-FINAL.html**

Siap untuk demo hackathon! 🏆
