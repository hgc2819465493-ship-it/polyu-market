// pm-sweep: removes queued Storage files (public.storage_trash) with the service role.
// Safe to call publicly: it only deletes paths that the database itself queued.
import { createClient } from 'npm:@supabase/supabase-js@2';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

Deno.serve(async () => {
  let removed = 0, failed = 0;
  for (let round = 0; round < 10; round++) {
    const { data: rows, error } = await sb.from('storage_trash').select('id,bucket,path,attempts').lt('attempts', 20).order('id').limit(200);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    if (!rows?.length) break;
    const byBucket = new Map<string, typeof rows>();
    rows.forEach(r => byBucket.set(r.bucket, [...(byBucket.get(r.bucket) || []), r]));
    for (const [bucket, list] of byBucket) {
      const { error: e } = await sb.storage.from(bucket).remove(list.map(r => r.path));
      const ids = list.map(r => r.id);
      if (e) {
        failed += ids.length;
        for (const r of list) await sb.from('storage_trash').update({ attempts: r.attempts + 1 }).eq('id', r.id);
      } else {
        removed += ids.length;
        await sb.from('storage_trash').delete().in('id', ids);
      }
    }
    if (failed) break;
  }
  return Response.json({ removed, failed });
});
