#!/bin/bash

echo "🔧 Starting Local Linera Network..."

# Kill existing processes
pkill -f "linera-proxy\|linera-server"

# Start local Linera network
linera net up --testing-prng-seed 37 &

# Wait for network to start
sleep 5

# Initialize wallet
linera wallet init --with-new-chain --testing-prng-seed 37

# Set default configuration
export LINERA_WALLET="$HOME/.config/linera/wallet.json"
export LINERA_STORAGE="rocksdb:$HOME/.config/linera/client.db"

echo "✅ Local Linera network started!"
echo "🌐 Ready for deployment"