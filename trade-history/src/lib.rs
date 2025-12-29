use async_graphql::{Request, Response, SimpleObject};
use linera_sdk::abi::{ContractAbi, ServiceAbi};
use serde::{Deserialize, Serialize};

pub struct TradeHistoryAbi;

impl ContractAbi for TradeHistoryAbi {
    type Operation = Operation;
    type Response = u64;
}

impl ServiceAbi for TradeHistoryAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Deserialize, Serialize)]
pub enum Operation {
    ExecuteTrade {
        coin: String,
        trade_type: String,
        entry_price: f64,
        exit_price: f64,
        amount: f64,
    },
}

#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
pub struct Trade {
    pub id: u64,
    pub user: String,
    pub coin: String,
    pub trade_type: String,
    pub entry_price: f64,
    pub exit_price: f64,
    pub amount: f64,
    pub profit_loss: f64,
    pub timestamp: u64,
}

