use async_graphql::{Request, Response};
use linera_sdk::linera_base_types::{ContractAbi, ServiceAbi};

pub struct TradingAbi;

impl ContractAbi for TradingAbi {
    type Operation = u64;
    type Response = u64;
}

impl ServiceAbi for TradingAbi {
    type Query = Request;
    type QueryResponse = Response;
}
