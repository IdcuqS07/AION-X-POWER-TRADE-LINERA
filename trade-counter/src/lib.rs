use async_graphql::{Request, Response};
use linera_sdk::linera_base_types::{ContractAbi, ServiceAbi};

pub struct TradeCounterAbi;

impl ContractAbi for TradeCounterAbi {
    type Operation = u64;
    type Response = u64;
}

impl ServiceAbi for TradeCounterAbi {
    type Query = Request;
    type QueryResponse = Response;
}
