import Link from 'next/link';
import {redirect} from 'next/navigation';
import {AREAS,DOCS,DOC_STATE,LEAD_STATES} from '@/lib/ref.js';
import {art} from '@/lib/art.js';
import {money} from '@/lib/format.js';
import {getRepo} from '@/lib/db/index.js';
import {getCur} from '@/lib/ctx.js';
import {setStatusAction,setDocStatusAction,setLeadStatusAction,setRoleAction} from '@/app/actions.js';
import TeamForm from '@/components/TeamForm';
import {adminClient,hasServiceKey} from '@/lib/supabase/admin.js';
import {hasSupabase} from '@/lib/db/index.js';

export const metadata={title:'Admin'};
const one=v=>Array.isArray(v)?v[0]:v;
const LEAD={new:'New',contacted:'Contacted',visit_scheduled:'Visit scheduled',closed:'Closed'};

export default async function Admin({searchParams}){
  const sp=await searchParams;
  const {repo,user}=await getRepo();
  if(!user)redirect('/login?next=/admin');
  if(user.role!=='admin')return(<div className="wrap sec"><div className="empty"><h2>Admins only</h2><p style={{margin:'8px 0 16px'}}>Your account does not have access to this page.</p><Link className="btn" href="/">Back home</Link></div></div>);
  const cur=await getCur();
  const [queue,leads,stats]=await Promise.all([repo.reviewQueue(),repo.leads(),repo.stats()]);
  let admins=[];
  if(hasSupabase()&&hasServiceKey()){
    const sb=adminClient();
    const [{data:profs},{data:ul}]=await Promise.all([sb.from('profiles').select('id,full_name,role').eq('role','admin'),sb.auth.admin.listUsers({perPage:200})]);
    const em=Object.fromEntries((ul?.users||[]).map(u=>[u.id,u.email]));
    admins=(profs||[]).map(p=>({id:p.id,name:p.full_name||'',email:em[p.id]||''}));
  }
  const tab=['review','leads','stats','team'].includes(one(sp.tab))?one(sp.tab):'review';
  const tabs=[['review',`Listing review (${stats.pending})`],['leads',`Leads (${leads.length})`],['stats','Overview'],['team','Team and accounts']];
  return(
    <div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link> / Admin</div>
      <div className="sec-head"><div><h2>Admin panel</h2><p>Approve listings, check documents and work the leads.</p></div></div>
      <div className="tabs" role="tablist">{tabs.map(([k,l])=><Link key={k} role="tab" aria-selected={tab===k} className={tab===k?'on':''} href={`/admin?tab=${k}`}>{l}</Link>)}</div>
      {tab==='review'&&(queue.length?<div className="stack" style={{gap:12}}>{queue.map(p=>(
        <div className="panel" key={p.id} style={{display:'grid',gridTemplateColumns:'140px minmax(0,1fr) auto',gap:16,alignItems:'start'}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={art(p,'exterior')} alt="" style={{width:140,aspectRatio:'25/16',objectFit:'cover',border:'1px solid var(--line)'}}/>
          <div style={{minWidth:0}}>
            <div className="chips" style={{marginBottom:6}}><span className={'chip '+(p.status==='Rejected'?'bad':'warn')}>{p.status}</span><span className="chip">{p.type}</span></div>
            <b><Link href={`/property/${p.id}`}>{p.title}</Link></b>
            <div className="muted sm">{money(p.price,cur)} · {AREAS[p.area]?.n}{p.owner?.name?` · Owner: ${p.owner.name}`:''}</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:10}}>{DOCS.slice(0,6).map(([k,l])=>(
              <form key={k} action={setDocStatusAction} style={{display:'flex',gap:4,alignItems:'center'}}>
                <input type="hidden" name="id" value={p.id}/><input type="hidden" name="key" value={k}/>
                <label className="muted sm" htmlFor={`d${p.id}${k}`}>{l.split(' ')[0]}{p.provided?.includes(k)?' ✓':''}</label>
                <select id={`d${p.id}${k}`} name="status" defaultValue={p.docs[k]} style={{width:'auto'}}>{DOC_STATE.map((s,i)=><option key={s} value={i}>{s}</option>)}</select>
                <button className="btn ghost sm">Set</button></form>))}</div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <form action={setStatusAction}><input type="hidden" name="id" value={p.id}/><input type="hidden" name="status" value="Live"/><button className="btn sm">Approve</button></form>
            {p.status!=='Rejected'&&<form action={setStatusAction}><input type="hidden" name="id" value={p.id}/><input type="hidden" name="status" value="Rejected"/><button className="btn ghost sm">Reject</button></form>}</div>
        </div>))}</div>:<div className="empty">No listings to review.</div>)}
      {tab==='leads'&&<div className="kan">{LEAD_STATES.map(st=>{const l=leads.filter(x=>LEAD[x.status]===st);return(
        <div key={st}><div className="mono">{st} · {l.length}</div>
          {l.map(x=>(<div className="lead-card" key={x.id}><b>{x.name}</b><span className="muted">{x.tz} · {x.kind}</span><span>{x.propId?<Link href={`/property/${x.propId}`}>{x.propTitle}</Link>:'Property removed'}</span><span className="muted">{x.note}</span>
            <form action={setLeadStatusAction} style={{display:'flex',gap:6}}><input type="hidden" name="id" value={x.id}/>
              <select name="status" defaultValue={x.status} aria-label="Lead status">{Object.entries(LEAD).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select><button className="btn ghost sm">Set</button></form></div>))}
          {!l.length&&<span className="muted sm">No leads here</span>}</div>)})}</div>}
      {tab==='team'&&(!hasSupabase()?<div className="notice">Team accounts need Supabase mode. In demo mode use the demo sign-in buttons.</div>:!hasServiceKey()?
        <div className="notice"><b>One-time setup.</b> To create accounts from here, add the Supabase secret key as <span className="mono">SUPABASE_SERVICE_ROLE_KEY</span> in <span className="mono">.env.local</span> (and in your hosting settings), then restart. Find it in Supabase under Settings, API Keys, secret key. Keep it private.</div>:
        <div className="detail" style={{gridTemplateColumns:'minmax(0,1fr) 380px'}}>
          <TeamForm/>
          <div className="panel"><h3>Admins ({admins.length})</h3><div className="stack" style={{gap:10,marginTop:12}}>{admins.map(a=>(
            <div key={a.id} style={{display:'flex',justifyContent:'space-between',gap:10,alignItems:'center'}}><div style={{minWidth:0}}><b>{a.name||a.email}</b><div className="muted sm" style={{overflowWrap:'anywhere'}}>{a.email}</div></div>
              {a.id!==user.id&&<form action={setRoleAction}><input type="hidden" name="id" value={a.id}/><input type="hidden" name="role" value="buyer"/><button className="btn ghost sm">Remove admin</button></form>}</div>))}</div></div>
        </div>)}
      {tab==='stats'&&<div className="tiles">
        <div className="tile"><span className="mono">Live listings</span><b>{stats.live}</b></div><div className="tile"><span className="mono">Awaiting review</span><b>{stats.pending}</b></div>
        <div className="tile"><span className="mono">Open leads</span><b>{stats.open}</b></div><div className="tile"><span className="mono">Closed</span><b>{stats.closed}</b></div></div>}
    </div>
  );
}
