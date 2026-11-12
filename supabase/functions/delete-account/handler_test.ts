import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { createHandler } from './handler.ts';

const request = (body: object, authenticated = true) => new Request('https://example.com/delete-account', {
  method: 'POST', headers: authenticated ? { Authorization: 'Bearer test-token' } : {}, body: JSON.stringify(body),
});

Deno.test('Unauthenticated callers cannot delete accounts', async () => {
  let deleted = false;
  const handler = createHandler({ authenticate: async () => null, deleteOwnedData: async () => { deleted = true; }, deleteUser: async () => { deleted = true; } });
  assertEquals((await handler(request({ confirmation: 'DELETE' }, false))).status, 401);
  assertEquals(deleted, false);
});
Deno.test('Deletion requires exact DELETE confirmation', async () => {
  let deleted = false;
  const handler = createHandler({ authenticate: async () => 'owner', deleteOwnedData: async () => { deleted = true; }, deleteUser: async () => { deleted = true; } });
  assertEquals((await handler(request({ confirmation: 'delete' }))).status, 400);
  assertEquals(deleted, false);
});
Deno.test('Caller cannot supply another account ID', async () => {
  let deleted = false;
  const handler = createHandler({ authenticate: async () => 'owner', deleteOwnedData: async () => { deleted = true; }, deleteUser: async () => { deleted = true; } });
  assertEquals((await handler(request({ confirmation: 'DELETE', userId: 'someone-else' }))).status, 400);
  assertEquals(deleted, false);
});
Deno.test('Confirmed deletion removes owned files before the validated account', async () => {
  const calls: string[] = [];
  const handler = createHandler({ authenticate: async () => 'owner', deleteOwnedData: async id => { calls.push(`files:${id}`); }, deleteUser: async id => { calls.push(`account:${id}`); } });
  const response = await handler(request({ confirmation: 'DELETE' }));
  assertEquals(response.status, 200);
  assertEquals(await response.json(), { deleted: true });
  assertEquals(calls, ['files:owner', 'account:owner']);
});
Deno.test('Storage errors never falsely report account deletion', async () => {
  let deleted = false;
  const handler = createHandler({ authenticate: async () => 'owner', deleteOwnedData: async () => { throw new Error('unavailable'); }, deleteUser: async () => { deleted = true; } });
  assertEquals((await handler(request({ confirmation: 'DELETE' }))).status, 500);
  assertEquals(deleted, false);
});