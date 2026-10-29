// Demo data source: works with no database. Data lives in server memory and resets when the server restarts.
import {SEED,SEED_QUEUE,SEED_LEADS,DOCS} from '../seed.js';
import {applyFilters} from '../filters.js';

const LEAD={'New':'new','Contacted':'contacted','Visit scheduled':'visit_scheduled','Closed':'closed'};
function data(){
  const g=globalThis;
  if(!g.__manaDemo){
    const props=[...SEED,...SEED_QUEUE.map((q,i)=>({...q,id:String(101+i)}))].map(p=>({...p,docs:{...p.docs},amen:[...p.amen],ownerId:null,status:p.status==='Live'?'Live':'Pending'}));
    g.__manaDemo={props,seq:1000,saved:{},alerts:{},
      enquiries:SEED_LEADS.map((l,i)=>({id:l.id,propId:l.prop,name:l.name,email:'sample@example.com',phone:'',tz:l.loc,kind:l.kind,status:LEAD[l.status],created:Date.now()-(i+1)*7.2e6,note:l.note,slotAt:null,userId:null}))};
  }
  return g.__manaDemo;
}
const lead=(e,props)=>({id:e.id,name:e.name,email:e.email,phone:e.phone,tz:e.tz,kind:e.kind,status:e.status,created:e.created,note:e.note,slotAt:e.slotAt,propId:e.propId,propTitle:(props.find(p=>p.id===e.propId)||{}).title||'Removed listing'});

export function demoRepo(user){
  const d=data();
  return{
    mode:'demo',
    async listProperties(f){return applyFilters(d.props.filter(p=>p.status==='Live'),f)},
    async getProperty(id){
      const p=d.props.find(x=>x.id===String(id));if(!p)return null;
      if(p.status==='Live')return p;
      return user&&(user.role==='admin'||p.ownerId===user.id)?p:null;
    },
    async related(p,n=3){return d.props.filter(x=>x.status==='Live'&&x.id!==p.id&&(x.type===p.type||x.area===p.area)).slice(0,n)},
    async createEnquiry(e){
      const prop=d.props.find(p=>p.id===String(e.propId)&&p.status==='Live');if(!prop)return{error:'This listing is not open for enquiries.'};
      const id='E'+(++d.seq);
      d.enquiries.unshift({id,propId:prop.id,name:e.name,email:e.email,phone:e.phone,tz:e.tz,kind:e.kind==='video_call'?'Video call':'Enquiry',status:'new',created:Date.now(),note:e.kind==='video_call'?'Call: '+e.slotLabel:(e.message||'No message'),slotAt:e.slotAt||null,userId:user?user.id:null});
      return{id};
    },
    async createListing(p){
      const id=String(++d.seq);
      d.props.unshift({furn:'Unfurnished',parking:1,approval:'To be verified',rera:'',floor:'',amen:[],...p,id,status:'Pending',verified:false,posted:0,ownerId:user.id,docs:Object.fromEntries(DOCS.map(([k])=>[k,0]))});
      return{id};
    },
    async myListings(){return user?d.props.filter(p=>p.ownerId===user.id):[]},
    async savedIds(){return user?(d.saved[user.id]||[]):[]},
    async savedList(){return d.props.filter(p=>(d.saved[user?.id]||[]).includes(p.id))},
    async toggleSaved(id){
      if(!user)return;const l=d.saved[user.id]=d.saved[user.id]||[];const i=l.indexOf(String(id));
      if(i<0)l.push(String(id));else l.splice(i,1);
    },
    async myEnquiries(){return user?d.enquiries.filter(e=>e.userId===user.id).map(e=>lead(e,d.props)):[]},
    async alerts(){return user?(d.alerts[user.id]||[]):[]},
    async createAlert(a){if(!user)return;(d.alerts[user.id]=d.alerts[user.id]||[]).push({...a,id:'A'+(++d.seq)})},
    async deleteAlert(id){if(!user)return;d.alerts[user.id]=(d.alerts[user.id]||[]).filter(a=>a.id!==id)},
    // admin
    async reviewQueue(){return d.props.filter(p=>p.status!=='Live')},
    async setStatus(id,status){const p=d.props.find(x=>x.id===String(id));if(!p)return;p.status=status;if(status==='Live'){p.verified=true;p.posted=0}},
    async setDocStatus(id,key,status){const p=d.props.find(x=>x.id===String(id));if(p)p.docs[key]=status},
    async leads(){return d.enquiries.map(e=>lead(e,d.props))},
    async setLeadStatus(id,status){const e=d.enquiries.find(x=>x.id===id);if(e)e.status=status},
    async createContact(c){d.contacts=d.contacts||[];d.contacts.push({...c,created:Date.now()});return{id:'C'+(++d.seq)}},
    async stats(){return{live:d.props.filter(p=>p.status==='Live').length,pending:d.props.filter(p=>p.status==='Pending').length,open:d.enquiries.filter(e=>e.status!=='closed').length,closed:d.enquiries.filter(e=>e.status==='closed').length}}
  };
}
