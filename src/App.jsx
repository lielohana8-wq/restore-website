import { useState, useEffect, useRef } from "react";

/* ─── CONFIG ─── */
const PH = "050-123-4567";
const WA = "https://wa.me/972501234567";
const wm = t => `${WA}?text=${encodeURIComponent(t)}`;
const PASS = "restore2024";
const gL = () => { try { return JSON.parse(localStorage.getItem("r_leads") || "[]"); } catch { return []; } };
const sL = v => localStorage.setItem("r_leads", JSON.stringify(v));

/* ─── DATA ─── */
const SERVICES = [
  { name: "ניקוי ספות", desc: "ניקוי מקצועי לכל סוגי הספות — בד, עור, אימפלה, קטיפה ודמוי עור. הסרת כתמים עמוקים, ריחות וחיידקים.", price: 250, accent: "#C8A44E" },
  { name: "ניקוי מזרנים", desc: "חיטוי עמוק והסרת קרדית אבק, אלרגנים וכתמים. שינה נקייה ובריאה לכל המשפחה.", price: 150, accent: "#6DC489" },
  { name: "ניקוי מזגנים", desc: "ניקוי, חיטוי ותחזוקת מזגנים עיליים ומרכזיים. אוויר נקי ובריא בבית.", price: 150, accent: "#4ABDE0" },
  { name: "ניקוי רכבים", desc: "שחזור פנים הרכב — ריפודים, תקרה, דשבורד, מושבי עור ותא מטען.", price: 300, accent: "#E07B5B" },
  { name: "ניקוי שטיחים", desc: "ניקוי עמוק לשטיחים מכל הסוגים — ניידים ומקיר לקיר.", price: 200, accent: "#5BA0E0" },
  { name: "ניקוי כיסאות", desc: "כיסאות אוכל, משרדיים, גיימינג, בר וכורסאות.", price: 80, accent: "#9B7ED8" },
];

const REVIEWS = [
  { n: "דנה כ׳", t: "הספה שלנו נראית חדשה לגמרי! הצוות היה מקצועי ואדיב. ממליצה בחום!", s: "ניקוי ספות" },
  { n: "יוסי מ׳", t: "ניקו לי את הרכב מבפנים — ריח של חדש! מקצוענים אמיתיים.", s: "ניקוי רכבים" },
  { n: "מיכל ש׳", t: "אחרי ניקוי המזרן הילדים ישנים הרבה יותר טוב. ההבדל מורגש!", s: "ניקוי מזרנים" },
  { n: "אבי ר׳", t: "שטיח פרסי שחשבנו לזרוק — חזר לחיים. לא האמנו!", s: "ניקוי שטיחים" },
  { n: "רונית ל׳", t: "מזגן + כיסאות — מושלם. מחיר הוגן ושירות מעולה.", s: "ניקוי מזגנים" },
  { n: "עמית ב׳", t: "פוליש לאוטו — ברק מטורף! שווה כל שקל.", s: "פוליש" },
];

const AREAS = "תל אביב · רמת גן · גבעתיים · הרצליה · רעננה · פתח תקווה · ראשון לציון · חולון · נתניה · ירושלים · בית שמש · אשדוד · אשקלון · באר שבע · חיפה · כפר סבא · מודיעין · רחובות · חדרה";

const PROCESS = [
  { step: "01", title: "אבחון ראשוני", desc: "צלמו את הספה ושלחו בוואטסאפ. נאבחן את סוג הבד, רמת הלכלוך ואת דרך הטיפול — בחינם.", icon: "🔍" },
  { step: "02", title: "הזרקת חומר ניקוי", desc: "מזריקים חומר ניקוי מקצועי היפואלרגני לעומק הסיבים. החומר מפרק שומנים, כתמים וחיידקים.", icon: "💧" },
  { step: "03", title: "שאיבה מקצועית", desc: "שואבים את כל הלכלוך, החומר והמים בציוד תעשייתי — 95% מהלחות נשאבת החוצה.", icon: "⚡" },
  { step: "04", title: "חיטוי, ייבוש ובישום", desc: "חיטוי אנטיבקטריאלי, ייבוש מואץ ובישום קל. תוך 4-6 שעות — הספה כמו חדשה.", icon: "✨" },
];

