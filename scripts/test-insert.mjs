import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zvckwgfqmmlistpigxra.supabase.co',
  'sb_publishable_0T3FeLuCr34d28NuiVtJuQ_A-BZPmd6'
);

async function testInsert() {
  console.log('Testing what columns exist on redemption_links...');
  
  // Fetch products
  const { data: prods, error: pErr } = await supabase.from('products').select('*').limit(1);
  if (pErr || !prods || prods.length === 0) {
    console.error('Error fetching products:', pErr?.message);
    return;
  }
  const productId = prods[0].id;
  console.log('Found product ID:', productId);

  // Attempt insert anonymously to check what error occurs
  const { data, error } = await supabase.from('redemption_links').insert([{
    product_id: productId,
    custom_name: 'test-check',
    token: 'r_test_diag_' + Date.now(),
    target_url: 'https://commerce.adobe.com',
    usage_type: 'SINGLE',
    max_uses: 1,
    current_uses: 0,
    status: 'ACTIVE'
  }]);

  if (error) {
    console.log('Insert error code:', error.code);
    console.log('Insert error message:', error.message);
    console.log('Insert error details:', error.details);
    console.log('Insert error hint:', error.hint);
  } else {
    console.log('Insert succeeded anonymously?! (RLS check)');
  }
}

testInsert().catch(console.error);
