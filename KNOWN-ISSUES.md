# Known Issues

This document tracks known issues and limitations in the AI Power Trade Linera platform.

## 🔴 Critical Issues

### 1. Linera Conway Testnet WASM Opcode Limitation

**Status:** 🔴 Open - External (Testnet Infrastructure)  
**Severity:** High  
**Reported:** December 22, 2025  
**Affects:** Smart Contract Deployment

**Description:**  
Complex smart contracts cannot be deployed to Linera Conway Testnet due to WASM opcode 252 not being supported by the testnet runtime.

**Error Message:**
```
Invalid Wasm module: Unknown opcode 252 during Operation(0)
```

**Impact:**
- ❌ Cannot deploy AI Trading smart contract to testnet
- ✅ Simple contracts (like counter) work fine
- ✅ All other features work in simulation mode

**Workaround:**  
Platform operates in **simulation mode** with full functionality:
- Wallet integration via Linera WASM SDK
- Simulated balance and transactions
- All UI features operational
- Smart contract code ready for deployment when testnet is stable

**References:**
- [Full Bug Report](./LINERA-TESTNET-BUG-REPORT.md)
- [Testnet Status](./LINERA-TESTNET-STATUS.md)
- [GitHub Issue Template](./.github/ISSUE_TEMPLATE/linera-testnet-bug.md)

**Next Steps:**
- Monitor Linera testnet updates
- Deploy to mainnet when available
- Consider local devnet for testing

---

## 🟡 Minor Issues

### 2. Faucet Cooldown Status After Wallet Import

**Status:** ✅ Fixed  
**Severity:** Low  
**Fixed:** December 22, 2025 (commit cb65da6)

**Description:**  
Cooldown status was not showing after importing a wallet that had previously claimed faucet tokens.

**Root Cause:**  
Wallet address format inconsistency (uppercase vs lowercase) in localStorage keys.

**Solution:**  
- Normalized all addresses to lowercase
- Added 300ms delay before updating faucet status
- Enhanced logging for debugging

**References:**
- [Fix Documentation](./FAUCET-COOLDOWN-FIX.md)

---

## 🟢 Resolved Issues

### 3. Portfolio Balance Not Showing After Wallet Restore

**Status:** ✅ Fixed  
**Fixed:** December 21, 2025 (commit ed97138)

**Description:**  
Portfolio balance showed $0 after wallet disconnect/reconnect cycle.

**Solution:**
- Added `updatePortfolioStats()` call in `connectPlatform()`
- Added delayed portfolio refresh after wallet restore
- Fixed faucet claim UI stuck on "Processing..."

**References:**
- [Portfolio Balance Fix](./PORTFOLIO-BALANCE-FIX.md)

---

## 📊 Issue Statistics

| Status | Count |
|--------|-------|
| 🔴 Open (Critical) | 1 |
| 🟡 Open (Minor) | 0 |
| ✅ Fixed | 2 |
| **Total** | **3** |

---

## 🐛 Reporting New Issues

Found a bug? Please report it!

### For Code Issues (Our Repository)
1. Check [existing issues](https://github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA/issues)
2. Create new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

### For Linera Testnet Issues (External)
1. Document in this repository first
2. Report to Linera team:
   - [Linera GitHub](https://github.com/linera-io/linera-protocol)
   - [Linera Discord](https://discord.gg/linera)
   - [Linera Documentation](https://linera.dev)

---

## 📞 Contact

- **GitHub:** [@IdcuqS07](https://github.com/IdcuqS07)
- **Email:** idchuq@gmail.com
- **Repository:** [AION-X-POWER-TRADE-LINERA](https://github.com/IdcuqS07/AION-X-POWER-TRADE-LINERA)

---

**Last Updated:** December 22, 2025
