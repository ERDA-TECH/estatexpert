// Per-visitor settings kept in cookies so server components can format prices without client JS.
import {cookies} from 'next/headers';
import {CUR,TZS} from './ref.js';

export async function getCur(){const v=(await cookies()).get('cur')?.value;return CUR[v]?v:'INR'}
export async function getTz(){const v=(await cookies()).get('tz')?.value;return TZS.some(t=>t[0]===v)?v:'America/New_York'}
