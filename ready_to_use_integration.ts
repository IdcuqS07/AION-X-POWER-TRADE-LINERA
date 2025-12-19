// ============================================================================
// COMPLETE INTEGRATION CODE - READY TO USE
// Copy this to your frontend project
// ============================================================================

// ============================================================================
// 1. lib/linera-client.ts
// ============================================================================

import { GraphQLClient } from 'graphql-request';

interface Portfolio {
  balance: string;
  totalValue: string;
  unrealizedPnl: string;
  positions: Position[];
}

interface Position {
  symbol: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  pnlPercent: number;
}

interface Signal {
  symbol: string;
  signalType: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  rsi: number;
  recommendation: string;
}

interface Trade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  amount: number;
  price: number;
  timestamp: string;
  pnl: number;
}

interface RiskMetrics {
  maxPositionPercent: number;
  maxDailyTrades: number;
  dailyTradesRemaining: number;
  currentExposure: number;
}

export class LineraClient {
  private client: GraphQLClient;
  private endpoint: string;

  constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_LINERA_ENDPOINT || 'http://localhost:8080';
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
    const appId = process.env.NEXT_PUBLIC_APP_ID;

    if (!chainId || !appId) {
      throw new Error('Missing CHAIN_ID or APP_ID in environment variables');
    }

    this.endpoint = `${baseUrl}/chains/${chainId}/applications/${appId}`;
    this.client = new GraphQLClient(this.endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getPortfolio(): Promise<Portfolio> {
    const query = `
      query {
        portfolio {
          balance
          totalValue
          unrealizedPnl
          positions {
            symbol
            amount
            entryPrice
            currentPrice
            unrealizedPnl
            pnlPercent
          }
        }
      }
    `;

    const data: any = await this.client.request(query);
    return data.portfolio;
  }

  async getSignal(symbol: string): Promise<Signal | null> {
    const query = `
      query GetSignal($symbol: String!) {
        signal(symbol: $symbol) {
          symbol
          signalType
          confidence
          price
          rsi
          recommendation
        }
      }
    `;

    const data: any = await this.client.request(query, { symbol });
    return data.signal;
  }

  async executeTrade(
    symbol: string,
    side: 'BUY' | 'SELL',
    amount: number
  ): Promise<Trade> {
    const mutation = `
      mutation ExecuteTrade($symbol: String!, $side: TradeSideEnum!, $amount: Float!) {
        executeTrade(symbol: $symbol, side: $side, amount: $amount) {
          id
          symbol
          side
          amount
          price
          timestamp
          pnl
        }
      }
    `;

    const data: any = await this.client.request(mutation, {
      symbol,
      side,
      amount,
    });
    return data.executeTrade;
  }

  async updateSignal(symbol: string, price: number, rsi: number): Promise<void> {
    const mutation = `
      mutation UpdateSignal($symbol: String!, $price: Float!, $rsi: Float!) {
        updateSignal(symbol: $symbol, price: $price, rsi: $rsi)
      }
    `;

    await this.client.request(mutation, { symbol, price, rsi });
  }

  async getTrades(limit: number = 10): Promise<Trade[]> {
    const query = `
      query GetTrades($limit: Int) {
        trades(limit: $limit) {
          id
          symbol
          side
          amount
          price
          timestamp
          pnl
        }
      }
    `;

    const data: any = await this.client.request(query, { limit });
    return data.trades;
  }

  async getRiskMetrics(): Promise<RiskMetrics> {
    const query = `
      query {
        riskMetrics {
          maxPositionPercent
          maxDailyTrades
          dailyTradesRemaining
          currentExposure
        }
      }
    `;

    const data: any = await this.client.request(query);
    return data.riskMetrics;
  }

  async updatePrice(symbol: string, price: number): Promise<void> {
    const mutation = `
      mutation UpdatePrice($symbol: String!, $price: Float!) {
        updatePrice(symbol: $symbol, price: $price)
      }
    `;

    await this.client.request(mutation, { symbol, price });
  }

  async health(): Promise<string> {
    const query = `query { health }`;
    const data: any = await this.client.request(query);
    return data.health;
  }
}

// Singleton instance
export const lineraClient = new LineraClient();

// ============================================================================
// 2. hooks/useLinera.ts - React Hook for easy usage
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { lineraClient } from '@/lib/linera-client';

export function usePortfolio(refreshInterval = 5000) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    try {
      const data = await lineraClient.getPortfolio();
      setPortfolio(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchPortfolio, refreshInterval]);

  return { portfolio, loading, error, refresh: fetchPortfolio };
}

