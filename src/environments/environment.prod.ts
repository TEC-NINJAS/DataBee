import { supabaseConfig } from './supabase.config';

export const environment = {
  production: true,
  supabaseUrl: supabaseConfig.url,
  supabasePublishableKey: supabaseConfig.publishableKey,
};
