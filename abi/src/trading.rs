use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub const MAX_POSITIONS: usize = 10;

#[derive(Debug, Clone, Deserialize, Eq, PartialEq, Serialize)]
pub enum TradeType {
    Buy,
    Sell,
}

#[derive(Debug, Clone, Default, Deserialize, Eq, PartialEq, Serialize)]
pub enum TradeStatus {
    #[default]
    Pending,
    Executed,
    Cancelled,
    Failed,
}

#[derive(Debug, Clone, Deserialize, Eq, PartialEq, Serialize)]
pub enum SignalStrength {
    Weak,
    Medium,
    Strong,
}

#[derive(Debug, Clone, Deserialize, Eq, PartialEq, Serialize)]
pub struct Trade {
    pub id: u64,
    pub symbol: String,
    pub trade_type: TradeType,
    pub amount: u64,
    pub price: u64,
    pub status: TradeStatus,
    pub timestamp: u64,
    pub ai_signal_id: Option<u64>,
}

#[derive(Debug, Clone, Deserialize, Eq, PartialEq, Serialize)]
pub struct Position {
    pub symbol: String,
    pub quantity: u64,
    pub avg_price: u64,
    pub current_value: u64,
    pub pnl: i64,
}

#[derive(Debug, Clone, Default, Deserialize, Eq, PartialEq, Serialize)]
pub struct Portfolio {
    pub balance: u64,
    pub positions: HashMap<String, Position>,
    pub total_value: u64,
    pub total_pnl: i64,
}

impl Portfolio {
    pub fn new(initial_balance: u64) -> Self {
        Portfolio {
            balance: initial_balance,
            positions: HashMap::new(),
            total_value: initial_balance,
            total_pnl: 0,
        }
    }

    pub fn execute_trade(&mut self, trade: &Trade) -> bool {
        match trade.trade_type {
            TradeType::Buy => self.buy_asset(trade),
            TradeType::Sell => self.sell_asset(trade),
        }
    }

    fn buy_asset(&mut self, trade: &Trade) -> bool {
        let cost = trade.amount;
        if self.balance >= cost {
            self.balance -= cost;
            let position = self.positions.entry(trade.symbol.clone()).or_insert(Position {
                symbol: trade.symbol.clone(),
                quantity: 0,
                avg_price: 0,
                current_value: 0,
                pnl: 0,
            });
            position.quantity += trade.amount;
            true
        } else {
            false
        }
    }

    fn sell_asset(&mut self, trade: &Trade) -> bool {
        if let Some(position) = self.positions.get_mut(&trade.symbol) {
            if position.quantity >= trade.amount {
                position.quantity -= trade.amount;
                self.balance += trade.price;
                true
            } else {
                false
            }
        } else {
            false
        }
    }
}