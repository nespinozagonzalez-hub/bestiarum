'use strict';
window.GuildAccount=(()=>{
 const KEY='bestiarium.account.v31',url=window.BESTIARIUM_REMOTE?.url||'';
 const configured=/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url);
 let session=null,busy=false,status='local';
 try{const v=JSON.parse(sessionStorage.getItem(KEY)||'null');if(configured&&v?.endpoint===url&&v.expires>Date.now())session=v;}catch{}
 if(session)status='loading';
 const notify=()=>window.dispatchEvent(new CustomEvent('guild:account-status'));
 const persist=()=>{try{if(session)sessionStorage.setItem(KEY,JSON.stringify(session));else sessionStorage.removeItem(KEY);}catch{}};
 const emit=(data,view)=>{if(session){session.state=data.state;persist();}window.dispatchEvent(new CustomEvent('guild:remote-state',{detail:{state:data.state,meta:data.meta||{},view}}));};
 function loading(action,payload){if(action==='campaign'&&payload.operation?.type==='read')return;
  const d=document.getElementById('accountLoading');if(!d)return;
  const titles={register:'Inscribiendo tu nombre',login:'Recuperando tu crónica',state:'Recuperando tu avance',hunt:'Abriendo el contrato',capture:'Guardando tu sello',profile:'Guardando tu cazador',campaign:'Conservando tu elección',logout:'Cerrando tu sesión',migration:'Enviando tu crónica',community:'Consultando el faro'};
  document.getElementById('connectionTitle').textContent=titles[action]||'Consultando los archivos';
  document.getElementById('connectionText').textContent=['login','state'].includes(action)?'Kael está recuperando tu cazador, tus sellos y tus recuerdos.':'El Gremio está confirmando tus registros.';
  document.getElementById('connectionHint').textContent='Espera mientras el Gremio confirma tus registros.';
  if(!d.open)d.showModal();
  document.getElementById('accountForm')?.querySelectorAll('input,button').forEach(el=>el.disabled=true);
 }
 function stopLoading(){
  const d=document.getElementById('accountLoading');if(d?.open)d.close();
  document.getElementById('accountForm')?.querySelectorAll('input,button').forEach(el=>el.disabled=!configured);
 }
 function requestId(){return crypto.randomUUID().replace(/-/g,'');}
 async function request(action,payload={}){
  if(!configured)throw Error('Los archivos remotos todavía no están habilitados.');
  if(busy)throw Error('El Gremio está procesando tu sello.');
  busy=true;status=['login','state'].includes(action)?'loading':'saving';loading(action,payload);notify();const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),25000);const hintTimer=setTimeout(()=>{const hint=document.getElementById('connectionHint');if(hint)hint.textContent='La consulta está tardando un poco más. Espera mientras el Gremio responde.';},7000);
  try{
   const res=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},redirect:'follow',signal:ctrl.signal,body:JSON.stringify({action,...payload,...(session?{token:session.token}:{})})});
   if(!res.ok)throw Error('No fue posible consultar los archivos del Gremio.');
   let data;try{data=await res.json();}catch{throw Error('El Gremio no recibió una respuesta válida. Vuelve a intentar en unos momentos.');}
   if(!data.ok){if(data.code==='SESION_INVALIDA'){session=null;persist();window.dispatchEvent(new CustomEvent('guild:remote-logout'));}throw Error(data.message||'El Gremio no pudo confirmar el cambio.');}
   status='saved';return data;
  }catch(e){status='error';throw Error(e.name==='AbortError'?'La consulta tardó demasiado. Revisa tu conexión y vuelve a intentar.':e.message);}
  finally{clearTimeout(timer);clearTimeout(hintTimer);busy=false;stopLoading();notify();}
 }
 async function restore(){if(!session)return;try{const data=await request('state');emit(data);}catch(e){message(e.message);}}
 function message(t){const el=document.getElementById('accountFeedback');if(el)el.textContent=t;window.dispatchEvent(new CustomEvent('guild:account-message',{detail:t}));}
 function open(mode='login'){if(busy)return;
  const d=document.getElementById('accountDialog');if(!d)return;
  for(const id of ['settingsDialog','guildMenu']){const el=document.getElementById(id);if(el?.open)el.close();}
  document.getElementById('accountInfo').textContent=session?'Sesión de '+session.username:configured?'Tu usuario identifica tu crónica. Tu código personal de seis números permite recuperarla en otro dispositivo.':'Tu credencial entre dispositivos estará disponible cuando se abran los archivos del Gremio. Por ahora, tu aventura se guarda en este navegador.';
  document.getElementById('accountTitle').textContent=session?'Tu credencial, tu crónica':mode==='register'?'Crea tu credencial':'Recupera tu aventura';
  document.getElementById('accountPin').autocomplete=mode==='register'?'new-password':'current-password';
  const form=document.getElementById('accountForm');form.hidden=!!session;
  const preferred=form.querySelector('[value="'+mode+'"]');if(preferred)form.querySelector('.button-row').prepend(preferred);
  form.querySelectorAll('button[type="submit"]').forEach(el=>{el.classList.toggle('primary',el.value===mode);el.classList.toggle('secondary',el.value!==mode);});
  form.querySelectorAll('input,button[type="submit"]').forEach(el=>el.disabled=!configured);
  document.getElementById('accountSetupNote').textContent=configured?'Recuerda tu usuario y tu código. Los códigos de los contratos se ingresan en el Tablón.':'Acceso preparado: usuario + código de 6 números. La conexión aún no está activada.';
  document.getElementById('accountActions').hidden=!session;
  document.getElementById('accountFeedback').textContent='';d.showModal();
 }

 function install(){
  const button=document.getElementById('accountButton');if(button)button.hidden=false;
  document.getElementById('accountLoading')?.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
  document.addEventListener('click',async e=>{
   const el=e.target.closest('[data-account]');if(!el)return;const action=el.dataset.account;
   if(action==='open'||action==='signup'){open(action==='signup'?'register':'login');return;}
   if(action==='local'){document.getElementById('accountDialog').close();window.dispatchEvent(new CustomEvent('guild:local-entry'));return;}
   if(action==='close'){document.getElementById('accountDialog').close();return;}
   if(action==='logout'){
    try{await request('logout');session=null;status='local';persist();document.getElementById('accountDialog').close();window.dispatchEvent(new CustomEvent('guild:remote-logout'));notify();}catch(err){message(err.message);}return;
   }
   if(action==='sync'){try{const data=await request('state');emit(data);message('Tu crónica está actualizada.');}catch(err){message(err.message);}return;}
   if(action==='migration'){
    const local=GuildStorage.load();try{await request('migration',{captures:local.captures,unlocked:local.unlocked});message('Solicitud enviada. El responsable del Gremio revisará tu crónica anterior antes de incorporarla.');}catch(err){message(err.message);}
   }
  });
  document.getElementById('accountForm')?.addEventListener('submit',async e=>{
   e.preventDefault();const form=e.currentTarget,action=e.submitter?.value==='register'?'register':'login',username=form.elements.username.value.trim(),pin=form.elements.pin.value;
   if(!/^[a-zA-Z0-9][a-zA-Z0-9_.-]{2,23}$/.test(username)||!/^\d{6}$/.test(pin)){message('Usa un usuario de 3 a 24 caracteres y una clave de seis dígitos.');return;}
   if(busy)return;if(!configured){message('La conexión aún no está activada. Continúa con tu crónica local.');return;}
   try{const local=GuildStorage.load(),profile={player:local.player||username,avatar:local.avatar,origin:local.origin,specialty:BESTIARIUM.classes.find(c=>[c.id,c.name,c.legacy].includes(local.specialty))?.id||'rastreador'};const data=await request(action,{username,pin,profile});session={token:data.token,username:data.username,userId:data.userId,expires:data.expires,endpoint:url,state:data.state};persist();form.elements.pin.value='';document.getElementById('accountDialog').close();emit(data,'refugio');message(action==='register'?'Kael ha creado tu credencial. Tu aventura queda guardada en el Gremio.':'La Archivista Kael ha recuperado tu crónica.');}
   catch(err){message(err.message);}
  });
  // Remote sessions intercept game forms before the local-only controller.
  // Rewards always come from Apps Script, never from a client JSON upload.
  document.addEventListener('submit',async e=>{
   if(!session||!['huntForm','captureForm','registrationForm'].includes(e.target.id))return;
   e.preventDefault();e.stopImmediatePropagation();if(busy)return;
   const id=e.target.id;
   try{
    let action,payload;
    if(id==='registrationForm'){
     action='profile';payload={profile:{player:document.getElementById('playerName').value,specialty:document.getElementById('classSelect').value,origin:document.getElementById('originSelect').value,avatar:document.querySelector('.avatar-option[aria-pressed="true"]')?.dataset.avatar||'hunter-1'}};
    }else{action=id==='huntForm'?'hunt':'capture';payload={code:document.getElementById(action==='hunt'?'huntCode':'captureCode').value};}
    const data=await request(action,{...payload,requestId:requestId()});emit(data,action==='profile'?'perfil':'contratos');
    if(data.meta?.alreadyCaptured)message('Esta captura ya estaba registrada; no se repitió el botín.');
    else if(action==='hunt')message(data.meta.opened?'El Gremio confirmó nuevos rastros.':'Este contrato ya estaba abierto o completado.');
   }catch(err){message(err.message);}
  },true);
 }
 async function campaign(operation){const data=await request('campaign',{operation,requestId:requestId()});emit(data);return data;}
 async function community(){const data=await request('community');return data.community;}
 return {campaign,community,configured,isActive:()=>!!session,cached:()=>session?.state||null,getStatus:()=>status,install,restore};
})();
