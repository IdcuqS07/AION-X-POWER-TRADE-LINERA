use std::collections::HashMap;

pub struct MasterChain {
    pub registered_chains: HashMap<String, ChainInfo>,
    pub trading_pairs: Vec<String>,
    pub system_config: SystemConfig,
}

#[derive(Debug, Clone)]
pub struct ChainInfo {
    pub chain_id: String,
    pub chain_type: ChainType,
    pub status: ChainStatus,
    pub last_heartbeat: u64,
}

#[derive(Debug, Clone, PartialEq)]
pub enum ChainType {
    User,
    AI,
    Market,
}

#[derive(Debug, Clone)]
pub enum ChainStatus {
    Active,
    Inactive,
    Maintenance,
}

#[derive(Debug, Clone)]
pub struct SystemConfig {
    pub max_position_size: u64,
    pub trading_fee: u64, // basis points
    pub min_trade_amount: u64,
    pub max_leverage: u32,
}

impl MasterChain {
    pub fn new() -> Self {
        Self {
            registered_chains: HashMap::new(),
            trading_pairs: vec![
                "BTC/USD".to_string(),
                "ETH/USD".to_string(),
                "SOL/USD".to_string(),
            ],
            system_config: SystemConfig {
                max_position_size: 1000000, // 1M units
                trading_fee: 30, // 0.3%
                min_trade_amount: 100,
                max_leverage: 500, // 5x
            },
        }
    }

    pub fn register_chain(&mut self, chain_id: String, chain_type: ChainType) {
        let chain_info = ChainInfo {
            chain_id: chain_id.clone(),
            chain_type,
            status: ChainStatus::Active,
            last_heartbeat: 0, // Current timestamp
        };

        self.registered_chains.insert(chain_id, chain_info);
    }

    pub fn get_active_chains(&self, chain_type: ChainType) -> Vec<&ChainInfo> {
        self.registered_chains
            .values()
            .filter(|info| info.chain_type == chain_type && matches!(info.status, ChainStatus::Active))
            .collect()
    }

    pub fn update_heartbeat(&mut self, chain_id: &str, timestamp: u64) {
        if let Some(chain_info) = self.registered_chains.get_mut(chain_id) {
            chain_info.last_heartbeat = timestamp;
        }
    }

    pub fn deactivate_chain(&mut self, chain_id: &str) {
        if let Some(chain_info) = self.registered_chains.get_mut(chain_id) {
            chain_info.status = ChainStatus::Inactive;
        }
    }

    pub fn add_trading_pair(&mut self, pair: String) {
        if !self.trading_pairs.contains(&pair) {
            self.trading_pairs.push(pair);
        }
    }

    pub fn get_system_config(&self) -> &SystemConfig {
        &self.system_config
    }

    pub fn update_config(&mut self, config: SystemConfig) {
        self.system_config = config;
    }
}