#!/usr/bin/env node
import { startStdioMcp } from "../index.js";
startStdioMcp().catch((err) => { console.error(err); process.exit(1); });
