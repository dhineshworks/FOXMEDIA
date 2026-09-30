/**
 * Cryptographically secure random token generator for redemption URLs.
 * Format: r_<20 alphanumeric characters>
 * Example: r_8Fj29KxP7mQ2Ls91
 * 
 * High-entropy random generation using Web Crypto API.
 */
export function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 20;
  const array = new Uint8Array(length);
  globalThis.crypto.getRandomValues(array);

  
  let token = 'r_';
  for (let i = 0; i < length; i++) {
    token += chars[array[i] % chars.length];
  }
  return token;
}

/**
 * Generates an array of secure tokens for bulk link creation
 */
export function generateBulkTokens(count: number): string[] {
  const tokens = new Set<string>();
  while (tokens.size < count) {
    tokens.add(generateSecureToken());
  }
  return Array.from(tokens);
}

/**
 * Formats a sequential custom name prefix
 * e.g. prefix="SEP30", index=1, total=100 -> "SEP30-001"
 */
export function formatSequentialName(prefix: string, index: number, total: number): string {
  const cleanPrefix = prefix.trim() || 'link';
  if (total <= 1) {
    return cleanPrefix;
  }
  const padLength = Math.max(3, String(total).length);
  const paddedIndex = String(index).padStart(padLength, '0');
  return `${cleanPrefix}-${paddedIndex}`;
}
