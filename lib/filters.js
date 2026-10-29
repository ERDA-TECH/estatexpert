// One filter function used by every data source, so the demo and Supabase modes behave the same.
import {AREAS,CITIES} from './ref.js';

export function parseFilters(sp={}){
  const arr=v=>v==null?[]:Array.isArray(v)?v:[v];
  const num=v=>{const n=Number(Array.isArray(v)?v[0]:v);return Number.isFinite(n)?n:0};
  const one=v=>Array.isArray(v)?v[0]:v;
  return{
    q:(one(sp.q)||'').trim(),state:one(sp.state)||'',city:one(sp.city)||'',area:one(sp.area)||'',
    types:arr(sp.type),beds:arr(sp.beds).map(Number).filter(Boolean),min:num(sp.min),max:num(sp.max),
    verified:one(sp.verified)==='1',nri:one(sp.nri)==='1',sort:one(sp.sort)||'new',view:one(sp.view)||'grid'
  };
}
export function applyFilters(list,f){
  const out=list.filter(p=>{
    const a=AREAS[p.area];if(!a)return false;const c=a.c,st=CITIES[c].s;
    if(f.q&&!(p.title+' '+a.n+' '+CITIES[c].n+' '+p.type).toLowerCase().includes(f.q.toLowerCase()))return false;
    if(f.state&&st!==f.state)return false;
    if(f.city&&c!==f.city)return false;
    if(f.area&&p.area!==f.area)return false;
    if(f.types.length&&!f.types.includes(p.type))return false;
    if(f.beds.length&&!(p.beds&&f.beds.some(b=>b>=5?p.beds>=5:p.beds===b)))return false;
    if(f.min&&p.price<f.min)return false;
    if(f.max&&p.price>f.max)return false;
    if(f.verified&&!p.verified)return false;
    if(f.nri&&!p.nri)return false;
    return true;
  });
  const s=f.sort;
  return out.sort((x,y)=>s==='low'?x.price-y.price:s==='high'?y.price-x.price:s==='size'?y.sqft-x.sqft:x.posted-y.posted);
}
