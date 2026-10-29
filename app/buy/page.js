import Link from 'next/link';
import AutoFilter from '@/components/AutoFilter';
import PropertyCard from '@/components/PropertyCard';
import {STATES,CITIES,AREAS,TYPES} from '@/lib/ref.js';
import {BUDGETS,money,stateOf} from '@/lib/format.js';
import {parseFilters} from '@/lib/filters.js';
import {southMap,cityMap} from '@/lib/maps.js';
import {getRepo} from '@/lib/db/index.js';
import {getCur} from '@/lib/ctx.js';

export const metadata={title:'Buy property in South India'};

export default async function Buy({searchParams}){
  const sp=await searchParams,f=parseFilters(sp);
  const [{repo,user},cur]=await Promise.all([getRepo(),getCur()]);
  const [list,savedIds]=await Promise.all([repo.listProperties(f),user?repo.savedIds():[]]);
  const saved=new Set(savedIds);
  const cities=Object.keys(CITIES).filter(id=>!f.state||CITIES[id].s===f.state);
  const areas=Object.keys(AREAS).filter(k=>f.city?AREAS[k].c===f.city:(!f.state||CITIES[AREAS[k].c].s===f.state));
  const view=['grid','list','map'].includes(f.view)?f.view:'grid';

  // links for the state-level map keep the current filters and zoom into a city
  const base=new URLSearchParams();
  Object.entries(sp).forEach(([k,v])=>{if(k!=='city'&&k!=='area'&&v)[].concat(v).forEach(x=>base.append(k,x))});
  base.set('view','map');
  const counts={};list.forEach(p=>{const c=AREAS[p.area].c;counts[c]=(counts[c]||0)+1});
  const mapHtml=view==='map'?(f.city
    ?cityMap(list.map(p=>({p,label:money(p.price,cur),aria:p.title})),{city:f.city})
    :southMap(counts,id=>{const q=new URLSearchParams(base);q.set('city',id);return'/buy?'+q})):'';

  const Chip=({name,value,label,on})=>(<label className="chipcheck"><input type={name==='state'?'radio':'checkbox'} name={name} value={value} defaultChecked={on}/><span>{label}</span></label>);
  return(
    <div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link> / Buy{f.state?' / '+STATES[f.state]?.n:''}{f.city?' / '+CITIES[f.city]?.n:''}</div>
      <div className="sec-head" style={{marginBottom:14}}><div><h2>Properties in South India</h2><p aria-live="polite">{list.length} {list.length===1?'property matches':'properties match'} your filters</p></div></div>
      <AutoFilter action="/buy" className="lay">
        <aside className="filters" aria-label="Filters">
          <div className="field"><label htmlFor="f-q">Search</label><input id="f-q" name="q" type="text" placeholder="Area, city, type or keyword" defaultValue={f.q}/></div>
          <div className="field"><span className="lbl">State</span><div className="chips">
            <Chip name="state" value="" label="All" on={!f.state}/>
            {Object.keys(STATES).map(k=><Chip key={k} name="state" value={k} label={STATES[k].short} on={f.state===k}/>)}
          </div></div>
          <div className="field"><label htmlFor="f-city">City</label><select id="f-city" name="city" defaultValue={f.city}><option value="">All cities</option>{cities.map(id=><option key={id} value={id}>{CITIES[id].n}</option>)}</select></div>
          <div className="field"><label htmlFor="f-area">Area</label><select id="f-area" name="area" defaultValue={f.area}><option value="">All areas</option>{areas.map(k=><option key={k} value={k}>{AREAS[k].n}{f.city?'':` (${CITIES[AREAS[k].c].n})`}</option>)}</select></div>
          <div className="field"><span className="lbl">Property type</span><div className="chips">{TYPES.map(t=><Chip key={t} name="type" value={t} label={t} on={f.types.includes(t)}/>)}</div></div>
          <div className="field"><span className="lbl">Bedrooms</span><div className="chips">{[1,2,3,4,5].map(b=><Chip key={b} name="beds" value={b} label={b===5?'5+':b+' BHK'} on={f.beds.includes(b)}/>)}</div></div>
          <div className="row" style={{gridTemplateColumns:'1fr 1fr'}}>
            <div className="field"><label htmlFor="f-min">Min budget</label><select id="f-min" name="min" defaultValue={String(f.min)}><option value="0">No min</option>{BUDGETS.slice(0,5).map(b=><option key={b} value={b}>{money(b,cur)}</option>)}</select></div>
            <div className="field"><label htmlFor="f-max">Max budget</label><select id="f-max" name="max" defaultValue={String(f.max)}><option value="0">No max</option>{BUDGETS.map(b=><option key={b} value={b}>{money(b,cur)}</option>)}</select></div>
          </div>
          <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" name="verified" value="1" defaultChecked={f.verified}/> Verified listings only</label>
          <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" name="nri" value="1" defaultChecked={f.nri}/> NRIs can buy this</label>
          <Link className="btn ghost sm" href="/buy">Reset filters</Link>
        </aside>
        <section>
          <div className="toolbar">
            <div className="field" style={{flexDirection:'row',alignItems:'center',gap:8}}><label htmlFor="f-sort">Sort</label>
              <select id="f-sort" name="sort" defaultValue={f.sort} style={{width:'auto'}}><option value="new">Newest</option><option value="low">Price, low to high</option><option value="high">Price, high to low</option><option value="size">Largest</option></select></div>
            <div className="seg" role="radiogroup" aria-label="View">
              {['grid','list','map'].map(v=><label key={v}><input type="radio" name="view" value={v} defaultChecked={view===v}/><span>{v[0].toUpperCase()+v.slice(1)}</span></label>)}
            </div>
          </div>
          {view==='map'&&<>
            <div className="mapbox" dangerouslySetInnerHTML={{__html:mapHtml}}/>
            <p className="muted sm" style={{margin:'8px 0 14px'}}>{f.city?'Tap a price tag to open that property. ':'Tap a city to zoom in and see its areas. '}Schematic map, not to scale.</p>
          </>}
          {list.length?(
            <div className={'grid'+(view==='list'?' list':'')}>{list.map((p,i)=><PropertyCard key={p.id} p={p} cur={cur} i={i} saved={saved.has(p.id)}/>)}</div>
          ):(
            <div className="empty"><h3>No properties match</h3><p style={{margin:'8px 0 14px'}}>Try a wider budget, another city or remove a filter.</p><Link className="btn ghost" href="/buy">Reset filters</Link></div>
          )}
        </section>
      </AutoFilter>
    </div>
  );
}
