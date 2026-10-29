'use client';
import {useActionState,useState} from 'react';
import {sendMagicLink,passwordLogin} from '@/app/actions.js';

// Modes: signin (email + password), signup (name + email, then a link to set the password), forgot (email, link to reset)
export default function LoginForm({next}){
  const [mode,setMode]=useState('signin');
  const [r,act,pending]=useActionState(sendMagicLink,null);
  const [p,pact,ppending]=useActionState(passwordLogin,null);
  const go=m=>()=>setMode(m);
  if(mode!=='signin'&&r?.sent)return(
    <div className="notice" role="status"><b>Check your inbox.</b> We sent a link to {r.sent}. Open it, choose a password, and you go straight to your dashboard. The link works once and expires soon.</div>);
  return(<div className="stack" style={{gap:12}}>
    {mode==='signin'?(
      <form action={pact} className="panel stack" style={{gap:12}} noValidate>
        <input type="hidden" name="next" value={next}/>
        <div className="field"><label htmlFor="p-email">Email</label><input id="p-email" name="email" type="email" autoComplete="email"/></div>
        <div className="field"><label htmlFor="p-pass">Password</label><input id="p-pass" name="password" type="password" autoComplete="current-password"/>{p?.error&&<div className="err" role="alert">{p.error}</div>}</div>
        <button className="btn" disabled={ppending}>{ppending?'Signing in…':'Sign in'}</button>
      </form>
    ):(
      <form action={act} className="panel stack" style={{gap:12}} noValidate>
        <input type="hidden" name="mode" value={mode}/>
        <h3>{mode==='signup'?'Create your account':'Reset your password'}</h3>
        {mode==='signup'&&<div className="field"><label htmlFor="l-name">Your name</label><input id="l-name" name="name" type="text" autoComplete="name"/></div>}
        <div className="field"><label htmlFor="l-email">Email</label><input id="l-email" name="email" type="email" autoComplete="email"/>{r?.error&&<div className="err" role="alert">{r.error}</div>}</div>
        <button className="btn" disabled={pending}>{pending?'Sending…':mode==='signup'?'Email me a link to continue':'Email me a reset link'}</button>
      </form>
    )}
    <div style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center'}}>
      {mode!=='signin'&&<button type="button" className="link" onClick={go('signin')}>Back to sign in</button>}
      {mode==='signin'&&<button type="button" className="link" onClick={go('signup')}>Create an account</button>}
      {mode==='signin'&&<button type="button" className="link" onClick={go('forgot')}>Forgot password?</button>}
    </div>
  </div>);
}
