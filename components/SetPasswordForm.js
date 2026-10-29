'use client';
import {useActionState} from 'react';
import {setPasswordAction} from '@/app/actions.js';
export default function SetPasswordForm({email,name}){
  const [r,act,pending]=useActionState(setPasswordAction,null);
  return(<form action={act} className="panel stack" style={{gap:12}} noValidate>
    <div className="field"><label htmlFor="sp-email">Email</label><input id="sp-email" type="email" value={email} readOnly/></div>
    <div className="field"><label htmlFor="sp-name">Your name</label><input id="sp-name" name="name" type="text" defaultValue={name} autoComplete="name"/></div>
    <div className="field"><label htmlFor="sp-pw">Choose a password</label><input id="sp-pw" name="password" type="password" autoComplete="new-password" minLength={8}/></div>
    <div className="field"><label htmlFor="sp-pw2">Confirm password</label><input id="sp-pw2" name="confirm" type="password" autoComplete="new-password" minLength={8}/>{r?.error&&<div className="err" role="alert">{r.error}</div>}</div>
    <button className="btn" disabled={pending}>{pending?'Saving…':'Save password and continue'}</button>
    <p className="muted sm">At least 8 characters. Next time you can sign in with your email and this password.</p>
  </form>);
}
