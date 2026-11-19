import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as nanocurrency from "nanocurrency";
import { z } from "zod";

const BASE_URL = process.env.SILEX_BASE_URL || "https://withsilex.com";
const NANO_RPCS = ["https://rpc.nano.to", "https://rainstorm.city/api"];

async function rpcCall(bodyObj) {
  for (const rpc of NANO_RPCS) {
    try {
      const r = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyObj)
      });
      if (!r.ok) continue;
      const j = await r.json();
      if (j && !j.error) return j;
    } catch (_) {}
  }
  throw new Error("All public Nano RPC endpoints failed to respond.");
}

export function createSilexMcpServer() {
  const server = new McpServer({
    name: "withsilex-x402-mcp",
    version: "1.8.1"
  });

  // Tool 1: Hyper-Specific Keyword & Field Search
  server.tool(
    "silex_hyper_search",
    "Search With Silex permanent HTTP 402 data encyclopedia by keyword, phrase, CVE, ticker, ICAO, or operators (key:, domain:, sector:, max:, -exclude). Returns matched key:value proofs and 25%-off bulk topicPack URLs.",
    {
      query: z.string().describe("Search query, e.g. Microsoft, CVE-2026, XNO, KBOS, or key:cve_id"),
      handle: z.string().optional().describe("Optional subdomain filter, e.g. sec-filings or ciso-intel"),
      sector: z.string().optional().describe("Optional sector filter, e.g. finance, govtech, grid, biomed"),
      limit: z.number().min(1).max(50).optional().default(12)
    },
    async ({ query, handle, sector, limit }) => {
      const u = new URL("/api/x402/search", BASE_URL);
      u.searchParams.set("q", query || "");
      if (handle) u.searchParams.set("handle", handle);
      if (sector) u.searchParams.set("sector", sector);
      u.searchParams.set("limit", String(limit || 12));
      const r = await fetch(u.toString(), { headers: { Accept: "application/json" } });
      const data = await r.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Tool 2: Live Entity & Schema Key Autocomplete
  server.tool(
    "silex_suggest_entities",
    "Autocomplete verified entities (tickers, CVEs, ICAOs, NCTs, solicitations) and JSON schema keys currently indexed in With Silex.",
    { prefix: z.string().min(1).describe("Prefix to autocomplete, e.g. cve, nvda, kbos, xno") },
    async ({ prefix }) => {
      const r = await fetch(BASE_URL + "/api/x402/suggest?q=" + encodeURIComponent(prefix));
      const data = await r.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Tool 3: Live 15-Minute Pulse & Cross-Domain Synthesis Index
  server.tool(
    "silex_live_pulse",
    "List all 48 live With Silex telemetry subdomains, 5 Cross-Subdomain Alpha Synthesis drops ($0.005), D1 archive totals, and seconds until next 15-minute mint.",
    {},
    async () => {
      const r = await fetch(BASE_URL + "/api/x402/pulse", { headers: { Accept: "application/json" } });
      const data = await r.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // Tool 4: Inspect HTTP 402 Challenge & Free Sample Record #1
  server.tool(
    "silex_inspect_402_challenge",
    "Inspect an HTTP 402 paywall URL (single drop, /synthesis/*, /bundle/24h, or /topics/* bulk pack) to read its Free Sample Record #1, exact Nano payTo address, amountRaw, and Nanswap cross-chain bridge instructions.",
    { url: z.string().url().describe("Target With Silex URL to inspect") },
    async ({ url }) => {
      const r = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "WithSilex-MCP/1.8.1" } });
      const txt = await r.text();
      return { content: [{ type: "text", text: JSON.stringify({ httpStatus: r.status, challenge: JSON.parse(txt) }, null, 2) }] };
    }
  );

  // Tool 5: Unlock Any Paywall or Whole-Keyword Bundle With Nano Block Hash
  server.tool(
    "silex_unlock_with_tx_hash",
    "Submit a 64-character hexadecimal Nano (XNO) mainnet send block hash in the X-Payment header to unlock any single drop, cross-domain synthesis, 24h JSONL stream, or Whole-Keyword Pack.",
    {
      url: z.string().url().describe("Target With Silex URL to unlock"),
      txHash: z.string().length(64).describe("64-char hex Nano mainnet send block hash")
    },
    async ({ url, txHash }) => {
      const r = await fetch(url, {
        headers: {
          Accept: "application/json",
          "X-Payment": txHash.trim().toUpperCase(),
          "User-Agent": "WithSilex-MCP/1.8.1"
        }
      });
      const body = await r.text();
      return { content: [{ type: "text", text: body }] };
    }
  );

  // Tool 6: Autonomous 1-Call Local Burner Sign, Broadcast & HTTP 402 Unlock
  server.tool(
    "silex_auto_pay_and_unlock",
    "Autonomously pay an HTTP 402 challenge from your local NANO_PRIVATE_KEY env variable and return the unlocked dataset in ~350ms (enforces SILEX_MAX_AUTO_USD spend cap).",
    {
      url: z.string().url().describe("Target With Silex HTTP 402 URL to buy and unlock")
    },
    async ({ url }) => {
      const privKey = (process.env.NANO_PRIVATE_KEY || "").trim();
      if (!/^[0-9a-fA-F]{64}$/.test(privKey)) {
        return {
          content: [{
            type: "text",
            text: "NANO_PRIVATE_KEY (64-hex local burner private key) is not configured in MCP env. Generate a local keypair and fund $1-$2 of XNO (or swap USDC/SOL -> XNO via https://nanswap.com/api), or pay manually and call silex_unlock_with_tx_hash."
          }]
        };
      }
      const maxUsd = parseFloat(process.env.SILEX_MAX_AUTO_USD || "0.10") || 0.10;
      const chRes = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "WithSilex-MCP/1.8.1" } });
      if (chRes.status === 200) return { content: [{ type: "text", text: await chRes.text() }] };
      if (chRes.status !== 402) throw new Error("Expected HTTP 402 challenge, received HTTP " + chRes.status);

      const ch = await chRes.json();
      const priceUsd = Number(ch.priceUsd || 0);
      if (priceUsd > maxUsd) {
        throw new Error("Vault price $" + priceUsd + " exceeds SILEX_MAX_AUTO_USD safety cap ($" + maxUsd + ").");
      }

      const pubKey = nanocurrency.derivePublicKey(privKey);
      const myAddress = nanocurrency.deriveAddress(pubKey, { useNanoPrefix: true });
      const acct = await rpcCall({ action: "account_info", account: myAddress, representative: "true" });
      const curBal = BigInt(acct.balance || "0");
      const sendRaw = BigInt(ch.amountRaw);
      if (curBal < sendRaw) {
        throw new Error("Insufficient XNO in local burner " + myAddress + " (have " + curBal + " raw, need " + sendRaw + " raw).");
      }
      const newBal = (curBal - sendRaw).toString();
      const workRes = await rpcCall({ action: "work_generate", hash: acct.frontier });
      const blk = nanocurrency.createBlock(privKey, {
        work: workRes.work,
        previous: acct.frontier,
        representative: acct.representative,
        balance: newBal,
        link: ch.payTo
      });
      const proc = await rpcCall({ action: "process", json_block: "true", subtype: "send", block: blk.block });
      const txHash = proc.hash || blk.hash;

      await new Promise((r) => setTimeout(r, 450));
      const unlockRes = await fetch(url, {
        headers: { Accept: "application/json", "X-Payment": txHash, "User-Agent": "WithSilex-MCP/1.8.1" }
      });
      return { content: [{ type: "text", text: await unlockRes.text() }] };
    }
  );

  return server;
}

export async function startStdioMcp() {
  const server = createSilexMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