/* ─── STYLES ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=Assistant:wght@400;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{
  font-family:'Assistant',sans-serif;font-weight:400;font-size:15px;
  color:#e8e6e1;direction:rtl;overflow-x:hidden;-webkit-font-smoothing:antialiased;
  background:#090909;
  background-image:
    radial-gradient(ellipse at 15% 25%, rgba(200,164,78,.07) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 65%, rgba(200,164,78,.05) 0%, transparent 45%),
    radial-gradient(ellipse at 55% 15%, rgba(160,128,48,.04) 0%, transparent 40%),
    radial-gradient(ellipse at 35% 85%, rgba(200,164,78,.03) 0%, transparent 45%),
    radial-gradient(ellipse at 70% 40%, rgba(14,26,43,.2) 0%, transparent 50%);
  background-attachment:fixed;
}
::selection{background:#C8A44E;color:#0E1A2B}
img{max-width:100%;display:block}a{text-decoration:none;color:inherit}
h1,h2,h3,h4{font-family:'Heebo',sans-serif;font-weight:800;letter-spacing:-.02em}
.mx{max-width:1140px;margin:0 auto;padding:0 20px}
.sec{padding:88px 0}

@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes glowPulse{0%,100%{filter:drop-shadow(0 0 8px rgba(200,164,78,.2))}50%{filter:drop-shadow(0 0 24px rgba(200,164,78,.4))}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes slideR{from{transform:translateX(100%)}to{transform:translateX(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:none}}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:15px 32px;border-radius:12px;font-size:15px;font-weight:700;border:none;cursor:pointer;transition:all .25s;font-family:'Heebo';letter-spacing:.01em}
.btn:hover{transform:translateY(-2px)}
.btn-g{background:linear-gradient(135deg,#25D366,#1DA851);color:#fff;box-shadow:0 4px 16px rgba(37,211,102,.2)}
.btn-a{background:linear-gradient(135deg,#C8A44E,#DDB960);color:#0E1A2B;box-shadow:0 4px 16px rgba(200,164,78,.15)}
.btn-o{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:#ccc}
.btn-o:hover{border-color:#C8A44E;color:#C8A44E}

.crd{background:rgba(9,9,9,.7);backdrop-filter:blur(12px);border:1px solid rgba(200,164,78,.12);border-radius:16px;transition:all .3s}
.crd:hover{border-color:rgba(200,164,78,.25);box-shadow:0 12px 40px rgba(0,0,0,.3);transform:translateY(-4px)}

.gold-line{height:2px;background:linear-gradient(90deg,transparent 5%,rgba(200,164,78,.3) 50%,transparent 95%)}

@media(max-width:800px){
  .d-hide{display:none!important}.m-show{display:flex!important}
  .m-col{grid-template-columns:1fr!important}.m-col2{grid-template-columns:1fr 1fr!important}
  .m-stack{flex-direction:column!important}.m-full{width:100%!important}
  .m-center{text-align:center!important}.lion-d{display:none!important}
  .sec{padding:60px 0}
}
`;

/* ─── UTILS ─── */
function useV(t=.08){const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const e=r.current;if(!e)return;const o=new IntersectionObserver(([x])=>{if(x.isIntersecting){s(true);o.unobserve(e);}},{threshold:t});o.observe(e);return()=>o.disconnect();},[]);return[r,v];}
function Fade({children,d=0}){const[r,v]=useV();return<div ref={r} style={{opacity:v?1:0,transform:v?"none":"translateY(24px)",transition:`all .65s cubic-bezier(.22,1,.36,1) ${d}s`}}>{children}</div>;}
function Num({to,sfx=""}){const[v,s]=useState(0);const[r,vis]=useV();useEffect(()=>{if(!vis)return;const st=Date.now();const t=()=>{const p=Math.min((Date.now()-st)/1600,1);s(Math.round(to*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(t);};requestAnimationFrame(t);},[vis,to]);return<span ref={r}>{v.toLocaleString()}{sfx}</span>;}

const SectionTitle = ({sub,children}) => <div style={{textAlign:"center",marginBottom:48}}><h2 style={{fontSize:"clamp(26px,5vw,40px)",color:"#fff",marginBottom:sub?10:0}}>{children}</h2>{sub&&<p style={{color:"rgba(255,255,255,.35)",fontSize:15,maxWidth:480,margin:"0 auto"}}>{sub}</p>}</div>;

/* ═══════════════════════════ APP ═══════════════════════════ */
export default function App(){
  const[page,setPage]=useState("site");
  return<div><style>{CSS}</style>
    {page==="site"&&<Site goAdmin={()=>setPage("login")}/>}
    {page==="login"&&<Login ok={()=>setPage("admin")} back={()=>setPage("site")}/>}
    {page==="admin"&&<Admin back={()=>setPage("site")}/>}
  </div>;
}

/* ═══════════════════════════ SITE ═══════════════════════════ */
function Site({goAdmin}){
  const[mm,setMm]=useState(false);
  const[sc,setSc]=useState(false);
  const[showTop,setShowTop]=useState(false);
  useEffect(()=>{const f=()=>{setSc(window.scrollY>50);setShowTop(window.scrollY>400);};window.addEventListener("scroll",f,{passive:true});return()=>window.removeEventListener("scroll",f);},[]);
  const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setMm(false);};
  const nav=[["services","שירותים"],["process","התהליך"],["gallery","לפני ואחרי"],["reviews","ביקורות"],["faq","שאלות"],["contact","צור קשר"]];

return<div>

{/* ══════ HEADER — big logo ══════ */}
<header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,transition:"all .3s",background:"rgba(9,9,9,.85)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(200,164,78,.06)"}}>
<div className="mx" style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:90}}>
  <img src="/img/logo.png" alt="RESTORE" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
    style={{height:200,marginTop:50,cursor:"pointer",objectFit:"contain",animation:"glowPulse 4s ease-in-out infinite",filter:"drop-shadow(0 6px 20px rgba(0,0,0,.6))",position:"relative",zIndex:10,mixBlendMode:"screen"}}/>  <nav className="d-hide" style={{display:"flex",alignItems:"center",gap:24}}>
    {nav.map(([id,l])=><span key={id} onClick={()=>go(id)} style={{color:"rgba(255,255,255,.4)",fontSize:14,cursor:"pointer",fontFamily:"'Heebo'",fontWeight:500,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="#C8A44E"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.4)"}>{l}</span>)}
    <a href={WA} target="_blank" rel="noopener" className="btn btn-g" style={{padding:"10px 20px",fontSize:14}}>💬 וואטסאפ</a>
  </nav>
  <button className="m-show" onClick={()=>setMm(true)} style={{display:"none",background:"none",border:"none",color:"#C8A44E",fontSize:28,cursor:"pointer"}}>☰</button>
</div></header>

{/* Mobile Nav */}
{mm&&<><div onClick={()=>setMm(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:200}}/><div style={{position:"fixed",top:0,right:0,bottom:0,width:"min(280px,80vw)",background:"#0c0c0c",zIndex:201,padding:20,display:"flex",flexDirection:"column",animation:"slideR .25s ease",borderLeft:"1px solid rgba(200,164,78,.08)"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><img src="/img/logo.png" style={{height:48}} alt=""/><button onClick={()=>setMm(false)} style={{background:"none",border:"none",color:"#C8A44E",fontSize:22,cursor:"pointer"}}>✕</button></div>
  {nav.map(([id,l])=><span key={id} onClick={()=>go(id)} style={{color:"rgba(255,255,255,.45)",fontSize:17,padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,.03)",cursor:"pointer",fontFamily:"'Heebo'",fontWeight:500}}>{l}</span>)}
  <a href={WA} target="_blank" rel="noopener" className="btn btn-g" style={{marginTop:16,justifyContent:"center"}}>💬 שלחו וואטסאפ</a>
</div></>}

{/* ══════ HERO — lion as background ══════ */}
<section style={{minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden",padding:"100px 0 50px"}}>
  {/* Lion sofa as full background */}
  <div style={{position:"absolute",inset:0,backgroundImage:"url(/img/hero-sofa.png)",backgroundSize:"cover",backgroundPosition:"center 25%",opacity:.65}}/>
  {/* Dark gradient overlay - lighter on left so lion shows */}
  <div style={{position:"absolute",inset:0,background:"linear-gradient(to left, rgba(9,9,9,.15), rgba(9,9,9,.75) 55%)"}}/>
  {/* Gold glow */}
  <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 60% 50%,rgba(200,164,78,.05),transparent 60%)"}}/>

  <div className="mx" style={{position:"relative",zIndex:2,width:"100%"}}>
    <div className="m-center" style={{maxWidth:540}}>
      <div style={{display:"inline-block",padding:"7px 16px",borderRadius:10,background:"rgba(200,164,78,.08)",border:"1px solid rgba(200,164,78,.1)",color:"#C8A44E",fontSize:13,fontFamily:"'Heebo'",fontWeight:600,marginBottom:16,animation:"fadeUp .6s ease .1s both"}}>
        🔥 מחירי השקה — זמינות מוגבלת
      </div>
      <h1 style={{fontSize:"clamp(34px,6.5vw,54px)",lineHeight:1.08,color:"#fff",marginBottom:16,animation:"fadeUp .6s ease .2s both"}}>
        אנחנו לא מנקים<br/><span style={{color:"#C8A44E"}}>אנחנו משחזרים</span>
      </h1>
      <p style={{fontSize:16,color:"rgba(255,255,255,.5)",lineHeight:1.8,maxWidth:420,marginBottom:24,animation:"fadeUp .6s ease .35s both"}}>
        שחזור מקצועי לספות, מזרנים, שטיחים, מזגנים ורכבים.<br/>ציוד תעשייתי · חומרים בטוחים · תוצאות מובטחות
      </p>
      <div style={{display:"inline-flex",alignItems:"center",gap:12,padding:"12px 20px",borderRadius:14,background:"rgba(200,164,78,.06)",border:"1px solid rgba(200,164,78,.08)",marginBottom:24,animation:"fadeUp .6s ease .45s both"}}>
        <span style={{fontFamily:"'Heebo'",fontSize:32,fontWeight:900,color:"#C8A44E"}}>₪250</span>
        <span style={{fontSize:13,color:"rgba(255,255,255,.3)",lineHeight:1.3}}>לניקוי ספה<br/>כולל חיטוי ובישום</span>
      </div>
      <div className="m-stack" style={{display:"flex",gap:10,animation:"fadeUp .6s ease .55s both"}}>
        <a href={WA} target="_blank" rel="noopener" className="btn btn-g m-full" style={{fontSize:16,padding:"16px 32px"}}>💬 הזמינו בוואטסאפ</a>
        <a href={`tel:${PH.replace(/-/g,"")}`} className="btn btn-o m-full" style={{fontSize:16,padding:"16px 32px"}}>📞 {PH}</a>
      </div>
    </div>
  </div>
</section>

{/* ══════ STATS ══════ */}
<div className="gold-line"/>
<div style={{background:"rgba(14,26,43,.5)",padding:"28px 0"}}><div className="mx"><div className="m-col2" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,textAlign:"center"}}>
  {[["3000","+","לקוחות מרוצים"],["100","%","שביעות רצון"],["250","₪","ניקוי ספה מ-"],["7","","ימים בשבוע"]].map(([n,s,l],i)=><div key={i}>
    <div style={{fontFamily:"'Heebo'",fontSize:28,fontWeight:900,color:"#C8A44E"}}><Num to={+n} sfx={s}/></div>
    <div style={{fontSize:12,color:"rgba(255,255,255,.25)",marginTop:4}}>{l}</div>
  </div>)}
</div></div></div>
<div className="gold-line"/>

{/* Marquee */}
<div style={{padding:"12px 0",overflow:"hidden",background:"rgba(0,0,0,.3)"}}><div style={{display:"flex",gap:40,whiteSpace:"nowrap",animation:"marquee 25s linear infinite",width:"max-content"}}>
  {Array(4).fill(["✔ חומרים בטוחים לילדים","✔ חיטוי בקיטור","✔ אחריות על כל עבודה","✔ פריסה ארצית","✔ ייבוש מהיר","✔ מחירים שקופים"]).flat().map((t,i)=><span key={i} style={{fontSize:12,color:"rgba(255,255,255,.18)",fontFamily:"'Heebo'",fontWeight:500}}>{t}</span>)}
</div></div>

{/* ══════ PROBLEM → SOLUTION ══════ */}
<section className="sec" style={{position:"relative",overflow:"hidden",backgroundImage:"linear-gradient(rgba(9,9,9,.5),rgba(9,9,9,.5)),url(/img/lion-ac.png)",backgroundSize:"cover",backgroundPosition:"center 30%"}}>
  <div className="mx" style={{position:"relative",zIndex:1}}>
    <Fade><SectionTitle sub="הספה מסריחה. המזרן מלא כתמים. המזגן פולט אבק. מוכר?">הבעיה שכולם מכירים</SectionTitle></Fade>
    <div className="m-col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:48}}>
      {[["🤢","ריחות רעים","עובש, זיעה ואוכל ישן שנספגו עמוק בסיבים"],["🦠","חיידקים ואלרגנים","קרדית אבק וזיהומים שמסכנים את בריאות המשפחה"],["💧","כתמים עיקשים","קפה, שתן, שומן — שום חומר ביתי לא יעזור"]].map(([ic,t,d],i)=>
        <Fade key={i} d={i*.07}><div className="crd" style={{padding:"28px 22px",textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:12}}>{ic}</div>
          <h3 style={{fontSize:17,fontWeight:700,marginBottom:8,color:"#fff"}}>{t}</h3>
          <p style={{fontSize:14,color:"rgba(255,255,255,.3)",lineHeight:1.7}}>{d}</p>
        </div></Fade>)}
    </div>
    <Fade d={.25}><div style={{textAlign:"center"}}>
      <h3 style={{fontSize:"clamp(22px,4vw,32px)",color:"#fff",marginBottom:12}}>הפתרון? <span style={{color:"#C8A44E"}}>RESTORE</span></h3>
      <p style={{color:"rgba(255,255,255,.3)",maxWidth:420,margin:"0 auto 24px"}}>אנחנו לא סתם מנקים — אנחנו משחזרים. מחזירים הכל למצב של חדש.</p>
      <a href={WA} target="_blank" rel="noopener" className="btn btn-a">💬 בואו נשחזר</a>
    </div></Fade>
  </div>
</section>

{/* ══════ SERVICES ══════ */}
<section className="sec" id="services" style={{background:"rgba(14,26,43,.25)",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",inset:0,backgroundImage:"url(/img/lion-van.png)",backgroundSize:"cover",backgroundPosition:"center 30%",opacity:.6}}/>
  <div style={{position:"absolute",inset:0,background:"linear-gradient(rgba(9,9,9,.35),rgba(9,9,9,.3))"}}/>
  <div className="mx" style={{position:"relative",zIndex:1}}>
    <Fade><SectionTitle sub="פתרון מקצועי לכל סוג — ציוד תעשייתי וחומרים בטוחים">השירותים שלנו</SectionTitle></Fade>
    <div className="m-col2" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
      {SERVICES.map((s,i)=><Fade key={i} d={i*.05}><div className="crd" style={{padding:"26px 22px",cursor:"pointer",height:"100%",display:"flex",flexDirection:"column",borderRight:`3px solid ${s.accent}`}} onClick={()=>window.open(wm("היי, מעוניין/ת ב"+s.name),"_blank")}>
        <h3 style={{fontSize:17,fontWeight:700,color:"#fff",marginBottom:8}}>{s.name}</h3>
        <p style={{fontSize:13.5,color:"rgba(255,255,255,.3)",lineHeight:1.7,marginBottom:"auto",paddingBottom:14}}>{s.desc}</p>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,borderTop:"1px solid rgba(200,164,78,.06)"}}>
          <span style={{fontFamily:"'Heebo'",fontSize:22,fontWeight:900,color:s.accent}}>₪{s.price}</span>
          <span style={{fontSize:12,color:"rgba(255,255,255,.2)",fontFamily:"'Heebo'",fontWeight:600}}>הזמינו ←</span>
        </div>
      </div></Fade>)}
    </div>
  </div>
</section>

{/* ══════ PROCESS — Like Krishim ══════ */}
<section className="sec" id="process" style={{position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",inset:0,backgroundImage:"url(/img/lion-inspect.png)",backgroundSize:"cover",backgroundPosition:"center 20%",opacity:.55}}/>
  <div style={{position:"absolute",inset:0,background:"linear-gradient(rgba(9,9,9,.35),rgba(9,9,9,.3))"}}/>
  <div className="mx" style={{position:"relative",zIndex:1}}>
    <Fade><SectionTitle sub="4 שלבים מהשיחה הראשונה ועד לספה כמו חדשה">מה הספה שלכם עוברת?</SectionTitle></Fade>
    <div style={{display:"grid",gridTemplateColumns:"1fr",gap:0,maxWidth:680,margin:"0 auto"}}>
      {PROCESS.map((p,i)=><Fade key={i} d={i*.1}>
        <div style={{display:"flex",gap:20,padding:"28px 0",borderBottom:i<3?"1px solid rgba(200,164,78,.06)":"none",position:"relative"}}>
          {/* Step number */}
          <div style={{flex:"0 0 64px",height:64,borderRadius:16,background:"rgba(200,164,78,.06)",border:"1px solid rgba(200,164,78,.1)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:24}}>{p.icon}</span>
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontFamily:"'Heebo'",fontSize:12,fontWeight:800,color:"#C8A44E",letterSpacing:1}}>שלב {p.step}</span>
            </div>
            <h3 style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:6}}>{p.title}</h3>
            <p style={{fontSize:14,color:"rgba(255,255,255,.35)",lineHeight:1.75}}>{p.desc}</p>
          </div>
        </div>
      </Fade>)}
    </div>
    <Fade d={.4}><div style={{textAlign:"center",marginTop:36}}>
      <a href={WA} target="_blank" rel="noopener" className="btn btn-g" style={{fontSize:16,padding:"16px 36px"}}>💬 שלחו תמונה — קבלו הצעה תוך דקות</a>
    </div></Fade>
  </div>
</section>

{/* ══════ CTA — Lion office as background ══════ */}
<section style={{padding:"80px 0",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",inset:0,backgroundImage:"url(/img/lion-office.png)",backgroundSize:"cover",backgroundPosition:"center 25%",opacity:.6}}/>
  <div style={{position:"absolute",inset:0,background:"linear-gradient(to left, rgba(9,9,9,.1), rgba(9,9,9,.55) 55%)"}}/>
  <div className="mx" style={{position:"relative",zIndex:2}}>
    <div className="m-center" style={{maxWidth:480}}>
      <Fade><h2 style={{fontSize:"clamp(22px,4vw,30px)",color:"#fff",marginBottom:10}}>רוצים הצעת מחיר?<br/><span style={{color:"#C8A44E"}}>האריה מחכה לשיחה 🦁</span></h2></Fade>
      <Fade d={.1}><p style={{color:"rgba(255,255,255,.4)",fontSize:14.5,marginBottom:24,lineHeight:1.75}}>שלחו תמונה — תקבלו הצעה מדויקת תוך דקות. בלי התחייבות.</p></Fade>
      <Fade d={.2}><div className="m-stack" style={{display:"flex",gap:10}}>
        <a href={WA} target="_blank" rel="noopener" className="btn btn-g m-full">💬 שלחו תמונה</a>
        <a href={`tel:${PH.replace(/-/g,"")}`} className="btn btn-a m-full">📞 חייגו</a>
      </div></Fade>
    </div>
  </div>
</section>
<section className="sec" id="gallery">
  <div className="mx">
    <Fade><SectionTitle>לפני ואחרי</SectionTitle></Fade>
    <div className="m-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      {[["ניקוי ספת בד","#6b5544","#c9b99a","3 שנים של כתמים → נעלמו"],["ניקוי ריפודי רכב","#484848","#aaa","רכב מוזנח → כמו מהסלון"],["ניקוי שטיח","#5c4e3f","#b8a990","שטיח לזריקה → ניצל"],["ניקוי מזרן","#7a6e5e","#ddd0c0","כתמים + ריח → נעלמו"]].map(([t,bc,ac,d],i)=>
        <Fade key={i} d={i*.06}><div className="crd" style={{overflow:"hidden"}}>
          <div style={{display:"flex",height:160}}>
            <div style={{flex:1,background:`linear-gradient(135deg,${bc},${bc}cc)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}><span style={{fontSize:32,opacity:.08}}>✕</span><span style={{position:"absolute",bottom:8,right:8,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,.5)",color:"#fff",fontSize:10,fontFamily:"'Heebo'",fontWeight:700}}>לפני</span></div>
            <div style={{width:2,background:"rgba(200,164,78,.2)"}}/>
            <div style={{flex:1,background:`linear-gradient(135deg,${ac},${ac}dd)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}><span style={{fontSize:32,opacity:.08}}>✓</span><span style={{position:"absolute",bottom:8,left:8,padding:"4px 10px",borderRadius:8,background:"#C8A44E",color:"#0E1A2B",fontSize:10,fontFamily:"'Heebo'",fontWeight:700}}>אחרי</span></div>
          </div>
          <div style={{padding:"14px 18px"}}><h4 style={{fontSize:14,color:"#fff",marginBottom:2}}>{t}</h4><p style={{fontSize:12,color:"rgba(255,255,255,.25)"}}>{d}</p></div>
        </div></Fade>)}
    </div>
  </div>
</section>

{/* ══════ REVIEWS ══════ */}
<section className="sec" id="reviews" style={{background:"rgba(14,26,43,.25)"}}>
  <div className="mx">
    <Fade><SectionTitle>מה הלקוחות אומרים</SectionTitle></Fade>
    <div className="m-col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
      {REVIEWS.map((r,i)=><Fade key={i} d={i*.05}><div className="crd" style={{padding:"24px 20px",height:"100%",display:"flex",flexDirection:"column"}}>
        <div style={{color:"#C8A44E",fontSize:12,letterSpacing:2,marginBottom:10}}>★★★★★</div>
        <p style={{fontSize:14,lineHeight:1.85,color:"rgba(255,255,255,.5)",marginBottom:"auto",paddingBottom:14}}>״{r.t}״</p>
        <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:12,borderTop:"1px solid rgba(200,164,78,.06)"}}>
          <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#C8A44E,#9A7B30)",display:"flex",alignItems:"center",justifyContent:"center",color:"#0E1A2B",fontFamily:"'Heebo'",fontWeight:800,fontSize:14}}>{r.n[0]}</div>
          <div><div style={{fontSize:13,fontFamily:"'Heebo'",fontWeight:700,color:"#fff"}}>{r.n}</div><div style={{fontSize:11,color:"rgba(255,255,255,.2)"}}>{r.s}</div></div>
        </div>
      </div></Fade>)}
    </div>
  </div>
</section>

{/* ══════ FAQ ══════ */}
<section className="sec" id="faq"><div className="mx" style={{maxWidth:680}}>
  <Fade><SectionTitle>שאלות נפוצות</SectionTitle></Fade>
  {[["כמה זמן לוקח ניקוי ספה?","30-60 דקות. ייבוש: 4-6 שעות בהתאם לסוג הבד ולאוורור."],["האם החומרים בטוחים?","בהחלט — חומרים היפואלרגניים, בטוחים לילדים, תינוקות וחיות מחמד."],["מנקים כל סוגי ספות?","כן — בד, עור, אימפלה, קטיפה, דמוי עור, זוהרית ועוד."],["מה אם הכתם לא יורד?","מתחייבים לתוצאה מקסימלית. תמיד מעדכנים מראש."],["כמה עולה ניקוי ספה?","מ-250₪. שלחו תמונה בוואטסאפ לקבלת הצעה מדויקת."],["לאן מגיעים?","פריסה ארצית — גוש דן, שרון, שפלה, ירושלים, באר שבע ועוד."]].map(([q,a],i)=><Fade key={i} d={i*.04}><FaqItem q={q} a={a}/></Fade>)}
</div></section>

{/* ══════ AREAS ══════ */}
<section className="sec" id="areas" style={{background:"rgba(14,26,43,.25)"}}><div className="mx">
  <Fade><SectionTitle>🚐 פריסה ארצית</SectionTitle></Fade>
  <Fade d={.08}><div className="crd" style={{padding:"32px 36px",textAlign:"center"}}>
    <p style={{fontSize:15,lineHeight:2.3,color:"rgba(255,255,255,.35)",fontFamily:"'Heebo'",fontWeight:500}}>{AREAS}</p>
    <a href={WA} target="_blank" rel="noopener" className="btn btn-g" style={{marginTop:20}}>💬 בדקו אם מגיעים אליכם</a>
  </div></Fade>
</div></section>

{/* ══════ FINAL CTA ══════ */}
<section className="sec" style={{textAlign:"center",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(200,164,78,.04),transparent)"}}/>
  <div className="mx" style={{position:"relative",zIndex:1}}>
    <Fade><img src="/img/logo.png" alt="RESTORE" style={{height:150,objectFit:"contain",margin:"0 auto 24px",animation:"glowPulse 3s ease-in-out infinite",mixBlendMode:"screen"}}/></Fade>
    <Fade d={.1}><h2 style={{fontSize:"clamp(24px,5vw,36px)",color:"#fff",marginBottom:10}}>הבית שלך צריך <span style={{color:"#C8A44E"}}>RESTORE</span></h2></Fade>
    <Fade d={.2}><p style={{color:"rgba(255,255,255,.3)",fontSize:15,marginBottom:28}}>שחזור, לא ניקיון.</p></Fade>
    <Fade d={.3}><div className="m-stack" style={{display:"flex",gap:10,justifyContent:"center"}}>
      <a href={WA} target="_blank" rel="noopener" className="btn btn-g m-full" style={{fontSize:17,padding:"18px 36px"}}>💬 הזמינו עכשיו</a>
      <a href={`tel:${PH.replace(/-/g,"")}`} className="btn btn-o m-full" style={{fontSize:17,padding:"18px 36px"}}>📞 {PH}</a>
    </div></Fade>
  </div>
</section>

{/* ══════ CONTACT ══════ */}
<section className="sec" id="contact" style={{background:"rgba(14,26,43,.25)"}}><div className="mx">
  <Fade><SectionTitle>השאירו פרטים</SectionTitle></Fade>
  <Fade d={.1}><LeadForm/></Fade>
</div></section>

{/* ══════ FOOTER ══════ */}
<footer style={{background:"rgba(0,0,0,.4)",padding:"48px 0 16px",borderTop:"1px solid rgba(200,164,78,.05)"}}><div className="mx">
  <div className="m-col" style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",gap:28,marginBottom:32}}>
    <div><img src="/img/logo.png" alt="" style={{height:52,marginBottom:14,mixBlendMode:"screen"}}/><p style={{fontSize:13,color:"rgba(255,255,255,.15)",lineHeight:1.8}}>שחזור מקצועי — ספות, שטיחים, מזרנים, רכבים, מזגנים. אחריות מלאה.</p></div>
    <div><h4 style={{color:"#C8A44E",fontSize:12,marginBottom:12}}>שירותים</h4>{SERVICES.map((s,i)=><div key={i} style={{fontSize:12,color:"rgba(255,255,255,.15)",marginBottom:5,cursor:"pointer"}} onClick={()=>go("services")}>{s.name}</div>)}</div>
    <div><h4 style={{color:"#C8A44E",fontSize:12,marginBottom:12}}>ניווט</h4>{nav.map(([id,l])=><div key={id} style={{fontSize:12,color:"rgba(255,255,255,.15)",marginBottom:5,cursor:"pointer"}} onClick={()=>go(id)}>{l}</div>)}</div>
    <div><h4 style={{color:"#C8A44E",fontSize:12,marginBottom:12}}>צור קשר</h4><a href={`tel:${PH.replace(/-/g,"")}`} style={{display:"block",fontSize:12,color:"rgba(255,255,255,.15)",marginBottom:5}}>📞 {PH}</a><a href={WA} target="_blank" rel="noopener" style={{display:"block",fontSize:12,color:"rgba(255,255,255,.15)",marginBottom:10}}>💬 וואטסאפ</a><div style={{fontSize:10,color:"rgba(255,255,255,.08)"}}>א׳-ה׳ 8:00-21:00 | ו׳ 8:00-14:00</div></div>
  </div>
  <div style={{borderTop:"1px solid rgba(255,255,255,.03)",paddingTop:12,display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,.08)"}}><span>© 2026 RESTORE — שחזור, לא ניקיון</span><span onClick={goAdmin} style={{cursor:"pointer"}}>ניהול</span></div>
</div></footer>

{/* Floating */}
<a href={WA} target="_blank" rel="noopener" style={{position:"fixed",bottom:20,left:20,zIndex:999,width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#25D366,#1DA851)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#fff",boxShadow:"0 4px 16px rgba(37,211,102,.3)",animation:"floatY 3s ease-in-out infinite"}}>💬</a>
{showTop&&<button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{position:"fixed",bottom:20,right:20,zIndex:999,width:40,height:40,borderRadius:10,background:"rgba(200,164,78,.08)",border:"1px solid rgba(200,164,78,.1)",color:"#C8A44E",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>}
<div className="m-show" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:90,background:"rgba(9,9,9,.95)",backdropFilter:"blur(14px)",padding:"8px 12px",display:"none",gap:8,borderTop:"1px solid rgba(200,164,78,.06)"}}>
  <a href={WA} target="_blank" rel="noopener" className="btn btn-g" style={{flex:1,padding:"12px 6px",fontSize:14}}>💬 וואטסאפ</a>
  <a href={`tel:${PH.replace(/-/g,"")}`} className="btn btn-a" style={{flex:1,padding:"12px 6px",fontSize:14}}>📞 חייגו</a>
</div>
</div>;}

/* ═══ COMPONENTS ═══ */
function FaqItem({q,a}){const[o,s]=useState(false);return<div className="crd" style={{marginBottom:8,borderColor:o?"rgba(200,164,78,.12)":"rgba(200,164,78,.04)"}}><div onClick={()=>s(!o)} style={{padding:"18px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15,fontFamily:"'Heebo'",fontWeight:600}}>{q}</span><span style={{color:"#C8A44E",fontSize:12,transition:"transform .25s",transform:o?"rotate(180deg)":""}}>▼</span></div>{o&&<div style={{padding:"0 20px 18px",fontSize:14,color:"rgba(255,255,255,.35)",lineHeight:1.8}}>{a}</div>}</div>;}

function LeadForm(){
  const[f,setF]=useState({name:"",phone:"",service:""});
  const[sent,setSent]=useState(false);
  const inp={width:"100%",padding:"14px 16px",borderRadius:12,border:"1px solid rgba(200,164,78,.08)",fontSize:14,fontFamily:"'Assistant'",background:"rgba(255,255,255,.02)",color:"#fff",direction:"rtl",outline:"none",transition:"border-color .2s"};
  const submit=()=>{const l=gL();l.push({...f,id:"l"+Date.now(),date:new Date().toISOString(),status:"new"});sL(l);setSent(true);setTimeout(()=>{setSent(false);setF({name:"",phone:"",service:""});},5000);};
  if(sent)return<div style={{maxWidth:480,margin:"0 auto",textAlign:"center",padding:40}}><div style={{fontSize:40,marginBottom:12}}>✅</div><h3 style={{fontSize:20,color:"#fff",marginBottom:6}}>הפרטים נשלחו!</h3><p style={{color:"rgba(255,255,255,.3)",marginBottom:18}}>ניצור קשר בהקדם</p><a href={WA} target="_blank" rel="noopener" className="btn btn-g">💬 או שלחו הודעה</a></div>;
  return<form onSubmit={e=>{e.preventDefault();if(f.name&&f.phone)submit();}} style={{maxWidth:480,margin:"0 auto",background:"rgba(255,255,255,.015)",borderRadius:20,padding:"36px 28px",border:"1px solid rgba(200,164,78,.05)",textAlign:"right"}}>
    {[["שם מלא","text","name","הכנסו שם מלא"],["טלפון","tel","phone","050-000-0000"]].map(([l,t,k,p])=><div key={k} style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontFamily:"'Heebo'",fontWeight:600,color:"rgba(255,255,255,.3)",marginBottom:5}}>{l} *</label><input type={t} style={inp} value={f[k]} placeholder={p} required onChange={e=>setF(x=>({...x,[k]:e.target.value}))} onFocus={e=>e.target.style.borderColor="#C8A44E"} onBlur={e=>e.target.style.borderColor="rgba(200,164,78,.08)"}/></div>)}
    <div style={{marginBottom:18}}><label style={{display:"block",fontSize:12,fontFamily:"'Heebo'",fontWeight:600,color:"rgba(255,255,255,.3)",marginBottom:5}}>שירות</label><select style={{...inp,appearance:"none"}} value={f.service} onChange={e=>setF(x=>({...x,service:e.target.value}))}><option value="" style={{background:"#111"}}>בחר שירות</option>{SERVICES.map((s,i)=><option key={i} value={s.name} style={{background:"#111"}}>{s.name} — ₪{s.price}</option>)}</select></div>
    <button type="submit" className="btn btn-a" style={{width:"100%",fontSize:16,padding:"16px 0"}}>שלחו פרטים ←</button>
    <p style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,.1)",marginTop:10}}>🔒 הפרטים מאובטחים ולא יועברו לצד שלישי</p>
  </form>;
}

/* ═══ LOGIN ═══ */
function Login({ok,back}){const[p,setP]=useState("");const[e,setE]=useState(false);return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#090909"}}><div style={{background:"rgba(255,255,255,.02)",borderRadius:20,padding:40,width:360,maxWidth:"90vw",textAlign:"center",border:"1px solid rgba(200,164,78,.06)"}}><img src="/img/logo.png" alt="" style={{height:60,margin:"0 auto 20px",objectFit:"contain"}}/><h2 style={{fontSize:20,color:"#fff",marginBottom:20}}>כניסת מנהל</h2><input type="password" style={{width:"100%",padding:"13px 18px",borderRadius:12,border:"1px solid rgba(200,164,78,.08)",fontSize:15,textAlign:"center",fontFamily:"'Assistant'",background:"rgba(255,255,255,.02)",color:"#fff",outline:"none",marginBottom:12}} value={p} onChange={x=>{setP(x.target.value);setE(false);}} placeholder="סיסמה" onKeyDown={x=>{if(x.key==="Enter"){p===PASS?ok():setE(true);}}}/>{e&&<p style={{color:"#F87171",fontSize:13,marginBottom:10}}>סיסמה שגויה</p>}<button onClick={()=>p===PASS?ok():setE(true)} className="btn btn-a" style={{width:"100%",marginBottom:10}}>כניסה</button><button onClick={back} style={{background:"none",border:"none",color:"rgba(255,255,255,.2)",cursor:"pointer",fontSize:13}}>← חזרה</button></div></div>;}

/* ═══ ADMIN ═══ */
function Admin({back}){
  const[tab,setTab]=useState("leads");
  const[leads,setLeads]=useState(gL());
  const[toast,setToast]=useState("");
  const show=m=>{setToast(m);setTimeout(()=>setToast(""),2500);};
  const del=id=>{const u=leads.filter(l=>l.id!==id);setLeads(u);sL(u);show("נמחק");};
  const upSt=(id,s)=>{const u=leads.map(l=>l.id===id?{...l,status:s}:l);setLeads(u);sL(u);};
  
  const crd={background:"rgba(255,255,255,.025)",border:"1px solid rgba(200,164,78,.06)",borderRadius:16,padding:18,marginBottom:8};
  const inp2={width:"100%",padding:"12px 14px",borderRadius:10,border:"1px solid rgba(200,164,78,.08)",fontSize:14,fontFamily:"'Assistant'",background:"rgba(255,255,255,.02)",color:"#fff",direction:"rtl",outline:"none"};

return<div style={{minHeight:"100vh",background:"#090909",direction:"rtl"}}>
  {toast&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:10000,background:"#059669",color:"#fff",padding:"10px 24px",borderRadius:12,fontSize:13,fontFamily:"'Heebo'",fontWeight:600}}>{toast}</div>}
  
  {/* Header */}
  <div style={{background:"rgba(14,26,43,.6)",borderBottom:"1px solid rgba(200,164,78,.06)",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}><img src="/img/logo.png" style={{height:36}} alt=""/><span style={{fontFamily:"'Heebo'",fontSize:14,fontWeight:800,color:"#C8A44E"}}>פאנל ניהול</span></div>
    <button onClick={back} style={{background:"none",border:"1px solid rgba(255,255,255,.06)",borderRadius:10,padding:"7px 14px",color:"rgba(255,255,255,.35)",cursor:"pointer",fontSize:12,fontFamily:"'Heebo'"}}>← חזרה לאתר</button>
  </div>

  {/* Tabs */}
  <div style={{display:"flex",gap:4,padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,.03)"}}>
    {[["leads","📋 לידים ("+leads.length+")"],["settings","⚙️ הגדרות אתר"],["info","ℹ️ מידע"]].map(([id,l])=>
      <button key={id} onClick={()=>setTab(id)} style={{padding:"10px 18px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontFamily:"'Heebo'",fontWeight:600,background:tab===id?"rgba(200,164,78,.1)":"transparent",color:tab===id?"#C8A44E":"rgba(255,255,255,.3)",transition:"all .2s"}}>{l}</button>
    )}
  </div>

  <div style={{maxWidth:820,margin:"0 auto",padding:20}}>

    {/* ── LEADS TAB ── */}
    {tab==="leads"&&<div>
      <h2 style={{fontSize:20,color:"#fff",marginBottom:16,fontFamily:"'Heebo'"}}>📋 לידים</h2>
      {leads.length===0?<div style={crd}><p style={{textAlign:"center",color:"rgba(255,255,255,.2)",padding:20}}>אין לידים עדיין — ברגע שמישהו ישאיר פרטים באתר, הם יופיעו כאן</p></div>
      :[...leads].reverse().map(l=><div key={l.id} style={crd}>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontSize:16,fontFamily:"'Heebo'",fontWeight:700,color:"#fff",marginBottom:2}}>{l.name}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.3)",direction:"ltr",textAlign:"right"}}>{l.phone}</div>
            {l.service&&<div style={{fontSize:12,color:"#C8A44E",marginTop:2}}>{l.service}</div>}
            <div style={{fontSize:11,color:"rgba(255,255,255,.12)",marginTop:2}}>{new Date(l.date).toLocaleDateString("he-IL")} {new Date(l.date).toLocaleTimeString("he-IL",{hour:"2-digit",minute:"2-digit"})}</div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <select value={l.status} onChange={e=>upSt(l.id,e.target.value)} style={{padding:"5px 8px",borderRadius:8,border:"1px solid rgba(200,164,78,.06)",fontSize:12,fontFamily:"'Heebo'",background:"rgba(255,255,255,.02)",color:"#fff"}}>
              <option value="new" style={{background:"#111"}}>🆕 חדש</option>
              <option value="called" style={{background:"#111"}}>📞 נוצר קשר</option>
              <option value="done" style={{background:"#111"}}>✅ הושלם</option>
            </select>
            <a href={`https://wa.me/972${l.phone.replace(/^0/,"").replace(/-/g,"")}`} target="_blank" rel="noopener" style={{padding:"5px 10px",borderRadius:8,background:"#25D366",color:"#fff",fontSize:11,fontFamily:"'Heebo'",fontWeight:700}}>💬</a>
            <a href={`tel:${l.phone}`} style={{padding:"5px 10px",borderRadius:8,background:"rgba(255,255,255,.04)",color:"#fff",fontSize:11}}>📞</a>
            <button onClick={()=>del(l.id)} style={{padding:"5px 10px",borderRadius:8,background:"rgba(248,113,113,.06)",border:"none",color:"#F87171",fontSize:11,cursor:"pointer"}}>🗑</button>
          </div>
        </div>
      </div>)}
      {leads.length>0&&<button onClick={()=>{if(confirm("למחוק את כל הלידים?")){sL([]);setLeads([]);show("כל הלידים נמחקו");}}} style={{marginTop:12,padding:"8px 16px",borderRadius:8,background:"rgba(248,113,113,.06)",border:"none",color:"#F87171",fontSize:12,cursor:"pointer",fontFamily:"'Heebo'"}}>🗑 מחק את כל הלידים</button>}
    </div>}

    {/* ── SETTINGS TAB ── */}
    {tab==="settings"&&<div>
      <h2 style={{fontSize:20,color:"#fff",marginBottom:16,fontFamily:"'Heebo'"}}>⚙️ הגדרות האתר</h2>
      <div style={{...crd,padding:24}}>
        <p style={{color:"rgba(255,255,255,.4)",fontSize:14,lineHeight:2,marginBottom:16}}>
          כדי לעדכן את האתר, צריך לערוך את הקובץ <code style={{background:"rgba(200,164,78,.1)",padding:"2px 8px",borderRadius:6,color:"#C8A44E",fontSize:13}}>src/App.jsx</code> ולדחוף ל-GitHub.
        </p>
        <h4 style={{color:"#C8A44E",fontSize:14,marginBottom:12}}>📞 פרטי קשר (שורה 3-4 בקובץ)</h4>
        <div style={{background:"rgba(0,0,0,.3)",borderRadius:10,padding:14,marginBottom:20,fontFamily:"monospace",fontSize:13,color:"rgba(255,255,255,.5)",direction:"ltr",textAlign:"left"}}>
          const PH = "{PH}";<br/>
          const WA = "https://wa.me/972XXXXXXXXX";
        </div>
        
        <h4 style={{color:"#C8A44E",fontSize:14,marginBottom:12}}>💰 מחירי שירותים (שורה 10-17)</h4>
        {SERVICES.map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.03)"}}>
          <span style={{color:"rgba(255,255,255,.5)",fontSize:14}}>{s.name}</span>
          <span style={{color:"#C8A44E",fontFamily:"'Heebo'",fontWeight:700}}>₪{s.price}</span>
        </div>)}
        
        <h4 style={{color:"#C8A44E",fontSize:14,marginTop:20,marginBottom:12}}>🖼️ תמונות (בתיקיית public/img/)</h4>
        <div style={{fontSize:13,color:"rgba(255,255,255,.35)",lineHeight:2}}>
          <div><strong style={{color:"rgba(255,255,255,.5)"}}>logo.png</strong> — הלוגו (הדר, פוטר, CTA)</div>
          <div><strong style={{color:"rgba(255,255,255,.5)"}}>hero-sofa.png</strong> — רקע Hero + רקע אתר</div>
          <div><strong style={{color:"rgba(255,255,255,.5)"}}>lion-phone.png</strong> — סקשן CTA</div>
          <div><strong style={{color:"rgba(255,255,255,.5)"}}>lion-ac.png</strong> — סקשן בעיה→פתרון</div>
        </div>
        
        <h4 style={{color:"#C8A44E",fontSize:14,marginTop:20,marginBottom:12}}>🔄 איך לעדכן</h4>
        <div style={{background:"rgba(0,0,0,.3)",borderRadius:10,padding:14,fontFamily:"monospace",fontSize:12,color:"rgba(255,255,255,.4)",direction:"ltr",textAlign:"left",lineHeight:2}}>
          cd C:\Users\lielo\Desktop\restore-project<br/>
          git add .<br/>
          git commit -m "update"<br/>
          git push
        </div>
      </div>
    </div>}

    {/* ── INFO TAB ── */}
    {tab==="info"&&<div>
      <h2 style={{fontSize:20,color:"#fff",marginBottom:16,fontFamily:"'Heebo'"}}>ℹ️ מידע</h2>
      <div style={{...crd,padding:24}}>
        <div style={{fontSize:14,color:"rgba(255,255,255,.35)",lineHeight:2.2}}>
          <div><strong style={{color:"#C8A44E"}}>סיסמת ניהול:</strong> <span style={{color:"rgba(255,255,255,.5)"}}>{PASS}</span></div>
          <div><strong style={{color:"#C8A44E"}}>טלפון:</strong> <span style={{color:"rgba(255,255,255,.5)"}}>{PH}</span></div>
          <div><strong style={{color:"#C8A44E"}}>וואטסאפ:</strong> <span style={{color:"rgba(255,255,255,.5)"}}>{WA}</span></div>
          <div><strong style={{color:"#C8A44E"}}>אחסון:</strong> <span style={{color:"rgba(255,255,255,.5)"}}>Vercel (חינם)</span></div>
          <div><strong style={{color:"#C8A44E"}}>GitHub:</strong> <span style={{color:"rgba(255,255,255,.5)"}}>github.com/lielohana8-wq/restore-website</span></div>
        </div>
      </div>
    </div>}

  </div>
</div>;}
