// analytics.js - Performance Analytics Module
import { format, startOfDay, endOfDay, isWithinInterval, subDays } from 'date-fns';

export class TradeAnalytics {
  constructor() {
    this.trades = [];
  }

  setTrades(trades) {
    this.trades = trades || [];
  }

  getOverviewMetrics() {
    if (!this.trades || this.trades.length === 0) {
      return this.getEmptyMetrics();
    }

    const totalTrades = this.trades.length;
    let totalPnL = 0;
    let profitableTrades = 0;
    let losingTrades = 0;
    let bestTrade = null;
    let worstTrade = null;
    let bestPnL = -Infinity;
    let worstPnL = Infinity;

    this.trades.forEach(trade => {
      const pnl = trade.pnl || 0;
      totalPnL += pnl;

      if (pnl > 0) {
        profitableTrades++;
      } else if (pnl < 0) {
        losingTrades++;
      }

      if (pnl > bestPnL) {
        bestPnL = pnl;
        bestTrade = trade;
      }

      if (pnl < worstPnL) {
        worstPnL = pnl;
        worstTrade = trade;
      }
    });

    const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;
    const avgPnL = totalTrades > 0 ? totalPnL / totalTrades : 0;

    return {
      totalTrades,
      totalPnL: parseFloat(totalPnL.toFixed(2)),
      profitableTrades,
      losingTrades,
      winRate: parseFloat(winRate.toFixed(2)),
      avgPnL: parseFloat(avgPnL.toFixed(2)),
      bestTrade: bestTrade ? {
        coin: bestTrade.coin,
        pnl: parseFloat(bestPnL.toFixed(2)),
        date: format(new Date(bestTrade.timestamp), 'MMM d, yyyy'),
        type: bestTrade.tradeType
      } : null,
      worstTrade: worstTrade ? {
        coin: worstTrade.coin,
        pnl: parseFloat(worstPnL.toFixed(2)),
        date: format(new Date(worstTrade.timestamp), 'MMM d, yyyy'),
        type: worstTrade.tradeType
      } : null
    };
  }

  getEmptyMetrics() {
    return {
      totalTrades: 0,
      totalPnL: 0,
      profitableTrades: 0,
      losingTrades: 0,
      winRate: 0,
      avgPnL: 0,
      bestTrade: null,
      worstTrade: null
    };
  }

  getByCoinMetrics() {
    const coinStats = {};

    this.trades.forEach(trade => {
      const coin = trade.coin || 'Unknown';
      
      if (!coinStats[coin]) {
        coinStats[coin] = {
          coin,
          trades: 0,
          pnl: 0,
          profitable: 0,
          losing: 0,
          winRate: 0
        };
      }

      const pnl = trade.pnl || 0;
      coinStats[coin].trades++;
      coinStats[coin].pnl += pnl;

      if (pnl > 0) {
        coinStats[coin].profitable++;
      } else if (pnl < 0) {
        coinStats[coin].losing++;
      }
    });

    // Calculate win rates and format
    Object.keys(coinStats).forEach(coin => {
      const stats = coinStats[coin];
      stats.winRate = stats.trades > 0 
        ? parseFloat(((stats.profitable / stats.trades) * 100).toFixed(2))
        : 0;
      stats.pnl = parseFloat(stats.pnl.toFixed(2));
    });

    // Sort by P&L descending
    return Object.values(coinStats).sort((a, b) => b.pnl - a.pnl);
  }

  getByPlatformMetrics() {
    const platformStats = {};

    this.trades.forEach(trade => {
      const platform = trade.platform || 'Unknown';
      
      if (!platformStats[platform]) {
        platformStats[platform] = {
          platform,
          trades: 0,
          pnl: 0,
          profitable: 0,
          losing: 0,
          winRate: 0
        };
      }

      const pnl = trade.pnl || 0;
      platformStats[platform].trades++;
      platformStats[platform].pnl += pnl;

      if (pnl > 0) {
        platformStats[platform].profitable++;
      } else if (pnl < 0) {
        platformStats[platform].losing++;
      }
    });

    // Calculate win rates and format
    Object.keys(platformStats).forEach(platform => {
      const stats = platformStats[platform];
      stats.winRate = stats.trades > 0 
        ? parseFloat(((stats.profitable / stats.trades) * 100).toFixed(2))
        : 0;
      stats.pnl = parseFloat(stats.pnl.toFixed(2));
    });

    return Object.values(platformStats);
  }

