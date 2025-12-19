use async_graphql::{Request, Response};
use linera_sdk::linera_base_types::{Amount, ChainId, ContractAbi, ServiceAbi};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct TradingAbi;

impl ContractAbi for TradingAbi {
    type Operation = TradingOperation;
    type Response = ();
}

impl ServiceAbi for TradingAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Deserialize, Serialize)]
pub enum TradingOperation {
    ExecuteTrade { symbol: String, side: String, amount: f64 },
    GetPortfolio,
    UpdateBalance { amount: Amount },
}

#[derive(Debug, Deserialize, Serialize)]
pub enum TradingMessage {
    TradeExecuted { trade_id: String, symbol: String, amount: f64 },
    PortfolioUpdate { balance: f64 },
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct TradingParameters {
    pub master_chain: ChainId,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Position {
    pub symbol: String,
    pub amount: f64,
    pub entry_price: f64,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Portfolio {
    pub balance: f64,
    pub positions: Vec<Position>,
}