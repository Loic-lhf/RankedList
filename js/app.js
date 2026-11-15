const $=id=>document.getElementById(id);
const MODE_KEYS=["rr","smart","bt","rand"];
const MAX_RR=300;
let SZ=1;try{SZ=+localStorage.getItem("sz")||1}catch(e){}
let modeTouched=false;let pending=[];            // images
let S=null;                // session state

function names(){return $("names").value.split("\n").map(s=>s.trim()).filter(Boolean)}
function entries(){const m=new Map();
  pending.forEach(x=>{const k=x.name.toLowerCase();if(!m.has(k))m.set(k,{name:x.name,src:x.src,fit:x.fit})});
  names().forEach(n=>{const k=n.toLowerCase();if(!m.has(k))m.set(k,{name:n,src:null})});
  return [...m.values()]}
function total(){return entries().length}
let imp=null,impMsg=null,impMode="session";
function showImp(){$("impnote").textContent=impMsg?t(impMsg.k,impMsg.p):""}
function pairsOf(n){return n*(n-1)/2}
function est(n){return Math.ceil(n*Math.max(1,+$("target").value||6)/2)}

function refreshSetup(){
  const n=total(),p=pairsOf(n);
  $("thumbs").innerHTML="";
  pending.forEach((x,idx)=>{
    const s=document.createElement("span");
    s.innerHTML=`<img alt=""><i class="nm"></i><button type="button" class="x"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`;
    const im=s.querySelector("img");im.src=x.src;if(x.fit)im.style.objectFit=x.fit;
    s.querySelector(".nm").textContent=x.name;
    const rm=s.querySelector(".x");rm.title=t("remove");rm.setAttribute("aria-label",t("remove"));
    rm.onclick=()=>{pending.splice(idx,1);refreshSetup()};
    $("thumbs").append(s);
  });
  $("count").textContent=n<2?t("count_min"):t("count_n",{n,p});
  const old=(document.querySelector("input[name=mode]:checked")||{}).value;
  const rrOK=n>=2&&p<=MAX_RR;
  const rec=rrOK&&p<=est(n)?"rr":"bt"; // round-robin while it needs no more duels than the adaptive estimate
  const pick=modeTouched&&old&&(old!=="rr"||rrOK)?old:rec;
  $("modes").innerHTML="";
  for(const k of MODE_KEYS){
    const off=k==="rr"&&!rrOK;
    const l=document.createElement("label");l.className="opt"+(off?" off":"");
    const extra=k==="rr"?t("x_rr",{p})+(off?t("x_toomany"):""):k===rec?t("x_rec"):t("x_about",{d:est(n)});
    l.innerHTML=`<input type="radio" name="mode" value="${k}" ${k===pick?"checked":""} ${off?"disabled":""}><b></b><span class="tip" tabindex="0"><i class="fa-solid fa-info" aria-hidden="true"></i></span><small></small>`;
    l.querySelector("b").textContent=t("mode_"+k);
    l.querySelector(".tip").dataset.tip=t("tip_"+k);
    l.querySelector("small").textContent=extra;
    $("modes").append(l);
  }
  $("params").classList.toggle("hide",pick==="rr");$("kwrap").classList.toggle("hide",pick==="bt");
  $("start").disabled=n<2;$("validate").disabled=n<2;
}
$("names").addEventListener("input",refreshSetup);
$("target").addEventListener("input",refreshSetup);
$("modes").addEventListener("change",()=>{modeTouched=true;refreshSetup()});
function addFiles(list){
  for(const f of list){if(f.type&&!f.type.startsWith("image/"))continue;pending.push({name:f.name.replace(/\.[^.]+$/,""),src:URL.createObjectURL(f)})}
  refreshSetup();
}
$("files").addEventListener("change",e=>{addFiles(e.target.files);e.target.value=""});
const dz=$("drop");
dz.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();$("files").click()}});
["dragenter","dragover"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add("over")}));
["dragleave","drop"].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove("over")}));
dz.addEventListener("drop",e=>addFiles(e.dataTransfer.files));

