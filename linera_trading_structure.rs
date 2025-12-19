// abi/src/lib.rs - Shared types untuk AI Trading di Linera

use serde::{Deserialize, Serialize};

// Trading Signal dari AI
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TradingSignal {
    pub symbol: String,
    pub signal_type: SignalType,
    pub confidence: f64,
    pub timestamp: u64,
    pub indicators: TechnicalIndicators,
    pub risk_assessment: RiskAssessment,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SignalType {
    Buy,
    Sell,
    Hold,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TechnicalIndicators {
    pub rsi: f64,
    pub macd_value: f64,
    pub macd_signal: f64,
    pub bb_upper: f64,
    pub bb_middle: f64,
    pub bb_lower: f64,
    pub sma_20: f64,
    pub sma_50: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RiskAssessment {
    pub risk_score: f64,  // 0-100
    pub max_position_size: f64,
    pub stop_loss: f64,
    pub take_profit: f64,
}

// Trade Request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TradeRequest {
    pub user_chain_id: String,
    pub symbol: String,
    pub trade_type: TradeType,
    pub amount: f64,
    pub price: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TradeType {
    Market,
    Limit,
}

// Trade Record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TradeRecord {
    pub id: String,
    pub user_chain_id: String,
    pub symbol: String,
    pub side: TradeSide,
    pub amount: f64,
    pub price: f64,
    pub timestamp: u64,
    pub status: TradeStatus,
    pub pnl: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TradeSide {
    Buy,
    Sell,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TradeStatus {
    Pending,
    Executed,
    Failed,
    Cancelled,
}

// Portfolio State
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Portfolio {
    pub user_chain_id: String,
    pub balance: f64,
    pub positions: Vec<Position>,
    pub total_value: f64,
    pub unrealized_pnl: f64,
    pub realized_pnl: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position {
    pub symbol: String,
    pub amount: f64,
    pub entry_price: f64,
    pub current_price: f64,
    pub unrealized_pnl: f64,
}

// Messages untuk cross-chain communication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TradingMessage {
    RequestSignal { symbol: String },
    SignalResponse { signal: TradingSignal },
    ExecuteTrade { trade: TradeRequest },
    TradeResult { record: TradeRecord },
    UpdatePrice { symbol: String, price: f64 },
    SubscribePrices { symbols: Vec<String> },
}

// Chain Types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ChainType {
    Master,
    Public,
    Trade,
    User,
}

// Risk Management Rules
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RiskLimits {
    pub max_position_size_percent: f64,  // % of portfolio
    pub max_daily_trades: u32,
    pub max_daily_loss_percent: f64,
    pub min_confidence_threshold: f64,
    pub stop_loss_percent: f64,
}

impl Default for RiskLimits {
    fn default() -> Self {
        Self {
            max_position_size_percent: 20.0,
            max_daily_trades: 50,
            max_daily_loss_percent: 5.0,
            min_confidence_threshold: 65.0,
            stop_loss_percent: 2.0,
        }
    }
}

// Price Feed dari Oracle
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PriceFeed {
    pub symbol: String,
    pub price: f64,
    pub timestamp: u64,
    pub source: String,
    pub verified: bool,
}

// Validation Result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidationResult {
    pub valid: bool,
    pub reasons: Vec<String>,
    pub risk_score: f64,
}

impl TradingSignal {
    pub fn should_execute(&self, risk_limits: &RiskLimits) -> bool {
        self.confidence >= risk_limits.min_confidence_threshold
            && self.risk_assessment.risk_score <= 75.0
    }
}

impl TradeRequest {
    pub fn validate(&self, portfolio: &Portfolio, risk_limits: &RiskLimits) -> ValidationResult {
        let mut valid = true;
        let mut reasons = Vec::new();
        
        // Check position size
        let position_value = self.amount * self.price;
        let max_position = portfolio.total_value * (risk_limits.max_position_size_percent / 100.0);
        
        if position_value > max_position {
            valid = false;
            reasons.push(format!(
                "Position size {} exceeds max {}", 
                position_value, max_position
            ));
        }
        
        // Check balance
        if self.trade_type == TradeType::Market && position_value > portfolio.balance {
            valid = false;
            reasons.push("Insufficient balance".to_string());
        }
        
        ValidationResult {
            valid,
            reasons,
            risk_score: 50.0, // Calculate based on various factors
        }
    }
}

impl Portfolio {
    pub fn update_position(&mut self, trade: &TradeRecord) {
        // Find or create position
        if let Some(pos) = self.positions.iter_mut().find(|p| p.symbol == trade.symbol) {
            match trade.side {
                TradeSide::Buy => {
                    let total_cost = pos.amount * pos.entry_price + trade.amount * trade.price;
                    let total_amount = pos.amount + trade.amount;
                    pos.entry_price = total_cost / total_amount;
                    pos.amount = total_amount;
                }
                TradeSide::Sell => {
                    pos.amount -= trade.amount;
                    let pnl = (trade.price - pos.entry_price) * trade.amount;
                    self.realized_pnl += pnl;
                }
            }
        } else if matches!(trade.side, TradeSide::Buy) {
            self.positions.push(Position {
                symbol: trade.symbol.clone(),
                amount: trade.amount,
                entry_price: trade.price,
                current_price: trade.price,
                unrealized_pnl: 0.0,
            });
        }
        
        self.balance -= trade.amount * trade.price * if matches!(trade.side, TradeSide::Buy) { 1.0 } else { -1.0 };
    }
    
    pub fn update_prices(&mut self, prices: &[(String, f64)]) {
        self.unrealized_pnl = 0.0;
        
        for pos in &mut self.positions {
            if let Some((_, price)) = prices.iter().find(|(s, _)| s == &pos.symbol) {
                pos.current_price = *price;
                pos.unrealized_pnl = (pos.current_price - pos.entry_price) * pos.amount;
                self.unrealized_pnl += pos.unrealized_pnl;
            }
        }
        
        self.total_value = self.balance + 
            self.positions.iter().map(|p| p.amount * p.current_price).sum::<f64>();
    }
}
