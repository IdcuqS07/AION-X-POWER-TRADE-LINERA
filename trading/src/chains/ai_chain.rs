use abi::ai_signals::{AISignal, AIModel};
use abi::trading::SignalStrength;
use abi::market_data::MarketPrice;
use std::collections::HashMap;

pub struct AIChain {
    pub models: Vec<AIModel>,
    pub signals: Vec<AISignal>,
    pub market_data: HashMap<String, MarketPrice>,
    pub next_signal_id: u64,
}

impl AIChain {
    pub fn new() -> Self {
        Self {
            models: vec![AIModel {
                name: "TrendFollower".to_string(),
                version: "v1.0".to_string(),
                accuracy: 75,
                last_updated: 0,
            }],
            signals: Vec::new(),
            market_data: HashMap::new(),
            next_signal_id: 1,
        }
    }

    pub fn generate_signal(&mut self, symbol: String, model_version: String) -> AISignal {
        // Simple signal generation logic
        let signal = AISignal::new(
            self.next_signal_id,
            symbol.clone(),
            if self.next_signal_id % 2 == 0 { "BUY" } else { "SELL" }.to_string(),
            SignalStrength::Medium,
            1000 + (self.next_signal_id * 10), // Simple price target
            0, // Current timestamp
        );

        self.signals.push(signal.clone());
        self.next_signal_id += 1;

        signal
    }

    pub fn update_market_data(&mut self, symbol: String, price: MarketPrice) {
        self.market_data.insert(symbol, price);
    }

    pub fn get_latest_signals(&self, limit: usize) -> Vec<&AISignal> {
        self.signals.iter().rev().take(limit).collect()
    }

    pub fn update_model(&mut self, name: String, version: String) {
        if let Some(model) = self.models.iter_mut().find(|m| m.name == name) {
            model.version = version;
            model.last_updated = 0; // Current timestamp
        }
    }

    pub fn analyze_market(&self, symbol: &str) -> Option<SignalStrength> {
        if let Some(_price_data) = self.market_data.get(symbol) {
            // Simple analysis - in real implementation, this would use ML models
            Some(SignalStrength::Medium)
        } else {
            None
        }
    }
}