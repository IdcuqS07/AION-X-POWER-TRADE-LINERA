FROM rust:1.86.0

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Install wasm32 target
RUN rustup target add wasm32-unknown-unknown

# Set working directory
WORKDIR /build

# Copy project files
COPY . .

# Build project
RUN cargo build --release --target wasm32-unknown-unknown

# Expose ports
EXPOSE 8080 8081 8082

# Run script
CMD ["./deploy-docker.sh"]