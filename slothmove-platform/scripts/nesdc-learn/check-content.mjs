#!/usr/bin/env node
// Moved to scripts/learn/check-content.mjs (shared by all learn courses).
process.argv[2] = process.argv[2] || 'nesdc';
await import('../learn/check-content.mjs');
