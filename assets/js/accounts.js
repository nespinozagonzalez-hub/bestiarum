'use strict';
window.GuildAccount=(()=>{
 const KEY='bestiarium.account.v31',CACHE='bestiarium.chronicle.v35',url=window.BESTIARIUM_REMOTE?.url||'';
 const configured=/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url);
 let session=null,busy=false,status='local',cacheStatus='idle',disabled=[];
 try{const v=JSON.parse(sessionStorage.getItem(KEY)||'null');if(configured&&v?.endpoint===url&&v.expires>Date.now())session=v;}catch{}
 try{const c=JSON.parse(localStorage.getItem(CACHE)||'null');if(session&&!session.state&&c?.endpoint===url&&c.userId===session.userId)session.state=c.state;}catch{}
 if(session)status='loading';
 const notify=()=>window.dispatchEvent(new CustomEvent('guild:account-status'));
 // The local snapshot contains progress only. PINs and tokens never enter localStorage.
 function persist(){
  try{if(session)sessionStorage.setItem(KEY,JSON.stringify(session));else sessionStorage.removeItem(KEY);}catch{}
  if(session?.state){try{localStorage.setItem(CACHE,JSON.stringify({endpoint:url,userId:session.userId,username:session.username,state:session.state,savedAt:Date.now()}));cacheStatus='saved';}catch{cacheStatus='error';}}
 }
 const emit=(data,view,created=false)=>{if(session){session.state=data.state;persist();}window.dispatchEvent(new CustomEvent('guild:remote-state',{detail:{state:data.state,meta:data.meta||{},view,created}}));};
 function loading(action,payload){if(action==='campaign'&&payload.operation?.type==='read')return;
  const d=document.getElementById('accountLoading');if(!d)return;
  const titles={register:'Creando tu usuario y cazador',login:'Recuperando tu crónica',state:'Recuperando tu avance',hunt:'Abriendo el contrato',capture:'Guardando tu sello',profile:'Guardando tu cazador',campaign:'Conservando tu elección',logout:'Cerrando tu sesión',migration:'Enviando tu crónica',community:'Consultando el faro'};
  document.getElementById('connectionTitle').textContent=titles[action]||'Consultando los archivos';
  document.getElementById('connectionText').textContent=['login','state'].includes(action)?'Kael está recuperando tu cazador, tus sellos y tus recuerdos.':'El Gremio está confirmando tus registros.';
  document.getElementById('connectionHint').textContent='Puede tardar unos segundos. Tu avance se guarda automáticamente.';
  if(!d.open)d.showModal();
  disabled=[...document.querySelectorAll('#accountForm input,#accountForm button,#registrationForm input,#registrationForm select,#registrationForm button')].map(el=>[el,el.disabled]);
  disabled.forEach(([el])=>el.disabled=true);
  document.getElementById('registrationForm').setAttribute('aria-busy','true');
 }
 function stopLoading(){
  const d=document.getElementById('accountLoading');if(d?.open)d.close();
  disabled.forEach(([el,value])=>el.disabled=value);disabled=[];
  document.getElementById('registrationForm').setAttribute('aria-busy','false');
 }
 function requestId(){return crypto.randomUUID().replace(/-/g,'');}
 async function request(action,payload={}){
  if(!configured)throw Error('No se pudo conectar con los archivos del Gremio.');
  if(busy)throw Error('El Gremio está procesando tu sello.');
  busy=true;status=['login','state'].includes(action)?'loading':'saving';loading(action,payload);notify();
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),60000),hintTimer=setTimeout(()=>{const hint=document.getElementById('connectionHint');if(hint)hint.textContent='El Gremio sigue respondiendo. No cierres esta ventana ni vuelvas a enviar el formulario.';},10000);
  try{
   const res=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},redirect:'follow',signal:ctrl.signal,body:JSON.stringify({action,...payload,...(session?{token:session.token}:{})})});
   if(!res.ok)throw Error('El Gremio no está disponible en este momento. Vuelve a intentar.');
   let data;try{data=await res.json();}catch{throw Error('La conexión devolvió una respuesta incompleta. Tus datos siguen en el formulario; vuelve a intentar.');}
   if(!data.ok){
    if(data.code==='SESION_INVALIDA'){session=null;persist();window.dispatchEvent(new CustomEvent('guild:remote-logout'));}
    const error=Error(data.code==='USUARIO_EXISTE'?'Ese usuario ya está creado. Usa «Continuar mi historia» con tu código, o elige otro nombre de usuario.':data.message||'El Gremio no pudo confirmar el cambio.');error.code=data.code;throw error;
   }
   status='saved';return data;
  }catch(e){status='error';
   if(e.name==='AbortError')throw Error('El Gremio tardó demasiado en responder. Si estabas creando tu usuario, prueba «Continuar mi historia» con el mismo usuario y código antes de crear otro.');
   if(e instanceof TypeError)throw Error('No se pudo conectar con el Gremio. Revisa tu conexión y vuelve a intentar; tus datos siguen en el formulario.');throw e;
  }finally{clearTimeout(timer);clearTimeout(hintTimer);busy=false;stopLoading();notify();}
 }
 async function restore(){if(!session)return;persist();try{const data=await request('state');emit(data);}catch(e){message(e.message);}}
 function message(t,registration=false){
  const el=document.getElementById(registration?'registrationFeedback':'accountFeedback');if(el){el.textContent=t;if(registration)el.focus({preventScroll:false});}
  window.dispatchEvent(new CustomEvent('guild:account-message',{detail:t}));
 }
 function usernameValue(value){return value.trim().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_').toLowerCase();}
 function credentials(form){
  const username=usernameValue(form.elements.username.value),pin=form.elements.pin.value;form.elements.username.value=username;
  if(!/^[a-z0-9][a-z0-9_.-]{2,23}$/.test(username))throw Error('El usuario necesita de 3 a 24 letras o números. También puedes usar punto, guion y guion bajo; debe empezar con una letra o número.');
  if(!/^\d{6}$/.test(pin))throw Error('Elige un código de exactamente 6 números, por ejemplo seis dígitos que puedas recordar.');
  return {username,pin};
 }
 function open(){if(busy)return;
  const d=document.getElementById('accountDialog');if(!d)return;
  for(const id of ['settingsDialog','guildMenu']){const el=document.getElementById(id);if(el?.open)el.close();}
  document.getElementById('accountInfo').textContent=session?'Sesión de '+session.username:'Recupera tu personaje y continúa justo donde dejaste tu aventura.';
  document.getElementById('accountTitle').textContent=session?'Tu cuenta del Gremio':'Continúa tu historia';
  const form=document.getElementById('accountForm');form.hidden=!!session;
  form.querySelectorAll('input,button[type="submit"]').forEach(el=>el.disabled=!configured);
  if(!session&&document.getElementById('signupUsername').value)form.elements.username.value=usernameValue(document.getElementById('signupUsername').value);
  document.getElementById('accountSetupNote').textContent=configured?'Usa el usuario y el código personal de 6 números que elegiste. Los códigos de los contratos van dentro del juego.':'La conexión no está disponible en esta vista.';
  document.getElementById('accountActions').hidden=!session;document.getElementById('accountFeedback').textContent='';d.showModal();
 }
 function accept(data,form,created){
  session={token:data.token,username:data.username,userId:data.userId,expires:data.expires,endpoint:url,state:data.state};persist();form.elements.pin.value='';
  const d=document.getElementById('accountDialog');if(d.open)d.close();emit(data,'refugio',created);
  message(created?'Tu usuario y tu cazador están listos. Comienza tu historia.':'La Archivista Kael ha recuperado tu crónica.');
 }
 function install(){
  const button=document.getElementById('accountButton');if(button)button.hidden=false;
  document.getElementById('accountLoading')?.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
  for(const id of ['accountForm','registrationForm'])document.getElementById(id)?.addEventListener('invalid',e=>{
   const field=e.target;message(field.name==='pin'?'Tu código debe tener exactamente 6 números.':field.name==='username'?'Escribe tu nombre de usuario (de 3 a 24 caracteres).':'Completa el nombre de tu cazador.',id==='registrationForm');
  },true);
  document.addEventListener('click',async e=>{
   const el=e.target.closest('[data-account]');if(!el)return;const action=el.dataset.account;
   if(action==='open'){if(session&&el.closest('#intro'))window.dispatchEvent(new CustomEvent('guild:resume'));else open();return;}
   if(action==='signup'){if(busy)return;if(session){open();return;}const d=document.getElementById('accountDialog');if(d.open)d.close();window.dispatchEvent(new CustomEvent('guild:signup'));return;}
   if(action==='close'){document.getElementById('accountDialog').close();return;}
   if(action==='logout'){
    try{await request('logout');session=null;status='local';persist();document.getElementById('accountDialog').close();window.dispatchEvent(new CustomEvent('guild:remote-logout'));notify();}catch(err){message(err.message);}return;
   }
   if(action==='sync'){try{const data=await request('state');emit(data);message('Tu crónica está actualizada.');}catch(err){message(err.message);}return;}
   if(action==='migration'){const local=GuildStorage.load();try{await request('migration',{captures:local.captures,unlocked:local.unlocked});message('Solicitud enviada. El responsable del Gremio revisará tu crónica anterior antes de incorporarla.');}catch(err){message(err.message);}}
  });
  document.getElementById('accountForm')?.addEventListener('submit',async e=>{
   e.preventDefault();if(busy)return;const form=e.currentTarget;
   try{const access=credentials(form);const data=await request('login',access);accept(data,form,false);}catch(err){message(err.message);}
  });
  // Account creation includes the selected character. Only server-confirmed rewards enter the cache.
  document.addEventListener('submit',async e=>{
   const id=e.target.id;if(!['huntForm','captureForm','registrationForm'].includes(id)||(!session&&!(configured&&id==='registrationForm')))return;
   e.preventDefault();e.stopImmediatePropagation();if(busy)return;
   const form=e.target;
   try{
    let action,payload;
    if(id==='registrationForm'){
     const profile={player:form.elements.player.value.trim(),specialty:document.getElementById('classSelect').value,origin:document.getElementById('originSelect').value,avatar:document.querySelector('.avatar-option[aria-pressed="true"]')?.dataset.avatar||'hunter-1'};
     if(!profile.player)throw Error('Escribe el nombre de tu cazador o equipo.');
     if(!session){const data=await request('register',{...credentials(form),profile});accept(data,form,true);return;}
     action='profile';payload={profile};
    }else{action=id==='huntForm'?'hunt':'capture';payload={code:document.getElementById(action==='hunt'?'huntCode':'captureCode').value};}
    const data=await request(action,{...payload,requestId:requestId()});emit(data,action==='profile'?'perfil':'contratos');
    if(data.meta?.alreadyCaptured)message('Esta captura ya estaba registrada; no se repitió el botín.');
    else if(action==='hunt')message(data.meta.opened?'El Gremio confirmó nuevos rastros.':'Este contrato ya estaba abierto o completado.');
   }catch(err){message(err.message,id==='registrationForm');}
  },true);
 }
 async function campaign(operation){const data=await request('campaign',{operation,requestId:requestId()});emit(data);return data;}
 async function community(){const data=await request('community');return data.community;}
 return {campaign,community,configured,isActive:()=>!!session,cached:()=>session?.state||null,getStatus:()=>status,getCacheStatus:()=>cacheStatus,install,restore};
})();
