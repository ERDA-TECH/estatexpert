import Link from 'next/link';
import {redirect} from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import {AREAS,TYPES,CITIES} from '@/lib/ref.js';
import {BUDGETS,money} from '@/lib/format.js';
import {getRepo} from '@/lib/db/index.js';
import {getCur} from '@/lib/ctx.js';
import {createAlertAction,deleteAlertAction} from '@/app/actions.js';

export const metadata={title:'My account'};
const one=v=>Array.isArray(v)?v[0]:v;

export default async function Account({searchParams}){
  const sp=await searchParams;
  const {repo,user}=await getRepo();
  if(!user)redirect('/login?next=/account');
  const cur=await getCur();
  const [saved,enq,mine,alerts]=await Promise.all([repo.savedList(),repo.myEnquiries(),repo.myListings(),repo.alerts()]);
  const tab=['saved','enquiries','mine','alerts'].includes(one(sp.tab))?one(sp.tab):(one(sp.submitted)?'mine':'saved');
  const tabs=[['saved',`Saved (${saved.length})`],['enquiries',`Enquiries (${enq.length})`],['mine',`My listings (${mine.length})`],['alerts',`Alerts (${alerts.length})`]];
  const savedSet=new Set(saved.map(p=>p.id));
  const empty=(t,d,href,l)=><div className="empty"><h3>{t}</h3><p style={{margin:'8px 0 14px'}}>{d}</p><Link className="btn" href={href}>{l}</Link></div>;
  return(
    <div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link> / My account</div>
      <div className="sec-head"><div><h2>Welcome, {(user.name||user.email||'there').split(' ')[0]}</h2><p>Signed in as {user.email||user.phone}{user.role!=='buyer'?` (${user.role})`:''}.</p></div></div>
      {one(sp.submitted)&&<div className="notice" role="status" style={{marginBottom:14}}><b>Listing submitted.</b> Our team reviews it within two working days. It appears under Buy once approved.</div>}
      <div className="tabs" role="tablist">{tabs.map(([k,l])=><Link key={k} role="tab" aria-selected={tab===k} className={tab===k?'on':''} href={`/account?tab=${k}`}>{l}</Link>)}</div>
      {tab==='saved'&&(saved.length?<div className="grid">{saved.map((p,i)=><PropertyCard key={p.id} p={p} cur={cur} i={i} saved={savedSet.has(p.id)}/>)}</div>:empty('No saved properties yet','Tap the heart on any property to keep it here.','/buy','Browse properties'))}
      {tab==='enquiries'&&(enq.length?<div className="scroll"><table className="t"><thead><tr><th>Property</th><th>Type</th><th>Details</th><th>Status</th></tr></thead><tbody>{enq.map(e=>(
        <tr key={e.id}><td>{e.propId?<Link href={`/property/${e.propId}`}>{e.propTitle}</Link>:e.propTitle}</td><td>{e.kind}</td><td>{e.note}</td><td><span className={'chip '+(e.status==='closed'?'ok':'brand')}>{String(e.status).replace('_',' ')}</span></td></tr>))}</tbody></table></div>:empty('No enquiries yet','Send an enquiry or book a video call from any property page.','/buy','Find a property'))}
      {tab==='mine'&&(mine.length?<div className="grid">{mine.map((p,i)=><PropertyCard key={p.id} p={p} cur={cur} i={i} saved={savedSet.has(p.id)}/>)}</div>:empty('You have not listed a property','List a property in four steps. It appears here while it is under review.','/sell','List a property'))}
      {tab==='alerts'&&(
        <div className="detail" style={{gridTemplateColumns:'minmax(0,1fr) 340px'}}>
          <div>{alerts.length?alerts.map(a=>(
            <div className="panel" key={a.id} style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',marginBottom:10,flexWrap:'wrap'}}>
              <div><b>{a.type||'Any type'} in {a.city?CITIES[a.city]?.n:'all cities'}</b><div className="muted sm">{a.max?'Up to '+money(a.max,cur):'Any budget'} · {a.freq}</div></div>
              <form action={deleteAlertAction}><input type="hidden" name="id" value={a.id}/><button className="btn ghost sm">Delete</button></form></div>
          )):<div className="empty"><h3>No alerts yet</h3><p>Create one and we will tell you when a matching property is listed.</p></div>}</div>
          <form className="panel crop" action={createAlertAction}><h3>New alert</h3>
            <div className="stack" style={{gap:12,marginTop:12}}>
              <div className="field"><label htmlFor="al-city">City</label><select id="al-city" name="city"><option value="">All cities</option>{Object.keys(CITIES).map(k=><option key={k} value={k}>{CITIES[k].n}</option>)}</select></div>
              <div className="field"><label htmlFor="al-type">Type</label><select id="al-type" name="type"><option value="">Any type</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div className="field"><label htmlFor="al-max">Max budget</label><select id="al-max" name="max"><option value="0">Any budget</option>{BUDGETS.map(b=><option key={b} value={b}>{money(b,cur)}</option>)}</select></div>
              <div className="field"><label htmlFor="al-freq">How often</label><select id="al-freq" name="freq"><option value="instant">Instantly</option><option value="daily">Daily summary</option><option value="weekly">Weekly summary</option></select></div>
              <button className="btn" type="submit">Create alert</button></div></form>
        </div>)}
    </div>
  );
}
