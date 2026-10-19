/* Authorized smoke test of the actual frontend and deployed backend. No credentials are logged. */
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{spawn}=require('node:child_process');
const {JSDOM}=require('jsdom'),checks=[],requests=[];
function bridge(url,opts){return new Promise((resolve,reject)=>{
 const child=spawn('python',['-c',"import sys,json,urllib.request; q=json.load(sys.stdin); req=urllib.request.Request(q['url'],data=q['body'].encode(),headers={'Content-Type':'text/plain;charset=utf-8','Origin':'https://nespinozagonzalez-hub.github.io'}); r=urllib.request.urlopen(req,timeout=65); print(json.dumps({'body':r.read().decode(),'cors':r.headers.get('Access-Control-Allow-Origin'),'status':r.status}))"]);
 let out='';child.stdout.on('data',d=>out+=d);child.stderr.resume();child.on('error',reject);child.on('close',code=>{if(code)return reject(Error('No se pudo completar la consulta de prueba'));try{const r=JSON.parse(out);requests.push({action:JSON.parse(opts.body).action,cors:r.cors,status:r.status});resolve({ok:r.status===200,json:async()=>JSON.parse(r.body)});}catch{reject(Error('Respuesta de prueba incompleta'));}});child.stdin.end(JSON.stringify({url,body:opts.body}));
});}
function boot(){
 const dom=new JSDOM(fs.readFileSync('index.html','utf8'),{url:'https://example.test/bestiarum/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,$=s=>w.document.querySelector(s);
 w.matchMedia=()=>({matches:false});w.scrollTo=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};w.fetch=bridge;
 for(const n of ['config','catalog','campaign','storage','accounts','app'])w.eval(fs.readFileSync('assets/js/'+n+'.js','utf8'));
 return {dom,w,$,submit:s=>$(s).dispatchEvent(new w.SubmitEvent('submit',{bubbles:true,cancelable:true}))};
}
async function settled(a){const started=Date.now();while(['loading','saving'].includes(a.w.GuildAccount.getStatus())){if(Date.now()-started>70000)throw Error('La prueba agotó el tiempo de respuesta');await new Promise(r=>setTimeout(r,200));}await new Promise(r=>setTimeout(r,50));}
function ok(t){checks.push(t);console.log('PASS',t);}
(async()=>{
 const a=boot(),username='qa_ui_'+new Date().toISOString().slice(5,16).replace(/[^0-9]/g,'')+'_'+crypto.randomBytes(2).toString('hex'),pin=crypto.randomInt(1e6).toString().padStart(6,'0');
 a.$('#intro [data-account="signup"]').click();a.$('#signupUsername').value=username;a.$('#signupPin').value=pin;a.$('#playerName').value='Prueba de acceso UI 3.5';a.$('[data-avatar="hunter-4"]').click();a.$('#classSelect').value='cartografo';a.$('#originSelect').value='ruinas';a.submit('#registrationForm');assert(a.$('#accountLoading').open);await settled(a);
 assert(a.w.GuildAccount.isActive(),a.$('#registrationFeedback').textContent);assert(a.$('#storyDialog').open);assert.equal(a.$('#hudName').textContent,'Prueba de acceso UI 3.5');assert.equal(a.$('#signupPin').value,'');
 ok('Formulario nuevo crea realmente usuario y personaje elegido en el Apps Script desplegado y abre el prólogo');
 a.$('[data-story="next"]').click();await settled(a);const cache=JSON.parse(a.w.localStorage.getItem('bestiarium.chronicle.v35'));assert.equal(cache.state.campaign.pages.prologo,1);assert.equal(cache.state.avatar,'hunter-4');assert.equal(cache.state.origin,'ruinas');assert(!cache.token&&!cache.pin);
 ok('Avanzar en la historia guarda realmente la página en el servicio y su copia local automática');
 const b=boot();b.$('#intro [data-account="open"]').click();b.$('#accountUsername').value=username;b.$('#accountPin').value=pin;b.submit('#accountForm');await settled(b);assert(b.w.GuildAccount.isActive(),b.$('#accountFeedback').textContent);const recovered=JSON.parse(b.w.localStorage.getItem('bestiarium.chronicle.v35'));assert.equal(recovered.state.campaign.pages.prologo,1);assert.equal(recovered.state.specialty,'cartografo');assert.equal(recovered.state.avatar,'hunter-4');assert.equal(recovered.state.origin,'ruinas');assert(!b.$('#storyDialog').open);
 ok('Otra sesión sin almacenamiento previo recupera personaje y página de lectura desde Google');
 for(const c of [a,b]){if(c.$('#storyDialog').open)c.$('#storyDialog').close();c.$('#accountButton').click();c.$('[data-account="logout"]').click();await settled(c);assert(!c.w.GuildAccount.isActive());assert(!c.$('#intro').hidden);c.dom.window.close();}
 assert(requests.every(r=>r.cors==='*'&&r.status===200));ok('Respuestas POST permiten el origen del juego; las dos sesiones de prueba quedan cerradas');
 fs.writeFileSync('docs/live-onboarding-validation.json',JSON.stringify({date:new Date().toISOString(),method:'Eventos DOM del frontend 3.5 con peticiones reales al Apps Script, dos sesiones sin almacenamiento compartido',qaUsername:username,checks,requests,limits:['HTTP verifica cabeceras CORS; el formulario publicado se revisa visualmente por separado. No sustituye una prueba física en el dispositivo del usuario.']},null,2)+'\n');console.log('COMPLETE',checks.length,'live onboarding checks');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
