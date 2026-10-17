/** BESTIARIUM III · Apps Script V8. Ejecuta setupBestiarium una vez.
 * La hoja permanece privada. Publicar como aplicación web: ejecutar como tú,
 * acceso Cualquier persona. Pegar la URL /exec en assets/js/config.js.
 * No guarda claves en texto plano ni acepta XP/inventario del navegador.
 */
const BG_VERSION='3.1.0';
const BG_HEADERS={
 Usuarios:['id','usuario','sal','hash_clave','estado_json','creado_ms','fallos','ventana_fallos_ms','bloqueado_hasta_ms'],
 Sesiones:['hash_token','usuario_id','expira_ms','revocada_ms'],
 Catalogo:['id','nombre','zona','codigo_inicial','codigo_captura','xp','materiales_json','requisitos_json'],
 Eventos:['id','usuario_id','fecha_ms','tipo','bestia_id','xp'],
 Migraciones:['id','usuario_id','fecha_ms','capturas_json','desbloqueadas_json','estado','nota']
};
function setupBestiarium(){
 const p=PropertiesService.getScriptProperties();
 let book=p.getProperty('BG_SHEET_ID')?SpreadsheetApp.openById(p.getProperty('BG_SHEET_ID')):SpreadsheetApp.getActiveSpreadsheet();
 if(!book)book=SpreadsheetApp.create('Bestiarium · Archivos del Gremio');
 p.setProperty('BG_SHEET_ID',book.getId());
 if(!p.getProperty('BG_PEPPER'))p.setProperty('BG_PEPPER',uuid_()+uuid_()+uuid_());
 if(!p.getProperty('BG_REGISTRO_ABIERTO'))p.setProperty('BG_REGISTRO_ABIERTO','true');
 Object.keys(BG_HEADERS).forEach(name=>{
  let sh=book.getSheetByName(name);if(!sh)sh=book.insertSheet(name);
  if(sh.getLastRow()===0){sh.appendRow(BG_HEADERS[name]);sh.setFrozenRows(1);sh.getRange(1,1,1,BG_HEADERS[name].length).setBackground('#202b20').setFontColor('#dfc999').setFontWeight('bold');}
 });
 const cat=book.getSheetByName('Catalogo');const present=rows_(cat).map(r=>r[0]);
 BG_SEED.forEach(m=>{if(present.indexOf(m.id)<0)cat.appendRow([m.id,m.name,m.zoneId,m.sessionCode,m.captureCode,m.reward.xp,JSON.stringify(m.reward.mats),JSON.stringify(m.requires||[])]);});
 const result={ok:true,version:BG_VERSION,spreadsheetUrl:book.getUrl()};console.log(JSON.stringify(result));return result;
}
function onOpen(){try{SpreadsheetApp.getUi().createMenu('Bestiarium').addItem('Preparar archivos','setupBestiarium').addItem('Procesar migraciones marcadas APROBAR','procesarMigracionesAprobadas').addToUi();}catch(e){}}
function doGet(){return json_({ok:true,service:'Bestiarium',version:BG_VERSION,ready:!!PropertiesService.getScriptProperties().getProperty('BG_SHEET_ID')});}
function doPost(e){
 let lock;
 try{
  const text=e&&e.postData&&e.postData.contents||'';if(text.length>24000)fail_('SOLICITUD_GRANDE','La solicitud supera el tamaño permitido.');
  const q=JSON.parse(text);if(!q||typeof q!=='object'||Array.isArray(q))fail_('SOLICITUD_INVALIDA','Solicitud no válida.');
  lock=LockService.getScriptLock();if(!lock.tryLock(15000))fail_('OCUPADO','Los archivos están ocupados. Vuelve a intentarlo.');
  return json_(route_(q));
 }catch(err){return json_({ok:false,code:err.bgCode||'ERROR_SERVICIO',message:err.bgCode?err.message:'No fue posible consultar los archivos del Gremio.'});}
 finally{if(lock&&lock.hasLock())lock.releaseLock();}
}
function route_(q){
 const book=book_(),users=book.getSheetByName('Usuarios'),sessions=book.getSheetByName('Sesiones');
 if(q.action==='register'||q.action==='login'){
  const username=String(q.username||'').trim().toLowerCase(),pin=String(q.pin||'');
  if(!/^[a-z0-9][a-z0-9_.-]{2,23}$/.test(username)||!/^\d{6}$/.test(pin))fail_('DATOS_ACCESO','Usa un usuario de 3 a 24 caracteres y una clave de seis dígitos.');
  let found=find_(users,1,username);
  if(q.action==='register'){
   if(PropertiesService.getScriptProperties().getProperty('BG_REGISTRO_ABIERTO')!=='true')fail_('REGISTRO_CERRADO','El Gremio no admite nuevos registros por ahora.');
   if(found)fail_('USUARIO_EXISTE','Ese nombre de usuario ya está inscrito.');
   if(users.getLastRow()>1000)fail_('REGISTRO_LLENO','El registro alcanzó su capacidad.');
   throttleRegistration_();const id=uuid_(),salt=uuid_(),s=emptyState_(q.profile||{});
   users.appendRow([id,username,salt,pinHash_(pin,salt),JSON.stringify(s),Date.now(),0,0,0]);found=find_(users,1,username);
  }else{
   if(!found)fail_('ACCESO_INVALIDO','Usuario o clave no válidos.');
   const row=found.values,now=Date.now();if(Number(row[8])>now)fail_('ACCESO_BLOQUEADO','Demasiados intentos. Espera 15 minutos.');
   if(!equal_(row[3],pinHash_(pin,row[2]))){
    const fresh=now-Number(row[7])>900000,count=fresh?1:Number(row[6])+1;
    users.getRange(found.row,7,1,3).setValues([[count,fresh?now:Number(row[7]),count>=5?now+900000:0]]);
    fail_('ACCESO_INVALIDO','Usuario o clave no válidos.');
   }
   users.getRange(found.row,7,1,3).setValues([[0,0,0]]);
  }
  const token=uuid_()+uuid_()+uuid_(),expires=Date.now()+43200000;
  sessions.appendRow([hash_(token),found.values[0],expires,0]);
  return {ok:true,token:token,username:username,userId:found.values[0],expires:expires,state:publicState_(JSON.parse(found.values[4]))};
 }
 const auth=authenticate_(sessions,users,q.token),record=auth.user,s=JSON.parse(record.values[4]),catalog=catalog_(book);
 if(q.action==='logout'){sessions.getRange(auth.session.row,4).setValue(Date.now());return {ok:true};}
 if(q.action==='state')return {ok:true,state:publicState_(s),username:record.values[1]};
 if(q.action==='migration'){
  const valid=new Set(catalog.map(m=>m.id)),captures=cleanIds_(q.captures,valid),unlocked=cleanIds_(q.unlocked,valid);
  const sh=book.getSheetByName('Migraciones'),pending=rows_(sh).find(r=>r[1]===record.values[0]&&['PENDIENTE','APROBAR'].indexOf(r[5])>=0);
  if(pending)return {ok:true,pending:true};
  sh.appendRow([uuid_(),record.values[0],Date.now(),JSON.stringify(captures),JSON.stringify(unlocked),'PENDIENTE','Revisar antes de aprobar. XP y materiales se recalculan en servidor.']);
  return {ok:true,pending:true};
 }
 if(['hunt','capture','profile'].indexOf(q.action)<0)fail_('ACCION_INVALIDA','Acción no permitida.');
 const requestId=String(q.requestId||'');if(!/^[a-zA-Z0-9_-]{8,100}$/.test(requestId))fail_('ID_INVALIDO','La operación necesita un identificador válido.');
 const signature=hash_(JSON.stringify([q.action,q.code||'',q.profile||null]));
 const old=(s._receipts||[]).find(x=>x.id===requestId);
 if(old){if(old.signature!==signature)fail_('ID_REUTILIZADO','El identificador ya corresponde a otra operación.');return {ok:true,state:publicState_(s),meta:old.meta,replayed:true};}
 let meta={action:q.action},events=[];
 if(q.action==='profile')Object.assign(s,profile_(q.profile||{}));
 if(q.action==='hunt'){
  const code=String(q.code||'').trim().toUpperCase(),matches=catalog.filter(m=>m.sessionCode===code);
  if(!matches.length)fail_('CODIGO_INVALIDO','El Gremio no reconoce el código inicial.');
  matches.filter(m=>s.unlocked.indexOf(m.id)<0&&s.captures.indexOf(m.id)<0).forEach(m=>{s.unlocked.push(m.id);const ev={type:'unlock',mid:m.id,date:Date.now()};s.activity.unshift(ev);events.push(ev);});
  meta.opened=events.length;
 }
 if(q.action==='capture'){
  const m=catalog.find(m=>m.captureCode===String(q.code||'').trim().toUpperCase());
  if(!m)fail_('CODIGO_INVALIDO','El Gremio no reconoce el sello final.');
  if(s.captures.indexOf(m.id)>=0)meta.alreadyCaptured=true;
  else{
   if(s.unlocked.indexOf(m.id)<0)fail_('CACERIA_CERRADA','Primero debes abrir la cacería correspondiente.');
   if(m.requires.some(id=>s.captures.indexOf(id)<0))fail_('SELLOS_PENDIENTES','El umbral final todavía necesita sus seis sellos clave.');
   meta={action:'capture',monsterId:m.id,oldRank:rank_(s.xp),newRank:rank_(s.xp+m.reward.xp)};
   s.captures.push(m.id);s.xp+=m.reward.xp;s.registeredAt[m.id]=Date.now();
   Object.keys(m.reward.mats).forEach(k=>{s.inventory[k]=(s.inventory[k]||0)+m.reward.mats[k];});
   const ev={type:'capture',mid:m.id,date:Date.now(),xp:m.reward.xp};s.activity.unshift(ev);events.push(ev);
  }
 }
 s._receipts=(s._receipts||[]).concat([{id:requestId,signature:signature,meta:meta}]).slice(-40);
 // One authoritative cell contains captures, rewards, history AND the receipt.
 // If the response is lost, retrying the request cannot award the loot twice.
 users.getRange(record.row,5).setValue(JSON.stringify(s));SpreadsheetApp.flush();
 events.forEach(ev=>{try{book.getSheetByName('Eventos').appendRow([uuid_(),record.values[0],ev.date,ev.type,ev.mid,ev.xp||0]);}catch(error){console.log('Audit append unavailable; authoritative history remains in state.');}});
 return {ok:true,state:publicState_(s),meta:meta};
}
function procesarMigracionesAprobadas(){
 const lock=LockService.getScriptLock();lock.waitLock(15000);
 try{
  const book=book_(),sh=book.getSheetByName('Migraciones'),users=book.getSheetByName('Usuarios'),cat=catalog_(book),valid=new Set(cat.map(m=>m.id));let processed=0;
  rows_(sh).forEach((r,i)=>{if(r[5]!=='APROBAR')return;const user=find_(users,0,r[1]);if(!user)return;
   const s=JSON.parse(user.values[4]),cap=cleanIds_(JSON.parse(r[3]),valid),unlocked=cleanIds_(JSON.parse(r[4]),valid);
   const combined=Array.from(new Set(s.captures.concat(cap)));const boss=cat.find(m=>m.id==='quimerax');
   s.captures=combined.filter(id=>id!=='quimerax'||!boss||boss.requires.every(req=>combined.indexOf(req)>=0));
   s.unlocked=Array.from(new Set(s.unlocked.concat(unlocked,s.captures)));s.xp=0;s.inventory={};
   cat.filter(m=>s.captures.indexOf(m.id)>=0).forEach(m=>{s.xp+=m.reward.xp;Object.keys(m.reward.mats).forEach(k=>s.inventory[k]=(s.inventory[k]||0)+m.reward.mats[k]);if(!s.registeredAt[m.id]){s.registeredAt[m.id]=Date.now();s.activity.unshift({type:'capture',mid:m.id,date:Date.now(),xp:m.reward.xp});}});
   users.getRange(user.row,5).setValue(JSON.stringify(s));sh.getRange(i+2,6).setValue('APROBADA');processed++;
  });return {processed:processed};
 }finally{lock.releaseLock();}
}
function book_(){const id=PropertiesService.getScriptProperties().getProperty('BG_SHEET_ID');if(!id)fail_('SIN_INSTALAR','Ejecuta setupBestiarium antes de publicar.');return SpreadsheetApp.openById(id);}
function rows_(sh){return sh.getLastRow()<2?[]:sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();}
function find_(sh,col,value){const data=rows_(sh);for(let i=0;i<data.length;i++)if(String(data[i][col])===String(value))return {row:i+2,values:data[i]};return null;}
function catalog_(book){return rows_(book.getSheetByName('Catalogo')).map(r=>{const xp=Number(r[5]),mats=JSON.parse(r[6]),requires=JSON.parse(r[7]);if(!Number.isFinite(xp)||xp<0||xp>10000||Object.keys(mats).some(k=>!Number.isFinite(mats[k])||mats[k]<0))fail_('CATALOGO_INVALIDO','Revisa las recompensas del catálogo.');return {id:r[0],name:r[1],zoneId:r[2],sessionCode:String(r[3]).toUpperCase(),captureCode:String(r[4]).toUpperCase(),reward:{xp:xp,mats:mats},requires:requires};});}
function authenticate_(sessions,users,token){if(!/^[a-f0-9]{96}$/.test(String(token||'')))fail_('SESION_INVALIDA','Vuelve a entrar con tu usuario y clave.');const session=find_(sessions,0,hash_(token));if(!session||Number(session.values[2])<Date.now()||Number(session.values[3])>0)fail_('SESION_INVALIDA','La sesión terminó. Vuelve a entrar.');const user=find_(users,0,session.values[1]);if(!user)fail_('SESION_INVALIDA','Vuelve a entrar.');return {user:user,session:session};}
function profile_(p){const player=String(p.player||'Cazador').trim().slice(0,32);if(!player)fail_('NOMBRE_INVALIDO','Escribe el nombre de tu cazador.');return {player:player,specialty:['rastreador','alquimista','guardian','cartografo'].indexOf(p.specialty)>=0?p.specialty:'rastreador',avatar:['hunter-1','hunter-2','hunter-3','hunter-4'].indexOf(p.avatar)>=0?p.avatar:'hunter-1',origin:['pantano','bosque','crater','forja','ruinas'].indexOf(p.origin)>=0?p.origin:'bosque'};}
function emptyState_(p){return Object.assign({xp:0,captures:[],unlocked:[],inventory:{},activity:[],registeredAt:{},introSeen:true,schemaVersion:3,_receipts:[]},profile_(p));}
function publicState_(s){const copy=JSON.parse(JSON.stringify(s));delete copy._receipts;return copy;}
function cleanIds_(a,valid){return Array.isArray(a)?Array.from(new Set(a.filter(id=>typeof id==='string'&&valid.has(id)))):[];}
function rank_(xp){return xp>=1000?'S':xp>=700?'A':xp>=450?'B':xp>=250?'C':xp>=100?'D':'E';}
function uuid_(){return Utilities.getUuid().replace(/-/g,'').toLowerCase();}
function hex_(a){return a.map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');}
function hash_(text){return hex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(text),Utilities.Charset.UTF_8));}
function pinHash_(pin,salt){return hex_(Utilities.computeHmacSha256Signature(salt+':'+pin,PropertiesService.getScriptProperties().getProperty('BG_PEPPER'),Utilities.Charset.UTF_8));}
function equal_(a,b){a=String(a);b=String(b);let n=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)n|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return n===0;}
function throttleRegistration_(){const p=PropertiesService.getScriptProperties(),now=Date.now(),r=JSON.parse(p.getProperty('BG_REG_RATE')||'{"time":0,"count":0}');if(now-r.time>60000){r.time=now;r.count=0;}if(r.count>=60)fail_('REGISTRO_OCUPADO','Espera un minuto para inscribir otro usuario.');r.count++;p.setProperty('BG_REG_RATE',JSON.stringify(r));}
function fail_(code,message){const e=new Error(message);e.bgCode=code;throw e;}
function json_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
// El instalador añade aquí el catálogo inicial original, con sus 22 IDs y premios.

