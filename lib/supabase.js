import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase project credentials
// You can find these in your Supabase project settings
const SUPABASE_URL = 'https://wqefcyeislvrgqsxouzn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZWZjeWVpc2x2cmdxc3hvdXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODAwODEsImV4cCI6MjA4MDI1NjA4MX0.ZN1Wfkth7dGfi3udAEZ_0gfEv8mrCv8LgOHsBBs4xRk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
