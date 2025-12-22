use async_graphql::{Request, Response, SimpleObject};
use linera_sdk::abi::{ContractAbi, ServiceAbi};
use serde::{Deserialize, Serialize};

pub struct TradingCounterAbi;

impl ContractAbi for TradingCounterAbi {
    type Operation = Operation;
    type Response = u64;
}

impl ServiceAbi for TradingCounterAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Deserialize, Serialize)]
pub enum Operation {
    /// Increment trade counter
    IncrementTrades,
    /// Increment signal counter
    IncrementSignals,
}

#[derive(Clone, SimpleObject)]
pub struct TradeStats {
    pub total_trades: u64,
    pub total_signals: u64,
}
