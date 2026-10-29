import Link from 'next/link';
import {AREAS,CITIES} from '@/lib/ref.js';
import {art} from '@/lib/art.js';
import {money,perUnit,sizeLabel,isLand,daysAgo} from '@/lib/format.js';
import {toggleSave} from '@/app/actions.js';

const Heart=()=>(<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 5 6 5c2 0 3.4 1 4 2.2h4C14.6 6 16 5 18 5c3.3 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21z"/></svg>);

export default function PropertyCard({p,cur,saved=false,i=0}){
  const a=AREAS[p.area],city=CITIES[a.c];
  const facts=isLand(p)
    ?<><span><b>{sizeLabel(p)}</b></span><span>{p.type==='Farm land'?'':p.sqft.toLocaleString('en-IN')+' sq ft'}</span><span>{p.facing} facing</span></>
    :p.type==='Commercial'
    ?<><span><b>{sizeLabel(p)}</b></span><span>Floor {p.floor}</span><span>{p.parking} parking</span></>
    :<><span><b>{p.beds} BHK</b></span><span><b>{sizeLabel(p)}</b></span><span>{p.baths} bath</span><span>{p.facing} facing</span></>;
  return(
    <article className="card" style={{'--i':Math.min(i,8)}}>
      <Link className="card-img" href={`/property/${p.id}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" alt={`${p.type} in ${a.n}, sample illustration`} src={art(p,'exterior')}/>
        <span className="tags"><span className="chip">{p.type}</span>{p.verified&&<span className="chip ok">Verified</span>}</span>
      </Link>
      <form action={toggleSave}><input type="hidden" name="id" value={p.id}/>
        <button className={'heart'+(saved?' on':'')} aria-label={saved?'Remove from saved':'Save property'} aria-pressed={saved}><Heart/></button></form>
      <div className="card-body">
        <div className="price num">{money(p.price,cur)} <small>{perUnit(p,cur)}</small></div>
        <h3><Link href={`/property/${p.id}`} style={{color:'inherit'}}>{p.title}</Link></h3>
        <div className="mono">{a.n}, {city.n}{p.status==='Pending'?' · Pending review':''}</div>
        <div className="facts num">{facts}</div>
        <div className="card-foot"><span className="muted">{daysAgo(p)}</span></div>
      </div>
    </article>
  );
}
