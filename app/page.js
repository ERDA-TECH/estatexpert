import Link from 'next/link';
import Hero from '@/components/Hero';
import CountUp from '@/components/CountUp';
import PropertyCard from '@/components/PropertyCard';
import {STATES,CITIES,AREAS,TYPES} from '@/lib/ref.js';
import {SCENES} from '@/lib/scenes.js';
import {BUDGETS,money,stateOf} from '@/lib/format.js';
import {getRepo} from '@/lib/db/index.js';
import {getCur,getTz} from '@/lib/ctx.js';
import {parseFilters} from '@/lib/filters.js';

export default async function Home(){
  const [{repo,user},cur,tz]=await Promise.all([getRepo(),getCur(),getTz()]);
  const all=await repo.listProperties(parseFilters({}));
  const saved=new Set(user?await repo.savedIds():[]);
  const scenes=Object.fromEntries(Object.entries(SCENES).map(([k,f])=>[k,f()]));
  const perState={};
  all.filter(p=>p.verified).forEach(p=>{(perState[stateOf(p)]=perState[stateOf(p)]||[]).push(p)});
  const feat=Object.keys(STATES).flatMap(k=>(perState[k]||[]).slice(0,2));
  const marq=Object.keys(CITIES).map(id=><span key={id}>{CITIES[id].n}<i/></span>);
  const priceFrom=l=>l.length?money(Math.min(...l.map(x=>x.price)),cur):'';
  return(<>
    <Hero scenes={scenes} tz={tz}>
      <div className="wrap"><form className="search" action="/buy" aria-label="Search properties">
        <div className="field"><label htmlFor="hs-city">Where</label><select id="hs-city" name="city" defaultValue="">
          <option value="">All of South India</option>
          {Object.keys(STATES).map(k=><optgroup key={k} label={STATES[k].n}>{Object.keys(CITIES).filter(c=>CITIES[c].s===k).map(c=><option key={c} value={c}>{CITIES[c].n}</option>)}</optgroup>)}
        </select></div>
        <div className="field"><label htmlFor="hs-type">Type</label><select id="hs-type" name="type" defaultValue=""><option value="">All types</option>{TYPES.filter(t=>t!=='Farm land').map(t=><option key={t}>{t}</option>)}</select></div>
        <div className="field"><label htmlFor="hs-max">Budget up to</label><select id="hs-max" name="max" defaultValue="0"><option value="0">Any budget</option>{BUDGETS.map(b=><option key={b} value={b}>{money(b,cur)}</option>)}</select></div>
        <button className="btn accent" type="submit">Search {all.length} properties</button>
      </form></div>
      <div className="marquee" aria-hidden="true"><div className="track">{marq}{marq}</div></div>
    </Hero>
    <div className="stats"><div className="wrap statgrid">
      <div className="stat"><CountUp n={all.length}/><span className="muted">live sample listings</span></div>
      <div className="stat"><CountUp n={Object.keys(STATES).length}/><span className="muted">states</span></div>
      <div className="stat"><CountUp n={Object.keys(CITIES).length}/><span className="muted">cities</span></div>
      <div className="stat"><CountUp n={7}/><span className="muted">document checks per listing</span></div>
    </div></div>
    <section className="sec"><div className="wrap">
      <div className="sec-head"><div><h2>Fresh and verified</h2><p>Every listing below has passed a document check. Pending papers are always shown on the property page.</p></div><Link className="btn ghost" href="/buy">See all properties</Link></div>
      <div className="grid">{feat.map((p,i)=><PropertyCard key={p.id} p={p} cur={cur} i={i} saved={saved.has(p.id)}/>)}</div>
    </div></section>
    <section className="sec tight"><div className="wrap">
      <div className="sec-head"><div><h2>Pick a city</h2><p>Each state has its own land records, approvals and units. We show the right ones on every listing.</p></div></div>
      <div className="stack" style={{gap:26}}>{Object.keys(STATES).map(k=>(
        <div key={k}><div className="mono" style={{marginBottom:10}}>{STATES[k].n} · {STATES[k].rera}</div>
          <div className="citygrid">{Object.keys(CITIES).filter(c=>CITIES[c].s===k).map((c,i)=>{const l=all.filter(p=>AREAS[p.area].c===c);return(
            <Link key={c} className="citytile" style={{'--i':i}} href={`/buy?city=${c}`}><b>{CITIES[c].n}</b><span className="muted">{l.length} {l.length===1?'property':'properties'}{l.length?' · from '+priceFrom(l):' · coming soon'}</span></Link>)})}</div></div>))}</div>
    </div></section>
    <section className="sec tight"><div className="wrap">
      <div className="sec-head"><div><h2>How it works from abroad</h2></div></div>
      <div className="steps">
        {[['Search','Shortlist from your sofa','Filter by state, city, budget, size and approvals. Save the homes you like.'],
          ['Verify','See the papers and the surroundings','Title, encumbrance, tax, approvals and the local land record are shown with their status, plus distances to schools, hospitals, transit and the airport.'],
          ['Connect','Book a call at a sensible hour','Pick a slot shown in your own time zone. Our partner in that city joins you on video.'],
          ['Close','Register with local support','Power of Attorney, registration, tax guidance and property management through NRI services.']
        ].map(([a,t,d],i)=><div className="step" key={a}><span className="mono"><b>Step {i+1}</b> · {a}</span><h3>{t}</h3><p className="muted">{d}</p></div>)}
      </div>
    </div></section>
    <section className="sec tight"><div className="wrap">
      <div className="sec-head"><div><h2>Families who made the move</h2><p>Sample stories to show how this section will look.</p></div></div>
      <div className="cards3">
        {[['We bought a Kokapet villa without flying in. The video tours were at 8 pm our time and the document list answered our lawyer\'s questions.','Sample family','Dallas, US · Hyderabad'],
          ['The land record and cents were explained clearly for our Kochi plot. My parents could see the hospital distance for every flat.','Sample buyer','London, UK · Kochi'],
          ['I listed our old family house from Chicago. The team in Vijayawada handled photos, buyers and the paperwork.','Sample seller','Chicago, US · Vijayawada']
        ].map(([q,n,w])=><div className="quote" key={n}><p>&ldquo;{q}&rdquo;</p><div><b>{n}</b><div className="mono">{w}</div></div></div>)}
      </div>
    </div></section>
    <section className="sec tight"><div className="wrap"><div className="panel cta" style={{display:'flex',gap:20,justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
      <div><h2>Selling a property in South India?</h2><p className="muted" style={{marginTop:6}}>List it for free. We verify the papers and bring serious buyers from overseas.</p></div>
      <Link className="btn accent" href="/sell">List your property</Link></div></div></section>
  </>);
}