$("imp").addEventListener("change",async e=>{
  const f=e.target.files[0];e.target.value="";if(!f)return;
  try{
    const d=JSON.parse(await f.text());
    if(!Array.isArray(d.ranking)||!Array.isArray(d.history))throw new Error("format");
    if(S){if((S.history.length||Object.keys(S.ov).length)&&!confirm(t("discard")))return;S=null;modeTouched=false;layout()}
    const nm=[...d.ranking.map(r=>r.name),...d.history.flatMap(h=>[h.a,h.b])].map(String);
    const have=new Set(entries().map(x=>x.name.toLowerCase()));
    const add=[...new Set(nm)].filter(n=>!have.has(n.toLowerCase()));
    const cur=$("names").value.trim();
    $("names").value=(cur?cur+"\n":"")+add.join("\n");
    const cv=x=>x==="a"?1:x==="b"?0:x==="tie"?.5:null;
    imp={history:d.history.map(h=>({a:String(h.a).toLowerCase(),b:String(h.b).toLowerCase(),r:cv(h.result),r2:cv(h.result2)})),ov:d.overrides&&typeof d.overrides==="object"?d.overrides:null};
    if(d.axis&&typeof d.axis.left==="string"){$("axl").value=d.axis.left;AX.l=true}
    if(d.axis&&typeof d.axis.right==="string"){$("axr").value=d.axis.right;AX.r=true}
    if(d.axes===1||d.axes===2)$("axes2").checked=d.axes===2;
    if(d.axis2&&typeof d.axis2.left==="string"){$("ayl").value=d.axis2.left;AX.l2=true}
    if(d.axis2&&typeof d.axis2.right==="string"){$("ayr").value=d.axis2.right;AX.r2=true}
    const tpl=impMode==="tpl";if(tpl)imp=null;
    const m=d.method||{};
    if(m.duels_per_item_target)$("target").value=m.duels_per_item_target;
    if([16,32,64].includes(m.k_factor))$("kf").value=m.k_factor;
    refreshSetup();
    const r=document.querySelector(`input[name=mode][value="${m.mode}"]`);
    if(r&&!r.disabled){r.checked=true;modeTouched=true;refreshSetup()}
    if(tpl){impMsg={k:"tpl_ok",p:{n:d.ranking.length}};$("impclr").classList.add("hide")}
    else{impMsg={k:"imp_ok",p:{n:d.history.length}};$("impclr").classList.remove("hide")}
    showImp();closeImport();renderAxis();window.scrollTo(0,0);
  }catch(err){$("imperr").textContent=t("imp_err")}
});
const AX={l:false,r:false,l2:false,r2:false};
function setAxDefaults(){
  if(!AX.l)$("axl").value=t("ax_bad");if(!AX.r)$("axr").value=t("ax_good");
  if(!AX.l2)$("ayl").value=t("ay_lo");if(!AX.r2)$("ayr").value=t("ay_hi");
}
[["axl","l"],["axr","r"],["ayl","l2"],["ayr","r2"]].forEach(([id,f])=>$(id).addEventListener("input",()=>{AX[f]=true;if(S){renderJSON();updateRT()}}));
function renderTemplates(){
  const car=$("tcar");car.innerHTML="";
  TEMPLATES.forEach(tp=>{
    const b=document.createElement("button");b.className="choice tcard"+(tp.fit?" fit":"");
    const mos=document.createElement("div");mos.className="mos";
    tp.cover.forEach(f=>{const im=document.createElement("img");im.src=tp.dir+"/"+f;im.alt="";im.loading="lazy";mos.append(im)});
    const ax=tp.axes[lang]||tp.axes.en,mk=(cls,txt)=>{const e=document.createElement("span");e.className=cls;e.textContent=txt;return e};
    const ti=document.createElement("b");ti.textContent=t("t_"+tp.id);
    const me=mk("m",t("tpl_items",{n:tp.items.length})+" · "+ax[0]+" ");
    const ar=ic=>{const e=document.createElement("i");e.className="fa-solid fa-"+ic;e.setAttribute("aria-hidden","true");return e};
    me.append(ar("arrows-left-right")," "+ax[1]);
    if(ax.length>=4)me.append(" · "+ax[2]+" ",ar("arrows-up-down")," "+ax[3]);
    b.append(mos,ti,mk("d",t("t_"+tp.id+"_d")),me);
    b.onclick=()=>useTemplate(tp);car.append(b);
  });
  $("tnav").classList.toggle("hide",car.scrollWidth<=car.clientWidth+2);
}
function useTemplate(tp){
  if(total()>0&&!confirm(t("tpl_replace")))return;
  pending=tp.items.map(([f,n])=>({name:n,src:tp.dir+"/"+f,fit:tp.fit}));
  $("names").value="";
  const ax=tp.axes[lang]||tp.axes.en,two=ax.length>=4;
  $("axes2").checked=two;
  $("axl").value=ax[0];$("axr").value=ax[1];AX.l=AX.r=true;
  if(two){$("ayl").value=ax[2];$("ayr").value=ax[3];AX.l2=AX.r2=true}
  else{AX.l2=AX.r2=false;setAxDefaults()}
  imp=null;impMsg={k:"tpl_ok",p:{n:tp.items.length}};showImp();$("impclr").classList.add("hide");
  refreshSetup();renderAxis();
  openModal();
}
$("clearall").onclick=()=>{
  if(total()>0&&!confirm(t("clear_confirm")))return;
  pending.forEach(x=>{if(x.src&&x.src.startsWith("blob:"))URL.revokeObjectURL(x.src)});
  pending=[];$("names").value="";
  imp=null;impMsg=null;showImp();$("impclr").classList.add("hide");
  AX.l=AX.r=AX.l2=AX.r2=false;setAxDefaults();$("axes2").checked=true;
  $("target").value=6;$("kf").value=32;modeTouched=false;
  refreshSetup();renderAxis();
};
$("tprev").onclick=()=>$("tcar").scrollBy({left:-280,behavior:"smooth"});
$("tnext").onclick=()=>$("tcar").scrollBy({left:280,behavior:"smooth"});
$("impclr").onclick=()=>{imp=null;impMsg=null;showImp();$("impclr").classList.add("hide")};

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}