  getTimeSeriesData(period = 'daily') {
    if (!this.trades || this.trades.length === 0) {
      return [];
    }

    const timeSeriesMap = {};

    this.trades.forEach(trade => {
      const date = new Date(trade.timestamp);
      let key;

      if (period === 'daily') {
        key = format(date, 'yyyy-MM-dd');
      } else if (period === 'weekly') {
        key = format(date, 'yyyy-ww');
      } else if (period === 'monthly') {
        key = format(date, 'yyyy-MM');
      }

      if (!timeSeriesMap[key]) {
        timeSeriesMap[key] = {
          date: key,
          trades: 0,
          pnl: 0,
          profitable: 0,
          losing: 0
        };
      }

      const pnl = trade.pnl || 0;
      timeSeriesMap[key].trades++;
      timeSeriesMap[key].pnl += pnl;

      if (pnl > 0) {
        timeSeriesMap[key].profitable++;
      } else if (pnl < 0) {
        timeSeriesMap[key].losing++;
      }
    });

    // Convert to array and sort by date
    const timeSeries = Object.values(timeSeriesMap)
      .map(item => ({
        ...item,
        pnl: parseFloat(item.pnl.toFixed(2)),
        winRate: item.trades > 0 
          ? parseFloat(((item.profitable / item.trades) * 100).toFixed(2))
          : 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return timeSeries;
  }

  getRecentPerformance(days = 7) {
    const now = new Date();
    const startDate = startOfDay(subDays(now, days));
    const endDate = endOfDay(now);

    const recentTrades = this.trades.filter(trade => {
      const tradeDate = new Date(trade.timestamp);
      return isWithinInterval(tradeDate, { start: startDate, end: endDate });
    });

    if (recentTrades.length === 0) {
      return {
        period: `Last ${days} days`,
        trades: 0,
        pnl: 0,
        winRate: 0,
        avgPnL: 0
      };
    }

    let totalPnL = 0;
    let profitable = 0;

    recentTrades.forEach(trade => {
      const pnl = trade.pnl || 0;
      totalPnL += pnl;
      if (pnl > 0) profitable++;
    });

    return {
      period: `Last ${days} days`,
      trades: recentTrades.length,
      pnl: parseFloat(totalPnL.toFixed(2)),
      winRate: parseFloat(((profitable / recentTrades.length) * 100).toFixed(2)),
      avgPnL: parseFloat((totalPnL / recentTrades.length).toFixed(2))
    };
  }

  getRiskMetrics() {
    if (!this.trades || this.trades.length === 0) {
      return {
        maxDrawdown: 0,
        avgRisk: 0,
        riskRewardRatio: 0,
        consecutiveLosses: 0,
        consecutiveWins: 0
      };
    }

    let maxDrawdown = 0;
    let currentDrawdown = 0;
    let peak = 0;
    let totalRisk = 0;
    let totalReward = 0;
    let currentLosses = 0;
    let currentWins = 0;
    let maxLosses = 0;
    let maxWins = 0;

    this.trades.forEach(trade => {
      const pnl = trade.pnl || 0;
      
      // Drawdown calculation
      if (pnl > 0) {
        peak += pnl;
        currentDrawdown = 0;
        currentWins++;
        currentLosses = 0;
      } else if (pnl < 0) {
        currentDrawdown += Math.abs(pnl);
        maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
        currentLosses++;
        currentWins = 0;
      }

      maxLosses = Math.max(maxLosses, currentLosses);
      maxWins = Math.max(maxWins, currentWins);

      // Risk/Reward
      if (pnl > 0) {
        totalReward += pnl;
      } else if (pnl < 0) {
        totalRisk += Math.abs(pnl);
      }
    });

    const avgRisk = totalRisk > 0 ? totalRisk / this.trades.length : 0;
    const riskRewardRatio = totalRisk > 0 ? totalReward / totalRisk : 0;

    return {
      maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
      avgRisk: parseFloat(avgRisk.toFixed(2)),
      riskRewardRatio: parseFloat(riskRewardRatio.toFixed(2)),
      consecutiveLosses: maxLosses,
      consecutiveWins: maxWins
    };
  }

  generateReport() {
    const overview = this.getOverviewMetrics();
    const byCoin = this.getByCoinMetrics();
    const byPlatform = this.getByPlatformMetrics();
    const recent = this.getRecentPerformance(7);
    const risk = this.getRiskMetrics();

    return {
      overview,
      byCoin,
      byPlatform,
      recent,
      risk,
      generatedAt: new Date().toISOString()
    };
  }
}
