use linera_sdk::views::{linera_views, RegisterView, RootView, ViewStorageContext};

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct TradingCounter {
    pub trade_count: RegisterView<u64>,
    pub signal_count: RegisterView<u64>,
}
