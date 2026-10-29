import {redirect} from 'next/navigation';
import SetPasswordForm from '@/components/SetPasswordForm';
import {getUser,hasSupabase} from '@/lib/db/index.js';
export const metadata={title:'Choose a password'};
export default async function SetPassword(){
  if(!hasSupabase())redirect('/login');
  const user=await getUser();
  if(!user)redirect('/login');
  return(<div className="wrap sec" style={{maxWidth:560}}>
    <h2>Welcome to estateXpert</h2>
    <p className="muted" style={{margin:'8px 0 18px'}}>Your email is confirmed. Choose a password to finish setting up your account.</p>
    <SetPasswordForm email={user.email} name={user.name&&!user.name.includes('@')&&user.name!==user.email.split('@')[0]?user.name:''}/>
  </div>);
}
