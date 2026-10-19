const fs=require('node:fs'),assert=require('node:assert/strict');
const {JSDOM}=require(process.env.BESTIARIUM_JSDOM||'jsdom');
const {call}=require('./backend.cjs');
const checks=[],ok=t=>{checks.push(t);console.log('PASS',t);};
const tick=()=>new Promise(r=>setTimeout(r,15));
const endpoint='https://script.google.com/macros/s/test/exec';
function boot(cached,deviceCache){
 const dom=new JSDOM(fs.readFileSync('index.html','utf8'),{url:'https://example.test/bestiarum/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 w.matchMedia=()=>({matches:false});w.scrollTo=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
 if(cached)w.sessionStorage.setItem('bestiarium.account.v31',JSON.stringify(cached));
 if(deviceCache)w.localStorage.setItem('bestiarium.chronicle.v35',JSON.stringify(deviceCache));
 let pending;
 w.fetch=(url,opts)=>new Promise((resolve,reject)=>{pending={resolve,reject,request:JSON.parse(opts.body)};});
 for(const name of ['config','catalog','campaign','storage','accounts','app']){if(name==='accounts')w.BESTIARIUM_REMOTE.url=endpoint;w.eval(fs.readFileSync('assets/js/'+name+'.js','utf8'));}
 return {dom,w,$:s=>w.document.querySelector(s),pending:()=>pending,resolve:()=>pending.resolve({ok:true,json:async()=>call(pending.request)})};
}
(async()=>{
 const a=boot(),{w,$}=a;
 $('#intro [data-account="signup"]').click();assert(!$('#registration').hidden);assert.equal($('#signupPin').autocomplete,'new-password');
 $('#signupUsername').value='loading_hunter';$('#signupPin').value='004209';$('#playerName').value='Guardián de carga';
 $('#registrationForm').dispatchEvent(new w.SubmitEvent('submit',{bubbles:true,cancelable:true}));
 assert($('#accountLoading').open);assert($('#registrationForm [type="submit"]').disabled);assert.equal(a.pending().request.profile.player,'Guardián de carga');
 ok('Registro desde portada sin partida previa: crea perfil válido y muestra carga bloqueando doble envío');
 const cancel=new w.Event('cancel',{cancelable:true});$('#accountLoading').dispatchEvent(cancel);assert(cancel.defaultPrevented);
 a.resolve();await tick();assert(!$('#accountLoading').open);assert(w.GuildAccount.isActive());assert.equal($('#signupPin').value,'');assert.equal($('#hudName').textContent,'Guardián de carga');
 ok('Código con cero inicial aceptado; la carga termina con la cuenta creada y el código borrado');
 $('#storyDialog').close();const cached=JSON.parse(w.sessionStorage.getItem('bestiarium.account.v31'));
 const b=boot({...cached,state:null},JSON.parse(w.localStorage.getItem('bestiarium.chronicle.v35')));assert.equal(b.$('#hudName').textContent,'Guardián de carga');assert(b.$('#accountLoading').open);assert.equal(b.pending().request.action,'state');b.resolve();await tick();assert(!b.$('#accountLoading').open);assert.equal(b.$('#hudName').textContent,'Guardián de carga');
 ok('Recargar recupera la copia local de la misma cuenta y confirma el avance del servidor mediante la carga');
 b.$('#accountButton').click();b.$('[data-account="sync"]').click();assert(b.$('#accountLoading').open);b.pending().reject(new Error('Conexión interrumpida'));await tick();assert(!b.$('#accountLoading').open);assert(b.$('#accountFeedback').textContent.includes('Conexión interrumpida'));assert(b.w.GuildAccount.isActive());assert(!b.$('#view-refugio').hidden);
 ok('Fallo de red cierra la carga, mantiene la última crónica y permite reintentar');
 b.$('[data-account="sync"]').click();b.resolve();await tick();assert(!b.$('#accountLoading').open);assert(b.$('#accountFeedback').textContent.includes('actualizada'));
 ok('Reintentar sincronización recupera el estado y vuelve a habilitar los controles');
 const c=boot();c.$('#intro [data-account="open"]').click();c.$('#accountUsername').value='loading_hunter';c.$('#accountPin').value='999999';c.$('#accountForm').dispatchEvent(new c.w.SubmitEvent('submit',{bubbles:true,cancelable:true,submitter:c.$('#accountForm [value="login"]')}));c.resolve();await tick();assert(!c.$('#accountLoading').open);assert(c.$('#accountDialog').open);assert(!c.$('#accountForm [value="login"]').disabled);assert(!c.w.GuildAccount.isActive());
 ok('Código erróneo cierra la carga y deja el acceso disponible sin entrar en otra cuenta');
 [a,b,c].forEach(x=>x.dom.window.close());
 fs.writeFileSync('docs/account-loading-validation.json',JSON.stringify({date:new Date().toISOString(),method:'DOM y servidor simulado con respuesta demorada, rechazo de red y reintentos',checks},null,2));console.log('COMPLETE',checks.length,'loading checks');
})().catch(e=>{console.error(e);process.exit(1);});
