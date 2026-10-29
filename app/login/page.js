import {redirect} from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import {demoLogin} from '@/app/actions.js';
import {getUser,hasSupabase} from '@/lib/db/index.js';

export const metadata={title:'Sign in'};
export default async function Login({searchParams}){
  const sp=await searchParams,next=typeof sp.next==='string'&&sp.next.startsWith('/')&&!sp.next.startsWith('//')?sp.next:'/account';
  if(await getUser())redirect(next);
  return(
    <div className="wrap sec" style={{maxWidth:560}}>
      <h2>Sign in</h2>
      {hasSupabase()?(<>
        <p className="muted" style={{margin:'8px 0 18px'}}>Enter your email and we send you a sign-in link. No password to remember. A new address creates your account.</p>
        <LoginForm next={next}/>
      </>):(<>
        <p className="muted" style={{margin:'8px 0 18px'}}>Demo mode has no real accounts. Pick a role to explore the site as that person.</p>
        <div className="stack" style={{gap:12}}>
          {[['buyer','Buyer','Save properties, send enquiries, set alerts.'],['seller','Seller','List a property and follow its review.'],['admin','Admin','Approve listings, update document checks, work the leads.']].map(([r,t,d])=>(
            <form key={r} action={demoLogin} className="panel" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
              <input type="hidden" name="role" value={r}/><input type="hidden" name="next" value={r==='admin'&&next==='/account'?'/admin':next}/>
              <div><b>{t}</b><div className="muted sm">{d}</div></div><button className="btn" type="submit">Continue as {t.toLowerCase()}</button>
            </form>))}
        </div>
      </>)}
    </div>
  );
}
