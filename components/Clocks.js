'use client';
import {useEffect,useState} from 'react';
import {TZS} from '@/lib/ref.js';
import {clockStr,callHint} from '@/lib/time.js';
import {setTimeZone} from '@/app/actions.js';

export default function Clocks({tz:initial}){
  const [tz,setTz]=useState(initial);
  const [now,setNow]=useState(null);
  useEffect(()=>{
    const tick=()=>setNow({h:clockStr('Asia/Kolkata'),u:clockStr(tz),hint:callHint(tz)});
    tick();const t=setInterval(tick,20000);return()=>clearInterval(t);
  },[tz]);
  return(
    <div className="clocks" aria-label="Time in India and your city">
      <div className="clock"><span className="mono">India</span><b className="num">{now?.h||'--:--'}</b></div>
      <div className="clock">
        <select aria-label="Your city" value={tz} onChange={e=>{setTz(e.target.value);setTimeZone(e.target.value)}}>{TZS.map(t=><option key={t[0]} value={t[0]}>{t[1]}</option>)}</select>
        <b className="num">{now?.u||'--:--'}</b>
      </div>
      <div className={'callhint '+(now?.hint.ok?'':'muted')} aria-live="polite">{now?.hint.text||''}</div>
    </div>
  );
}
