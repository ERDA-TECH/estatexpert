'use client';
import {useEffect,useState} from 'react';
import {STATES} from '@/lib/ref.js';
import Clocks from './Clocks';

// scenes: { TG: '<svg markup>', ... } rendered on the server from lib/scenes.js
export default function Hero({scenes,tz,children}){
  const keys=Object.keys(STATES);
  const [st,setSt]=useState('TG');
  const [paused,setPaused]=useState(false);
  useEffect(()=>{
    if(paused||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const t=setInterval(()=>setSt(s=>keys[(keys.indexOf(s)+1)%keys.length]),6500);
    return()=>clearInterval(t);
  },[paused]);// eslint-disable-line react-hooks/exhaustive-deps
  return(
    <section className="hero" data-st={st}>
      <div className="sky" aria-hidden="true"><span className="stars"/><span className="glow"/><span className="orb"/></div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="mono">Resale homes across South India, for families abroad</div>
          <h1 className="hl"><span className="w" style={{'--d':0}}>Come</span> <span className="w" style={{'--d':1}}>home</span> <span className="w" style={{'--d':2}}>to</span><br/><em key={st} className="swap">{STATES[st].n}</em></h1>
          <p className="lead">Verified flats, villas, plots and offices in Telangana, Andhra Pradesh, Kerala and Tamil Nadu. Legal papers, the commute and the nearest schools and hospitals shown up front. Book a video walkthrough in your own time zone.</p>
          <div className="hstates" role="group" aria-label="Pick a state">
            {keys.map(k=><button key={k} className={'hs'+(k===st?' on':'')} aria-pressed={k===st} onClick={()=>{setSt(k);setPaused(true)}}>{STATES[k].short}</button>)}
          </div>
          <Clocks tz={tz}/>
        </div>
        <div className="scenes" aria-hidden="true">
          {keys.map(k=><svg key={k} className={'scene'+(k===st?' on':'')} viewBox="0 0 600 360" preserveAspectRatio="xMaxYMax meet" dangerouslySetInnerHTML={{__html:scenes[k]}}/>)}
        </div>
      </div>
      {children}
    </section>
  );
}
