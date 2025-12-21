---
name: Linera Testnet WASM Opcode Bug
about: Report WASM opcode limitation on Linera Conway Testnet
title: '[TESTNET] Invalid Wasm module: Unknown opcode 252 during Operation(0)'
labels: bug, testnet, wasm, infrastructure
assignees: ''
---

## 🐛 Bug Description

Complex smart contracts fail to deploy on Linera Conway Testnet with error `Invalid Wasm module: Unknown opcode 252 during Operation(0)`, while simple contracts deploy successfully.

## 📋 Environment

- **Linera CLI Version:** v0.15.6
- **OS:** macOS (darwin)
- **Rust Version:** 1.83+
- **Target:** wasm32-unknown-unknown
- **Testnet:** Conway Testnet

## 🔄 Reproduction

### ✅ Working: Simple Contract (Counter Example)

```bash
cd linera-protocol/examples/counter
cargo build --release --target wasm32-unknown-unknown
cd ../
linera project publish-and-create counter counter --json-argument "42"
```

**Result:** SUCCESS - Application ID: `5a4da146...`

### ❌ Failing: Complex Contract (AI Trading)

```bash
cd ai-trading
cargo build --release --target wasm32-unknown-unknown
linera project publish-and-create . ai_trading --json-argument "0"
```

**Result:** FAILED
```
INFO: Module published successfully!
ERROR: Failed to create application
Caused by: Invalid Wasm module: Unknown opcode 252 during Operation(0)
```

## 📊 Analysis

**Opcode 252 (0xFC)** is part of WASM miscellaneous operations extension:
- Memory operations (memory.init, memory.copy, memory.fill)
- Table operations (table.init, table.copy, table.fill)
- Reference types operations

The testnet WASM runtime appears to not support these extended opcodes.

## 🎯 Expected vs Actual

**Expected:** Complex contracts following official Linera SDK patterns should deploy successfully

**Actual:** Module publishes ✅ but application instantiation fails ❌ with opcode error

## 💡 Impact

- Blocks deployment of production-ready smart contracts
- Limits testnet to only simple contracts
- Forces developers to use simulation mode instead of real testnet

## 🔗 References

- Full bug report: [LINERA-TESTNET-BUG-REPORT.md](../../../LINERA-TESTNET-BUG-REPORT.md)
- Contract code: [ai-trading/](../../../ai-trading/)
- Testnet status: [LINERA-TESTNET-STATUS.md](../../../LINERA-TESTNET-STATUS.md)

## 🚀 Suggested Fix

1. Upgrade testnet WASM runtime to support full WASM MVP + extensions
2. Document supported opcodes clearly
3. Add validation during deployment with helpful error messages
4. Fix validator synchronization issues

---

**Repository:** https://github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA  
**Contact:** idchuq@gmail.com