function begin(mode){
  const items=entries().map((x,i)=>({id:i,...x}));
  S={items,mode,K:+$("kf").value,target:Math.max(1,+$("target").value||6),axes:$("axes2").checked?2:1,ov:{},sel:[],history:[],queue:null,cur:null,done:false};
  if(imp){const ix=new Map(items.map(i=>[i.name.toLowerCase(),i.id]));
    if(imp.ov)Object.entries(imp.ov).forEach(([nm,v])=>{const id=ix.get(nm.toLowerCase());if(id!==undefined&&Array.isArray(v))S.ov[id]=[v[0]??null,v[1]??null]});
    S.history=imp.history.filter(h=>ix.has(h.a)&&ix.has(h.b)&&h.a!==h.b).map(h=>({a:ix.get(h.a),b:ix.get(h.b),r:h.r,r2:h.r2}));
    imp=null;impMsg=null;showImp();$("impclr").classList.add("hide")}
  if(mode==="manual")S.history=[];
  if(mode==="rr"){
    const q=[];for(let a=0;a<items.length;a++)for(let b=a+1;b<items.length;b++)q.push(Math.random()<.5?[a,b]:[b,a]);
    S.queue=shuffle(q);
  }
  closeModal();layout();recompute();next();render();
}
$("start").onclick=()=>begin(document.querySelector("input[name=mode]:checked").value);
$("sz").value=SZ;
$("sz").oninput=e=>{SZ=+e.target.value;try{localStorage.setItem("sz",SZ)}catch(_){}renderAxis()};
$("exportimg").onclick=exportImage;

