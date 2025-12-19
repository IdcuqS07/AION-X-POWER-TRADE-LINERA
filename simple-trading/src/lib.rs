use async_graphql::{Request, Response, EmptySubscription, EmptyMutation, Object, Schema, SimpleObject};
use linera_sdk::{
    linera_base_types::{ContractAbi, ServiceAbi, WithContractAbi, WithServiceAbi, Timestamp},
    views::{RootView, View, ViewStorageContext, RegisterView, MapView, linera_views},
    Contract, ContractRuntime, Service, ServiceRuntime,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

// ABI Definition
pub struct TradingAbi;

impl ContractAbi for TradingAbi {
    type Operation = Operation;
    type Response = u64;
}

impl ServiceAbi for TradingAbi {
    type Query = Request;
    type QueryResponse = Response;
}

// Operations
#[derive(Debug, Deserialize, Serialize)]
pub enum Operation {
    GenerateSignal { coin: String },
    ExecuteTrade { coin: String, amount: u64 },
}

// Data Types
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
pub struct Signal {
    pub coin: String,
    pub action: String,
    pub confidence: u64,
    pub timestamp: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
pub struct Trade {
    pub id: u64,
    pub coin: String,
    pub amount: u64,
    pub timestamp: u64,
}

// State
#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct TradingState {
    pub trade_count: RegisterView<u64>,
    pub signals: MapView<String, Signal>,
    pub trades: MapView<u64, Trade>,
}

// Contract
pub struct TradingContract {
    state: TradingState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(TradingContract);

impl WithContractAbi for TradingContract {
    type Abi = TradingAbi;
}

impl Contract for TradingContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = TradingState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradingContract { state, runtime }
    }

    async fn instantiate(&mut self, _: ()) {
        self.state.trade_count.set(0);
    }

    async fn execute_operation(&mut self, operation: Operation) -> u64 {
        match operation {
            Operation::GenerateSignal { coin } => {
                let timestamp = Timestamp::now().micros();
                let signal = Signal {
                    coin: coin.clone(),
                    action: "BUY".to_string(),
                    confidence: 75,
                    timestamp,
                };
                self.state.signals.insert(&coin, signal).expect("insert failed");
                timestamp
            }
            Operation::ExecuteTrade { coin, amount } => {
                let count = self.state.trade_count.get_mut();
                *count += 1;
                let trade_id = *count;
                
                let trade = Trade {
                    id: trade_id,
                    coin,
                    amount,
                    timestamp: Timestamp::now().micros(),
                };
                self.state.trades.insert(&trade_id, trade).expect("insert failed");
                trade_id
            }
        }
    }

    async fn execute_message(&mut self, _: ()) {
        panic!("No messages supported");
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

// Service
pub struct TradingService {
    state: Arc<TradingState>,
}

linera_sdk::service!(TradingService);

impl WithServiceAbi for TradingService {
    type Abi = TradingAbi;
}

impl Service for TradingService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = TradingState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradingService { state: Arc::new(state) }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(QueryRoot { state: self.state.clone() }, EmptyMutation, EmptySubscription).finish();
        schema.execute(request).await
    }
}

struct QueryRoot {
    state: Arc<TradingState>,
}

#[Object]
impl QueryRoot {
    async fn trade_count(&self) -> u64 {
        *self.state.trade_count.get()
    }

    async fn signals(&self) -> Vec<Signal> {
        let mut result = Vec::new();
        for coin in ["BTC", "ETH", "SOL"] {
            if let Ok(Some(signal)) = self.state.signals.get(coin).await {
                result.push(signal);
            }
        }
        result
    }

    async fn trades(&self) -> Vec<Trade> {
        let mut result = Vec::new();
        let indices = self.state.trades.indices().await.unwrap_or_default();
        for id in indices {
            if let Ok(Some(trade)) = self.state.trades.get(&id).await {
                result.push(trade);
            }
        }
        result
    }
}
