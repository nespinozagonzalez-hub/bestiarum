/* Event-driven regression tests in a DOM simulator; visual QA is separate. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require(process.env.BESTIARIUM_JSDOM||'jsdom');
const html=fs.readFileSync('index.html','utf8');
const scripts=['config','catalog','campaign','storage','accounts','app'].map(n=>fs.readFileSync('assets/js/'+n+'.js','utf8'));
const results=[];
function ok(label){results.push(label);console.log('PASS',label);}
function make(old,quotaBackup=false,preview=false){
 const dom=new JSDOM(preview?html.replace('<head>','<head><base href="../">'):html,{url:'https://example.test/bestiarum/'+(preview?'preview/':''),runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;w.matchMedia=()=>({matches:false});w.scrollTo=()=>{};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
 w.HTMLDialogElement.prototype.close=function(){this.open=false;};
 if(old)w.localStorage.setItem('bestiariumV25',typeof old==='string'?old:JSON.stringify(old));
 if(quotaBackup){const original=w.Storage.prototype.setItem;w.Storage.prototype.setItem=function(k,v){if(k==='bestiariumV25.pre-remaster')throw Error('quota');return original.call(this,k,v);};}
 for(const s of scripts)w.eval(s);
 const $=s=>w.document.querySelector(s);
 const click=s=>{assert($(s),'Missing '+s);$(s).click();};
 const submit=s=>$(s).dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
 const value=(s,v)=>{$(s).value=v;};
 const state=()=>JSON.parse(w.localStorage.getItem('bestiariumV25'));
 const nav=v=>click('#navigation [data-view="'+v+'"]');
 const hunt=code=>{nav('contratos');value('#huntCode',code);submit('#huntForm');};
 const capture=code=>{value('#captureCode',code);submit('#captureForm');};
 const ceremony=()=>{for(let i=0;i<3;i++)click('#ceremonyNext');click('#detailDialog .dialog-close');};
 const register=(name='Escuadrón Niebla')=>{click('[data-action="register"]');value('#playerName',name);click('[data-avatar="hunter-3"]');value('#classSelect','guardian');value('#originSelect','forja');submit('#registrationForm');};
 return {dom,w,$,click,submit,value,state,nav,hunt,capture,ceremony,register};
}
const t=make(),D=t.w.BESTIARIUM;
t.register();assert.equal(t.state().player,'Escuadrón Niebla');assert.equal(t.state().avatar,'hunter-3');assert.equal(t.state().origin,'forja');ok('Registro, apariencia, senda y origen');
t.nav('contratos');assert(t.$('#captureCode').disabled);t.hunt('INVALIDO');assert.equal(t.state().unlocked.length,0);ok('Códigos iniciales incorrectos y captura cerrada');
t.hunt(' gremio-pantano ');assert.equal(t.state().unlocked.length,5);for(const m of D.monsters.filter(m=>m.zoneId==='pantano'))assert(!t.$('#view-contratos').textContent.includes(m.name));t.hunt('GREMIO-PANTANO');assert.equal(t.state().activity.length,5);ok('Apertura sin revelar nombres y sin duplicar eventos');
t.capture('INVALIDO');assert.equal(t.state().captures.length,0);t.capture(D.monsters.find(m=>m.zoneId==='bosque').captureCode);assert.equal(t.state().captures.length,0);ok('Código final incorrecto o de una cacería cerrada rechazado');
const first=D.monsters[0];t.capture(first.captureCode);t.capture(first.captureCode);assert.equal(t.state().captures.length,1);assert.equal(t.state().xp,first.reward.xp);t.ceremony();assert.deepEqual(t.state().inventory,JSON.parse(JSON.stringify(first.reward.mats)));t.nav('contratos');t.capture(first.captureCode);assert.equal(t.state().xp,first.reward.xp);ok('Captura única: ceremonia, recompensa exacta y doble envío bloqueado');
const reloaded=make(t.state());assert.equal(reloaded.$('#hudXP').textContent,String(first.reward.xp));assert.equal(reloaded.$('#hudName').textContent,'Escuadrón Niebla');reloaded.dom.window.close();ok('Progreso recuperable al recargar');
t.nav('bestiario');t.value('#zoneFilter','pantano');t.$('#zoneFilter').dispatchEvent(new t.w.Event('change',{bubbles:true}));assert.equal(t.w.document.querySelectorAll('.beast-card').length,5);t.value('#stateFilter','captured');t.$('#stateFilter').dispatchEvent(new t.w.Event('change',{bubbles:true}));assert.equal(t.w.document.querySelectorAll('.beast-card').length,1);t.value('#beastSearch','virulox');t.$('#beastSearch').dispatchEvent(new t.w.Event('input',{bubbles:true}));assert.equal(t.w.document.querySelectorAll('.beast-card').length,1);ok('Filtros y búsqueda de registros revelados');
const boss=D.monsters.find(m=>m.id==='quimerax');t.hunt(boss.sessionCode);t.capture(boss.captureCode);assert(!t.state().captures.includes('quimerax'));assert(t.$('#captureFeedback').textContent.includes('sellos clave'));for(const m of D.monsters.filter(m=>!t.state().captures.includes(m.id)))assert(!t.$('#captureFeedback').textContent.includes(m.name));ok('Quimerax bloqueado por los seis requisitos, sin revelar nombres pendientes');
for(const id of boss.requires){if(t.state().captures.includes(id))continue;const m=D.monsters.find(m=>m.id===id);t.hunt(m.sessionCode);t.capture(m.captureCode);t.ceremony();}
t.nav('contratos');t.capture(boss.captureCode);assert(t.state().captures.includes('quimerax'));t.ceremony();ok('Quimerax se sella al reunir sus seis capturas originales');
for(const z of D.zones){const mons=D.monsters.filter(m=>m.zoneId===z.id);t.hunt(mons[0].sessionCode);for(const m of mons){if(t.state().captures.includes(m.id))continue;t.nav('contratos');t.capture(m.captureCode);t.ceremony();}}
assert.equal(t.state().captures.length,22);assert.equal(t.state().xp,D.monsters.reduce((n,m)=>n+m.reward.xp,0));const inventory={};for(const m of D.monsters)for(const [k,n] of Object.entries(m.reward.mats))inventory[k]=(inventory[k]||0)+n;assert.deepEqual(t.state().inventory,inventory);t.nav('perfil');assert.equal(t.w.document.querySelectorAll('.trophy.earned').length,8);t.nav('cronica');assert.equal(t.w.document.querySelectorAll('.chronicle-item').length,44);ok('Colección completa: 22 capturas, XP e inventario exactos, ocho trofeos, 44 eventos');
const old={player:'Cazador anterior',specialty:'Analista de Laboratorio',xp:370,captures:['virulox','bacillus'],unlocked:['virulox','bacillus','micelombra'],inventory:{'Fragmento Viral':2,'Muestra de Lab.':2,'Coraza Bacteriana':1},activity:[{type:'capture',mid:'virulox',date:1700000000000,xp:50}],registeredAt:{virulox:1700000000000},introSeen:true};
const legacy=make(old);assert.equal(legacy.w.localStorage.getItem('bestiariumV25.pre-remaster'),JSON.stringify(old));legacy.nav('perfil');assert(legacy.$('#view-perfil').textContent.includes('Alquimista de Ceniza'));legacy.hunt('GREMIO-BOSQUE');for(const k of ['player','specialty','xp','captures','inventory','registeredAt'])assert.deepEqual(legacy.state()[k],old[k]);ok('Migración V2.5: conserva XP, inventario, capturas, fechas y copia original');
const fault=make();fault.register();fault.hunt('GREMIO-PANTANO');const before=fault.state();fault.w.Storage.prototype.setItem=function(){throw Error('quota');};fault.capture(first.captureCode);assert.deepEqual(fault.state(),before);assert(!fault.$('#ceremony').open);assert(fault.$('#saveStatus').textContent.includes('No se pudo guardar'));ok('Fallo de guardado revierte la captura, avisa y no entrega botín');
const quota=make(old,true);assert.equal(quota.$('#hudName').textContent,old.player);assert.equal(quota.$('#hudXP').textContent,String(old.xp));ok('El fallo al crear el respaldo no impide recuperar una partida legible');
const corrupt=make('{invalid json');assert.equal(corrupt.w.localStorage.getItem('bestiariumV25.pre-remaster'),'{invalid json');assert.equal(corrupt.w.localStorage.getItem('bestiariumV25'),'{invalid json');ok('El dato corrupto se conserva y no se sobrescribe durante la lectura');
const hostile=make();hostile.register('<img src=x onerror=alert(1)>');assert.equal(hostile.w.document.querySelectorAll('#app img[src="x"]').length,0);ok('Nombres escapados contra interpretación de HTML');
t.nav('perfil');t.click('#view-perfil [data-action="editProfile"]');t.click('[data-avatar="hunter-4"]');t.submit('#registrationForm');assert.equal(t.state().captures.length,22);assert.equal(t.state().avatar,'hunter-4');ok('Cambiar apariencia conserva toda la colección');
t.click('#view-perfil [data-action="settings"]');t.$('#motionSetting').checked=true;t.$('#motionSetting').dispatchEvent(new t.w.Event('change',{bubbles:true}));assert(t.w.document.documentElement.classList.contains('reduce-motion'));ok('Preferencia de movimiento reducido');
const preview=make(undefined,false,true);preview.register();preview.nav('atlas');assert.equal(preview.w.location.pathname,'/bestiarum/preview/');ok('La vista de revisión conserva su URL al navegar');
for(const x of [t,legacy,fault,quota,corrupt,hostile,preview])x.dom.window.close();
fs.writeFileSync('docs/validation.json',JSON.stringify({date:new Date().toISOString(),method:'DOM simulado con eventos reales del controlador; revisión visual separada',checks:results},null,2));
console.log('COMPLETE',results.length,'checks');
