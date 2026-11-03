(function(){
"use strict";
const L=window.INVITE_LANG||{};
const f=n=>(+n).toFixed(1);const TAU=Math.PI*2;
document.documentElement.classList.add('js');
try{document.documentElement.lang=L.lang;}catch(e){}
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function(){const t=document.getElementById('toran');const n=Math.max(7,Math.round(innerWidth/50));const pat=['o','y','o','w','r','y','o','w'];
  for(let i=0;i<n;i++){const d=document.createElement('div');d.className='strand';const len=4+Math.round(6*(1-Math.sin(Math.PI*i/(n-1))))+(i%2);
    let h='';for(let k=0;k<len;k++){const c=pat[(k+i)%pat.length];h+=`<i class="${c==='o'?'':c}"></i>`;}d.innerHTML=h;d.style.animationDelay=(-i*.37)+'s';d.style.animationDuration=(3.4+(i%3)*.6)+'s';t.appendChild(d);}})();

/* petals */
const cv=document.getElementById('petals'),ctx=cv.getContext('2d');let W=0,H=0;const P=[];
const ROSE=['#b3141f','#c8102e','#d6343f','#9e0f18'],MARI=['#e6951f','#e08a1e','#f2b337'],SAL=['#7da35e','#94b874'];
function resize(){const dpr=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}resize();
const pick=a=>a[Math.floor(Math.random()*a.length)];
function make(o){o=o||{};const r=Math.random();const t=o.t||(r<.5?'rose':r<.88?'mari':'sal');const z=.5+Math.random()*.8;
  return {t,z,x:o.x!==undefined?o.x:Math.random()*W,y:o.y!==undefined?o.y:-20-Math.random()*H,s:(t==='sal'?12:t==='mari'?6:8)*z,vy:(.3+Math.random()*.45)*z,vx:o.vx||0,boost:o.boost||0,ph:Math.random()*TAU,rot:Math.random()*TAU,vr:(Math.random()-.5)*.04,flip:Math.random()*TAU,col:t==='rose'?pick(ROSE):t==='mari'?pick(MARI):pick(SAL),persist:!!o.persist};}
const BASE=reduce?0:Math.round(Math.min(24,W/42));
let petalsOn=false;
function startPetals(){if(petalsOn)return;petalsOn=true;for(let i=0;i<BASE;i++)P.push(make({persist:true}));}
function burst(x,y,n){if(reduce)return;for(let i=0;i<n;i++)P.push(make({x,y,vx:(Math.random()-.5)*9,boost:-(2+Math.random()*6),t:Math.random()<.6?'rose':'mari'}));}
function drawP(p){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(1,.3+.7*Math.abs(Math.cos(p.flip)));ctx.fillStyle=p.col;const s=p.s;
  if(p.t==='rose'){ctx.beginPath();ctx.moveTo(0,-s);ctx.bezierCurveTo(s*.95,-s*.6,s*.75,s*.85,0,s);ctx.bezierCurveTo(-s*.75,s*.85,-s*.95,-s*.6,0,-s);ctx.fill();ctx.globalAlpha=.25;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-s*.2,-s*.25,s*.18,s*.4,0,0,TAU);ctx.fill();}
  else if(p.t==='mari'){ctx.beginPath();ctx.ellipse(0,0,s,s*.55,0,0,TAU);ctx.fill();}
  else{ctx.beginPath();ctx.moveTo(-s,0);ctx.bezierCurveTo(-s*.5,-s*.6,s*.5,-s*.6,s,0);ctx.bezierCurveTo(s*.5,s*.6,-s*.5,s*.6,-s,0);ctx.fill();}
  ctx.restore();}
