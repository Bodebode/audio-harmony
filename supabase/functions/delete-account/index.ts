import { createClient } from 'npm:@supabase/supabase-js@2';
import { createHandler } from './handler.ts';

const url = Deno.env.get('SUPABASE_URL');
const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
if (!url || !key) throw new Error('Account deletion is not configured');
const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

Deno.serve(createHandler({
  authenticate: async token => {
    const { data, error } = await admin.auth.getUser(token);
    return error ? null : data.user?.id ?? null;
  },
  deleteOwnedData: async userId => {
    // Every upload is stored beneath the validated user's UUID folder.
    while (true) {
      const { data, error } = await admin.storage.from('avatars').list(userId, { limit: 100 });
      if (error) throw error;
      if (!data?.length) break;
      const paths = data.map(file => `${userId}/${file.name}`);
      const { error: removeError } = await admin.storage.from('avatars').remove(paths);
      if (removeError) throw removeError;
    }
    // profiles, support_submissions and user_payment_info cascade on Auth deletion.
    // Keep their removal atomic with deletion of the account itself.
  },
  deleteUser: async userId => {
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) throw error;
  },
}));