const BG_SEED=[
  {
    "id": "virulox",
    "name": "Virulox",
    "zoneId": "pantano",
    "sessionCode": "GREMIO-PANTANO",
    "captureCode": "NUCLEO-7",
    "reward": {
      "xp": 50,
      "mats": {
        "Fragmento Viral": 2,
        "Muestra de Lab.": 1,
        "Sello de Rastreador": 1
      }
    },
    "requires": []
  },
  {
    "id": "bacillus",
    "name": "Báculor Carmesí",
    "zoneId": "pantano",
    "sessionCode": "GREMIO-PANTANO",
    "captureCode": "PARED-5",
    "reward": {
      "xp": 60,
      "mats": {
        "Placa de Cultivo": 2,
        "Coraza Bacteriana": 1,
        "Muestra de Lab.": 1
      }
    },
    "requires": []
  },
  {
    "id": "micelombra",
    "name": "Micelombra",
    "zoneId": "pantano",
    "sessionCode": "GREMIO-PANTANO",
    "captureCode": "ESPORA-8",
    "reward": {
      "xp": 55,
      "mats": {
        "Espora Sellada": 2,
        "Filamento Fúngico": 1,
        "Muestra de Lab.": 1
      }
    },
    "requires": []
  },
  {
    "id": "parasitrox",
    "name": "Parasitrox",
    "zoneId": "pantano",
    "sessionCode": "GREMIO-PANTANO",
    "captureCode": "HUESPED-4",
    "reward": {
      "xp": 65,
      "mats": {
        "Garra Parasitaria": 1,
        "Toxina Neutralizada": 2,
        "Muestra de Lab.": 1
      }
    },
    "requires": []
  },
  {
    "id": "vacunara",
    "name": "Vaelunara",
    "zoneId": "pantano",
    "sessionCode": "GREMIO-PANTANO",
    "captureCode": "MEMORIA-12",
    "reward": {
      "xp": 70,
      "mats": {
        "Sello Inmune": 2,
        "Memoria Celular": 1,
        "Fragmento Viral": 1
      }
    },
    "requires": []
  },
  {
    "id": "osmogarra",
    "name": "Osmogarra",
    "zoneId": "bosque",
    "sessionCode": "GREMIO-CELULA",
    "captureCode": "BICAPA-9",
    "reward": {
      "xp": 70,
      "mats": {
        "Cristal de Bicapa": 2,
        "Proteína Canal": 1,
        "Núcleo de Equilibrio": 1
      }
    },
    "requires": []
  },
  {
    "id": "ribosomor",
    "name": "Ribósmor",
    "zoneId": "bosque",
    "sessionCode": "GREMIO-CELULA",
    "captureCode": "PROTEINA-6",
    "reward": {
      "xp": 55,
      "mats": {
        "Cadena Proteica": 2,
        "Engranaje Ribosomal": 1,
        "Muestra de Lab.": 1
      }
    },
    "requires": []
  },
  {
    "id": "lisombra",
    "name": "Lisombra",
    "zoneId": "bosque",
    "sessionCode": "GREMIO-CELULA",
    "captureCode": "ACIDO-11",
    "reward": {
      "xp": 55,
      "mats": {
        "Enzima Ácida": 2,
        "Vesícula Sellada": 1,
        "Núcleo de Equilibrio": 1
      }
    },
    "requires": []
  },
  {
    "id": "nucleara",
    "name": "Núcleara",
    "zoneId": "bosque",
    "sessionCode": "GREMIO-CELULA",
    "captureCode": "NUCLEO-21",
    "reward": {
      "xp": 85,
      "mats": {
        "Fragmento Nuclear": 2,
        "Sello de Control": 1,
        "Cadena de ADN": 1
      }
    },
    "requires": []
  },
  {
    "id": "cromavorax",
    "name": "Cromavorax",
    "zoneId": "crater",
    "sessionCode": "GREMIO-GEN",
    "captureCode": "HELIX-3",
    "reward": {
      "xp": 90,
      "mats": {
        "Fragmento de ADN": 2,
        "Cadena de ARN": 2,
        "Muestra de Lab.": 1
      }
    },
    "requires": []
  },
  {
    "id": "helicassa",
    "name": "Helicassa",
    "zoneId": "crater",
    "sessionCode": "GREMIO-GEN",
    "captureCode": "COPIA-18",
    "reward": {
      "xp": 90,
      "mats": {
        "Hélice Duplicada": 2,
        "Enzima Replicante": 1,
        "Fragmento de ADN": 1
      }
    },
    "requires": []
  },
  {
    "id": "mutagenoalfa",
    "name": "Morfalfa",
    "zoneId": "crater",
    "sessionCode": "GREMIO-GEN",
    "captureCode": "MUTA-404",
    "reward": {
      "xp": 110,
      "mats": {
        "Fragmento Mutante": 2,
        "Gen Alterado": 1,
        "Toxina Neutralizada": 1
      }
    },
    "requires": []
  },
  {
    "id": "transcriptor",
    "name": "El Transcriptor",
    "zoneId": "crater",
    "sessionCode": "GREMIO-GEN",
    "captureCode": "ARN-22",
    "reward": {
      "xp": 75,
      "mats": {
        "Cadena de ARN": 2,
        "Pluma Transcripta": 1,
        "Sello de Control": 1
      }
    },
    "requires": []
  },
  {
    "id": "mitocrix",
    "name": "Mitocrix",
    "zoneId": "forja",
    "sessionCode": "GREMIO-ENERGIA",
    "captureCode": "ATP-42",
    "reward": {
      "xp": 85,
      "mats": {
        "Fragmento de ATP": 3,
        "Cristal Mitocondrial": 1,
        "Muestra de Lab.": 1
      }
    },
    "requires": []
  },
  {
    "id": "clorofang",
    "name": "Clorofang",
    "zoneId": "forja",
    "sessionCode": "GREMIO-ENERGIA",
    "captureCode": "LUZ-15",
    "reward": {
      "xp": 75,
      "mats": {
        "Núcleo Clorofílico": 2,
        "Hoja Lumínica": 1,
        "Catalizador Energético": 1
      }
    },
    "requires": []
  },
  {
    "id": "glucolixrex",
    "name": "Glúcor Rex",
    "zoneId": "forja",
    "sessionCode": "GREMIO-ENERGIA",
    "captureCode": "GLUCO-10",
    "reward": {
      "xp": 85,
      "mats": {
        "Fragmento de Glucosa": 2,
        "Chispa Metabólica": 2,
        "Fragmento de ATP": 1
      }
    },
    "requires": []
  },
  {
    "id": "termovolt",
    "name": "Termovolt",
    "zoneId": "forja",
    "sessionCode": "GREMIO-ENERGIA",
    "captureCode": "VOLTA-30",
    "reward": {
      "xp": 85,
      "mats": {
        "Núcleo Voltaico": 2,
        "Placa Térmica": 1,
        "Catalizador Energético": 1
      }
    },
    "requires": []
  },
  {
    "id": "hormonarca",
    "name": "Ormonarca",
    "zoneId": "ruinas",
    "sessionCode": "GREMIO-CUERPO",
    "captureCode": "ENDO-5",
    "reward": {
      "xp": 85,
      "mats": {
        "Sello Hormonal": 2,
        "Cristal Endocrino": 1,
        "Pulso Regulador": 1
      }
    },
    "requires": []
  },
  {
    "id": "gametrix",
    "name": "Gámetrix",
    "zoneId": "ruinas",
    "sessionCode": "GREMIO-CUERPO",
    "captureCode": "GAMETO-2",
    "reward": {
      "xp": 70,
      "mats": {
        "Núcleo Gamético": 2,
        "Sello de Unión": 1,
        "Pulso Regulador": 1
      }
    },
    "requires": []
  },
  {
    "id": "embryonox",
    "name": "Embryonox",
    "zoneId": "ruinas",
    "sessionCode": "GREMIO-CUERPO",
    "captureCode": "ETAPA-9",
    "reward": {
      "xp": 90,
      "mats": {
        "Capa Embrionaria": 2,
        "Latido Inicial": 1,
        "Núcleo Gamético": 1
      }
    },
    "requires": []
  },
  {
    "id": "puberox",
    "name": "Púberox",
    "zoneId": "ruinas",
    "sessionCode": "GREMIO-CUERPO",
    "captureCode": "CAMBIO-13",
    "reward": {
      "xp": 75,
      "mats": {
        "Marca de Cambio": 2,
        "Sello Hormonal": 1,
        "Pulso Regulador": 1
      }
    },
    "requires": []
  },
  {
    "id": "quimerax",
    "name": "Quimerax",
    "zoneId": "dominio",
    "sessionCode": "GREMIO-BOSS",
    "captureCode": "QUIMERAX-FINAL",
    "reward": {
      "xp": 180,
      "mats": {
        "Escama de Quimerax": 1,
        "Esencia Combinada": 2,
        "Insignia Legendaria": 1
      }
    },
    "requires": [
      "virulox",
      "bacillus",
      "osmogarra",
      "cromavorax",
      "mitocrix",
      "hormonarca"
    ]
  }
];
