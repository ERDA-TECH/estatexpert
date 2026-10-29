'use client';
import {useActionState,useEffect,useState} from 'react';
import {submitEnquiry} from '@/app/actions.js';
import {CODES,TZS} from '@/lib/ref.js';
import {istSlots,istDayLabel,localSlot,h12} from '@/lib/time.js';

export default function EnquiryPanel({pid,price,per,tz:tz0,user}){
  const [res,act,pending]=useActionState(submitEnquiry,null);
  const [tab,setTab]=useState('enquiry');
  const [tz,setTz]=useState(tz0);
  const [day,setDay]=useState(0);
  const [slot,setSlot]=useState(null);   // {iso,label}
  const [slots,setSlots]=useState(null); // computed after mount so server and browser agree
  useEffect(()=>{setSlots(istSlots(day));setSlot(null)},[day]);
  useEffect(()=>{const d=[0,1,2,3,4,5,6].find(i=>istSlots(i).length);if(d)setDay(d)},[]);  // skip days with no slots left
  const e=res?.errors||{},v=res?.values||{};
  if(res?.ok)return(
    <div className="panel crop" role="status"><h3>Thank you, {res.name}.</h3>
      <p style={{margin:'8px 0'}}>{res.kind==='video_call'?`Your video call request for ${res.slotLabel} is in.`:'Your enquiry is in.'} Our team will reach you shortly{res.preferred&&res.kind!=='video_call'?' on '+res.preferred:''}.</p>
      <p className="mono">Reference {res.ref}</p></div>);
  return(
    <form className="panel crop" action={act} noValidate>
      <input type="hidden" name="propId" value={pid}/><input type="hidden" name="kind" value={tab==='call'?'video_call':'enquiry'}/>
      <input type="hidden" name="tz" value={tz}/><input type="hidden" name="slotAt" value={tab==='call'&&slot?slot.iso:''}/><input type="hidden" name="slotLabel" value={tab==='call'&&slot?slot.label:''}/>
      <div className="price num">{price}</div><div className="muted sm">{per} · Seller details stay private. Our team connects you.</div>
      <div className="tabs" role="tablist" style={{marginTop:14}}>
        <button type="button" role="tab" aria-selected={tab==='enquiry'} className={tab==='enquiry'?'on':''} onClick={()=>setTab('enquiry')}>Send enquiry</button>
        <button type="button" role="tab" aria-selected={tab==='call'} className={tab==='call'?'on':''} onClick={()=>setTab('call')}>Book video call</button>
      </div>
      <div className="stack" style={{gap:12}}>
        {e.form&&<div className="notice bad" role="alert">{e.form}</div>}
        <div className="field"><label htmlFor="eq-name">Your name</label><input id="eq-name" name="name" type="text" autoComplete="name" defaultValue={v.name??user?.name??''}/><div className="err">{e.name}</div></div>
        <div className="field"><label htmlFor="eq-email">Email</label><input id="eq-email" name="email" type="email" autoComplete="email" defaultValue={v.email??user?.email??''}/><div className="err">{e.email}</div></div>
        <div className="field"><label htmlFor="eq-phone">Phone or WhatsApp</label><div className="phone">
          <select name="code" aria-label="Country code" defaultValue={v.code??'+1'}>{CODES.map(c=><option key={c[0]} value={c[0]}>{c[0]} {c[1]}</option>)}</select>
          <input id="eq-phone" name="phone" type="tel" inputMode="tel" defaultValue={v.phone??''}/></div><div className="err">{e.phone}</div></div>
        <div className="field"><label htmlFor="eq-tz">Where do you live?</label><select id="eq-tz" value={tz} onChange={x=>setTz(x.target.value)}>{TZS.map(t=><option key={t[0]} value={t[0]}>{t[1]}</option>)}</select></div>
        <div hidden={tab!=='enquiry'} className="stack" style={{gap:12}}>
          <div className="field"><label htmlFor="eq-time">When do you plan to move?</label><select id="eq-time" name="timeline" defaultValue={v.timeline}><option>Within 3 months</option><option>3 to 6 months</option><option>6 to 12 months</option><option>Just exploring</option></select></div>
          <div className="field"><label htmlFor="eq-pref">Best way to reach you</label><select id="eq-pref" name="preferred" defaultValue={v.preferred}><option>WhatsApp</option><option>Phone call</option><option>Email</option></select></div>
          <div className="field"><label htmlFor="eq-msg">Message</label><textarea id="eq-msg" name="message" placeholder="Anything you want to know about this property" defaultValue={v.message}/></div>
        </div>
        <div hidden={tab!=='call'}>
          <div className="lbl" style={{marginBottom:8}}>Pick a slot. Times are shown in your time zone.</div>
          <div className="chips">{[0,1,2,3,4,5,6].map(i=><button type="button" key={i} className={'chipbtn'+(day===i?' on':'')} aria-pressed={day===i} onClick={()=>setDay(i)}>{istDayLabel(i)}</button>)}</div>
          <div className="slots" style={{marginTop:10}}>
            {slots===null?<p className="muted sm">Loading slots…</p>:slots.length?slots.map(s=>{const l=localSlot(s.iso,tz)+' ('+h12(s.ist)+' IST)';return(
              <button type="button" key={s.iso} className={'slot'+(slot?.iso===s.iso?' on':'')} onClick={()=>setSlot({iso:s.iso,label:l})}><b>{localSlot(s.iso,tz)}</b><small>{h12(s.ist)} IST</small></button>)}):<p className="muted sm">No slots left today. Pick another day.</p>}
          </div>
          <div className="err">{e.slot}</div>
        </div>
        <button className="btn block" type="submit" disabled={pending}>{pending?'Sending…':tab==='call'?'Request video call':'Send enquiry'}</button>
        <p className="muted sm">By sending this you agree to be contacted about this property.</p>
      </div>
    </form>
  );
}
