use async_graphql::{Request, Response as GraphQLResponse, SimpleObject};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    base::{ContractAbi, ServiceAbi},
};
use serde::{Deserialize, Serialize};

pub struct ApplicationAbi;

impl ContractAbi for ApplicationAbi {
    type Operation = Operation;
    type Response = u64;
}

impl ServiceAbi for ApplicationAbi {
    type Query = Request;
    type QueryResponse = GraphQLResponse;
}

#[derive(Debug, Serialize, Deserialize, GraphQLMutationRoot)]
pub enum Operation {
    GenerateSignal { coin: String },
    ExecuteTrade { coin: String, amount: u64 },
}

#[derive(Debug, Serialize, Deserialize, Clone, SimpleObject)]
pub struct AISignal {
    pub coin: String,
    pub signal: String,
    pub confidence: u64,
    pub risk_score: u32,
    pub target_price: u64,
    pub timestamp: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone, SimpleObject)]
pub struct Trade {
    pub id: u64,
    pub coin: String,
    pub amount: u64,
    pub price: u64,
    pub confidence: u64,
    pub timestamp: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default, SimpleObject)]
pub struct Portfolio {
    pub total_value: u64,
    pub pnl: i64,
    pub win_rate: u32,
    pub total_trades: u32,
}