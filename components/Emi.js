'use client';
import {useState} from 'react';
import {calcEmi,money,moneyFull} from '@/lib/format.js';
export default function Emi({price,cur}){
  const [down,setDown]=useState(30),[rate,setRate]=useState(9),[years,setYears]=useState(20);
  const c=calcEmi(price,down,rate,years);
  return(<>
    <div className="row">
      <div className="field"><label htmlFor="emi-d">Down payment: {down}%</label><input id="emi-d" type="range" min="10" max="80" step="5" value={down} onChange={e=>setDown(+e.target.value)}/></div>
      <div className="field"><label htmlFor="emi-r">Interest: {rate}%</label><input id="emi-r" type="range" min="6" max="12" step="0.25" value={rate} onChange={e=>setRate(+e.target.value)}/></div>
      <div className="field"><label htmlFor="emi-y">Tenure: {years} years</label><input id="emi-y" type="range" min="5" max="30" step="1" value={years} onChange={e=>setYears(+e.target.value)}/></div>
    </div>
    <div className="row" style={{gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',marginTop:14}} aria-live="polite">
      <div><span className="mono">Monthly EMI</span><div className="emi"><b className="num">{moneyFull(c.emi,cur)}</b></div></div>
      <div><span className="mono">Loan amount</span><div className="num"><b>{money(c.loan,cur)}</b></div></div>
      <div><span className="mono">Total interest</span><div className="num"><b>{money(c.interest,cur)}</b></div></div>
    </div>
  </>);
}