function stepP(){ctx.clearRect(0,0,W,H);for(let i=P.length-1;i>=0;i--){const p=P[i];p.ph+=.02;p.flip+=.045;p.rot+=p.vr;p.x+=Math.sin(p.ph)*.7*p.z+p.vx;p.vx*=.96;p.y+=p.vy+p.boost;p.boost*=.94;
  if(p.y>H+30||p.x<-40||p.x>W+40){if(p.persist){Object.assign(p,make({persist:true}));p.y=-20;}else{P.splice(i,1);continue;}}drawP(p);}}

/* parallax, reel, timeline */
const depthEls=[...document.querySelectorAll('[data-depth]')],speedEls=[...document.querySelectorAll('[data-speed]')];
let mx=0,my=0,tmx=0,tmy=0;window.addEventListener('pointermove',e=>{tmx=e.clientX/W-.5;tmy=e.clientY/H-.5;},{passive:true});
const reel=document.getElementById('reel'),pin=document.getElementById('reel-pin'),track=document.getElementById('reel-track'),bar=document.getElementById('reel-bar');let reelDist=0;
function setupReel(){if(!reel)return;reel.classList.remove('pinned');reel.style.height='';track.style.transform='';if(reduce||innerHeight<560)return;reel.classList.add('pinned');reelDist=Math.max(0,track.offsetWidth-pin.clientWidth);if(reelDist<40){reel.classList.remove('pinned');return;}reel.style.height=(pin.offsetHeight+reelDist)+'px';}
const tl=document.getElementById('tl'),tlFill=document.getElementById('tl-fill');
let running=true;
function frame(){mx+=(tmx-mx)*.06;my+=(tmy-my)*.06;const sy=window.scrollY;
  if(!reduce){if(sy<H*1.6)depthEls.forEach(el=>{const d=+el.dataset.depth;el.style.translate=`${f(-mx*d*400)}px ${f(-my*d*400+sy*d*4)}px`;});
    speedEls.forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>H+200)return;el.style.translate=`0 ${f(-(r.top+r.height/2-H/2)*(+el.dataset.speed)*(W<760?.35:1))}px`;});}
  if(reel&&reel.classList.contains('pinned')){const r=reel.getBoundingClientRect();const p=Math.min(1,Math.max(0,-r.top/reelDist));track.style.transform=`translate3d(${f(-p*reelDist)}px,0,0)`;bar.style.transform=`scaleX(${p.toFixed(3)})`;}
  const tr=tl.getBoundingClientRect();tlFill.style.transform=`scaleY(${Math.min(1,Math.max(0,(H*.62-tr.top)/tr.height)).toFixed(3)})`;
  if(P.length)stepP();
  if(!document.hidden)requestAnimationFrame(frame);else running=false;}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!running){running=true;requestAnimationFrame(frame);}});
window.addEventListener('resize',()=>{resize();setupReel();});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(setupReel);
setupReel();requestAnimationFrame(frame);

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
const sdArt=document.getElementById('sd-art');new IntersectionObserver(es=>es.forEach(e=>sdArt.classList.toggle('play',e.isIntersecting&&!reduce)),{threshold:.25}).observe(sdArt);

/* countdown */
const BN='০১২৩৪৫৬৭৮৯';const num=v=>L.lang==='bn'?String(v).replace(/[0-9]/g,d=>BN[+d]):String(v);
const target=Date.parse('2026-12-13T22:00:00+05:30');const cd=['cd-d','cd-h2','cd-m','cd-s'].map(id=>document.getElementById(id)),note=document.getElementById('cd-note');const p2=n=>String(n).padStart(2,'0');
function tick(){const ms=target-Date.now();if(ms<=0){cd.forEach(e=>e.textContent=num('00'));note.textContent=ms>-6*3600e3?L.now:L.after;return;}
  const s=Math.floor(ms/1000);cd[0].textContent=num(Math.floor(s/86400));cd[1].textContent=num(p2(Math.floor(s%86400/3600)));cd[2].textContent=num(p2(Math.floor(s%3600/60)));cd[3].textContent=num(p2(s%60));}
tick();setInterval(tick,1000);

