/**
 * Blockchain History Display with localStorage Fallback
 * Patch to add to main.js
 */

import { tradeHistoryContract } from './trade-history-contract.js';
import { tradeHistoryStorage } from './trade-history-storage.js';

export async function displayBlockchainHistoryWithFallback(lineraManager, elements) {
    const info = lineraManager.getWalletInfo();
    
    if (!info.owner) {
        elements.blockchainHistoryContainer.innerHTML = '<div class="status info">Connect wallet to view blockchain history</div>';
        elements.blockchainTotalTrades.textContent = '-';
        elements.blockchainTotalPnl.textContent = '-';
        return;
    }
    
    try {
        elements.blockchainHistoryContainer.innerHTML = '<div class="status info">⏳ Loading trades...</div>';
        
        // Initialize storage if needed
        if (!tradeHistoryStorage.owner) {
            tradeHistoryStorage.initialize(info.owner);
        }
        
        // Try blockchain first, fallback to localStorage
        let trades = [];
        let totalPnl = 0;
        let source = 'blockchain';
        
        try {
            trades = await tradeHistoryContract.getUserTrades(info.owner);
            totalPnl = await tradeHistoryContract.getUserTotalPnL(info.owner);
            source = 'blockchain';
            console.log('✅ Loaded from blockchain');
        } catch (blockchainError) {
            console.warn('⚠️ Blockchain unavailable, using localStorage:', blockchainError.message);
            trades = tradeHistoryStorage.getUserTrades(info.owner);
            totalPnl = tradeHistoryStorage.getUserTotalPnL(info.owner);
            source = 'localStorage';
            console.log('✅ Loaded from localStorage');
        }
        
        // Update stats
        elements.blockchainTotalTrades.textContent = trades.length;
        elements.blockchainTotalPnl.textContent = totalPnl >= 0 
            ? `+$${totalPnl.toFixed(2)}`
            : `-$${Math.abs(totalPnl).toFixed(2)}`;
        elements.blockchainTotalPnl.style.color = totalPnl >= 0 ? '#26A69A' : '#EF5350';
        
        // Display trades
        if (trades.length === 0) {
            elements.blockchainHistoryContainer.innerHTML = '<div class="status info">No trades yet. Execute your first trade!</div>';
            return;
        }
        
        const formatter = source === 'blockchain' ? tradeHistoryContract : tradeHistoryStorage;
        
        elements.blockchainHistoryContainer.innerHTML = trades
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10)
            .map(trade => {
                const formatted = formatter.formatTrade(trade);
                const pnlClass = trade.profitLoss >= 0 ? 'positive' : 'negative';
                
                return `
                    <div class="trade-item">
                        <div class="trade-header">
                            <span class="trade-coin">${formatted.coin}</span>
                            <span class="trade-type ${trade.tradeType.toLowerCase()}">${formatted.type}</span>
                            <span class="trade-pnl ${pnlClass}">${formatted.pnl}</span>
                        </div>
                        <div class="trade-details">
                            <span>Entry: ${formatted.entry}</span>
                            <span>Exit: ${formatted.exit}</span>
                            <span>Amount: ${formatted.amount}</span>
                        </div>
                        <div class="trade-footer">
                            <span class="trade-date">${formatted.date}</span>
                            <span class="trade-badge">💾 ${source === 'blockchain' ? 'Blockchain' : 'Stored'}</span>
                        </div>
                    </div>
                `;
            })
            .join('');
        
        console.log(`✅ Displayed ${trades.length} trades from ${source}`);
        
    } catch (error) {
        console.error('❌ Failed to load trade history:', error);
        elements.blockchainHistoryContainer.innerHTML = '<div class="status error">❌ Failed to load trade history</div>';
    }
}
