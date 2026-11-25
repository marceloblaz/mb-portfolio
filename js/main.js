{
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const isDark = () => true;
const css = n => getComputedStyle(root).getPropertyValue(n).trim();

const gwrap = document.getElementById('gwrap');
/* the map scales to its column and, on desktop, to the screen height, so the whole hero fits and can hold from the first scroll */
/* the map canvas (1200 × 640) scales to the section's width and, on desktop, to the room left under its header */
const fit = () => { let s = Math.min(1.25, gwrap.clientWidth/1200);
  if(innerWidth >= 700){ const ms = document.getElementById('method'), top = gwrap.getBoundingClientRect().top - ms.getBoundingClientRect().top; s = Math.min(s, Math.max(.4, (innerHeight - top - 24)/640)); }
  gwrap.style.setProperty('--s', s); gwrap.style.setProperty('--gx', Math.max(0, (gwrap.clientWidth - 1200*s)/2) + 'px'); };
addEventListener('resize', fit);
const gro = new ResizeObserver(fit); gro.observe(gwrap);

/* ---------- work cards ---------- */
const cases = [
  {k:'case',n:'01',t:"Designing for Complexity: Galley's Enterprise Menu Planner",d:'Designed a flexible, data-driven menu planner that helps chefs save time, reduce errors, and scale their operations.',u:'designing-for-complexity-galleys-enterprise-menu-planner.html',g:'wide'},
  {k:'project',n:'02',t:'Creating and Coding a Figma plugin used by 5.7k designers',d:'A self-initiated project that turned a manual design task into a one-click solution — now helping thousands of Figma users.',u:'creating-and-coding-a-figma-plugin-used-by-5k-designers.html',g:'tall'},
  {k:'case',n:'03',t:'Redefining the RV Experience with a Tablet-First Interface',d:"Designing the central control panel for Lightship's revolutionary all-electric, aerodynamic RV, creating an intuitive interface for the future of travel.",u:'redefining-the-RV-experience-with-at-ablet-first-interface.html',g:'tree'}
];
const card = (c,i) => `<article class="card obj ${c.k==='project'?'p':''}" style="position:relative"><div class="hd"><span>${c.k}</span><span>${c.n}</span></div>
  <div class="in"><div class="vis" data-i="${i}"></div>
  <div class="meta"><h3>${c.t}</h3><p class="desc">${c.d}</p><a class="open" href="${c.u}">open case →</a></div></div></article>`;
document.getElementById('workgrid').innerHTML =
  `<div class="row a">${card(cases[0],0)}${card(cases[1],1)}</div><div class="row c">${card(cases[2],2)}</div>`;

/* case diagrams, from the Figma frames */
const DG = {
  wide:{w:456,h:406,l:['M35,28 V184.1 H208.7','M382.4,28 V184.1 H208.7','M208.7,184.1 H54.3 V378','M208.7,184.1 H363.1 V378'],b:[[0,0,70,28],[347.4,0,70,28],[19.3,378,70,28],[328.1,378,70,28]],c:[173.7,170.1,70,28]},
  tall:{w:159,h:406,l:['M17,28 V184.1 H79.5','M79.5,184.1 H142 V378'],b:[[0,0,34,28],[125,378,34,28]],c:[62.5,170.1,34,28]},
  short:{w:159,h:276,l:['M17,28 V125.6 H79.5','M79.5,125.6 H142 V248'],b:[[0,0,34,28],[125,248,34,28]],c:[62.5,111.6,34,28]},
  tree:{w:456,h:276,l:['M30,28 V113.2 H208.2','M386.4,28 V113.2 H208.2','M208.2,113.2 V248'],b:[[0,0,60,28],[356.4,0,60,28],[178.2,248,60,28]],c:[178.2,99.2,60,28]}
};
const svgOf = k => { const d=DG[k], r=a=>`x="${a[0]}" y="${a[1]}" width="${a[2]}" height="${a[3]}"`;
  return `<svg viewBox="-2 -2 ${d.w+4} ${d.h+4}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${d.l.map(p=>`<path class="l" d="${p}"/>`).join('')}${d.b.map(b=>`<rect class="b" ${r(b)}/>`).join('')}<rect class="c" ${r(d.c)}/></svg>`; };
document.querySelectorAll('#workgrid .vis').forEach(el => { el.innerHTML = svgOf(cases[+el.dataset.i].g); });

/* ---------- Header light: a window beam on a grainy surface, smoke catching rays, a prismatic leak ----------
   Sits behind the header content (screen blend over the page ground); cards are frosted glass above it.
   The beam is fixed to the viewport while content scrolls (parallax); smoke drifts on its own. */
const lit = document.getElementById('lit'), cvs = document.getElementById('light');
/* light parameters (also shader uniforms): [uniform, label, min, max, step, default] */
const TW = [
  ['kRefW','Tuned at width',800,2560,10,1400],['kAngle','Angle',5,70,1,30,'Beam'],['kEntry','Entry point',-.2,.8,.01,-0.12],
  ['kWidth','Width',10,260,1,94],['kSpread','Spread',0,.4,.005,0.03],['kSoft','Softness',0,160,1,24],
  ['kBeam','Beam',0,1,.01,1],['kSpill','Spill',0,.8,.01,0.05],['kGrain','Surface grain',0,1,.01,0],
  ['kSmoke','Smoke',0,1.2,.01,0.3],['kRays','Rays',0,2,.01,0],['kPrism','Prism leak',0,1,.01,0],
  ['kWarm','Warmth',0,1,.01,1],['kSpeed','Motion speed',0,4,.05,3.05],['kParallax','Parallax',0,1,.01,0.82],['kBreathe','Flicker',0,.5,.01,0.37],
  ['kScrim','Text scrim',0,1,.01,0.6],['kAngDrift','Angle drift',0,20,.5,6],['kEntDrift','Entry drift',0,.3,.005,0.06],['kDriftRate','Drift rate',0,3,.05,1.8],
  ['kWeight','Headline weight',300,700,10,450],['kHold','Hold distance',.1,1.5,.01,0.6],['kDefocus','Start blur',0,30,.5,6],['kFringe','Colour fringe',0,2,.05,0.8],['kHeroBlur','Hero blur',0,1,.01,1],['kLag','Map focus lag',0,.7,.01,0.4],['kSwell','Focus breathing',0,2,.05,1],
  ['kGEdge','Edge',0,1,.01,0.38],['kGFill','Fill',0,3,.05,0.85],['kGRefl','Reflection',0,2,.05,0.95],
].map(([k,l,mn,mx,st,df,g])=>({k,l,mn,mx,st,df,g}));
/* tuned values, settled with the tweaks panel in the design study */
const LP = Object.fromEntries(TW.map(x=>[x.k,x.df]));
LP.bSharpWord = true;   /* "clarity" is in focus from the start */
LP.sMat = 'glass';      /* clarity material: none | glass | chrome */
const clarityEl = document.querySelector('#h1 .w[data-d="0"]');
if(LP.sMat !== 'none') clarityEl.classList.add('mat-'+LP.sMat);
{ const st = clarityEl.style;
  st.setProperty('--ge', (.25 + .7*LP.kGEdge).toFixed(3)); st.setProperty('--gw', (.4 + 1.6*LP.kGEdge).toFixed(2)+'px');
  st.setProperty('--gf', LP.kGFill);
  /* the map's glass cards share the same Edge and Fill (1 = the defaults) */
  root.style.setProperty('--pe', (LP.kGEdge/.38).toFixed(3)); root.style.setProperty('--pf', (LP.kGFill/.85).toFixed(3));
  root.style.setProperty('--scrim', LP.kScrim); root.style.setProperty('--hw', LP.kWeight); }
const gl = cvs.getContext('webgl', {premultipliedAlpha:false, antialias:false});
const FS = `precision highp float;
uniform vec2 uRes;uniform float uDpr,uTime,uScroll,uVh,uVw,uFade;
uniform float uS;uniform float kAngle,kEntry,kWidth,kSpread,kSoft,kBeam,kSpill,kGrain,kSmoke,kRays,kPrism,kWarm,kParallax,kBreathe;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float n21(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*f*(f*(f*6.-15.)+10.);
  return mix(mix(h21(i),h21(i+vec2(1,0)),u.x),mix(h21(i+vec2(0,1)),h21(i+1.),u.x),u.y);}
float fbm(vec2 p){float s=0.,a=.5;mat2 m=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){s+=a*n21(p);p=m*p*2.03+17.3;a*=.5;}return s;}
float n11(float x){float i=floor(x),f=fract(x);float a=fract(sin(i*127.1)*43758.5),b=fract(sin((i+1.)*127.1)*43758.5);return mix(a,b,f*f*(3.-2.*f));}
float fb1(float x){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*n11(x);x*=2.07;a*=.5;}return s;}
vec3 spectrum(float x){return clamp(.5+.5*cos(6.2832*(x+vec3(0.,.33,.67))),0.,1.);}
void main(){
  vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y)/uDpr; vec2 S=uRes/uDpr; float t=uTime;
  vec2 v=p-vec2(0.,uScroll*kParallax);                         /* light lags the content: parallax */
  vec2 A=vec2(uVw*kEntry,-uVh*.06);                          /* where the beam enters, above the fold */
  vec2 d=vec2(cos(radians(kAngle)),sin(radians(kAngle))), n=vec2(-d.y,d.x);
  float al=dot(v-A,d), ac=dot(v-A,n);
  float breathe=1.-kBreathe+kBreathe*fb1(t*.05);                       /* a cloud thinning and thickening */
  /* the projected window: a slightly widening stripe, crisp on the frame side, softer on the other */
  float w=kWidth+al*kSpread;                                     /* wider, and it opens up as it travels */
  float sf=kSoft+al*kSoft*.004;                                    /* penumbra grows with distance */
  float edge1=smoothstep(-w-sf,-w+sf*.6,ac);
  float edge2=1.-smoothstep(w-sf*.8,w+sf*1.4,ac);
  float reach=smoothstep(-80.,140.,al)*(1.-smoothstep(uVw*.55,uVw*1.1,al));
  float stripe=edge1*edge2*reach;
  float sliver=0.;  /* thin second slit */
  /* surface grain only shows where light lands, like stone or plaster caught by the sun */
  float tex=fbm(p*.55)*.55+fbm(p*.11+3.)*.45;
  float grainy=1.-kGrain*.5+kGrain*tex;
  float spot=(stripe+sliver)*grainy*mix(1.1,.5,clamp(al/(uVw*.9),0.,1.));
  float spill=exp(-pow(ac/(w*2.6+sf*2.),2.))*reach*.55;   /* light scattered off the surface around the beam */
  /* smoke drifting through the room, lit only inside the cone of light */
  vec2 sp=p*.0032/uS+vec2(t*.018,-t*.009)-vec2(0.,uScroll*.0006);
  vec2 wp=vec2(fbm(sp*1.7+t*.01),fbm(sp*1.7+5.2-t*.012));
  float smoke=fbm(sp*2.2+wp*1.4);
  smoke=smoothstep(.28,.8,smoke);
  float cone=smoothstep(-w*5.,-w*.4,ac)*(1.-smoothstep(w*.6,w*7.,ac))*smoothstep(-60.,0.,al);
  /* rays radiating from the opening, flickering as smoke passes */
  vec2 src=A-d*900.; vec2 r=v-src; float ang=atan(r.y,r.x);
  float rays=fb1(ang*260.+t*.06)*.7+fb1(ang*700.-t*.1)*.5;
  rays=pow(rays,1.6)*kRays;
  float vol=cone*smoke*(.35+rays)*(1.-smoothstep(0.,uVw*.95,al));
  /* prismatic leak: light split along the beam's soft edge, blurred like a lens flare */
  float lx=(ac-(w+sf*.6))/(110.+al*.1);
  float leak=exp(-lx*lx*2.2)*reach*(1.-smoothstep(uVw*.2,uVw*.8,al))*.55;
  vec3 prism=mix(vec3(.5),spectrum(clamp(lx*.22+.9,0.,1.4)),.7)*vec3(1.,.82,1.)*leak;
  float corner=exp(-length((v-A-vec2(-40.,90.)*uS)/(vec2(260.,180.)*uS))*1.6)*.35;               /* a soft blush near the opening */
  vec3 warm=mix(vec3(1.),vec3(1.,.8,.58),kWarm);
  vec3 col=warm*spot*kBeam*breathe + warm*spill*kSpill*breathe + mix(vec3(1.),warm,.6)*vol*kSmoke*breathe + prism*kPrism*breathe
          + spectrum(.08+.1*sin(t*.07))*corner*.25*kPrism/.26;
  col*=1.-smoothstep(S.y*.6,S.y,p.y);
  col*=uFade;
  col=1.-exp(-col*1.25);
  col+=(h21(gl_FragCoord.xy+floor(t*12.)*13.)-.5)*.018*(spot+vol);
  gl_FragColor=vec4(col,1.);
}`;
let U=null;
if(gl){
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(o);return o;};
  try{
    const pr=gl.createProgram();
    gl.attachShader(pr,sh(gl.VERTEX_SHADER,'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
    gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    U={};['uRes','uDpr','uTime','uScroll','uVh','uVw','uFade','uS',...TW.map(x=>x.k)].forEach(k=>U[k]=gl.getUniformLocation(pr,k));
  }catch(e){console.error(e);U=null;}
}
if(!U) cvs.remove();

let tAcc = 0, last = performance.now();
/* ----- load sequence: copy first, then the person, then each object and its relationship ----- */
const order = [];
const add = (el, t) => { if(el){ el.classList.add('seq'); order.push([el, t]); } };
add(document.querySelector('.nav'), 0);
const F = 1;   /* marks steps that wait for the headline to come into focus */
const addF = (el, t) => { if(el){ el.classList.add('seq'); order.push([el, t, F]); } };
addF(document.querySelector('.hero .lede'), 0);
addF(document.querySelector('.hero .cta'), 140);
let introStart = performance.now();
let timers = [];
function playIntro(){
  timers.forEach(clearTimeout); timers = [];
  order.forEach(([el]) => el && el.classList.remove('in'));
  introStart = performance.now();
  if(RM){ order.forEach(([el]) => el && el.classList.add('in')); return; }
  const fo = 0;
  requestAnimationFrame(() => order.forEach(([el,t,f]) => { if(el) timers.push(setTimeout(() => el.classList.add('in'), t + 150 + (f ? fo : 0))); }));
}
playIntro();
/* ----- hold the hero while the first stretch of scroll pulls the headline into focus, then release ----- */
const pin = document.getElementById('pin'), litEl = document.getElementById('lit');
let pinTop = 0, holdPx = 0, holding = false;
function layoutPin(){
  holding = !RM && innerWidth >= 700;
  pin.classList.toggle('holding', holding);
  if(!holding){ pin.style.height = ''; document.getElementById('mpin').style.height = ''; holdPx = 0; pinTop = 0; return; }
  const h = litEl.offsetHeight;
  holdPx = innerHeight * LP.kHold;
  const contentBottom = gwrap.getBoundingClientRect().bottom - litEl.getBoundingClientRect().top + 24;   /* ignore the hero's bottom padding */
  pinTop = 0;   /* hold from the very first scroll: the nav stays put until the focus and the map are done */
  pin.style.setProperty('--pin-top', pinTop + 'px');
  pin.style.height = (h + holdPx) + 'px';   /* the hero holds only while the headline comes into focus */
  const mp = document.getElementById('mpin'); mp.style.height = (innerHeight*(1 + .85*3 + .25)) + 'px';   /* the map section holds for three transitions and a short rest */
}
layoutPin();
addEventListener('resize', layoutPin);
const focusTarget = () => {
  if(RM) return 1;
  if(!holding) return Math.max(0, Math.min(1, scrollY/(innerHeight*.18)));       /* phones: no hold, a short focus */
  return Math.max(0, Math.min(1, (scrollY - Math.max(0,-pinTop)) / (holdPx*.85)));
};
const h1el = document.getElementById('h1');
/* the rest of the hero sits on later focus planes: lighter blur, focusing a little behind the headline */
const planes = [
  {el: document.querySelector('.hero .lede'), lag: .5},
  {el: document.querySelector('.hero .cta'),  lag: .6}
];
h1el.classList.add('defocus');
const words = [...h1el.querySelectorAll('.w')].map(el => ({el, d:+el.dataset.d}));
h1el.classList.toggle('sw', !!LP.bSharpWord);
let shownFocus = RM ? 1 : 0, lastApplied = -1;
function focusHeadline(){
  const target = focusTarget();
  shownFocus += (target - shownFocus) * .14;                       /* glide, so wheel steps don't jump */
  if(Math.abs(target - shownFocus) < .0005) shownFocus = target;
  const raw = shownFocus;
  if(Math.abs(raw - lastApplied) < .001) return; lastApplied = raw;
  h1el.classList.remove('defocus');
  const ss = x => x*x*(3 - 2*x);
  for(const p of planes){
    if(!p.el) continue;
    const lag = LP.kLag * p.lag, pr = Math.max(0, Math.min(1, (raw - lag)/Math.max(.05, 1 - lag)));
    const b = (1 - ss(pr)) * LP.kDefocus * .65 * LP.kHeroBlur;   /* a bit lighter than the headline at the start */
    p.el.style.filter = b < .05 ? '' : `blur(${b.toFixed(2)}px)`;   /* cleared when sharp, so the frosted cards get their backdrop back */
  }
  /* headline: with "Sharp word", focus starts on "clarity" and widens outward, one word-distance at a time */
  const sharp = !!LP.bSharpWord;
  const shadow = d => { const fr = d*4*LP.kFringe; return d < .002 ? '' : `${(-fr).toFixed(2)}px 0 rgba(255,90,70,${(d*.5).toFixed(3)}), ${fr.toFixed(2)}px 0 rgba(90,150,255,${(d*.5).toFixed(3)}), 0 0 ${(d*30).toFixed(1)}px rgba(255,238,215,${(d*.3).toFixed(3)})`; };
  for(const w of words){
    let pr;
    if(!sharp) pr = raw;
    else if(w.d === 0) pr = 1;
    else { const lag = (w.d - 1)*.28; pr = Math.max(0, Math.min(1, (raw - lag)/(1 - lag))); }
    const dd = 1 - ss(pr), b = dd * LP.kDefocus * (sharp ? 1.25 : 1);   /* more blur around the sharp word so it stands out */
    w.el.style.filter = b < .05 ? '' : `blur(${b.toFixed(2)}px)`;
    w.el.style.textShadow = shadow(dd);
  }
  h1el.style.filter = ''; h1el.style.textShadow = '';
  h1el.style.transform = (sharp || raw >= 1) ? '' : `scale(${(1 + (1-ss(raw))*.02*LP.kSwell).toFixed(4)})`;   /* no swell when one word is fixed in focus */
}
/* smooth wandering in [-1,1]: incommensurate sines never visibly repeat */
const wander = (t, s) => (Math.sin(t*.13+s) + Math.sin(t*.071+s*2.3)*.7 + Math.sin(t*.037+s*4.1)*.5) / 2.2;
function frame(now){
  tAcc += Math.min(.1,(now-last)/1000)*LP.kSpeed; last = now;
  const b = lit.getBoundingClientRect();
  if(U && b.bottom > 0){
    const dpr = Math.min(devicePixelRatio||1, 1.5)*.5, w = Math.round(b.width*dpr), h = Math.round(b.height*dpr);   /* soft light: half resolution is invisible */
    if(cvs.width !== w || cvs.height !== h){ cvs.width=w; cvs.height=h; gl.viewport(0,0,w,h); }
    gl.uniform2f(U.uRes,w,h); gl.uniform1f(U.uDpr,dpr); gl.uniform1f(U.uTime, RM ? 40 : tAcc);
    for(const x of TW) if(U[x.k]) gl.uniform1f(U[x.k], LP[x.k]);
    /* responsive beam: pixel sizes were tuned at "Tuned at width"; scale them to this viewport */
    const sc = Math.max(.32, Math.min(1.4, b.width / LP.kRefW));
    gl.uniform1f(U.uS, sc); gl.uniform1f(U.kWidth, LP.kWidth*sc); gl.uniform1f(U.kSoft, LP.kSoft*sc);
    const dt = RM ? 0 : tAcc*LP.kDriftRate;   /* Motion speed is the master clock (tAcc); Drift rate is relative to it */
    let ang = LP.kAngle + LP.kAngDrift*wander(dt, 1.7), ent = LP.kEntry + LP.kEntDrift*wander(dt*1.18, 5.3);
    gl.uniform1f(U.kAngle, ang); gl.uniform1f(U.kEntry, ent);
    if(clarityEl){
      /* the word is lit by the same beam: same direction, same warmth, brighter the closer it sits to the beam's axis */
      const cb = clarityEl.getBoundingClientRect(), par = RM ? 0 : LP.kParallax;
      const vx = cb.left + cb.width/2 - b.left, vy = cb.top + cb.height/2 - b.top - (-b.top)*par;
      const a = ang*Math.PI/180, dx = Math.cos(a), dy = Math.sin(a), ax = b.width*ent, ay = -innerHeight*.06;
      const al = (vx-ax)*dx + (vy-ay)*dy, ac = -(vx-ax)*dy + (vy-ay)*dx;
      const wd = LP.kWidth*sc + al*LP.kSpread + LP.kSoft*sc + al*LP.kSoft*sc*.004;
      const fadeIn = RM ? 1 : 1 - Math.pow(1 - Math.max(0, Math.min(1, (now - introStart - 100)/1700)), 3);
      const litAmt = (al > -40 ? Math.exp(-Math.pow(ac/wd, 2)) : 0) * fadeIn;
      const k = LP.kWarm, gc = [255, Math.round(255 - 51*k), Math.round(255 - 107*k)].join(',');   /* the shader's warm tint */
      const st = clarityEl.style;
      st.setProperty('--gc', gc);
      st.setProperty('--ga', (Math.atan2(dx, -dy)*180/Math.PI + 90).toFixed(1) + 'deg');   /* streaks run along the rays */
      st.setProperty('--sx', (50 - Math.max(-1.5, Math.min(1.5, ac/wd))*34 + 4*Math.sin(tAcc*.4)).toFixed(1) + '%');
      st.setProperty('--gh', ((.3 + .9*litAmt) * LP.kGRefl).toFixed(3));
      st.setProperty('--gl', (.35 + .65*litAmt).toFixed(3));
      st.setProperty('--gg', (.22*litAmt*LP.kGRefl).toFixed(3));
    }
    const fe = RM ? 1 : Math.max(0, Math.min(1, (now - introStart - 100)/1700));
    gl.uniform1f(U.uFade, 1 - Math.pow(1 - fe, 3));
    gl.uniform1f(U.uScroll, -b.top); gl.uniform1f(U.uVh, innerHeight); gl.uniform1f(U.uVw, b.width);
    gl.drawArrays(gl.TRIANGLES,0,3);
  }
  focusHeadline();
  /* glass panes in the map section: lit from the same direction and warmth as the hero beam */
  { const a = LP.kAngle*Math.PI/180, k = LP.kWarm, gc = [255, Math.round(255 - 51*k), Math.round(255 - 107*k)].join(','),
      ga = (Math.atan2(Math.cos(a), -Math.sin(a))*180/Math.PI + 90).toFixed(1) + 'deg', ms = document.getElementById('method').getBoundingClientRect();
    for(const g of omStage.querySelectorAll('.fx-glass')){ const r = g.getBoundingClientRect(); if(!r.width) continue;
      const lit = Math.max(.2, 1 - Math.abs((r.left + r.width/2 - ms.left)/ms.width - .3)*1.4);   /* brightest toward the left, where the light comes from */
      const gs = g.style; gs.setProperty('--gc', gc); gs.setProperty('--ga', ga);
      gs.setProperty('--sx', (40 + 6*Math.sin(tAcc*.25 + r.left*.01)).toFixed(1) + '%');
      gs.setProperty('--gh', ((.35 + .8*lit) * LP.kGRefl).toFixed(3)); gs.setProperty('--gl', (.25 + .7*lit).toFixed(3)); } }
  if(typeof renderMap === 'function') renderMap();
  frame.prev = now;
  requestAnimationFrame(frame);
}
/* ---------- the Event, across layers: Galley Menu Planner, recreated with sample data ----------
   Problem → Object → Views → System. Scrolling travels the planes in depth (see the tour below). */
const omStage = document.getElementById('omStage'), omCrumbs = document.getElementById('omCrumbs');
const W = 1200, H = 640, C = {x: 600, y: 320};
const nice = id => ({PROBLEM:'Problem', OBJECT:'Data model', COMPONENTS:'Components', VIEWS:'Views'})[id] || id;
const layout = () => [];                     /* stages are not graph neighbours: each flight goes straight ahead */
const ARROW = '';
const person = '<svg class="fx-ic" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5" r="3"/><path d="M2 15c0-3.3 2.7-5 6-5s6 1.7 6 5z"/></svg>';
const A = (a, html, cls = '') => `<span class="fx-a ${cls}" data-a="${a}">${html}</span>`;
const allergens = list => list.map(x => `<span class="fx-al">${x}</span>`).join('');

const STAGES = {
  PROBLEM(){
    const frags = [['Mon – Sun',80,40,-4],['Breakfast',360,30,3],['Lunch',720,50,-2],['1,240 heads',1010,80,4],['cost per head',60,190,2],
      ['budget 94%',960,220,-3],['allergens',140,470,-3],['serving station',880,500,2],['Entrée',470,580,-2],['units / head',40,350,3],
      ['volume sold',1030,360,-2],['K-12 Fall cycle',600,140,2],['site tags',270,560,4],['recipes',1060,590,-4],['approvals',30,590,2],['notes',760,560,3],
      ['48 sites',230,110,-3],['Dinner',540,20,2],['Snack',880,20,-3],['12,400 servings',820,130,-2],['par levels',1080,160,3],['yield',300,240,-4],
      ['substitutions',170,290,2],['nutrition',1000,290,3],['USDA pattern',880,420,-2],['inventory',220,400,3],['vendors',1100,460,-3],['purchase orders',940,620,2],
      ['production sheet',40,520,-2],['prep lists',620,620,3],['portion size',330,470,-2],['gluten-free',360,620,-3],['cost variance',1080,30,-2],['leftovers',150,630,4],
      ['3 meals / day',20,110,3],['sodium',830,370,-3],['menu cycle',260,180,-2],['forecast',1120,240,2]];
    return `<div class="fx-frags" aria-hidden="true">${frags.map(([t,x,y,r],i) => `<span style="left:${x}px;top:${y}px;transform:rotate(${r}deg);opacity:${(.35 + (i%4)*.15).toFixed(2)}">${t}</span>`).join('')}</div>
      <article class="obj om-card fx-problem fx-glass" style="left:390px;top:196px;width:420px">
        <div class="hd"><span>the problem</span><span>Galley</span></div>
        <div class="bd"><p>A data problem disguised as a food problem. Hundreds of variables meet in every menu decision, and planners can't see any of them while they plan.</p></div>
      </article>`;
  },
  OBJECT(){
    const chips = l => l.map(([a,t]) => `<span data-a="${a}">${t}</span>`).join('');
    const card = (x, name, kind, attrs) => `<article class="obj om-card fx-obj fx-glass" style="left:${x}px;top:200px;width:280px;height:200px">
      <div class="hd"><span>${kind}</span></div>
      <div class="bd"><h3>${name}</h3><div class="om-chips fx-chips">${chips(attrs)}</div></div></article>`;
    /* both directions, read along the wire: the left object has many of the right, and the right has many of the left */
    const label = (x, back) => `<div class="fx-link fx-h fx-bi" style="left:${x}px;top:300px"><span><b>has 1–M →</b><b>← has ${back}</b></span></div>`;
    /* a lit wire between two cards: it leaves one edge high, lands on the next low, with a flare where it meets each card */
    const wire = (x1, y1, x2, y2, delay = 0) => { const dx = (x2 - x1) * .55,
        d = `M${x1} ${y1} C${x1+dx} ${y1} ${x2-dx} ${y2} ${x2} ${y2}`,
        d2 = `M${x1} ${y1+1} C${x1+dx*.8} ${y1+7} ${x2-dx*1.15} ${y2-7} ${x2} ${y2-1}`,
        flare = (x, y, dir) => `<ellipse cx="${x}" cy="${y}" rx="26" ry="34" fill="url(#fxHalo)"/>
          <path d="M${x} ${y-44} Q${x} ${y-5} ${x+dir*22} ${y-1.2} L${x+dir*22} ${y+1.2} Q${x} ${y+5} ${x} ${y+44} Z" fill="url(#fxFlare${dir>0?'R':'L'})" filter="url(#fxSoft)"/>
          <ellipse cx="${x}" cy="${y}" rx="1.6" ry="40" fill="url(#fxSpike)"/>`;
      return `<g class="w" style="--wd:${delay}s"><path d="${d}" class="w-glow" filter="url(#fxBlur)"/><path d="${d2}" class="w-strand" filter="url(#fxSoft)"/><path d="${d}" class="w-core"/><path d="${d}" class="w-pulse-glow" pathLength="1" filter="url(#fxBlur)"/><path d="${d}" class="w-pulse" pathLength="1"/><g class="w-fl w-fl-a">${flare(x1, y1, 1)}</g><g class="w-fl w-fl-b">${flare(x2, y2, -1)}</g></g>`; };
    const wires = `<svg class="fx-wires" viewBox="0 0 1200 640" aria-hidden="true"><defs>
        <filter id="fxBlur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3.5"/></filter>
        <filter id="fxSoft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation=".9"/></filter>
        <radialGradient id="fxHalo"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <radialGradient id="fxSpike"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <linearGradient id="fxFlareR" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity=".25"/></linearGradient>
        <linearGradient id="fxFlareL" x1="1" x2="0"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity=".25"/></linearGradient>
      </defs>${wire(300, 268, 460, 332)}${wire(740, 268, 900, 332, 1.6)}</svg>`;
    return card(20, 'Breakfast', 'event', [['name','name'],['headcount','headcount'],['cost','total cost'],['pct','cost %'],['time','start · end'],['concept','concept'],['tags','tags'],['notes','notes']])
      + card(460, 'Entrée', 'course', [['group','name'],['station','serving station'],['tags','tags'],['notes','notes']])
      + card(900, 'Buttermilk Pancakes', 'recipe', [['item','recipe'],['servings','quantity · unit'],['perhead','units / head'],['sold','volume sold'],['allergens','allergens'],['cost','cost']])
      + wires + label(380, '1–1') + label(820, '1–M')

  },
  COMPONENTS(){
    const lab = t => `<code class="fc-lab">&lt;${t} /&gt;</code>`;
    const row = `<div class="fc" style="left:10px;top:10px;width:256px">${lab('EventRow')}
        <div class="fc-row"><div class="fc-rowt">${A('name','Breakfast')}<span class="fx-ok">Approved</span></div>
        <div class="fx-m">${A('cost','$ 1,524.75')} ${A('pct','(94%)')}</div></div></div>`;
    const header = `<div class="fc" style="left:290px;top:10px;width:900px">${lab('EventHeader')}
        <div class="fc-box"><div class="fx-title"><span style="flex:1">${A('name','Breakfast')}</span><span class="fx-ok">Approved</span>${A('headcount', person + '1,240', 'fx-box')}</div></div></div>`;
    const card = `<div class="fc" style="left:10px;top:132px;width:256px">${lab('EventCard size="compact"')}
        <div class="fx-col"><div class="fx-colhd">${A('name','Breakfast')} <small>(3)</small><span class="fx-plus">+</span></div>
        ${A('headcount', person + '1,240', 'fx-chip')}
        <div class="fx-cost">${A('cost','$ 1,524.75')} ${A('pct','(94%)','fx-m')}</div>
        <div class="fx-grp"><div class="fx-grphd">${A('group','Entrée')} <small>(3)</small></div>
          ${A('station','Hot station ▾','fx-chip')}
          <div class="fx-item">${A('item','Buttermilk Pancakes')}
            <div class="fx-m">${A('cost','$ 0.62')} (1,240 units)</div>
            <div class="fx-qty">${A('servings','1,240 <span>Servings ▾</span>')}</div>
            <div class="fx-m fx-r">${A('perhead','(1 unit / head)')}</div></div></div></div></div>`;
    const details = `<div class="fc" style="left:290px;top:132px;width:440px">${lab('EventDetails')}
        <div class="fc-box fx-formbd">
          <label>Concept</label><div class="fx-field">${A('concept','Hot breakfast ▾')}</div>
          <label>Event tags</label><div>${A('tags','<span class="fx-tag">site | North</span><span class="fx-tag">meal | AM</span><span class="fx-tag">diet | K-12</span>')}</div>
          <label>Start and end time</label><div class="fx-field">${A('time','7:00 AM ▾ &nbsp; 9:00 AM ▾')}</div>
        </div></div>`;
    const group = `<div class="fc" style="left:750px;top:132px;width:440px">${lab('ItemGroupPanel')}
        <div class="fc-box"><div class="fc-gh">${A('group','Entrée')} <small>(3)</small></div>
          <div class="fc-gb"><div><label>Serving station</label><div class="fx-field" style="width:100%">${A('station','Hot station ▾')}</div></div>
          <div><label>Item</label><div>${A('item','Buttermilk Pancakes')} · ${A('servings','1,240 servings')}</div></div></div></div></div>`;
    return row + header + card + details + group;
  },
  VIEWS(){
    const rows = [['Breakfast','1,524.75','94%',1],['Lunch','3,210.60','97%',0],['Snack','412.30','81%',0]];
    const items = [['Buttermilk Pancakes','1,240','servings','1,180','$ 1.50','$ 0.62'],['Turkey Sausage Links','2,480','each','2,302','$ 0.80','$ 0.31'],['Fresh Fruit Cup','1,240','cups','1,096','$ 1.00','$ 0.44']];
    /* week view: seven days, each a Breakfast card built from <EventCard size="compact" />; courses and recipe counts vary by day */
    const days = [['01/1','mon','1,524.75','94%',1240,[['Entrée',[['Buttermilk Pancakes','0.62','servings'],['Turkey Sausage Links','0.31','each']]],['Sides',[['Fresh Fruit Cup','0.44','cups']]]]],
      ['01/2','tue','1,388.20','86%',1240,[['Entrée',[['Greek Yogurt Parfait','0.81','cups']]]]],
      ['01/3','wed','1,612.40','99%',1240,[['Entrée',[['Scrambled Eggs & Toast','0.74','servings']]],['Sides',[['Orange Juice','0.36','cups'],['Fresh Fruit Cup','0.44','cups']]]]],
      ['01/4','thu','1,525.40','94%',1240,[['Entrée',[['Steel-Cut Oatmeal','0.38','bowls']]],['Sides',[['Banana','0.22','each']]]]],
      ['01/5','fri','1,498.10','92%',1240,[['Entrée',[['Breakfast Burrito','0.96','each'],['Salsa Cup','0.12','cups'],['Turkey Sausage Links','0.31','each']]]]],
      ['01/6','sat','702.80','88%',620,[['Entrée',[['French Toast Sticks','0.55','portions']]],['Sides',[['Fresh Fruit Cup','0.44','cups']]]]],
      ['01/7','sun','689.30','86%',620,[['Entrée',[['Fruit & Granola Cup','0.49','cups']]]]]];
    const rec = ([it, ic, u], q) => `<div class="fx-item"><div class="fw-nm">${it}</div><div class="fx-m">$ ${ic} / head</div>
            <div class="fx-qty"><span>${q.toLocaleString('en-US')} <span>${u} ▾</span></span></div></div>`;
    const week = days.map(([d,w,c,p,q,courses]) => `<div class="fw-day"><div class="fw-hd"><b>${d}</b> <span>${w}</span></div>
      <div class="fx-col fw-card"><div class="fx-colhd fw-ttl">Breakfast <span class="fx-chip">${person}${q.toLocaleString('en-US')}</span></div>
        <div class="fx-cost">$ ${c} <span class="fx-m">(${p})</span></div>
        ${courses.map(([g, rs]) => `<div class="fx-grp"><div class="fx-grphd">${g}</div>${rs.map(r => rec(r, q)).join('')}</div>`).join('')}</div></div>`).join('');
    return `<article class="fv-app" style="left:0;top:0;width:1200px;height:580px">
        <div class="fv-main">
          <div class="fv-top"><h4>Menu plan</h4><span class="fv-cyc">K-12 Fall 2023 ▾</span><span class="fv-btn">Advanced settings</span></div>
          <div class="fv-bar"><div class="fv-seg" role="tablist" aria-label="Menu plan view"><button data-v="week" class="on" role="tab" aria-selected="true">Week view</button><button data-v="day" role="tab" aria-selected="false">Day view</button></div>
            <span class="fv-mid"><b>Week 1</b> · $ 9,640.20</span><span class="fv-hl">Highlight in the plan</span></div>
          <div class="fv-body fv-w7">${week}</div>
          <div class="fv-body fv-dayv" hidden>
            <aside class="fv-list">${rows.map(([n,c,p,ok],i) => `<div class="fv-row ${i ? '' : 'on'}"><div class="fc-rowt"><b>${n}</b>${ok ? '<span class="fx-ok">Approved</span>' : ''}</div><div class="fx-m">$ ${c} (${p})</div></div>`).join('')}</aside>
            <section class="fv-detail">
              <div class="fx-title"><span style="flex:1">Breakfast</span><span class="fx-ok">Approved</span><span class="fx-box">${person}1,240</span></div>
              <div class="fv-sub">Event details</div>
              <div class="fv-two"><div><label>Concept</label><div class="fx-field">Hot breakfast ▾</div></div><div><label>Start and end time</label><div class="fx-field">7:00 AM ▾ &nbsp; 9:00 AM ▾</div></div></div>
              <div class="fv-sub">Item groups</div>
              <div class="fv-group"><div class="fc-gh">Entrée <small>(3)</small></div>
                <div class="fv-gb"><span class="fx-m">Serving station</span> Hot line ▾</div>
                <table class="fv-tbl"><thead><tr><th>Item</th><th>Volume</th><th>Sold</th><th>Price</th><th>Cost</th></tr></thead>
                  <tbody>${items.map(([n,v,u,so,pr,co]) => `<tr><td>${n}</td><td>${v} <span class="fx-m">${u}</span></td><td>${so}</td><td>${pr}</td><td>${co}</td></tr>`).join('')}</tbody></table></div>
              <div class="fv-group fv-closed"><div class="fc-gh"><span>Sides <small>(2)</small></span><span class="fx-m">▸</span></div></div>
            </section>
          </div>
        </div></article>`;
  }
};
function makePlane(id){ const el = document.createElement('div'); el.className = 'om-plane fx-plane fx-' + id.toLowerCase(); el.dataset.id = id; el.innerHTML = STAGES[id](); return el; }
/* same attribute, every view: hovering a value lights its siblings */
omStage.addEventListener('pointerover', ev => { const a = ev.target.closest('[data-a]'); const pl = ev.target.closest('.fx-plane'); if(!pl) return;
  pl.querySelectorAll('.fx-hot').forEach(x => x.classList.remove('fx-hot'));
  if(a) pl.querySelectorAll(`[data-a="${a.dataset.a}"]`).forEach(x => x.classList.add('fx-hot')); });
omStage.addEventListener('pointerleave', () => omStage.querySelectorAll('.fx-hot').forEach(x => x.classList.remove('fx-hot')));
/* hover tilts a glass pane toward the pointer; its sheen slides the other way */
omStage.addEventListener('pointermove', ev => { const g = ev.target.closest('.fx-glass'); if(!g || RM) return;
  const r = g.getBoundingClientRect(), x = (ev.clientX - r.left)/r.width - .5, y = (ev.clientY - r.top)/r.height - .5;
  g.style.setProperty('--rx', (-y*9).toFixed(2) + 'deg'); g.style.setProperty('--ry', (x*11).toFixed(2) + 'deg'); g.style.setProperty('--tx', (-x*24).toFixed(1) + '%'); });
omStage.addEventListener('pointerout', ev => { const g = ev.target.closest('.fx-glass'); if(!g || g.contains(ev.relatedTarget)) return;
  ['--rx','--ry','--tx'].forEach(k => g.style.removeProperty(k)); });
/* the menu plan's week / day switch */
omStage.addEventListener('click', ev => { const v = ev.target.closest('[data-v]'); if(!v) return; const pl = v.closest('.fx-plane'); v.closest('.fv-seg').classList.add('fv-tried');
  pl.querySelectorAll('[data-v]').forEach(b => { b.classList.toggle('on', b === v); b.setAttribute('aria-selected', b === v); });
  pl.querySelector('.fv-w7').hidden = v.dataset.v !== 'week'; pl.querySelector('.fv-dayv').hidden = v.dataset.v !== 'day'; });
/* the settings actually drive the preview */
omStage.addEventListener('change', ev => { const t = ev.target.dataset.t; if(!t) return; const pl = ev.target.closest('.fx-plane');
  pl.querySelectorAll(`[data-p="${t}"]`).forEach(x => x.classList.toggle('fx-off', !ev.target.checked)); });
/* ----- the map continues the page scroll: after the headline is sharp, scrolling travels a fixed route in depth ----- */
const TOUR = ['PROBLEM','OBJECT','COMPONENTS','VIEWS'];

const SEG = .85, DWELL = .32;                 /* screen-heights per stop; share of each spent resting on the plane */
const planesCache = {};
const planeFor = id => planesCache[id] || (planesCache[id] = makePlane(id));
let shownA = null, shownB = null;
omStage.innerHTML = ARROW;
function crumbs(active){
  omCrumbs.innerHTML = TOUR.map((id,i) => `<button data-stop="${i}" class="${i === active ? 'on' : ''}" ${i === active ? 'aria-current="step"' : ''}>${nice(id)}</button>`).join('<span>·</span>');
}
let lastActive = -1;
function show(a, b){
  if(shownA !== a){ if(shownA && shownA !== b) shownA.remove(); omStage.append(a); shownA = a; }
  if(shownB !== b){ if(shownB && shownB !== a) shownB.remove(); if(b){ b.classList.add('om-next'); omStage.append(b); } shownB = b; }
  if(a) a.classList.remove('om-next');
}
function style(el, t, op, bl){ el.style.transform = t; el.style.opacity = op; el.style.filter = bl > .02 ? `blur(${bl.toFixed(2)}px)` : ''; }
const tourStart = () => document.getElementById('mpin').getBoundingClientRect().top + scrollY;
function tourU(){ return Math.max(0, Math.min(TOUR.length - 1, (scrollY - tourStart()) / (innerHeight*SEG))); }
function renderTour(){
  const u = tourU(), k = Math.min(TOUR.length - 1, Math.floor(u)), f = u - k;
  const t = k < TOUR.length - 1 ? Math.max(0, Math.min(1, (f - DWELL)/(1 - DWELL))) : 0;
  const e = RM ? (t < .5 ? 0 : 1) : t*t*(3 - 2*t);
  const a = planeFor(TOUR[k]), b = k < TOUR.length - 1 ? planeFor(TOUR[k+1]) : null;
  show(a, e > 0 ? b : null);
  /* fly toward the next object's card if it sits on this plane; otherwise straight ahead */
  const nb = b && layout(TOUR[k]).find(n => n.id === TOUR[k+1]);
  const dx = nb ? nb.x - C.x : 0, dy = nb ? nb.y - C.y : 0;
  style(a, `translate(${(-dx*e*.85).toFixed(1)}px,${(-dy*e*.85).toFixed(1)}px) translateZ(${(e*640).toFixed(0)}px)`, Math.max(0, 1 - e*1.15).toFixed(3), e*7);
  if(b && e > 0) style(b, `translateZ(${(-900*(1-e)).toFixed(0)}px)`, e.toFixed(3), (1-e)*9);
  a.querySelectorAll('.om-nb').forEach(n => n.classList.toggle('om-target', !!b && n.dataset.id === TOUR[k+1]));
  const active = e > .5 ? k + 1 : k;
  if(active !== lastActive){ lastActive = active; crumbs(active); }
}
const goStop = i => window.scrollTo({top: tourStart() + i*innerHeight*SEG + 2, behavior: RM ? 'auto' : 'smooth'});
/* phones: no hold, so the map is a list you tap through */
let flatCur = 'PROBLEM';
function renderFlat(){ const pl = planeFor(flatCur); show(pl, null); style(pl, '', '', 0); const i = TOUR.indexOf(flatCur); if(i !== lastActive){ lastActive = i; crumbs(i); } }
function renderMap(){ holding ? renderTour() : renderFlat(); }
omCrumbs.addEventListener('click', ev => { const b = ev.target.closest('button[data-stop]'); if(!b) return; const i = +b.dataset.stop;
  if(holding) goStop(i); else { flatCur = TOUR[i]; renderFlat(); } });
omStage.addEventListener('click', ev => { const n = ev.target.closest('.om-nb'); if(!n) return; const i = TOUR.indexOf(n.dataset.id); if(i < 0) return;
  if(holding) goStop(i); else { flatCur = n.dataset.id; lastActive = -1; renderFlat(); } });
renderMap();

requestAnimationFrame(frame);
}
