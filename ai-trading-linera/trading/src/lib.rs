use ai_trading_abi::*;
use linera_sdk::abi::WithContractAbi;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum TradingOperation {
    UpdateSignal { signal: TradingSignal },
    ExecuteTrade { symbol: String, side: TradeSide, amount: f64 },
    GetPortfolio,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum TradingResponse {
    SignalUpdated,
    TradeExecuted(TradeRecord),
    Portfolio(Portfolio),
    Error(String),
}

pub struct TradingAbi;

impl WithContractAbi for TradingAbi {
    type Operation = TradingOperation;
    type Response = TradingResponse;
}