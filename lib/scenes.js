import {rng} from './art.js';
/* ---------- animated hero scenes, one per state ---------- */
const SCENES={
TG(){
  const R=rng(21);let s='';
  s+=`<g class="cl"><ellipse cx="90" cy="70" rx="46" ry="9"/><ellipse cx="120" cy="64" rx="30" ry="8"/></g><g class="cl c2"><ellipse cx="470" cy="46" rx="52" ry="9"/><ellipse cx="505" cy="40" rx="30" ry="7"/></g>`;
  for(let i=0;i<13;i++){const h=60+R()*100;s+=`<rect class="sil2" x="${i*48-14}" y="${300-h}" width="38" height="${h}"/>`}
  s+=`<g class="sil"><rect x="196" y="206" width="170" height="96"/><rect x="190" y="198" width="182" height="10"/>`;
  [[184,16,112],[350,16,112],[214,12,140],[324,12,140]].forEach(([x,w,t])=>{s+=`<rect x="${x}" y="${t}" width="${w}" height="${302-t}"/><rect x="${x-4}" y="${t+34}" width="${w+8}" height="6"/><rect x="${x-4}" y="${t+66}" width="${w+8}" height="6"/><circle cx="${x+w/2}" cy="${t-4}" r="${w/2+3}"/><rect x="${x+w/2-1}" y="${t-28}" width="2" height="20"/>`});
  s+=`</g>`;
  [[212,40],[262,40],[312,40]].forEach(([x,w],i)=>{s+=`<path class="lit tw" style="animation-delay:${i*.7}s" d="M${x} 302 v-50 a${w/2} ${w/2} 0 0 1 ${w} 0 v50z"/>`});
  for(let i=0;i<6;i++){const h=100+R()*90,x=398+i*30;s+=`<rect class="sil" x="${x}" y="${302-h}" width="24" height="${h}"/>`;for(let y=302-h+8;y<292;y+=15)if(R()>.35)s+=`<rect class="win tw" style="animation-delay:${(R()*3).toFixed(1)}s" x="${x+5}" y="${y}" width="5" height="6"/><rect class="win tw" style="animation-delay:${(R()*3).toFixed(1)}s" x="${x+14}" y="${y}" width="5" height="6"/>`}
  s+=`<rect class="sil" x="0" y="300" width="600" height="60"/>`;
  return s;
},
AP(){
  let s=`<g class="cl"><ellipse cx="120" cy="60" rx="50" ry="9"/></g><g class="cl c2"><ellipse cx="430" cy="84" rx="56" ry="9"/></g>`;
  s+=`<path class="sil2" d="M0 260 Q70 150 160 190 T300 250 L300 330 L0 330z"/><path class="sil" d="M0 280 Q60 200 140 214 Q200 224 250 270 L250 330 L0 330z"/>`;
  s+=`<g class="sil"><path d="M96 212 l10 -78 h14 l10 78z"/><rect x="100" y="120" width="26" height="14"/><rect x="104" y="108" width="18" height="12"/><path d="M104 108 l9 -14 l9 14z"/></g><circle class="lit tw" cx="113" cy="127" r="4"/><g class="beam"><path d="M113 127 L600 90 L600 164z"/></g>`;
  s+=`<rect class="sea" x="0" y="268" width="600" height="92"/>`;
  for(let i=0;i<7;i++)s+=`<path class="wave" style="animation-delay:${i*.6}s" d="M${20+i*86} ${288+(i%3)*18} q14 -8 28 0 t28 0 t28 0"/>`;
  s+=`<g class="ship"><path class="sil" d="M360 258 h90 l-12 18 h-70z"/><rect class="sil" x="380" y="238" width="36" height="20"/><rect class="sil" x="398" y="224" width="6" height="14"/><rect class="win" x="386" y="244" width="6" height="5"/><rect class="win" x="398" y="244" width="6" height="5"/><rect class="win" x="410" y="244" width="6" height="5"/></g>`;
  for(let i=0;i<4;i++){const h=60+i*18,x=470+i*30;s+=`<rect class="sil" x="${x}" y="${268-h}" width="24" height="${h}"/>`;for(let y=268-h+8;y<258;y+=14)s+=`<rect class="win tw" style="animation-delay:${(i*.5+y/90).toFixed(1)}s" x="${x+5}" y="${y}" width="5" height="6"/><rect class="win tw" style="animation-delay:${(i*.4+y/70).toFixed(1)}s" x="${x+14}" y="${y}" width="5" height="6"/>`}
  s+=`<rect class="sil" x="0" y="330" width="600" height="30"/>`;
  return s;
},
KL(){
  let s=`<g class="cl"><ellipse cx="150" cy="56" rx="48" ry="8"/></g><g class="cl c2"><ellipse cx="460" cy="74" rx="56" ry="9"/></g>`;
  const palm=(x,y,k,d)=>`<g class="palm" style="animation-delay:${d}s"><path class="stem" d="M${x} ${y} q${10*k} ${-70*k} ${4*k} ${-130*k}"/>`+[[-70,-10],[-45,-34],[-15,-44],[20,-44],[48,-30],[72,-8]].map(([a,b])=>`<path class="frond" d="M${x+4*k} ${y-130*k} q${a*.5*k} ${b*k} ${a*k} ${(b+34)*k}"/>`).join('')+`</g>`;
  s+=`<path class="sil2" d="M0 250 q40 -30 80 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 V300 H0z"/>`;
  s+=palm(40,270,.55,0)+palm(90,272,.45,.8)+palm(520,270,.55,.4)+palm(570,272,.45,1.2);
  s+=`<rect class="sea" x="0" y="268" width="600" height="92"/>`;
  for(let i=0;i<8;i++)s+=`<path class="wave" style="animation-delay:${i*.5}s" d="M${10+i*76} ${290+(i%3)*18} q12 -7 24 0 t24 0 t24 0"/>`;
  s+=`<g class="boat"><path class="sil" d="M190 276 q10 18 40 18 h140 q30 0 40 -18z"/><path class="sil" d="M214 276 v-24 q86 -52 172 0 v24z"/><rect class="lit tw" x="236" y="262" width="22" height="10"/><rect class="lit tw" style="animation-delay:.6s" x="282" y="262" width="22" height="10"/><rect class="lit tw" style="animation-delay:1.2s" x="328" y="262" width="22" height="10"/><rect class="sil" x="296" y="224" width="4" height="22"/></g>`;
  s+=palm(300,330,.9,.3)+palm(360,336,.7,1);
  s+=`<rect class="sil" x="0" y="338" width="600" height="22"/>`;
  return s;
},
TN(){
  let s=`<g class="cl"><ellipse cx="100" cy="64" rx="48" ry="9"/></g><g class="cl c2"><ellipse cx="480" cy="52" rx="52" ry="8"/></g>`;
  for(let i=0;i<9;i++){const h=40+((i*37)%50);s+=`<rect class="sil2" x="${i*72-10}" y="${300-h}" width="60" height="${h}"/>`}
  const cx=300;let y=300,w=210;
  s+=`<g class="sil"><rect x="${cx-w/2-30}" y="276" width="${w+60}" height="26"/>`;
  for(let t=0;t<7;t++){const h=26-t*1.5,w2=w-t*24;s+=`<path d="M${cx-w2/2} ${y} h${w2} l-8 -${h} h-${w2-16} z"/>`;y-=h}
  s+=`<rect x="${cx-12}" y="${y-18}" width="24" height="18"/><circle cx="${cx-9}" cy="${y-20}" r="4"/><circle cx="${cx}" cy="${y-22}" r="4"/><circle cx="${cx+9}" cy="${y-20}" r="4"/></g>`;
  y=300;for(let t=0;t<7;t++){const h=26-t*1.5,w2=w-t*24;for(let k=0;k<Math.max(2,6-t);k++){s+=`<rect class="win tw" style="animation-delay:${((t+k)*.37%3).toFixed(1)}s" x="${cx-(Math.max(2,6-t)*10)+k*20+4}" y="${y-h+7}" width="6" height="8"/>`}y-=h}
  [[40,0],[540,.9],[84,.5]].forEach(([x,d],i)=>{s+=`<g class="palm" style="animation-delay:${d}s"><path class="stem" d="M${x} 302 q8 -60 3 -108"/>`+[[-60,-8],[-38,-30],[-10,-38],[20,-36],[44,-24],[62,-4]].map(([a,b])=>`<path class="frond" d="M${x+3} 194 q${a*.5} ${b} ${a} ${b+30}"/>`).join('')+`</g>`});
  for(let i=0;i<5;i++){s+=`<g class="bird" style="animation-delay:${i*1.3}s"><path d="M0 0 q6 -7 12 0 q6 -7 12 0"/></g>`}
  s+=`<rect class="sil" x="0" y="300" width="600" height="60"/>`;
  return s;
}};

export {SCENES};
