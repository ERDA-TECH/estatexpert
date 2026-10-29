export const dynamic="force-dynamic";
export default function robots(){
  const preview=process.env.PREVIEW_MODE==='1';
  return{rules:preview?{userAgent:'*',disallow:'/'}:{userAgent:'*',allow:'/',disallow:['/admin','/account','/login']}};
}
