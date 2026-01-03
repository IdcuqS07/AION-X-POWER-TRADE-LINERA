// trade-filter.js - Trade Filtering Module
import { format, isAfter, isBefore, subDays, startOfDay, endOfDay } from 'date-fns';

export class TradeFilter {
  constructor() {
    this.filters = {
      coin: 'ALL',
      dateRange: 'last7days',
      customStartDate: null,
      customEndDate: null,
      pnl: 'all',
      platform: 'all',
      tradeType: 'all',
      searchQuery: '',
    };
  }

  setFilter(key, value) {
    this.filters[key] = value;
    console.log(`🔍 Filter updated: ${key} = ${value}`);
  }

  getFilters() {
    return { ...this.filters };
  }

  resetFilters() {
    this.filters = {
      coin: 'ALL',
      dateRange: 'last7days',
      customStartDate: null,
      customEndDate: null,
      pnl: 'all',
      platform: 'all',
      tradeType: 'all',
      searchQuery: '',
    };
    console.log('🔄 Filters reset');
  }

  filterTrades(trades) {
    if (!trades || trades.length === 0) {
      return [];
    }

    let filtered = [...trades];

    // Filter by coin
    if (this.filters.coin !== 'ALL') {
      filtered = filtered.filter(trade => trade.coin === this.filters.coin);
    }

    // Filter by date range
    filtered = this.filterByDateRange(filtered);

    // Filter by P&L
    filtered = this.filterByPnL(filtered);

    // Filter by platform
    if (this.filters.platform !== 'all') {
      filtered = filtered.filter(trade => {
        if (this.filters.platform === 'linera') {
          return trade.platform === 'Linera' || trade.platform === 'linera';
        } else if (this.filters.platform === 'binance') {
          return trade.platform === 'Binance' || trade.platform === 'binance';
        }
        return true;
      });
    }

    // Filter by trade type
    if (this.filters.tradeType !== 'all') {
      filtered = filtered.filter(trade => 
        trade.tradeType.toUpperCase() === this.filters.tradeType.toUpperCase()
      );
    }

    // Filter by search query
    if (this.filters.searchQuery && this.filters.searchQuery.trim() !== '') {
      const query = this.filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(trade => {
        return (
          trade.coin.toLowerCase().includes(query) ||
          trade.tradeType.toLowerCase().includes(query) ||
          (trade.id && trade.id.toString().includes(query)) ||
          (trade.platform && trade.platform.toLowerCase().includes(query))
        );
      });
    }

    console.log(`🔍 Filtered ${trades.length} → ${filtered.length} trades`);
    return filtered;
  }

  filterByDateRange(trades) {
    const now = new Date();
    let startDate, endDate;

    switch (this.filters.dateRange) {
      case 'today':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      
      case 'last7days':
        startDate = startOfDay(subDays(now, 7));
        endDate = endOfDay(now);
        break;
      
      case 'last30days':
        startDate = startOfDay(subDays(now, 30));
        endDate = endOfDay(now);
        break;
      
      case 'custom':
        if (this.filters.customStartDate && this.filters.customEndDate) {
          startDate = startOfDay(new Date(this.filters.customStartDate));
          endDate = endOfDay(new Date(this.filters.customEndDate));
        } else {
          return trades; // No custom dates set
        }
        break;
      
      case 'all':
      default:
        return trades; // No date filtering
    }

    return trades.filter(trade => {
      const tradeDate = new Date(trade.timestamp);
      return isAfter(tradeDate, startDate) && isBefore(tradeDate, endDate);
    });
  }

  filterByPnL(trades) {
    switch (this.filters.pnl) {
      case 'profit':
        return trades.filter(trade => {
          const pnl = this.calculateTradePnL(trade);
          return pnl > 0;
        });
      
      case 'loss':
        return trades.filter(trade => {
          const pnl = this.calculateTradePnL(trade);
          return pnl < 0;
        });
      
      case 'breakeven':
        return trades.filter(trade => {
          const pnl = this.calculateTradePnL(trade);
          return pnl === 0;
        });
      
      case 'all':
      default:
        return trades;
    }
  }

  calculateTradePnL(trade) {
    if (trade.pnl !== undefined && trade.pnl !== null) {
      return trade.pnl;
    }

    if (trade.exitPrice && trade.entryPrice && trade.amount) {
      if (trade.tradeType === 'BUY') {
        return (trade.exitPrice - trade.entryPrice) * trade.amount;
      } else if (trade.tradeType === 'SELL') {
        return (trade.entryPrice - trade.exitPrice) * trade.amount;
      }
    }

    return 0;
  }

  getFilterSummary() {
    const summary = [];

    if (this.filters.coin !== 'ALL') {
      summary.push(`Coin: ${this.filters.coin}`);
    }

    if (this.filters.dateRange !== 'all') {
      summary.push(`Date: ${this.getDateRangeLabel()}`);
    }

    if (this.filters.pnl !== 'all') {
      summary.push(`P&L: ${this.filters.pnl}`);
    }

    if (this.filters.platform !== 'all') {
      summary.push(`Platform: ${this.filters.platform}`);
    }

    if (this.filters.tradeType !== 'all') {
      summary.push(`Type: ${this.filters.tradeType}`);
    }

    if (this.filters.searchQuery) {
      summary.push(`Search: "${this.filters.searchQuery}"`);
    }

    return summary.length > 0 ? summary.join(' | ') : 'No filters applied';
  }

  getDateRangeLabel() {
    switch (this.filters.dateRange) {
      case 'today':
        return 'Today';
      case 'last7days':
        return 'Last 7 days';
      case 'last30days':
        return 'Last 30 days';
      case 'custom':
        if (this.filters.customStartDate && this.filters.customEndDate) {
          return `${format(new Date(this.filters.customStartDate), 'MMM d')} - ${format(new Date(this.filters.customEndDate), 'MMM d')}`;
        }
        return 'Custom';
      default:
        return 'All time';
    }
  }
}
