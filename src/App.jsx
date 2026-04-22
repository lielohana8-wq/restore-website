import { useState, useEffect, useRef } from "react";

const PASS = "leo2024";
const NPOINT_ID = "";

const D = {
  phone: "053-938-4024", waNum: "972539384024",
  services: [
    { name:"ניקוי ספות", desc:"ניקוי מקצועי לכל סוגי הספות — בד, עור, אימפלה, קטיפה. הסרת כתמים עמוקים, ריחות וחיידקים. כולל חיטוי ובישום.", price:"280₪", accent:"#0B5ED7", icon:"🛋️" },
    { name:"ניקוי מזרן זוגי", desc:"חיטוי עמוק, הסרת קרדית אבק, כתמים ואלרגנים. צד אחד או שני צדדים.", price:"150/250₪", accent:"#6DC489", icon:"🛏️" },
    { name:"ניקוי מזרן יחיד", desc:"חיטוי מלא למזרן יחיד. הסרת כתמים, ריחות ואלרגנים. צד אחד או שניים.", price:"100/200₪", accent:"#82C8A0", icon:"🛏️" },
    { name:"ניקוי מזגן עילי", desc:"פירוק, ניקוי וחיטוי מזגן עילי. אוויר נקי ובריא, הפחתת ריחות וחיסכון בחשמל.", price:"170₪", accent:"#4ABDE0", icon:"❄️" },
    { name:"מזגן מיני מרכזי", desc:"ניקוי מערכת מיני מרכזי עד 10 יחידות פנימיות. כל יחידה נוספת 45₪.", price:"600₪", accent:"#3A9CC0", icon:"🌬️" },
    { name:"ניקוי רכב — 5 מושבים", desc:"שחזור מלא של פנים הרכב — ריפודים, תקרה, דשבורד, מושבים ותא מטען.", price:"250₪", accent:"#E07B5B", icon:"🚗" },
    { name:"ניקוי שטיחים", desc:"ניקוי עמוק לשטיחים מכל הסוגים. מחיר למ״ר — שטיחים קטנים וגדולים.", price:"40₪/מ״ר", accent:"#5BA0E0", icon:"🟫" },
    { name:"ניקוי כורסא", desc:"ניקוי וחיטוי כורסאות מכל הסוגים — בד, עור, קטיפה.", price:"70₪", accent:"#9B7ED8", icon:"💺" },
    { name:"ניקוי כיסא", desc:"כיסאות אוכל, משרדיים, גיימינג ובר.", price:"30₪", accent:"#D88ECF", icon:"🪑" },
    { name:"ניקוי ארובה", desc:"ניקוי ושטיפת ארובות מקצועי. שומן, פיח ולכלוך — הכל יורד.", price:"500₪", accent:"#B8860B", icon:"🔥" },
  ],
  reviews: [
    { n:"דנה כ׳", t:"הזמנתי ניקוי לספה של 3 מושבים — חזרה לצבע המקורי! הצוות מקצועי, אדיב ומהיר. ממליצה בחום.", s:"ניקוי ספות", stars:5 },
    { n:"יוסי מ׳", t:"ניקו לי את הרכב מבפנים ומבחוץ — ריח של חדש. כאילו קניתי אוטו חדש. אלופים!", s:"ניקוי רכבים", stars:5 },
    { n:"מיכל ש׳", t:"אחרי ניקוי המזרן הילדים ישנים הרבה יותר טוב. עשו גם חיטוי. ההבדל מורגש מהלילה הראשון.", s:"ניקוי מזרנים", stars:5 },
    { n:"אבי ר׳", t:"שטיח פרסי ענק שחשבנו לזרוק — חזר לחיים. הצבעים בוהקים כמו ביום שקנינו.", s:"ניקוי שטיחים", stars:5 },
    { n:"רונית ל׳", t:"ניקוי מזגן מיני מרכזי — 8 יחידות. מגיע בזמן, עובד נקי ומסודר. מחיר הוגן.", s:"מזגן מרכזי", stars:5 },
    { n:"עמית ב׳", t:"6 כיסאות אוכל + כורסא — הכל נראה חדש. מחיר מעולה ושירות 10/10.", s:"כיסאות", stars:5 },
  ],
  beforeAfter: [
    { title:"ספה בז' — שחזור מלא", desc:"שנים של כתמים ולכלוך → חזרה כמו חדשה", bc:"#6b5544", ac:"#c9b99a", imgBefore:"/img/ba/beige-sofa-before.jpg", imgAfter:"/img/ba/beige-sofa-after.jpg" },
    { title:"ספה כחולה — כמו חדשה", desc:"סימני שימוש כבדים → רעננה ונקייה", bc:"#3d4c66", ac:"#5b7296", imgBefore:"/img/ba/blue-sofa-before.jpg", imgAfter:"/img/ba/blue-sofa-after.jpg" },
    { title:"שזלונג חום — חידוש מקצועי", desc:"כתמי מים עמוקים → נקי לחלוטין", bc:"#4a3e30", ac:"#8a7560", imgBefore:"/img/ba/brown-sofa-before.jpg", imgAfter:"/img/ba/brown-sofa-after.jpg" },
    { title:"ספה זוגית — כמו מהחנות", desc:"כתמים וסימני שימוש → כמו חדשה", bc:"#3a3a40", ac:"#6a6a70", imgBefore:"/img/ba/gray-sofa2-before.jpg", imgAfter:"/img/ba/gray-sofa2-after.jpg" },
    { title:"ספה 3 מושבים — מראה מחודש", desc:"שנים של שימוש → מראה מחודש", bc:"#2e2e32", ac:"#5c5c62", imgBefore:"/img/ba/gray-sofa3-before.jpg", imgAfter:"/img/ba/gray-sofa3-after.jpg" },
  ],
  areas: "ירושלים · בית שמש · מעלה אדומים · מודיעין · תל אביב · רמת גן · גבעתיים · פתח תקווה · ראשון לציון · חולון · בת ים · רחובות · נס ציונה · רמלה · לוד · אשדוד · אשקלון · קריית גת · באר שבע · נתיבות · אופקים · דימונה · ערד · אילת",
};

const PROCESS = [
  { step:"01", title:"שלחו תמונה", desc:"צלמו את הפריט ושלחו בוואטסאפ. נאבחן סוג בד, כתמים ודרך טיפול — בחינם ובלי התחייבות.", icon:"📸" },
  { step:"02", title:"קבלו הצעה ותאמו", desc:"תוך דקות תקבלו מחיר מדויק. מתאים? נתאם הגעה ליום ושעה שנוח לכם — גם בערב ובשישי קצר.", icon:"💬" },
  { step:"03", title:"האריה מגיע ומנקה", desc:"מגיעים עם ציוד תעשייתי, מזריקים חומר מקצועי לעומק הסיבים, שואבים 95% מהלחות.", icon:"🦁" },
  { step:"04", title:"נהנים מחדש", desc:"חיטוי אנטיבקטריאלי + בישום. תוך 4-6 שעות הכל יבש, נקי ומריח מדהים.", icon:"✨" },
];

