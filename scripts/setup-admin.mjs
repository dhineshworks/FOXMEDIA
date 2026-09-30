import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zvckwgfqmmlistpigxra.supabase.co';
const supabaseAnonKey = 'sb_publishable_0T3FeLuCr34d28NuiVtJuQ_A-BZPmd6';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const email = 'rameshtn007@gmail.com';
  const password = 'Valliramesh@2026';

  console.log(`Attempting to sign in or sign up ${email}...`);

  // Try signing in first
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!signInError && signInData.user) {
    console.log('✓ Successfully signed in! User ID:', signInData.user.id);
    return;
  }

  console.log('Sign in failed or user does not exist yet. Signing up user...');
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    console.error('Sign up error:', signUpError.message);
  } else {
    console.log('✓ User sign up successful! User ID:', signUpData.user?.id);
    console.log('Email confirmed status:', signUpData.user?.confirmed_at ? 'Confirmed' : 'Confirmation email sent (or check Auto Confirm in dashboard)');
  }
}

main().catch(console.error);
