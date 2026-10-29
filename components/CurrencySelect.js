'use client';
import {useTransition} from 'react';
import {setCurrency} from '@/app/actions.js';
import {CUR} from '@/lib/ref.js';
export default function CurrencySelect({value}){
  const [pending,start]=useTransition();
  return(<select aria-label="Currency" value={value} disabled={pending} onChange={e=>{const v=e.target.value;start(()=>setCurrency(v))}}>
    {Object.keys(CUR).map(c=><option key={c} value={c}>{c}</option>)}
  </select>);
}
