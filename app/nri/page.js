import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import {STATES,FAQ} from '@/lib/ref.js';
import {getTz} from '@/lib/ctx.js';
export const metadata={title:'NRI services'};
const SVC=[["LV", "Legal verification", "A lawyer checks title, encumbrance and approvals before you pay anything."], ["PA", "Power of Attorney", "Draft, notarise and register a PoA so a trusted person can sign for you."], ["RG", "Registration and stamp duty", "We book the sub-registrar slot and prepare the documents."], ["TX", "Tax and repatriation", "Guidance on TDS, capital gains and moving funds back abroad."], ["PM", "Property management", "Rent collection, repairs and yearly tax payments while you are away."], ["HL", "Home loan help", "Compare lenders that offer NRI home loans and prepare your file."]];
const LIST=['Passport copy and visa or residence proof','PAN card','NRE or NRO bank account details','Overseas address proof','Passport size photographs','Power of Attorney (if you are not travelling)','Aadhaar of the Power of Attorney holder'];
const STEPS=['Shortlist and book a video walkthrough','Lawyer verifies the papers','Agree price, pay a token amount','Sign the sale agreement','Register at the sub-registrar office','Handover and property management'];
const ROWS=[['Flat, villa, independent house',true,'Residential property is open to NRIs.'],['Commercial office or shop',true,'Rental income can be repatriated, subject to tax rules.'],['Residential plot',true,'Approved layouts only. Check HMDA or DTCP approval.'],['Agricultural land',false,'Reserved for resident Indians.'],['Plantation or farmhouse',false,'Same restriction as agricultural land.']];
const DIFF=[['TG','HMDA, DTCP, GHMC','sq yd'],['AP','APCRDA, VUDA, DTCP','sq yd'],['KL','Local body building permit','cents (1 cent = 435.6 sq ft)'],['TN','CMDA, DTCP','sq ft (1 ground = 2,400 sq ft)']];
export default async function Nri(){
  const tz=await getTz();
  return(
  <div className="wrap"><div className="crumbs"><Link href="/">Home</Link> / NRI services</div>
    <div className="sec-head"><div><h2>Buying from abroad, without the guesswork</h2><p>The paperwork is the part that worries families most. These services take it off your plate. Fees and timelines are placeholders.</p></div><a className="btn accent" href="#consult">Book a free consultation</a></div>
    <div className="cards3">{SVC.map(s=><div className="svc" key={s[0]}><div className="ic">{s[0]}</div><h3>{s[1]}</h3><p className="muted">{s[2]}</p></div>)}</div>
    <section className="sec tight"><div className="sec-head"><div><h2>What can an NRI buy?</h2><p>Rules can change. Always confirm with a lawyer before paying.</p></div></div>
      <div className="scroll"><table className="t"><thead><tr><th>Property</th><th>NRI can buy</th><th>Note</th></tr></thead><tbody>{ROWS.map(r=><tr key={r[0]}><td>{r[0]}</td><td><span className={'chip '+(r[1]?'ok':'bad')}>{r[1]?'Yes':'No'}</span></td><td>{r[2]}</td></tr>)}</tbody></table></div></section>
    <section className="sec tight"><div className="sec-head"><div><h2>How each state differs</h2><p>We show the right papers and units on every listing. Details are sample content to be confirmed with local lawyers.</p></div></div>
      <div className="scroll"><table className="t"><thead><tr><th>State</th><th>Land record</th><th>RERA authority</th><th>Common approvals</th><th>Land unit shown</th></tr></thead><tbody>{DIFF.map(([k,a,u])=><tr key={k}><td><b>{STATES[k].n}</b></td><td>{STATES[k].land}</td><td>{STATES[k].rera}</td><td>{a}</td><td>{u}</td></tr>)}</tbody></table></div></section>
    <section className="sec tight"><div className="sec-head"><div><h2>Six steps from video call to keys</h2></div></div><div className="steps">{STEPS.map((s,i)=><div className="step" key={s}><span className="mono"><b>Step {i+1}</b></span><h3>{s}</h3></div>)}</div></section>
    <section className="sec tight"><div className="detail" style={{gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)'}}>
      <div className="panel"><h3>Document checklist</h3><ul style={{paddingLeft:18,margin:'10px 0 0',display:'grid',gap:8}}>{LIST.map(l=><li key={l}>{l}</li>)}</ul></div>
      <div><h3 style={{marginBottom:10}}>Questions we hear most</h3>{FAQ.map(f=><details className="faq" key={f[0]}><summary>{f[0]}</summary><div>{f[1]}</div></details>)}</div></div></section>
    <section className="sec tight" id="consult"><ContactForm kind="nri_consult" tz={tz} button="Request a call" title="Book a free consultation" intro="Tell us what you need. We call you at a time that suits your time zone." topics={SVC.map(s=>s[1])}/></section>
  </div>);
}
