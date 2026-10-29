'use client';
import {useActionState} from 'react';
import {createTeamUser} from '@/app/actions.js';
export default function TeamForm(){
  const [r,act,pending]=useActionState(createTeamUser,null);
  return(<form action={act} className="panel stack" style={{gap:12}} noValidate>
    <h3>Create an account</h3>
    <p className="muted sm">Creates a ready-to-use login (no email needed). Share the email and password with the person; they can change the password later.</p>
    {r?.error&&<div className="notice bad" role="alert">{r.error}</div>}
    {r?.ok&&<div className="notice" role="status"><b>Account created.</b> Share these details:<br/>Email: <b>{r.email}</b><br/>Password: <b>{r.password}</b><br/>Role: {r.role}</div>}
    <div className="row two">
      <div className="field"><label htmlFor="t-name">Name</label><input id="t-name" name="name" type="text"/></div>
      <div className="field"><label htmlFor="t-email">Email</label><input id="t-email" name="email" type="email"/></div>
    </div>
    <div className="row two">
      <div className="field"><label htmlFor="t-pw">Password</label><input id="t-pw" name="password" type="text" autoComplete="off" placeholder="At least 8 characters"/></div>
      <div className="field"><label htmlFor="t-role">Role</label><select id="t-role" name="role" defaultValue="admin"><option value="admin">Admin</option><option value="seller">Seller</option><option value="buyer">Buyer</option></select></div>
    </div>
    <button className="btn" disabled={pending}>{pending?'Creating…':'Create account'}</button>
  </form>);
}
