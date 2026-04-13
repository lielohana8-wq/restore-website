import { useState, useEffect, useRef } from "react";

/* ═══ CLOUD CONFIG ═══ 
   After first admin setup, paste your npoint ID here: */
const NPOINT_ID = "";
/* ═══════════════════ */

const PASS = "restore2024";
const DEFAULTS = {
  phone:"050-123-4567", waNum:"972501234567",
  services:[
    {name:"ניקוי ספות",desc:"ניקוי מקצועי לכל סוגי הספות — בד, עור, אימפלה, קטיפה. הסרת כתמים, ריחות וחיידקים.",price:250,accent:"#C8A44E"},
    {name:"ניקוי מזרנים",desc:"חיטוי עמוק והסרת קרדית אבק ואלרגנים.",price:150,accent:"#6DC489"},
    {name:"ניקוי מזגנים",desc:"ניקוי וחיטוי מזגנים עיליים ומרכזיים.",price:150,accent:"#4ABDE0"},
    {name:"ניקוי רכבים",desc:"שחזור פנים הרכב — ריפודים, תקרה, דשבורד.",price:300,accent:"#E07B5B"},
    {name:"ניקוי שטיחים",desc:"ניקוי עמוק לשטיחים מכל הסוגים.",price:200,accent:"#5BA0E0"},
    {name:"ניקוי כיסאות",desc:"כיסאות אוכל, משרדיים, גיימינג, בר.",price:80,accent:"#9B7ED8"},
  ],
  reviews:[
    {n:"דנה כ׳",t:"הספה נראית חדשה! מקצועי ואדיב.",s:"ניקוי ספות"},
    {n:"יוסי מ׳",t:"ניקו את הרכב — ריח של חדש!",s:"ניקוי רכבים"},
    {n:"מיכל ש׳",t:"אחרי ניקוי המזרן הילדים ישנים טוב יותר!",s:"ניקוי מזרנים"},
    {n:"אבי ר׳",t:"שטיח שחשבנו לזרוק — חזר לחיים!",s:"ניקוי שטיחים"},
    {n:"רונית ל׳",t:"מזגן + כיסאות — מושלם!",s:"ניקוי מזגנים"},
    {n:"עמית ב׳",t:"פוליש לאוטו — ברק מטורף!",s:"פוליש"},
  ],
  beforeAfter:[
    {title:"ניקוי ספת בד",desc:"3 שנים של כתמים → נעלמו",bc:"#6b5544",ac:"#c9b99a",imgBefore:"",imgAfter:""},
    {title:"ניקוי ריפודי רכב",desc:"רכב מוזנח → כמו מהסלון",bc:"#484848",ac:"#aaa",imgBefore:"",imgAfter:""},
    {title:"ניקוי שטיח",desc:"שטיח לזריקה → ניצל",bc:"#5c4e3f",ac:"#b8a990",imgBefore:"",imgAfter:""},
    {title:"ניקוי מזרן",desc:"כתמים + ריח → נעלמו",bc:"#7a6e5e",ac:"#ddd0c0",imgBefore:"",imgAfter:""},
  ],
  areas:"תל אביב · רמת גן · גבעתיים · הרצליה · רעננה · פתח תקווה · ראשון לציון · חולון · נתניה · ירושלים · בית שמש · אשדוד · אשקלון · באר שבע · חיפה · כפר סבא · מודיעין · רחובות · חדרה",
};

