use linera_sdk::linera_base_types::{ContractAbi, ServiceAbi};
use serde::{Deserialize, Serialize};

pub struct TradingAbi;

impl ContractAbi for TradingAbi {
    type Operation = u64;
    type Response = u64;
}

#[derive(Debug, Deserialize, Serialize)]
pub struct SimpleQuery {
    pub value: u64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct SimpleResponse {
    pub result: u64,
}

impl ServiceAbi for TradingAbi {
    type Query = SimpleQuery;
    type QueryResponse = SimpleResponse;
}