// Draws the graph on a canvas from what is on screen (same theme, positions and size), then downloads a PNG.
function exportImage(){
  const R0=$("stage").getBoundingClientRect(),B0=$("axis").getBoundingClientRect(),K=2,PAD=16,TOP=44,BOT=30;
  const col=v=>{const e=document.createElement("i");e.style.color=`var(${v})`;document.body.append(e);const c=getComputedStyle(e).color;e.remove();return c};
  const C={pg:col("--pg"),bg:col("--bg"),sf:col("--sf"),tx:col("--tx"),mu:col("--mu"),bd:col("--bd"),ar:col("--ar")};
  const W=Math.ceil(R0.width+2*PAD),H=Math.ceil(R0.height+TOP+BOT+PAD),ff=getComputedStyle(document.body).fontFamily;
  const cv=document.createElement("canvas");cv.width=W*K;cv.height=H*K;
  const g=cv.getContext("2d");g.scale(K,K);
  const rel=r=>({x:r.left-R0.left+PAD,y:r.top-R0.top+TOP,w:r.width,h:r.height});
  const rr=(x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
  const line=(x1,y1,x2,y2)=>{g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()};
  const head=(x,y,dx,dy)=>{const px=-dy,py=dx;g.beginPath();g.moveTo(x-dx*8+px*6,y-dy*8+py*6);g.lineTo(x,y);g.lineTo(x-dx*8-px*6,y-dy*8-py*6);g.stroke()};
  g.fillStyle=C.pg;g.fillRect(0,0,W,H);
  g.textBaseline="middle";g.fillStyle=C.tx;g.font=`800 18px ${ff}`;g.textAlign="left";g.fillText(document.title,PAD,24);
  g.fillStyle=C.mu;g.font=`400 12px ${ff}`;g.textAlign="right";g.fillText(new Date().toLocaleDateString(lang),W-PAD,24);
  const b=rel(B0),two=$("axis").classList.contains("plot"),mx=b.x+b.w/2,my=b.y+b.h/2;
  if(two){rr(b.x,b.y,b.w,b.h,8);g.fillStyle=C.bg;g.fill();g.strokeStyle=C.bd;g.lineWidth=1;g.stroke()}
  g.strokeStyle=C.ar;g.lineWidth=2;g.lineCap="round";g.lineJoin="round";
  line(b.x+6,my,b.x+b.w-6,my);head(b.x+6,my,-1,0);head(b.x+b.w-6,my,1,0);
  if(two){line(mx,b.y+6,mx,b.y+b.h-6);head(mx,b.y+6,0,-1);head(mx,b.y+b.h-6,0,1)}else line(mx,my-7,mx,my+7);
  $("axis").querySelectorAll(".dot,.chip").forEach(el=>{
    const r=rel(el.getBoundingClientRect()),im=el.querySelector("img"),sp=el.querySelector("span");
    if(el.classList.contains("chip")){g.strokeStyle=C.ar;g.lineWidth=1;const cx=r.x+r.w/2;
      if(el.classList.contains("up"))line(cx,r.y+r.h-8,cx,r.y+r.h);else line(cx,r.y,cx,r.y+8)}
    if(im&&im.naturalWidth){
      const q=rel(im.getBoundingClientRect()),nw=im.naturalWidth,nh=im.naturalHeight,contain=im.style.objectFit==="contain";
      g.save();rr(q.x,q.y,q.w,q.h,5);g.clip();g.fillStyle=C.sf;g.fillRect(q.x,q.y,q.w,q.h);
      if(contain){const s=Math.min(q.w/nw,q.h/nh),dw=nw*s,dh=nh*s;g.drawImage(im,q.x+(q.w-dw)/2,q.y+(q.h-dh)/2,dw,dh)}
      else{const s=Math.max(q.w/nw,q.h/nh),sw=q.w/s,sh=q.h/s;g.drawImage(im,(nw-sw)/2,(nh-sh)/2,sw,sh,q.x,q.y,q.w,q.h)}
      g.restore();rr(q.x,q.y,q.w,q.h,5);g.strokeStyle=C.bd;g.lineWidth=1;g.stroke();
    }else if(sp){
      const q=rel(sp.getBoundingClientRect()),cs=getComputedStyle(sp);
      rr(q.x,q.y,q.w,q.h,5);g.fillStyle=C.sf;g.fill();g.strokeStyle=C.bd;g.lineWidth=1;g.stroke();
      g.fillStyle=C.tx;g.font=`${cs.fontWeight} ${cs.fontSize} ${ff}`;g.textAlign="center";
      let s=sp.textContent;while(s.length>1&&g.measureText(s).width>q.w-10)s=s.slice(0,-2)+"…";
      g.fillText(s,q.x+q.w/2,q.y+q.h/2);
    }
  });
  $("stage").querySelectorAll(".axe").forEach(el=>{
    if(el.classList.contains("hide"))return;
    const q=rel(el.getBoundingClientRect()),right=el.classList.contains("rx");
    g.fillStyle=C.mu;g.font=`600 13px ${ff}`;g.textBaseline="middle";g.textAlign=right?"right":"left";
    g.fillText(el.value,right?q.x+q.w-6:q.x+6,q.y+q.h/2);
  });
  g.fillStyle=C.mu;g.font=`400 12px ${ff}`;g.textAlign="center";g.fillText($("axm").textContent,W/2,TOP+R0.height+16);
  const fail=()=>alert(t("exp_err"));
  try{cv.toBlob(bl=>{if(!bl)return fail();const a=document.createElement("a");a.href=URL.createObjectURL(bl);a.download="ranking.png";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)},"image/png")}catch(e){fail()}
}
function layout(){
  const home=!S,man=!!S&&S.mode==="manual";
  $("setup").classList.toggle("hide",!home);$("tplsec").classList.toggle("hide",!home);$("play").classList.toggle("hide",home||man);
  $("res").classList.toggle("hide",home);$("exportimg").classList.toggle("hide",home);$("reset").classList.toggle("hide",home);
  $("tray").classList.toggle("hide",!man);
  if(home)$("resetpos").classList.add("hide");
}
function openModal(){if(total()<2)return;$("mstep1").classList.remove("hide");$("mstep2").classList.add("hide");$("modal").classList.remove("hide")}
function closeModal(){$("modal").classList.add("hide")}
$("validate").onclick=openModal;$("mcancel").onclick=closeModal;
$("chManual").onclick=()=>begin("manual");
$("chAssist").onclick=()=>{$("mstep1").classList.add("hide");$("mstep2").classList.remove("hide");refreshSetup()};
$("mback").onclick=()=>{$("mstep2").classList.add("hide");$("mstep1").classList.remove("hide")};
$("modal").addEventListener("pointerdown",e=>{if(e.target===$("modal"))closeModal()});
function closeImport(){$("imodal").classList.add("hide")}
$("impbtn").onclick=()=>{$("imperr").textContent="";$("imodal").classList.remove("hide")};
$("impSession").onclick=()=>{impMode="session";$("imp").click()};
$("impTpl").onclick=()=>{impMode="tpl";$("imp").click()};
$("icancel").onclick=closeImport;
$("imodal").addEventListener("pointerdown",e=>{if(e.target===$("imodal"))closeImport()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();closeImport();closeLangMenu()}});

