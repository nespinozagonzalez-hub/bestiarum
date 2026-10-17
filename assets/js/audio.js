'use strict';
window.GuildAudio=(()=>{
 const track=document.createElement('audio');track.id='guildAmbience';track.hidden=true;
 track.src=new URL('../audio/vigilia-del-gremio.mp3',document.currentScript?.src||new URL('assets/js/audio.js',document.baseURI)).href;document.body.append(track);
 track.loop=true;track.preload='none';track.volume=.22;
 let enabled=false,context=null,status='off';
 const notify=()=>window.dispatchEvent(new CustomEvent('guild:audio'));
 async function setEnabled(value){
  enabled=!!value;
  if(!enabled){track.pause();status='off';notify();return true;}
  status='starting';notify();
  try{await track.play();if(!enabled){track.pause();return false;}status='playing';notify();return true;}
  catch{enabled=false;status='blocked';notify();return false;}
 }
 function volume(value){track.volume=Math.max(0,Math.min(.7,Number(value)||0));}
 function effect(type){if(!enabled)return;try{
  context??=new (window.AudioContext||window.webkitAudioContext)();
  if(context.state==='suspended')context.resume().catch(()=>{});
  const notes={error:[165,146],open:[220,330,440],verify:[146,220],page:[293.66],reveal:[220,330,440,554],rank:[220,277,330,440,554,660]}[type]||[220];
  notes.forEach((f,i)=>{const o=context.createOscillator(),g=context.createGain(),t=context.currentTime+i*.13;o.type='sine';o.frequency.value=f;o.connect(g);g.connect(context.destination);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.04,t+.025);g.gain.exponentialRampToValueAtTime(.001,t+.65);o.start(t);o.stop(t+.7);});
 }catch{}}
 track.addEventListener('error',()=>{enabled=false;status='error';notify();});
 return {setEnabled,volume,effect,state:()=>({enabled,playing:enabled&&!track.paused,status,volume:track.volume})};
})();
