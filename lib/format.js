// Shared formatting helpers. Every function takes the currency as an argument so server components can use the visitor's cookie.
import {STATES,CITIES,AREAS,CUR,DOCS} from './ref.js';

export const isLand=p=>p.type==='Plot'||p.type==='Farm land';
export const cityIdOf=p=>AREAS[p.area].c;
export const cityOf=p=>CITIES[cityIdOf(p)];
export const stateOf=p=>cityOf(p).s;

export function money(inr,cur='INR'){
  if(cur==='INR'){
    const tr=n=>n.toFixed(2).replace(/\.?0+$/,'');
    if(inr>=1e7)return'₹'+tr(inr/1e7)+' Cr';
    if(inr>=1e5)return'₹'+tr(inr/1e5)+' L';
    return'₹'+Math.round(inr).toLocaleString('en-IN');
  }
  const c=CUR[cur]||CUR.INR,v=inr*c.r;
  if(v>=1e6)return c.s+(v/1e6).toFixed(2)+'M';
  if(v>=1e3)return c.s+Math.round(v/1e3)+'K';
  return c.s+Math.round(v).toLocaleString('en-US');
}
export function moneyFull(inr,cur='INR'){
  const c=CUR[cur]||CUR.INR;
  return cur==='INR'?'₹'+Math.round(inr).toLocaleString('en-IN'):c.s+Math.round(inr*c.r).toLocaleString('en-US');
}
export function landLabel(p){
  const st=stateOf(p),ft=p.sqyd*9;
  if(p.type==='Farm land')return p.acres+' acres';
  if(st==='KL')return(ft/435.6).toFixed(1).replace(/\.0$/,'')+' cents';
  if(st==='TN')return Math.round(ft).toLocaleString('en-IN')+' sq ft';
  return p.sqyd+' sq yd';
}
export function perUnit(p,cur){
  if(!isLand(p))return money(p.price/p.sqft,cur)+' / sq ft';
  const st=stateOf(p),ft=p.sqyd*9;
  if(p.type==='Farm land')return money(p.price/p.acres,cur)+' / acre';
  if(st==='KL')return money(p.price/(ft/435.6),cur)+' / cent';
  if(st==='TN')return money(p.price/ft,cur)+' / sq ft';
  return money(p.price/p.sqyd,cur)+' / sq yd';
}
export const sizeLabel=p=>isLand(p)?landLabel(p):p.sqft.toLocaleString('en-IN')+' sq ft';
export const docLabel=(p,k)=>k==='land'?STATES[stateOf(p)].land:k==='rera'?STATES[stateOf(p)].rera+' registration':DOCS.find(d=>d[0]===k)[1];
export function pinXY(p){
  // deterministic jitter so pins in one area do not stack
  let a=7;for(const ch of String(p.id))a=(a*31+ch.charCodeAt(0))>>>0;
  const r=()=>{a=(a*1664525+1013904223)>>>0;return a/4294967296};
  const ar=AREAS[p.area];return[ar.x+(r()-.5)*6,ar.y+(r()-.5)*6];
}
export function calcEmi(price,downPct,rate,years){
  const loan=price*(1-downPct/100),r=rate/1200,n=years*12,emi=loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  return{loan,emi,interest:emi*n-loan};
}
export const BUDGETS=[2500000,5000000,10000000,20000000,50000000,100000000];
export const daysAgo=p=>p.posted<=1?'Today':p.posted+' days ago';
