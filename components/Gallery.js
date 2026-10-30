'use client';
import {useState} from 'react';
// views: [{src,label}] with data-URI illustrations (real photos later)
export default function Gallery({views}){
  const [i,setI]=useState(0),n=views.length;
  return(
    <div className="gallery crop">
      <div className="main">{/* eslint-disable-next-line @next/next/no-img-element */}<img key={i} src={views[i].src} alt={views[i].real?views[i].label:`${views[i].label} view, sample illustration`}/></div>
      {n>1&&<><button type="button" className="gnav l" onClick={()=>setI((i+n-1)%n)} aria-label="Previous image">‹</button>
      <button type="button" className="gnav r" onClick={()=>setI((i+1)%n)} aria-label="Next image">›</button></>}
      <div className="thumbs">{views.map((v,k)=>(
        <button type="button" key={k} className={k===i?'on':''} onClick={()=>setI(k)} aria-label={v.label}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={v.src} alt=""/><span>{v.label}</span></button>))}
      </div>
    </div>
  );
}
