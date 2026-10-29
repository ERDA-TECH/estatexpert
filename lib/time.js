// Time helpers for video-call slots. Slots are offered 10:00 to 19:00 IST and shown in the visitor's own time zone.
export function istSlots(dayIdx,now=Date.now()){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(now));
  const g=t=>Number(parts.find(x=>x.type===t).value),out=[];
  for(let hr=10;hr<=19;hr++){
    const at=new Date(Date.UTC(g('year'),g('month')-1,g('day')+dayIdx,hr,0)-330*60000);
    if(at.getTime()<now+2*3600e3)continue;
    out.push({ist:hr,iso:at.toISOString()});
  }
  return out;
}
export const istDayLabel=(i,now=Date.now())=>new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',weekday:'short',day:'numeric',month:'short'}).format(new Date(now+i*864e5));
export const localSlot=(iso,tz)=>new Intl.DateTimeFormat('en-US',{timeZone:tz,weekday:'short',hour:'numeric',minute:'2-digit'}).format(new Date(iso));
export const h12=h=>(h>12?h-12:h)+':00 '+(h>=12?'pm':'am');
export const clockStr=(tz)=>new Intl.DateTimeFormat('en-IN',{timeZone:tz,hour:'2-digit',minute:'2-digit',hour12:true}).format(new Date());
export const hourIn=(tz)=>Number(new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',hour12:false}).format(new Date()))%24;
export function callHint(tz){const u=hourIn(tz),i=hourIn('Asia/Kolkata'),ok=u>=7&&u<22&&i>=9&&i<20;return{ok,text:ok?'Good time to call right now, both sides are in working hours.':'Outside working hours on one side. Book a video slot and we will call you.'}}
