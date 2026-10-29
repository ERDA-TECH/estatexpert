// Schematic SVG maps. They are strings so they can be rendered on the server.
import {AREAS,CITIES,STATES} from './ref.js';
import {pinXY} from './format.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const OUTLINE=[[19.4,78.0],[18.6,77.3],[17.6,76.0],[16.5,75.6],[15.4,74.6],[13.5,74.7],[12.5,74.9],[11.7,75.4],[10.8,75.9],[9.9,76.2],[9.0,76.5],[8.3,77.0],[8.1,77.5],[8.6,78.1],[9.3,78.9],[10.3,79.8],[11.3,79.8],[12.3,80.0],[13.3,80.3],[14.2,80.2],[15.2,80.4],[16.2,81.2],[16.9,82.3],[17.7,83.3],[18.5,84.1],[19.3,84.8],[19.6,83.0],[19.6,81.5],[19.5,79.5]];
const proj=(lat,lng)=>[17.8+(lng-74.5)/10*64.4,2+(19.8-lat)/11.8*76];

const pin=(href,x,y,label,aria,on)=>{const w=label.length*1.5+3;return`<a class="pin ${on?'on':''}" href="${esc(href)}" aria-label="${esc(aria)}"><rect x="${(x-w/2).toFixed(1)}" y="${(y-5).toFixed(1)}" width="${w.toFixed(1)}" height="3.8" rx="1.9"/><polygon points="${(x-.9).toFixed(1)},${(y-1.2).toFixed(1)} ${(x+.9).toFixed(1)},${(y-1.2).toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}"/><text x="${x.toFixed(1)}" y="${(y-2.2).toFixed(1)}">${esc(label)}</text></a>`};

// counts: { cityId: number of listings }, linkFor(cityId) -> href
export function southMap(counts,linkFor){
  let s=`<svg viewBox="0 0 100 80" role="img" aria-label="Schematic map of Telangana, Andhra Pradesh, Kerala and Tamil Nadu" preserveAspectRatio="xMidYMid meet"><rect class="m-bg" width="100" height="80"/><polygon class="m-land" points="${OUTLINE.map(([a,b])=>proj(a,b).map(n=>n.toFixed(1)).join(',')).join(' ')}"/>`;
  [['TG',17.9,78.6],['AP',15.6,79.4],['KL',10.4,76.6],['TN',11.6,78.4]].forEach(([k,la,lo])=>{const[x,y]=proj(la,lo);s+=`<text class="m-state" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle">${esc(STATES[k].n.toUpperCase())}</text>`});
  Object.keys(CITIES).forEach(id=>{const n=counts[id]||0;if(!n)return;const c=CITIES[id],[x,y]=proj(c.ll[0],c.ll[1]);s+=pin(linkFor(id),x,y,c.n+' '+n,`${c.n}, ${n} properties`,false)});
  return s+'</svg>';
}

// props: [{id,area,price label}], city: city id
export function cityMap(items,{city,static:isStatic,activeId}={}){
  const ty=y=>y*.8;
  let s=`<svg viewBox="0 0 100 80" role="img" aria-label="Schematic map of ${esc(city?CITIES[city].n:'the city')}" preserveAspectRatio="xMidYMid meet"><rect class="m-bg" width="100" height="80"/>`;
  s+=`<ellipse class="m-ring" cx="46" cy="${ty(52)}" rx="38" ry="${ty(46)}"/><ellipse class="m-ring" cx="46" cy="${ty(52)}" rx="22" ry="${ty(26)}"/><path class="m-river" d="M0 ${ty(60)} C20 ${ty(48)} 40 ${ty(58)} 60 ${ty(46)} S90 ${ty(44)} 100 ${ty(34)}"/><ellipse class="m-lake" cx="68" cy="${ty(40)}" rx="4.2" ry="2.6"/>`;
  s+=`<text class="m-area" x="2" y="4">${city?esc(CITIES[city].n)+', ':''}schematic, not to scale</text>`;
  Object.keys(AREAS).forEach(k=>{const a=AREAS[k];if(city&&a.c!==city)return;s+=`<circle cx="${a.x}" cy="${ty(a.y)}" r=".7" class="m-dot"/><text class="m-area" x="${a.x+1.2}" y="${(ty(a.y)+.8).toFixed(1)}">${esc(a.n)}</text>`});
  items.forEach(it=>{const[x,y]=pinXY(it.p);s+=isStatic
    ?pin('#',x,ty(y),it.label,it.aria,true).replace('<a ','<a pointer-events="none" ')
    :pin(`/property/${it.p.id}`,x,ty(y),it.label,it.aria,it.p.id===activeId)});
  return s+'</svg>';
}
