'use client';
import {useActionState,useState} from 'react';
import {submitContact} from '@/app/actions.js';
import {TZS} from '@/lib/ref.js';
export default function ContactForm({kind='contact',tz,topics,title,intro,button}){
  const [r,act,pending]=useActionState(submitContact,null);
  const [t,setT]=useState(tz);
  const e=r?.errors||{};
  if(r?.ok)return<div className="panel notice" role="status"><b>Thank you.</b> We received your request and will reply within one working day.</div>;
  return(
    <form className="panel crop" action={act} noValidate style={{maxWidth:720}}>
      {title&&<h2 style={{fontSize:'1.5rem'}}>{title}</h2>}{intro&&<p className="muted" style={{margin:'6px 0 14px'}}>{intro}</p>}
      <input type="hidden" name="kind" value={kind}/><input type="hidden" name="tz" value={t}/>
      <div className="stack" style={{gap:12}}>
        {e.form&&<div className="notice bad" role="alert">{e.form}</div>}
        <div className="row two">
          <div className="field"><label htmlFor={kind+'-name'}>Name</label><input id={kind+'-name'} name="name" type="text" autoComplete="name"/><div className="err">{e.name}</div></div>
          <div className="field"><label htmlFor={kind+'-email'}>Email</label><input id={kind+'-email'} name="email" type="email" autoComplete="email"/><div className="err">{e.email}</div></div>
        </div>
        <div className="row two">
          <div className="field"><label htmlFor={kind+'-topic'}>{kind==='nri_consult'?'What do you need help with?':'Topic'}</label><select id={kind+'-topic'} name="topic">{topics.map(x=><option key={x}>{x}</option>)}</select></div>
          {kind==='nri_consult'&&<div className="field"><label htmlFor="nri-tz">Your time zone</label><select id="nri-tz" value={t} onChange={x=>setT(x.target.value)}>{TZS.map(z=><option key={z[0]} value={z[0]}>{z[1]}</option>)}</select></div>}
        </div>
        {kind==='contact'&&<div className="field"><label htmlFor="c-msg">Message</label><textarea id="c-msg" name="message"/><div className="err">{e.message}</div></div>}
        <button className="btn" disabled={pending}>{pending?'Sending…':button}</button>
      </div>
    </form>
  );
}
