use crate::state::ApplicationState;
use ai_power_trade_abi::*;
use async_graphql::{EmptyMutation, EmptySubscription, Object, Request, Response, Schema};
use linera_sdk::{
    base::WithServiceAbi,
    views::View,
    Service, ServiceRuntime,
};
use std::sync::Arc;

pub struct TradingService {
    state: Arc<ApplicationState>,
}

linera_sdk::service!(TradingService);

impl WithServiceAbi for TradingService {
    type Abi = ApplicationAbi;
}

impl Service for TradingService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = ApplicationState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TradingService {
            state: Arc::new(state),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            QueryRoot {
                state: self.state.clone(),
            },
            EmptyMutation,
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
}

struct QueryRoot {
    state: Arc<ApplicationState>,
}

#[Object]
impl QueryRoot {
    async fn signals(&self) -> Vec<AISignal> {
        let mut result = Vec::new();
        for coin in ["BTC", "ETH", "SOL", "BNB"] {
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

    async fn portfolio(&self) -> Portfolio {
        self.state.portfolio.get().clone()
    }

    async fn trade_count(&self) -> u64 {
        *self.state.trade_counter.get()
    }
}
