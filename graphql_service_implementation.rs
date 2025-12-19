// trading/src/service.rs
// GraphQL Service untuk Query dan Mutation

use async_graphql::{Context, Object, Result, Schema, SimpleObject, Enum};
use linera_sdk::{
    base::WithServiceAbi,
    Service, ServiceRuntime,
};
use std::sync::Arc;

use crate::contract::{
    Operation, Response, TradingSignal, TradeRecord, 
    TradeSide, SignalType, Position
};

// ============================================================================
// GraphQL TYPES
// ============================================================================

/// Portfolio summary
#[derive(SimpleObject)]
pub struct Portfolio {
    pub balance: String,
    pub total_value: String,
    pub unrealized_pnl: String,
    pub positions: Vec<PositionInfo>,
}

#[derive(SimpleObject)]
pub struct PositionInfo {
    pub symbol: String,
    pub amount: f64,
    pub entry_price: f64,
    pub current_price: f64,
    pub unrealized_pnl: f64,
    pub pnl_percent: f64,
}

/// Trade history item
#[derive(SimpleObject)]
pub struct TradeInfo {
    pub id: String,
    pub symbol: String,
    pub side: TradeSideEnum,
    pub amount: f64,
    pub price: f64,
    pub timestamp: String,
    pub pnl: f64,
}

#[derive(Enum, Copy, Clone, Eq, PartialEq)]
pub enum TradeSideEnum {
    Buy,
    Sell,
}

/// AI Signal information
#[derive(SimpleObject)]
pub struct SignalInfo {
    pub symbol: String,
    pub signal_type: SignalTypeEnum,
    pub confidence: f64,
    pub price: f64,
    pub rsi: f64,
    pub recommendation: String,
}

#[derive(Enum, Copy, Clone, Eq, PartialEq)]
pub enum SignalTypeEnum {
    Buy,
    Sell,
    Hold,
}

/// Risk metrics
#[derive(SimpleObject)]
pub struct RiskMetrics {
    pub max_position_percent: u8,
    pub max_daily_trades: u32,
    pub daily_trades_remaining: u32,
    pub current_exposure: f64,
}

// ============================================================================
// SERVICE STATE
// ============================================================================

pub struct TradingService {
    runtime: Arc<ServiceRuntime<Self>>,
}

impl TradingService {
    fn format_balance(balance: u128) -> String {
        format!("${}.{:02}", balance / 100, balance % 100)
    }

    fn format_timestamp(timestamp: u64) -> String {
        // Convert microseconds to readable format
        let seconds = timestamp / 1_000_000;
        let datetime = chrono::NaiveDateTime::from_timestamp_opt(seconds as i64, 0)
            .unwrap_or_default();
        datetime.format("%Y-%m-%d %H:%M:%S").to_string()
    }
}

