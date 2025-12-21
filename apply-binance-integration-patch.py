#!/usr/bin/env python3
"""
Binance Integration Patch
Enhances trade history display with Binance execution details
"""

import re

# Read main.js
with open('frontend-linera/src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace updateHistoryEnhanced function
old_function = r"function updateHistoryEnhanced\(\) \{[\s\S]*?elements\.historyContainer\.innerHTML = history\.map\(item => `[\s\S]*?`\)\.join\(''\);\s*\}"

new_function = '''function updateHistoryEnhanced() {
    const history = tradingManager.getHistory();
    
    if (history.length === 0) {
        elements.historyContainer.innerHTML = '<div class="status info">No trades yet. Execute your first trade!</div>';
        return;
    }
    
    elements.historyContainer.innerHTML = history.map(item => {
        // Check if trade has Binance execution details
        const hasBinanceDetails = item.platform && item.fee !== undefined;
        
        return `
            <div class="trade-item ${item.type}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${item.type} ${item.pair}</strong>
                        ${hasBinanceDetails ? `
                            <span class="platform-badge binance">
                                <span class="binance-icon">🟡</span>
                                ${item.platform}
                            </span>
                        ` : ''}
                        <div style="font-size: 0.8em; color: #aaa; margin-top: 4px;">${item.executedAt}</div>
                    </div>
                    <div style="text-align: right;">
                        <div>$${item.price.toFixed(2)}</div>
                        <div style="font-size: 0.8em; color: #aaa;">${(item.confidence * 100).toFixed(0)}%</div>
                    </div>
                </div>
                ${hasBinanceDetails ? `
                    <div class="trade-execution-details">
                        <div class="trade-detail-item">Amount: <span>${item.coinAmount ? item.coinAmount.toFixed(5) : '-'} ${item.coin}</span></div>
                        <div class="trade-detail-item">Fee: <span>$${item.fee.toFixed(2)} (${item.feePercent}%)</span></div>
                        <div class="trade-detail-item">Slippage: <span>${item.slippage}%</span></div>
                        <div class="trade-detail-item">Execution: <span class="trade-detail-highlight">${item.executionTime}s</span></div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}'''

content = re.sub(old_function, new_function, content, flags=re.MULTILINE)

# Write back
with open('frontend-linera/src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Binance integration patch applied successfully!")
print("   - Enhanced trade history with Binance execution details")
print("   - Added platform badge, fee, slippage, and execution time display")