/* copy */
document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',()=>{const src=document.getElementById(btn.dataset.copy),txt=src.textContent.trim(),orig=btn.textContent;const done=m=>{btn.textContent=m;setTimeout(()=>btn.textContent=orig,1800);};
  const sel=()=>{try{const r=document.createRange();r.selectNodeContents(src);const s=getSelection();s.removeAllRanges();s.addRange(r);}catch(e){}done(L.selected);};
  try{navigator.clipboard.writeText(txt).then(()=>done(L.copied),sel);}catch(e){sel();}}));

/* sound */
let actx=null;
function conch(t,vol){const out=actx.createGain();out.gain.setValueAtTime(.0001,t);out.gain.exponentialRampToValueAtTime(vol,t+.35);out.gain.setValueAtTime(vol,t+1.7);out.gain.exponentialRampToValueAtTime(.0001,t+2.5);
  const fl=actx.createBiquadFilter();fl.type='lowpass';fl.frequency.setValueAtTime(480,t);fl.frequency.linearRampToValueAtTime(1400,t+.6);fl.Q.value=4;fl.connect(out);out.connect(actx.destination);
  [1,2,3].forEach((h,i)=>{const o=actx.createOscillator();o.type=i?'sine':'sawtooth';o.frequency.setValueAtTime(220*h,t);o.frequency.linearRampToValueAtTime(233*h,t+.4);const g=actx.createGain();g.gain.value=[.5,.35,.18][i];const l=actx.createOscillator();l.frequency.value=5.2;const lg=actx.createGain();lg.gain.value=2.5*h;l.connect(lg);lg.connect(o.frequency);o.connect(g);g.connect(fl);o.start(t);l.start(t);o.stop(t+2.6);l.stop(t+2.6);});}
function ulu(t,vol){const o=actx.createOscillator();o.type='triangle';o.frequency.setValueAtTime(980,t);o.frequency.linearRampToValueAtTime(1160,t+1.6);const l=actx.createOscillator();l.frequency.value=13;const lg=actx.createGain();lg.gain.value=170;l.connect(lg);lg.connect(o.frequency);
  const g=actx.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.12);g.gain.setValueAtTime(vol,t+1.4);g.gain.exponentialRampToValueAtTime(.0001,t+1.9);o.connect(g);g.connect(actx.destination);o.start(t);l.start(t);o.stop(t+2);l.stop(t+2);}
function sound(soft){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume();const t=actx.currentTime+.05;conch(t,soft?.18:.3);ulu(t+2.5,soft?.08:.14);if(!soft)ulu(t+4.5,.14);}catch(e){}}
const sb=document.getElementById('shankha');
sb.addEventListener('click',()=>{sound(false);sb.classList.remove('blow');void sb.offsetWidth;sb.classList.add('blow');const r=sb.getBoundingClientRect();burst(r.left+26,r.top+10,26);});

/* envelope + doors */
const pEnv=document.getElementById('p-env'),pQuiz=document.getElementById('p-quiz');
const stage=document.getElementById('stage'),env=document.getElementById('env'),hc=document.getElementById('hero-card'),doors=document.getElementById('doors');
function openDoors(delay){setTimeout(()=>{hc.classList.add('opened');burst(W/2,H*.4,46);startPetals();setTimeout(()=>doors.classList.add('gone'),reduce?0:2000);},delay);}
let opened=false;
function openEnvelope(){if(opened)return;opened=true;sound(true);
  if(reduce){stage.hidden=true;document.documentElement.classList.remove('locked');doors.classList.add('gone');hc.classList.add('opened');return;}
  env.classList.add('open');
  setTimeout(()=>stage.classList.add('zoom'),1300);
  setTimeout(()=>{window.scrollTo(0,0);stage.classList.add('out');document.documentElement.classList.remove('locked');},1700);
  setTimeout(()=>{stage.hidden=true;},2700);
  openDoors(2200);}
