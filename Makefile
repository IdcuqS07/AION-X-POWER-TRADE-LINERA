.PHONY: build check test clean example

# Build all crates
build:
	cargo build --release

# Check all crates
check:
	cargo check

# Run tests
test:
	cargo test

# Clean build artifacts
clean:
	cargo clean

# Run basic trading example
example:
	cargo run --example basic_trading

# Deploy to Linera network
deploy:
	./deploy/deploy.sh

# Initialize chains
init-chains:
	./deploy/init_chains.sh $(TRADING_APP_ID) $(WALLET_APP_ID)

# Test deployment
test-deploy:
	./deploy/test_deployment.sh $(TRADING_APP_ID) $(WALLET_APP_ID)

# Docker deployment
docker-deploy:
	docker-compose -f deploy/docker-compose.yml up --build

# Production deployment
prod-deploy:
	./production/scripts/deploy_production.sh

# Production health check
prod-health:
	docker-compose -f production/docker-compose.prod.yml exec ai-power-trade ./scripts/health_check.sh

# Production backup
prod-backup:
	./production/backup/backup_script.sh

# Production logs
prod-logs:
	docker-compose -f production/docker-compose.prod.yml logs -f

# Format code
fmt:
	cargo fmt

# Run clippy
clippy:
	cargo clippy

# Build documentation
docs:
	cargo doc --open

# Development workflow
dev: fmt clippy check test

# Production build
prod: clean build