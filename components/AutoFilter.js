'use client';
import {useRef} from 'react';
import {useRouter} from 'next/navigation';

// Wraps the filter controls and the results. Any named field outside a property card rewrites the URL query string.
// It is a div, not a form, because the property cards contain their own save forms and forms cannot nest.
export default function AutoFilter({action,className,children}){
  const router=useRouter(),timer=useRef(null);
  const fields=root=>[...root.querySelectorAll('input[name],select[name],textarea[name]')].filter(el=>!el.closest('.card'));
  const go=root=>{
    const qs=new URLSearchParams();
    fields(root).forEach(el=>{
      if((el.type==='checkbox'||el.type==='radio')&&!el.checked)return;
      if(el.value!==''&&el.value!=='0')qs.append(el.name,el.value);
    });
    router.replace(action+(qs.size?'?'+qs:''),{scroll:false});
  };
  const queue=(root,delay)=>{clearTimeout(timer.current);timer.current=setTimeout(()=>go(root),delay)};
  const onChange=e=>{
    const root=e.currentTarget,n=e.target.name;
    if(!n||e.target.closest('.card'))return;
    const clear=names=>fields(root).forEach(el=>{if(names.includes(el.name))el.value=''});
    if(n==='state')clear(['city','area']);
    if(n==='city')clear(['area']);
    queue(root,e.target.type==='text'?350:30);
  };
  return(<div className={className} onChange={onChange} onInput={e=>{if(e.target.type==='text')onChange(e)}} onKeyDown={e=>{if(e.key==='Enter'&&e.target.type==='text'){e.preventDefault();queue(e.currentTarget,0)}}}>{children}</div>);
}
