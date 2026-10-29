/* ---------- sample data (placeholder content for the prototype) ---------- */
const STATES={
  TG:{n:'Telangana',short:'Telangana',rera:'TS-RERA',land:'Pattadar passbook and Dharani record',reg:'Sub-registrar office, Dharani portal'},
  AP:{n:'Andhra Pradesh',short:'Andhra',rera:'AP RERA',land:'Adangal and 1-B record',reg:'Sub-registrar office, APCRDA and VUDA layouts'},
  KL:{n:'Kerala',short:'Kerala',rera:'K-RERA',land:'Thandaper and possession certificate',reg:'Sub-registrar office, village office records'},
  TN:{n:'Tamil Nadu',short:'Tamil Nadu',rera:'TN RERA',land:'Patta and Chitta',reg:'Sub-registrar office, CMDA and DTCP layouts'}
};
const CITIES={
  hyd:{n:'Hyderabad',s:'TG',metro:true,it:'HITEC City',airport:'Rajiv Gandhi International Airport',ll:[17.38,78.48]},
  wgl:{n:'Warangal',s:'TG',metro:false,it:'Madikonda IT Park',airport:'Hyderabad airport (by highway)',ll:[17.97,79.59]},
  vsk:{n:'Visakhapatnam',s:'AP',metro:false,it:'Rushikonda IT Park',airport:'Visakhapatnam Airport',ll:[17.69,83.22]},
  vij:{n:'Vijayawada',s:'AP',metro:false,it:'Mangalagiri tech park',airport:'Vijayawada Airport',ll:[16.51,80.65]},
  tir:{n:'Tirupati',s:'AP',metro:false,it:'Tirupati industrial hub',airport:'Tirupati Airport',ll:[13.63,79.42]},
  koc:{n:'Kochi',s:'KL',metro:true,it:'Infopark',airport:'Cochin International Airport',ll:[9.93,76.27]},
  tvm:{n:'Thiruvananthapuram',s:'KL',metro:false,it:'Technopark',airport:'Trivandrum International Airport',ll:[8.52,76.94]},
  clt:{n:'Kozhikode',s:'KL',metro:false,it:'Cyberpark',airport:'Calicut International Airport',ll:[11.26,75.78]},
  che:{n:'Chennai',s:'TN',metro:true,it:'OMR IT corridor',airport:'Chennai International Airport',ll:[13.08,80.27]},
  cbe:{n:'Coimbatore',s:'TN',metro:false,it:'Tidel Park',airport:'Coimbatore International Airport',ll:[11.02,76.96]},
  mdu:{n:'Madurai',s:'TN',metro:false,it:'Elcot IT Park',airport:'Madurai Airport',ll:[9.93,78.12]}
};
const AREAS={
  gachibowli:{c:'hyd',n:'Gachibowli',x:40,y:56,blurb:'IT corridor beside the Financial District',d:[1.2,2.0,3.5,2.5,2.2,21]},
  kokapet:{c:'hyd',n:'Kokapet',x:33,y:68,blurb:'New high-rise and villa belt near the ORR',d:[2.0,3.5,9,4,4.5,19]},
  jubilee:{c:'hyd',n:'Jubilee Hills',x:57,y:42,blurb:'Established premium residential neighbourhood',d:[0.9,1.2,1.5,5,1.1,25]},
  banjara:{c:'hyd',n:'Banjara Hills',x:63,y:47,blurb:'Central, close to hospitals, offices and dining',d:[0.8,1,1.2,5.5,0.9,24]},
  tellapur:{c:'hyd',n:'Tellapur',x:15,y:48,blurb:'Fast-growing western suburb with gated layouts',d:[2.5,4,14,8,5.5,27]},
  kondapur:{c:'hyd',n:'Kondapur',x:34,y:44,blurb:'Mid-budget apartments close to HITEC City',d:[1,1.6,2.8,1.8,1.5,26]},
  madhapur:{c:'hyd',n:'Madhapur',x:45,y:46,blurb:'HITEC City offices, cafes and co-working',d:[0.6,1.2,1.5,0.8,1,25]},
  narsingi:{c:'hyd',n:'Narsingi',x:45,y:67,blurb:'Quiet villa communities near the ORR',d:[1.8,3,12,5,5,20]},
  miyapur:{c:'hyd',n:'Miyapur',x:26,y:27,blurb:'Metro terminus with value-for-money flats',d:[1,1.8,0.6,9,2,32]},
  kukatpally:{c:'hyd',n:'Kukatpally',x:40,y:30,blurb:'Dense, well-connected family neighbourhood',d:[0.7,1.5,1,7,1.2,30]},
  shamshabad:{c:'hyd',n:'Shamshabad',x:57,y:90,blurb:'Next to the international airport',d:[1.5,3,15,19,6,5]},
  shadnagar:{c:'hyd',n:'Shadnagar',x:30,y:90,blurb:'Rural belt south-west of the city',d:[3,6,40,35,15,25]},
  hanamkonda:{c:'wgl',n:'Hanamkonda',x:42,y:40,blurb:'Main residential and education hub',d:[1,1.5,2.5,4,2,150]},
  kazipet:{c:'wgl',n:'Kazipet',x:62,y:62,blurb:'Railway junction town with new layouts',d:[1.2,2,1,6,3.5,152]},
  rushikonda:{c:'vsk',n:'Rushikonda',x:68,y:28,blurb:'Beach-facing hills next to the IT park',d:[2,3,12,2,4,22]},
  madhurawada:{c:'vsk',n:'Madhurawada',x:56,y:36,blurb:'Growing villa and apartment belt',d:[1.5,2.5,10,4,3,20]},
  mvp:{c:'vsk',n:'MVP Colony',x:48,y:56,blurb:'Established area close to the beach road',d:[0.8,1.2,5,8,1.2,14]},
  gajuwaka:{c:'vsk',n:'Gajuwaka',x:28,y:72,blurb:'Industrial suburb with affordable homes',d:[1,1.8,3,14,2.5,30]},
  benz:{c:'vij',n:'Benz Circle',x:50,y:46,blurb:'Central commercial and residential junction',d:[0.8,1.2,2,6,1,20]},
  patamata:{c:'vij',n:'Patamata',x:60,y:56,blurb:'Schools, clinics and quick access to the bypass',d:[0.6,1.1,2.5,7,1.5,19]},
  tadepalli:{c:'vij',n:'Tadepalli',x:30,y:40,blurb:'Capital region layouts along the Krishna river',d:[1.5,3,6,9,4,28]},
  tiruchanur:{c:'tir',n:'Tiruchanur',x:56,y:56,blurb:'Quiet temple-town neighbourhood',d:[1,1.8,4,12,3,12]},
  renigunta:{c:'tir',n:'Renigunta',x:70,y:36,blurb:'Next to the airport and the rail junction',d:[1.2,2.5,2,10,4,4]},
  kakkanad:{c:'koc',n:'Kakkanad',x:66,y:40,blurb:'Infopark neighbourhood with new apartments',d:[1,1.5,1.5,2,2,24]},
  edappally:{c:'koc',n:'Edappally',x:48,y:48,blurb:'Mall, metro and highway junction',d:[0.8,1.2,0.7,6,0.6,22]},
  panampilly:{c:'koc',n:'Panampilly Nagar',x:34,y:62,blurb:'Central, calm, close to the backwaters',d:[0.6,1,1.2,8,1.5,27]},
  technopark:{c:'tvm',n:'Kazhakkoottam',x:34,y:28,blurb:'Next to Technopark and the coastal highway',d:[1,1.6,3,1.5,2.5,10]},
  pattom:{c:'tvm',n:'Pattom',x:52,y:52,blurb:'Central residential belt near the Secretariat',d:[0.5,0.8,1.5,7,1,6]},
  vattiyoorkavu:{c:'tvm',n:'Vattiyoorkavu',x:66,y:66,blurb:'Green, quiet and well connected',d:[0.9,1.5,3,9,2.5,11]},
  nadakkavu:{c:'clt',n:'Nadakkavu',x:48,y:50,blurb:'Established area near the beach and railway',d:[0.6,1,2,7,1.2,26]},
  mavoor:{c:'clt',n:'Mavoor Road',x:58,y:58,blurb:'Commercial strip with new apartments',d:[0.8,1.2,2.5,6,0.8,27]},
  omr:{c:'che',n:'Sholinganallur (OMR)',x:62,y:78,blurb:'IT corridor along Old Mahabalipuram Road',d:[1,1.8,3,1.5,2,28]},
  adyar:{c:'che',n:'Adyar',x:52,y:60,blurb:'Leafy south-city locality near the river',d:[0.6,1,1.5,6,1.5,10]},
  annanagar:{c:'che',n:'Anna Nagar',x:38,y:42,blurb:'Planned neighbourhood with metro access',d:[0.6,1,0.8,12,1,18]},
  porur:{c:'che',n:'Porur',x:26,y:56,blurb:'West Chennai villas and apartments',d:[1,1.5,1.2,9,1.5,17]},
  saibaba:{c:'cbe',n:'Saibaba Colony',x:46,y:42,blurb:'Central, quiet, close to hospitals',d:[0.6,0.9,2,6,1,15]},
  saravanampatti:{c:'cbe',n:'Saravanampatti',x:60,y:26,blurb:'IT park neighbourhood with new flats',d:[1,1.6,5,1.5,3,12]},
  pollachi:{c:'cbe',n:'Pollachi',x:36,y:80,blurb:'Coconut belt south of Coimbatore',d:[2,4,2,45,10,50]},
  annamdu:{c:'mdu',n:'Anna Nagar, Madurai',x:46,y:46,blurb:'Calm residential area with good schools',d:[0.6,1,2.5,7,1.5,10]},
  ellis:{c:'mdu',n:'KK Nagar',x:34,y:36,blurb:'Mid-budget homes and a busy market street',d:[0.8,1.2,3,6,1.8,11]}
};
const NB=[['school','School'],['hospital','Hospital'],['transit','Metro / rail'],['it','IT hub'],['mall','Shopping'],['airport','Airport']];
function nearby(key){
  const a=AREAS[key],c=CITIES[a.c];
  const names=[a.n+' Public School',a.n+' Multispeciality Hospital',c.metro?a.n+' Metro station':'Nearest railway station',c.it,a.n+' Central Mall',c.airport];
  return NB.map(([k,l],i)=>({k,label:l,name:names[i],km:a.d[i],min:Math.max(3,Math.round(a.d[i]*(i===5?(a.d[i]>60?1.1:1.9):3.2)))}));
}
const TYPES=['Flat','Villa','House','Plot','Commercial','Farm land'];
const DOCS=[['title','Title deed checked'],['ec','Encumbrance certificate (30 years)'],['tax','Property tax receipts'],['approval','Layout / building approval'],['rera','RERA registration'],['oc','Occupancy certificate'],['land','Land record']];
const DOC_STATE=['Pending','Verified','Not applicable'];

