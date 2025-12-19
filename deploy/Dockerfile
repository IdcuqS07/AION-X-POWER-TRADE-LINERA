FROM rust:1.80

# Install Linera CLI
RUN cargo install linera-cli --git https://github.com/linera-io/linera-protocol.git

# Install wasm32 target
RUN rustup target add wasm32-unknown-unknown

WORKDIR /app

# Copy source code
COPY . .

# Build applications
RUN cargo build --release --target wasm32-unknown-unknown

# Make deploy script executable
RUN chmod +x deploy/deploy.sh

CMD ["./deploy/deploy.sh"]