export function useSignal(symbol: string, refreshInterval = 5000) {
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignal = useCallback(async () => {
    try {
      const data = await lineraClient.getSignal(symbol);
      setSignal(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchSignal();
    const interval = setInterval(fetchSignal, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchSignal, refreshInterval]);

  return { signal, loading, error, refresh: fetchSignal };
}

export function useTradingActions() {
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTrade = async (
    symbol: string,
    side: 'BUY' | 'SELL',
    amount: number
  ) => {
    setExecuting(true);
    setError(null);
    try {
      const result = await lineraClient.executeTrade(symbol, side, amount);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setExecuting(false);
    }
  };

  return { executeTrade, executing, error };
}

// ============================================================================
// 3. components/Dashboard.tsx - Updated Component
// ============================================================================

import React from 'react';
import { usePortfolio, useSignal, useTradingActions } from '@/hooks/useLinera';

export default function Dashboard() {
  const { portfolio, loading: portfolioLoading } = usePortfolio();
  const { executeTrade, executing } = useTradingActions();

  const symbols = ['BTC', 'ETH', 'BNB', 'SOL'];

  const handleTrade = async (symbol: string, signal: Signal) => {
    if (!signal || signal.signalType === 'HOLD') return;

    try {
      const amount = 0.1; // Calculate based on risk
      const result = await executeTrade(symbol, signal.signalType, amount);
      alert(`Trade executed: ${result.id}`);
    } catch (error: any) {
      alert(`Trade failed: ${error.message}`);
    }
  };

  if (portfolioLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Portfolio Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600">Balance</p>
            <p className="text-2xl font-bold">{portfolio?.balance}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Value</p>
            <p className="text-2xl font-bold">{portfolio?.totalValue}</p>
          </div>
          <div>
            <p className="text-gray-600">Unrealized P&L</p>
            <p className={`text-2xl font-bold ${
              parseFloat(portfolio?.unrealizedPnl || '0') >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {portfolio?.unrealizedPnl}
            </p>
          </div>
        </div>

        {/* Positions */}
        {portfolio?.positions && portfolio.positions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-3">Positions</h3>
            <div className="space-y-2">
              {portfolio.positions.map((pos) => (
                <div
                  key={pos.symbol}
                  className="flex items-center justify-between border rounded p-3"
                >
                  <span className="font-bold">{pos.symbol}</span>
                  <span>{pos.amount}</span>
                  <span className="text-sm text-gray-600">
                    Entry: ${pos.entryPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">
                    Current: ${pos.currentPrice.toFixed(2)}
                  </span>
                  <span
                    className={`font-bold ${
                      pos.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {pos.pnlPercent >= 0 ? '+' : ''}
                    {pos.pnlPercent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {symbols.map((symbol) => (
          <SignalCard
            key={symbol}
            symbol={symbol}
            onTrade={handleTrade}
            executing={executing}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 4. components/SignalCard.tsx
// ============================================================================

import React from 'react';
import { useSignal } from '@/hooks/useLinera';

interface SignalCardProps {
  symbol: string;
  onTrade: (symbol: string, signal: Signal) => void;
  executing: boolean;
}

export function SignalCard({ symbol, onTrade, executing }: SignalCardProps) {
  const { signal, loading } = useSignal(symbol);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse">Loading {symbol}...</div>
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-gray-500">No signal for {symbol}</div>
      </div>
    );
  }

  const signalColor = {
    BUY: 'text-green-600',
    SELL: 'text-red-600',
    HOLD: 'text-gray-600',
  }[signal.signalType];

  const buttonColor = {
    BUY: 'bg-green-500 hover:bg-green-600',
    SELL: 'bg-red-500 hover:bg-red-600',
    HOLD: 'bg-gray-400 cursor-not-allowed',
  }[signal.signalType];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-bold mb-2">{symbol}</h3>
      
      <div className={`text-2xl font-bold ${signalColor} mb-2`}>
        {signal.signalType}
      </div>
      
      <div className="space-y-1 text-sm mb-3">
        <div>Confidence: {signal.confidence.toFixed(1)}%</div>
        <div>RSI: {signal.rsi.toFixed(1)}</div>
        <div>Price: ${signal.price.toFixed(2)}</div>
      </div>

      <div className="text-xs text-gray-600 mb-3">
        {signal.recommendation}
      </div>

      {signal.signalType !== 'HOLD' && (
        <button
          onClick={() => onTrade(symbol, signal)}
          disabled={executing}
          className={`w-full py-2 px-4 rounded text-white font-bold 
            ${buttonColor} 
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {executing ? 'Executing...' : `Execute ${signal.signalType}`}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// 5. .env.local
// ============================================================================

/*
# Linera Configuration
NEXT_PUBLIC_LINERA_ENDPOINT=http://localhost:8080
NEXT_PUBLIC_CHAIN_ID=your-chain-id-here
NEXT_PUBLIC_APP_ID=your-app-id-here
*/

// ============================================================================
// 6. package.json additions
// ============================================================================

/*
{
  "dependencies": {
    "graphql": "^16.8.1",
    "graphql-request": "^6.1.0"
  }
}
*/

// ============================================================================
// USAGE INSTRUCTIONS
// ============================================================================

/*
1. Install dependencies:
   npm install graphql graphql-request

2. Copy files to your project:
   - lib/linera-client.ts
   - hooks/useLinera.ts
   - components/Dashboard.tsx
   - components/SignalCard.tsx

3. Update .env.local with your Linera configuration

4. Import and use in your pages:
   import Dashboard from '@/components/Dashboard';
   
   export default function Home() {
     return <Dashboard />;
   }

5. Deploy to Vercel:
   - Push to GitHub
   - Vercel will auto-deploy
   - Add environment variables in Vercel dashboard

That's it! Your frontend is now connected to Linera!
*/
