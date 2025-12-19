use ai_power_trade_abi::*;
use linera_sdk::views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext};

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct ApplicationState {
    pub signals: MapView<String, AISignal>,
    pub trades: MapView<u64, Trade>,
    pub trade_counter: RegisterView<u64>,
    pub portfolio: RegisterView<Portfolio>,
}