const LEAD_STATES=['New','Contacted','Visit scheduled','Closed'];
const CODES=[['+1','US / Canada'],['+44','UK'],['+971','UAE'],['+65','Singapore'],['+61','Australia'],['+49','Germany'],['+91','India']];
const TZS=[['America/New_York','US Eastern (New York)'],['America/Chicago','US Central (Dallas)'],['America/Denver','US Mountain (Denver)'],['America/Los_Angeles','US Pacific (San Francisco)'],['Europe/London','UK (London)'],['Asia/Dubai','UAE (Dubai)'],['Asia/Singapore','Singapore'],['Australia/Sydney','Australia (Sydney)']];
const CUR={INR:{r:1,s:'₹'},USD:{r:0.0115,s:'$'},GBP:{r:0.0087,s:'£'},AED:{r:0.0422,s:'AED '},CAD:{r:0.0158,s:'C$'}};
const FAQ=[
 ['Can I buy a property without travelling?','Yes. Many NRIs complete the purchase through a registered Power of Attorney. Our team verifies documents, arranges site visits on video and coordinates registration with your lawyer.'],
 ['Which properties can an NRI buy?','Residential and commercial property is open to NRIs in every state. Agricultural land, plantations and farmhouses are not. Rules change, so always confirm with a lawyer before paying a token amount.'],
 ['Do the rules differ between states?','Land records, approvals, the RERA authority and registration steps differ by state. We show the right documents and units for each state on every listing, for example cents in Kerala and grounds in Tamil Nadu.'],
 ['How do you verify a listing?','Every listing goes through a document check (title deed, encumbrance certificate, tax receipts, approvals, land record) and a site visit by our partner in that city before it goes live. Pending items are shown openly.'],
 ['Do I need an Indian bank account?','You will need an NRE or NRO account to pay for the property and to receive rental income. We can guide you through opening one.'],
 ['What does it cost to use the platform?','Browsing, saving and enquiring are free. A service fee applies only when a sale or a paid NRI service is completed. These numbers are placeholders in this prototype.']
];

export {STATES,CITIES,AREAS,NB,nearby,TYPES,DOCS,DOC_STATE,LEAD_STATES,CODES,TZS,CUR,FAQ};
