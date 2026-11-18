# @withsilex/x402-mcp

[![mcptry](https://mcptry.com/badge/com.withsilex/x402-mcp)](https://mcptry.com/servers/com.withsilex/x402-mcp)

Official **Model Context Protocol (MCP)** server connecting **Claude Desktop, Cursor, Windsurf, Cline, and autonomous AI agents** to the **With Silex HTTP 402 Permanent Data Encyclopedia** (`https://withsilex.com/directory`).

- **48 Live Autonomous Subdomains + 5 Cross-Domain Alpha Syntheses** updated every 15 minutes (SEC EDGAR, DHS CISA Zero-Day CVEs, USAspending Federal Contracts, NOAA Aviation METARs, ERCOT Grid, NIH ClinicalTrials.gov, FDA Recalls, USGS Seismic, arXiv, Kraken L1/L2 Orderbooks).
- **Hyper-Specific Keyword & Schema Field Search (`<15ms`):** Query exact phrases, tickers, CVE IDs, airport ICAOs, or `key:field` filters and unlock single snapshots (`$0.001+`) or 25%-discounted Whole-Keyword JSONL Bundles.
- **Zero-Fee ~350ms Settlement:** Powered natively by **Nano (`XNO`)** on-chain block proofs (`X-Payment: <64_HEX_HASH>`), with built-in Nanswap cross-chain instructions for agents starting with USDC, SOL, ETH, or BTC.

## Quick Install (Claude Desktop / Cursor / Windsurf)

```json
{
  "mcpServers": {
    "withsilex-x402": {
      "command": "npx",
      "args": ["-y", "@withsilex/x402-mcp"],
      "env": {
        "NANO_PRIVATE_KEY": "OPTIONAL_64_HEX_LOCAL_BURNER_KEY",
        "SILEX_MAX_AUTO_USD": "0.10"
      }
    }
  }
}
```

## Included MCP Tools
1. `silex_hyper_search` - Search all permanent paywalls by keyword, exact phrase, or `key:field` operator.
2. `silex_suggest_entities` - Instant autocomplete of indexed CVEs, tickers, ICAOs, NCTs, and JSON schema keys.
3. `silex_live_pulse` - Fetch all 48 live subdomain feeds, 5 Cross-Domain Synthesis drops, and the 15m mint countdown.
4. `silex_inspect_402_challenge` - Inspect any HTTP 402 URL, Free Sample Record #1, Nano `payTo` address, `amountRaw`, and Nanswap USDC/SOL -> XNO burner top-up endpoints.
5. `silex_unlock_with_tx_hash` - Submit a 64-hex Nano send block hash via `X-Payment` to unlock any single drop, synthesis, 24h stream, or Whole-Keyword JSONL bundle.
6. `silex_auto_pay_and_unlock` - Sign, broadcast, and unlock an HTTP 402 resource in one call using your local `NANO_PRIVATE_KEY` (strictly non-custodial; capped by `SILEX_MAX_AUTO_USD`).
