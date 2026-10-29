'use server';
import {cookies,headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {getRepo,getUser,hasSupabase} from '@/lib/db/index.js';
import {createClient} from '@/lib/supabase/server.js';
import {adminClient} from '@/lib/supabase/admin.js';
import {AREAS,CITIES,CUR,TZS,TYPES} from '@/lib/ref.js';

const emailOk=s=>/^\S+@\S+\.\S+$/.test(s||'');
const str=(fd,k)=>String(fd.get(k)??'').trim();
const COOKIE={maxAge:60*60*24*365,path:'/',sameSite:'lax'};

/* ---------- visitor settings ---------- */
export async function setCurrency(cur){
  if(!CUR[cur])return;
  (await cookies()).set('cur',cur,COOKIE);
  revalidatePath('/','layout');
}
export async function setTimeZone(tz){
  if(!TZS.some(t=>t[0]===tz))return;
  (await cookies()).set('tz',tz,COOKIE);
}

/* ---------- auth ---------- */
export async function demoLogin(fd){
  const role=['buyer','seller','admin'].includes(str(fd,'role'))?str(fd,'role'):'buyer';
  const names={buyer:'Demo Buyer',seller:'Demo Seller',admin:'Demo Admin'};
  const user={id:'demo-'+role,name:names[role],role,phone:'+1 555 0100',email:role+'@example.com'};
  (await cookies()).set('demo_user',encodeURIComponent(JSON.stringify(user)),{...COOKIE,httpOnly:true});
  redirect(safeNext(str(fd,'next')));
}
export async function sendMagicLink(_prev,fd){
  // Used for "create account" and "forgot password". The link signs the person in and sends them to /set-password.
  const email=str(fd,'email'),name=str(fd,'name'),forgot=str(fd,'mode')==='forgot';
  if(!emailOk(email))return{error:'Enter a valid email address.'};
  if(!forgot&&name.length<2)return{error:'Enter your name.'};
  const sb=await createClient();
  const h=await headers();
  const origin=h.get('origin')||`${h.get('x-forwarded-proto')||'https'}://${h.get('host')}`;
  const {error}=await sb.auth.signInWithOtp({email,options:{shouldCreateUser:!forgot,emailRedirectTo:`${origin}/auth/callback?next=${encodeURIComponent('/set-password')}`,data:!forgot&&name?{full_name:name}:undefined}});
  return error?{error:error.message}:{sent:email,forgot};
}
export async function setPasswordAction(_prev,fd){
  const user=await getUser();
  if(!user)return{error:'Your sign-in link has expired. Please request a new one.'};
  const pw=String(fd.get('password')??''),pw2=String(fd.get('confirm')??''),name=str(fd,'name');
  if(pw.length<8)return{error:'Use at least 8 characters.'};
  if(pw!==pw2)return{error:'The two passwords do not match.'};
  const sb=await createClient();
  const {error}=await sb.auth.updateUser({password:pw,data:name?{full_name:name}:undefined});
  if(error)return{error:error.message};
  if(name)await sb.from('profiles').update({full_name:name}).eq('id',user.id);
  redirect('/account');
}
export async function passwordLogin(_prev,fd){
  const email=str(fd,'email'),password=String(fd.get('password')??'');
  if(!emailOk(email)||!password)return{error:'Enter your email and password.'};
  const sb=await createClient();
  const {error}=await sb.auth.signInWithPassword({email,password});
  if(error)return{error:error.message==='Invalid login credentials'?'Wrong email or password.':error.message};
  redirect(safeNext(str(fd,'next')));
}
export async function signOut(){
  if(hasSupabase()){const sb=await createClient();await sb.auth.signOut()}
  else (await cookies()).delete('demo_user');
  redirect('/');
}
function safeNext(n){return n&&n.startsWith('/')&&!n.startsWith('//')?n:'/account'}

/* ---------- buyer actions ---------- */
export async function toggleSave(fd){
  const {repo,user}=await getRepo();
  const ref=(await headers()).get('referer');
  let from='/';try{if(ref){const u=new URL(ref);from=u.pathname+u.search}}catch{}
  if(!user)redirect('/login?next='+encodeURIComponent(safeNext(from)));
  await repo.toggleSaved(str(fd,'id'));
  revalidatePath('/','layout');
}

export async function submitEnquiry(_prev,fd){
  const name=str(fd,'name'),email=str(fd,'email'),phone=str(fd,'phone').replace(/[^\d]/g,''),kind=str(fd,'kind')==='video_call'?'video_call':'enquiry';
  const errors={};
  if(name.length<2)errors.name='Enter your name.';
  if(!emailOk(email))errors.email='Enter a valid email address.';
  if(phone.length<6)errors.phone='Enter a valid number.';
  if(kind==='video_call'&&!str(fd,'slotAt'))errors.slot='Pick a time slot.';
  if(Object.keys(errors).length)return{errors,values:Object.fromEntries(fd)};
  const {repo}=await getRepo();
  const res=await repo.createEnquiry({propId:str(fd,'propId'),name,email,phone:str(fd,'code')+' '+phone,tz:str(fd,'tz'),kind,slotAt:str(fd,'slotAt')||null,slotLabel:str(fd,'slotLabel'),
    preferred:kind==='video_call'?'Video call':str(fd,'preferred'),timeline:str(fd,'timeline'),message:str(fd,'message').slice(0,2000)});
  if(res.error)return{errors:{form:res.error},values:Object.fromEntries(fd)};
  revalidatePath('/account');
  return{ok:true,name:name.split(' ')[0],kind,slotLabel:str(fd,'slotLabel'),preferred:str(fd,'preferred'),ref:String(res.id).slice(0,8).toUpperCase()};
}

export async function createAlertAction(fd){
  const {repo,user}=await getRepo();
  if(!user)redirect('/login?next=/account%3Ftab%3Dalerts');
  const city=str(fd,'city');
  await repo.createAlert({state:city?CITIES[city]?.s:'',city,type:TYPES.includes(str(fd,'type'))?str(fd,'type'):'',max:Number(str(fd,'max'))||0,freq:['instant','daily','weekly'].includes(str(fd,'freq'))?str(fd,'freq'):'instant'});
  revalidatePath('/account');
}
export async function deleteAlertAction(fd){const {repo}=await getRepo();await repo.deleteAlert(str(fd,'id'));revalidatePath('/account')}

/* ---------- seller: create a listing ---------- */
export async function createListingAction(_prev,fd){
  const {repo,user}=await getRepo();
  if(!user)return{errors:{form:'Please sign in before listing a property.'}};
  const v=k=>str(fd,k),errors={};
  const type=TYPES.includes(v('type'))?v('type'):'Flat',area=v('area'),a=AREAS[area];
  if(v('name').length<2)errors.name='Enter your name.';
  if(!emailOk(v('email')))errors.email='Enter a valid email address.';
  if(v('phone').replace(/\D/g,'').length<6)errors.phone='Enter a valid number.';
  if(!a)errors.area='Pick an area.';
  const price=Number(v('price'))*1e5;
  if(!(price>0))errors.price='Enter your expected price.';
  const isLand=type==='Plot'||type==='Farm land';
  const size=Number(v('size'));
  if(!(size>0))errors.size=isLand?'Enter the land size.':'Enter the built-up area.';
  if(Object.keys(errors).length)return{errors};
  const state=CITIES[a.c].s;
  const toSqyd=n=>type==='Farm land'?n*4840:state==='KL'?n*435.6/9:state==='TN'?n/9:n;   // acres, cents or sq ft to sq yd
  const plotRaw=Number(v('plot'))||0;
  const sqyd=Math.round((isLand?toSqyd(size):toSqyd(plotRaw))*10)/10;
  const beds=isLand||type==='Commercial'?0:Number(v('beds'))||0;
  const p={title:(beds?beds+' BHK ':'')+type+' in '+a.n,type,area,address:v('address'),beds,baths:isLand||type==='Commercial'?0:Number(v('baths'))||0,
    sqft:isLand?Math.round(sqyd*9):size,sqyd,acres:type==='Farm land'?size:undefined,price,negotiable:v('negotiable')!=='fixed',facing:['East','West','North','South'].includes(v('facing'))?v('facing'):'East',
    age:Number(v('age'))||0,loan:v('loan')!=='0',nri:type!=='Farm land',desc:v('desc').slice(0,3000)||'Owner has not added a description yet.',hue:Math.floor(Math.random()*360),
    provided:fd.getAll('provided').map(String),owner:{name:v('name'),email:v('email'),phone:v('code')+' '+v('phone'),country:v('country'),caretaker:v('caretaker')}};
  const files=fd.getAll('photos').filter(f=>f&&typeof f==='object'&&f.size>0&&f.type.startsWith('image/')).slice(0,8);
  const res=await repo.createListing(p,files);
  if(res.error)return{errors:{form:res.error}};
  revalidatePath('/account');
  redirect('/account?tab=mine&submitted='+res.id);
}

/* ---------- contact forms ---------- */
export async function submitContact(_prev,fd){
  const errors={};
  if(str(fd,'name').length<2)errors.name='Enter your name.';
  if(!emailOk(str(fd,'email')))errors.email='Enter a valid email address.';
  const nri=str(fd,'kind')==='nri_consult';
  if(!nri&&str(fd,'message').length<5)errors.message='Write a short message.';
  if(Object.keys(errors).length)return{errors};
  const {repo}=await getRepo();
  const res=await repo.createContact({kind:nri?'nri_consult':'contact',name:str(fd,'name'),email:str(fd,'email'),topic:str(fd,'topic'),tz:str(fd,'tz'),message:str(fd,'message')});
  if(res.error)return{errors:{form:res.error}};
  return{ok:true};
}

/* ---------- admin ---------- */
async function adminRepo(){
  const {repo,user}=await getRepo();
  if(!user||user.role!=='admin')redirect('/login?next=/admin');
  return repo;
}
export async function setStatusAction(fd){
  const repo=await adminRepo();
  const status=['Live','Rejected','Pending'].includes(str(fd,'status'))?str(fd,'status'):'Pending';
  await repo.setStatus(str(fd,'id'),status);
  revalidatePath('/','layout');
}
export async function setDocStatusAction(fd){
  const repo=await adminRepo();
  await repo.setDocStatus(str(fd,'id'),str(fd,'key'),Math.min(2,Math.max(0,Number(str(fd,'status'))||0)));
  revalidatePath('/admin');
}
export async function setLeadStatusAction(fd){
  const repo=await adminRepo();
  const s=str(fd,'status');
  if(['new','contacted','visit_scheduled','closed'].includes(s))await repo.setLeadStatus(str(fd,'id'),s);
  revalidatePath('/admin');
}

/* ---------- admin: team accounts (needs SUPABASE_SERVICE_ROLE_KEY) ---------- */
export async function createTeamUser(_prev,fd){
  const {user}=await getRepo();
  if(!user||user.role!=='admin')return{error:'Admins only.'};
  const sb=adminClient();
  if(!sb)return{error:'Account creation needs the Supabase secret key. See the setup note on this page.'};
  const name=str(fd,'name'),email=str(fd,'email'),pw=String(fd.get('password')??''),role=['admin','seller','buyer'].includes(str(fd,'role'))?str(fd,'role'):'admin';
  if(name.length<2)return{error:'Enter a name.'};
  if(!emailOk(email))return{error:'Enter a valid email address.'};
  if(pw.length<8)return{error:'Password needs at least 8 characters.'};
  const {data,error}=await sb.auth.admin.createUser({email,password:pw,email_confirm:true,user_metadata:{full_name:name}});
  if(error)return{error:error.message};
  const up=await sb.from('profiles').upsert({id:data.user.id,full_name:name,role});
  if(up.error)return{error:up.error.message};
  revalidatePath('/admin');
  return{ok:true,email,password:pw,role,name};
}
export async function setRoleAction(fd){
  const {user}=await getRepo();
  if(!user||user.role!=='admin')redirect('/login?next=/admin');
  const id=str(fd,'id'),role=str(fd,'role')==='admin'?'admin':'buyer';
  if(id===user.id)return;   // nobody can remove their own admin access by mistake
  const sb=adminClient();
  if(sb)await sb.from('profiles').update({role}).eq('id',id);
  revalidatePath('/admin?tab=team');
}
