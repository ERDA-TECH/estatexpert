// estateXpert mark: navy tile, dashed verification ring, check. Wordmark is live text so it stays sharp at every size.
export function LogoMark({size=34}){
  return(<svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="15" fill="#0D2D4A"/>
    <circle cx="32" cy="32" r="21" fill="none" stroke="#7FD9C5" strokeWidth="3.6" strokeDasharray="4.2 3.3" strokeLinecap="butt"/>
    <path d="M22 32.5l7.4 7.4L43 24" fill="none" stroke="#7FD9C5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>);
}
export function Wordmark(){return<span className="wordmark">estate<i>X</i>pert</span>}
export default function Logo(){return<><LogoMark/><Wordmark/></>}
