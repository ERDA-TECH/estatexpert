import Link from 'next/link';
import {notFound} from 'next/navigation';
import Gallery from '@/components/Gallery';
import Emi from '@/components/Emi';
import EnquiryPanel from '@/components/EnquiryPanel';
import PropertyCard from '@/components/PropertyCard';
import {AREAS,CITIES,STATES,DOCS,DOC_STATE,nearby} from '@/lib/ref.js';
import {art,viewsFor} from '@/lib/art.js';
import {money,perUnit,sizeLabel,landLabel,isLand,docLabel} from '@/lib/format.js';
import {cityMap} from '@/lib/maps.js';
import {getRepo} from '@/lib/db/index.js';
import {getCur,getTz} from '@/lib/ctx.js';
import {toggleSave} from '@/app/actions.js';

export async function generateMetadata({params}){
  const {id}=await params;const {repo}=await getRepo();const p=await repo.getProperty(id);
  return p?{title:p.title+' · '+AREAS[p.area].n,description:(p.desc||'').slice(0,150)}:{title:'Property not found'};
}

export default async function PropertyPage({params}){
  const {id}=await params;
  const [{repo,user},cur,tz]=await Promise.all([getRepo(),getCur(),getTz()]);
  const p=await repo.getProperty(id);
  if(!p)notFound();
  const [similar,savedIds]=await Promise.all([repo.related(p,3),user?repo.savedIds():[]]);
  const saved=new Set(savedIds),on=saved.has(p.id);
  const a=AREAS[p.area],city=CITIES[a.c],st=STATES[city.s];
  const real=(p.photos||[]).length>0;
  const views=real?p.photos.map((src,k)=>({src,label:'Photo '+(k+1),real:true})):viewsFor(p).map(([k,l])=>({src:art(p,k),label:l}));
  const kv=[['Type',p.type],['Size',sizeLabel(p)]];
  if(!isLand(p)||p.type==='Plot')kv.push(['Built-up / area',p.sqft.toLocaleString('en-IN')+' sq ft']);
  if(p.sqyd&&!isLand(p))kv.push(['Plot size',landLabel(p)]);
  if(p.beds)kv.push(['Bedrooms',p.beds+' BHK'],['Bathrooms',p.baths]);
  kv.push(['Facing',p.facing]);
  if(p.floor)kv.push([isLand(p)?'Floors':'Floor',p.floor]);
  if(!isLand(p))kv.push(['Age',p.age?p.age+' years':'New'],['Furnishing',p.furn],['Parking',p.parking+' car']);
  kv.push(['Approval',p.approval||'To be verified'],['Home loan',p.loan?'Available':'Not available'],['Price per unit',perUnit(p,cur)]);
  const docs=DOCS.filter(([k])=>!(k==='land'&&(p.type==='Flat'||p.type==='Commercial')));
  return(
    <div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link> / <Link href="/buy">Buy</Link> / {a.n}</div>
      {p.status==='Pending'&&<div className="notice" style={{marginBottom:14}}><b>Pending review.</b> This listing is not public yet. Only you and the admin team can see it.</div>}
      <div className="detail">
        <div className="stack">
          <div>
            <div className="chips" style={{marginBottom:10}}>{p.verified&&<span className="chip ok">Verified</span>}{p.rera&&<span className="chip brand">RERA</span>}{!p.nri&&<span className="chip bad">Not for NRIs</span>}<span className="chip">{p.type}</span></div>
            <h1 style={{fontSize:'clamp(1.7rem,3.4vw,2.4rem)'}}>{p.title}</h1>
            <p className="muted" style={{marginTop:6}}>{a.n}, {city.n}, {st.n} · {a.blurb}</p>
            <form action={toggleSave} style={{marginTop:12}}><input type="hidden" name="id" value={p.id}/><button className="btn ghost sm" aria-pressed={on}>{on?'Saved ✓':'Save'}</button></form>
          </div>
          <Gallery views={views}/>
          {!real&&<p className="muted sm" style={{marginTop:-12}}>Illustrations stand in for real photos, video and a 360 tour.</p>}
          <div><h3 style={{marginBottom:10}}>Property details</h3><dl className="kv">{kv.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div>
          <div><h3 style={{marginBottom:8}}>About this property</h3><p>{p.desc}</p></div>
          {p.amen?.length>0&&<div><h3 style={{marginBottom:10}}>Amenities</h3><div className="amen">{p.amen.map(x=><span key={x}>{x}</span>)}</div></div>}
          {!p.nri&&<div className="notice bad"><b>Not open to NRIs.</b> Agricultural land, plantations and farmhouses cannot be bought by non-resident Indians under foreign exchange rules. Check with a lawyer about options through a resident relative.</div>}
          <div className="panel"><h3>Legal and documents</h3>
            <p className="muted sm" style={{margin:'4px 0 8px'}}>Status of each paper as checked by our team.{p.rera?` ${st.rera} number: `:''}{p.rera&&<span className="mono">{p.rera}</span>}</p>
            {docs.map(([k])=>{const s=p.docs[k];return<div className="doc" key={k}><span>{docLabel(p,k)}</span><span className={'chip '+(s===1?'ok':s===0?'warn':'')}>{DOC_STATE[s]}</span></div>})}
          </div>
          <div className="panel"><h3>What is nearby</h3>
            <p className="muted sm" style={{margin:'4px 0 12px'}}>Sample distances from {a.n}. Drive time is an estimate at normal traffic.</p>
            <div className="nb">{nearby(p.area).map(n=><div className="nbrow" key={n.k}><span className="mono">{n.label}</span><div><div className="nbname">{n.name}</div><div className="bar2"><i style={{width:Math.max(4,Math.min(100,n.km/30*100))+'%'}}/></div></div><span className="num sm"><b>{n.km} km</b><br/><span className="muted">~{n.min} min</span></span></div>)}</div></div>
          <div className="panel"><h3>Location</h3>
            <div className="mapbox" style={{marginTop:12}} dangerouslySetInnerHTML={{__html:cityMap([{p,label:money(p.price,cur),aria:p.title}],{city:a.c,static:true,activeId:p.id})}}/>
            <p className="muted sm" style={{marginTop:8}}>Schematic map. The live site will use a real map with the exact pin.</p></div>
          <div className="panel"><h3>Loan and EMI estimate</h3>
            <p className="muted sm" style={{margin:'4px 0 12px'}}>Sample rates only. Eligibility and rates differ by lender and NRI status.</p>
            <Emi price={p.price} cur={cur}/></div>
          {similar.length>0&&<div><h3 style={{marginBottom:12}}>Similar properties</h3><div className="grid">{similar.map((x,i)=><PropertyCard key={x.id} p={x} cur={cur} i={i} saved={saved.has(x.id)}/>)}</div></div>}
        </div>
        <aside className="sticky">
          {p.status==='Live'
            ?<EnquiryPanel pid={p.id} price={money(p.price,cur)} per={perUnit(p,cur)} tz={tz} user={user?{name:user.name,email:user.email}:null}/>
            :<div className="panel"><div className="price num">{money(p.price,cur)}</div><p className="muted sm">Enquiries open once this listing is approved.</p></div>}
        </aside>
      </div>
    </div>
  );
}
