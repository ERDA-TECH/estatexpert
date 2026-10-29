'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
const NAV=[['/','Home'],['/buy','Buy'],['/sell','Sell'],['/nri','NRI services'],['/contact','Contact']];
export default function NavLinks({saved=0}){
  const p=usePathname();
  const on=h=>h==='/'?p==='/':p===h||p.startsWith(h+'/')||(h==='/buy'&&p.startsWith('/property'));
  return(<nav className="nav" aria-label="Main">
    {NAV.map(([h,l])=><Link key={h} href={h} className={on(h)?'on':''}>{l}</Link>)}
    <Link href="/account" className={on('/account')?'on':''}>My account{saved?` (${saved})`:''}</Link>
  </nav>);
}
