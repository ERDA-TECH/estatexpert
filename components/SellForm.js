'use client';
import {useActionState,useRef,useState} from 'react';
import {createListingAction} from '@/app/actions.js';
import {STATES,CITIES,AREAS,TYPES,CODES,DOCS} from '@/lib/ref.js';

const STEPS=['You','Property','Papers and photos','Review'];
export default function SellForm({user}){
  const [res,act,pending]=useActionState(createListingAction,null);
  const form=useRef(null);
  const [step,setStep]=useState(1);
  const [local,setLocal]=useState({});
  const [type,setType]=useState('Flat'),[state,setState]=useState('TG'),[city,setCity]=useState('hyd'),[area,setArea]=useState(Object.keys(AREAS).find(k=>AREAS[k].c==='hyd'));
  const [thumbs,setThumbs]=useState([]);
  const e={...(res?.errors||{}),...local};
  const land=type==='Plot'||type==='Farm land',comm=type==='Commercial';
  const unit=type==='Farm land'?['Land area (acres)','2']:state==='KL'?['Plot size (cents)','5']:state==='TN'?['Plot size (sq ft)','2400']:['Plot size (sq yd)','200'];
  const cities=Object.keys(CITIES).filter(c=>CITIES[c].s===state),areas=Object.keys(AREAS).filter(k=>AREAS[k].c===city);
  const val=n=>form.current?.elements[n]?.value||'';
  const next=()=>{
    const er={};
    if(step===1){
      if(val('name').trim().length<2)er.name='Enter your name.';
      if(!/^\S+@\S+\.\S+$/.test(val('email')))er.email='Enter a valid email address.';
      if(val('phone').replace(/\D/g,'').length<6)er.phone='Enter a valid number.';
    }
    if(step===2){
      if(!(+val('size')>0))er.size=land?'Enter the land size.':'Enter the built-up area.';
      if(!(+val('price')>0))er.price='Enter your expected price.';
    }
    setLocal(er);if(Object.keys(er).length)return;
    setStep(s=>s+1);form.current?.scrollIntoView({block:'start',behavior:'smooth'});
  };
  const back=()=>{setLocal({});setStep(s=>s-1)};
  const S=n=>({hidden:step!==n});  // steps stay mounted so every field is submitted
  const E=k=>e[k]?<div className="err" role="alert">{e[k]}</div>:<div className="err"/>;
  return(
    <div>
      <div className="steps-form" aria-label="Progress">{STEPS.map((l,i)=><div key={l} className={i+1===step?'on':i+1<step?'done':''}>{i+1} · {l}</div>)}</div>
      <form ref={form} action={act} className="panel crop" noValidate onKeyDown={ev=>{if(ev.key==='Enter'&&ev.target.tagName==='INPUT'){ev.preventDefault();if(step<4)next()}}}>
        {e.form&&<div className="notice bad" role="alert" style={{marginBottom:12}}>{e.form}</div>}
        <div {...S(1)} className="stack" style={{gap:14}}><h3>About you</h3>
          <div className="row two">
            <div className="field"><label htmlFor="s-name">Full name</label><input id="s-name" name="name" type="text" autoComplete="name" defaultValue={user?.name||''}/>{E('name')}</div>
            <div className="field"><label htmlFor="s-email">Email</label><input id="s-email" name="email" type="email" autoComplete="email" defaultValue={user?.email||''}/>{E('email')}</div>
          </div>
          <div className="row two">
            <div className="field"><label htmlFor="s-phone">Phone or WhatsApp</label><div className="phone"><select name="code" aria-label="Country code" defaultValue="+1">{CODES.map(c=><option key={c[0]} value={c[0]}>{c[0]} {c[1]}</option>)}</select><input id="s-phone" name="phone" type="tel" inputMode="tel"/></div>{E('phone')}</div>
            <div className="field"><label htmlFor="s-country">Country you live in</label><input id="s-country" name="country" type="text" placeholder="e.g. United States"/></div>
          </div>
          <div className="field"><label htmlFor="s-keeper">Who can show the property in India? (optional)</label><input id="s-keeper" name="caretaker" type="text" placeholder="Relative or caretaker name and number"/></div>
        </div>
        <div {...S(2)} className="stack" style={{gap:14}}><h3>About the property</h3>
          <div className="row">
            <div className="field"><label htmlFor="s-type">Property type</label><select id="s-type" name="type" value={type} onChange={x=>setType(x.target.value)}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="field"><label htmlFor="s-state">State</label><select id="s-state" value={state} onChange={x=>{const s=x.target.value,c=Object.keys(CITIES).find(c=>CITIES[c].s===s);setState(s);setCity(c);setArea(Object.keys(AREAS).find(k=>AREAS[k].c===c))}}>{Object.keys(STATES).map(k=><option key={k} value={k}>{STATES[k].n}</option>)}</select></div>
            <div className="field"><label htmlFor="s-city">City</label><select id="s-city" value={city} onChange={x=>{setCity(x.target.value);setArea(Object.keys(AREAS).find(k=>AREAS[k].c===x.target.value))}}>{cities.map(c=><option key={c} value={c}>{CITIES[c].n}</option>)}</select></div>
            <div className="field"><label htmlFor="s-area">Area</label><select id="s-area" name="area" value={area} onChange={x=>setArea(x.target.value)}>{areas.map(k=><option key={k} value={k}>{AREAS[k].n}</option>)}</select></div>
          </div>
          <div className="field"><label htmlFor="s-addr">Address or landmark</label><input id="s-addr" name="address" type="text" placeholder="Street, colony, nearest landmark"/></div>
          <div className="row">
            {!land&&!comm&&<div className="field"><label htmlFor="s-beds">Bedrooms</label><select id="s-beds" name="beds" defaultValue="3">{[1,2,3,4,5,6].map(b=><option key={b} value={b}>{b} BHK</option>)}</select></div>}
            {!land&&!comm&&<div className="field"><label htmlFor="s-baths">Bathrooms</label><select id="s-baths" name="baths" defaultValue="2">{[1,2,3,4,5,6].map(b=><option key={b}>{b}</option>)}</select></div>}
            <div className="field"><label htmlFor="s-size">{land?unit[0]:'Built-up (sq ft)'}</label><input id="s-size" name="size" type="number" min="1" step="any" placeholder={land?unit[1]:'1500'}/>{E('size')}</div>
            {!land&&<div className="field"><label htmlFor="s-plot">Plot size ({state==='KL'?'cents':state==='TN'?'sq ft':'sq yd'}, optional)</label><input id="s-plot" name="plot" type="number" min="0" step="any"/></div>}
            <div className="field"><label htmlFor="s-facing">Facing</label><select id="s-facing" name="facing">{['East','West','North','South'].map(f=><option key={f}>{f}</option>)}</select></div>
            {!land&&<div className="field"><label htmlFor="s-age">Age (years)</label><input id="s-age" name="age" type="number" min="0" defaultValue="0"/></div>}
          </div>
          <div className="row two">
            <div className="field"><label htmlFor="s-price">Expected price (₹ lakh)</label><input id="s-price" name="price" type="number" min="1" step="any" placeholder="e.g. 150 for ₹1.5 Cr"/>{E('price')}</div>
            <div className="field"><label htmlFor="s-neg">Price is</label><select id="s-neg" name="negotiable"><option value="neg">Negotiable</option><option value="fixed">Fixed</option></select></div>
          </div>
          <div className="field"><label htmlFor="s-loan">Home loan available?</label><select id="s-loan" name="loan"><option value="1">Yes</option><option value="0">No</option></select></div>
          <div className="field"><label htmlFor="s-desc">Describe it</label><textarea id="s-desc" name="desc" placeholder="What makes this property special?"/></div>
        </div>
        <div {...S(3)} className="stack" style={{gap:14}}><h3>Papers and photos</h3>
          <p className="muted">Tick what you can share. We verify each one before the listing goes live.</p>
          <div className="stack" style={{gap:8}}>{DOCS.map(([k,l])=><label key={k} style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" name="provided" value={k}/> {l}</label>)}</div>
          <div className="field"><label htmlFor="s-photos">Photos (up to 8)</label><input id="s-photos" name="photos" type="file" accept="image/*" multiple onChange={x=>setThumbs([...x.target.files].slice(0,8).map(f=>URL.createObjectURL(f)))}/></div>
          <div className="thumbrow">{thumbs.map(u=>/* eslint-disable-next-line @next/next/no-img-element */<img key={u} src={u} alt="Selected photo"/>)}</div>
        </div>
        <div {...S(4)} className="stack" style={{gap:14}}><h3>Review and submit</h3>
          {step===4&&<dl className="kv">
            <div><dt>Property</dt><dd>{type} in {AREAS[area]?.n}</dd></div>
            <div><dt>Size</dt><dd>{val('size')} {land?unit[0].match(/\((.*)\)/)[1]:'sq ft'}</dd></div>
            <div><dt>Expected price</dt><dd>₹{val('price')} lakh</dd></div>
            <div><dt>Facing</dt><dd>{val('facing')}</dd></div>
            <div><dt>Owner</dt><dd>{val('name')}{val('country')?', '+val('country'):''}</dd></div>
          </dl>}
          <p className="muted sm">By submitting you confirm you are the owner or authorised to sell. Your listing goes to our team for review and your phone number is never shown to buyers.</p>
        </div>
        <div style={{display:'flex',gap:10,justifyContent:'space-between',marginTop:20}}>
          {step>1?<button type="button" className="btn ghost" onClick={back}>Back</button>:<span/>}
          {step<4?<button key="next" type="button" className="btn" onClick={next}>Continue</button>:<button key="submit" type="submit" className="btn accent" disabled={pending}>{pending?'Submitting…':'Submit for review'}</button>}
        </div>
      </form>
    </div>
  );
}
