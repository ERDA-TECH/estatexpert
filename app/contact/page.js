import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import Clocks from '@/components/Clocks';
import {getTz} from '@/lib/ctx.js';
export const metadata={title:'Contact'};
export default async function Contact(){
  const tz=await getTz();
  return(
    <div className="wrap"><div className="crumbs"><Link href="/">Home</Link> / Contact</div>
      <div className="detail" style={{gridTemplateColumns:'minmax(0,1fr) 380px'}}>
        <div><h2>Talk to our team</h2><p className="muted" style={{margin:'8px 0 18px',maxWidth:'56ch'}}>Send a message and we reply within one working day. Prefer to talk? Check the clocks and call when both of us are awake.</p>
          <ContactForm kind="contact" tz={tz} button="Send message" topics={['Buying a property','Selling a property','NRI services','Something else']}/></div>
        <aside className="stack">
          <div className="panel"><h3>Right now</h3><div style={{marginTop:12}}><Clocks tz={tz}/></div></div>
          <div className="panel"><h3>Office (sample)</h3><p className="muted" style={{marginTop:8}}>Hyderabad · Visakhapatnam · Kochi · Chennai<br/>+91 00000 00000<br/>hello@example.com<br/>Mon to Sat, 10:00 to 19:00 IST</p></div>
        </aside>
      </div>
    </div>
  );
}