function recompute(){
  S.items.forEach(i=>{i.g=0;i.st=[0,1].map(()=>({r:1000,w:0,t:0,l:0,n:0}))});
  const elo=S.mode==="smart"||S.mode==="rand";
  S.history.forEach(h=>{
    S.items[h.a].g++;S.items[h.b].g++;
    for(let k=0;k<S.axes;k++){
      const s=k?h.r2:h.r;if(s==null)continue;
      const A=S.items[h.a].st[k],B=S.items[h.b].st[k];A.n++;B.n++;
      if(s===1){A.w++;B.l++}else if(s===0){B.w++;A.l++}else{A.t++;B.t++}
      if(elo){const e=1/(1+Math.pow(10,(B.r-A.r)/400));A.r+=S.K*(s-e);B.r-=S.K*(s-e)}
    }
  });
  if(S.mode==="bt")for(let k=0;k<S.axes;k++)fitBT(k);
}
function fitBT(k){
  const n=S.items.length,N=Array.from({length:n},()=>new Array(n).fill(0)),W=new Array(n).fill(.5);
  S.history.forEach(h=>{const s=k?h.r2:h.r;if(s==null)return;N[h.a][h.b]++;N[h.b][h.a]++;W[h.a]+=s;W[h.b]+=1-s});
  const p=new Array(n).fill(1);
  for(let it=0;it<500;it++){
    let d=0;
    for(let i=0;i<n;i++){
      let den=1/(p[i]+1);
      for(let j=0;j<n;j++)if(N[i][j])den+=N[i][j]/(p[i]+p[j]);
      const v=W[i]/den;d=Math.max(d,Math.abs(Math.log(v/p[i])));p[i]=v;
    }
    if(d<1e-7)break;
  }
  S.items.forEach((x,i)=>x.st[k].r=1000+400*Math.log10(p[i]));
}
function raw(i,k=0){const s=i.st[k];return S.mode==="rr"?(s.n?(s.w+s.t/2)/s.n:.5):s.r}
function val(i,k=0){const o=S.ov[i.id];return o&&o[k]!=null?o[k]:raw(i,k)}
function fmt(i,k=0){const v=val(i,k);return S.mode==="rr"||S.mode==="manual"?Math.round(v*100)+"%":Math.round(v)}
function pc(a,b){return S.history.filter(h=>(h.a===a&&h.b===b)||(h.a===b&&h.b===a)).length}

function next(){
  S.done=false;S.sel=[undefined,undefined];
  if(S.mode==="manual"){S.cur=null;return}
  if(S.mode==="rr"){
    const p=S.queue.find(q=>pc(q[0],q[1])===0);
    if(!p){S.done=true;S.cur=null;return}
    S.cur=p;return;
  }
  const pool=S.items.filter(i=>i.g<S.target);
  if(!pool.length){S.done=true;S.cur=null;return}
  const m=Math.min(...pool.map(i=>i.g));
  const a=shuffle(pool.filter(i=>i.g===m))[0];
  const others=S.items.filter(i=>i!==a);
  let b;
  if(S.mode==="rand"){
    const mp=Math.min(...others.map(o=>pc(a.id,o.id)));
    b=shuffle(others.filter(o=>pc(a.id,o.id)===mp))[0];
  }else{
    const cost=o=>[0,1].slice(0,S.axes).reduce((s,k)=>s+Math.abs(o.st[k].r-a.st[k].r),0)+150*pc(a.id,o.id)+8*o.g+Math.random()*25;
    b=others.map(o=>[cost(o),o]).sort((x,y)=>x[0]-y[0])[0][1];
  }
  S.cur=Math.random()<.5?[a.id,b.id]:[b.id,a.id];
}

const VAL=[1,.5,0];
function commit(rs){
  S.history.push({a:S.cur[0],b:S.cur[1],r:rs[0],...(S.axes===2?{r2:rs[1]}:{})});
  recompute();next();render();
}
function pick(k,r){
  if(!S||!S.cur)return;
  if(S.axes===1){if(r!==null)commit([r]);return}
  S.sel[k]=r;
  if(S.sel[0]!==undefined&&S.sel[1]!==undefined)commit(S.sel);else markSel();
}
function answer(r){pick(0,r)}
function markSel(){[0,1].forEach(k=>{const sf=k?"2":"";
  ["bl","bt","br"].forEach((p,j)=>$(p+sf).classList.toggle("sel",S.sel[k]===VAL[j]));
  $("bs"+(k+1)).classList.toggle("sel",S.sel[k]===null)})}
function updateRT(){$("rt1").textContent=t("which",{x:$("axr").value});$("rt2").textContent=t("which",{x:$("ayr").value})}
[0,1].forEach(k=>{["bl","bt","br"].forEach((p,j)=>$(p+(k?"2":"")).onclick=()=>pick(k,VAL[j]));$("bs"+(k+1)).onclick=()=>pick(k,null)});
$("resetpos").onclick=()=>{if(S){S.ov={};render()}};
$("undo").onclick=()=>{if(!S||!S.history.length)return;S.history.pop();recompute();
  next();render()};
