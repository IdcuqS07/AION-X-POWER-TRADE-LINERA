use linera_sdk::{
    abi::{ContractAbi, ServiceAbi},
    Contract, Service,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub enum Operation {
    ExecuteTrade { symbol: String, side: String, amount: f64 },
    GetPortfolio,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum Response {
    TradeExecuted { trade_id: String },
    Portfolio { balance: f64 },
}

pub struct TradingAbi;

impl ContractAbi for TradingAbi {
    type Operation = Operation;
    type Response = Response;
}

impl ServiceAbi for TradingAbi {
    type Query = ();
    type QueryResponse = Response;
}

#[derive(Default)]
pub struct TradingContract {
    balance: f64,
}

#[async_trait::async_trait]
impl Contract for TradingContract {
    type Message = ();
    type Parameters = ();

    async fn load(_runtime: linera_sdk::ContractRuntime<Self>) -> Self {
        TradingContract { balance: 10000.0 }
    }

    async fn instantiate(&mut self, _parameters: Self::Parameters) {}

    async fn execute_operation(
        &mut self,
        _runtime: linera_sdk::ContractRuntime<Self>,
        operation: Operation,
    ) -> Self::Response {
        match operation {
            Operation::ExecuteTrade { symbol, side: _, amount: _ } => {
                Response::TradeExecuted {
                    trade_id: format!("trade_{}", symbol),
                }
            }
            Operation::GetPortfolio => {
                Response::Portfolio {
                    balance: self.balance,
                }
            }
        }
    }
}

#[derive(Default)]
pub struct TradingService;

#[async_trait::async_trait]
impl Service for TradingService {
    type Parameters = ();

    async fn handle_query(
        &mut self,
        _runtime: linera_sdk::ServiceRuntime<Self>,
        _query: (),
    ) -> Response {
        Response::Portfolio {
            balance: 10000.0,
        }
    }
}

linera_sdk::contract!(TradingContract);
linera_sdk::service!(TradingService);