/* ─── Cloud (npoint.io — free, no CORS, no signup) ─── */
async function cloudLoad(id) {
  if (!id) return null;
  try {
    const r = await fetch(`https://api.npoint.io/${id}`);
    if (r.ok) { const d = await r.json(); return (d && d.phone) ? d : null; }
  } catch (e) { console.error("cloud load error:", e); }
  return null;
}
async function cloudSave(id, data) {
  try {
    if (id) {
      const r = await fetch(`https://api.npoint.io/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      return r.ok ? id : null;
    } else {
      const r = await fetch("https://api.npoint.io/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!r.ok) return null;
      // npoint returns HTML with the new URL, extract the ID
      const text = await r.text();
      try {
        const j = JSON.parse(text);
        if (j && j.id) return j.id;
      } catch(e) {}
      // Try extracting from URL pattern
      const match = text.match(/api\.npoint\.io\/([a-z0-9]+)/);
      return match ? match[1] : null;
    }
  } catch (e) { console.error("cloud save error:", e); return null; }
}

/* ─── Image compression ─── */
function compressImg(file, maxW = 400) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        const ratio = Math.min(maxW / img.width, maxW / img.height, 1);
        c.width = img.width * ratio; c.height = img.height * ratio;
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.5));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

const gL = () => { try { return JSON.parse(localStorage.getItem("r_leads") || "[]"); } catch { return []; } };
const sL = v => localStorage.setItem("r_leads", JSON.stringify(v));

const PROCESS = [
  {step:"01",title:"אבחון ראשוני",desc:"צלמו את הספה ושלחו בוואטסאפ. נאבחן סוג בד ודרך טיפול — בחינם.",icon:"🔍"},
  {step:"02",title:"הזרקת חומר ניקוי",desc:"חומר מקצועי היפואלרגני לעומק הסיבים.",icon:"💧"},
  {step:"03",title:"שאיבה מקצועית",desc:"שואבים הכל בציוד תעשייתי — 95% מהלחות נשאבת.",icon:"⚡"},
  {step:"04",title:"חיטוי, ייבוש ובישום",desc:"חיטוי אנטיבקטריאלי, ייבוש מואץ. 4-6 שעות — כמו חדשה.",icon:"✨"},
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=Assistant:wght@400;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{font-family:'Assistant',sans-serif;font-size:15px;color:#e8e6e1;direction:rtl;overflow-x:hidden;-webkit-font-smoothing:antialiased;background:#090909;background-image:radial-gradient(ellipse at 15% 25%,rgba(200,164,78,.07) 0%,transparent 50%),radial-gradient(ellipse at 85% 65%,rgba(200,164,78,.05) 0%,transparent 45%);background-attachment:fixed}
::selection{background:#C8A44E;color:#0E1A2B}img{max-width:100%;display:block}a{text-decoration:none;color:inherit}
h1,h2,h3,h4{font-family:'Heebo',sans-serif;font-weight:800;letter-spacing:-.02em}
.mx{max-width:1140px;margin:0 auto;padding:0 20px}.sec{padding:88px 0}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes glowPulse{0%,100%{filter:drop-shadow(0 0 8px rgba(200,164,78,.2))}50%{filter:drop-shadow(0 0 24px rgba(200,164,78,.4))}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes slideR{from{transform:translateX(100%)}to{transform:translateX(0)}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:15px 32px;border-radius:12px;font-size:15px;font-weight:700;border:none;cursor:pointer;transition:all .25s;font-family:'Heebo'}
.btn:hover{transform:translateY(-2px)}.btn-g{background:linear-gradient(135deg,#25D366,#1DA851);color:#fff;box-shadow:0 4px 16px rgba(37,211,102,.2)}.btn-a{background:linear-gradient(135deg,#C8A44E,#DDB960);color:#0E1A2B}.btn-o{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:#ccc}.btn-o:hover{border-color:#C8A44E;color:#C8A44E}
.crd{background:rgba(9,9,9,.7);backdrop-filter:blur(12px);border:1px solid rgba(200,164,78,.12);border-radius:16px;transition:all .3s}.crd:hover{border-color:rgba(200,164,78,.25);box-shadow:0 12px 40px rgba(0,0,0,.3);transform:translateY(-4px)}
.gold-line{height:2px;background:linear-gradient(90deg,transparent 5%,rgba(200,164,78,.3) 50%,transparent 95%)}
@media(max-width:800px){.d-hide{display:none!important}.m-show{display:flex!important}.m-col{grid-template-columns:1fr!important}.m-col2{grid-template-columns:1fr 1fr!important}.m-stack{flex-direction:column!important}.m-full{width:100%!important}.m-center{text-align:center!important}.sec{padding:60px 0}}
`;

function useV(t=.08){const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const e=r.current;if(!e)return;const o=new IntersectionObserver(([x])=>{if(x.isIntersecting){s(true);o.unobserve(e);}},{threshold:t});o.observe(e);return()=>o.disconnect();},[]);return[r,v];}
function Fade({children,d=0}){const[r,v]=useV();return<div ref={r} style={{opacity:v?1:0,transform:v?"none":"translateY(24px)",transition:`all .65s cubic-bezier(.22,1,.36,1) ${d}s`}}>{children}</div>;}
function Num({to,sfx=""}){const[v,s]=useState(0);const[r,vis]=useV();useEffect(()=>{if(!vis)return;const st=Date.now();const t=()=>{const p=Math.min((Date.now()-st)/1600,1);s(Math.round(to*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(t);};requestAnimationFrame(t);},[vis,to]);return<span ref={r}>{v.toLocaleString()}{sfx}</span>;}
const STit=({sub,children})=><div style={{textAlign:"center",marginBottom:48}}><h2 style={{fontSize:"clamp(26px,5vw,40px)",color:"#fff",marginBottom:sub?10:0}}>{children}</h2>{sub&&<p style={{color:"rgba(255,255,255,.35)",fontSize:15,maxWidth:480,margin:"0 auto"}}>{sub}</p>}</div>;

/* ═══ APP ═══ */
export default function App(){
  const[page,setPage]=useState("site");
  const[data,setData]=useState(DEFAULTS);
  const[cloudId,setCloudId]=useState(NPOINT_ID||"");
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    const id = NPOINT_ID || localStorage.getItem("r_npoint") || "";
    if(id){ setCloudId(id); cloudLoad(id).then(d=>{ if(d) setData({...DEFAULTS,...d}); setLoading(false); }); }
    else { setLoading(false); }
  },[]);

  if(loading) return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#090909"}}><style>{CSS}</style><div style={{color:"#C8A44E",fontFamily:"'Heebo'",fontSize:18}}>טוען...</div></div>;

  return<div><style>{CSS}</style>
    {page==="site"&&<Site data={data} goAdmin={()=>setPage("login")}/>}
    {page==="login"&&<Login ok={()=>setPage("admin")} back={()=>setPage("site")}/>}
    {page==="admin"&&<Admin data={data} setData={setData} cloudId={cloudId} setCloudId={setCloudId} back={()=>setPage("site")}/>}
  </div>;
}

/* ═══ SITE ═══ */
function Site({data:D,goAdmin}){
  const wa=`https://wa.me/${D.waNum}`;const wm=t=>`${wa}?text=${encodeURIComponent(t)}`;
  const[mm,setMm]=useState(false);const[showTop,setShowTop]=useState(false);
  useEffect(()=>{const f=()=>setShowTop(window.scrollY>400);window.addEventListener("scroll",f,{passive:true});return()=>window.removeEventListener("scroll",f);},[]);
  const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setMm(false);};
  const nav=[["services","שירותים"],["process","התהליך"],["gallery","לפני ואחרי"],["reviews","ביקורות"],["faq","שאלות"],["contact","צור קשר"]];
return<div>
<header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(9,9,9,.85)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(200,164,78,.06)"}}><div className="mx" style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:90}}><img src="/img/logo.png" alt="R" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{height:200,marginTop:50,cursor:"pointer",objectFit:"contain",animation:"glowPulse 4s ease-in-out infinite",filter:"drop-shadow(0 6px 20px rgba(0,0,0,.6))",position:"relative",zIndex:10,mixBlendMode:"screen"}}/><nav className="d-hide" style={{display:"flex",alignItems:"center",gap:24}}>{nav.map(([id,l])=><span key={id} onClick={()=>go(id)} style={{color:"rgba(255,255,255,.4)",fontSize:14,cursor:"pointer",fontFamily:"'Heebo'",fontWeight:500,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="#C8A44E"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.4)"}>{l}</span>)}<a href={wa} target="_blank" rel="noopener" className="btn btn-g" style={{padding:"10px 20px",fontSize:14}}>💬 וואטסאפ</a></nav><button className="m-show" onClick={()=>setMm(true)} style={{display:"none",background:"none",border:"none",color:"#C8A44E",fontSize:28,cursor:"pointer"}}>☰</button></div></header>

{mm&&<><div onClick={()=>setMm(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:200}}/><div style={{position:"fixed",top:0,right:0,bottom:0,width:"min(280px,80vw)",background:"#0c0c0c",zIndex:201,padding:20,display:"flex",flexDirection:"column",animation:"slideR .25s ease"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><img src="/img/logo.png" style={{height:48,mixBlendMode:"screen"}} alt=""/><button onClick={()=>setMm(false)} style={{background:"none",border:"none",color:"#C8A44E",fontSize:22,cursor:"pointer"}}>✕</button></div>{nav.map(([id,l])=><span key={id} onClick={()=>go(id)} style={{color:"rgba(255,255,255,.45)",fontSize:17,padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,.03)",cursor:"pointer",fontFamily:"'Heebo'",fontWeight:500}}>{l}</span>)}<a href={wa} target="_blank" rel="noopener" className="btn btn-g" style={{marginTop:16}}>💬 וואטסאפ</a></div></>}

<section style={{minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden",padding:"100px 0 50px"}}><div style={{position:"absolute",inset:0,backgroundImage:"url(/img/hero-sofa.png)",backgroundSize:"cover",backgroundPosition:"center 25%",opacity:.65}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to left,rgba(9,9,9,.15),rgba(9,9,9,.75) 55%)"}}/><div className="mx" style={{position:"relative",zIndex:2,width:"100%"}}><div className="m-center" style={{maxWidth:540}}>
  <div style={{display:"inline-block",padding:"7px 16px",borderRadius:10,background:"rgba(200,164,78,.08)",border:"1px solid rgba(200,164,78,.1)",color:"#C8A44E",fontSize:13,fontFamily:"'Heebo'",fontWeight:600,marginBottom:16}}>🔥 מחירי השקה</div>
  <h1 style={{fontSize:"clamp(34px,6.5vw,54px)",lineHeight:1.08,color:"#fff",marginBottom:16}}>אנחנו לא מנקים<br/><span style={{color:"#C8A44E"}}>אנחנו משחזרים</span></h1>
  <p style={{fontSize:16,color:"rgba(255,255,255,.5)",lineHeight:1.8,maxWidth:420,marginBottom:24}}>שחזור מקצועי לספות, מזרנים, שטיחים, מזגנים ורכבים.<br/>ציוד תעשייתי · חומרים בטוחים · תוצאות מובטחות</p>
  <div style={{display:"inline-flex",alignItems:"center",gap:12,padding:"12px 20px",borderRadius:14,background:"rgba(200,164,78,.06)",border:"1px solid rgba(200,164,78,.08)",marginBottom:24}}><span style={{fontFamily:"'Heebo'",fontSize:32,fontWeight:900,color:"#C8A44E"}}>₪{D.services?.[0]?.price||250}</span><span style={{fontSize:13,color:"rgba(255,255,255,.3)",lineHeight:1.3}}>לניקוי ספה<br/>כולל חיטוי ובישום</span></div>
  <div className="m-stack" style={{display:"flex",gap:10}}><a href={wa} target="_blank" rel="noopener" className="btn btn-g m-full" style={{fontSize:16,padding:"16px 32px"}}>💬 הזמינו בוואטסאפ</a><a href={`tel:${D.phone.replace(/-/g,"")}`} className="btn btn-o m-full" style={{fontSize:16,padding:"16px 32px"}}>📞 {D.phone}</a></div>
</div></div></section>

<div className="gold-line"/><div style={{background:"rgba(14,26,43,.5)",padding:"28px 0"}}><div className="mx"><div className="m-col2" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,textAlign:"center"}}>{[["3000","+","לקוחות מרוצים"],["100","%","שביעות רצון"],[String(D.services?.[0]?.price||250),"₪","ניקוי ספה מ-"],["7","","ימים בשבוע"]].map(([n,s,l],i)=><div key={i}><div style={{fontFamily:"'Heebo'",fontSize:28,fontWeight:900,color:"#C8A44E"}}><Num to={+n} sfx={s}/></div><div style={{fontSize:12,color:"rgba(255,255,255,.25)",marginTop:4}}>{l}</div></div>)}</div></div></div><div className="gold-line"/>

<section className="sec" style={{position:"relative",overflow:"hidden",backgroundImage:"linear-gradient(rgba(9,9,9,.5),rgba(9,9,9,.5)),url(/img/lion-ac.png)",backgroundSize:"cover",backgroundPosition:"center 30%"}}><div className="mx" style={{position:"relative",zIndex:1}}><Fade><STit sub="הספה מסריחה. המזרן מלא כתמים. מוכר?">הבעיה שכולם מכירים</STit></Fade><div className="m-col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:48}}>{[["🤢","ריחות רעים","עובש וזיעה שנספגו עמוק"],["🦠","חיידקים","קרדית אבק וזיהומים"],["💧","כתמים עיקשים","שום חומר ביתי לא עוזר"]].map(([ic,t,d],i)=><Fade key={i} d={i*.07}><div className="crd" style={{padding:"28px 22px",textAlign:"center"}}><div style={{fontSize:36,marginBottom:12}}>{ic}</div><h3 style={{fontSize:17,fontWeight:700,marginBottom:8,color:"#fff"}}>{t}</h3><p style={{fontSize:14,color:"rgba(255,255,255,.3)",lineHeight:1.7}}>{d}</p></div></Fade>)}</div><Fade d={.25}><div style={{textAlign:"center"}}><h3 style={{fontSize:"clamp(22px,4vw,32px)",color:"#fff",marginBottom:12}}>הפתרון? <span style={{color:"#C8A44E"}}>RESTORE</span></h3><a href={wa} target="_blank" rel="noopener" className="btn btn-a">💬 בואו נשחזר</a></div></Fade></div></section>

<section className="sec" id="services" style={{position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,backgroundImage:"url(/img/lion-van.png)",backgroundSize:"cover",backgroundPosition:"center 30%",opacity:.6}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(rgba(9,9,9,.35),rgba(9,9,9,.3))"}}/><div className="mx" style={{position:"relative",zIndex:1}}><Fade><STit sub="ציוד תעשייתי · חומרים בטוחים">השירותים שלנו</STit></Fade><div className="m-col2" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>{(D.services||[]).map((s,i)=><Fade key={i} d={i*.05}><div className="crd" style={{padding:"26px 22px",cursor:"pointer",height:"100%",display:"flex",flexDirection:"column",borderRight:`3px solid ${s.accent||"#C8A44E"}`}} onClick={()=>window.open(wm("היי, מעוניין/ת ב"+s.name),"_blank")}><h3 style={{fontSize:17,fontWeight:700,color:"#fff",marginBottom:8}}>{s.name}</h3><p style={{fontSize:13.5,color:"rgba(255,255,255,.3)",lineHeight:1.7,marginBottom:"auto",paddingBottom:14}}>{s.desc}</p><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,borderTop:"1px solid rgba(200,164,78,.06)"}}><span style={{fontFamily:"'Heebo'",fontSize:22,fontWeight:900,color:s.accent||"#C8A44E"}}>₪{s.price}</span><span style={{fontSize:12,color:"rgba(255,255,255,.2)"}}>הזמינו ←</span></div></div></Fade>)}</div></div></section>

<section className="sec" id="process" style={{position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,backgroundImage:"url(/img/lion-inspect.png)",backgroundSize:"cover",backgroundPosition:"center 20%",opacity:.55}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(rgba(9,9,9,.35),rgba(9,9,9,.3))"}}/><div className="mx" style={{position:"relative",zIndex:1}}><Fade><STit sub="4 שלבים לספה כמו חדשה">מה הספה שלכם עוברת?</STit></Fade><div style={{maxWidth:680,margin:"0 auto"}}>{PROCESS.map((p,i)=><Fade key={i} d={i*.1}><div style={{display:"flex",gap:20,padding:"28px 0",borderBottom:i<3?"1px solid rgba(200,164,78,.06)":"none"}}><div style={{flex:"0 0 64px",height:64,borderRadius:16,background:"rgba(9,9,9,.7)",backdropFilter:"blur(8px)",border:"1px solid rgba(200,164,78,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:24}}>{p.icon}</span></div><div><span style={{fontFamily:"'Heebo'",fontSize:12,fontWeight:800,color:"#C8A44E"}}>שלב {p.step}</span><h3 style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:6}}>{p.title}</h3><p style={{fontSize:14,color:"rgba(255,255,255,.35)",lineHeight:1.75}}>{p.desc}</p></div></div></Fade>)}</div><Fade d={.4}><div style={{textAlign:"center",marginTop:36}}><a href={wa} target="_blank" rel="noopener" className="btn btn-g" style={{fontSize:16,padding:"16px 36px"}}>💬 שלחו תמונה — הצעה תוך דקות</a></div></Fade></div></section>

<section style={{padding:"80px 0",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,backgroundImage:"url(/img/lion-office.png)",backgroundSize:"cover",backgroundPosition:"center 25%",opacity:.6}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to left,rgba(9,9,9,.1),rgba(9,9,9,.55) 55%)"}}/><div className="mx" style={{position:"relative",zIndex:2}}><div className="m-center" style={{maxWidth:480}}><Fade><h2 style={{fontSize:"clamp(22px,4vw,30px)",color:"#fff",marginBottom:10}}>רוצים הצעת מחיר?<br/><span style={{color:"#C8A44E"}}>האריה מחכה 🦁</span></h2></Fade><Fade d={.2}><div className="m-stack" style={{display:"flex",gap:10}}><a href={wa} target="_blank" rel="noopener" className="btn btn-g m-full">💬 שלחו תמונה</a><a href={`tel:${D.phone.replace(/-/g,"")}`} className="btn btn-a m-full">📞 חייגו</a></div></Fade></div></div></section>

<section className="sec" id="gallery"><div className="mx"><Fade><STit>לפני ואחרי</STit></Fade><div className="m-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>{(D.beforeAfter||[]).map((b,i)=><Fade key={i} d={i*.06}><div className="crd" style={{overflow:"hidden"}}><div style={{display:"flex",height:180}}><div style={{flex:1,background:b.imgBefore?"none":`linear-gradient(135deg,${b.bc},${b.bc}cc)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>{b.imgBefore?<img src={b.imgBefore} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:32,opacity:.08}}>✕</span>}<span style={{position:"absolute",bottom:8,right:8,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:10,fontFamily:"'Heebo'",fontWeight:700}}>לפני</span></div><div style={{width:2,background:"rgba(200,164,78,.2)"}}/><div style={{flex:1,background:b.imgAfter?"none":`linear-gradient(135deg,${b.ac},${b.ac}dd)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>{b.imgAfter?<img src={b.imgAfter} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:32,opacity:.08}}>✓</span>}<span style={{position:"absolute",bottom:8,left:8,padding:"4px 10px",borderRadius:8,background:"#C8A44E",color:"#0E1A2B",fontSize:10,fontFamily:"'Heebo'",fontWeight:700}}>אחרי</span></div></div><div style={{padding:"14px 18px"}}><h4 style={{fontSize:14,color:"#fff",marginBottom:2}}>{b.title}</h4><p style={{fontSize:12,color:"rgba(255,255,255,.25)"}}>{b.desc}</p></div></div></Fade>)}</div></div></section>

<section className="sec" id="reviews" style={{background:"rgba(14,26,43,.25)"}}><div className="mx"><Fade><STit>מה הלקוחות אומרים</STit></Fade><div className="m-col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>{(D.reviews||[]).map((r,i)=><Fade key={i} d={i*.05}><div className="crd" style={{padding:"24px 20px",height:"100%",display:"flex",flexDirection:"column"}}><div style={{color:"#C8A44E",fontSize:12,letterSpacing:2,marginBottom:10}}>★★★★★</div><p style={{fontSize:14,lineHeight:1.85,color:"rgba(255,255,255,.5)",marginBottom:"auto",paddingBottom:14}}>״{r.t}״</p><div style={{display:"flex",alignItems:"center",gap:10,paddingTop:12,borderTop:"1px solid rgba(200,164,78,.06)"}}><div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#C8A44E,#9A7B30)",display:"flex",alignItems:"center",justifyContent:"center",color:"#0E1A2B",fontFamily:"'Heebo'",fontWeight:800,fontSize:14}}>{r.n[0]}</div><div><div style={{fontSize:13,fontFamily:"'Heebo'",fontWeight:700,color:"#fff"}}>{r.n}</div><div style={{fontSize:11,color:"rgba(255,255,255,.2)"}}>{r.s}</div></div></div></div></Fade>)}</div></div></section>

<section className="sec" id="faq"><div className="mx" style={{maxWidth:680}}><Fade><STit>שאלות נפוצות</STit></Fade>{[["כמה זמן?","30-60 דקות. ייבוש 4-6 שעות."],["בטוח?","כן — היפואלרגני."],["כל הספות?","כן — בד, עור, קטיפה, אימפלה."],["כמה?","ספה מ-₪"+(D.services?.[0]?.price||250)+"."],["לאן?","פריסה ארצית."]].map(([q,a],i)=><Fade key={i} d={i*.04}><FaqItem q={q} a={a}/></Fade>)}</div></section>

<section className="sec" id="areas" style={{background:"rgba(14,26,43,.25)"}}><div className="mx"><Fade><STit>🚐 פריסה ארצית</STit></Fade><Fade d={.08}><div className="crd" style={{padding:"32px 36px",textAlign:"center"}}><p style={{fontSize:15,lineHeight:2.3,color:"rgba(255,255,255,.35)",fontFamily:"'Heebo'",fontWeight:500}}>{D.areas||DEFAULTS.areas}</p><a href={wa} target="_blank" rel="noopener" className="btn btn-g" style={{marginTop:20}}>💬 מגיעים אליכם?</a></div></Fade></div></section>

<section className="sec" style={{textAlign:"center"}}><div className="mx"><Fade><img src="/img/logo.png" alt="" style={{height:150,objectFit:"contain",margin:"0 auto 24px",mixBlendMode:"screen"}}/></Fade><Fade d={.1}><h2 style={{fontSize:"clamp(24px,5vw,36px)",color:"#fff",marginBottom:28}}>הבית שלך צריך <span style={{color:"#C8A44E"}}>RESTORE</span></h2></Fade><Fade d={.2}><div className="m-stack" style={{display:"flex",gap:10,justifyContent:"center"}}><a href={wa} target="_blank" rel="noopener" className="btn btn-g m-full" style={{fontSize:17,padding:"18px 36px"}}>💬 הזמינו</a><a href={`tel:${D.phone.replace(/-/g,"")}`} className="btn btn-o m-full" style={{fontSize:17,padding:"18px 36px"}}>📞 {D.phone}</a></div></Fade></div></section>

<section className="sec" id="contact" style={{background:"rgba(14,26,43,.25)"}}><div className="mx"><Fade><STit>השאירו פרטים</STit></Fade><Fade d={.1}><LeadForm services={D.services||[]} wa={wa}/></Fade></div></section>

<footer style={{background:"rgba(0,0,0,.4)",padding:"48px 0 16px",borderTop:"1px solid rgba(200,164,78,.05)"}}><div className="mx"><div className="m-col" style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",gap:28,marginBottom:32}}><div><img src="/img/logo.png" alt="" style={{height:52,marginBottom:14,mixBlendMode:"screen"}}/><p style={{fontSize:13,color:"rgba(255,255,255,.15)"}}>שחזור מקצועי — אחריות מלאה.</p></div><div><h4 style={{color:"#C8A44E",fontSize:12,marginBottom:12}}>שירותים</h4>{(D.services||[]).map((s,i)=><div key={i} style={{fontSize:12,color:"rgba(255,255,255,.15)",marginBottom:5}}>{s.name}</div>)}</div><div><h4 style={{color:"#C8A44E",fontSize:12,marginBottom:12}}>ניווט</h4>{nav.map(([id,l])=><div key={id} style={{fontSize:12,color:"rgba(255,255,255,.15)",marginBottom:5,cursor:"pointer"}} onClick={()=>go(id)}>{l}</div>)}</div><div><h4 style={{color:"#C8A44E",fontSize:12,marginBottom:12}}>צור קשר</h4><div style={{fontSize:12,color:"rgba(255,255,255,.15)"}}>📞 {D.phone}</div><div style={{fontSize:12,color:"rgba(255,255,255,.15)"}}>💬 וואטסאפ</div></div></div><div style={{borderTop:"1px solid rgba(255,255,255,.03)",paddingTop:12,display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,.08)"}}><span>© 2026 RESTORE</span><span onClick={goAdmin} style={{cursor:"pointer"}}>ניהול</span></div></div></footer>

<a href={wa} target="_blank" rel="noopener" style={{position:"fixed",bottom:20,left:20,zIndex:999,width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#25D366,#1DA851)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#fff",boxShadow:"0 4px 16px rgba(37,211,102,.3)",animation:"floatY 3s ease-in-out infinite"}}>💬</a>
{showTop&&<button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{position:"fixed",bottom:20,right:20,zIndex:999,width:40,height:40,borderRadius:10,background:"rgba(200,164,78,.08)",border:"1px solid rgba(200,164,78,.1)",color:"#C8A44E",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>}
<div className="m-show" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:90,background:"rgba(9,9,9,.95)",backdropFilter:"blur(14px)",padding:"8px 12px",display:"none",gap:8,borderTop:"1px solid rgba(200,164,78,.06)"}}><a href={wa} target="_blank" rel="noopener" className="btn btn-g" style={{flex:1,padding:"12px 6px",fontSize:14}}>💬 וואטסאפ</a><a href={`tel:${D.phone.replace(/-/g,"")}`} className="btn btn-a" style={{flex:1,padding:"12px 6px",fontSize:14}}>📞 חייגו</a></div>
</div>;}

function FaqItem({q,a}){const[o,s]=useState(false);return<div className="crd" style={{marginBottom:8}}><div onClick={()=>s(!o)} style={{padding:"18px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15,fontFamily:"'Heebo'",fontWeight:600}}>{q}</span><span style={{color:"#C8A44E",fontSize:12,transition:"transform .25s",transform:o?"rotate(180deg)":""}}>▼</span></div>{o&&<div style={{padding:"0 20px 18px",fontSize:14,color:"rgba(255,255,255,.35)",lineHeight:1.8}}>{a}</div>}</div>;}
function LeadForm({services,wa}){const[f,setF]=useState({name:"",phone:"",service:""});const[sent,setSent]=useState(false);const inp={width:"100%",padding:"14px 16px",borderRadius:12,border:"1px solid rgba(200,164,78,.08)",fontSize:14,fontFamily:"'Assistant'",background:"rgba(255,255,255,.02)",color:"#fff",direction:"rtl",outline:"none"};const submit=()=>{const l=gL();l.push({...f,id:"l"+Date.now(),date:new Date().toISOString(),status:"new"});sL(l);setSent(true);setTimeout(()=>{setSent(false);setF({name:"",phone:"",service:""});},5000);};if(sent)return<div style={{maxWidth:480,margin:"0 auto",textAlign:"center",padding:40}}><div style={{fontSize:40,marginBottom:12}}>✅</div><h3 style={{fontSize:20,color:"#fff"}}>נשלח!</h3></div>;return<form onSubmit={e=>{e.preventDefault();if(f.name&&f.phone)submit();}} style={{maxWidth:480,margin:"0 auto",background:"rgba(9,9,9,.5)",backdropFilter:"blur(12px)",borderRadius:20,padding:"36px 28px",border:"1px solid rgba(200,164,78,.08)"}}>{[["שם מלא","text","name","שם"],["טלפון","tel","phone","050-000-0000"]].map(([l,t,k,p])=><div key={k} style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontFamily:"'Heebo'",fontWeight:600,color:"rgba(255,255,255,.3)",marginBottom:5}}>{l} *</label><input type={t} style={inp} value={f[k]} placeholder={p} required onChange={e=>setF(x=>({...x,[k]:e.target.value}))}/></div>)}<div style={{marginBottom:18}}><label style={{display:"block",fontSize:12,fontFamily:"'Heebo'",fontWeight:600,color:"rgba(255,255,255,.3)",marginBottom:5}}>שירות</label><select style={{...inp,appearance:"none"}} value={f.service} onChange={e=>setF(x=>({...x,service:e.target.value}))}><option value="">בחר</option>{services.map((s,i)=><option key={i} value={s.name}>{s.name} — ₪{s.price}</option>)}</select></div><button type="submit" className="btn btn-a" style={{width:"100%",fontSize:16,padding:"16px 0"}}>שלחו פרטים ←</button></form>;}

function Login({ok,back}){const[p,setP]=useState("");const[e,setE]=useState(false);return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#090909"}}><div style={{background:"rgba(255,255,255,.02)",borderRadius:20,padding:40,width:360,maxWidth:"90vw",textAlign:"center",border:"1px solid rgba(200,164,78,.06)"}}><img src="/img/logo.png" alt="" style={{height:60,margin:"0 auto 20px",mixBlendMode:"screen"}}/><h2 style={{fontSize:20,color:"#fff",marginBottom:20}}>כניסת מנהל</h2><input type="password" style={{width:"100%",padding:"13px 18px",borderRadius:12,border:"1px solid rgba(200,164,78,.08)",fontSize:15,textAlign:"center",fontFamily:"'Assistant'",background:"rgba(255,255,255,.02)",color:"#fff",outline:"none",marginBottom:12}} value={p} onChange={x=>{setP(x.target.value);setE(false);}} placeholder="סיסמה" onKeyDown={x=>{if(x.key==="Enter"){p===PASS?ok():setE(true);}}}/>{e&&<p style={{color:"#F87171",fontSize:13,marginBottom:10}}>סיסמה שגויה</p>}<button onClick={()=>p===PASS?ok():setE(true)} className="btn btn-a" style={{width:"100%",marginBottom:10}}>כניסה</button><button onClick={back} style={{background:"none",border:"none",color:"rgba(255,255,255,.2)",cursor:"pointer",fontSize:13}}>← חזרה</button></div></div>;}

/* ═══ ADMIN ═══ */
function Admin({data,setData,cloudId,setCloudId,back}){
  const[tab,setTab]=useState("cloud");
  const[leads,setLeads]=useState(gL());
  const[toast,setToast]=useState("");
  const[d,sd]=useState(JSON.parse(JSON.stringify(data)));
  const[saving,setSaving]=useState(false);
  const show=m=>{setToast(m);setTimeout(()=>setToast(""),4000);};

  const saveAll=async()=>{
    const id = cloudId || localStorage.getItem("r_npoint") || "";
    if(!id){ show("⚠️ חבר לענן קודם!"); setTab("cloud"); return; }
    setSaving(true); show("שומר...");
    const ok = await cloudSave(id, d);
    if(ok){ setData(d); show("✅ נשמר לכולם!"); }
    else { show("❌ שגיאה בשמירה"); }
    setSaving(false);
  };

  const connectCloud=async()=>{
    setSaving(true); show("יוצר אחסון ענן...");
    try {
      const r = await fetch("https://api.npoint.io/", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(d) });
      const text = await r.text();
      // npoint.io returns a page with the URL. The ID is in the URL path
      let newId = "";
      try { const j = JSON.parse(text); newId = j.id || ""; } catch(e) {}
      if(!newId){ const m = text.match(/npoint\.io\/([a-z0-9]+)/); if(m) newId = m[1]; }
      if(newId){
        localStorage.setItem("r_npoint", newId);
        setCloudId(newId);
        show("✅ ענן מחובר! ID: " + newId);
      } else {
        // Fallback: create manually via the website
        show("⚠️ צור ידנית — ראה הוראות למטה");
      }
    } catch(e) { show("❌ שגיאה: " + e.message); }
    setSaving(false);
  };

  const manualConnect=(id)=>{
    if(id && id.length > 5){
      localStorage.setItem("r_npoint", id);
      setCloudId(id);
      show("✅ מחובר!");
    }
  };

  const handleImg=async(i,key,file)=>{
    if(!file)return;
    const compressed = await compressImg(file, 400);
    const ba=[...(d.beforeAfter||[])]; ba[i]={...ba[i],[key]:compressed}; sd({...d,beforeAfter:ba});
    show("תמונה נוספה — לחץ שמור");
  };

  const upS=(i,k,v)=>{const s=[...(d.services||[])];s[i]={...s[i],[k]:k==="price"?+v:v};sd({...d,services:s});};
  const upR=(i,k,v)=>{const r=[...(d.reviews||[])];r[i]={...r[i],[k]:v};sd({...d,reviews:r});};
  const upB=(i,k,v)=>{const b=[...(d.beforeAfter||[])];b[i]={...b[i],[k]:v};sd({...d,beforeAfter:b});};

  const box={background:"rgba(255,255,255,.025)",border:"1px solid rgba(200,164,78,.06)",borderRadius:16,padding:20,marginBottom:12};
  const inp={width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid rgba(200,164,78,.08)",fontSize:14,fontFamily:"'Assistant'",background:"rgba(255,255,255,.02)",color:"#fff",direction:"rtl",outline:"none",marginBottom:8};
  const lbl={display:"block",fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:3,fontFamily:"'Heebo'",fontWeight:600};

return<div style={{minHeight:"100vh",background:"#090909",direction:"rtl"}}>
  {toast&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:10000,background:toast.startsWith("❌")?"#DC2626":toast.startsWith("⚠")?"#D97706":"#059669",color:"#fff",padding:"12px 24px",borderRadius:12,fontSize:14,fontFamily:"'Heebo'",fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,.4)"}}>{toast}</div>}
  <div style={{background:"rgba(14,26,43,.6)",borderBottom:"1px solid rgba(200,164,78,.06)",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontFamily:"'Heebo'",fontSize:14,fontWeight:800,color:"#C8A44E"}}>פאנל ניהול</span>{cloudId&&<span style={{fontSize:10,color:"#25D366"}}>● ענן</span>}</div>
    <div style={{display:"flex",gap:8}}><button onClick={saveAll} disabled={saving||!cloudId} className="btn btn-g" style={{padding:"8px 20px",fontSize:14,opacity:(saving||!cloudId)?.5:1}}>{saving?"שומר...":"🚀 שמור לכולם"}</button><button onClick={back} style={{background:"none",border:"1px solid rgba(255,255,255,.06)",borderRadius:10,padding:"8px 14px",color:"rgba(255,255,255,.35)",cursor:"pointer",fontSize:12}}>← חזרה</button></div>
  </div>
  <div style={{display:"flex",gap:4,padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,.03)",flexWrap:"wrap"}}>{[["cloud","☁️ ענן"],["contact","📞 קשר"],["services","💰 שירותים"],["reviews","⭐ ביקורות"],["ba","📸 לפני/אחרי"],["areas","🗺️ אזורים"],["leads","📋 לידים"]].map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,fontFamily:"'Heebo'",fontWeight:600,background:tab===id?"rgba(200,164,78,.1)":"transparent",color:tab===id?"#C8A44E":"rgba(255,255,255,.3)"}}>{l}</button>)}</div>
  <div style={{maxWidth:820,margin:"0 auto",padding:20}}>

    {tab==="cloud"&&<div><h3 style={{fontSize:18,color:"#fff",marginBottom:16}}>☁️ חיבור ענן</h3><div style={box}>
      {cloudId?<><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div style={{width:10,height:10,borderRadius:"50%",background:"#25D366"}}/><span style={{color:"#25D366",fontFamily:"'Heebo'",fontWeight:700}}>מחובר ✅</span></div><p style={{fontSize:13,color:"rgba(255,255,255,.35)",lineHeight:1.8}}>ID: <code style={{background:"rgba(200,164,78,.1)",padding:"2px 8px",borderRadius:4,color:"#C8A44E"}}>{cloudId}</code></p><p style={{fontSize:13,color:"rgba(255,255,255,.35)",lineHeight:1.8,marginTop:8}}>שנה מחיר/טלפון/ביקורת → לחץ <strong style={{color:"#25D366"}}>"שמור לכולם"</strong> → כל מבקר רואה.</p></>
      :<><p style={{fontSize:14,color:"rgba(255,255,255,.4)",lineHeight:2,marginBottom:16}}>חבר לענן כדי שכל שינוי יישמר <strong style={{color:"#fff"}}>לכולם</strong>.</p>
        <button onClick={connectCloud} disabled={saving} className="btn btn-g" style={{fontSize:15,marginBottom:20}}>{saving?"מתחבר...":"☁️ חבר לענן — אוטומטי"}</button>
        <div style={{background:"rgba(0,0,0,.3)",borderRadius:12,padding:16}}>
          <p style={{fontSize:13,color:"#C8A44E",fontFamily:"'Heebo'",fontWeight:700,marginBottom:8}}>אם אוטומטי לא עובד — חיבור ידני:</p>
          <ol style={{fontSize:13,color:"rgba(255,255,255,.4)",lineHeight:2.2,paddingRight:20}}>
            <li>לכו ל: <a href="https://www.npoint.io/" target="_blank" rel="noopener" style={{color:"#C8A44E",textDecoration:"underline"}}>npoint.io</a></li>
            <li>הדביקו: <code style={{background:"rgba(200,164,78,.1)",padding:"2px 6px",borderRadius:4,color:"#C8A44E",fontSize:11}}>{"{}"}</code> ולחצו <strong style={{color:"#fff"}}>Save</strong></li>
            <li>העתיקו את ה-ID מהכתובת (המחרוזת אחרי /api/)</li>
            <li>הדביקו למטה:</li>
          </ol>
          <div style={{display:"flex",gap:8,marginTop:8}}><input id="npid" style={{...inp,marginBottom:0,flex:1,direction:"ltr",textAlign:"left"}} placeholder="הדביקו ID כאן..."/><button onClick={()=>{const v=document.getElementById("npid").value.trim();manualConnect(v);}} className="btn btn-a" style={{padding:"8px 16px",fontSize:13}}>חבר</button></div>
        </div>
      </>}
    </div></div>}

    {tab==="contact"&&<div><h3 style={{fontSize:18,color:"#fff",marginBottom:16}}>📞 קשר</h3><div style={box}><label style={lbl}>טלפון</label><input style={inp} value={d.phone||""} onChange={e=>sd({...d,phone:e.target.value})}/><label style={lbl}>וואטסאפ (ללא +)</label><input style={inp} value={d.waNum||""} onChange={e=>sd({...d,waNum:e.target.value})}/></div></div>}

    {tab==="services"&&<div><h3 style={{fontSize:18,color:"#fff",marginBottom:16}}>💰 שירותים <button onClick={()=>sd({...d,services:[...(d.services||[]),{name:"חדש",desc:"תיאור",price:100,accent:"#C8A44E"}]})} style={{fontSize:12,background:"rgba(200,164,78,.1)",border:"none",color:"#C8A44E",padding:"4px 12px",borderRadius:8,cursor:"pointer"}}>+ הוסף</button></h3>{(d.services||[]).map((s,i)=><div key={i} style={box}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><strong style={{color:"#C8A44E"}}>{s.name||"שירות "+(i+1)}</strong><button onClick={()=>sd({...d,services:d.services.filter((_,j)=>j!==i)})} style={{background:"none",border:"none",color:"#F87171",cursor:"pointer",fontSize:12}}>🗑</button></div><label style={lbl}>שם</label><input style={inp} value={s.name} onChange={e=>upS(i,"name",e.target.value)}/><label style={lbl}>תיאור</label><textarea style={{...inp,height:60,resize:"vertical"}} value={s.desc} onChange={e=>upS(i,"desc",e.target.value)}/><div style={{display:"flex",gap:8}}><div style={{flex:1}}><label style={lbl}>מחיר ₪</label><input style={inp} type="number" value={s.price} onChange={e=>upS(i,"price",e.target.value)}/></div><div style={{flex:1}}><label style={lbl}>צבע</label><input style={{...inp,padding:4,height:38}} type="color" value={s.accent||"#C8A44E"} onChange={e=>upS(i,"accent",e.target.value)}/></div></div></div>)}</div>}

    {tab==="reviews"&&<div><h3 style={{fontSize:18,color:"#fff",marginBottom:16}}>⭐ ביקורות <button onClick={()=>sd({...d,reviews:[...(d.reviews||[]),{n:"שם",t:"ביקורת",s:"שירות"}]})} style={{fontSize:12,background:"rgba(200,164,78,.1)",border:"none",color:"#C8A44E",padding:"4px 12px",borderRadius:8,cursor:"pointer"}}>+ הוסף</button></h3>{(d.reviews||[]).map((r,i)=><div key={i} style={box}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><strong style={{color:"#C8A44E"}}>{r.n}</strong><button onClick={()=>sd({...d,reviews:d.reviews.filter((_,j)=>j!==i)})} style={{background:"none",border:"none",color:"#F87171",cursor:"pointer",fontSize:12}}>🗑</button></div><label style={lbl}>שם</label><input style={inp} value={r.n} onChange={e=>upR(i,"n",e.target.value)}/><label style={lbl}>ביקורת</label><textarea style={{...inp,height:60,resize:"vertical"}} value={r.t} onChange={e=>upR(i,"t",e.target.value)}/><label style={lbl}>שירות</label><input style={inp} value={r.s} onChange={e=>upR(i,"s",e.target.value)}/></div>)}</div>}

    {tab==="ba"&&<div><h3 style={{fontSize:18,color:"#fff",marginBottom:16}}>📸 לפני/אחרי <button onClick={()=>sd({...d,beforeAfter:[...(d.beforeAfter||[]),{title:"חדש",desc:"תיאור",bc:"#555",ac:"#aaa",imgBefore:"",imgAfter:""}]})} style={{fontSize:12,background:"rgba(200,164,78,.1)",border:"none",color:"#C8A44E",padding:"4px 12px",borderRadius:8,cursor:"pointer"}}>+ הוסף</button></h3>{(d.beforeAfter||[]).map((b,i)=><div key={i} style={box}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><strong style={{color:"#C8A44E"}}>{b.title}</strong><button onClick={()=>sd({...d,beforeAfter:d.beforeAfter.filter((_,j)=>j!==i)})} style={{background:"none",border:"none",color:"#F87171",cursor:"pointer",fontSize:12}}>🗑</button></div><label style={lbl}>כותרת</label><input style={inp} value={b.title} onChange={e=>upB(i,"title",e.target.value)}/><label style={lbl}>תיאור</label><input style={inp} value={b.desc} onChange={e=>upB(i,"desc",e.target.value)}/>
      <div style={{display:"flex",gap:12,marginBottom:8}}><div style={{flex:1}}><label style={lbl}>📷 לפני</label>{b.imgBefore&&<img src={b.imgBefore} style={{width:"100%",height:80,objectFit:"cover",borderRadius:8,marginBottom:6}}/>}<input type="file" accept="image/*" onChange={e=>handleImg(i,"imgBefore",e.target.files[0])} style={{fontSize:11,color:"rgba(255,255,255,.3)",width:"100%"}}/></div><div style={{flex:1}}><label style={lbl}>📷 אחרי</label>{b.imgAfter&&<img src={b.imgAfter} style={{width:"100%",height:80,objectFit:"cover",borderRadius:8,marginBottom:6}}/>}<input type="file" accept="image/*" onChange={e=>handleImg(i,"imgAfter",e.target.files[0])} style={{fontSize:11,color:"rgba(255,255,255,.3)",width:"100%"}}/></div></div>
    </div>)}</div>}

    {tab==="areas"&&<div><h3 style={{fontSize:18,color:"#fff",marginBottom:16}}>🗺️ אזורים</h3><div style={box}><label style={lbl}>ערים (מופרדות ב-·)</label><textarea style={{...inp,height:100,resize:"vertical"}} value={d.areas||""} onChange={e=>sd({...d,areas:e.target.value})}/></div></div>}

    {tab==="leads"&&<div><h3 style={{fontSize:18,color:"#fff",marginBottom:16}}>📋 לידים ({leads.length})</h3>{leads.length===0?<p style={{color:"rgba(255,255,255,.2)"}}>אין לידים</p>:[...leads].reverse().map(l=><div key={l.id} style={box}><div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}><div><strong style={{color:"#fff"}}>{l.name}</strong> — <span style={{color:"rgba(255,255,255,.3)"}}>{l.phone}</span>{l.service&&<span style={{color:"#C8A44E",marginRight:8}}> · {l.service}</span>}</div><div style={{display:"flex",gap:4}}><a href={`https://wa.me/972${l.phone.replace(/^0/,"").replace(/-/g,"")}`} target="_blank" rel="noopener" style={{padding:"4px 8px",borderRadius:6,background:"#25D366",color:"#fff",fontSize:10}}>💬</a><button onClick={()=>{setLeads(leads.filter(x=>x.id!==l.id));sL(leads.filter(x=>x.id!==l.id));}} style={{padding:"4px 8px",borderRadius:6,background:"rgba(248,113,113,.06)",border:"none",color:"#F87171",fontSize:10,cursor:"pointer"}}>🗑</button></div></div></div>)}</div>}

  </div>
</div>;}
