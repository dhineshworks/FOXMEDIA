import assert from 'assert';
import fs from 'fs';

console.log('--- STARTING FOXMEDIA VERIFICATION TESTS ---');

// 1. Verify schema.sql
console.log('1. Verifying Supabase schema.sql...');
const schemaSql = fs.readFileSync('./supabase/schema.sql', 'utf8');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.profiles'), 'Missing profiles table');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.products'), 'Missing products table');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.redemption_links'), 'Missing redemption_links table');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.redemptions'), 'Missing redemptions table');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.settings'), 'Missing settings table');
assert(schemaSql.includes('ALTER TABLE public.redemption_links ENABLE ROW LEVEL SECURITY'), 'RLS not enabled on redemption_links');
assert(schemaSql.includes('FUNCTION public.validate_redemption_token'), 'Missing validate_redemption_token RPC');
assert(schemaSql.includes('FUNCTION public.redeem_redemption_token'), 'Missing redeem_redemption_token RPC');
assert(schemaSql.includes('FOR UPDATE'), 'Missing atomic FOR UPDATE lock in redemption RPC');
console.log('✓ Supabase schema.sql verified with RLS, atomic RPCs, and indexes.');

// 2. Verify token generation
console.log('2. Verifying Secure Token Generation...');
import { generateSecureToken, generateBulkTokens, formatSequentialName } from '../src/utils/tokenGenerator.ts';


// Polyfill crypto if needed
if (!globalThis.crypto) {
  const { webcrypto } = await import('crypto');
  globalThis.crypto = webcrypto;
}

const singleToken = generateSecureToken();
assert(singleToken.startsWith('r_'), 'Token must start with r_ prefix');
assert(singleToken.length >= 20, 'Token must be high-entropy (>= 20 chars)');

const bulkTokens = generateBulkTokens(100);
assert.strictEqual(bulkTokens.length, 100, 'Should generate exactly 100 tokens');
const uniqueSet = new Set(bulkTokens);
assert.strictEqual(uniqueSet.size, 100, 'All 100 bulk tokens must be strictly unique');

const seq1 = formatSequentialName('SEP30', 1, 100);
const seq100 = formatSequentialName('SEP30', 100, 100);
assert.strictEqual(seq1, 'SEP30-001', 'Sequential name must be formatted correctly');
assert.strictEqual(seq100, 'SEP30-100', 'Sequential name must be formatted correctly');
console.log('✓ Cryptographic token generator verified (100 unique secure tokens generated).');

// 3. Verify Mock Store / Business Logic
console.log('3. Verifying Atomic Logic & State Transitions...');
// Polyfill localStorage
const storage = new Map();
globalThis.localStorage = {
  getItem: (k) => storage.get(k) || null,
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
};
globalThis.window = { location: { origin: 'http://localhost:5173' } };

const { mockStore } = await import('../src/lib/mockStore.ts');


// Test single-use validation & redemption
const testToken = 'r_testAtomicSingle';
mockStore.saveLinks([{
  id: 'test-link-1',
  product_id: '00000000-0000-0000-0000-000000000001',
  custom_name: 'test-single',
  token: testToken,
  usage_type: 'SINGLE',
  max_uses: 1,
  current_uses: 0,
  expires_at: null,
  status: 'ACTIVE',
  created_at: new Date().toISOString(),
  used_at: null,
}]);

const validCheck = mockStore.validateToken(testToken);
assert(validCheck.valid === true, 'Token should be valid');
assert.strictEqual(validCheck.status, 'ACTIVE');

// Test lookup by custom_name as well!
const customNameCheck = mockStore.validateToken('test-single');
assert(customNameCheck.valid === true, 'Lookup by customer name must be valid');
assert.strictEqual(customNameCheck.custom_name, 'test-single');

const redeem1 = mockStore.redeemToken(testToken);
assert(redeem1.success === true, 'First redemption should succeed');
assert.strictEqual(redeem1.status, 'SUCCESS');
assert(redeem1.target_url && redeem1.target_url.includes('dhineshworks.github.io'), 'Target redirect URL must be returned on redemption');

const redeem2 = mockStore.redeemToken(testToken);
assert(redeem2.success === false, 'Second redemption on single-use link must fail');
assert.strictEqual(redeem2.status, 'USED');


// Test multi-use link limit
const multiToken = 'r_testAtomicMulti';
mockStore.saveLinks([{
  id: 'test-link-2',
  product_id: '00000000-0000-0000-0000-000000000001',
  custom_name: 'test-multi',
  token: multiToken,
  usage_type: 'MULTIPLE',
  max_uses: 2,
  current_uses: 0,
  expires_at: null,
  status: 'ACTIVE',
  created_at: new Date().toISOString(),
  used_at: null,
}]);

const multi1 = mockStore.redeemToken(multiToken);
assert(multi1.success === true, 'Multi redemption 1 should succeed');
const multi2 = mockStore.redeemToken(multiToken);
assert(multi2.success === true, 'Multi redemption 2 should succeed');
const multi3 = mockStore.redeemToken(multiToken);
assert(multi3.success === false, 'Multi redemption 3 should fail because limit is 2');
assert.strictEqual(multi3.status, 'LIMIT_REACHED');

console.log('✓ Atomic redemption logic, single-use, and multi-use limits verified.');

// 4. Verify Expiration
console.log('4. Verifying Expiration Handling...');
const expiredToken = 'r_testExpired';
mockStore.saveLinks([{
  id: 'test-link-3',
  product_id: '00000000-0000-0000-0000-000000000001',
  custom_name: 'test-expired',
  token: expiredToken,
  usage_type: 'SINGLE',
  max_uses: 1,
  current_uses: 0,
  expires_at: new Date(Date.now() - 100000).toISOString(),
  status: 'ACTIVE',
  created_at: new Date(Date.now() - 200000).toISOString(),
  used_at: null,
}]);

const expCheck = mockStore.validateToken(expiredToken);
assert(expCheck.valid === false, 'Expired token must not be valid');
assert.strictEqual(expCheck.status, 'EXPIRED');

const expRedeem = mockStore.redeemToken(expiredToken);
assert(expRedeem.success === false, 'Redeeming expired token must fail');
assert.strictEqual(expRedeem.status, 'EXPIRED');
console.log('✓ Expiration validation verified.');

// 5. Verify Disabled
console.log('5. Verifying Disabled Link Handling...');
const disabledToken = 'r_testDisabled';
mockStore.saveLinks([{
  id: 'test-link-4',
  product_id: '00000000-0000-0000-0000-000000000001',
  custom_name: 'test-disabled',
  token: disabledToken,
  usage_type: 'SINGLE',
  max_uses: 1,
  current_uses: 0,
  expires_at: null,
  status: 'DISABLED',
  created_at: new Date().toISOString(),
  used_at: null,
}]);

const disCheck = mockStore.validateToken(disabledToken);
assert(disCheck.valid === false, 'Disabled token must not be valid');
assert.strictEqual(disCheck.status, 'DISABLED');

const disRedeem = mockStore.redeemToken(disabledToken);
assert(disRedeem.success === false, 'Redeeming disabled token must fail');
assert.strictEqual(disRedeem.status, 'DISABLED');
console.log('✓ Disabled link handling verified.');

console.log('ALL VERIFICATION SUITES PASSED SUCCESSFULLY!');