$("reset").onclick=()=>{if(S&&(S.history.length||Object.keys(S.ov).length)&&!confirm(t("discard")))return;
  S=null;modeTouched=false;layout();refreshSetup();renderAxis()};
document.addEventListener("keydown",e=>{
  if(!S||$("play").classList.contains("hide")||/TEXTAREA|INPUT|SELECT/.test(document.activeElement.tagName))return;
  const k=e.key;
  if(k==="ArrowLeft")pick(0,1);else if(k==="ArrowRight")pick(0,0);else if(k==="ArrowDown"){e.preventDefault();pick(0,.5)}
  else if(S.axes===2&&k.length===1){const j="asd".indexOf(k.toLowerCase());if(j>=0)pick(1,VAL[j])}
});

function cardHTML(i){
  const c=document.createElement("div");c.className="card";c.tabIndex=0;
  if(i.src){const im=document.createElement("img");im.src=i.src;im.alt=i.name;if(i.fit)im.style.objectFit=i.fit;c.append(im)}
  const t=document.createElement(i.src?"small":"span");t.textContent=i.name;c.append(t);
  return c;
}

function render(){
  if(S.mode==="manual"){
    layout();$("resetpos").classList.toggle("hide",!Object.keys(S.ov).length);
    renderTray();renderAxis();renderJSON();return;
  }
  const a=$("arena");a.innerHTML="";
  const n=S.items.length;
  const goal=S.mode==="rr"?S.queue.length:Math.ceil(n*S.target/2);
  const rr=S.mode==="rr",dn=rr?S.queue.filter(q=>pc(q[0],q[1])>0).length:S.history.length;
  const cur=Math.min(dn+1,goal+(S.done?1:0));
  $("pl").textContent=rr?t("duel_of",{n:cur,total:goal}):t("duel_n",{n:cur});
  $("pr").textContent=rr?t("done_rr",{n:dn,total:goal}):t("done_elo",{n:S.history.length,t:S.target});
  $("bar").style.width=(rr?dn/goal*100:S.items.reduce((t,i)=>t+Math.min(i.g,S.target),0)/(n*S.target)*100)+"%";
  if(S.done){
    $("btns").classList.add("hide");
    const d=document.createElement("div");d.className="card";d.style.cursor="default";
    d.innerHTML="<span></span>";d.firstChild.textContent=t("all_done");
    if(S.mode!=="rr"){const b=document.createElement("button");b.textContent=t("more");b.style.marginTop="10px";
      b.onclick=()=>{S.target+=2;next();render()};d.append(b)}
    a.append(d);
  }else{
    $("btns").classList.remove("hide");
    const [x,y]=S.cur.map(k=>S.items[k]);
    [["bl",x],["bl2",x],["br",y],["br2",y]].forEach(([id,it])=>{const b=$(id);b.querySelector("span").textContent=it.name;b.title=it.name});
    const L=cardHTML(x),R=cardHTML(y);
    if(S.axes===1){L.onclick=()=>answer(1);R.onclick=()=>answer(0);
      L.onkeydown=e=>{if(e.key==="Enter")answer(1)};R.onkeydown=e=>{if(e.key==="Enter")answer(0)}}
    else{L.classList.add("nc");R.classList.add("nc")}
    const v=document.createElement("div");v.className="vs";v.textContent="vs";
    const w=document.createElement("div");w.className="duel";w.append(L,v,R);a.append(w);
  }
  $("undo").disabled=!S.history.length;
  const two=S.axes===2;
  ["row2","rt1","bs1"].forEach(id=>$(id).classList.toggle("hide",!two));
  document.querySelectorAll(".btns").forEach(b=>b.classList.toggle("s4",two));
  const kh=$("keyshint");kh.dataset.i18n=two?"keys2":"keys";kh.innerHTML=rich(t(kh.dataset.i18n));
  $("resetpos").classList.toggle("hide",!Object.keys(S.ov).length);
  updateRT();markSel();renderAxis();renderJSON();
}