// ============================================================================
// GraphQL QUERIES
// ============================================================================

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    /// Get current portfolio
    async fn portfolio(&self, ctx: &Context<'_>) -> Result<Portfolio> {
        let service = ctx.data::<TradingService>()?;
        let state = service.runtime.root_view_storage_context();
        
        // Load state
        let balance = state.get("balance").await?;
        let positions = state.get("positions").await?;
        
        // Calculate total value and PnL
        let mut total_value = balance as f64 / 100.0;
        let mut unrealized_pnl = 0.0;
        let mut position_infos = Vec::new();

        for (symbol, pos) in positions {
            let position_value = pos.amount * pos.current_price;
            let pnl = (pos.current_price - pos.entry_price) * pos.amount;
            let pnl_percent = if pos.entry_price > 0.0 {
                (pos.current_price - pos.entry_price) / pos.entry_price * 100.0
            } else {
                0.0
            };

            total_value += position_value;
            unrealized_pnl += pnl;

            position_infos.push(PositionInfo {
                symbol,
                amount: pos.amount,
                entry_price: pos.entry_price,
                current_price: pos.current_price,
                unrealized_pnl: pnl,
                pnl_percent,
            });
        }

        Ok(Portfolio {
            balance: TradingService::format_balance(balance),
            total_value: format!("${:.2}", total_value),
            unrealized_pnl: format!("${:.2}", unrealized_pnl),
            positions: position_infos,
        })
    }

    /// Get trade history
    async fn trades(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Number of recent trades to fetch")] limit: Option<i32>,
    ) -> Result<Vec<TradeInfo>> {
        let service = ctx.data::<TradingService>()?;
        let state = service.runtime.root_view_storage_context();
        
        let trades: Vec<TradeRecord> = state.get("trades").await?;
        let limit = limit.unwrap_or(10) as usize;
        
        let trade_infos: Vec<TradeInfo> = trades
            .iter()
            .rev() // Most recent first
            .take(limit)
            .map(|trade| TradeInfo {
                id: trade.id.clone(),
                symbol: trade.symbol.clone(),
                side: match trade.side {
                    TradeSide::Buy => TradeSideEnum::Buy,
                    TradeSide::Sell => TradeSideEnum::Sell,
                },
                amount: trade.amount,
                price: trade.price,
                timestamp: TradingService::format_timestamp(trade.timestamp),
                pnl: trade.pnl,
            })
            .collect();

        Ok(trade_infos)
    }

    /// Get AI signal for a symbol
    async fn signal(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Trading symbol (e.g., BTC)")] symbol: String,
    ) -> Result<Option<SignalInfo>> {
        let service = ctx.data::<TradingService>()?;
        let state = service.runtime.root_view_storage_context();
        
        let signals: BTreeMap<String, TradingSignal> = state.get("last_signals").await?;
        
        Ok(signals.get(&symbol).map(|signal| {
            let recommendation = match signal.signal_type {
                SignalType::Buy => format!(
                    "Strong BUY signal. RSI at {:.1} indicates oversold conditions.",
                    signal.rsi
                ),
                SignalType::Sell => format!(
                    "Strong SELL signal. RSI at {:.1} indicates overbought conditions.",
                    signal.rsi
                ),
                SignalType::Hold => format!(
                    "HOLD. RSI at {:.1} is in neutral zone.",
                    signal.rsi
                ),
            };

            SignalInfo {
                symbol: signal.symbol.clone(),
                signal_type: match signal.signal_type {
                    SignalType::Buy => SignalTypeEnum::Buy,
                    SignalType::Sell => SignalTypeEnum::Sell,
                    SignalType::Hold => SignalTypeEnum::Hold,
                },
                confidence: signal.confidence,
                price: signal.price,
                rsi: signal.rsi,
                recommendation,
            }
        }))
    }

    /// Get current risk metrics
    async fn risk_metrics(&self, ctx: &Context<'_>) -> Result<RiskMetrics> {
        let service = ctx.data::<TradingService>()?;
        let state = service.runtime.root_view_storage_context();
        
        let max_position_percent: u8 = state.get("max_position_percent").await?;
        let max_daily_trades: u32 = state.get("max_daily_trades").await?;
        let daily_trade_count: u32 = state.get("daily_trade_count").await?;
        
        let balance: u128 = state.get("balance").await?;
        let positions: BTreeMap<String, Position> = state.get("positions").await?;
        
        // Calculate current exposure
        let total_position_value: f64 = positions
            .values()
            .map(|pos| pos.amount * pos.current_price)
            .sum();
        
        let current_exposure = if balance > 0 {
            (total_position_value / (balance as f64 / 100.0)) * 100.0
        } else {
            0.0
        };

        Ok(RiskMetrics {
            max_position_percent,
            max_daily_trades,
            daily_trades_remaining: max_daily_trades.saturating_sub(daily_trade_count),
            current_exposure,
        })
    }

    /// Health check
    async fn health(&self) -> Result<String> {
        Ok("OK".to_string())
    }
}