/* ─── Cloud ─── */
async function cloudLoad(id){if(!id)return null;try{const r=await fetch(`https://api.npoint.io/${id}`);if(r.ok){const d=await r.json();return d?.phone?d:null;}}catch(e){}return null;}
async function cloudSave(id,data){if(!id)return null;try{let r=await fetch(`https://api.npoint.io/${id}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});if(!r.ok)r=await fetch(`https://api.npoint.io/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});return r.ok?id:null;}catch(e){return null;}}
function compressImg(file,maxW=400){return new Promise(resolve=>{const reader=new FileReader();reader.onload=e=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas");const ratio=Math.min(maxW/img.width,maxW/img.height,1);c.width=img.width*ratio;c.height=img.height*ratio;c.getContext("2d").drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL("image/jpeg",.5));};img.src=e.target.result;};reader.readAsDataURL(file);});}
const gL=()=>{try{return JSON.parse(localStorage.getItem("r_leads")||"[]");}catch{return[];}};
const sL=v=>localStorage.setItem("r_leads",JSON.stringify(v));

/* ─── CSS ─── */
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=Assistant:wght@400;600;700;800&family=Rubik:wght@400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{font-family:'Assistant','Rubik',sans-serif;font-size:15px;color:#1a2b4a;direction:rtl;overflow-x:hidden;-webkit-font-smoothing:antialiased;background:#F5FAFF}
body::before{content:"";position:fixed;inset:0;background-image:url(/img/hero-sofa.jpg);background-size:cover;background-position:center;background-attachment:fixed;opacity:.28;z-index:-2;pointer-events:none}
body::after{content:"";position:fixed;inset:0;background:linear-gradient(180deg,rgba(234,244,255,.55),rgba(245,250,255,.75));z-index:-1;pointer-events:none}
::selection{background:#0B5ED7;color:#fff}img{max-width:100%;display:block}a{text-decoration:none;color:inherit}
h1,h2,h3,h4{font-family:'Heebo','Rubik',sans-serif;font-weight:800;letter-spacing:-.02em;color:#0B1E3F}
.mx{max-width:1180px;margin:0 auto;padding:0 20px}.sec{padding:90px 0;position:relative}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes glow{0%,100%{filter:drop-shadow(0 0 10px rgba(11,94,215,.25))}50%{filter:drop-shadow(0 0 28px rgba(11,94,215,.5))}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes slideR{from{transform:translateX(100%)}to{transform:translateX(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.5)}70%{box-shadow:0 0 0 18px rgba(37,211,102,0)}}
@keyframes pulseY{0%,100%{box-shadow:0 0 0 0 rgba(255,193,7,.55)}70%{box-shadow:0 0 0 16px rgba(255,193,7,0)}}
@keyframes countUp{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
@keyframes bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(2deg)}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:16px 32px;border-radius:16px;font-size:15px;font-weight:800;border:none;cursor:pointer;transition:all .25s;font-family:'Heebo','Rubik';letter-spacing:.2px}
.btn:hover{transform:translateY(-3px)}.btn:active{transform:translateY(0)}
.btn-g{background:linear-gradient(135deg,#25D366,#1DA851);color:#fff;box-shadow:0 8px 24px rgba(37,211,102,.35)}
.btn-g:hover{box-shadow:0 12px 30px rgba(37,211,102,.5)}
.btn-a{background:linear-gradient(135deg,#FFC107,#FFD54F);color:#1a2b4a;box-shadow:0 8px 24px rgba(255,193,7,.4)}
.btn-a:hover{box-shadow:0 12px 30px rgba(255,193,7,.55)}
.btn-p{background:linear-gradient(135deg,#0B5ED7,#2979FF);color:#fff;box-shadow:0 8px 24px rgba(11,94,215,.35)}
.btn-p:hover{box-shadow:0 12px 30px rgba(11,94,215,.5)}
.btn-o{background:#fff;border:2px solid #EAF4FF;color:#0B5ED7}.btn-o:hover{border-color:#0B5ED7;background:#EAF4FF}
.btn-d{background:#EAF4FF;color:#0B5ED7;font-size:13px;padding:9px 18px;border-radius:10px;font-weight:700;border:none;cursor:pointer}
.crd{background:rgba(255,255,255,.92);backdrop-filter:blur(10px);border:1px solid #E1ECFB;border-radius:22px;transition:all .35s;box-shadow:0 4px 20px rgba(11,94,215,.05)}
.crd:hover{border-color:#0B5ED7;box-shadow:0 16px 40px rgba(11,94,215,.15);transform:translateY(-5px)}
.crd-light{background:linear-gradient(135deg,rgba(255,255,255,.95),rgba(245,250,255,.92));backdrop-filter:blur(10px);border:1px solid #E1ECFB;border-radius:22px;transition:all .35s;box-shadow:0 4px 20px rgba(11,94,215,.06)}
.blue-line{height:2px;background:linear-gradient(90deg,transparent,#0B5ED7,transparent)}
.glow-border{box-shadow:0 0 0 1px #E1ECFB,0 20px 60px rgba(11,94,215,.1)}
.badge{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:50px;font-size:13px;font-family:'Heebo','Rubik';font-weight:700;background:rgba(234,244,255,.9);backdrop-filter:blur(10px);border:1px solid #C8DFFC;color:#0B5ED7}
.badge-y{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:50px;font-size:13px;font-family:'Heebo','Rubik';font-weight:700;background:#FFF7D6;border:1px solid #FFE69C;color:#B8860B}
.sec-light{background:linear-gradient(180deg,rgba(234,244,255,.55),rgba(234,244,255,.35) 50%,rgba(234,244,255,.55));backdrop-filter:blur(4px)}
.sec-white{background:rgba(255,255,255,.55);backdrop-filter:blur(8px)}
.hero-overlay{background:linear-gradient(135deg,rgba(234,244,255,.7) 0%,rgba(234,244,255,.5) 40%,rgba(255,255,255,.3) 100%)}
@media(max-width:800px){.d-hide{display:none!important}.m-show{display:flex!important}.m-col{grid-template-columns:1fr!important}.m-col2{grid-template-columns:1fr 1fr!important}.m-stack{flex-direction:column!important}.m-full{width:100%!important}.m-center{text-align:center!important}.sec{padding:56px 0}
body::before{background-attachment:scroll}}
`;

/* ─── Utils ─── */
function useV(t=.1){const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const e=r.current;if(!e)return;const o=new IntersectionObserver(([x])=>{if(x.isIntersecting){s(true);o.unobserve(e);}},{threshold:t});o.observe(e);return()=>o.disconnect();},[]);return[r,v];}
function F({children,d=0,s=""}){const[r,v]=useV();return<div ref={r} style={{opacity:v?1:0,transform:v?"none":"translateY(28px)",transition:`all .7s cubic-bezier(.22,1,.36,1) ${d}s`,...(s?{transitionProperty:"all"}:{})}}>{children}</div>;}
function Num({to,sfx=""}){const[v,s]=useState(0);const[r,vis]=useV();useEffect(()=>{if(!vis)return;const st=Date.now();const t=()=>{const p=Math.min((Date.now()-st)/1800,1);s(Math.round(to*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(t);};requestAnimationFrame(t);},[vis,to]);return<span ref={r} style={{animation:vis?"countUp .4s ease":"none"}}>{v.toLocaleString()}{sfx}</span>;}
const STit=({sub,children,light})=><div style={{textAlign:"center",marginBottom:56}}><h2 style={{fontSize:"clamp(30px,5vw,44px)",color:"#0B1E3F",marginBottom:sub?14:0,lineHeight:1.15,fontWeight:900}}>{children}</h2>{sub&&<p style={{color:"#5A6B88",fontSize:17,maxWidth:520,margin:"0 auto",lineHeight:1.7,fontWeight:500}}>{sub}</p>}</div>;

/* ═══ APP ═══ */
export default function App(){
  const[page,setPage]=useState("site");
  const[data,setData]=useState(D);
  const[loading,setLoading]=useState(true);
  useEffect(()=>{const id=NPOINT_ID||localStorage.getItem("r_npoint")||"";if(id){cloudLoad(id).then(d=>{if(d)setData({...D,...d});setLoading(false);});}else{setLoading(false);}},[]);
  if(loading)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#EAF4FF,#fff)"}}><style>{CSS}</style><div className="badge" style={{fontSize:16,padding:"14px 28px"}}>🦁 ליאו — טוען...</div></div>;
  return<div><style>{CSS}</style>
    {page==="site"&&<Site data={data} goAdmin={()=>setPage("login")}/>}
    {page==="login"&&<Login ok={()=>setPage("admin")} back={()=>setPage("site")}/>}
    {page==="admin"&&<Admin data={data} setData={setData} back={()=>setPage("site")}/>}
  </div>;
}

/* ═══════════ SITE ═══════════ */
function Site({data:X,goAdmin}){
  const wa=`https://wa.me/${X.waNum}`;const wm=t=>`${wa}?text=${encodeURIComponent(t)}`;
  const SV=X.services||D.services;const RV=X.reviews||D.reviews;const BA=X.beforeAfter||D.beforeAfter;
  const[mm,setMm]=useState(false);const[showTop,setShowTop]=useState(false);
  useEffect(()=>{const f=()=>setShowTop(window.scrollY>500);window.addEventListener("scroll",f,{passive:true});return()=>window.removeEventListener("scroll",f);},[]);
  const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setMm(false);};
  const nav=[["services","שירותים"],["process","התהליך"],["gallery","לפני ואחרי"],["reviews","ביקורות"],["faq","שאלות"],["contact","צור קשר"]];

return<div>

{/* ═══ HEADER ═══ */}
<header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(255,255,255,.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid #E1ECFB",boxShadow:"0 2px 20px rgba(11,94,215,.06)"}}>
<div className="mx" style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:80}}>
  <img src="/img/logo.png" alt="ליאו" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{height:70,cursor:"pointer",objectFit:"contain",position:"relative",zIndex:10,filter:"drop-shadow(0 4px 12px rgba(11,94,215,.15))"}}/>
  <nav className="d-hide" style={{display:"flex",alignItems:"center",gap:24}}>
    {nav.map(([id,l])=><span key={id} onClick={()=>go(id)} style={{color:"#5A6B88",fontSize:14,cursor:"pointer",fontFamily:"'Heebo','Rubik'",fontWeight:600,transition:"all .2s",letterSpacing:.2}} onMouseEnter={e=>{e.target.style.color="#0B5ED7";}} onMouseLeave={e=>{e.target.style.color="#5A6B88";}}>{l}</span>)}
    <a href={`tel:${X.phone.replace(/-/g,"")}`} className="btn btn-a" style={{padding:"10px 20px",fontSize:14}}>📞 {X.phone}</a>
    <a href={wa} target="_blank" rel="noopener" className="btn btn-g" style={{padding:"10px 22px",fontSize:13,animation:"pulse 2s infinite"}}>💬 וואטסאפ</a>
  </nav>
  <button className="m-show" onClick={()=>setMm(true)} style={{display:"none",background:"#EAF4FF",border:"1px solid #C8DFFC",borderRadius:10,color:"#0B5ED7",fontSize:22,cursor:"pointer",width:44,height:44}}>☰</button>
</div></header>

{/* Mobile menu */}
{mm&&<><div onClick={()=>setMm(false)} style={{position:"fixed",inset:0,background:"rgba(11,30,63,.6)",zIndex:200,backdropFilter:"blur(4px)"}}/><div style={{position:"fixed",top:0,right:0,bottom:0,width:"min(320px,85vw)",background:"#fff",zIndex:201,padding:24,display:"flex",flexDirection:"column",animation:"slideR .3s ease",boxShadow:"-8px 0 40px rgba(11,94,215,.15)"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,paddingBottom:18,borderBottom:"1px solid #E1ECFB"}}><img src="/img/logo.png" style={{height:54}} alt=""/><button onClick={()=>setMm(false)} style={{background:"#EAF4FF",border:"none",borderRadius:10,color:"#0B5ED7",fontSize:18,cursor:"pointer",width:40,height:40}}>✕</button></div>
  {nav.map(([id,l])=><span key={id} onClick={()=>go(id)} style={{color:"#1a2b4a",fontSize:16,padding:"15px 0",borderBottom:"1px solid #F0F5FC",cursor:"pointer",fontFamily:"'Heebo','Rubik'",fontWeight:600}}>{l}</span>)}
  <a href={`tel:${X.phone.replace(/-/g,"")}`} className="btn btn-a" style={{marginTop:20,justifyContent:"center",fontSize:15}}>📞 {X.phone}</a>
  <a href={wa} target="_blank" rel="noopener" className="btn btn-g" style={{marginTop:10,justifyContent:"center",fontSize:15}}>💬 שלחו הודעה</a>
</div></>}

{/* ═══ HERO ═══ */}
<section style={{minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden",padding:"100px 0 60px"}}>
  <div className="mx" style={{position:"relative",zIndex:2,width:"100%"}}>
    <div className="m-col2" style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:40,alignItems:"center"}}>
    <div className="m-center" style={{maxWidth:600}}>
      <F><div className="badge" style={{marginBottom:20}}>🦁 ליאו — שירותי ניקיון מקצועיים</div></F>
      <F d={.1}><h1 style={{fontSize:"clamp(36px,7vw,60px)",lineHeight:1.05,color:"#0B1E3F",marginBottom:20,fontWeight:900}}>כשליאו מנקה,<br/><span style={{background:"linear-gradient(135deg,#0B5ED7,#2979FF)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>הבית מנצנץ!</span></h1></F>
      <F d={.2}><p style={{fontSize:18,color:"#1a2b4a",lineHeight:1.8,maxWidth:480,marginBottom:28,fontWeight:600}}>ניקוי מקצועי ברמה הגבוהה ביותר.<br/>ספות · מזרנים · שטיחים · מזגנים · רכבים · כיסאות · ארובות</p></F>
      <F d={.3}><div style={{display:"inline-flex",alignItems:"center",gap:16,padding:"16px 28px",borderRadius:18,background:"#fff",border:"2px solid #FFC107",marginBottom:28,boxShadow:"0 8px 28px rgba(255,193,7,.25)"}}>
        <span style={{fontFamily:"'Heebo'",fontSize:40,fontWeight:900,color:"#0B5ED7"}}>280₪</span>
        <span style={{fontSize:14,color:"#1a2b4a",lineHeight:1.4,fontWeight:700}}>ניקוי ספה<br/><span style={{color:"#5A6B88",fontWeight:500}}>כולל חיטוי ובישום</span></span>
      </div></F>
      <F d={.4}><div className="m-stack" style={{display:"flex",gap:12}}>
        <a href={wa} target="_blank" rel="noopener" className="btn btn-g m-full" style={{fontSize:16,padding:"18px 34px"}}>💬 שלחו תמונה — הצעה חינם</a>
        <a href={`tel:${X.phone.replace(/-/g,"")}`} className="btn btn-a m-full" style={{fontSize:16,padding:"18px 34px"}}>📞 {X.phone}</a>
      </div></F>
    </div>
    <div className="d-hide" style={{textAlign:"center",position:"relative"}}>
      <img src="/img/logo.png" alt="ליאו" style={{maxWidth:"100%",height:"auto",maxHeight:520,objectFit:"contain",filter:"drop-shadow(0 20px 40px rgba(11,94,215,.3))",animation:"bob 4s ease-in-out infinite"}}/>
    </div>
    </div>
  </div>
</section>

{/* ═══ TRUST BAR ═══ */}
<div style={{background:"linear-gradient(135deg,#0B5ED7,#2979FF)",padding:"32px 0",position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",inset:0,opacity:.1,backgroundImage:"radial-gradient(circle at 20% 50%,#fff 1px,transparent 1px),radial-gradient(circle at 80% 50%,#fff 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
<div className="mx" style={{position:"relative"}}><div className="m-col2" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,textAlign:"center"}}>
  {[["3,000","+","לקוחות מרוצים"],["100","%","שביעות רצון"],["6","","ימים בשבוע"],["5","⭐","דירוג ממוצע"]].map(([n,s,l],i)=><div key={i}><div style={{fontFamily:"'Heebo'",fontSize:34,fontWeight:900,color:"#FFC107"}}><Num to={parseInt(n.replace(",",""))} sfx={s}/></div><div style={{fontSize:13,color:"rgba(255,255,255,.9)",marginTop:4,fontFamily:"'Heebo'",fontWeight:600}}>{l}</div></div>)}
</div></div></div>

{/* ═══ PROBLEM → SOLUTION ═══ */}
<section className="sec sec-white" style={{position:"relative",overflow:"hidden"}}>
  <div className="mx" style={{position:"relative",zIndex:1}}>
    <F><STit sub="אתם לא לבד. רוב הבתים בישראל סובלים מזה.">הבעיה שכולם מכירים 😤</STit></F>
    <div className="m-col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginBottom:52}}>
      {[["🤢","ריחות שנספגו","זיעה, אוכל ישן ועובש שנכנסו עמוק לסיבי הבד. שום ספריי לא עוזר."],["🦠","חיידקים ואלרגנים","קרדית אבק, חיידקים ופטריות שחיים בתוך הספה. סכנה בריאותית אמיתית."],["💧","כתמים שלא יורדים","קפה, יין, שתן, שוקולד — כתמים שום חומר ביתי לא יכול להוריד."]].map(([ic,t,d],i)=>
      <F key={i} d={i*.08}><div className="crd" style={{padding:"36px 26px",textAlign:"center",height:"100%"}}><div style={{fontSize:48,marginBottom:16}}>{ic}</div><h3 style={{fontSize:20,fontWeight:800,marginBottom:12,color:"#0B1E3F"}}>{t}</h3><p style={{fontSize:14.5,color:"#5A6B88",lineHeight:1.8}}>{d}</p></div></F>)}
    </div>
    <F d={.3}><div style={{textAlign:"center",padding:"36px 28px",borderRadius:24,background:"linear-gradient(135deg,#EAF4FF,#F5FAFF)",border:"1px solid #C8DFFC"}}>
      <h3 style={{fontSize:"clamp(26px,4.5vw,36px)",color:"#0B1E3F",marginBottom:14,fontWeight:900}}>הפתרון? <span style={{color:"#0B5ED7"}}>ליאו 🦁</span></h3>
      <p style={{color:"#5A6B88",maxWidth:460,margin:"0 auto 24px",fontSize:16,lineHeight:1.7,fontWeight:500}}>ציוד תעשייתי. חומרים מקצועיים. תוצאות מובטחות.</p>
      <a href={wa} target="_blank" rel="noopener" className="btn btn-a" style={{fontSize:16}}>💬 בואו לליאו 🦁</a>
    </div></F>
  </div>
</section>

{/* ═══ SERVICES ═══ */}
<section className="sec sec-light" id="services" style={{position:"relative",overflow:"hidden"}}>
  <div className="mx" style={{position:"relative",zIndex:1}}>
    <F><STit sub="פתרון מקצועי לכל פריט בבית וברכב">השירותים שלנו</STit></F>
    <div className="m-col2" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
      {SV.map((s,i)=><F key={i} d={i*.05}><div className="crd" style={{padding:"30px 24px",cursor:"pointer",height:"100%",display:"flex",flexDirection:"column",borderTop:`4px solid ${s.accent||"#0B5ED7"}`}} onClick={()=>window.open(wm("היי, מעוניין/ת ב"+s.name),"_blank")}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><h3 style={{fontSize:18,fontWeight:800,color:"#0B1E3F"}}>{s.name}</h3><span style={{fontSize:28}}>{s.icon||"🔹"}</span></div>
        <p style={{fontSize:14,color:"#5A6B88",lineHeight:1.75,marginBottom:"auto",paddingBottom:18}}>{s.desc}</p>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:16,borderTop:"1px solid #E1ECFB"}}>
          <span style={{fontFamily:"'Heebo'",fontSize:22,fontWeight:900,color:s.accent||"#0B5ED7"}}>{s.price}</span>
          <span className="btn-d">הזמינו →</span>
        </div>
      </div></F>)}
    </div>
  </div>
</section>

{/* ═══ WHY LEO ═══ */}
<section className="sec sec-white" id="why">
  <div className="mx">
    <F><STit sub="כי כשמלך החיות מנקה — אין פשרות">למה דווקא ליאו? 🦁</STit></F>
    <div className="m-col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,marginBottom:40}}>
      {[
        ["👑","מלך הניקיון","לא סתם שם — אנחנו מתייחסים לכל עבודה כמו מלך. ציוד תעשייתי מהשורה הראשונה, חומרים מקצועיים בלבד, ותוצאות שמדברות בעד עצמן."],
        ["🛡️","אחריות מלכותית","לא מרוצים? נחזור ונתקן — בחינם. בלי שאלות, בלי תירוצים. המילה שלנו היא חוזה."],
        ["⚡","מהירים כמו אריה","זמני תגובה מהירים — הצעת מחיר תוך דקות, הגעה מהירה, וניקוי יסודי בלי לבזבז לכם את היום."],
        ["🧪","חומרים בטוחים","היפואלרגניים, ללא כלור ואמוניה. בטוחים לתינוקות, ילדים, חיות מחמד ואנשים רגישים. רק ריח נקי ורענן."],
        ["💰","מחירים שקופים","מה שנגיד — זה מה שתשלמו. בלי הפתעות, בלי תוספות, בלי קטנה עם הגדולה. שקיפות מלאה מהשנייה הראשונה."],
        ["📱","שירות 6 ימים בשבוע","זמינים א׳-ו׳ כולל ערבים. שלחו הודעה בוואטסאפ בכל שעה ותקבלו מענה. בשבת סגור — מנוחה של המלך."],
      ].map(([ic,t,d],i)=><F key={i} d={i*.06}><div className="crd" style={{padding:"32px 26px",height:"100%",display:"flex",flexDirection:"column",textAlign:"center"}}>
        <div style={{fontSize:44,marginBottom:16}}>{ic}</div>
        <h3 style={{fontSize:19,fontWeight:800,color:"#0B1E3F",marginBottom:12}}>{t}</h3>
        <p style={{fontSize:14.5,color:"#5A6B88",lineHeight:1.8}}>{d}</p>
      </div></F>)}
    </div>

    <F d={.4}><div style={{padding:"44px 36px",textAlign:"center",position:"relative",overflow:"hidden",borderRadius:24,background:"linear-gradient(135deg,#0B5ED7 0%,#2979FF 100%)",boxShadow:"0 20px 60px rgba(11,94,215,.3)"}}>
      <div style={{position:"absolute",inset:0,opacity:.1,backgroundImage:"radial-gradient(circle at 30% 20%,#fff 2px,transparent 2px),radial-gradient(circle at 70% 80%,#fff 2px,transparent 2px)",backgroundSize:"60px 60px"}}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{fontSize:52,marginBottom:18}}>🦁</div>
        <h3 style={{fontSize:"clamp(22px,4vw,30px)",color:"#fff",marginBottom:14,lineHeight:1.3,fontWeight:900}}>כי אריה לא מתפשר<br/><span style={{color:"#FFC107"}}>ואנחנו גם לא</span></h3>
        <p style={{color:"rgba(255,255,255,.9)",fontSize:16,maxWidth:520,margin:"0 auto 28px",lineHeight:1.8,fontWeight:500}}>
          בעולם שכולם מבטיחים — אנחנו מוכיחים. כל לקוח מקבל יחס של VIP, כל ספה מקבלת טיפול של מלך, וכל עבודה נגמרת רק כשאתם מחייכים.
        </p>
        <div style={{display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap",marginBottom:28}}>
          {[["3,000+","לקוחות שסמכו"],["100%","שביעות רצון"],["5.0","דירוג ממוצע"],["0","תלונות"]].map(([n,l],i)=><div key={i} style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Heebo'",fontSize:32,fontWeight:900,color:"#FFC107"}}>{n}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.8)",fontWeight:600}}>{l}</div>
          </div>)}
        </div>
        <a href={`https://wa.me/${X.waNum}`} target="_blank" rel="noopener" className="btn btn-a" style={{fontSize:16,padding:"16px 36px"}}>💬 הצטרפו למשפחת ליאו</a>
      </div>
    </div></F>
  </div>
</section>

{/* ═══ PRICE CALCULATOR ═══ */}
<section className="sec sec-light" id="calc">
  <div className="mx">
    <F><STit sub="בחרו שירותים וקבלו הערכת מחיר מיידית">🧮 מחשבון מחיר</STit></F>
    <F d={.1}><PriceCalc services={SV} wa={wa}/></F>
  </div>
</section>

{/* ═══ PROCESS ═══ */}
<section className="sec sec-white" id="process" style={{position:"relative",overflow:"hidden"}}>
  <div className="mx" style={{position:"relative",zIndex:1}}>
    <F><STit sub="מהתמונה הראשונה ועד לספה כמו חדשה">איך זה עובד? 🔄</STit></F>
    <div className="m-col2" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18}}>
      {PROCESS.map((p,i)=><F key={i} d={i*.1}><div className="crd" style={{padding:"32px 22px",textAlign:"center",height:"100%",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:64,height:64,borderRadius:18,background:"linear-gradient(135deg,#EAF4FF,#fff)",border:"2px solid #C8DFFC",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,marginBottom:16}}>{p.icon}</div>
        <span style={{fontFamily:"'Heebo'",fontSize:11,fontWeight:800,color:"#FFC107",letterSpacing:1.5,marginBottom:8,background:"#FFF7D6",padding:"3px 12px",borderRadius:50}}>שלב {p.step}</span>
        <h3 style={{fontSize:17,fontWeight:800,color:"#0B1E3F",marginBottom:10}}>{p.title}</h3>
        <p style={{fontSize:13.5,color:"#5A6B88",lineHeight:1.75}}>{p.desc}</p>
      </div></F>)}
    </div>
    <F d={.5}><div style={{textAlign:"center",marginTop:44}}>
      <a href={wa} target="_blank" rel="noopener" className="btn btn-g" style={{fontSize:16,padding:"18px 40px",animation:"pulse 2s infinite"}}>💬 שלחו תמונה — הצעה חינם</a>
    </div></F>
  </div>
</section>

{/* ═══ CTA ═══ */}
<section style={{padding:"80px 0",position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#0B5ED7 0%,#2979FF 50%,#0B5ED7 100%)"}}>
  <div style={{position:"absolute",inset:0,opacity:.08,backgroundImage:"radial-gradient(circle at 20% 30%,#fff 2px,transparent 2px),radial-gradient(circle at 80% 70%,#fff 2px,transparent 2px)",backgroundSize:"50px 50px"}}/>
  <div className="mx" style={{position:"relative",zIndex:2}}><div className="m-center" style={{maxWidth:520,margin:"0 auto",textAlign:"center"}}>
    <F><div className="badge-y" style={{marginBottom:16}}>📞 זמינים א׳-ו׳ · סגור בשבת</div></F>
    <F d={.1}><h2 style={{fontSize:"clamp(26px,4.5vw,34px)",color:"#fff",marginBottom:14,fontWeight:900}}>רוצים הצעת מחיר?<br/><span style={{color:"#FFC107"}}>ליאו כבר בדרך 🦁</span></h2></F>
    <F d={.15}><p style={{color:"rgba(255,255,255,.9)",fontSize:16,marginBottom:26,lineHeight:1.75,fontWeight:500}}>שלחו תמונה של הפריט → הצעה מדויקת תוך דקות → מתאמים הגעה. פשוט ככה.</p></F>
    <F d={.2}><div className="m-stack" style={{display:"flex",gap:12,justifyContent:"center"}}>
      <a href={wa} target="_blank" rel="noopener" className="btn btn-g m-full" style={{fontSize:16}}>💬 שלחו תמונה</a>
      <a href={`tel:${X.phone.replace(/-/g,"")}`} className="btn btn-a m-full" style={{fontSize:16}}>📞 חייגו עכשיו</a>
    </div></F>
  </div></div>
</section>

{/* ═══ BEFORE/AFTER ═══ */}
<section className="sec sec-light" id="gallery"><div className="mx">
  <F><STit sub="ראו בעיניים — ההבדל מדבר בעד עצמו">לפני ואחרי 📸</STit></F>
  <div className="m-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
    {BA.map((b,i)=><F key={i} d={i*.06}><div className="crd" style={{overflow:"hidden"}}><div style={{display:"flex",height:220}}>
      <div style={{flex:1,background:b.imgBefore?"none":`linear-gradient(135deg,${b.bc},${b.bc}cc)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>{b.imgBefore?<img src={b.imgBefore} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:36,opacity:.1}}>✕</span>}<span style={{position:"absolute",bottom:12,right:12,padding:"6px 14px",borderRadius:10,background:"#DC2626",color:"#fff",fontSize:12,fontFamily:"'Heebo'",fontWeight:800,boxShadow:"0 4px 12px rgba(220,38,38,.4)"}}>לפני</span></div>
      <div style={{width:3,background:"linear-gradient(transparent,#FFC107,transparent)"}}/>
      <div style={{flex:1,background:b.imgAfter?"none":`linear-gradient(135deg,${b.ac},${b.ac}dd)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>{b.imgAfter?<img src={b.imgAfter} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:36,opacity:.1}}>✓</span>}<span style={{position:"absolute",bottom:12,left:12,padding:"6px 14px",borderRadius:10,background:"linear-gradient(135deg,#FFC107,#FFD54F)",color:"#1a2b4a",fontSize:12,fontFamily:"'Heebo'",fontWeight:800,boxShadow:"0 4px 12px rgba(255,193,7,.4)"}}>אחרי ✨</span></div>
    </div><div style={{padding:"18px 22px"}}><h4 style={{fontSize:16,color:"#0B1E3F",marginBottom:4,fontWeight:800}}>{b.title}</h4><p style={{fontSize:13,color:"#5A6B88"}}>{b.desc}</p></div></div></F>)}
  </div>
</div></section>

{/* ═══ REVIEWS ═══ */}
<section className="sec sec-white" id="reviews"><div className="mx">
  <F><STit sub="אלפי לקוחות מרוצים — הנה כמה מהם">מה אומרים עלינו ⭐</STit></F>
  <div className="m-col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
    {RV.map((r,i)=><F key={i} d={i*.06}><div className="crd" style={{padding:"30px 26px",height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{color:"#FFC107",fontSize:16,letterSpacing:2,marginBottom:14}}>{"★".repeat(r.stars||5)}</div>
      <p style={{fontSize:15,lineHeight:1.9,color:"#1a2b4a",marginBottom:"auto",paddingBottom:18,fontWeight:500}}>״{r.t}״</p>
      <div style={{display:"flex",alignItems:"center",gap:12,paddingTop:16,borderTop:"1px solid #E1ECFB"}}>
        <div style={{width:42,height:42,borderRadius:14,background:"linear-gradient(135deg,#0B5ED7,#2979FF)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:"'Heebo'",fontWeight:900,fontSize:17}}>{r.n[0]}</div>
        <div><div style={{fontSize:15,fontFamily:"'Heebo'",fontWeight:800,color:"#0B1E3F"}}>{r.n}</div><div style={{fontSize:12,color:"#5A6B88",fontWeight:600}}>{r.s}</div></div>
      </div>
    </div></F>)}
  </div>
</div></section>

{/* ═══ FAQ ═══ */}
<section className="sec sec-light" id="faq"><div className="mx" style={{maxWidth:740}}>
  <F><STit>שאלות נפוצות ❓</STit></F>
  {[
["כמה זמן לוקח ניקוי ספה?","הניקוי אורך 30-60 דקות. ייבוש: 4-6 שעות. ספות עור מתייבשות מהר יותר. מומלץ לאוורר."],
["החומרים בטוחים לילדים ולחיות?","כן — היפואלרגניים, ללא כלור ואמוניה. בטוחים לתינוקות, ילדים, בעלי חיים ואנשים רגישים."],
["מנקים כל סוגי הספות?","כן — בד, עור, דמוי עור, אימפלה, קטיפה, מיקרופייבר ועוד. לכל בד שיטת ניקוי מותאמת."],
["מה אם הכתם לא יורד?","95% מהכתמים יורדים בטיפול הראשון. לגבי כתמים עקשנים — נעדכן מראש ונציע פתרון."],
["אתם מביאים ציוד?","כן, מגיעים עם הכל — מכונת שאיבה תעשייתית, חומרי ניקוי, ציוד חיטוי ובישום. רק תפנו גישה."],
["לאן מגיעים?","אזורי שירות: ירושלים והסביבה, המרכז (גוש דן, שפלה) והדרום (אשדוד, אשקלון, באר שבע, אילת ועוד). הגעה חינם ברוב האזורים. לא עובדים בשבת."],
["גם מזרנים, שטיחים ורכבים?","כן! מזרנים מ-100₪, שטיחים 40₪/מ״ר, כיסאות מ-30₪, רכבים מ-250₪, מזגנים 170₪, ארובות 500₪."],
["יש אחריות?","אחריות מלאה. לא מרוצים — נחזור בחינם. עובדים בשקיפות ולא גובים על שירות שלא סופק."],
["איך מזמינים?","שלחו תמונה בוואטסאפ → הצעה תוך דקות → מתאמים מועד (ימים א׳-ו׳). תשלום: מזומן, ביט, אשראי. לא עובדים בשבת."]
  ].map(([q,a],i)=><F key={i} d={i*.04}><FaqItem q={q} a={a}/></F>)}
</div></section>

{/* ═══ AREAS ═══ */}
<section className="sec sec-white" id="areas"><div className="mx">
  <F><STit>🚐 איפה שאתם — אנחנו שם</STit></F>
  <F d={.08}><div className="glow-border" style={{padding:"40px 44px",textAlign:"center",borderRadius:24,background:"linear-gradient(135deg,#fff,#F5FAFF)",border:"1px solid #E1ECFB"}}>
    <p style={{fontSize:16,lineHeight:2.4,color:"#1a2b4a",fontFamily:"'Heebo','Rubik'",fontWeight:600}}>{X.areas||D.areas}</p>
    <a href={wa} target="_blank" rel="noopener" className="btn btn-g" style={{marginTop:28}}>💬 בדקו אם מגיעים אליכם</a>
  </div></F>
</div></section>

{/* ═══ FINAL CTA ═══ */}
<section className="sec sec-light" style={{textAlign:"center"}}>
  <div className="mx">
    <F><img src="/img/logo.png" alt="" style={{height:180,objectFit:"contain",margin:"0 auto 28px",filter:"drop-shadow(0 15px 35px rgba(11,94,215,.25))",animation:"bob 4s ease-in-out infinite"}}/></F>
    <F d={.1}><h2 style={{fontSize:"clamp(28px,5vw,40px)",color:"#0B1E3F",marginBottom:12,fontWeight:900}}>הבית שלך צריך את <span style={{color:"#0B5ED7"}}>ליאו 🦁</span></h2></F>
    <F d={.15}><p style={{color:"#5A6B88",fontSize:17,marginBottom:32,fontWeight:500}}>ליאו — ניקיון ברמה של מלך</p></F>
    <F d={.2}><div className="m-stack" style={{display:"flex",gap:12,justifyContent:"center"}}>
      <a href={wa} target="_blank" rel="noopener" className="btn btn-g m-full" style={{fontSize:17,padding:"18px 40px",animation:"pulse 2s infinite"}}>💬 הזמינו עכשיו</a>
      <a href={`tel:${X.phone.replace(/-/g,"")}`} className="btn btn-a m-full" style={{fontSize:17,padding:"18px 40px"}}>📞 {X.phone}</a>
    </div></F>
  </div>
</section>

{/* ═══ FORM ═══ */}
<section className="sec sec-white" id="contact"><div className="mx">
  <F><STit>השאירו פרטים ונחזור אליכם 📋</STit></F>
  <F d={.1}><LeadForm services={SV} wa={wa}/></F>
</div></section>

{/* ═══ FOOTER ═══ */}
<footer style={{background:"linear-gradient(135deg,#0B1E3F,#0B5ED7)",padding:"56px 0 20px",position:"relative",overflow:"hidden"}}><div className="mx" style={{position:"relative"}}>
  <div className="m-col" style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",gap:30,marginBottom:36}}>
    <div><img src="/img/logo.png" alt="" style={{height:68,marginBottom:18}}/><p style={{fontSize:13.5,color:"rgba(255,255,255,.7)",lineHeight:1.8,fontWeight:500}}>ליאו — שירותי ניקיון מקצועיים.<br/>ניקיון ברמה של מלך החיות.</p></div>
    <div><h4 style={{color:"#FFC107",fontSize:13,marginBottom:16,fontWeight:800}}>שירותים</h4>{SV.map((s,i)=><div key={i} style={{fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:7,fontWeight:500}}>{s.name}</div>)}</div>
    <div><h4 style={{color:"#FFC107",fontSize:13,marginBottom:16,fontWeight:800}}>ניווט</h4>{nav.map(([id,l])=><div key={id} style={{fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:7,cursor:"pointer",fontWeight:500}} onClick={()=>go(id)}>{l}</div>)}</div>
    <div><h4 style={{color:"#FFC107",fontSize:13,marginBottom:16,fontWeight:800}}>צור קשר</h4><a href={`tel:${X.phone.replace(/-/g,"")}`} style={{display:"block",fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:7,fontWeight:500}}>📞 {X.phone}</a><a href={wa} target="_blank" rel="noopener" style={{display:"block",fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:7,fontWeight:500}}>💬 וואטסאפ</a><div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginTop:10,fontWeight:500}}>א׳-ו׳ | סגור בשבת</div></div>
  </div>
  <div className="blue-line" style={{background:"linear-gradient(90deg,transparent,rgba(255,193,7,.5),transparent)"}}/><div style={{paddingTop:16,display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,.5)",fontWeight:500}}><span>© 2026 ליאו — שירותי ניקיון</span><span onClick={goAdmin} style={{cursor:"pointer"}}>ניהול</span></div>
</div></footer>

{/* Floating */}
<a href={wa} target="_blank" rel="noopener" style={{position:"fixed",bottom:24,left:24,zIndex:999,width:62,height:62,borderRadius:18,background:"linear-gradient(135deg,#25D366,#1DA851)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,color:"#fff",boxShadow:"0 8px 24px rgba(37,211,102,.45)",animation:"pulse 2s infinite"}}>💬</a>
{showTop&&<button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{position:"fixed",bottom:24,right:24,zIndex:999,width:46,height:46,borderRadius:14,background:"#fff",border:"2px solid #C8DFFC",color:"#0B5ED7",cursor:"pointer",fontSize:16,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 20px rgba(11,94,215,.15)"}}>↑</button>}
<div className="m-show" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:90,background:"rgba(255,255,255,.97)",backdropFilter:"blur(16px)",padding:"12px 14px",display:"none",gap:8,borderTop:"1px solid #E1ECFB",boxShadow:"0 -4px 20px rgba(11,94,215,.1)"}}>
  <a href={wa} target="_blank" rel="noopener" className="btn btn-g" style={{flex:1,padding:"14px 6px",fontSize:15}}>💬 וואטסאפ</a>
  <a href={`tel:${X.phone.replace(/-/g,"")}`} className="btn btn-a" style={{flex:1,padding:"14px 6px",fontSize:15}}>📞 חייגו</a>
</div>

{/* Popup */}
<Popup wa={wa}/>

</div>;}

/* ═══ Components ═══ */
function Popup({wa}){
  const[show,setShow]=useState(false);
  useEffect(()=>{
    if(sessionStorage.getItem("leo_popup"))return;
    const t=setTimeout(()=>{setShow(true);sessionStorage.setItem("leo_popup","1");},4000);
    return()=>clearTimeout(t);
  },[]);
  if(!show)return null;
  return<><div onClick={()=>setShow(false)} style={{position:"fixed",inset:0,background:"rgba(11,30,63,.6)",backdropFilter:"blur(6px)",zIndex:9998}}/>
    <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:9999,width:"min(440px,92vw)",background:"#fff",borderRadius:26,border:"2px solid #FFC107",padding:"44px 32px",textAlign:"center",animation:"fadeUp .4s ease",boxShadow:"0 24px 64px rgba(11,94,215,.3)"}}>
      <button onClick={()=>setShow(false)} style={{position:"absolute",top:16,left:16,background:"#EAF4FF",border:"none",borderRadius:10,color:"#0B5ED7",fontSize:16,cursor:"pointer",width:34,height:34}}>✕</button>
      <div style={{fontSize:56,marginBottom:14}}>🦁</div>
      <h3 style={{fontSize:26,color:"#0B1E3F",fontFamily:"'Heebo'",marginBottom:10,fontWeight:900}}>ברוכים הבאים לליאו!</h3>
      <p style={{color:"#5A6B88",fontSize:15,lineHeight:1.7,marginBottom:8,fontWeight:500}}>מבקרים חדשים מקבלים</p>
      <div style={{fontSize:48,fontFamily:"'Heebo'",fontWeight:900,color:"#0B5ED7",marginBottom:8}}>10% הנחה</div>
      <p style={{color:"#5A6B88",fontSize:13.5,marginBottom:22,fontWeight:500}}>על ההזמנה הראשונה! ציינו <strong style={{color:"#0B5ED7"}}>"LEO10"</strong> בוואטסאפ</p>
      <a href={`${wa}?text=${encodeURIComponent("היי! ראיתי את ההנחה באתר — קוד LEO10 🦁")}`} target="_blank" rel="noopener" className="btn btn-g" style={{width:"100%",fontSize:16,padding:"16px 0",marginBottom:12,animation:"pulse 2s infinite"}}>💬 מממש עכשיו — וואטסאפ</a>
      <button onClick={()=>setShow(false)} style={{background:"none",border:"none",color:"#5A6B88",fontSize:13,cursor:"pointer",fontWeight:500}}>אולי אחר כך</button>
    </div>
  </>;
}

function PriceCalc({services,wa}){
  const[items,setItems]=useState({});
  const toggle=(name)=>setItems(prev=>{const n={...prev};if(n[name])delete n[name];else n[name]=1;return n;});
  const inc=(name)=>setItems(prev=>({...prev,[name]:(prev[name]||1)+1}));
  const dec=(name)=>setItems(prev=>{const n={...prev};if(n[name]>1)n[name]-=1;else delete n[name];return n;});
  
  const getNum=(priceStr)=>{const m=String(priceStr).match(/(\d+)/);return m?parseInt(m[1]):0;};
  const total=Object.entries(items).reduce((sum,[name,qty])=>{const svc=services.find(s=>s.name===name);return sum+(svc?getNum(svc.price)*qty:0);},0);
  const selectedNames=Object.entries(items).map(([n,q])=>q>1?`${n} x${q}`:n).join(", ");

  return<div className="glow-border" style={{maxWidth:620,margin:"0 auto",padding:0,overflow:"hidden",borderRadius:24,background:"#fff",border:"1px solid #E1ECFB"}}>
    <div style={{background:"linear-gradient(135deg,#EAF4FF,#F5FAFF)",padding:"20px 24px",borderBottom:"1px solid #E1ECFB"}}>
      <p style={{fontSize:14,color:"#1a2b4a",textAlign:"center",fontWeight:600}}>👆 סמנו שירותים וכמויות — המחיר מתעדכן אוטומטית</p>
    </div>
    <div style={{padding:"8px 0"}}>
      {services.map((s,i)=>{const active=!!items[s.name];const qty=items[s.name]||0;return<div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px",borderBottom:i<services.length-1?"1px solid #F0F5FC":"none",background:active?"#EAF4FF":"none",transition:"background .2s",cursor:"pointer"}} onClick={()=>!active&&toggle(s.name)}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <span style={{fontSize:24}}>{s.icon||"🔹"}</span>
          <div><div style={{fontSize:15,color:active?"#0B1E3F":"#1a2b4a",fontFamily:"'Heebo'",fontWeight:active?800:600}}>{s.name}</div><div style={{fontSize:12,color:"#5A6B88",fontWeight:500}}>{s.price}</div></div>
        </div>
        {active?<div style={{display:"flex",alignItems:"center",gap:8}} onClick={e=>e.stopPropagation()}>
          <button onClick={()=>dec(s.name)} style={{width:32,height:32,borderRadius:10,background:"#fff",border:"1px solid #C8DFFC",color:"#0B5ED7",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>−</button>
          <span style={{fontFamily:"'Heebo'",fontSize:17,fontWeight:900,color:"#0B5ED7",minWidth:22,textAlign:"center"}}>{qty}</span>
          <button onClick={()=>inc(s.name)} style={{width:32,height:32,borderRadius:10,background:"#0B5ED7",border:"1px solid #0B5ED7",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>+</button>
          <button onClick={()=>toggle(s.name)} style={{marginRight:4,background:"none",border:"none",color:"#DC2626",fontSize:14,cursor:"pointer",fontWeight:700}}>✕</button>
        </div>
        :<div style={{padding:"7px 16px",borderRadius:10,background:"#EAF4FF",border:"1px solid #C8DFFC",fontSize:12,color:"#0B5ED7",fontWeight:700}}>+ הוסף</div>}
      </div>;})}
    </div>
    <div style={{padding:"24px 28px",background:"linear-gradient(135deg,#FFF7D6,#FFFBEB)",borderTop:"2px solid #FFC107"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:total>0?16:0}}>
        <span style={{fontSize:15,color:"#1a2b4a",fontWeight:700}}>סה״כ הערכה:</span>
        <span style={{fontFamily:"'Heebo'",fontSize:total>0?34:22,fontWeight:900,color:"#0B5ED7",transition:"all .3s"}}>{total>0?`~${total}₪`:"בחרו שירותים"}</span>
      </div>
      {total>0&&<a href={`${wa}?text=${encodeURIComponent(`היי! אני מעוניין/ת ב:\n${selectedNames}\n\nסה"כ הערכה: ~${total}₪\nאשמח להצעה מדויקת 🦁`)}`} target="_blank" rel="noopener" className="btn btn-g" style={{width:"100%",fontSize:15}}>💬 קבלו הצעה מדויקת — וואטסאפ</a>}
      {total>0&&<p style={{textAlign:"center",fontSize:12,color:"#5A6B88",marginTop:10,fontWeight:500}}>* המחיר הסופי ייקבע לאחר אבחון. ייתכנו הנחות חבילה!</p>}
    </div>
  </div>;
}

function FaqItem({q,a}){const[o,s]=useState(false);return<div className="crd" style={{marginBottom:12,borderColor:o?"#0B5ED7":"#E1ECFB"}}><div onClick={()=>s(!o)} style={{padding:"22px 26px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15.5,fontFamily:"'Heebo'",fontWeight:700,color:"#0B1E3F"}}>{q}</span><span style={{color:"#0B5ED7",fontSize:13,transition:"transform .3s",transform:o?"rotate(180deg)":"",fontWeight:900}}>▼</span></div>{o&&<div style={{padding:"0 26px 22px",fontSize:14.5,color:"#5A6B88",lineHeight:1.85,fontWeight:500}}>{a}</div>}</div>;}
function LeadForm({services,wa}){const[f,setF]=useState({name:"",phone:"",service:""});const[sent,setSent]=useState(false);const inp={width:"100%",padding:"15px 18px",borderRadius:14,border:"2px solid #E1ECFB",fontSize:14.5,fontFamily:"'Assistant','Rubik'",background:"#fff",color:"#0B1E3F",direction:"rtl",outline:"none",transition:"border-color .2s",fontWeight:600};const submit=()=>{const l=gL();l.push({...f,id:"l"+Date.now(),date:new Date().toISOString(),status:"new"});sL(l);setSent(true);setTimeout(()=>{setSent(false);setF({name:"",phone:"",service:""});},5000);};if(sent)return<div style={{maxWidth:500,margin:"0 auto",textAlign:"center",padding:48,background:"#fff",borderRadius:22,border:"2px solid #25D366",boxShadow:"0 12px 40px rgba(37,211,102,.2)"}}><div style={{fontSize:52,marginBottom:16}}>✅</div><h3 style={{fontSize:24,color:"#0B1E3F",marginBottom:10,fontWeight:900}}>הפרטים נשלחו!</h3><p style={{color:"#5A6B88",marginBottom:22,fontWeight:500}}>ניצור קשר בהקדם</p><a href={wa} target="_blank" rel="noopener" className="btn btn-g">💬 או שלחו הודעה</a></div>;return<form onSubmit={e=>{e.preventDefault();if(f.name&&f.phone)submit();}} style={{maxWidth:500,margin:"0 auto",background:"#fff",borderRadius:24,padding:"44px 32px",border:"1px solid #E1ECFB",boxShadow:"0 12px 40px rgba(11,94,215,.08)"}}>{[["שם מלא","text","name","הכנסו שם מלא"],["טלפון","tel","phone","050-000-0000"]].map(([l,t,k,p])=><div key={k} style={{marginBottom:18}}><label style={{display:"block",fontSize:13,fontFamily:"'Heebo'",fontWeight:700,color:"#0B1E3F",marginBottom:8}}>{l} *</label><input type={t} style={inp} value={f[k]} placeholder={p} required onChange={e=>setF(x=>({...x,[k]:e.target.value}))} onFocus={e=>e.target.style.borderColor="#0B5ED7"} onBlur={e=>e.target.style.borderColor="#E1ECFB"}/></div>)}<div style={{marginBottom:22}}><label style={{display:"block",fontSize:13,fontFamily:"'Heebo'",fontWeight:700,color:"#0B1E3F",marginBottom:8}}>שירות</label><select style={{...inp,appearance:"none"}} value={f.service} onChange={e=>setF(x=>({...x,service:e.target.value}))}><option value="">בחר שירות</option>{services.map((s,i)=><option key={i} value={s.name}>{s.name} — {s.price}</option>)}</select></div><button type="submit" className="btn btn-a" style={{width:"100%",fontSize:17,padding:"18px 0"}}>שלחו פרטים 🦁</button><p style={{textAlign:"center",fontSize:12,color:"#5A6B88",marginTop:14,fontWeight:500}}>🔒 הפרטים מאובטחים</p></form>;}

function Login({ok,back}){const[p,setP]=useState("");const[e,setE]=useState(false);return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#EAF4FF,#fff)"}}><style>{CSS}</style><div style={{background:"#fff",borderRadius:24,padding:44,width:400,maxWidth:"90vw",textAlign:"center",border:"1px solid #E1ECFB",boxShadow:"0 20px 60px rgba(11,94,215,.15)"}}><img src="/img/logo.png" alt="" style={{height:100,margin:"0 auto 22px"}}/><h2 style={{fontSize:22,color:"#0B1E3F",marginBottom:24,fontFamily:"'Heebo'",fontWeight:900}}>כניסת מנהל</h2><input type="password" style={{width:"100%",padding:"15px 20px",borderRadius:14,border:"2px solid #E1ECFB",fontSize:15,textAlign:"center",fontFamily:"'Assistant','Rubik'",background:"#fff",color:"#0B1E3F",outline:"none",marginBottom:14,fontWeight:600}} value={p} onChange={x=>{setP(x.target.value);setE(false);}} placeholder="סיסמה" onKeyDown={x=>{if(x.key==="Enter"){p===PASS?ok():setE(true);}}}/>{e&&<p style={{color:"#DC2626",fontSize:13,marginBottom:12,fontWeight:600}}>סיסמה שגויה</p>}<button onClick={()=>p===PASS?ok():setE(true)} className="btn btn-a" style={{width:"100%",marginBottom:12}}>כניסה</button><button onClick={back} style={{background:"none",border:"none",color:"#5A6B88",cursor:"pointer",fontSize:13,fontWeight:500}}>← חזרה</button></div></div>;}

/* ═══ ADMIN ═══ */
function Admin({data,setData,back}){
  const[tab,setTab]=useState("contact");const[leads,setLeads]=useState(gL());const[toast,setToast]=useState("");const[d,sd]=useState(JSON.parse(JSON.stringify(data)));const[saving,setSaving]=useState(false);const[cloudId]=useState(NPOINT_ID||localStorage.getItem("r_npoint")||"");
  const show=m=>{setToast(m);setTimeout(()=>setToast(""),4000);};
  const downloadJson=()=>{setData(d);const blob=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="data.json";a.click();URL.revokeObjectURL(url);show("✅ data.json הורד! שים בתיקיית public ודחוף ל-GitHub");};
  const saveAll=async()=>{if(cloudId){setSaving(true);const ok=await cloudSave(cloudId,d);if(ok){setData(d);show("✅ נשמר!");}else{show("⚠️ ענן נכשל — הורד JSON");} setSaving(false);}else{downloadJson();}};
  const upS=(i,k,v)=>{const s=[...(d.services||[])];s[i]={...s[i],[k]:v};sd({...d,services:s});};
  const upR=(i,k,v)=>{const r=[...(d.reviews||[])];r[i]={...r[i],[k]:v};sd({...d,reviews:r});};
  const upB=(i,k,v)=>{const b=[...(d.beforeAfter||[])];b[i]={...b[i],[k]:v};sd({...d,beforeAfter:b});};
  const handleImg=async(i,key,file)=>{if(!file)return;const c=await compressImg(file,400);const ba=[...(d.beforeAfter||[])];ba[i]={...ba[i],[key]:c};sd({...d,beforeAfter:ba});show("תמונה נוספה — שמור");};
  const box={background:"#fff",border:"1px solid #E1ECFB",borderRadius:16,padding:22,marginBottom:14,boxShadow:"0 4px 16px rgba(11,94,215,.04)"};
  const inp={width:"100%",padding:"10px 14px",borderRadius:10,border:"2px solid #E1ECFB",fontSize:14,fontFamily:"'Assistant','Rubik'",background:"#fff",color:"#0B1E3F",direction:"rtl",outline:"none",marginBottom:10,fontWeight:600};
  const lbl={display:"block",fontSize:12,color:"#0B1E3F",marginBottom:5,fontFamily:"'Heebo'",fontWeight:700};
return<div style={{minHeight:"100vh",background:"linear-gradient(135deg,#F5FAFF,#EAF4FF)",direction:"rtl"}}><style>{CSS}</style>
  {toast&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:10000,background:toast.startsWith("❌")?"#DC2626":toast.startsWith("⚠")?"#D97706":"#059669",color:"#fff",padding:"14px 26px",borderRadius:14,fontSize:14,fontFamily:"'Heebo'",fontWeight:700,boxShadow:"0 8px 24px rgba(0,0,0,.2)"}}>{toast}</div>}
  <div style={{background:"#fff",borderBottom:"1px solid #E1ECFB",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,boxShadow:"0 2px 12px rgba(11,94,215,.06)"}}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontFamily:"'Heebo'",fontSize:15,fontWeight:900,color:"#0B5ED7"}}>🦁 ליאו — ניהול</span></div><div style={{display:"flex",gap:8}}><button onClick={saveAll} disabled={saving} className="btn btn-g" style={{padding:"9px 20px",fontSize:13}}>{saving?"שומר...":"🚀 שמור"}</button><button onClick={downloadJson} className="btn btn-a" style={{padding:"9px 16px",fontSize:12}}>📥 JSON</button><button onClick={back} style={{background:"#EAF4FF",border:"1px solid #C8DFFC",borderRadius:10,padding:"9px 16px",color:"#0B5ED7",cursor:"pointer",fontSize:13,fontWeight:700}}>←</button></div></div>
  <div style={{display:"flex",gap:6,padding:"14px 20px",borderBottom:"1px solid #E1ECFB",flexWrap:"wrap",background:"#fff"}}>{[["contact","📞"],["services","💰"],["reviews","⭐"],["ba","📸"],["areas","🗺️"],["leads","📋("+leads.length+")"]].map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{padding:"10px 16px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontFamily:"'Heebo'",fontWeight:700,background:tab===id?"#0B5ED7":"#F5FAFF",color:tab===id?"#fff":"#5A6B88"}}>{l}</button>)}</div>
  <div style={{maxWidth:860,margin:"0 auto",padding:24}}>
    {tab==="contact"&&<div><h3 style={{fontSize:19,color:"#0B1E3F",marginBottom:18,fontWeight:900}}>📞 קשר</h3><div style={box}><label style={lbl}>טלפון</label><input style={inp} value={d.phone||""} onChange={e=>sd({...d,phone:e.target.value})}/><label style={lbl}>וואטסאפ</label><input style={inp} value={d.waNum||""} onChange={e=>sd({...d,waNum:e.target.value})}/></div></div>}
    {tab==="services"&&<div><h3 style={{fontSize:19,color:"#0B1E3F",marginBottom:18,fontWeight:900}}>💰 שירותים <button onClick={()=>sd({...d,services:[...(d.services||[]),{name:"חדש",desc:"תיאור",price:"100₪",accent:"#0B5ED7",icon:"🔹"}]})} style={{fontSize:13,background:"#EAF4FF",border:"1px solid #C8DFFC",color:"#0B5ED7",padding:"5px 14px",borderRadius:8,cursor:"pointer",fontWeight:800,marginRight:8}}>+</button></h3>{(d.services||[]).map((s,i)=><div key={i} style={box}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><strong style={{color:"#0B5ED7",fontSize:15}}>{s.name}</strong><button onClick={()=>sd({...d,services:d.services.filter((_,j)=>j!==i)})} style={{background:"#FEE",border:"none",color:"#DC2626",cursor:"pointer",fontSize:13,padding:"4px 10px",borderRadius:8,fontWeight:700}}>🗑</button></div><label style={lbl}>שם</label><input style={inp} value={s.name} onChange={e=>upS(i,"name",e.target.value)}/><label style={lbl}>תיאור</label><textarea style={{...inp,height:60,resize:"vertical"}} value={s.desc} onChange={e=>upS(i,"desc",e.target.value)}/><div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={lbl}>מחיר</label><input style={inp} value={s.price} onChange={e=>upS(i,"price",e.target.value)}/></div><div style={{flex:1}}><label style={lbl}>אייקון</label><input style={inp} value={s.icon||""} onChange={e=>upS(i,"icon",e.target.value)}/></div></div></div>)}</div>}
    {tab==="reviews"&&<div><h3 style={{fontSize:19,color:"#0B1E3F",marginBottom:18,fontWeight:900}}>⭐ ביקורות <button onClick={()=>sd({...d,reviews:[...(d.reviews||[]),{n:"שם",t:"ביקורת",s:"שירות",stars:5}]})} style={{fontSize:13,background:"#EAF4FF",border:"1px solid #C8DFFC",color:"#0B5ED7",padding:"5px 14px",borderRadius:8,cursor:"pointer",fontWeight:800,marginRight:8}}>+</button></h3>{(d.reviews||[]).map((r,i)=><div key={i} style={box}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><strong style={{color:"#0B5ED7",fontSize:15}}>{r.n}</strong><button onClick={()=>sd({...d,reviews:d.reviews.filter((_,j)=>j!==i)})} style={{background:"#FEE",border:"none",color:"#DC2626",cursor:"pointer",fontSize:13,padding:"4px 10px",borderRadius:8,fontWeight:700}}>🗑</button></div><label style={lbl}>שם</label><input style={inp} value={r.n} onChange={e=>upR(i,"n",e.target.value)}/><label style={lbl}>ביקורת</label><textarea style={{...inp,height:60,resize:"vertical"}} value={r.t} onChange={e=>upR(i,"t",e.target.value)}/><label style={lbl}>שירות</label><input style={inp} value={r.s} onChange={e=>upR(i,"s",e.target.value)}/></div>)}</div>}
    {tab==="ba"&&<div><h3 style={{fontSize:19,color:"#0B1E3F",marginBottom:18,fontWeight:900}}>📸 לפני/אחרי <button onClick={()=>sd({...d,beforeAfter:[...(d.beforeAfter||[]),{title:"חדש",desc:"תיאור",bc:"#555",ac:"#aaa",imgBefore:"",imgAfter:""}]})} style={{fontSize:13,background:"#EAF4FF",border:"1px solid #C8DFFC",color:"#0B5ED7",padding:"5px 14px",borderRadius:8,cursor:"pointer",fontWeight:800,marginRight:8}}>+</button></h3>{(d.beforeAfter||[]).map((b,i)=><div key={i} style={box}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><strong style={{color:"#0B5ED7",fontSize:15}}>{b.title}</strong><button onClick={()=>sd({...d,beforeAfter:d.beforeAfter.filter((_,j)=>j!==i)})} style={{background:"#FEE",border:"none",color:"#DC2626",cursor:"pointer",fontSize:13,padding:"4px 10px",borderRadius:8,fontWeight:700}}>🗑</button></div><label style={lbl}>כותרת</label><input style={inp} value={b.title} onChange={e=>upB(i,"title",e.target.value)}/><label style={lbl}>תיאור</label><input style={inp} value={b.desc} onChange={e=>upB(i,"desc",e.target.value)}/><div style={{display:"flex",gap:14,marginBottom:8}}><div style={{flex:1}}><label style={lbl}>📷 לפני</label>{b.imgBefore&&<img src={b.imgBefore} style={{width:"100%",height:80,objectFit:"cover",borderRadius:10,marginBottom:8,border:"1px solid #E1ECFB"}}/>}<input type="file" accept="image/*" onChange={e=>handleImg(i,"imgBefore",e.target.files[0])} style={{fontSize:12,color:"#5A6B88",width:"100%"}}/></div><div style={{flex:1}}><label style={lbl}>📷 אחרי</label>{b.imgAfter&&<img src={b.imgAfter} style={{width:"100%",height:80,objectFit:"cover",borderRadius:10,marginBottom:8,border:"1px solid #E1ECFB"}}/>}<input type="file" accept="image/*" onChange={e=>handleImg(i,"imgAfter",e.target.files[0])} style={{fontSize:12,color:"#5A6B88",width:"100%"}}/></div></div></div>)}</div>}
    {tab==="areas"&&<div><h3 style={{fontSize:19,color:"#0B1E3F",marginBottom:18,fontWeight:900}}>🗺️ אזורים</h3><div style={box}><label style={lbl}>ערים</label><textarea style={{...inp,height:110,resize:"vertical"}} value={d.areas||""} onChange={e=>sd({...d,areas:e.target.value})}/></div></div>}
    {tab==="leads"&&<div><h3 style={{fontSize:19,color:"#0B1E3F",marginBottom:18,fontWeight:900}}>📋 לידים</h3>{leads.length===0?<p style={{color:"#5A6B88",fontWeight:500}}>אין לידים</p>:[...leads].reverse().map(l=><div key={l.id} style={box}><div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}><div><strong style={{color:"#0B1E3F",fontSize:15}}>{l.name}</strong> — <span style={{color:"#5A6B88",fontWeight:500}}>{l.phone}</span>{l.service&&<span style={{color:"#0B5ED7",fontWeight:700}}> · {l.service}</span>}</div><div style={{display:"flex",gap:6}}><a href={`https://wa.me/972${l.phone.replace(/^0/,"").replace(/-/g,"")}`} target="_blank" rel="noopener" style={{padding:"5px 10px",borderRadius:8,background:"#25D366",color:"#fff",fontSize:11,fontWeight:700}}>💬</a><button onClick={()=>{setLeads(leads.filter(x=>x.id!==l.id));sL(leads.filter(x=>x.id!==l.id));}} style={{padding:"5px 10px",borderRadius:8,background:"#FEE",border:"none",color:"#DC2626",fontSize:11,cursor:"pointer",fontWeight:700}}>🗑</button></div></div></div>)}</div>}
  </div>
</div>;}
