import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zvckwgfqmmlistpigxra.supabase.co',
  'sb_publishable_0T3FeLuCr34d28NuiVtJuQ_A-BZPmd6'
);

async function testWithoutTargetUrl() {
  const { data: prods } = await supabase.from('products').select('*').limit(1);
  const productId = prods[0].id;

  const { error } = await supabase.from('redemption_links').insert([{
    product_id: productId,
    custom_name: 'test-check-no-target',
    token: 'r_diag_' + Date.now(),
    usage_type: 'SINGLE',
    max_uses: 1,
    current_uses: 0,
    status: 'ACTIVE'
  }]);

  if (error) {
    console.log('Error without target_url:');
    console.log('Code:', error.code);
    console.log('Message:', error.message);
  } else {
    console.log('Insert without target_url succeeded!');
  }
}

testWithoutTargetUrl().catch(console.error);
