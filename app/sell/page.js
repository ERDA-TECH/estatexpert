import Link from 'next/link';
import SellForm from '@/components/SellForm';
import {getUser} from '@/lib/db/index.js';
export const metadata={title:'List your property'};
export default async function Sell(){
  const user=await getUser();
  return(
    <div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link> / Sell</div>
      <div className="sec-head"><div><h2>List your property</h2><p>Four short steps. We review your papers, add professional photos and bring serious buyers from overseas. Your phone number is never shown to buyers.</p></div></div>
      {!user&&<div className="notice" style={{marginBottom:14}}><b>You will need to sign in to submit.</b> <Link href="/login?next=/sell">Sign in first</Link> to keep your details.</div>}
      <div className="detail" style={{gridTemplateColumns:'minmax(0,1fr) 340px'}}>
        <SellForm user={user?{name:user.name,email:user.email}:null}/>
        <aside className="stack">
          <div className="panel"><h3>Why list here</h3><ul style={{paddingLeft:18,margin:'10px 0 0',display:'grid',gap:8}}><li>Buyers abroad who are ready to move</li><li>Document check and a site visit by our partner in your city</li><li>Your number stays private</li><li>Free to list. A service fee applies only on a completed sale (sample).</li></ul></div>
          <div className="panel"><h3>What happens next</h3><ol style={{paddingLeft:18,margin:'10px 0 0',display:'grid',gap:8}}><li>We review within two working days</li><li>You see it under My account, then it goes live</li><li>Enquiries reach our team, who share them with you</li></ol></div>
        </aside>
      </div>
    </div>
  );
}
