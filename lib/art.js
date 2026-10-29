import {landLabel} from './format.js';
/* ---------- generated illustrations (stand-ins for real photos) ---------- */
const hsl=(h,s,l)=>`hsl(${Math.round(((h%360)+360)%360)} ${s}% ${l}%)`;
const hash=s=>{let a=7;for(const c of String(s))a=(a*31+c.charCodeAt(0))>>>0;return a};
const rng=seed=>{let a=seed|0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const skyBg=(h,t)=>`<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hsl(h,60,74)}"/><stop offset="1" stop-color="${hsl(h+20,75,92)}"/></linearGradient></defs><rect width="800" height="520" fill="url(#s)"/><circle cx="${600+t%90}" cy="92" r="32" fill="${hsl(42,95,80)}"/>`;
const tree=(x,y,k,c)=>`<rect x="${x-3*k}" y="${y-30*k}" width="${6*k}" height="${30*k}" fill="${hsl(25,30,30)}"/><circle cx="${x}" cy="${y-46*k}" r="${24*k}" fill="${c}"/><circle cx="${x-14*k}" cy="${y-33*k}" r="${17*k}" fill="${c}"/><circle cx="${x+14*k}" cy="${y-33*k}" r="${17*k}" fill="${c}"/>`;
const palm=(x,y,k)=>{let s=`<path d="M${x} ${y} q${6*k} ${-60*k} ${2*k} ${-110*k}" stroke="${hsl(28,30,32)}" stroke-width="${6*k}" fill="none"/>`;for(let i=0;i<6;i++){const a=-30+i*36;s+=`<path d="M${x+2*k} ${y-110*k} q${Math.cos(a*Math.PI/180)*40*k} ${-30*k+Math.sin(a*Math.PI/180)*30*k} ${Math.cos(a*Math.PI/180)*70*k} ${Math.sin(a*Math.PI/180)*20*k+8*k}" stroke="${hsl(130,40,30)}" stroke-width="${7*k}" fill="none" stroke-linecap="round"/>`}return s};
const lawn=h=>hsl(132,30,40);
const road=()=>`<rect y="448" width="800" height="72" fill="${hsl(215,8,34)}"/><rect x="0" y="482" width="800" height="4" fill="${hsl(48,80,72)}" opacity=".55"/>`;

const ART={
exterior(p){
  const h=170+(p.hue%70),t=hash(p.id),R=rng(t);let s=skyBg(h,t);
  if(p.type==='Flat'){
    s+=`<rect y="410" width="800" height="110" fill="${lawn()}"/>`;
    [[50,190,120,230],[620,140,130,280],[190,250,90,160]].forEach(([x,y,w,hh])=>{s+=`<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${hsl(h,22,76)}"/>`;for(let yy=y+14;yy<y+hh-12;yy+=24)for(let xx=x+12;xx<x+w-14;xx+=22)s+=`<rect x="${xx}" y="${yy}" width="10" height="12" fill="${hsl(h,30,62)}"/>`});
    s+=`<rect x="300" y="56" width="230" height="354" fill="${hsl(h,30,94)}"/><rect x="300" y="56" width="230" height="14" fill="${hsl(h,40,36)}"/>`;
    for(let r=0;r<12;r++){const y=84+r*27;for(let c=0;c<5;c++){const lit=R()>.72;s+=`<rect x="${314+c*42}" y="${y}" width="32" height="19" fill="${lit?hsl(45,90,72):hsl(h+170,35,38)}"/>`}s+=`<rect x="306" y="${y+20}" width="218" height="3" fill="${hsl(h,20,70)}"/>`}
    s+=`<rect x="380" y="374" width="70" height="36" fill="${hsl(h+170,35,28)}"/>`+tree(250,430,1.1,hsl(135,40,30))+tree(590,432,1.2,hsl(140,38,28))+tree(700,428,.9,hsl(130,40,34))+road();
  }else if(p.type==='Villa'){
    s+=`<rect y="400" width="800" height="120" fill="${lawn()}"/><polygon points="330,520 470,520 440,404 360,404" fill="${hsl(35,10,72)}"/>`;
    s+=`<rect x="130" y="262" width="540" height="150" fill="${hsl(h,16,93)}"/><rect x="220" y="150" width="430" height="112" fill="${hsl(h,26,84)}"/><rect x="200" y="250" width="480" height="14" fill="${hsl(h,30,30)}"/><rect x="205" y="140" width="460" height="12" fill="${hsl(h,30,30)}"/>`;
    s+=`<rect x="240" y="170" width="170" height="68" fill="${hsl(h+170,40,40)}"/><rect x="430" y="170" width="200" height="68" fill="${hsl(h+170,40,46)}"/><line x1="325" y1="170" x2="325" y2="238" stroke="${hsl(h,30,90)}" stroke-width="4"/>`;
    s+=`<rect x="160" y="290" width="240" height="108" fill="${hsl(h+170,40,36)}"/><rect x="415" y="290" width="40" height="108" fill="${hsl(h,25,60)}"/><rect x="490" y="290" width="50" height="122" fill="${hsl(28,50,34)}"/><rect x="560" y="300" width="90" height="98" fill="${hsl(h+170,40,44)}"/>`;
    s+=palm(95,440,1.1)+tree(700,436,1.1,hsl(138,38,28))+`<ellipse cx="250" cy="420" rx="60" ry="14" fill="${hsl(140,36,30)}"/><ellipse cx="560" cy="424" rx="70" ry="14" fill="${hsl(140,36,30)}"/>`;
  }else if(p.type==='House'){
    s+=`<rect y="410" width="800" height="110" fill="${lawn()}"/>`;
    s+=`<rect x="200" y="238" width="400" height="172" fill="${hsl(h,35,90)}"/><polygon points="170,246 400,110 630,246" fill="${hsl(h,40,34)}"/><polygon points="215,238 400,134 585,238" fill="${hsl(h,40,40)}"/>`;
    s+=`<rect x="365" y="300" width="70" height="110" fill="${hsl(28,50,32)}"/><circle cx="424" cy="358" r="3" fill="${hsl(45,90,70)}"/>`;
    [[235,290],[480,290]].forEach(([x,y])=>{s+=`<rect x="${x}" y="${y}" width="86" height="64" fill="${hsl(h+170,40,40)}"/><line x1="${x+43}" y1="${y}" x2="${x+43}" y2="${y+64}" stroke="${hsl(h,20,95)}" stroke-width="4"/><rect x="${x-6}" y="${y+64}" width="98" height="8" fill="${hsl(h,20,70)}"/>`});
    s+=`<rect x="120" y="396" width="560" height="14" fill="${hsl(h,18,76)}"/>`+tree(150,420,1.2,hsl(138,40,30))+tree(670,424,1.1,hsl(130,38,32))+road();
  }else if(p.type==='Plot'){
    s+=`<path d="M0 300 q150 -50 300 -10 t300 -10 t200 0 v240 h-800z" fill="${hsl(120,25,56)}"/><rect y="320" width="800" height="200" fill="${hsl(110,32,46)}"/>`;
    s+=`<polygon points="190,360 610,360 700,462 100,462" fill="${hsl(92,38,58)}" stroke="#fff" stroke-width="3" stroke-dasharray="10 7"/>`;
    [[190,360],[610,360],[700,462],[100,462]].forEach(([x,y])=>{s+=`<rect x="${x-3}" y="${y-22}" width="6" height="22" fill="${hsl(0,0,96)}"/><circle cx="${x}" cy="${y-24}" r="7" fill="${hsl(8,80,52)}"/>`});
    s+=`<rect x="396" y="388" width="8" height="64" fill="${hsl(28,35,30)}"/><rect x="330" y="372" width="140" height="42" fill="${hsl(0,0,98)}" stroke="${hsl(28,35,30)}" stroke-width="3"/><text x="400" y="390" text-anchor="middle" font-size="13" font-weight="700" fill="${hsl(h,50,28)}">PLOT FOR SALE</text><text x="400" y="406" text-anchor="middle" font-size="12" fill="${hsl(h,30,32)}">${landLabel(p)}</text>`;
    s+=tree(60,350,.9,hsl(135,38,30))+tree(745,352,.8,hsl(135,38,30))+`<rect y="482" width="800" height="38" fill="${hsl(215,8,36)}"/><rect y="500" width="800" height="3" fill="${hsl(48,80,72)}" opacity=".6"/>`;
  }else if(p.type==='Commercial'){
    s+=`<rect y="420" width="800" height="100" fill="${hsl(215,8,50)}"/>`;
    s+=`<rect x="90" y="220" width="150" height="200" fill="${hsl(h,20,70)}"/><rect x="570" y="190" width="160" height="230" fill="${hsl(h,20,72)}"/>`;
    s+=`<rect x="270" y="40" width="270" height="380" fill="${hsl(h+170,38,36)}"/>`;
    for(let i=0;i<14;i++)s+=`<rect x="270" y="${52+i*26}" width="270" height="4" fill="${hsl(h,25,86)}" opacity=".85"/>`;
    for(let i=0;i<5;i++)s+=`<rect x="${300+i*46}" y="40" width="3" height="380" fill="${hsl(h,25,86)}" opacity=".6"/>`;
    s+=`<rect x="350" y="360" width="110" height="60" fill="${hsl(h,20,92)}"/><rect x="400" y="366" width="3" height="54" fill="${hsl(h+170,38,36)}"/>`+tree(70,440,.9,hsl(138,38,30))+tree(750,440,.9,hsl(138,38,30));
  }else{
    s+=`<rect y="260" width="800" height="260" fill="${hsl(32,40,52)}"/>`;
    for(let i=0;i<9;i++){const y=300+i*24,k=i*3;s+=`<path d="M${-20-k} ${y} L${820+k} ${y}" stroke="${hsl(100,40,i%2?36:30)}" stroke-width="${8+i*1.5}" opacity=".9"/>`}
    s+=`<rect x="590" y="236" width="110" height="70" fill="${hsl(20,20,70)}"/><polygon points="580,240 645,196 710,240" fill="${hsl(8,40,38)}"/><rect x="635" y="262" width="22" height="44" fill="${hsl(28,40,26)}"/>`;
    s+=tree(120,300,1,hsl(120,34,30))+tree(230,290,.8,hsl(125,34,32))+tree(480,284,.7,hsl(120,34,30))+`<rect x="330" y="262" width="22" height="26" fill="${hsl(0,0,60)}"/>`;
  }
  return s;
},
living(p){
  const h=170+(p.hue%70);let s=`<rect width="800" height="520" fill="${hsl(h,28,90)}"/><rect y="392" width="800" height="128" fill="${hsl(32,38,66)}"/>`;
  s+=`<rect x="80" y="60" width="300" height="240" fill="${hsl(h,70,82)}" stroke="${hsl(h,15,98)}" stroke-width="10"/><rect x="100" y="210" width="44" height="86" fill="${hsl(h,30,70)}"/><rect x="156" y="180" width="50" height="116" fill="${hsl(h,30,62)}"/><rect x="262" y="226" width="40" height="70" fill="${hsl(h,30,68)}"/><rect x="316" y="196" width="52" height="100" fill="${hsl(h,30,60)}"/><line x1="230" y1="60" x2="230" y2="300" stroke="${hsl(h,15,98)}" stroke-width="8"/><line x1="80" y1="180" x2="380" y2="180" stroke="${hsl(h,15,98)}" stroke-width="8"/>`;
  s+=`<rect x="52" y="48" width="38" height="270" fill="${hsl(h+30,35,76)}"/><rect x="372" y="48" width="38" height="270" fill="${hsl(h+30,35,76)}"/>`;
  s+=`<rect x="360" y="296" width="380" height="104" rx="16" fill="${hsl(h+190,30,36)}"/><rect x="344" y="328" width="42" height="84" rx="14" fill="${hsl(h+190,30,32)}"/><rect x="716" y="328" width="42" height="84" rx="14" fill="${hsl(h+190,30,32)}"/><rect x="388" y="344" width="324" height="62" rx="10" fill="${hsl(h+190,30,44)}"/><rect x="410" y="316" width="60" height="50" rx="8" fill="${hsl(42,90,62)}"/><rect x="620" y="316" width="60" height="50" rx="8" fill="${hsl(8,70,60)}"/>`;
  s+=`<ellipse cx="520" cy="462" rx="270" ry="36" fill="${hsl(h+30,38,80)}"/><rect x="440" y="426" width="160" height="30" rx="4" fill="${hsl(28,40,32)}"/><rect x="452" y="454" width="8" height="22" fill="${hsl(28,40,28)}"/><rect x="580" y="454" width="8" height="22" fill="${hsl(28,40,28)}"/>`;
  s+=`<rect x="520" y="70" width="90" height="120" fill="${hsl(h,15,98)}" stroke="${hsl(28,40,30)}" stroke-width="5"/><circle cx="565" cy="130" r="30" fill="${hsl(h+40,60,60)}"/><rect x="630" y="90" width="70" height="90" fill="${hsl(h,15,98)}" stroke="${hsl(28,40,30)}" stroke-width="5"/><path d="M640 160 q25 -60 50 0z" fill="${hsl(h+180,40,50)}"/>`;
  s+=`<rect x="770" y="250" width="4" height="150" fill="${hsl(0,0,30)}"/><polygon points="750,250 794,250 784,214 760,214" fill="${hsl(42,90,80)}"/><rect x="40" y="380" width="36" height="46" fill="${hsl(8,45,42)}"/><ellipse cx="58" cy="350" rx="30" ry="42" fill="${hsl(135,40,32)}"/>`;
  return s;
},
kitchen(p){
  const h=170+(p.hue%70);let s=`<rect width="800" height="520" fill="${hsl(h,18,92)}"/><rect y="400" width="800" height="120" fill="${hsl(210,8,70)}"/>`;
  for(let x=0;x<800;x+=50)for(let y=170;y<300;y+=40)s+=`<rect x="${x+2}" y="${y+2}" width="46" height="36" fill="${hsl(h,25,96)}"/>`;
  for(let i=0;i<5;i++)s+=`<rect x="${40+i*130}" y="60" width="122" height="100" fill="${hsl(h+20,22,i%2?40:46)}"/><rect x="${96+i*130}" y="${i%2?100:90}" width="10" height="26" fill="${hsl(45,50,70)}"/>`;
  s+=`<polygon points="310,40 450,40 420,110 340,110" fill="${hsl(0,0,70)}"/>`;
  s+=`<rect x="30" y="300" width="740" height="16" fill="${hsl(0,0,82)}"/><rect x="30" y="316" width="740" height="100" fill="${hsl(h+20,22,36)}"/>`;
  for(let i=0;i<6;i++)s+=`<rect x="${36+i*122}" y="322" width="114" height="88" fill="${hsl(h+20,22,i%2?38:42)}"/><rect x="${60+i*122}" y="330" width="66" height="6" fill="${hsl(45,50,70)}"/>`;
  s+=`<rect x="320" y="290" width="150" height="10" fill="${hsl(0,0,14)}"/>`;[360,430].forEach(x=>{s+=`<circle cx="${x}" cy="295" r="9" fill="${hsl(0,0,30)}"/>`});
  s+=`<rect x="150" y="430" width="500" height="26" fill="${hsl(0,0,86)}"/><rect x="170" y="456" width="460" height="46" fill="${hsl(h+20,22,32)}"/>`;
  [220,360,500,600].forEach(x=>{s+=`<rect x="${x}" y="392" width="6" height="40" fill="${hsl(0,0,30)}"/><ellipse cx="${x+3}" cy="388" rx="20" ry="7" fill="${hsl(8,60,50)}"/>`});
  return s;
},
bedroom(p){
  const h=170+(p.hue%70);let s=`<rect width="800" height="520" fill="${hsl(h+20,22,88)}"/><rect y="400" width="800" height="120" fill="${hsl(30,30,62)}"/>`;
  s+=`<rect x="560" y="50" width="200" height="230" fill="${hsl(h,70,84)}" stroke="${hsl(h,15,98)}" stroke-width="9"/><rect x="530" y="40" width="40" height="260" fill="${hsl(h+170,25,60)}"/><rect x="752" y="40" width="40" height="260" fill="${hsl(h+170,25,60)}"/>`;
  s+=`<rect x="120" y="150" width="400" height="120" fill="${hsl(28,40,32)}"/><rect x="100" y="270" width="440" height="150" rx="8" fill="${hsl(h+170,25,88)}"/><rect x="100" y="330" width="440" height="100" rx="8" fill="${hsl(h+170,25,50)}"/>`;
  s+=`<rect x="140" y="236" width="150" height="54" rx="14" fill="${hsl(0,0,98)}"/><rect x="330" y="236" width="150" height="54" rx="14" fill="${hsl(0,0,98)}"/><rect x="100" y="360" width="440" height="14" fill="${hsl(42,80,66)}"/>`;
  [[40,70],[550,70]].forEach(([x,w])=>{s+=`<rect x="${x}" y="320" width="${w}" height="100" fill="${hsl(28,40,28)}"/>`});
  s+=`<rect x="52" y="262" width="12" height="58" fill="${hsl(0,0,30)}"/><polygon points="36,262 80,262 72,232 44,232" fill="${hsl(42,90,80)}"/><rect x="40" y="40" width="60" height="70" fill="${hsl(h,15,98)}" stroke="${hsl(28,40,30)}" stroke-width="4"/>`;
  s+=`<ellipse cx="320" cy="470" rx="200" ry="30" fill="${hsl(h,30,78)}"/>`;
  return s;
},
plan(p){
  const comm=p.type==='Commercial';let s=`<rect width="800" height="520" fill="${hsl(205,45,95)}"/>`;
  for(let x=0;x<800;x+=40)s+=`<line x1="${x}" y1="0" x2="${x}" y2="520" stroke="${hsl(205,35,88)}"/>`;
  for(let y=0;y<520;y+=40)s+=`<line x1="0" y1="${y}" x2="800" y2="${y}" stroke="${hsl(205,35,88)}"/>`;
  const X=120,Y=44,W=560,H=420,rooms=[];
  if(comm){rooms.push(['Open office',X,Y,360,H],['Meeting room',X+360,Y,200,150],['Cabin',X+360,Y+150,200,110],['Pantry',X+360,Y+260,200,90],['Wash',X+360,Y+350,200,70]);}
  else{rooms.push(['Living / dining',X,Y,240,250],['Kitchen',X,Y+250,240,170]);const n=Math.max(1,p.beds||1)+1,hh=H/n;for(let i=0;i<n-1;i++)rooms.push([i?'Bedroom '+(i+1):'Master bedroom',X+240,Y+i*hh,320,hh]);rooms.push(['Bath',X+240,Y+(n-1)*hh,320,hh]);}
  rooms.forEach(([n,x,y,w,hh])=>{const a=Math.round(p.sqft*(w*hh)/(W*H));s+=`<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${hsl(0,0,99)}" stroke="${hsl(215,35,24)}" stroke-width="4"/><text x="${x+w/2}" y="${y+hh/2-2}" text-anchor="middle" font-size="16" font-weight="700" fill="${hsl(215,35,24)}">${n}</text><text x="${x+w/2}" y="${y+hh/2+18}" text-anchor="middle" font-size="13" fill="${hsl(215,15,42)}">${a.toLocaleString('en-IN')} sq ft</text>`});
  s+=`<text x="${X}" y="${Y+H+30}" font-size="13" fill="${hsl(215,15,40)}">Floor plan, not to scale. Sample drawing.</text><g transform="translate(730 90)"><circle r="22" fill="none" stroke="${hsl(215,35,24)}" stroke-width="2"/><polygon points="0,-18 7,6 0,2 -7,6" fill="${hsl(215,35,24)}"/><text y="40" text-anchor="middle" font-size="13" fill="${hsl(215,35,24)}">N</text></g>`;
  return s;
},
layout(p){
  const sqft=p.sqft,W=Math.max(20,Math.round(Math.sqrt(sqft*.7))),D=Math.round(sqft/W),sc=Math.min(420/W,300/D),w=W*sc,d=D*sc,x0=(800-w)/2-20,y0=(520-d)/2;
  let s=`<rect width="800" height="520" fill="${hsl(95,30,92)}"/>`;
  const f=p.facing,rd=30;
  const rx={East:[x0+w,y0-20,rd,d+40],West:[x0-rd,y0-20,rd,d+40],North:[x0-20,y0-rd,w+40,rd],South:[x0-20,y0+d,w+40,rd]}[f]||[x0+w,y0,rd,d];
  s+=`<rect x="${rx[0]}" y="${rx[1]}" width="${rx[2]}" height="${rx[3]}" fill="${hsl(215,8,60)}"/>`;
  s+=`<rect x="${x0}" y="${y0}" width="${w}" height="${d}" fill="${hsl(92,40,70)}" stroke="${hsl(215,35,24)}" stroke-width="4"/>`;
  [[x0,y0],[x0+w,y0],[x0,y0+d],[x0+w,y0+d]].forEach(([x,y])=>{s+=`<circle cx="${x}" cy="${y}" r="7" fill="${hsl(8,80,52)}"/>`});
  s+=`<text x="${x0+w/2}" y="${y0+d/2}" text-anchor="middle" font-size="22" font-weight="700" fill="${hsl(215,35,24)}">${landLabel(p)}</text><text x="${x0+w/2}" y="${y0+d/2+24}" text-anchor="middle" font-size="14" fill="${hsl(215,15,36)}">${sqft.toLocaleString('en-IN')} sq ft approx.</text>`;
  s+=`<text x="${x0+w/2}" y="${y0-(f==='North'?rd+8:8)}" text-anchor="middle" font-size="14" fill="${hsl(215,15,30)}">${W} ft</text><text x="${x0-(f==='West'?rd+10:10)}" y="${y0+d/2}" text-anchor="end" font-size="14" fill="${hsl(215,15,30)}">${D} ft</text>`;
  s+=`<text x="${rx[0]+rx[2]/2}" y="${rx[1]+rx[3]+(f==='South'?22:-6)}" text-anchor="middle" font-size="12" fill="${hsl(215,15,30)}">${rd} ft road, ${f} facing</text>`;
  s+=`<g transform="translate(740 70)"><circle r="22" fill="none" stroke="${hsl(215,35,24)}" stroke-width="2"/><polygon points="0,-18 7,6 0,2 -7,6" fill="${hsl(215,35,24)}"/><text y="40" text-anchor="middle" font-size="13" fill="${hsl(215,35,24)}">N</text></g><text x="40" y="496" font-size="13" fill="${hsl(215,15,40)}">Survey sketch, not to scale. Sample drawing.</text>`;
  return s;
},
floor(p){
  const h=170+(p.hue%70);let s=`<rect width="800" height="520" fill="${hsl(h,15,90)}"/><rect y="400" width="800" height="120" fill="${hsl(210,8,72)}"/>`;
  s+=`<rect x="40" y="40" width="720" height="210" fill="${hsl(h,70,84)}"/>`;for(let i=0;i<6;i++)s+=`<rect x="${40+i*120}" y="40" width="6" height="210" fill="${hsl(h,15,96)}"/>`;
  s+=`<rect x="60" y="150" width="60" height="100" fill="${hsl(h,30,70)}"/><rect x="190" y="120" width="70" height="130" fill="${hsl(h,30,62)}"/><rect x="380" y="160" width="60" height="90" fill="${hsl(h,30,66)}"/><rect x="560" y="130" width="70" height="120" fill="${hsl(h,30,60)}"/>`;
  for(let r=0;r<2;r++)for(let c=0;c<4;c++){const x=70+c*180,y=300+r*90;s+=`<rect x="${x}" y="${y}" width="130" height="14" fill="${hsl(30,35,52)}"/><rect x="${x+50}" y="${y-36}" width="46" height="30" fill="${hsl(0,0,20)}"/><rect x="${x+34}" y="${y+14}" width="60" height="40" rx="10" fill="${hsl(h+170,35,38)}"/>`}
  s+=`<rect x="720" y="260" width="24" height="120" fill="${hsl(135,40,30)}"/>`;
  return s;
}};
const artCache={};
function art(p,view){
  const k=p.id+'|'+view;if(artCache[k])return artCache[k];
  const body=(ART[view]||ART.exterior)(p);
  return artCache[k]='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" font-family="Arial,Helvetica,sans-serif">${body}</svg>`);
}
function viewsFor(p){
  if(p.type==='Plot'||p.type==='Farm land')return[['exterior','Site'],['layout','Layout']];
  if(p.type==='Commercial')return[['exterior','Building'],['floor','Floor'],['plan','Plan']];
  return[['exterior','Outside'],['living','Living'],['kitchen','Kitchen'],['bedroom','Bedroom'],['plan','Plan']];
}

export {art,viewsFor,hsl,hash,rng};
