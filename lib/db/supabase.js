// Supabase data source. Row level security in supabase/migrations/0001_schema.sql does the access control,
// so every call here runs as the signed-in visitor (or as anonymous).
import {createClient} from '../supabase/server.js';
import {applyFilters} from '../filters.js';
import {DOCS} from '../seed.js';

const DOC_IDX={pending:0,verified:1,not_applicable:2};
const IDX_DOC=['pending','verified','not_applicable'];
const STATUS_OUT={live:'Live',pending:'Pending',rejected:'Rejected',draft:'Draft',sold:'Sold'};
const STATUS_IN={Live:'live',Pending:'pending',Rejected:'rejected'};
const SELECT='*, property_documents(doc_key,status), property_media(storage_path,kind,sort_order)';
const mediaUrl=path=>`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-media/${path}`;

function fromRow(r){
  const docs=Object.fromEntries(DOCS.map(([k])=>[k,0]));
  (r.property_documents||[]).forEach(d=>{docs[d.doc_key]=DOC_IDX[d.status]});
  const photos=(r.property_media||[]).filter(m=>m.kind==='photo').sort((a,b)=>a.sort_order-b.sort_order).map(m=>mediaUrl(m.storage_path));
  const sqyd=Number(r.plot_size_sqyd)||0,ref=r.published_at||r.created_at;
  return{id:String(r.id),title:r.title,type:r.type,area:r.locality_id,beds:r.beds,baths:r.baths,sqft:r.built_up_sqft||Math.round(sqyd*9),sqyd,
    acres:r.acres?Number(r.acres):undefined,price:Number(r.price_inr),facing:r.facing||'East',floor:r.floor_label||'',age:r.age_years,furn:r.furnishing||'Unfurnished',
    parking:r.parking,approval:r.approval_authority||'',rera:r.rera_number||'',loan:r.loan_available,nri:r.nri_eligible,desc:r.description||'',amen:r.amenities||[],
    status:STATUS_OUT[r.status]||r.status,verified:r.verified,hue:r.hue,posted:Math.max(0,Math.round((Date.now()-new Date(ref).getTime())/864e5)),docs,photos,ownerId:r.owner_id,
    owner:r.property_private?.owner_name?`${r.property_private.owner_name}${r.property_private.owner_country?', '+r.property_private.owner_country:''}`:undefined};
}
const toLead=r=>({id:r.id,name:r.name,email:r.email,phone:r.phone||'',tz:r.time_zone||'',kind:r.kind==='video_call'?'Video call':'Enquiry',status:r.status,created:new Date(r.created_at).getTime(),
  note:r.kind==='video_call'?'Call: '+new Date(r.slot_at).toUTCString():(r.message||'No message'),slotAt:r.slot_at,propId:String(r.property_id),propTitle:r.properties?.title||'Removed listing'});
const check=({error})=>{if(error)throw new Error(error.message)};

export async function supabaseUser(){
  const sb=await createClient();
  const {data:{user}}=await sb.auth.getUser();
  if(!user)return null;
  const {data:p}=await sb.from('profiles').select('full_name,phone,role').eq('id',user.id).maybeSingle();
  return{id:user.id,email:user.email||'',name:p?.full_name||user.email?.split('@')[0]||'Member',phone:p?.phone||'',role:p?.role||'buyer'};
}

