use abi::Portfolio;
use serde::{Deserialize, Serialize};

pub use abi::TradingAbi;

#[derive(Debug, Deserialize, Serialize)]
pub enum TradingEvent {
    TradeExecuted { symbol: String, amount: f64 },
    PortfolioUpdated { portfolio: Portfolio },
}