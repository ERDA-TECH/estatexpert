import {cookies} from 'next/headers';
import {demoRepo} from './demo.js';
import {supabaseRepo,supabaseUser} from './supabase.js';

export const hasSupabase=()=>!!(process.env.NEXT_PUBLIC_SUPABASE_URL&&(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));

// The signed-in visitor, or null. In demo mode this comes from a cookie set by the demo login buttons.
export async function getUser(){
  if(hasSupabase())return supabaseUser();
  const raw=(await cookies()).get('demo_user')?.value;
  if(!raw)return null;
  try{const u=JSON.parse(decodeURIComponent(raw));return u&&u.id?u:null}catch{return null}
}
export async function getRepo(){
  const user=await getUser();
  const repo=hasSupabase()?await supabaseRepo(user):demoRepo(user);
  return{repo,user};
}