const P0=12,PS=76; // items occupy 12%..88% of the plot, leaving room for the axis names
function dom(k){
  if(S.mode==="manual")return[0,1];
  const v=S.items.map(i=>val(i,k));let mn=Math.min(...v),mx=Math.max(...v);
  if(mx===mn){const d=S.mode==="rr"?.5:100;mn-=d;mx+=d}
  return[mn,mx];
}
// Drag an item to a new position: the dropped coordinates become a manual score for that item.
function drag(c,i,box,D,two){
  c.ondblclick=()=>{if(S.ov[i.id]){delete S.ov[i.id];render()}};
  c.onpointerdown=e=>{
    if(e.button>0)return;e.preventDefault();c.setPointerCapture(e.pointerId);
    c.style.cursor="grabbing";c.style.zIndex=5;
    const r=box.getBoundingClientRect(),pos=ev=>[Math.min(100,Math.max(0,(ev.clientX-r.left)/r.width*100)),Math.min(100,Math.max(0,(ev.clientY-r.top)/r.height*100))];
    c.onpointermove=ev=>{const [px,py]=pos(ev);c.style.left=px+"%";if(two)c.style.top=py+"%"};
    c.onpointerup=ev=>{
      c.onpointermove=c.onpointerup=null;
      const [px,py]=pos(ev),lim=v=>S.mode==="rr"||S.mode==="manual"?Math.min(1,Math.max(0,v)):v;
      const o=S.ov[i.id]||[null,null];
      o[0]=lim(D[0][0]+(px-P0)/PS*(D[0][1]-D[0][0]));
      if(two)o[1]=lim(D[1][0]+((100-P0)-py)/PS*(D[1][1]-D[1][0]));
      S.ov[i.id]=o;render();
    };
  };
}
function fill(c,i){
  if(i.src){const im=document.createElement("img");im.src=i.src;im.alt=i.name;im.draggable=false;if(i.fit)im.style.objectFit=i.fit;c.append(im)}
  else{const s=document.createElement("span");s.textContent=i.name;c.append(s)}
}
const isPlaced=i=>S.mode!=="manual"||(S.ov[i.id]&&S.ov[i.id][0]!=null);
function renderTray(){
  const box=$("trayitems");box.innerHTML="";
  const un=S.items.filter(i=>!isPlaced(i));
  $("trayh").textContent=t(un.length?"tray_h":"tray_done");
  un.forEach(i=>{const c=document.createElement("div");c.className="tchip";c.title=i.name;fill(c,i);trayDrag(c,i);box.append(c)});
}
// Drag an unplaced item from the tray onto the plot.
function trayDrag(el,i){
  el.onpointerdown=e=>{
    if(e.button>0)return;e.preventDefault();
    const g=el.cloneNode(true);g.classList.add("ghost");document.body.append(g);
    const mv=ev=>{g.style.left=ev.clientX+"px";g.style.top=ev.clientY+"px"};mv(e);
    const up=ev=>{
      window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);g.remove();
      const r=$("axis").getBoundingClientRect(),two=S.axes===2,pad=two?0:70;
      if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top-pad||ev.clientY>r.bottom+pad)return;
      const c01=v=>Math.min(1,Math.max(0,v));
      S.ov[i.id]=[c01(((ev.clientX-r.left)/r.width*100-P0)/PS),two?c01(((100-P0)-(ev.clientY-r.top)/r.height*100)/PS):null];
      render();
    };
    window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);
  };
}
function renderAxis(){
  $("stage").style.setProperty("--sz",SZ);
  const box=$("axis");box.innerHTML="";
  const two=(S?S.axes:$("axes2").checked?2:1)===2;
  box.classList.toggle("plot",two);if(two)box.style.height="";$("ayr").classList.toggle("hide",!two);$("ayl").classList.toggle("hide",!two);
  $("axm").textContent=!S?"":t(S.mode==="manual"?"ax_manual":S.mode==="rr"?"ax_rr":S.mode==="bt"?"ax_bt":"ax_elo");
  const add=(tag,cls)=>{const e=document.createElement(tag);e.className=cls;box.append(e);return e};
  add("i","hx");add("i",two?"hy":"tk");
  if(!S){if(!two)box.style.height="110px";add("div","plot-hint").textContent=t("empty_hint");return}
  const D=[dom(0),two?dom(1):null],placed=S.items.filter(isPlaced);
  const mk=(i,cls)=>{
    const c=document.createElement("div");c.className=cls+(S.cur&&S.cur.includes(i.id)?" cur":"")+(S.ov[i.id]&&S.mode!=="manual"?" ed":"");
    c.title=`${i.name} — ${fmt(i)}${two?" / "+fmt(i,1):""} (${t("n_duels",{n:i.g})})\n${t("drag_hint")}`;
    fill(c,i);drag(c,i,box,D,two);return c};
  const fr=(v,k)=>(v-D[k][0])/(D[k][1]-D[k][0]);
  if(two){
    placed.forEach(i=>{const c=mk(i,"dot");c.style.left=(P0+PS*fr(val(i,0),0))+"%";c.style.top=((100-P0)-PS*fr(val(i,1),1))+"%";box.append(c)});
    return;
  }
  const W=box.clientWidth||600;
  const pcs=placed.map(i=>({i,x:P0+PS*fr(val(i),0)}));
  pcs.sort((a,b)=>a.x-b.x);
  const lanes=[];let maxLane=0;
  pcs.forEach(p=>{
    const w=(p.i.src?48:Math.min(110,p.i.name.length*7+16))*SZ;
    const px=p.x/100*W,l=px-w/2,r=px+w/2;
    let k=0;while(lanes[k]!==undefined&&lanes[k]>l-4)k++;
    lanes[k]=r;p.k=k;maxLane=Math.max(maxLane,k);
  });
  // lanes alternate below / above the line so the arrow runs through the middle
  const lh=(pcs.some(p=>p.i.src)?72:34)*SZ,lv=Math.max(1,Math.ceil((maxLane+1)/2)),H=2*(lv*lh+14);
  box.style.height=H+"px";
  pcs.forEach(p=>{
    const c=mk(p.i,"chip"),up=p.k%2===1,off=H/2+6+(p.k>>1)*lh;
    if(up)c.classList.add("up");c.style.left=p.x+"%";c.style[up?"bottom":"top"]=off+"px";box.append(c);
  });
}

