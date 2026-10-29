import Link from 'next/link';
export default function NotFound(){
  return(<div className="wrap sec"><div className="empty"><h2>We could not find that page</h2><p style={{margin:'10px 0 16px'}}>The property may have been removed or is still waiting for review.</p><Link className="btn" href="/buy">Browse properties</Link></div></div>);
}