if(stage.hidden){doors.classList.add('gone');hc.classList.add('opened');startPetals();}
else{env.addEventListener('click',e=>{e.stopPropagation();openEnvelope();});stage.addEventListener('click',e=>{if(pEnv.hidden||e.target.closest('a,.qz-retake'))return;openEnvelope();});}
/* quiz */
(function(){
  const QZ=L.quiz,KEY='sn-quiz-done-'+L.lang;const $=id=>document.getElementById(id);
  const intro=$('qz-intro'),card=$('qz-card'),verdict=$('qz-verdict'),opts=$('qz-opts'),react=$('qz-react'),bar=$('qz-bar');
  const ans=[];let qi=0;
  function showEnv(){pQuiz.hidden=true;pEnv.hidden=false;pEnv.classList.add('panel-in');try{env.focus({preventScroll:true});}catch(e){}}
  function showQ(i){qi=i;const q=QZ.qs[i];$('qz-count').textContent=L.qcount.replace('{n}',num(i+1)).replace('{t}',num(QZ.qs.length));
    bar.style.width=(i/QZ.qs.length*100)+'%';$('qz-q').textContent=q.q;react.classList.remove('show');react.textContent='';opts.classList.remove('locked');opts.innerHTML='';
    q.o.forEach((o,k)=>{const b=document.createElement('button');b.type='button';b.className='qz-opt';b.innerHTML=`<b>${L.letters[k]}</b><span></span>`;b.lastChild.textContent=o[0];b.addEventListener('click',()=>pick(k,b));opts.appendChild(b);});
    card.classList.remove('out');void card.offsetWidth;card.classList.add('in');
    const first=opts.querySelector('button');if(first&&i>0)try{first.focus({preventScroll:true});}catch(e){}}
  function pick(k,b){if(opts.classList.contains('locked'))return;opts.classList.add('locked');b.classList.add('picked');ans[qi]=k;
    react.textContent=QZ.qs[qi].o[k][1];react.classList.add('show');bar.style.width=((qi+1)/QZ.qs.length*100)+'%';
    const r=b.getBoundingClientRect();if(k===0||(qi===6))burst(r.left+r.width/2,r.top,10);
    setTimeout(()=>{card.classList.remove('in');card.classList.add('out');setTimeout(()=>{if(qi+1<QZ.qs.length)showQ(qi+1);else showVerdict();},reduce?0:320);},reduce?700:1250);}
  function showVerdict(){const v=ans[0]===2?'away':(ans[2]===2||ans[3]===2)?'sad':'happy';const d=QZ.v[v];
    card.hidden=true;verdict.hidden=false;verdict.className='qz-verdict panel-in '+v;
    $('qz-emoji').textContent=d[0];$('qz-stamp').textContent=d[1];$('qz-vt').textContent=d[2];$('qz-vp').textContent=d[3];
    if(v==='happy'){burst(W/2,H*.35,50);setTimeout(()=>burst(W*.25,H*.3,25),400);setTimeout(()=>burst(W*.75,H*.3,25),700);}
    try{$('qz-go').focus({preventScroll:true});}catch(e){}}
  $('qz-start').addEventListener('click',e=>{e.stopPropagation();intro.hidden=true;card.hidden=false;showQ(0);});
  $('qz-go').addEventListener('click',e=>{e.stopPropagation();try{localStorage.setItem(KEY,'1');}catch(e){}showEnv();});
  $('qz-retake').addEventListener('click',e=>{e.stopPropagation();ans.length=0;pEnv.hidden=true;pQuiz.hidden=false;verdict.hidden=true;card.hidden=true;intro.hidden=false;pQuiz.classList.remove('panel-in');void pQuiz.offsetWidth;pQuiz.classList.add('panel-in');});
  let done=false;try{done=localStorage.getItem(KEY)==='1';}catch(e){}
  if(done&&!stage.hidden)showEnv();
})();
})();
