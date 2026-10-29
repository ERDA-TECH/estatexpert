// Server-only client with the secret (service role) key. It bypasses row level security, so it is only
// used for creating accounts from the admin panel. Never import this file from a client component.
import {createClient} from '@supabase/supabase-js';

export const hasServiceKey=()=>!!process.env.SUPABASE_SERVICE_ROLE_KEY;
export function adminClient(){
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY,url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  if(!key||!url)return null;
  return createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
}
