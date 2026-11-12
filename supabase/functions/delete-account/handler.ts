import { z } from 'npm:zod@3';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

export interface DeletionServices {
  authenticate: (token: string) => Promise<string | null>;
  deleteOwnedData: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export function createHandler(services: DeletionServices) {
  return async (req: Request): Promise<Response> => {
    const reply = (status: number, body: object) => new Response(JSON.stringify(body), {
      status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
    if (req.method !== 'POST') return reply(405, { error: 'Method not allowed' });
    const match = req.headers.get('Authorization')?.match(/^Bearer (.+)$/i);
    if (!match) return reply(401, { error: 'Sign in to delete your account' });
    try {
      const userId = await services.authenticate(match[1]);
      if (!userId) return reply(401, { error: 'Invalid session' });
      const body = await req.json().catch(() => null);
      if (!z.object({ confirmation: z.literal('DELETE') }).strict().safeParse(body).success) {
        return reply(400, { error: 'Confirm deletion by typing DELETE' });
      }
      await services.deleteOwnedData(userId);
      await services.deleteUser(userId);
      return reply(200, { deleted: true });
    } catch {
      return reply(500, { error: 'Account deletion failed. Please retry.' });
    }
  };
}