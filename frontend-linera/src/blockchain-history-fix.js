/**
 * FIXED VERSION of displayBlockchainHistory with localStorage fallback
 * Replace the existing function in main.js with this version
 */

async function displayBlockchainHistory() {
    const info = lineraManager.getWalletInfo();
    
    if (!info.owner) {
        elements.blockchainHistoryContainer.innerHTML = '<div class="status info">Connect wallet to view blockchain history</div>';
        elements.blockchainTotalTrades.textContent = '-';
        elements.blockchainTotalPnl.textContent = '-';
        return;
    }
    
    let trades = [];
    let totalPnl = 0;
    let isFromStorage = false;
    
    try {
        elements.blockchainHistoryContainer.innerHTML = '<div class="status info">⏳ Loading from blockchain...</div>';
        
        // Try to query from blockchain first
        try {
            trades = await tradeHistoryContract.getUserTrades(info.owner);
            totalPnl = await tradeHistoryContract.getUserTotalPnL(info.owner);
            console.log('✅ Loaded trades from blockchain');
        } catch (blockchainError) {
            console.warn('⚠️ Blockchain query failed, using localStorage fallback:', blockchainError.message);
            
            // Fallback to localStorage
            if (!tradeHistoryStorage.owner) {
                tradeHistoryStorage.initialize(info.owner);
            }
            trades = tradeHistoryStorage.getUserTrades(info.owner);
            totalPnl = tradeHistoryStorage.getUserTotalPnL(info.owner);
            isFromStorage = true;
            console.log('✅ Loaded trades from localStorage');
        }
        
        // Update stats
        elements.blockchainTotalTrades.textContent = trades.length;
        elements.blockchainTotalPnl.textContent = totalPnl >= 0 
            ? `+$${totalPnl.toFixed(2)}`
            : `-$${Math.abs(totalPnl).toFixed(2)}`;
        elements.blockchainTotalPnl.style.color = totalPnl >= 0 ? '#26A69A' : '#EF5350';
        
        // Display trades
        if (trades.length === 0) {
            elements.blockchainHistoryContainer.innerHTML = '<div class="status info">No trades yet. Execute a trade to see it here!</div>';
            return;
        }
        
        const badge = isFromStorage ? '💾 Stored' : '⛓️ On-Chain';
        
        elements.blockchainHistoryContainer.innerHTML = trades
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10) // Show last 10 trades
            .map(trade => {
                const formatted = isFromStorage 
                    ? tradeHistoryStorage.formatTrade(trade)
                    : tradeHistoryContract.formatTrade(trade);
                const pnlClass = trade.profitLoss >= 0 ? 'positive' : 'negative';
                
                return `
                    <div class="trade-item">
                        <div class="trade-header">
                            <span class="trade-coin">${formatted.coin}</span>
                            <span class="trade-type ${trade.tradeType.toLowerCase()}">${formatted.type}</span>
                            <span class="trade-pnl ${pnlClass}">${formatted.pnl}</span>
                        </div>
                        <div class="trade-details">
                            <span>Entry: $${formatted.entry}</span>
                            <span>Exit: $${formatted.exit}</span>
                            <span>Amount: ${formatted.amount}</span>
                        </div>
                        <div class="trade-footer">
                            <span class="trade-date">${formatted.date}</span>
                            <span class="trade-badge">${badge}</span>
                        </div>
                    </div>
                `;
            })
            .join('');
        
        console.log(`✅ Displayed ${trades.length} trades (${isFromStorage ? 'from localStorage' : 'from blockchain'})`);
        
    } catch (error) {
        console.error('❌ Failed to load trade history:', error);
        elements.blockchainHistoryContainer.innerHTML = '<div class="status error">❌ Failed to load trade history</div>';
    }
}
