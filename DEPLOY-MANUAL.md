# 🚀 Deploy Manual ke VPS - Step by Step

## VPS Info
- IP: **152.42.199.50**
- User: **root**
- Password: (yang Anda punya)

## 📝 Langkah Deploy

### **STEP 1: Buat Package (di komputer lokal)**

Buka Terminal baru dan jalankan:

```bash
cd "/Users/idcuq/Documents/AI POWER TRADE LINERA"

# Buat tar file
tar -czf ai-power-trade-deploy.tar.gz \
  --exclude='target' \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='venv' \
  --exclude='*.log' \
  .

# Cek ukuran file
ls -lh ai-power-trade-deploy.tar.gz
```

### **STEP 2: Upload ke VPS**

```bash
# Upload package
scp ai-power-trade-deploy.tar.gz root@152.42.199.50:/root/

# Upload install script
scp vps-install.sh root@152.42.199.50:/root/
```

Masukkan password VPS saat diminta.

### **STEP 3: SSH ke VPS**

```bash
ssh root@152.42.199.50
```

### **STEP 4: Install di VPS**

Setelah masuk ke VPS, jalankan:

```bash
# Extract files
mkdir -p /opt/ai-power-trade
tar -xzf /root/ai-power-trade-deploy.tar.gz -C /opt/ai-power-trade

# Run installer
chmod +x /root/vps-install.sh
bash /root/vps-install.sh
```

Tunggu ~15-20 menit untuk instalasi selesai.

### **STEP 5: Cek Status**

```bash
cd /opt/ai-power-trade
./check-status.sh
```

## ✅ Hasil Akhir

Aplikasi akan live di:

```
🌐 Main App: 
http://152.42.199.50/AI-POWER-TRADE-FINAL.html

🔍 Judge Verification:
http://152.42.199.50/JUDGE-VERIFICATION.html

📊 GraphQL API:
http://152.42.199.50/graphql
```

## 🔧 Jika Ada Masalah

### Restart semua service:

```bash
# Stop semua
pkill -f linera
systemctl stop nginx

# Start lagi
cd /opt/ai-power-trade
nohup linera net up --testing-prng-seed 37 > /var/log/linera.log 2>&1 &
sleep 10
nohup linera service --port 8080 > /var/log/linera-service.log 2>&1 &
sleep 5
systemctl start nginx

# Cek status
./check-status.sh
```

### Lihat logs:

```bash
# Linera network
tail -f /var/log/linera.log

# Linera service  
tail -f /var/log/linera-service.log

# Nginx
tail -f /var/log/nginx/error.log
```

## 🎉 Selesai!

Aplikasi Anda sudah live dan siap untuk demo! 🏆
