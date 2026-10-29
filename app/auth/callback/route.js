import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server.js';

export async function GET(request){
  const {searchParams,origin}=new URL(request.url);
  const code=searchParams.get('code'),n=searchParams.get('next')||'/account';
  const next=n.startsWith('/')&&!n.startsWith('//')?n:'/account';
  if(code){
    const sb=await createClient();
    const {error}=await sb.auth.exchangeCodeForSession(code);
    if(!error)return NextResponse.redirect(origin+next);
  }
  return NextResponse.redirect(origin+'/login?error=link');
}
