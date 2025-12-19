pub use crate::trading::SignalStrength;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Eq, PartialEq, Serialize)]
pub struct AISignal {
    pub id: u64,
    pub symbol: String,
    pub action: String,
    pub confidence: SignalStrength,
    pub target_price: u64,
    pub stop_loss: u64,
    pub take_profit: u64,
    pub timestamp: u64,
    pub model_version: String,
}

#[derive(Debug, Clone, Deserialize, Eq, PartialEq, Serialize)]
pub struct AIModel {
    pub name: String,
    pub version: String,
    pub accuracy: u8,
    pub last_updated: u64,
}

impl AISignal {
    pub fn new(
        id: u64,
        symbol: String,
        action: String,
        confidence: SignalStrength,
        target_price: u64,
        timestamp: u64,
    ) -> Self {
        AISignal {
            id,
            symbol,
            action,
            confidence,
            target_price,
            stop_loss: 0,
            take_profit: 0,
            timestamp,
            model_version: "v1.0".to_string(),
        }
    }
}