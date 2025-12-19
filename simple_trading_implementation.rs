// trading/src/contract.rs
// Implementasi Sederhana Trading Contract untuk Linera

use linera_sdk::{
    base::{ChainId, Owner, Timestamp, WithContractAbi},
    views::{RootView, View, ViewStorageContext},
    Contract, ContractRuntime,
};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

// ============================================================================
// STATE DEFINITIONS
// ============================================================================

/// Main contract state yang disimpan on-chain
#[derive(RootView, Debug)]
#[view(context = "ViewStorageContext")]
pub struct TradingState {
    // User portfolio
    pub balance: u128,
    pub positions: BTreeMap<String, Position>,
    
    // Trading history
    pub trades: Vec<TradeRecord>,
    pub trade_count: u64,
    
    // AI signals cache
    pub last_signals: BTreeMap<String, TradingSignal>,
    
    // Risk limits
    pub max_position_percent: u8,
    pub max_daily_trades: u32,
    pub daily_trade_count: u32,
    pub last_reset_day: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position {
    pub symbol: String,
    pub amount: f64,
    pub entry_price: f64,
    pub current_price: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TradeRecord {
    pub id: String,
    pub symbol: String,
    pub side: TradeSide,
    pub amount: f64,
    pub price: f64,
    pub timestamp: u64,
    pub pnl: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TradeSide {
    Buy,
    Sell,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TradingSignal {
    pub symbol: String,
    pub signal_type: SignalType,
    pub confidence: f64,
    pub price: f64,
    pub rsi: f64,
    pub timestamp: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SignalType {
    Buy,
    Sell,
    Hold,
}

// ============================================================================
// OPERATIONS (Messages ke Contract)
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub enum Operation {
    // Initialize user account
    Initialize { initial_balance: u128 },
    
    // AI Signal operations
    UpdateSignal { signal: TradingSignal },
    
    // Trading operations
    ExecuteTrade {
        symbol: String,
        side: TradeSide,
        amount: f64,
    },
    
    // Portfolio operations
    UpdatePrice { symbol: String, price: f64 },
    
    // Admin operations
    SetRiskLimits {
        max_position_percent: u8,
        max_daily_trades: u32,
    },
}

#[derive(Debug, Serialize, Deserialize)]
pub enum Response {
    Ok,
    TradeExecuted(TradeRecord),
    SignalUpdated,
    Error(String),
}

// ============================================================================
// CONTRACT IMPLEMENTATION
// ============================================================================

pub struct TradingContract {
    state: TradingState,
    runtime: ContractRuntime<Self>,
}

#[async_trait::async_trait]
impl Contract for TradingContract {
    type Message = ();
    type InstantiationArgument = ();
    type Parameters = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = TradingState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradingContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: ()) {
        // Initialize with default values
        self.state.balance = 10_000_00; // 10,000 USD
        self.state.max_position_percent = 20;
        self.state.max_daily_trades = 50;
    }

    async fn execute_operation(&mut self, operation: Operation) -> Response {
        match operation {
            Operation::Initialize { initial_balance } => {
                self.handle_initialize(initial_balance).await
            }
            
            Operation::UpdateSignal { signal } => {
                self.handle_update_signal(signal).await
            }
            
            Operation::ExecuteTrade { symbol, side, amount } => {
                self.handle_execute_trade(symbol, side, amount).await
            }
            
            Operation::UpdatePrice { symbol, price } => {
                self.handle_update_price(symbol, price).await
            }
            
            Operation::SetRiskLimits {
                max_position_percent,
                max_daily_trades,
            } => {
                self.handle_set_risk_limits(max_position_percent, max_daily_trades).await
            }
        }
    }

    async fn execute_message(&mut self, _message: ()) {
        // Handle cross-chain messages
        panic!("No cross-chain messages expected")
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

// ============================================================================
// HANDLER IMPLEMENTATIONS
// ============================================================================

impl TradingContract {
    // Initialize user account
    async fn handle_initialize(&mut self, initial_balance: u128) -> Response {
        self.state.balance = initial_balance;
        Response::Ok
    }

    // Update AI signal
    async fn handle_update_signal(&mut self, signal: TradingSignal) -> Response {
        let symbol = signal.symbol.clone();
        self.state.last_signals.insert(symbol, signal);
        Response::SignalUpdated
    }

    // Execute trade
    async fn handle_execute_trade(
        &mut self,
        symbol: String,
        side: TradeSide,
        amount: f64,
    ) -> Response {
        // Check daily trade limit
        let current_day = self.get_current_day();
        if self.state.last_reset_day != current_day {
            self.state.daily_trade_count = 0;
            self.state.last_reset_day = current_day;
        }

        if self.state.daily_trade_count >= self.state.max_daily_trades {
            return Response::Error("Daily trade limit reached".to_string());
        }

        // Get signal
        let signal = match self.state.last_signals.get(&symbol) {
            Some(sig) => sig.clone(),
            None => {
                return Response::Error("No signal available for symbol".to_string());
            }
        };

        // Validate signal confidence
        if signal.confidence < 65.0 {
            return Response::Error("Signal confidence too low".to_string());
        }

        // Calculate trade value
        let price = signal.price;
        let trade_value = (amount * price * 100.0) as u128;

        // Validate based on side
        match side {
            TradeSide::Buy => {
                // Check balance
                if trade_value > self.state.balance {
                    return Response::Error("Insufficient balance".to_string());
                }

                // Check position size limit
                let max_position = (self.state.balance as f64 
                    * self.state.max_position_percent as f64 / 100.0) as u128;
                
                if trade_value > max_position {
                    return Response::Error("Position size exceeds limit".to_string());
                }

                // Execute buy
                self.state.balance -= trade_value;
                
                // Update position
                let position = self.state.positions.entry(symbol.clone())
                    .or_insert(Position {
                        symbol: symbol.clone(),
                        amount: 0.0,
                        entry_price: price,
                        current_price: price,
                    });
                
                // Update average entry price
                let total_cost = position.amount * position.entry_price + amount * price;
                let total_amount = position.amount + amount;
                position.entry_price = total_cost / total_amount;
                position.amount = total_amount;
                position.current_price = price;
            }
            
            TradeSide::Sell => {
                // Check if position exists
                let position = match self.state.positions.get_mut(&symbol) {
                    Some(pos) => pos,
                    None => {
                        return Response::Error("No position to sell".to_string());
                    }
                };

                // Check if sufficient amount
                if position.amount < amount {
                    return Response::Error("Insufficient position size".to_string());
                }

                // Calculate PnL
                let pnl = (price - position.entry_price) * amount;
                let pnl_value = (pnl * 100.0) as i128;

                // Execute sell
                position.amount -= amount;
                self.state.balance = (self.state.balance as i128 + 
                    trade_value as i128 + pnl_value) as u128;

                // Remove position if fully sold
                if position.amount == 0.0 {
                    self.state.positions.remove(&symbol);
                }
            }
        }

        // Create trade record
        let trade = TradeRecord {
            id: format!("trade_{}", self.state.trade_count),
            symbol: symbol.clone(),
            side: side.clone(),
            amount,
            price,
            timestamp: self.runtime.system_time(),
            pnl: 0.0, // Calculate based on side
        };

        // Update counters
        self.state.trade_count += 1;
        self.state.daily_trade_count += 1;
        self.state.trades.push(trade.clone());

        Response::TradeExecuted(trade)
    }

    // Update price for a symbol
    async fn handle_update_price(&mut self, symbol: String, price: f64) -> Response {
        if let Some(position) = self.state.positions.get_mut(&symbol) {
            position.current_price = price;
        }
        Response::Ok
    }

    // Set risk management limits
    async fn handle_set_risk_limits(
        &mut self,
        max_position_percent: u8,
        max_daily_trades: u32,
    ) -> Response {
        self.state.max_position_percent = max_position_percent;
        self.state.max_daily_trades = max_daily_trades;
        Response::Ok
    }

    // Helper: Get current day (for daily limits)
    fn get_current_day(&self) -> u64 {
        self.runtime.system_time() / 86400_000000 // microseconds to days
    }
}

// ============================================================================
// ABI DEFINITION
// ============================================================================

/// Application Binary Interface
pub struct TradingAbi;

impl WithContractAbi for TradingAbi {
    type Operation = Operation;
    type Response = Response;
}

// ============================================================================
// HELPER FUNCTIONS FOR AI SIGNALS
// ============================================================================

impl TradingSignal {
    /// Calculate RSI from price history
    pub fn calculate_rsi(prices: &[f64], period: usize) -> f64 {
        if prices.len() < period + 1 {
            return 50.0; // Neutral
        }

        let mut gains = 0.0;
        let mut losses = 0.0;

        for i in 1..=period {
            let change = prices[prices.len() - i] - prices[prices.len() - i - 1];
            if change > 0.0 {
                gains += change;
            } else {
                losses += change.abs();
            }
        }

        let avg_gain = gains / period as f64;
        let avg_loss = losses / period as f64;

        if avg_loss == 0.0 {
            return 100.0;
        }

        let rs = avg_gain / avg_loss;
        let rsi = 100.0 - (100.0 / (1.0 + rs));
        
        rsi
    }

    /// Generate signal from RSI
    pub fn generate_signal(symbol: String, price: f64, rsi: f64) -> Self {
        let (signal_type, confidence) = if rsi < 30.0 {
            // Oversold - Buy signal
            (SignalType::Buy, 70.0 + (30.0 - rsi))
        } else if rsi > 70.0 {
            // Overbought - Sell signal
            (SignalType::Sell, 70.0 + (rsi - 70.0))
        } else {
            // Neutral
            (SignalType::Hold, 50.0)
        };

        TradingSignal {
            symbol,
            signal_type,
            confidence,
            price,
            rsi,
            timestamp: 0, // Set by contract
        }
    }
}

// ============================================================================
// TESTS
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rsi_calculation() {
        let prices = vec![100.0, 102.0, 101.0, 103.0, 105.0, 104.0, 106.0];
        let rsi = TradingSignal::calculate_rsi(&prices, 6);
        assert!(rsi > 50.0); // Should be above 50 for uptrend
    }

    #[test]
    fn test_signal_generation() {
        // Test oversold signal
        let signal = TradingSignal::generate_signal(
            "BTC".to_string(),
            50000.0,
            25.0, // Oversold
        );
        assert!(matches!(signal.signal_type, SignalType::Buy));
        assert!(signal.confidence > 70.0);

        // Test overbought signal
        let signal = TradingSignal::generate_signal(
            "BTC".to_string(),
            50000.0,
            75.0, // Overbought
        );
        assert!(matches!(signal.signal_type, SignalType::Sell));
        assert!(signal.confidence > 70.0);
    }
}
