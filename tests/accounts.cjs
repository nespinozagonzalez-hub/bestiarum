const {call}=require('./backend.cjs');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {JSDOM}=require(process.env.BESTIARIUM_JSDOM||'jsdom');
const checks=[];function ok(x){checks.push(x);console.log('PASS',x);}
(async()=>{
 const dom=new JSDOM(fs.readFileSync('index.html','utf8'),{url:'https://example.test/bestiarum/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,$=s=>w.document.querySelector(s);
 w.matchMedia=()=>({matches:false});w.scrollTo=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
 const legacy=JSON.stringify({player:'Anterior',xp:370,captures:['bacillus'],introSeen:true});w.localStorage.setItem('bestiariumV25',legacy);
 w.fetch=async(url,opts)=>({ok:true,json:async()=>call(JSON.parse(opts.body))});
 for(const n of ['config','catalog','campaign','storage','accounts','app']){if(n==='accounts')w.BESTIARIUM_REMOTE.url='https://script.google.com/macros/s/test/exec';w.eval(fs.readFileSync('assets/js/'+n+'.js','utf8'));}
 const click=s=>$(s).click(),submit=s=>$(s).dispatchEvent(new w.SubmitEvent('submit',{bubbles:true,cancelable:true})),tick=()=>new Promise(r=>setTimeout(r,15));
 assert(!$('#intro').hidden);assert($('#app').hidden);assert.equal(w.document.querySelectorAll('#intro button').length,2);assert.equal($('#intro [data-chapter]'),null);assert.equal(w.document.querySelector('[data-account="local"]'),null);assert.equal(w.document.querySelector('[data-action="export"]'),null);
 ok('Inicio con dos caminos, sin historia exterior ni elección de guardado, incluso con partida local anterior');
 click('#intro [data-account="signup"]');assert(!$('#registration').hidden);$('#signupUsername').value='UI Háunter';$('#signupPin').value='003456';$('#playerName').value='Nicolás del Velo';click('[data-avatar="hunter-3"]');$('#classSelect').value='guardian';$('#originSelect').value='forja';assert($('#registrationForm').checkValidity());click('#registrationForm [type="submit"]');await tick();
 assert(w.GuildAccount.isActive());assert.equal($('#hudName').textContent,'Nicolás del Velo');assert.equal($('#hudXP').textContent,'0');assert.equal($('#signupPin').value,'');assert($('#storyDialog').open);assert.equal($('#signupUsername').value,'ui_haunter');
 let cache=JSON.parse(w.localStorage.getItem('bestiarium.chronicle.v35'));assert.equal(cache.state.avatar,'hunter-3');assert.equal(cache.state.origin,'forja');assert.equal(cache.state.specialty,'guardian');assert(!('token' in cache));assert(!('pin' in cache));
 ok('Una sola inscripción crea usuario normalizado, código con cero inicial y personaje elegido; el prólogo comienza dentro');
 click('[data-story="close"]');click('#navigation [data-view="contratos"]');$('#huntCode').value='GREMIO-PANTANO';submit('#huntForm');await tick();$('#captureCode').value='NUCLEO-7';submit('#captureForm');await tick();assert.equal($('#hudXP').textContent,'50');assert($('#ceremony').open);assert.equal(w.localStorage.getItem('bestiariumV25'),legacy);assert.equal(JSON.parse(w.localStorage.getItem('bestiarium.chronicle.v35')).state.xp,50);
 ok('Captura confirmada guarda copia local automáticamente y conserva intacta la crónica anterior');
 for(let i=0;i<3;i++)click('#ceremonyNext');click('#detailDialog .dialog-close');click('#navigation [data-view="taller"]');click('[data-craft="farol"]');await tick();click('#navigation [data-view="codice"]');click('[data-chapter="prologo"]');click('[data-story="next"]');await tick();click('[data-story="close"]');
 cache=JSON.parse(w.localStorage.getItem('bestiarium.chronicle.v35'));assert.equal(cache.state.campaign.pages.prologo,1);assert.equal(cache.state.campaign.crafted[0],'farol');assert.equal(w.localStorage.getItem('bestiariumV25'),legacy);
 ok('Lectura, equipo y avance generan guardado local automático sin botón ni mezcla con otra partida');
 click('#navigation [data-view="perfil"]');click('[data-action="editProfile"]');assert($('#signupAccess').hidden&&$('#signupAccess').disabled);$('#playerName').value='Nicolás Guardián';click('[data-avatar="hunter-4"]');assert($('#registrationForm').checkValidity());submit('#registrationForm');await tick();assert.equal($('#hudName').textContent,'Nicolás Guardián');assert.equal($('#hudXP').textContent,'50');
 ok('Editar personaje no exige volver a crear credenciales y conserva capturas y recompensas');
 click('[data-action="settings"]');click('#accountButton');click('[data-account="logout"]');await tick();assert(!w.GuildAccount.isActive());assert(!$('#intro').hidden);assert($('#app').hidden);assert.equal(w.localStorage.getItem('bestiariumV25'),legacy);
 ok('Cerrar sesión vuelve al inicio sin entrar automáticamente en otra crónica local');
 click('#intro [data-account="open"]');$('#accountUsername').value='UI Háunter';$('#accountPin').value='003456';submit('#accountForm');await tick();assert.equal($('#hudXP').textContent,'50');assert.equal($('#hudName').textContent,'Nicolás Guardián');assert.equal($('#accountPin').value,'');assert(!$('#storyDialog').open);
 ok('Continuar recupera cuenta, personaje y avance y no reinicia el prólogo');
 const session=JSON.parse(w.sessionStorage.getItem('bestiarium.account.v31'));call({action:'logout',token:session.token});click('#navigation [data-view="contratos"]');$('#huntCode').value='GREMIO-BOSQUE';submit('#huntForm');await tick();assert(!w.GuildAccount.isActive());assert(!$('#intro').hidden);assert($('#app').hidden);assert.equal(w.localStorage.getItem('bestiariumV25'),legacy);
 ok('Sesión revocada devuelve al acceso sin convertir el progreso remoto en una partida local');
 click('#intro [data-account="signup"]');$('#signupUsername').value='ui_haunter';$('#signupPin').value='003456';$('#playerName').value='Otro';submit('#registrationForm');await tick();assert(!w.GuildAccount.isActive());assert($('#registrationFeedback').textContent.includes('Continuar mi historia'));assert.equal($('#signupPin').value,'003456');assert(!$('#registration').hidden);
 ok('Usuario existente muestra cómo continuar y conserva el formulario para corregir el registro');
 $('#signupUsername').value='usuario#invalido';submit('#registrationForm');await tick();assert($('#registrationFeedback').textContent.includes('El usuario necesita'));assert(!$('#accountLoading').open);
 ok('Formato de usuario inválido explica el problema junto al formulario sin enviar un registro');
 dom.window.close();fs.writeFileSync('docs/accounts-validation.json',JSON.stringify({date:new Date().toISOString(),method:'Flujo real de eventos DOM con backend Apps Script simulado; pruebas de acceso, personaje y copia local automática',checks},null,2));console.log('COMPLETE',checks.length,'integration checks');
})().catch(e=>{console.error(e);process.exit(1);});
