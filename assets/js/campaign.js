/* Campaign rules shared verbatim with Apps Script. No DOM, clocks or random rewards. */
'use strict';
var GuildCampaign=globalThis.GuildCampaign=(()=>{
 const zones=['pantano','bosque','crater','forja','ruinas','dominio'];
 const scene=(voice,text,image='guild-refuge')=>({voice,text,image});
 const regional={
  pantano:{title:'Los faros sin nombre',entry:['El barquero lleva una campana sin badajo. Al tocar tierra la oyes sonar, aunque no se mueve.','«Los faros se apagaron de dentro hacia fuera», dice Iria. «Si encuentras mi cinta azul, sabrás que llegué antes que tú».','En el agua hay seis reflejos. Sobre la orilla, solo estás tú.'],close:['Los faros vuelven a encenderse. Bajo el santuario aparece una inscripción: LOS SELLOS NO SON CERRADURAS.','Kael frota la tinta húmeda. «Son recuerdos. Alguien nos pidió olvidar lo que había detrás».','En la última barca encuentras la cinta azul de Iria, anudada a un mapa del bosque.'],relic:'Campana del farero',restored:'Los faros guían de nuevo a las barcas.'},
  bosque:{title:'La raíz que escucha',entry:['Las raíces atraviesan las ventanas de una capilla sin techo. En cada rama cuelga un hilo azul.','«No sigas las voces», advierte Kael. «El bosque recuerda incluso lo que nunca dijiste».','Una puerta aparece en el tronco. Del otro lado alguien está contando tus pasos.'],close:['La madera deja de crujir. Dentro del árbol hueco, un nombre ha sido tachado de todos los juramentos.','«No expulsaron al primer guardián», murmura Kael. «Lo dividieron».','Dejas una lámpara junto a la puerta. Al salir, ya no cuentas un paso de más.'],relic:'Llave de raíz hueca',restored:'La capilla abre un sendero seguro entre las raíces.'},
  crater:{title:'La herida del cielo',entry:['El observatorio apunta hacia la tierra. Sus lentes siguen algo que se mueve debajo del cráter.','Iria dejó una nota: «Cada fragmento contiene una versión distinta de nuestra caída».','Al caer la noche, las sombras cambian de dueño. La tuya permanece a tu lado. Por ahora.'],close:['Las agujas de cristal se alinean. En su interior ves seis guardianes compartiendo una misma sombra.','«La estrella nunca cayó», lees en el diario de Iria. «Fue una señal enviada desde aquí».','Guardas un fragmento oscuro. Por primera vez refleja el cielo que tienes delante.'],relic:'Astilla de la noche primera',restored:'El observatorio recupera su luz y sus cartas estelares.'},
  forja:{title:'El corazón bajo la piedra',entry:['Un martillo golpea bajo la montaña. Nadie responde cuando llamas a la puerta de la forja.','Brann abre un ojo cubierto de ceniza. «Si el fuego está recordando, más nos vale escuchar».','En el puente de escoria hay huellas que terminan en una pared. La piedra está tibia.'],close:['El último sello aquieta la montaña. Brann rescata un molde con la forma de seis manos entrelazadas.','«No forjaron un arma», dice. «Forjaron una promesa. Y luego fingieron que era una prisión».','La primera chispa limpia prende en el hogar. Brann te reserva un lugar junto al yunque.'],relic:'Ascua del primer pacto',restored:'Los hornos alimentan otra vez los hogares del valle.'},
  ruinas:{title:'La corona sin rey',entry:['Las campanas anuncian tu llegada. Ningún campanario sigue en pie.','La posadera sirve dos platos. «El otro es para quien vuelva contigo». No preguntas a quién espera.','En el patio encuentras un juramento firmado por seis nombres. El séptimo ha sido arrancado.'],close:['Las estatuas inclinan la cabeza. En el trono vacío descansa la página perdida del juramento.','Iria escribió al margen: «El rey no ordenó el sacrificio. Se ofreció a compartirlo».','Devuelves la página a Kael. Sus manos tiemblan: reconoce la letra del primer guardián.'],relic:'Fragmento de la corona',restored:'Las campanas vuelven a anunciar viajeros, no despedidas.'},
  dominio:{title:'La última vigilia',entry:['El umbral respira. Los seis espacios del altar esperan las marcas de tus expediciones.','«No te pediré que no tengas miedo», dice Kael. «Te pediré que recuerdes por qué has venido».','Más allá del arco, una silueta sostiene el cielo con el lomo. Al verte, baja la cabeza.'],close:['El altar recupera su forma. Las seis marcas laten al mismo ritmo que tu sello.','Donde antes había una frontera aparece un sendero. Ningún mapa lo había conservado.','Iria espera al otro lado. «Ahora podemos contar la historia completa».'],relic:'Sello de la última vigilia',restored:'El umbral se convierte en un camino vigilado por el Gremio.'}
 };
 const chapters=[{id:'prologo',title:'La noche en que volvió la niebla',kind:'prologue',scenes:[
  scene('EL PRIMER GRIMORIO','Antes de que existiera el Gremio, seis fuegos mantenían encendido el mundo. Cada uno guardaba un nombre. Cada nombre, una promesa.'),
  scene('KAEL · ARCHIVISTA','«La niebla ha regresado. Las cartas llegan vacías y los caminos cambian mientras dormimos. Necesitamos a alguien que regrese para contarlo».'),
  scene('TU JURAMENTO','Ante el hierro ennegrecido posas la mano sobre el sello. No juras vencer a todas las sombras. Juras volver por quienes se queden atrás.'),
  scene('UNA CARTA DE IRIA','«Si has encontrado esto, aún queda tiempo. Sigue los rastros. Escucha a las bestias. Y no creas todo lo que dicen nuestros libros».')]}];
 zones.forEach(z=>{
  const r=regional[z];
  chapters.push({id:'entrada-'+z,title:r.title,zone:z,kind:'entry',scenes:r.entry.map((t,i)=>scene(i===1?'VOCES DEL CAMINO':'CRÓNICAS DEL VELO',t,'territory-'+z))});
  chapters.push({id:'cierre-'+z,title:'Lo que guardaba '+r.title.toLowerCase(),zone:z,kind:'closure',scenes:r.close.map(t=>scene('ARCHIVO RECUPERADO',t,'territory-'+z))});
 });
 chapters.push({id:'epilogo',title:'El guardián que recordaba',kind:'ending',scenes:[
  scene('QUIMERAX','Al cerrarse el sello, la criatura no cae. Su sombra se abre en seis caminos. Dentro de cada uno reconoces un lugar que has protegido.','territory-dominio'),
  scene('KAEL','«El primer guardián aceptó cargar con los recuerdos del mundo. Cuando olvidamos nuestra promesa, se quedó solo con todas nuestras sombras».','territory-dominio'),
  scene('TU CRÓNICA','Dejas tu sello en el altar. Ya no hay un guardián sosteniendo la noche. Hay un Gremio dispuesto a compartir la vigilia.','guild-refuge')]});
 chapters.push({id:'secreto',title:'La séptima llama',kind:'complete',scenes:[
  scene('IRIA · EXPLORADORA','Veintidós nombres ocupan las páginas. Iria vuelve al refugio con un farol sin encender. «Había una llama más. No la guardaba ninguna bestia».'),
  scene('EL GREMIO','Brann reúne las brasas de los seis territorios. Kael abre el primer grimorio: la última página nunca estuvo vacía. Esperaba el nombre de quien lograra reunirlas.'),
  scene('TU LEYENDA','La séptima llama prende en el refugio. No promete un mundo sin niebla. Promete que nadie volverá a cruzarla en soledad. Tu nombre queda escrito bajo el juramento.') ]});
 const recipes=[
  {id:'farol',name:'Farol del rastreador',slot:'mano',icon:'flame',cost:{'Fragmento Viral':1,'Muestra de Lab.':1},desc:'Ilumina una anotación oculta en las investigaciones.'},
  {id:'hoja',name:'Hoja de raíz',slot:'mano',icon:'sword',cost:{'Cadena Proteica':1,'Cristal de Bicapa':1},desc:'La marca de una expedición que regresó del bosque.'},
  {id:'brujula',name:'Brújula de las mil formas',slot:'mano',icon:'compass',cost:{'Fragmento de ADN':1,'Cadena de ARN':1},desc:'Señala el camino a casa incluso bajo un cielo extraño.'},
  {id:'manto',name:'Manto de esporas',slot:'manto',icon:'feather',cost:{'Espora Sellada':1,'Filamento Fúngico':1},desc:'Una silueta del pantano tejida para tu credencial.'},
  {id:'coraza',name:'Coraza de ceniza',slot:'manto',icon:'shield',cost:{'Fragmento de ATP':1,'Placa Térmica':1},desc:'El emblema de Brann, grabado junto a tu retrato.'},
  {id:'amuleto',name:'Amuleto del juramento',slot:'talisman',icon:'sigil',cost:{'Sello Hormonal':1,'Pulso Regulador':1},desc:'Guarda una voz del antiguo patio de los juramentos.'},
  {id:'pluma',name:'Pluma del archivo',slot:'talisman',icon:'feather',cost:{'Pluma Transcripta':1,'Sello de Control':1},desc:'Una insignia para quienes devuelven recuerdos al archivo.'},
  {id:'corona',name:'Diadema de la vigilia',slot:'talisman',icon:'crown',cost:{'Escama de Quimerax':1,'Esencia Combinada':1},desc:'Una reliquia legendaria del último umbral.'}
 ];
 const talents=[{id:'percepcion',name:'Percepción',desc:'Revela una pista adicional en cada investigación.',second:'Interpreta las marcas que dejó Iria.'},{id:'oficio',name:'Oficio',desc:'Brann reduce en una unidad un material de cada receta.',second:'Reduce también un segundo material cuando la receta lo permite.'},{id:'astucia',name:'Astucia',desc:'Abre una resolución alternativa en las investigaciones.',second:'Añade la interpretación del antiguo guardián.'},{id:'vinculo',name:'Vínculo',desc:'Abre las confidencias de Kael, Brann e Iria.',second:'Permite escuchar sus planes tras el regreso.'}];
 const investigations=zones.filter(z=>z!=='dominio').map((z,i)=>({id:'eco-'+z,zone:z,title:['La campana hundida','La carta entre raíces','El cristal sin reflejo','El martillo dormido','La mesa para dos'][i],question:['Una campana yace bajo agua negra. Un hilo azul atraviesa su asa.','Una carta cerrada late entre las raíces de la capilla.','El cristal del observatorio refleja a alguien que todavía no ha llegado.','Un martillo golpea una vez cada vez que el hogar se enfría.','Hay un plato limpio junto a una carta que nadie se atreve a abrir.'][i],clue:'Bajo el símbolo de los seis fuegos hay una séptima marca, hecha a mano.',secret:'Iria añadió esta marca para que quienes llegaran después supieran que ella había encontrado un camino de regreso.',choices:[{id:'guardar',label:'Conservar el vestigio',text:'Lo envuelves con cuidado. Kael lo colocará junto al mapa: hay preguntas que necesitan esperar a otros viajeros.'},{id:'restituir',label:'Devolverlo a su lugar',text:'Restituyes el recuerdo al lugar donde pertenece. Un farol se enciende al fondo del camino. Iria dejó una señal para quien hiciera esta elección.'},{id:'descifrar',label:'Descifrar el pacto',talent:'astucia',text:'Sigues las siete marcas en orden inverso. El pacto no pedía obediencia: pedía que alguien regresara para compartir la carga.'}],keepsake:['Hilo del farero','Carta de la capilla','Dibujo del observatorio','Marca del herrero','Invitación de la posada'][i]}));
 function normalize(v){v=v&&typeof v==='object'?v:{};const bounded=n=>Math.max(0,Math.min(2,Number.isInteger(n)?n:0));return {spentMaterials:Object.fromEntries(Object.entries(v.spentMaterials||{}).filter(([k,n])=>k.length<100&&Number.isFinite(n)&&n>=0)),read:[...new Set((Array.isArray(v.read)?v.read:[]).filter(id=>chapters.some(c=>c.id===id)))],pages:Object.fromEntries(chapters.map(c=>[c.id,Math.max(0,Math.min(c.scenes.length-1,Number.isInteger(v.pages?.[c.id])?v.pages[c.id]:0))])),crafted:[...new Set((Array.isArray(v.crafted)?v.crafted:[]).filter(id=>recipes.some(r=>r.id===id)))],equipped:Object.fromEntries(['mano','manto','talisman'].map(slot=>[slot,recipes.some(r=>r.id===v.equipped?.[slot]&&r.slot===slot)?v.equipped[slot]:''])),talents:Object.fromEntries(talents.map(t=>[t.id,bounded(v.talents?.[t.id])])),investigations:Object.fromEntries(investigations.filter(q=>q.choices.some(c=>c.id===v.investigations?.[q.id])).map(q=>[q.id,v.investigations[q.id]])),theme:['guild',...zones].includes(v.theme)?v.theme:'guild'};}
 const completed=(s,cat)=>zones.filter(z=>{const ms=cat.filter(m=>m.zoneId===z);return ms.length&&ms.every(m=>s.captures.includes(m.id));});
 function available(c,s,cat){if(c.kind==='prologue')return true;if(c.kind==='ending')return s.captures.includes('quimerax');if(c.kind==='complete')return cat.length>0&&cat.every(m=>s.captures.includes(m.id));if(c.kind==='closure')return completed(s,cat).includes(c.zone);return cat.some(m=>m.zoneId===c.zone&&(s.unlocked.includes(m.id)||s.captures.includes(m.id)));}
 const earned=(s,cat)=>Math.min(8,Math.floor(s.captures.length/3)+completed(s,cat).length);
 const spent=c=>Object.values(c.talents).reduce((a,n)=>a+n,0);
 function cost(r,s){const c=normalize(s.campaign),v={...r.cost};let cuts=c.talents.oficio;for(const k of Object.keys(v)){if(cuts>0){v[k]=Math.max(0,v[k]-1);cuts--;}}return v;}
 const openInvestigation=(q,s,cat)=>cat.some(m=>m.zoneId===q.zone&&s.captures.includes(m.id));
 function apply(s,cat,op){const c=normalize(s.campaign);let changed=false;const reject=t=>{throw Error(t);};
  if(op.type==='read'){
   const ch=chapters.find(x=>x.id===op.id);if(!ch||!available(ch,s,cat))reject('Este capítulo sigue bajo el Velo.');
   if(!Number.isInteger(op.page)||op.page<0||op.page>=ch.scenes.length)reject('La página no existe.');
   c.pages[ch.id]=op.page;if(op.finish===true&&op.page===ch.scenes.length-1&&!c.read.includes(ch.id))c.read.push(ch.id);changed=true;
  }else if(op.type==='craft'){
   const r=recipes.find(x=>x.id===op.id);if(!r)reject('La receta no existe.');if(c.crafted.includes(r.id))return false;
   if(!Object.keys(r.cost).some(k=>cat.some(m=>s.captures.includes(m.id)&&Object.prototype.hasOwnProperty.call(m.reward.mats,k))))reject('Primero trae materiales de una expedición.');
   const price=cost(r,s);if(Object.entries(price).some(([k,n])=>(s.inventory[k]||0)<n))reject('Todavía faltan materiales para esta pieza.');
   Object.entries(price).forEach(([k,n])=>{s.inventory[k]=(s.inventory[k]||0)-n;c.spentMaterials[k]=(c.spentMaterials[k]||0)+n;});c.crafted.push(r.id);c.equipped[r.slot]=r.id;changed=true;
  }else if(op.type==='equip'){
   const r=recipes.find(x=>x.id===op.id);if(!r||!c.crafted.includes(r.id))reject('Primero debes forjar esta pieza.');c.equipped[r.slot]=r.id;changed=true;
  }else if(op.type==='talent'){
   if(talents.some(t=>t.id===op.id)&&op.level===c.talents[op.id])return false;
   if(!talents.some(t=>t.id===op.id)||op.level!==c.talents[op.id]+1||c.talents[op.id]>=2||spent(c)>=earned(s,cat))reject('Necesitas un punto de senda disponible.');c.talents[op.id]++;changed=true;
  }else if(op.type==='investigate'){
   const q=investigations.find(x=>x.id===op.id),choice=q?.choices.find(x=>x.id===op.choice);if(!q||!choice||!openInvestigation(q,s,cat))reject('Este rastro todavía no está disponible.');if(choice.talent&&!c.talents[choice.talent])reject('Esta opción requiere Astucia.');
   if(c.investigations[q.id])return false;c.investigations[q.id]=choice.id;changed=true;
  }else if(op.type==='theme'){
   if(op.id!=='guild'&&!completed(s,cat).includes(op.id))reject('Sella este territorio para llevar su fuego al refugio.');c.theme=op.id;changed=true;
  }else reject('El Gremio no reconoce esta acción.');
  if(changed)s.campaign=c;return changed;
 }
 function reconcileInventory(s,cat){const inventory={};cat.filter(m=>s.captures.includes(m.id)).forEach(m=>Object.entries(m.reward.mats).forEach(([k,n])=>inventory[k]=(inventory[k]||0)+n));Object.entries(normalize(s.campaign).spentMaterials).forEach(([k,n])=>inventory[k]=Math.max(0,(inventory[k]||0)-n));return inventory;}
 return {zones,regional,chapters,recipes,talents,investigations,normalize,completed,available,earned,spent,cost,openInvestigation,apply,reconcileInventory};
})();