export async function supabaseRepo(user){
  const sb=await createClient();
  const listBy=async q=>{const r=await q;check(r);return r.data.map(fromRow)};
  return{
    mode:'supabase',
    async listProperties(f){return applyFilters(await listBy(sb.from('properties').select(SELECT).eq('status','live').order('published_at',{ascending:false}).limit(1000)),f)},
    async getProperty(id){
      if(!/^\d+$/.test(String(id)))return null;
      const r=await sb.from('properties').select(SELECT+', property_private(owner_name,owner_country)').eq('id',id).maybeSingle();check(r);
      return r.data?fromRow(r.data):null;
    },
    async related(p,n=3){
      const l=await listBy(sb.from('properties').select(SELECT).eq('status','live').neq('id',p.id).or(`type.eq.${p.type},locality_id.eq.${p.area}`).limit(n));
      return l;
    },
    async createEnquiry(e){
      const {error}=await sb.from('enquiries').insert({id:crypto.randomUUID(),property_id:Number(e.propId),user_id:user?.id||null,name:e.name,email:e.email,phone:e.phone,time_zone:e.tz,
        kind:e.kind,slot_at:e.slotAt||null,preferred_contact:e.preferred,move_timeline:e.timeline,message:e.message||null});
      return error?{error:'Could not send the enquiry. '+error.message}:{id:'sent'};
    },
    async createListing(p,files=[]){
      const ins=await sb.from('properties').insert({owner_id:user.id,title:p.title,type:p.type,locality_id:p.area,address:p.address||null,beds:p.beds,baths:p.baths,
        built_up_sqft:p.type==='Plot'||p.type==='Farm land'?null:p.sqft,plot_size_sqyd:p.sqyd||0,acres:p.acres||null,price_inr:p.price,price_negotiable:p.negotiable!==false,facing:p.facing,
        age_years:p.age||0,loan_available:p.loan,nri_eligible:p.nri,description:p.desc,hue:p.hue}).select('id').single();
      if(ins.error)return{error:ins.error.message};
      const id=ins.data.id;
      check(await sb.from('property_private').insert({property_id:id,owner_name:p.owner.name,owner_phone:p.owner.phone,owner_email:p.owner.email,owner_country:p.owner.country,caretaker_contact:p.owner.caretaker||null}));
      check(await sb.from('property_documents').insert(DOCS.map(([k])=>({property_id:id,doc_key:k,status:'pending'}))));
      let n=0;
      for(const f of files){
        const path=`${user.id}/${id}/${n}-${f.name.replace(/[^a-z0-9._-]/gi,'_')}`;
        const up=await sb.storage.from('property-media').upload(path,f,{contentType:f.type});
        if(!up.error){await sb.from('property_media').insert({property_id:id,storage_path:path,kind:'photo',sort_order:n});n++}
      }
      return{id:String(id)};
    },
    async myListings(){return user?listBy(sb.from('properties').select(SELECT).eq('owner_id',user.id).order('created_at',{ascending:false})):[]},
    async savedIds(){if(!user)return[];const r=await sb.from('saved_properties').select('property_id').eq('user_id',user.id);check(r);return r.data.map(x=>String(x.property_id))},
    async savedList(){const ids=await this.savedIds();return ids.length?listBy(sb.from('properties').select(SELECT).in('id',ids).eq('status','live')):[]},
    async toggleSaved(id){
      if(!user)return;
      const r=await sb.from('saved_properties').select('property_id').eq('user_id',user.id).eq('property_id',id).maybeSingle();
      if(r.data)check(await sb.from('saved_properties').delete().eq('user_id',user.id).eq('property_id',id));
      else check(await sb.from('saved_properties').insert({user_id:user.id,property_id:Number(id)}));
    },
    async myEnquiries(){if(!user)return[];const r=await sb.from('enquiries').select('*, properties(title)').eq('user_id',user.id).order('created_at',{ascending:false});check(r);return r.data.map(toLead)},
    async alerts(){
      if(!user)return[];const r=await sb.from('alerts').select('*').eq('user_id',user.id).order('created_at',{ascending:false});check(r);
      return r.data.map(a=>({id:a.id,state:a.state_code||'',city:a.city_id||'',type:a.property_type||'',max:Number(a.max_price_inr)||0,freq:a.frequency}));
    },
    async createAlert(a){if(user)check(await sb.from('alerts').insert({user_id:user.id,state_code:a.state||null,city_id:a.city||null,property_type:a.type||null,max_price_inr:a.max||null,frequency:a.freq}))},
    async deleteAlert(id){if(user)check(await sb.from('alerts').delete().eq('id',id).eq('user_id',user.id))},
    async reviewQueue(){return listBy(sb.from('properties').select(SELECT+', property_private(owner_name,owner_country)').in('status',['pending','rejected']).order('created_at',{ascending:false}))},
    async setStatus(id,status){check(await sb.from('properties').update({status:STATUS_IN[status],verified:status==='Live'}).eq('id',id))},
    async setDocStatus(id,key,idx){check(await sb.from('property_documents').upsert({property_id:Number(id),doc_key:key,status:IDX_DOC[idx]},{onConflict:'property_id,doc_key'}))},
    async leads(){const r=await sb.from('enquiries').select('*, properties(title)').order('created_at',{ascending:false}).limit(300);check(r);return r.data.map(toLead)},
    async setLeadStatus(id,status){check(await sb.from('enquiries').update({status}).eq('id',id))},
    async createContact(c){const {error}=await sb.from('contact_requests').insert({id:crypto.randomUUID(),kind:c.kind,name:c.name,email:c.email,topic:c.topic||null,time_zone:c.tz||null,message:c.message||null});return error?{error:error.message}:{id:'sent'}},
    async stats(){
      const c=async(q)=>{const r=await q;check(r);return r.count||0};
      return{live:await c(sb.from('properties').select('id',{count:'exact',head:true}).eq('status','live')),pending:await c(sb.from('properties').select('id',{count:'exact',head:true}).eq('status','pending')),
        open:await c(sb.from('enquiries').select('id',{count:'exact',head:true}).neq('status','closed')),closed:await c(sb.from('enquiries').select('id',{count:'exact',head:true}).eq('status','closed'))};
    }
  };
}
