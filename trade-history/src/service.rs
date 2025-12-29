#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use self::state::TradeHistoryState;
use async_graphql::{EmptySubscription, Object, Request, Response, Schema};
use linera_sdk::{linera_base_types::WithServiceAbi, views::View, Service, ServiceRuntime};
use std::sync::Arc;
use trade_history::{Trade, TradeHistoryAbi};

linera_sdk::service!(TradeHistoryService);

pub struct TradeHistoryService {
    state: TradeHistoryState,
    runtime: Arc<ServiceRuntime<Self>>,
}

impl WithServiceAbi for TradeHistoryService {
    type Abi = TradeHistoryAbi;
}

impl Service for TradeHistoryService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = TradeHistoryState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradeHistoryService {
            state,
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let all_trades = self.state.all_trades();
        let schema = Schema::build(
            QueryRoot {
                all_trades,
            },
            EmptyMutation,
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
}

struct EmptyMutation;

#[Object]
impl EmptyMutation {
    async fn _dummy(&self) -> bool {
        true
    }
}

struct QueryRoot {
    all_trades: Vec<Trade>,
}

#[Object]
impl QueryRoot {
    async fn user_trades(&self, user: String) -> Vec<Trade> {
        self.all_trades
            .iter()
            .filter(|t| t.user == user)
            .cloned()
            .collect()
    }

    async fn total_trades(&self) -> u64 {
        self.all_trades.len() as u64
    }

    async fn user_total_pnl(&self, user: String) -> f64 {
        self.all_trades
            .iter()
            .filter(|t| t.user == user)
            .map(|t| t.profit_loss)
            .sum()
    }

    async fn all_trades(&self) -> Vec<Trade> {
        self.all_trades.clone()
    }
}
