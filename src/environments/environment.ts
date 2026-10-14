import { supabaseConfig } from './supabase.config';

export const environment = {
  production: false,
  supabaseUrl: supabaseConfig.url,
  supabasePublishableKey: supabaseConfig.publishableKey,
};
