import Link from 'next/link';
import Logo from './Logo';
export default function Footer(){
  return(<footer><div className="wrap"><div className="foot">
    <div><div className="logo"><Logo/></div><p className="muted sm" style={{marginTop:10,maxWidth:'34ch'}}>Resale homes, plots and offices across Telangana, Andhra Pradesh, Kerala and Tamil Nadu for families who plan to settle from overseas.</p></div>
    <div><h4>Explore</h4><Link href="/buy">Buy property</Link><Link href="/sell">Sell your property</Link><Link href="/nri">NRI services</Link></div>
    <div><h4>Account</h4><Link href="/account">Saved and enquiries</Link><Link href="/admin">Admin</Link><Link href="/contact">Contact</Link></div>
    <div><h4>Offices (sample)</h4><p className="sm muted">Hyderabad · Visakhapatnam · Vijayawada<br/>Kochi · Thiruvananthapuram<br/>Chennai · Coimbatore<br/>+91 00000 00000 · hello@example.com<br/>Mon to Sat, 10:00 to 19:00 IST</p></div>
  </div><div className="legal">Prices are indicative and in Indian rupees unless you change the currency. Exchange rates are fixed sample values. Check foreign exchange and property rules for NRIs with a qualified adviser before you pay a token amount.</div></div></footer>);
}
