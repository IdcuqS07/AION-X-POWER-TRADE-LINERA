# 🚀 AI POWER TRADE Frontend

Frontend interaktif untuk testing sistem AI POWER TRADE di Linera blockchain.

## 🎯 Fitur Frontend

### 📊 Dashboard Lengkap
- **Connection Status** - Status koneksi ke Linera network
- **Portfolio Management** - Balance, total value, P&L tracking
- **Market Data** - Real-time BTC/ETH prices
- **AI Signals** - Generate dan display trading signals
- **Trading Interface** - Execute buy/sell orders
- **System Status** - Status semua aplikasi

### 🔧 Cara Menjalankan

#### Option 1: Script Otomatis (Brave Browser)
```bash
./start-frontend.sh
```

#### Option 2: Manual
```bash
cd frontend
python3 server.py
```
Lalu buka: http://localhost:3000

### 🎮 Cara Testing

1. **Connect to Linera**
   - Klik "Connect to Linera" 
   - Tunggu status berubah hijau

2. **Deploy Applications**
   - Klik "Deploy Apps"
   - Tunggu semua status aplikasi jadi ✅

3. **Test Trading**
   - Pilih symbol (BTC/ETH)
   - Pilih type (Buy/Sell) 
   - Input amount
   - Klik "Execute Trade"

4. **Monitor AI Signals**
   - Signals auto-generate setiap 10 detik
   - Warna border menunjukkan strength:
     - 🟢 Green = Strong
     - 🟡 Yellow = Medium  
     - 🟠 Orange = Weak

5. **Watch Market Data**
   - Prices update otomatis setiap 5 detik
   - Klik "Update Prices" untuk manual update

### 📱 Interface Features

- **Real-time Updates** - Auto-refresh data
- **Responsive Design** - Works on mobile/desktop
- **Dark Theme** - Easy on the eyes
- **Interactive Controls** - Click to test features
- **Status Indicators** - Visual feedback
- **Mock Data** - Realistic simulation

### 🔗 Integration Points

Frontend ini mensimulasikan:
- Linera network connection
- Application deployment
- Cross-chain messaging
- AI signal generation
- Market data feeds
- Portfolio management
- Trade execution

Perfect untuk demo dan testing sistem AI POWER TRADE! 🎯