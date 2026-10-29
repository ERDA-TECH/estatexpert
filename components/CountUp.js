'use client';
import {useEffect,useRef} from 'react';
export default function CountUp({n}){
  const r=useRef(null);
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let raf;const t0=performance.now();
    const step=t=>{const k=Math.min(1,(t-t0)/900);if(r.current)r.current.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)raf=requestAnimationFrame(step)};
    raf=requestAnimationFrame(step);return()=>cancelAnimationFrame(raf);
  },[n]);
  return <b ref={r}>{n}</b>;
}