// ============================================================================
// GraphQL MUTATIONS
// ============================================================================

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    /// Execute a trade
    async fn execute_trade(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Trading symbol")] symbol: String,
        #[graphql(desc = "Buy or Sell")] side: TradeSideEnum,
        #[graphql(desc = "Amount to trade")] amount: f64,
    ) -> Result<TradeInfo> {
        let service = ctx.data::<TradingService>()?;
        
        let operation = Operation::ExecuteTrade {
            symbol,
            side: match side {
                TradeSideEnum::Buy => TradeSide::Buy,
                TradeSideEnum::Sell => TradeSide::Sell,
            },
            amount,
        };

        let response = service.runtime.execute_operation(operation).await?;
        
        match response {
            Response::TradeExecuted(trade) => Ok(TradeInfo {
                id: trade.id,
                symbol: trade.symbol,
                side: match trade.side {
                    TradeSide::Buy => TradeSideEnum::Buy,
                    TradeSide::Sell => TradeSideEnum::Sell,
                },
                amount: trade.amount,
                price: trade.price,
                timestamp: TradingService::format_timestamp(trade.timestamp),
                pnl: trade.pnl,
            }),
            Response::Error(msg) => Err(msg.into()),
            _ => Err("Unexpected response".into()),
        }
    }

    /// Update AI signal
    async fn update_signal(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Trading symbol")] symbol: String,
        #[graphql(desc = "Current price")] price: f64,
        #[graphql(desc = "RSI value")] rsi: f64,
    ) -> Result<String> {
        let service = ctx.data::<TradingService>()?;
        
        let signal = TradingSignal::generate_signal(symbol, price, rsi);
        
        let operation = Operation::UpdateSignal { signal };
        
        service.runtime.execute_operation(operation).await?;
        
        Ok("Signal updated".to_string())
    }

    /// Update price for a symbol
    async fn update_price(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Trading symbol")] symbol: String,
        #[graphql(desc = "New price")] price: f64,
    ) -> Result<String> {
        let service = ctx.data::<TradingService>()?;
        
        let operation = Operation::UpdatePrice { symbol, price };
        
        service.runtime.execute_operation(operation).await?;
        
        Ok("Price updated".to_string())
    }

    /// Set risk limits
    async fn set_risk_limits(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Max position size as % of portfolio")] 
        max_position_percent: i32,
        #[graphql(desc = "Max trades per day")] 
        max_daily_trades: i32,
    ) -> Result<String> {
        let service = ctx.data::<TradingService>()?;
        
        let operation = Operation::SetRiskLimits {
            max_position_percent: max_position_percent as u8,
            max_daily_trades: max_daily_trades as u32,
        };
        
        service.runtime.execute_operation(operation).await?;
        
        Ok("Risk limits updated".to_string())
    }
}

// ============================================================================
// SERVICE IMPLEMENTATION
// ============================================================================

#[async_trait::async_trait]
impl Service for TradingService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        TradingService {
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, request: &[u8]) -> Vec<u8> {
        let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
            .data(self.clone())
            .finish();

        let query = String::from_utf8_lossy(request);
        
        let result = schema.execute(&query).await;
        
        serde_json::to_vec(&result).expect("Failed to serialize response")
    }
}

// ============================================================================
// ABI
// ============================================================================

pub struct TradingServiceAbi;

impl WithServiceAbi for TradingServiceAbi {
    type Query = String;
    type QueryResponse = Vec<u8>;
}

// ============================================================================
// EXAMPLE QUERIES
// ============================================================================

/*
# Query Portfolio
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

# Get AI Signal
query {
  signal(symbol: "BTC") {
    symbol
    signalType
    confidence
    price
    rsi
    recommendation
  }
}

# Execute Trade
mutation {
  executeTrade(
    symbol: "BTC"
    side: BUY
    amount: 0.1
  ) {
    id
    symbol
    side
    amount
    price
    timestamp
    pnl
  }
}

# Update Signal
mutation {
  updateSignal(
    symbol: "BTC"
    price: 50000.0
    rsi: 25.5
  )
}

# Get Trade History
query {
  trades(limit: 10) {
    id
    symbol
    side
    amount
    price
    timestamp
    pnl
  }
}

# Get Risk Metrics
query {
  riskMetrics {
    maxPositionPercent
    maxDailyTrades
    dailyTradesRemaining
    currentExposure
  }
}
*/
