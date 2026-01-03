// trade-export.js - Trade Export Module
import { format } from 'date-fns';

export class TradeExporter {
  constructor() {
    this.exportFormats = ['csv', 'json'];
  }

  exportToCSV(trades, filename = null) {
    if (!trades || trades.length === 0) {
      console.warn('⚠️ No trades to export');
      return;
    }

    try {
      // CSV header
      const headers = [
        'ID',
        'Date',
        'Time',
        'Coin',
        'Type',
        'Entry Price',
        'Exit Price',
        'Amount',
        'P&L',
        'Platform',
        'Status'
      ];

      // CSV rows
      const rows = trades.map(trade => [
        trade.id || '',
        format(new Date(trade.timestamp), 'yyyy-MM-dd'),
        format(new Date(trade.timestamp), 'HH:mm:ss'),
        trade.coin || '',
        trade.tradeType || '',
        trade.entryPrice ? trade.entryPrice.toFixed(2) : '',
        trade.exitPrice ? trade.exitPrice.toFixed(2) : '',
        trade.amount ? trade.amount.toFixed(6) : '',
        trade.pnl ? trade.pnl.toFixed(2) : '0.00',
        trade.platform || '',
        trade.status || 'completed'
      ]);

      // Combine header and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Create filename
      const exportFilename = filename || `trades_export_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;

      // Download
      this.downloadFile(csvContent, exportFilename, 'text/csv');

      console.log(`✅ Exported ${trades.length} trades to CSV`);
      return true;
    } catch (error) {
      console.error('❌ Failed to export CSV:', error);
      return false;
    }
  }

  exportToJSON(trades, includeSummary = true, filename = null) {
    if (!trades || trades.length === 0) {
      console.warn('⚠️ No trades to export');
      return;
    }

    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        totalTrades: trades.length,
        trades: trades.map(trade => ({
          id: trade.id,
          timestamp: trade.timestamp,
          date: format(new Date(trade.timestamp), 'yyyy-MM-dd HH:mm:ss'),
          coin: trade.coin,
          tradeType: trade.tradeType,
          entryPrice: trade.entryPrice,
          exitPrice: trade.exitPrice,
          amount: trade.amount,
          pnl: trade.pnl || 0,
          platform: trade.platform,
          status: trade.status || 'completed',
          user: trade.user || null
        }))
      };

      // Add summary if requested
      if (includeSummary) {
        exportData.summary = this.calculateSummary(trades);
      }

      // Create JSON string
      const jsonContent = JSON.stringify(exportData, null, 2);

      // Create filename
      const exportFilename = filename || `trades_export_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.json`;

      // Download
      this.downloadFile(jsonContent, exportFilename, 'application/json');

      console.log(`✅ Exported ${trades.length} trades to JSON`);
      return true;
    } catch (error) {
      console.error('❌ Failed to export JSON:', error);
      return false;
    }
  }

  calculateSummary(trades) {
    const summary = {
      totalTrades: trades.length,
      totalPnL: 0,
      profitableTrades: 0,
      losingTrades: 0,
      winRate: 0,
      averagePnL: 0,
      bestTrade: null,
      worstTrade: null,
      byPlatform: {},
      byCoin: {}
    };

    let bestPnL = -Infinity;
    let worstPnL = Infinity;

    trades.forEach(trade => {
      const pnl = trade.pnl || 0;
      
      // Total P&L
      summary.totalPnL += pnl;

      // Win/Loss count
      if (pnl > 0) {
        summary.profitableTrades++;
      } else if (pnl < 0) {
        summary.losingTrades++;
      }

      // Best/Worst trade
      if (pnl > bestPnL) {
        bestPnL = pnl;
        summary.bestTrade = {
          id: trade.id,
          coin: trade.coin,
          pnl: pnl,
          date: format(new Date(trade.timestamp), 'yyyy-MM-dd')
        };
      }

      if (pnl < worstPnL) {
        worstPnL = pnl;
        summary.worstTrade = {
          id: trade.id,
          coin: trade.coin,
          pnl: pnl,
          date: format(new Date(trade.timestamp), 'yyyy-MM-dd')
        };
      }

      // By platform
      const platform = trade.platform || 'Unknown';
      if (!summary.byPlatform[platform]) {
        summary.byPlatform[platform] = {
          trades: 0,
          pnl: 0
        };
      }
      summary.byPlatform[platform].trades++;
      summary.byPlatform[platform].pnl += pnl;

      // By coin
      const coin = trade.coin || 'Unknown';
      if (!summary.byCoin[coin]) {
        summary.byCoin[coin] = {
          trades: 0,
          pnl: 0
        };
      }
      summary.byCoin[coin].trades++;
      summary.byCoin[coin].pnl += pnl;
    });

    // Calculate win rate
    if (summary.totalTrades > 0) {
      summary.winRate = (summary.profitableTrades / summary.totalTrades) * 100;
      summary.averagePnL = summary.totalPnL / summary.totalTrades;
    }

    // Round numbers
    summary.totalPnL = parseFloat(summary.totalPnL.toFixed(2));
    summary.winRate = parseFloat(summary.winRate.toFixed(2));
    summary.averagePnL = parseFloat(summary.averagePnL.toFixed(2));

    return summary;
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }

  exportQuickSummary(trades) {
    const summary = this.calculateSummary(trades);
    
    const text = `
AI Power Trade - Trade Summary
Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}

Total Trades: ${summary.totalTrades}
Total P&L: $${summary.totalPnL}
Win Rate: ${summary.winRate}%
Average P&L: $${summary.averagePnL}

Profitable Trades: ${summary.profitableTrades}
Losing Trades: ${summary.losingTrades}

Best Trade: ${summary.bestTrade ? `${summary.bestTrade.coin} +$${summary.bestTrade.pnl.toFixed(2)}` : 'N/A'}
Worst Trade: ${summary.worstTrade ? `${summary.worstTrade.coin} -$${Math.abs(summary.worstTrade.pnl).toFixed(2)}` : 'N/A'}
    `.trim();

    const filename = `trade_summary_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.txt`;
    this.downloadFile(text, filename, 'text/plain');

    console.log('✅ Exported quick summary');
    return true;
  }
}
