import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zvckwgfqmmlistpigxra.supabase.co',
  'sb_publishable_0T3FeLuCr34d28NuiVtJuQ_A-BZPmd6'
);

async function check() {
  const { data: products, error: pErr } = await supabase.from('products').select('*');
  console.log('Products in DB:', products?.length, pErr ? `Error: ${pErr.message}` : '');
}

check();
