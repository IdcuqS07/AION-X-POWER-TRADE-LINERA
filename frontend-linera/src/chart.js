// chart.js - Interactive Price Chart Module
import { createChart } from 'lightweight-charts';

export class PriceChart {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.chart = null;
    this.candlestickSeries = null;
    this.volumeSeries = null;
    this.tradeMarkers = [];
    this.currentCoin = 'BTC';
    this.currentTimeframe = '1h';
    this.updateInterval = null;
  }

  initialize() {
    if (!this.container) {
      console.error('Chart container not found');
      return;
    }

    // Create chart
    this.chart = createChart(this.container, {
      width: this.container.clientWidth,
      height: 500,
      layout: {
        background: { color: '#1a1a2e' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2a2a3e' },
        horzLines: { color: '#2a2a3e' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#2a2a3e',
      },
      timeScale: {
        borderColor: '#2a2a3e',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Add candlestick series
    this.candlestickSeries = this.chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Add volume series
    this.volumeSeries = this.chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());

    console.log('✅ Chart initialized');
  }

  handleResize() {
    if (this.chart && this.container) {
      this.chart.applyOptions({
        width: this.container.clientWidth,
      });
    }
  }

  async loadData(coin, timeframe) {
    this.currentCoin = coin;
    this.currentTimeframe = timeframe;

    try {
      const data = await this.fetchCandlestickData(coin, timeframe);
      
      if (data.candles && data.candles.length > 0) {
        this.candlestickSeries.setData(data.candles);
        
        if (data.volumes && data.volumes.length > 0) {
          this.volumeSeries.setData(data.volumes);
        }

        console.log(`✅ Loaded ${data.candles.length} candles for ${coin} ${timeframe}`);
      }
    } catch (error) {
      console.error('❌ Failed to load chart data:', error);
    }
  }

  async fetchCandlestickData(coin, timeframe) {
    const symbol = `${coin}USDT`;
    const interval = this.getIntervalString(timeframe);
    const limit = 500;

    try {
      const response = await fetch(
        `/api/binance/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const candles = data.map(item => ({
        time: Math.floor(item[0] / 1000),
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
      }));

      const volumes = data.map(item => ({
        time: Math.floor(item[0] / 1000),
        value: parseFloat(item[5]),
        color: parseFloat(item[4]) >= parseFloat(item[1]) ? '#26a69a80' : '#ef535080',
      }));

      return { candles, volumes };
    } catch (error) {
      console.error('Failed to fetch candlestick data:', error);
      return { candles: [], volumes: [] };
    }
  }

  getIntervalString(timeframe) {
    const intervals = {
      '1m': '1m',
      '5m': '5m',
      '15m': '15m',
      '1h': '1h',
      '4h': '4h',
      '1d': '1d',
    };
    return intervals[timeframe] || '1h';
  }

  addTradeMarker(trade) {
    if (!this.candlestickSeries) return;

    const marker = {
      time: Math.floor(trade.timestamp / 1000),
      position: trade.tradeType === 'BUY' ? 'belowBar' : 'aboveBar',
      color: trade.tradeType === 'BUY' ? '#26a69a' : '#ef5350',
      shape: trade.tradeType === 'BUY' ? 'arrowUp' : 'arrowDown',
      text: `${trade.tradeType} ${trade.coin} @ $${trade.entryPrice.toFixed(2)}`,
    };

    this.tradeMarkers.push(marker);
    this.candlestickSeries.setMarkers(this.tradeMarkers);

    console.log(`✅ Added trade marker: ${trade.tradeType} ${trade.coin}`);
  }

  clearTradeMarkers() {
    this.tradeMarkers = [];
    if (this.candlestickSeries) {
      this.candlestickSeries.setMarkers([]);
    }
  }

  startRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Update every 5 seconds
    this.updateInterval = setInterval(async () => {
      await this.updateLatestCandle();
    }, 5000);

    console.log('✅ Started real-time updates');
  }

  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('⏸️ Stopped real-time updates');
    }
  }

  async updateLatestCandle() {
    try {
      const symbol = `${this.currentCoin}USDT`;
      const response = await fetch(
        `/api/binance/api/v3/ticker/24hr?symbol=${symbol}`
      );

      if (!response.ok) return;

      const data = await response.json();
      const now = Math.floor(Date.now() / 1000);

      // Update last candle with current price
      this.candlestickSeries.update({
        time: now,
        open: parseFloat(data.openPrice),
        high: parseFloat(data.highPrice),
        low: parseFloat(data.lowPrice),
        close: parseFloat(data.lastPrice),
      });
    } catch (error) {
      // Silently fail for real-time updates
    }
  }

  destroy() {
    this.stopRealTimeUpdates();
    
    if (this.chart) {
      this.chart.remove();
      this.chart = null;
    }

    window.removeEventListener('resize', () => this.handleResize());
    console.log('🗑️ Chart destroyed');
  }
}
