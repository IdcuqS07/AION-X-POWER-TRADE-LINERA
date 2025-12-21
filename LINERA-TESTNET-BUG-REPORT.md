# 🐛 Bug Report: Linera Conway Testnet WASM Opcode Limitation

**Issue Type:** Testnet Infrastructure Limitation  
**Severity:** High  
**Status:** Open  
**Reported:** December 22, 2025  
**Reporter:** AION-X (@IdcuqS07)  
**Linera Version:** v0.15.6

---

## 📋 Summary

Complex smart contracts fail to deploy on Linera Conway Testnet with error `Invalid Wasm module: Unknown opcode 252 during Operation(0)`, while simple contracts (like the official counter example) deploy successfully.

## 🔍 Description

When attempting to deploy a smart contract with advanced features to the Linera Conway Testnet, the module publishes successfully but application instantiation fails with a WASM opcode error. This suggests the testnet runtime has limitations on which WASM opcodes are supported.

## 🧪 Reproduction Steps

### Environment
- **OS:** macOS (darwin)
- **Linera CLI:** v0.15.6
- **Rust:** 1.83+ with wasm32-unknown-unknown target
- **Testnet:** Conway Testnet (multiple validators)

### Test Case 1: Simple Contract (✅ SUCCESS)

**Contract:** Official Linera Counter Example

```bash
cd linera-protocol/examples/counter
cargo build --release --target wasm32-unknown-unknown
cd ../
linera project publish-and-create counter counter --json-argument "42"
```

**Result:** ✅ SUCCESS
```
Application published successfully!
Application ID: 5a4da146be1ed8524f87b8d66de32ed69254dc407df3830816c46682070d2c0c
```

### Test Case 2: Complex Contract (❌ FAILED)

**Contract:** AI Trading Contract (similar structure to counter, but with additional state management)

**Contract Structure:**
```rust
pub struct TradingContract {
    state: TradingState,
    runtime: ContractRuntime<Self>,
}

impl Contract for TradingContract {
    type Message = ();
    type InstantiationArgument = u64;
    type Parameters = ();
    type EventValue = ();
    
    async fn instantiate(&mut self, value: u64) {
        self.runtime.application_parameters();
        self.state.trade_count.set(value);
    }
    // ... other methods
}
```

**Deployment:**
```bash
cd ai-trading
cargo build --release --target wasm32-unknown-unknown
linera project publish-and-create . ai_trading --json-argument "0"
```

**Result:** ❌ FAILED
```
INFO linera_client::client_context: Module published successfully!
ERROR linera: Error is Failed to create application

Caused by:
    chain client error: Local node operation failed: Worker operation failed: 
    Execution error: Invalid Wasm module: Unknown opcode 252 during Operation(0)
```

## 📊 Error Analysis

### Error Breakdown

1. **Module Publishing:** ✅ SUCCESS
   - WASM bytecode successfully uploaded to testnet
   - Validators accept and store the bytecode

2. **Application Instantiation:** ❌ FAILED
   - Runtime attempts to execute WASM during `instantiate()`
   - Encounters unsupported opcode 252
   - Execution aborts with error

### WASM Opcode 252

Opcode 252 (0xFC) is part of the WASM **miscellaneous operations** extension, which includes:
- Memory operations (memory.init, memory.copy, memory.fill)
- Table operations (table.init, table.copy, table.fill)
- Reference types operations

This suggests the testnet WASM runtime may not support the full WASM MVP + extensions specification.

## 🔧 Technical Details

### Contract Comparison

| Feature | Counter (✅) | AI Trading (❌) |
|---------|-------------|-----------------|
| State Management | Simple (single u64) | Complex (RegisterView) |
| Dependencies | Minimal | linera-sdk full features |
| WASM Size | ~123 KB contract, ~1.1 MB service | ~168 KB contract, ~161 KB service |
| Opcode Usage | Basic | Extended (including 252) |

### Testnet Validator Issues Observed

During deployment, multiple validators showed synchronization issues:

```
WARN: Chain is expecting a next block at height X but the given block is at height Y
WARN: Blobs not found: [BlobId { blob_type: ChainDescription, ... }]
WARN: Events not found: [EventId { chain_id: ..., index: X }]
```

**Affected Validators:**
- conway-testnet.dzdaic.com
- conway1.linera.blockhunters.services
- testnet-linera.lavenderfive.com
- linera.blockscope.net
- linera-testnet.brightlystake.com
- linera.nodes.guru
- And 10+ more validators

## 💡 Workaround

Currently using **simulation mode** in production:
- Full wallet integration with Linera WASM SDK
- Simulated balance and transaction tracking
- All UI features functional
- Smart contract code ready for deployment when testnet is stable

## 📝 Expected Behavior

Complex smart contracts following the official Linera SDK patterns should deploy successfully to the testnet, just like simple contracts do.

## 🎯 Actual Behavior

Complex contracts fail with `Unknown opcode 252` error during application instantiation, despite:
- Following official documentation
- Using correct `InstantiationArgument` pattern
- Successful module publishing
- Valid WASM bytecode

## 🔗 Related Documentation

- [Linera Contract Trait](https://docs.rs/linera-sdk/latest/linera_sdk/trait.Contract.html)
- [Linera Hello World Guide](https://linera.dev/developers/getting_started/hello_linera.html)
- [Linera Application Lifecycle](https://linera.dev/developers/core_concepts/applications.html)

## 📦 Artifacts

### Working Contract (Counter)
- Location: `linera-protocol/examples/counter/`
- Application ID: `5a4da146be1ed8524f87b8d66de32ed69254dc407df3830816c46682070d2c0c`

### Failing Contract (AI Trading)
- Location: `ai-trading/`
- WASM Files: Available in `target/wasm32-unknown-unknown/release/`
- Contract: `ai_trading_contract.wasm` (168 KB)
- Service: `ai_trading_service.wasm` (161 KB)

## 🚀 Suggested Solutions

1. **Upgrade Testnet WASM Runtime**
   - Support full WASM MVP + extensions
   - Enable opcode 252 and related operations

2. **Document Supported Opcodes**
   - Provide clear list of supported WASM opcodes
   - Add validation during `linera project publish-and-create`
   - Fail early with helpful error message

3. **Improve Error Messages**
   - Current: "Unknown opcode 252 during Operation(0)"
   - Better: "WASM opcode 0xFC (252) not supported on testnet. Please simplify contract or wait for mainnet."

4. **Testnet Validator Synchronization**
   - Fix block height mismatches across validators
   - Improve blob storage consistency
   - Ensure event propagation works correctly

## 📞 Contact

- **GitHub:** [@IdcuqS07](https://github.com/IdcuqS07)
- **Repository:** [AION-X-POWER-TRADE-LINERA](https://github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA)
- **Email:** idchuq@gmail.com

## 🏷️ Labels

`bug` `testnet` `wasm` `deployment` `infrastructure` `high-priority`

---

**Note:** This is not a code issue. Our smart contract follows all official Linera patterns and best practices. The issue is with the testnet infrastructure's WASM runtime limitations.
