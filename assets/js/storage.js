/* Local persistence adapter. No remote authentication is simulated in this release. */
'use strict';
window.GuildStorage = (() => {
 const KEY='bestiariumV25',BACKUP='bestiariumV25.pre-remaster',PREFS='bestiarium.preferences.v3';
 let status='idle';
 const notify=()=>window.dispatchEvent(new CustomEvent('guild:storage',{detail:{status}}));
 const defaults=()=>({player:'',specialty:'',xp:0,captures:[],unlocked:[],inventory:{},activity:[],registeredAt:{},introSeen:false,avatar:'hunter-1',origin:'bosque',schemaVersion:3});
 const ids=new Set(BESTIARIUM.monsters.map(m=>m.id));
 const list=v=>Array.isArray(v)?[...new Set(v.filter(x=>typeof x==='string'&&ids.has(x)))]:[];
 const finite=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0;
 function normalize(raw){
  const v=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};const out=defaults();
  out.player=typeof v.player==='string'?v.player.slice(0,32):'';
  out.specialty=typeof v.specialty==='string'?v.specialty.slice(0,80):'';
  out.xp=finite(v.xp)?v.xp:0;out.captures=list(v.captures);out.unlocked=list(v.unlocked);
  out.inventory=Object.fromEntries(Object.entries(v.inventory||{}).filter(([k,n])=>finite(n)&&k.length<100));
  out.activity=Array.isArray(v.activity)?v.activity.filter(a=>a&&ids.has(a.mid)&&['unlock','capture'].includes(a.type)&&finite(a.date)&&a.date<=8640000000000000).map(a=>({type:a.type,mid:a.mid,date:a.date,...(finite(a.xp)?{xp:a.xp}:{})})):[];
  out.registeredAt=Object.fromEntries(Object.entries(v.registeredAt||{}).filter(([id,t])=>ids.has(id)&&finite(t)));
  out.avatar=['hunter-1','hunter-2','hunter-3','hunter-4'].includes(v.avatar)?v.avatar:'hunter-1';
  out.origin=BESTIARIUM.zones.some(z=>z.id===v.origin)?v.origin:'bosque';
  out.introSeen=!!v.introSeen;out.campaign=GuildCampaign.normalize(v.campaign);return out;
 }
 function load(){
  let raw;
  try{raw=localStorage.getItem(KEY);}catch{status='error';return defaults();}
  if(!raw)return defaults();
  let data;
  try{data=JSON.parse(raw);}catch{try{if(!localStorage.getItem(BACKUP))localStorage.setItem(BACKUP,raw);}catch{}status='error';return defaults();}
  if(data?.schemaVersion!==3){try{if(!localStorage.getItem(BACKUP))localStorage.setItem(BACKUP,raw);}catch{status='error';return normalize(data);}}
  status='saved';return normalize(data);
 }
 function save(state){try{localStorage.setItem(KEY,JSON.stringify({...state,schemaVersion:3,savedAt:Date.now()}));status='saved';notify();return true;}catch{status='error';notify();return false;}}
 function prefs(){try{return {...{sound:false,motion:window.matchMedia('(prefers-reduced-motion: reduce)').matches},...JSON.parse(localStorage.getItem(PREFS)||'{}')};}catch{return {sound:false,motion:true};}}
 function savePrefs(p){try{localStorage.setItem(PREFS,JSON.stringify(p));return true;}catch{return false;}}
 return {key:KEY,load,save,normalize,defaults,prefs,savePrefs,getStatus:()=>status};
})();