function results(){
  const nm=k=>S.items[k].name,two=S.axes===2,pl=(i,k)=>S.mode!=="manual"||(S.ov[i.id]&&S.ov[i.id][k]!=null);
  const rk=k=>new Map([...S.items].sort((a,b)=>(pl(b,k)?val(b,k):-1e9)-(pl(a,k)?val(a,k):-1e9)||b.st[k].w-a.st[k].w).map((i,j)=>[i,pl(i,k)?j+1:null]));
  const R0=rk(0),R1=two?rk(1):null;
  const rd=v=>S.mode==="rr"||S.mode==="manual"?+v.toFixed(3):Math.round(v*10)/10,sc=(i,k)=>pl(i,k)?rd(val(i,k)):null,
    ed=(i,k)=>S.mode!=="manual"&&S.ov[i.id]&&S.ov[i.id][k]!=null?{["score_computed"+(k?"2":"")]:rd(raw(i,k))}:{};
  const cv=r=>r===1?"a":r===0?"b":r===.5?"tie":null;
  return{
    method:{mode:S.mode,label:LANG.en["mode_"+S.mode],...(S.mode==="smart"||S.mode==="rand"?{k_factor:S.K,start_rating:1000}:{}),...(S.mode==="bt"?{rating_scale:"1000 + 400*log10(strength)"}:{}),...(S.mode!=="rr"&&S.mode!=="manual"?{duels_per_item_target:S.target}:{})},
    axes:S.axes,
    duels_played:S.history.length,
    ...(Object.keys(S.ov).length?{overrides:Object.fromEntries(Object.entries(S.ov).map(([k,v])=>[nm(k),v.map(x=>x==null?null:+x.toFixed(3))]))}:{}),
    axis:{left:$("axl").value,right:$("axr").value},
    ...(two?{axis2:{left:$("ayl").value,right:$("ayr").value}}:{}),
    ranking:[...S.items].sort((a,b)=>(R0.get(a)||1e9)-(R0.get(b)||1e9)).map(i=>({rank:R0.get(i),name:i.name,score:sc(i,0),...ed(i,0),wins:i.st[0].w,ties:i.st[0].t,losses:i.st[0].l,
      ...(two?{rank2:R1.get(i),score2:sc(i,1),...ed(i,1),wins2:i.st[1].w,ties2:i.st[1].t,losses2:i.st[1].l}:{}),duels:i.g})),
    history:S.history.map(h=>({a:nm(h.a),b:nm(h.b),result:cv(h.r),...(two?{result2:cv(h.r2)}:{})}))
  };
}
function renderJSON(){$("json").value=JSON.stringify(results(),null,2)}
$("copy").onclick=async()=>{try{await navigator.clipboard.writeText($("json").value);$("copy").textContent=t("copied")}catch(e){$("json").select();document.execCommand("copy")}
  setTimeout(()=>$("copy").textContent=t("copy"),1200)};
$("dl").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([$("json").value],{type:"application/json"}));
  a.download="ranking.json";a.click()};
window.addEventListener("resize",()=>{renderAxis();renderTemplates()});
function refreshLang(){applyLang();setAxDefaults();refreshSetup();showImp();renderTemplates();if(S)render();else renderAxis()}
$("langbtn").onclick=e=>{e.stopPropagation();const m=$("langmenu"),open=m.classList.contains("hide");
  m.classList.toggle("hide",!open);$("langbtn").setAttribute("aria-expanded",open)};
document.addEventListener("click",e=>{if(!e.target.closest(".dd"))closeLangMenu()});
$("themebtn").onclick=()=>{toggleTheme();applyLang()};
$("axes2").addEventListener("change",()=>{if(!S)renderAxis()});
applyLang();setAxDefaults();refreshSetup();renderTemplates();layout();renderAxis();