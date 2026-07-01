/* Client-side UI config that isn't part of the API payloads. */

/** Avatar background palette — cycled by list index. */
export const AVATAR_PALETTE = [
  '#6449FF',
  '#50AF95',
  '#F7931A',
  '#627EEA',
  '#14B8C4',
  '#9945FF',
  '#F3BA2F',
  '#2775CA',
  '#E0529C',
  '#3FB950',
  '#FF7A45',
  '#7C6CFF',
  '#0EA5A5',
  '#C2410C',
];

export const ASSET_COLORS: Record<string, string> = {
  USDT: '#50AF95',
  USDC: '#2775CA',
  ETH: '#627EEA',
  BTC: '#F7931A',
  BNB: '#F3BA2F',
  SOL: '#9945FF',
};

/* Filter option lists for the payments page (mirror the API enums). */
export const ASSET_OPTIONS = ['any', 'USDT', 'USDC', 'ETH', 'BTC', 'BNB', 'SOL'];
export const NETWORK_OPTIONS = [
  'any',
  'Ethereum',
  'Arbitrum',
  'Optimism',
  'Polygon',
  'BSC',
  'Tron',
  'Bitcoin',
  'Solana',
];
export const STATUS_OPTIONS = ['any', 'completed', 'pending', 'failed'];

/**
 * Block-explorer transaction URL prefixes, keyed by the lowercase network name
 * the API returns (e.g. "ethereum"). The payout tx hash is appended to the prefix.
 */
export const EXPLORER_TX_URL: Record<string, string> = {
  ethereum: 'https://etherscan.io/tx/',
  arbitrum: 'https://arbiscan.io/tx/',
  optimism: 'https://optimistic.etherscan.io/tx/',
  polygon: 'https://polygonscan.com/tx/',
  bsc: 'https://bscscan.com/tx/',
  tron: 'https://tronscan.org/#/transaction/',
  bitcoin: 'https://mempool.space/tx/',
  solana: 'https://solscan.io/tx/',
};

/** Explorer link for a payout tx, or null when the network has no known explorer. */
export function explorerTxUrl(
  network: string | null | undefined,
  hash: string,
): string | null {
  const base = network ? EXPLORER_TX_URL[network.toLowerCase()] : undefined;
  return base ? base + hash : null;
}

/** Avatar color for the item at `index` in a list. */
export function avatarColor(index: number): string {
  return AVATAR_PALETTE[index % AVATAR_PALETTE.length];
}

/** First letter (lowercased, skipping a leading "@") or a fallback. */
export function initialOf(value: string | null | undefined, fallback = '?'): string {
  if (!value) return fallback;
  const trimmed = value.startsWith('@') ? value.slice(1) : value;
  return (trimmed[0] || fallback).toLowerCase();
}

/** Asset dot color, or a neutral grey for unknown/missing assets. */
export function assetColor(asset: string | null | undefined): string {
  return (asset && ASSET_COLORS[asset]) || '#9a9ab0';
}
