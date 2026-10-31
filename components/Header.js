import Link from 'next/link';
import Logo from './Logo';
import NavLinks from './NavLinks';
import CurrencySelect from './CurrencySelect';
import {getRepo} from '@/lib/db/index.js';
import {getCur} from '@/lib/ctx.js';
import {signOut} from '@/app/actions.js';

export default async function Header(){
  const [{repo,user},cur]=await Promise.all([getRepo(),getCur()]);
  const saved=user?(await repo.savedIds()).length:0;
  return(
    <header className="top"><div className="wrap bar">
      <Link className="logo" href="/" aria-label="estateXpert home"><Logo/></Link>
      <NavLinks saved={saved}/>
      <div className="tools">
        <CurrencySelect value={cur}/>
        {user?(<>
          {user.role==='admin'&&<Link className="btn ghost sm" href="/admin">Admin</Link>}
          <Link className="btn sm uname" href="/account" title="Open my dashboard">{(user.name||user.email||'Account').split(' ')[0]}</Link>
          <form action={signOut}><button className="btn ghost sm" type="submit">Sign out</button></form>
        </>):<Link className="btn sm" href="/login">Sign in</Link>}
      </div>
    </div></header>
  );
}
