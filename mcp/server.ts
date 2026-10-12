// Lets an AI agent use PingPal. Start it with: npm run mcp
import { readFileSync } from 'node:fs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({ name: 'our-product', version: '0.1.0' });

server.registerTool(
  'product_statement',
  { description: 'Returns the PingPal product statement from docs/PRODUCT.md', inputSchema: {} },
  async () => ({ content: [{ type: 'text', text: readFileSync('docs/PRODUCT.md', 'utf8') }] }),
);

// Searches public player profiles (only public fields) by city, sport or skill level.
server.registerTool(
  'search_items',
  { description: 'Search PingPal players by city, sport or skill level', inputSchema: { query: z.string() } },
  async ({ query }) => {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return { content: [{ type: 'text', text: 'Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env' }] };
    const q = encodeURIComponent(`*${query}*`);
    const res = await fetch(
      `${url}/rest/v1/profiles?select=display_name,city,sport,skill_level&or=(city.ilike.${q},sport.ilike.${q},skill_level.ilike.${q})`,
      { headers: { apikey: key } },
    );
    return { content: [{ type: 'text', text: await res.text() }] };
  },
);

await server.connect(new StdioServerTransport());
