export default {
  async fetch(request, env) {

    const url = new URL(request.url)

    // =========================
    // 💾 SALVAR RESULTADO
    // =========================
    if (url.pathname === "/api/save") {

      const body = await request.json()

      if (!body.token) {
        return new Response("Token obrigatório", { status: 400 })
      }

 await env.RESULTS.put(
  body.token,
  JSON.stringify({
    ...body,
    created_at: Date.now()
  }),
  { expirationTtl: 86400 }
)

return new Response("OK")
}

// =========================
// 🔍 VER RESULTADO
// =========================
if (url.pathname.startsWith("/r/")) {

      const token = url.pathname.split("/r/")[1]

      const data = await env.RESULTS.get(token)

      if (!data) {
        return new Response(renderError(), {
      headers: { "Content-Type": "text/html; charset=UTF-8" }
        })
      }

      return new Response(renderApp(JSON.parse(data)), {
      headers: { "Content-Type": "text/html; charset=UTF-8" }
      })
    }

if (url.pathname === "/") {

  return new Response(renderHome(), {

    headers:{
      "Content-Type":"text/html; charset=UTF-8"
    }

  })

}

    return new Response("Not Found", { status: 404 })
  }
}

function renderHome(){

return `
<!DOCTYPE html>
<html lang="pt-br">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">

<title>Astro • Sistema Premium</title>

<meta name="theme-color" content="#020617">

<meta
name="description"
content="Sistema premium de consultas privadas com acesso instantâneo"
/>

<meta property="og:title" content="Astro Premium">
<meta property="og:description" content="Consultas premium instantâneas">
<meta property="og:type" content="website">

<link rel="preconnect" href="https://fonts.googleapis.com">

<link
href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
rel="stylesheet"
/>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

html{
scroll-behavior:smooth;
}

body{
font-family:'Inter',sans-serif;
background:
radial-gradient(circle at top left,
rgba(168,85,247,.15),
transparent 35%),

radial-gradient(circle at top right,
rgba(59,130,246,.12),
transparent 35%),

#020617;

color:#fff;
overflow-x:hidden;

-webkit-font-smoothing:antialiased;
text-rendering:optimizeLegibility;
}

/* =========================
BACKGROUND
========================= */

canvas{
position:fixed;
inset:0;
width:100%;
height:100%;
z-index:0;
pointer-events:none;
}

/* =========================
LAYOUT
========================= */

.container{
position:relative;
z-index:2;
width:100%;
max-width:1220px;
margin:auto;
padding:0 18px;
}

/* =========================
HEADER
========================= */

.header{

position:sticky;
top:0;

z-index:1000;

backdrop-filter:blur(18px);

background:rgba(2,6,23,.55);

border-bottom:
1px solid rgba(255,255,255,.05);

}

.header-wrap{

height:78px;

display:flex;
align-items:center;
justify-content:space-between;

}

.logo{

display:flex;
align-items:center;
gap:12px;

font-weight:800;
font-size:20px;
letter-spacing:-1px;
}

.logo-icon{

width:42px;
height:42px;

border-radius:14px;

display:flex;
align-items:center;
justify-content:center;

background:
linear-gradient(
135deg,
rgba(168,85,247,.25),
rgba(59,130,246,.25)
);

border:
1px solid rgba(255,255,255,.08);

box-shadow:
0 0 25px rgba(168,85,247,.25);

}

.header-right{
display:flex;
align-items:center;
gap:12px;
}

.mini-badge{

padding:8px 14px;

border-radius:999px;

font-size:11px;
font-weight:700;
letter-spacing:.7px;

background:
rgba(255,255,255,.04);

border:
1px solid rgba(255,255,255,.08);

color:#cbd5e1;
}

.header-btn{

height:44px;
padding:0 18px;

border-radius:14px;

display:flex;
align-items:center;
justify-content:center;

text-decoration:none;
color:#fff;

font-size:13px;
font-weight:600;

background:
linear-gradient(
135deg,
rgba(168,85,247,.24),
rgba(59,130,246,.24)
);

border:
1px solid rgba(255,255,255,.08);

transition:.25s;
}

.header-btn:hover{
transform:translateY(-2px);
}

/* =========================
HERO
========================= */

.hero{

position:relative;

padding-top:90px;
padding-bottom:90px;

display:grid;
grid-template-columns:1.1fr .9fr;
gap:40px;
align-items:center;
}

.hero-tag{

display:inline-flex;
align-items:center;
gap:8px;

padding:10px 16px;

border-radius:999px;

margin-bottom:22px;

font-size:11px;
font-weight:700;
letter-spacing:1px;

background:
rgba(255,255,255,.04);

border:
1px solid rgba(255,255,255,.08);

color:#d8b4fe;
}

.hero-title{

font-size:72px;
line-height:.95;

font-weight:800;

letter-spacing:-4px;

margin-bottom:22px;

max-width:720px;
}

.hero-title span{

background:
linear-gradient(
90deg,
#fff,
#c084fc,
#60a5fa
);

-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
}

.hero-sub{

font-size:17px;
line-height:1.8;

max-width:620px;

color:#94a3b8;

margin-bottom:28px;
}

.hero-actions{
display:flex;
gap:14px;
flex-wrap:wrap;
}

.btn{

height:58px;
padding:0 28px;

border-radius:18px;

display:flex;
align-items:center;
justify-content:center;

text-decoration:none;
color:#fff;

font-weight:700;
font-size:14px;

transition:.25s;
}

.btn-primary{

background:
linear-gradient(
135deg,
rgba(168,85,247,.35),
rgba(59,130,246,.35)
);

border:
1px solid rgba(255,255,255,.10);

box-shadow:
0 0 40px rgba(168,85,247,.25);
}

.btn-primary:hover{
transform:translateY(-4px);
}

.btn-secondary{

background:
rgba(255,255,255,.03);

border:
1px solid rgba(255,255,255,.08);
}

.btn-secondary:hover{
background:
rgba(255,255,255,.06);
}

/* =========================
MOCKUP
========================= */

.hero-side{
position:relative;
z-index:5;
}
.mockup{

position:relative;

border-radius:28px;

padding:22px;

background:
linear-gradient(
180deg,
rgba(15,23,42,.95),
rgba(2,6,23,.95)
);

border:
1px solid rgba(255,255,255,.08);

box-shadow:
0 40px 120px rgba(0,0,0,.75),
0 0 70px rgba(168,85,247,.18);

overflow:hidden;
}

.mockup{
position:relative;
z-index:1;
}

.mockup::before{

content:"";

position:absolute;
inset:-1px;

border-radius:inherit;

background:
radial-gradient(
500px circle at var(--mx,50%) var(--my,50%),
rgba(255,255,255,.08),
transparent 40%
);

opacity:0;
transition:.35s;
}

.mockup:hover::before{
opacity:1;
}

.mock-top{
display:flex;
gap:8px;
margin-bottom:22px;
}

.mock-dot{
width:10px;
height:10px;
border-radius:50%;
background:#334155;
}

.terminal{

background:#020617;

border-radius:18px;

padding:18px;

border:
1px solid rgba(255,255,255,.06);

min-height:330px;
}

.term-line{

font-size:13px;
line-height:2;

font-family:monospace;

color:#d1d5db;

opacity:0;

transform:translateY(6px);

animation:termAppear .5s forwards;
}

.term-line:nth-child(1){animation-delay:.2s}
.term-line:nth-child(2){animation-delay:.6s}
.term-line:nth-child(3){animation-delay:1s}
.term-line:nth-child(4){animation-delay:1.4s}
.term-line:nth-child(5){animation-delay:1.8s}
.term-line:nth-child(6){animation-delay:2.2s}

@keyframes termAppear{

to{
opacity:1;
transform:translateY(0);
}

}

.term-green{color:#4ade80}
.term-blue{color:#60a5fa}
.term-purple{color:#c084fc}

/* =========================
FLOATING CARDS
========================= */

.float-card{

position:absolute;
z-index:30;

padding:14px 16px;

border-radius:18px;

background:rgba(15,23,42,.92);

backdrop-filter:blur(18px);

border:1px solid rgba(255,255,255,.08);

box-shadow:
0 10px 40px rgba(0,0,0,.45);

animation:floatCard 4s ease-in-out infinite;

pointer-events:none;
}

.float-card small{
display:block;
opacity:.5;
font-size:10px;
margin-bottom:4px;
}

.float-card b{
font-size:14px;
}

.float-1{
top:-25px;
left:-25px;
}

.float-2{
bottom:-25px;
right:-25px;
animation-delay:1.2s;
}

@keyframes floatCard{

0%{transform:translateY(0px)}
50%{transform:translateY(-10px)}
100%{transform:translateY(0px)}

}

/* =========================
STATS
========================= */

.stats{

display:grid;
grid-template-columns:
repeat(auto-fit,minmax(220px,1fr));

gap:16px;

margin-bottom:90px;
}

.stat{

padding:24px;

border-radius:24px;

background:
rgba(15,23,42,.65);

backdrop-filter:blur(18px);

border:
1px solid rgba(255,255,255,.06);

transition:.25s;
}

.stat:hover{

transform:translateY(-5px);

box-shadow:
0 20px 50px rgba(0,0,0,.45);

}

.stat-number{

font-size:34px;
font-weight:800;
letter-spacing:-2px;

margin-bottom:8px;
}

.stat-text{
font-size:13px;
color:#94a3b8;
line-height:1.6;
}

/* =========================
SECTION
========================= */

.section{
margin-bottom:110px;
}

.section-top{
margin-bottom:32px;
}

.section-mini{

font-size:11px;
letter-spacing:1px;
font-weight:700;

color:#c084fc;

margin-bottom:10px;
}

.section-title{

font-size:46px;
line-height:1;

font-weight:800;

letter-spacing:-2px;

margin-bottom:14px;
}

.section-sub{

font-size:15px;
line-height:1.8;

color:#94a3b8;

max-width:720px;
}

/* =========================
FEATURES
========================= */

.features-grid{

display:grid;
grid-template-columns:
repeat(auto-fit,minmax(260px,1fr));

gap:18px;
}

.feature{

position:relative;

overflow:hidden;

padding:24px;

border-radius:26px;

background:
linear-gradient(
180deg,
rgba(15,23,42,.9),
rgba(2,6,23,.92)
);

border:
1px solid rgba(255,255,255,.06);

transition:.3s;
}

.feature:hover{

transform:
translateY(-6px);

border-color:
rgba(168,85,247,.25);

box-shadow:
0 25px 60px rgba(0,0,0,.55);

}

.feature-icon{

width:54px;
height:54px;

border-radius:18px;

display:flex;
align-items:center;
justify-content:center;

font-size:24px;

margin-bottom:18px;

background:
linear-gradient(
135deg,
rgba(168,85,247,.22),
rgba(59,130,246,.22)
);

}

.feature-title{

font-size:18px;
font-weight:700;

margin-bottom:10px;
}

.feature-text{

font-size:13px;
line-height:1.7;

color:#94a3b8;
}

/* =========================
COMPARISON
========================= */

.compare{

overflow:auto;

border-radius:26px;

background:
rgba(15,23,42,.75);

border:
1px solid rgba(255,255,255,.06);
}

table{
width:100%;
border-collapse:collapse;
min-width:700px;
}

th,td{
padding:18px;
text-align:left;
font-size:14px;
}

th{
background:
rgba(255,255,255,.03);
}

tr{
border-bottom:
1px solid rgba(255,255,255,.05);
}

.vip{
color:#c084fc;
font-weight:700;
}

.free{
color:#94a3b8;
}

/* =========================
SOCIAL
========================= */

.social-grid{

display:grid;
grid-template-columns:
repeat(auto-fit,minmax(280px,1fr));

gap:18px;
}

.social{

padding:24px;

border-radius:24px;

background:
rgba(15,23,42,.72);

border:
1px solid rgba(255,255,255,.06);

transition:.25s;
}

.social:hover{
transform:translateY(-4px);
}

.stars{
margin-bottom:14px;
color:#fde68a;
}

.social-text{

font-size:14px;
line-height:1.8;

color:#d1d5db;

margin-bottom:16px;
}

.social-user{

font-size:13px;
color:#94a3b8;
}

/* =========================
PLANS
========================= */

.plan-box{

display:grid;
grid-template-columns:
repeat(auto-fit,minmax(290px,1fr));

gap:22px;
}

.plan{

position:relative;

overflow:hidden;

padding:28px;

border-radius:30px;

background:
linear-gradient(
180deg,
rgba(15,23,42,.95),
rgba(2,6,23,.96)
);

border:
1px solid rgba(255,255,255,.06);

transition:.35s;
}

.plan:hover{

transform:
translateY(-8px);

box-shadow:
0 30px 80px rgba(0,0,0,.65);

}

.plan-premium{

border:
1px solid rgba(168,85,247,.32);

box-shadow:
0 0 60px rgba(168,85,247,.14);
}

.plan-tag{

display:inline-flex;

padding:8px 12px;

border-radius:999px;

font-size:10px;
font-weight:700;
letter-spacing:1px;

margin-bottom:18px;

background:
rgba(255,255,255,.05);

border:
1px solid rgba(255,255,255,.08);
}

.plan-title{

font-size:32px;
font-weight:800;

letter-spacing:-2px;

margin-bottom:12px;
}

.price{

display:flex;
align-items:flex-end;
gap:10px;

margin-bottom:22px;
}

.old{

font-size:14px;
opacity:.35;
text-decoration:line-through;
}

.new{

font-size:48px;
line-height:1;
font-weight:800;
letter-spacing:-3px;
}

.new small{
font-size:14px;
opacity:.6;
}

.features{
display:flex;
flex-direction:column;
gap:12px;
}

.features div{
font-size:14px;
color:#d1d5db;
}

.live-buy{

margin-top:20px;

font-size:12px;

color:#fca5a5;
}

.stock{

height:10px;

border-radius:999px;

overflow:hidden;

background:
rgba(255,255,255,.05);

margin-top:14px;
}

.stock-fill{

height:100%;
width:87%;

background:
linear-gradient(
90deg,
#c084fc,
#60a5fa
);

animation:stockMove 2s linear infinite;
}

@keyframes stockMove{

0%{filter:brightness(1)}
50%{filter:brightness(1.25)}
100%{filter:brightness(1)}

}

.plan-btn{

width:100%;
height:56px;

margin-top:24px;

border:none;
cursor:pointer;

border-radius:18px;

color:#fff;

font-size:14px;
font-weight:700;

background:
linear-gradient(
135deg,
rgba(168,85,247,.35),
rgba(59,130,246,.35)
);

border:
1px solid rgba(255,255,255,.08);

transition:.25s;
}

.plan-btn:hover{
transform:translateY(-3px);
}

/* =========================
FAQ
========================= */

.faq-wrap{
display:flex;
flex-direction:column;
gap:16px;
}

.faq{

border-radius:22px;

overflow:hidden;

background:
rgba(15,23,42,.72);

border:
1px solid rgba(255,255,255,.06);
}

.faq-head{

padding:22px;

display:flex;
justify-content:space-between;
align-items:center;

cursor:pointer;
}

.faq-title{
font-weight:600;
}

.faq-body{

max-height:0;
overflow:hidden;

transition:.35s ease;
}

.faq-content{

padding:0 22px 22px;

font-size:14px;
line-height:1.8;

color:#94a3b8;
}

.faq.active .faq-body{
max-height:220px;
}

/* =========================
CTA FINAL
========================= */

.cta{

position:relative;

overflow:hidden;

padding:60px;

border-radius:36px;

background:
linear-gradient(
135deg,
rgba(168,85,247,.22),
rgba(59,130,246,.22)
);

border:
1px solid rgba(255,255,255,.08);

text-align:center;

margin-bottom:90px;
}

.cta::before{

content:"";

position:absolute;

width:500px;
height:500px;

border-radius:50%;

background:
radial-gradient(
circle,
rgba(255,255,255,.08),
transparent 70%
);

top:-250px;
right:-120px;
}

.cta-title{

font-size:54px;
line-height:1;

font-weight:800;

letter-spacing:-3px;

margin-bottom:18px;
}

.cta-sub{

max-width:700px;

margin:auto;

font-size:16px;
line-height:1.8;

color:#d1d5db;

margin-bottom:28px;
}

.cta-btn{

display:inline-flex;

height:62px;
padding:0 34px;

border-radius:20px;

align-items:center;
justify-content:center;

text-decoration:none;
color:#fff;

font-size:15px;
font-weight:700;

background:
linear-gradient(
135deg,
rgba(255,255,255,.14),
rgba(255,255,255,.08)
);

border:
1px solid rgba(255,255,255,.12);

transition:.25s;
}

.cta-btn:hover{
transform:translateY(-4px);
}

/* =========================
MODAL
========================= */

.modal{
position:fixed;
inset:0;

display:flex;
align-items:center;
justify-content:center;

padding:20px;

background:
rgba(2,6,23,.82);

backdrop-filter:blur(20px);

opacity:0;
visibility:hidden;

transition:.35s;

z-index:9999;
}

.modal.show{
opacity:1;
visibility:visible;
}

.modal-box{

position:relative;

width:100%;
max-width:420px;

padding:26px;

border-radius:30px;

background:
linear-gradient(
180deg,
rgba(15,23,42,.96),
rgba(2,6,23,.98)
);

border:
1px solid rgba(255,255,255,.08);

box-shadow:
0 40px 120px rgba(0,0,0,.8),
0 0 60px rgba(168,85,247,.18);

transform:scale(.92);

transition:.35s;
}

.modal.show .modal-box{
transform:scale(1);
}

.modal-title{

font-size:24px;
font-weight:800;

margin-bottom:20px;
}

.modal-plan{

padding:16px;

border-radius:18px;

background:
rgba(255,255,255,.04);

border:
1px solid rgba(255,255,255,.06);

margin-bottom:18px;
}

.modal-plan small{
display:block;
opacity:.5;
margin-bottom:6px;
}

.pix-label{

font-size:12px;
opacity:.6;

margin-bottom:10px;
}

.pix-box{

display:flex;
align-items:center;
gap:12px;

padding:14px;

border-radius:18px;

background:
rgba(255,255,255,.04);

border:
1px solid rgba(255,255,255,.06);

margin-bottom:18px;
}

.pix-key{

flex:1;

font-size:12px;
line-height:1.6;

word-break:break-all;
}

.copy-pix{

width:48px;
height:48px;

border:none;
cursor:pointer;

border-radius:16px;

color:#fff;
font-size:18px;

background:
rgba(255,255,255,.06);
}

.modal-text{

font-size:14px;
line-height:1.8;

color:#cbd5e1;

margin-bottom:22px;
}

.support-btn{

height:56px;

display:flex;
align-items:center;
justify-content:center;

border-radius:18px;

text-decoration:none;
color:#fff;

font-weight:700;

background:
linear-gradient(
135deg,
rgba(168,85,247,.32),
rgba(59,130,246,.32)
);

border:
1px solid rgba(255,255,255,.08);
}

/* =========================
RESPONSIVE
========================= */

@media(max-width:980px){

.hero{
grid-template-columns:1fr;
}

.hero-title{
font-size:54px;
}

.cta-title{
font-size:42px;
}

}

@media(max-width:700px){

.hero-title{
font-size:42px;
letter-spacing:-2px;
}

.section-title{
font-size:34px;
}

.cta{
padding:38px 24px;
}

.cta-title{
font-size:34px;
}

.header-wrap{
height:72px;
}

.header-right .mini-badge{
display:none;
}

}

/* =========================
   🚀 ASTRO TOPBAR
========================= */

.topbar{

  position:sticky;
  top:14px;

  z-index:999;

  display:flex;
  align-items:center;
  justify-content:space-between;

  flex-wrap:wrap;

  gap:16px;

  width:100%;

  margin-bottom:26px;

  padding:16px;

  border-radius:24px;

  background:
    linear-gradient(
      135deg,
      rgba(15,23,42,.72),
      rgba(15,23,42,.45)
    );

  border:
    1px solid rgba(255,255,255,.06);

  backdrop-filter:blur(24px);

  box-shadow:
    0 10px 50px rgba(0,0,0,.35);

  overflow:hidden;
}

.topbar::before{

  content:"";

  position:absolute;
  inset:-1px;

  border-radius:inherit;

  background:
    radial-gradient(
      600px circle at var(--mx,50%) var(--my,50%),
      rgba(255,255,255,.08),
      transparent 40%
    );

  opacity:0;
  transition:.35s;
}

.topbar:hover::before{
  opacity:1;
}

.topbar-blur{

  position:absolute;

  top:-100px;
  right:-80px;

  width:240px;
  height:240px;

  border-radius:50%;

  background:
    radial-gradient(
      circle,
      rgba(168,85,247,.20),
      transparent 70%
    );

  filter:blur(40px);
}

.topbar-left,
.topbar-right{
  position:relative;
  z-index:2;
}

.topbar-right{

  display:flex;
  align-items:center;
  justify-content:flex-end;

  flex-wrap:wrap;

  gap:10px;

  flex:1;

  min-width:0;
}

.topbar-left{
  flex-shrink:0;
}

.astro-logo{
  display:flex;
  align-items:center;
  gap:14px;
}

.astro-icon{

  width:48px;
  height:48px;

  border-radius:18px;

  display:flex;
  align-items:center;
  justify-content:center;

  font-size:18px;

  background:
    linear-gradient(
      135deg,
      rgba(168,85,247,.25),
      rgba(59,130,246,.25)
    );

  border:
    1px solid rgba(255,255,255,.08);

  box-shadow:
    0 0 25px rgba(168,85,247,.25);

  animation:astroRotate 7s linear infinite;
}

@keyframes astroRotate{

  0%{
    transform:rotate(0deg);
  }

  100%{
    transform:rotate(360deg);
  }

}

.astro-mini{

  font-size:10px;
  letter-spacing:1.5px;

  color:#c084fc;

  margin-bottom:3px;

  font-weight:700;
}

.astro-title{

  font-size:16px;
  font-weight:700;

  color:#fff;
}

.topbar-link{

  height:42px;
  padding:0 16px;

  border-radius:14px;

  display:flex;
  align-items:center;
  justify-content:center;

  text-decoration:none;

  color:#cbd5e1;

  font-size:13px;
  font-weight:600;

  background:
    rgba(255,255,255,.03);

  border:
    1px solid rgba(255,255,255,.05);

  transition:.25s;
}

.topbar-link:hover{

  color:#fff;

  transform:translateY(-2px);

  background:
    rgba(255,255,255,.06);
}

.topbar-btn{

  min-height:44px;

  padding:0 18px;

  border-radius:16px;

  display:flex;
  align-items:center;
  justify-content:center;

  text-decoration:none;

  color:#fff;

  font-size:13px;
  font-weight:700;

  white-space:nowrap;

  flex-shrink:0;

  background:
    linear-gradient(
      135deg,
      rgba(168,85,247,.32),
      rgba(59,130,246,.32)
    );

  border:
    1px solid rgba(255,255,255,.08);

  box-shadow:
    0 0 25px rgba(168,85,247,.14);

  transition:
    transform .25s ease,
    box-shadow .25s ease,
    background .25s ease;
}

.topbar-btn:hover{

  transform:
    translateY(-3px)
    scale(1.02);

  box-shadow:
    0 12px 40px rgba(168,85,247,.22);

  background:
    linear-gradient(
      135deg,
      rgba(168,85,247,.40),
      rgba(59,130,246,.40)
    );
}

@media(max-width:700px){

  .topbar{

    flex-direction:column;
    align-items:stretch;

    padding:14px;
  }

  .topbar-left{

    width:100%;

    display:flex;
    justify-content:center;
  }

  .topbar-right{

    width:100%;

    display:grid;

    grid-template-columns:
      repeat(2,1fr);

    gap:10px;
  }

  .topbar-link,
  .topbar-btn{

    width:100%;

    justify-content:center;
  }

}

/* =========================
   ✨ TOPBAR PARTICLES
========================= */

.topbar-particles{

  position:absolute;
  inset:0;

  overflow:hidden;

  pointer-events:none;

  z-index:1;
}

.topbar-particles span{

  position:absolute;

  bottom:-20px;

  width:3px;
  height:3px;

  border-radius:50%;

  background:
    rgba(255,255,255,.65);

  box-shadow:
    0 0 10px rgba(168,85,247,.55),
    0 0 18px rgba(59,130,246,.35);

  opacity:.7;

  animation:
    topbarFloat linear infinite;
}

.topbar-particles span::before{

  content:"";

  position:absolute;

  inset:-2px;

  border-radius:inherit;

  background:
    rgba(168,85,247,.25);

  filter:blur(4px);
}

@keyframes topbarFloat{

  0%{

    transform:
      translateY(0)
      scale(.7);

    opacity:0;
  }

  10%{
    opacity:.7;
  }

  100%{

    transform:
      translateY(-140px)
      scale(1.15);

    opacity:0;
  }
}

</style>
</head>

<body>

<canvas id="bg"></canvas>

<div class="container">

<header class="topbar">

  <div class="topbar-blur"></div>

<div class="topbar-particles">

  <span style="left:3%;animation-duration:9s"></span>
  <span style="left:8%;animation-duration:13s"></span>
  <span style="left:14%;animation-duration:7s"></span>
  <span style="left:20%;animation-duration:11s"></span>
  <span style="left:27%;animation-duration:8s"></span>
  <span style="left:34%;animation-duration:15s"></span>
  <span style="left:40%;animation-duration:9s"></span>
  <span style="left:48%;animation-duration:12s"></span>
  <span style="left:55%;animation-duration:10s"></span>
  <span style="left:63%;animation-duration:14s"></span>
  <span style="left:71%;animation-duration:8s"></span>
  <span style="left:78%;animation-duration:13s"></span>
  <span style="left:85%;animation-duration:11s"></span>
  <span style="left:92%;animation-duration:9s"></span>

</div>

  <div class="topbar-left">

    <div class="astro-logo">

      <div class="astro-icon">
        ✦
      </div>

      <div class="astro-logo-text">

        <div class="astro-mini">
          ASTRO SYSTEM
        </div>

        <div class="astro-title">
          CONSULTAS PREMIUM
        </div>

      </div>

    </div>

  </div>

  <div class="topbar-right">

    <a
      href="#plans"
      class="topbar-link"
    >
      Planos
    </a>

    <a
      href="https://t.me/consultasdedados_bot"
      target="_blank"
      class="topbar-btn"
    >
      Abrir Bot
    </a>

  </div>

</header>

<div class="container">

<!-- HERO -->

<section class="hero">

<div>

<div class="hero-tag">
✦ ACESSO PRIVADO • LIBERAÇÃO IMEDIATA
</div>

<div class="hero-title">
Sistema premium de
<span>consultas privadas</span>
com acesso instantâneo
</div>

<div class="hero-sub">

Infraestrutura premium com consultas rápidas,
dados integrados, respostas instantâneas
e recursos avançados desbloqueados em segundos.

</div>

<div class="hero-actions">

<a
href="https://t.me/consultasdedados_bot"
target="_blank"
class="btn btn-primary"
>
ABRIR BOT
</a>

<a
href="#plans"
class="btn btn-secondary"
>
VER PLANOS
</a>

</div>

</div>

<div class="hero-side">

<div class="float-card float-1">
<small>CONSULTAS</small>
<b>+48.291 realizadas</b>
</div>

<div class="float-card float-2">
<small>UPTIME</small>
<b>99.9% online</b>
</div>

<div class="mockup" id="mockup">

<div class="mock-top">
<div class="mock-dot"></div>
<div class="mock-dot"></div>
<div class="mock-dot"></div>
</div>

<div class="terminal">

<div class="term-line">
<span class="term-purple">[ASTRO]</span>
Inicializando gateway...
</div>

<div class="term-line">
<span class="term-green">[✓]</span>
CPF localizado
</div>

<div class="term-line">
<span class="term-green">[✓]</span>
Telefones vinculados encontrados
</div>

<div class="term-line">
<span class="term-blue">[+]</span>
Score sincronizado
</div>

<div class="term-line">
<span class="term-blue">[+]</span>
Dados premium carregados
</div>

<div class="term-line">
<span class="term-purple">[✓]</span>
Acesso autorizado
</div>

</div>

</div>

</div>

</section>

<!-- STATS -->

<section class="stats">

<div class="stat">
<div class="stat-number">48K+</div>
<div class="stat-text">
Consultas processadas em tempo real
com estabilidade máxima.
</div>
</div>

<div class="stat">
<div class="stat-number"><2s</div>
<div class="stat-text">
Velocidade média de resposta
em consultas premium.
</div>
</div>

<div class="stat">
<div class="stat-number">99.9%</div>
<div class="stat-text">
Infraestrutura otimizada com
uptime contínuo.
</div>
</div>

<div class="stat">
<div class="stat-number">24/7</div>
<div class="stat-text">
Sistema disponível sem pausas
ou filas de liberação.
</div>
</div>

</section>

<!-- FEATURES -->

<section class="section">

<div class="section-top">

<div class="section-mini">
RECURSOS
</div>

<div class="section-title">
Consultas disponíveis
</div>

<div class="section-sub">

Sistema integrado com múltiplas fontes,
respostas rápidas e visual premium.

</div>

</div>

<div class="features-grid">

<div class="feature">
<div class="feature-icon">🪪</div>
<div class="feature-title">CPF</div>
<div class="feature-text">
Dados cadastrais completos,
situação, vínculos e registros integrados.
</div>
</div>

<div class="feature">
<div class="feature-icon">📱</div>
<div class="feature-title">TELEFONE</div>
<div class="feature-text">
Localização de números vinculados,
operadoras e dados associados.
</div>
</div>

<div class="feature">
<div class="feature-icon">🚘</div>
<div class="feature-title">PLACA</div>
<div class="feature-text">
Consultas veiculares com
dados vinculados e histórico.
</div>
</div>

<div class="feature">
<div class="feature-icon">🏢</div>
<div class="feature-title">CNPJ</div>
<div class="feature-text">
Empresas, sócios, situação cadastral
e informações empresariais.
</div>
</div>

<div class="feature">
<div class="feature-icon">👤</div>
<div class="feature-title">NOME</div>
<div class="feature-text">
Busca nominal integrada com
múltiplas fontes sincronizadas.
</div>
</div>

<div class="feature">
<div class="feature-icon">👨‍👩‍👧</div>
<div class="feature-title">PARENTES</div>
<div class="feature-text">
Possíveis vínculos familiares,
conexões e relações registradas.
</div>
</div>

<div class="feature">
<div class="feature-icon">🏘</div>
<div class="feature-title">VIZINHOS</div>
<div class="feature-text">
Informações relacionadas à
região e proximidade residencial.
</div>
</div>

<div class="feature">
<div class="feature-icon">🛒</div>
<div class="feature-title">COMPRAS</div>
<div class="feature-text">
Registros vinculados e
dados complementares disponíveis.
</div>
</div>

<div class="feature">
<div class="feature-icon">💳</div>
<div class="feature-title">SCORE</div>
<div class="feature-text">
Informações financeiras
e indicadores disponíveis.
</div>
</div>

<div class="feature">
<div class="feature-icon">🌐</div>
<div class="feature-title">REDES SOCIAIS</div>
<div class="feature-text">
Perfis públicos vinculados
e dados conectados.
</div>
</div>

<div class="feature">
<div class="feature-icon">📍</div>
<div class="feature-title">ENDEREÇOS</div>
<div class="feature-text">
Histórico residencial,
localizações e vínculos.
</div>
</div>

<div class="feature">
<div class="feature-icon">🔒</div>
<div class="feature-title">DADOS PREMIUM</div>
<div class="feature-text">
Recursos avançados liberados
para usuários VIP.
</div>
</div>

</div>

</section>

<!-- COMPARISON -->

<section class="section">

<div class="section-top">

<div class="section-mini">
COMPARAÇÃO
</div>

<div class="section-title">
FREE vs VIP
</div>

</div>

<div class="compare">

<table>

<tr>
<th>RECURSO</th>
<th>FREE</th>
<th>VIP</th>
</tr>

<tr>
<td>Consultas básicas</td>
<td class="free">✓</td>
<td class="vip">✓</td>
</tr>

<tr>
<td>Consultas premium</td>
<td class="free">✕</td>
<td class="vip">✓</td>
</tr>

<tr>
<td>Velocidade máxima</td>
<td class="free">✕</td>
<td class="vip">✓</td>
</tr>

<tr>
<td>Sem limite</td>
<td class="free">✕</td>
<td class="vip">✓</td>
</tr>

<tr>
<td>Atualizações</td>
<td class="free">✕</td>
<td class="vip">✓</td>
</tr>

<tr>
<td>Prioridade</td>
<td class="free">✕</td>
<td class="vip">✓</td>
</tr>

</table>

</div>

</section>

<!-- SOCIAL -->

<section class="section">

<div class="section-top">

<div class="section-mini">
PROVA SOCIAL
</div>

<div class="section-title">
Quem usa recomenda
</div>

</div>

<div class="social-grid">

<div class="social">

<div class="stars">
★★★★★
</div>

<div class="social-text">
“Sistema extremamente rápido.
Dados completos carregando em segundos.”
</div>

<div class="social-user">
— Rafael M.
</div>

</div>

<div class="social">

<div class="stars">
★★★★★
</div>

<div class="social-text">
“Melhor plataforma privada que já utilizei.
Interface absurda.”
</div>

<div class="social-user">
— Lucas T.
</div>

</div>

<div class="social">

<div class="stars">
★★★★★
</div>

<div class="social-text">
“VIP vale muito.
Velocidade e recursos premium liberados na hora.”
</div>

<div class="social-user">
— Gabriel S.
</div>

</div>

</div>

</section>

<!-- PLANS -->

<section class="section" id="plans">

<div class="section-top">

<div class="section-mini">
PLANOS
</div>

<div class="section-title">
Escolha seu acesso
</div>

</div>

<div class="plan-box">

<div class="plan">

<div class="plan-tag">
ACESSO RÁPIDO
</div>

<div class="plan-title">
Diário
</div>

<div class="price">
<div class="new">
R$14<small>,90</small>
</div>
</div>

<div class="features">
<div>✦ Acesso por 24 horas</div>
<div>✦ Consultas básicas</div>
<div>✦ Liberação imediata</div>
<div>✦ Suporte rápido</div>
</div>

<div class="live-buy">
🔥 12 acessos liberados hoje
</div>

<div class="stock">
<div class="stock-fill"></div>
</div>

<button
class="plan-btn"
onclick="openPayment('Plano Diário • R$14,90')"
>
Desbloquear
</button>

</div>

<div class="plan">

<div class="plan-tag">
MAIS ESCOLHIDO
</div>

<div class="plan-title">
Semanal
</div>

<div class="price">
<div class="new">
R$24<small>,90</small>
</div>
</div>

<div class="features">
<div>✦ Consultas ilimitadas</div>
<div>✦ Prioridade máxima</div>
<div>✦ Recursos premium</div>
<div>✦ Atualizações liberadas</div>
</div>

<div class="live-buy">
🔥 31 acessos liberados hoje
</div>

<div class="stock">
<div class="stock-fill"></div>
</div>

<button
class="plan-btn"
onclick="openPayment('Plano Semanal • R$24,90')"
>
Desbloquear
</button>

</div>

<div class="plan plan-premium">

<div class="plan-tag">
VITALÍCIO
</div>

<div class="plan-title">
Premium
</div>

<div class="price">

<div class="old">
R$50
</div>

<div class="new">
R$20<small>,90</small>
</div>

</div>

<div class="features">
<div>✦ Acesso vitalício</div>
<div>✦ Sem limites</div>
<div>✦ Tudo desbloqueado</div>
<div>✦ Recursos premium</div>
<div>✦ Atualizações futuras grátis</div>
<div>✦ Prioridade absoluta</div>
</div>

<div class="live-buy">
🔥 53 desbloqueios hoje
</div>

<div class="stock">
<div class="stock-fill"></div>
</div>

<button
class="plan-btn"
onclick="openPayment('Plano Vitalício • R$20,90')"
>
🚀 DESBLOQUEAR
</button>

</div>

</div>

</section>

<!-- FAQ -->

<section class="section">

<div class="section-top">

<div class="section-mini">
FAQ
</div>

<div class="section-title">
Dúvidas frequentes
</div>

</div>

<div class="faq-wrap">

<div class="faq">

<div class="faq-head" onclick="toggleFaq(this)">
<div class="faq-title">
O acesso é liberado na hora?
</div>
<div>+</div>
</div>

<div class="faq-body">
<div class="faq-content">
Após o envio do comprovante o acesso
é liberado rapidamente.
</div>
</div>

</div>

<div class="faq">

<div class="faq-head" onclick="toggleFaq(this)">
<div class="faq-title">
Funciona pelo celular?
</div>
<div>+</div>
</div>

<div class="faq-body">
<div class="faq-content">
Sim. O sistema funciona perfeitamente
em dispositivos móveis.
</div>
</div>

</div>

<div class="faq">

<div class="faq-head" onclick="toggleFaq(this)">
<div class="faq-title">
O VIP possui limites?
</div>
<div>+</div>
</div>

<div class="faq-body">
<div class="faq-content">
Os planos premium possuem recursos
e consultas liberadas.
</div>
</div>

</div>

</div>

</section>

<!-- CTA -->

<section class="cta">

<div class="cta-title">
Seu acesso pode ser liberado agora
</div>

<div class="cta-sub">

Entre no sistema premium e desbloqueie
todos os recursos disponíveis.

</div>

<a
href="#plans"
class="cta-btn"
>
DESBLOQUEAR ACESSO PREMIUM
</a>

</section>

</div>

<!-- MODAL -->

<div class="modal" id="paymentModal">

<div class="modal-box">

<div class="modal-title">
Astro Premium
</div>

<div class="modal-plan">

<small>Plano selecionado</small>

<b id="modalPlanName">
VIP
</b>

</div>

<div class="pix-label">
Chave PIX
</div>

<div class="pix-box">

<div class="pix-key">
f0d0f3b1-8776-4f06-a254-b6ea3686f71a
</div>

<button
class="copy-pix"
onclick="copyPix()"
>
⧉
</button>

</div>

<div class="modal-text">

Após efetuar o pagamento,
envie o comprovante para o suporte
e seu acesso será liberado imediatamente.

</div>

<a
href="https://t.me/puxardados5"
target="_blank"
class="support-btn"
>
Já paguei
</a>

</div>

</div>

<script>

/* =========================
PARTICLES
========================= */

const c = document.getElementById("bg");
const ctx = c.getContext("2d");

function resize(){

c.width = innerWidth;
c.height = innerHeight;

}

resize();

addEventListener("resize",resize);

const particles = [];

for(let i=0;i<180;i++){

particles.push({

x:Math.random()*c.width,
y:Math.random()*c.height,

r:Math.random()*2,

o:Math.random()*0.4,

s:Math.random()*0.4+.05

})

}

function render(){

ctx.clearRect(0,0,c.width,c.height);

for(const p of particles){

p.y += p.s;

if(p.y > c.height){

p.y = -10;
p.x = Math.random()*c.width;

}

ctx.beginPath();

ctx.fillStyle =
"rgba(255,255,255,"+p.o+")";

ctx.arc(p.x,p.y,p.r,0,Math.PI*2);

ctx.fill();

}

requestAnimationFrame(render);

}

render();

/* =========================
FAQ
========================= */

function toggleFaq(el){

const faq = el.parentElement;

faq.classList.toggle("active");

}

/* =========================
PAYMENT
========================= */

function openPayment(plan){

document
.getElementById("modalPlanName")
.innerText = plan;

document
.getElementById("paymentModal")
.classList.add("show");

}

function copyPix(){

navigator.clipboard.writeText(
"f0d0f3b1-8776-4f06-a254-b6ea3686f71a"
);

const btn =
document.querySelector(".copy-pix");

btn.innerText = "✓";

setTimeout(()=>{
btn.innerText = "⧉";
},1400);

}

document
.getElementById("paymentModal")
.addEventListener("click",e=>{

if(e.target.id==="paymentModal"){

document
.getElementById("paymentModal")
.classList.remove("show");

}

});

/* =========================
MOCKUP EFFECT
========================= */

const mockup =
document.getElementById("mockup");

mockup.addEventListener("mousemove",e=>{

const rect =
mockup.getBoundingClientRect();

const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

mockup.style.setProperty("--mx",x+"px");
mockup.style.setProperty("--my",y+"px");

});

</script>

</body>
</html>
`
}

// =========================
// 🧠 RENDER UNIVERSAL
// =========================
function renderApp(data){

  function normalize(res){
    if (!res) return []
    if (Array.isArray(res)) return res
    if (typeof res === "object") return [res]
    return [{ valor: res }]
  }

  function formatLabel(key){
    return key
      .replace(/_/g," ")
      .replace(/\b\w/g,l=>l.toUpperCase())
  }

function renderFields(obj){

  // FORMATO NOVO
  if(obj.resultado && Array.isArray(obj.resultado)){

    let html = ""

    obj.resultado.forEach(secao=>{

      html += `
      <div class="result-block">

        <div class="result-title">
          ✦ ${secao.secao || "RESULTADO"}
        </div>

        <div class="result-lines">
      `

      if(secao.dados && Array.isArray(secao.dados)){

        secao.dados.forEach(item=>{

          html += `
          <div class="premium-field">

            <div class="premium-label">
              ${item.campo || "INFO"}
            </div>

            <div class="premium-value">
              ${item.valor || "NÃO ENCONTRADO"}
            </div>

          </div>
          `
        })

      }

      html += `
        </div>
      </div>
      `
    })

    return html
  }

  // FORMATO ANTIGO
  if(obj.valor){
    return `
      <div class="raw-html">
        ${obj.valor}
      </div>
    `
  }

  let html = ""

  const titulo = obj.titulo || "RESULTADO"
  const conteudo = obj.conteudo || ""

  const linhas = conteudo.split("\n")

  html += `
  <div class="result-block">

    <div class="result-title">
      ✦ ${titulo}
    </div>

    <div class="result-lines">
  `

  linhas.forEach(linha=>{

    linha = linha.trim()

    if(!linha) return

    if(linha.includes(":")){

      const parts = linha.split(":")
      const label = parts.shift()
      const value = parts.join(":").trim()

      html += `
      <div class="premium-field">

        <div class="premium-label">
          ${label}
        </div>

        <div class="premium-value">
          ${value}
        </div>

      </div>
      `

    }else{

      html += `
      <div class="premium-text">
        ${linha}
      </div>
      `
    }

  })

  html += `
    </div>
  </div>
  `

  return html
}

  const isVip = data.plano === "vip"

  const results = normalize(data.resultado)

  return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Resultado</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

<style>
*{margin:0;padding:0;box-sizing:border-box}

body{
  position:relative;
  overflow-x:hidden;
  font-family:'Inter',sans-serif;
  background:
  ${isVip
    ? `
    radial-gradient(circle at 10% 10%, rgba(168,85,247,0.16), transparent 40%),
    radial-gradient(circle at 90% 0%, rgba(139,92,246,0.12), transparent 50%),
    #020617
    `
    : `
    radial-gradient(circle at 10% 10%, rgba(34,197,94,0.10), transparent 40%),
    radial-gradient(circle at 90% 0%, rgba(34,197,94,0.05), transparent 50%),
    #020617
    `
  };

  color:#e5e7eb;
  display:flex;
  justify-content:center;

  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.container{
  position:relative;
  z-index:2;
  width:100%;
  max-width:820px;
  padding:20px 14px;
}

.header{
  display:flex;
  justify-content:space-between;
  align-items:center;

  margin-bottom:18px;

  padding:16px 18px;

  border-radius:20px;

  background:rgba(15,23,42,0.45);

  border:1px solid rgba(255,255,255,0.05);

  backdrop-filter:blur(18px);
}

.header-left{
  display:flex;
  flex-direction:column;
}

.top-label{
  font-size:11px;
  letter-spacing:.4px;
  opacity:.55;
  margin-bottom:2px;
}

.plan-name{
  font-size:22px;
  font-weight:700;
  letter-spacing:.5px;

  background:${isVip
    ? "linear-gradient(90deg,#ffffff,#d8b4fe)"
    : "linear-gradient(90deg,#ffffff,#86efac)"
  };

  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.logo{
  font-size:15px;
  font-weight:500;
  opacity:.8;
}

.badge{
  position:relative;
  overflow:hidden;

  font-size:11px;
  padding:7px 14px;
  border-radius:999px;

  font-weight:600;
  letter-spacing:.5px;

  backdrop-filter:blur(12px);

  transition:.3s;
}

/* VIP */
.badge.vip{
  color:#e9d5ff;

  background:
    linear-gradient(
      135deg,
      rgba(168,85,247,.22),
      rgba(139,92,246,.12)
    );

  border:1px solid rgba(168,85,247,.45);

box-shadow:
  0 0 18px rgba(168,85,247,.16),
    inset 0 0 12px rgba(255,255,255,.04);
}

/* FREE */
.badge.free{
  color:#dcfce7;

  background:
    linear-gradient(
      135deg,
      rgba(34,197,94,.22),
      rgba(16,185,129,.12)
    );

  border:1px solid rgba(74,222,128,.35);

  box-shadow:
    0 0 18px rgba(34,197,94,.12),
    inset 0 0 10px rgba(255,255,255,.03);
}

/* ✨ estrelas VIP */
.badge.vip::before,
.badge.vip::after{
  content:"✦";
  position:absolute;

  font-size:10px;
  color:#fff;

  opacity:.8;

  animation: sparkle 2.5s linear infinite;
}

.badge.vip::before{
  top:2px;
  left:8px;
}

.badge.vip::after{
  bottom:1px;
  right:8px;
  animation-delay:1.2s;
}

@keyframes sparkle{
  0%{
    transform:scale(.6) rotate(0deg);
    opacity:0;
  }

  50%{
    transform:scale(1.2) rotate(20deg);
    opacity:1;
  }

  100%{
    transform:scale(.6) rotate(0deg);
    opacity:0;
  }
}

/* CARD */
.card{
  width:100%;

  background: rgba(15,23,42,0.58);
  backdrop-filter: blur(20px);

  overflow:hidden;
  isolation:isolate;

  border-radius:20px;
  padding:18px;
  margin-bottom:14px;

  border:1px solid rgba(255,255,255,0.05);

  transition:.25s ease;
}

.card::before{

  content:"";

  position:absolute;
  inset:-1px;

  border-radius:inherit;

  background:
    radial-gradient(
      500px circle at var(--mx,50%) var(--my,50%),
      rgba(255,255,255,.07),
      transparent 40%
    );

  opacity:0;

  transition:.35s;
}

.card:hover::before{
  opacity:1;
}

.card{

  opacity:0;
  transform:
    translateY(30px)
    scale(.98);

  transition:
    opacity .6s ease,
    transform .6s ease;
}

.card.show{

  opacity:1;

  transform:
    translateY(0)
    scale(1);
}

.card:hover{
  transform:translateY(-4px);
border-color:${isVip
? "rgba(168,85,247,.35)"
: "rgba(34,197,94,.35)"
};

  box-shadow:
    0 10px 40px rgba(0,0,0,0.6),
inset 0 0 20px ${isVip
? "rgba(168,85,247,.08)"
: "rgba(34,197,94,.08)"
};
}

/* TEXT */
.title{font-size:14px;font-weight:500;margin-bottom:6px}
.muted{font-size:12px;color:#94a3b8}

/* BUTTON */
.btn{
  display:flex;
  align-items:center;
  justify-content:center;

  width:100%;

  margin-top:14px;

  min-height:52px;

  text-align:center;

  padding:0 18px;

  border-radius:14px;

  text-decoration:none;
  color:#fff;

  font-size:14px;
  font-weight:500;

  transition:.25s ease;
}

.btn-primary{
  background:${isVip
    ? "rgba(168,85,247,.14)"
    : "rgba(34,197,94,.12)"
  };

  border:1px solid ${isVip
    ? "rgba(168,85,247,.35)"
    : "rgba(34,197,94,.25)"
  };
}

.btn-primary:hover{
  background:${isVip
    ? "rgba(168,85,247,.22)"
    : "rgba(34,197,94,.18)"
  };
}

/* RESULT HEADER */
.result-header{
  display:flex;
  justify-content:space-between;
  margin-bottom:8px;
}

.copy{
  font-size:11px;
  opacity:.5;
  cursor:pointer;
}

.copy:hover{opacity:1}

/* PREVIEW */
.preview-name{
  font-size:15px;
  font-weight:600;
}

.preview-sub{
  font-size:12px;
  color:#94a3b8;
  margin-bottom:10px;
}

/* FIELD */
.field{
  display:flex;
  justify-content:space-between;
  gap:10px;

  padding:10px 0;
  border-bottom:1px solid rgba(255,255,255,0.04);

  font-size:13px;
}

.field span{
  opacity:.6;
}

.field b{
  font-weight:500;
  color:#f8fafc;
}

/* SECTION */
.section{
  margin-top:12px;
}

.section-title{
  display:flex;
  justify-content:space-between;
  align-items:center;

  font-size:11px;
  text-transform:uppercase;
  letter-spacing:.6px;
  opacity:.6;

  cursor:pointer;
}

.section-content{
  max-height:1000px;
  overflow:hidden;
  transition:.3s;
}

.section.closed .section-content{
  max-height:0;
  opacity:0;
}

.arrow{
  font-size:14px;
  transition:.3s;
}

.section.closed .arrow{
  transform:rotate(-90deg);
}

/* SUBCARD */
.sub-card{
  background:rgba(2,6,23,0.6);
  border-radius:12px;
  padding:10px;
  margin-top:8px;
}

canvas{
position:fixed;
inset:0;
width:100%;
height:100%;
z-index:0;
pointer-events:none;
}

/* =========================
   💎 PLANS SECTION
========================= */

.plan-box{
  margin-top:18px;

  scroll-margin-top:30px;

  display:grid;
  grid-template-columns:
    repeat(auto-fit,minmax(185px,1fr));

  gap:12px;

  max-width:680px;
  margin-left:auto;
  margin-right:auto;
}

/* CARD */

.plan{
  position:relative;
  overflow:hidden;

  min-height:240px;

  padding:15px;

  border-radius:20px;

  background:
    linear-gradient(
      180deg,
      rgba(15,23,42,.92),
      rgba(2,6,23,.90)
    );

  border:1px solid rgba(255,255,255,.06);

  backdrop-filter:blur(18px);

  display:flex;
  flex-direction:column;
  justify-content:space-between;

  transition:
    transform .35s ease,
    box-shadow .35s ease,
    border-color .35s ease;

  isolation:isolate;
}

/* glow */

.plan::before{
  content:"";

  position:absolute;
  inset:-1px;

  border-radius:inherit;

  background:
    radial-gradient(
      500px circle at var(--mx,50%) var(--my,50%),
      rgba(255,255,255,.08),
      transparent 40%
    );

  opacity:0;
  transition:.35s;
}

.plan:hover::before{
  opacity:1;
}

/* hover */

.plan:hover{
  transform:
    perspective(1000px)
    rotateX(4deg)
    rotateY(-4deg)
    translateY(-6px);

  border-color:rgba(255,255,255,.12);

  box-shadow:
    0 20px 50px rgba(0,0,0,.55);
}

/* destaque */

.plan.highlight{
  border-color:rgba(59,130,246,.22);

  box-shadow:
    0 0 35px rgba(59,130,246,.10);
}

/* premium */

.plan.premium{

  transform:scale(1.02);

  border:1px solid rgba(168,85,247,.38);

  background:
    linear-gradient(
      180deg,
      rgba(36,16,60,.96),
      rgba(10,6,25,.98)
    );

  box-shadow:
    0 0 50px rgba(168,85,247,.18),
    inset 0 0 40px rgba(168,85,247,.05);
}

.plan.premium:hover{
  box-shadow:
    0 0 65px rgba(168,85,247,.24),
    0 25px 70px rgba(0,0,0,.7);
}

/* aurora */

.plan .aurora{
  position:absolute;

  top:-100px;
  left:-30px;

  width:200px;
  height:200px;

  border-radius:50%;

  background:
    radial-gradient(
      circle,
      rgba(59,130,246,.18),
      transparent 70%
    );

  filter:blur(35px);

  z-index:0;
}

.plan.premium .aurora{
  background:
    radial-gradient(
      circle,
      rgba(168,85,247,.24),
      transparent 70%
    );
}

/* particles */

.plan-particles{
  position:absolute;
  inset:0;
  overflow:hidden;
  pointer-events:none;
}

.plan-particles span{
  position:absolute;

  width:2px;
  height:2px;

  border-radius:50%;

  background:rgba(255,255,255,.45);

  animation:floatParticle linear infinite;
}

@keyframes floatParticle{

  from{
    transform:translateY(100px);
    opacity:0;
  }

  30%{
    opacity:1;
  }

  to{
    transform:translateY(-140px);
    opacity:0;
  }

}

/* content */

.plan > *{
  position:relative;
  z-index:2;
}

/* tags */

.plan-header{
  display:flex;
  gap:6px;
  margin-bottom:10px;
}

.tag{
  font-size:9px;
  font-weight:600;

  padding:4px 8px;

  border-radius:999px;

  background:rgba(255,255,255,.05);

  border:1px solid rgba(255,255,255,.06);
}

.tag.offer{
  color:#fca5a5;
}

.tag.best{
  color:#fde68a;
}

.tag.lifetime{
  color:#d8b4fe;
}

/* title */

.plan-title{
  font-size:21px;
  font-weight:700;

  margin-bottom:4px;

  letter-spacing:-1px;
}

/* price */

.price{
  display:flex;
  align-items:flex-end;
  gap:8px;

  margin:14px 0;
}

.old-price{
  font-size:11px;
  text-decoration:line-through;
  opacity:.35;
}

.new-price{
  font-size:28px;
  line-height:1;
  font-weight:800;
  letter-spacing:-1px;
}

.new-price small{
  font-size:12px;
  opacity:.6;
}

/* features */

.features{
  display:flex;
  flex-direction:column;
  gap:8px;

  margin-top:4px;
}

.features div{
  font-size:12px;
  color:#d1d5db;

  display:flex;
  align-items:center;
  gap:6px;
}

/* button */

.plan .btn{
  margin-top:18px;

  min-height:48px;

  border-radius:14px;

  font-size:13px;
  font-weight:600;

  background:
    linear-gradient(
      135deg,
      rgba(59,130,246,.18),
      rgba(139,92,246,.18)
    );

  border:1px solid rgba(255,255,255,.08);

  transition:.25s ease;
}

.plan .btn:hover{
  transform:translateY(-2px);
}

/* ⭐ PREMIUM STARS */

.plan.premium .premium-stars{
  position:absolute;
  inset:0;

  pointer-events:none;
}

.plan.premium .premium-stars span{
  position:absolute;

  color:#fff;
  opacity:.9;

  animation:premiumSparkle 2.8s infinite;
}

.plan.premium .premium-stars span:nth-child(1){
  top:12px;
  left:14px;
  font-size:11px;
}

.plan.premium .premium-stars span:nth-child(2){
  top:24px;
  right:20px;
  font-size:13px;
  animation-delay:.6s;
}

.plan.premium .premium-stars span:nth-child(3){
  top:52%;
  left:10px;
  font-size:10px;
  animation-delay:1.2s;
}

.plan.premium .premium-stars span:nth-child(4){
  bottom:20px;
  right:16px;
  font-size:12px;
  animation-delay:1.8s;
}

.plan.premium .premium-stars span:nth-child(5){
  bottom:55px;
  left:28px;
  font-size:9px;
  animation-delay:2.2s;
}

@keyframes premiumSparkle{

  0%{
    transform:scale(.5) rotate(0deg);
    opacity:0;
  }

  50%{
    transform:scale(1.2) rotate(20deg);
    opacity:1;
  }

  100%{
    transform:scale(.5) rotate(0deg);
    opacity:0;
  }

}

@media(max-width:700px){

  .plan-box{
    grid-template-columns:1fr;
  }

  .plan{
    min-height:auto;
  }

}

/* =========================
   💳 PAYMENT MODAL
========================= */

.modal{
  position:fixed;
  inset:0;

  background:rgba(2,6,23,.78);

  backdrop-filter:blur(18px);

  display:flex;
  align-items:center;
  justify-content:center;

  padding:18px;

  opacity:0;
  visibility:hidden;

  transition:.35s ease;

  z-index:9999;
}

.modal.show{
  opacity:1;
  visibility:visible;
}

.modal-box{
  position:relative;

  width:100%;
  max-width:420px;

  border-radius:28px;

  overflow:hidden;

  background:
    linear-gradient(
      180deg,
      rgba(15,23,42,.96),
      rgba(2,6,23,.98)
    );

  border:1px solid rgba(255,255,255,.08);

  box-shadow:
    0 40px 120px rgba(0,0,0,.75),
    0 0 60px rgba(168,85,247,.18);

  transform:translateY(20px) scale(.94);

  transition:.35s ease;
}

.modal.show .modal-box{
  transform:translateY(0) scale(1);
}

.modal-glow{
  position:absolute;

  top:-120px;
  left:-40px;

  width:260px;
  height:260px;

  border-radius:50%;

  background:
    radial-gradient(
      circle,
      rgba(168,85,247,.28),
      transparent 70%
    );

  filter:blur(40px);
}

.modal-content{
  position:relative;
  z-index:2;

  padding:24px;
}

.modal-top{
  display:flex;
  justify-content:space-between;
  align-items:center;

  margin-bottom:18px;
}

.modal-title{
  font-size:20px;
  font-weight:700;
}

.close-modal{
  width:34px;
  height:34px;

  border:none;
  outline:none;

  border-radius:12px;

  cursor:pointer;

  color:#fff;

  background:rgba(255,255,255,.06);

  transition:.2s;
}

.close-modal:hover{
  background:rgba(255,255,255,.12);
}

.modal-plan{
  padding:14px;
  border-radius:18px;

  background:rgba(255,255,255,.04);

  border:1px solid rgba(255,255,255,.05);

  margin-bottom:16px;
}

.modal-plan small{
  display:block;
  opacity:.55;
  margin-bottom:4px;
}

.modal-plan b{
  font-size:18px;
}

.pix-label{
  font-size:12px;
  opacity:.6;
  margin-bottom:8px;
}

.pix-box{
  display:flex;
  align-items:center;
  gap:10px;

  padding:12px;

  border-radius:16px;

  background:rgba(255,255,255,.04);

  border:1px solid rgba(255,255,255,.06);

  margin-bottom:16px;
}

.pix-key{
  flex:1;

  font-size:12px;
  line-height:1.5;

  word-break:break-all;

  color:#f8fafc;
}

.copy-pix{
  min-width:42px;
  height:42px;

  border:none;

  border-radius:14px;

  cursor:pointer;

  color:#fff;

  font-size:16px;

  background:rgba(255,255,255,.06);

  transition:.2s;
}

.copy-pix:hover{
  background:rgba(255,255,255,.12);
  transform:scale(1.04);
}

.modal-text{
  font-size:13px;
  line-height:1.7;

  color:#cbd5e1;

  margin-bottom:18px;
}

.support-btn{
  display:flex;
  align-items:center;
  justify-content:center;

  width:100%;
  min-height:54px;

  border-radius:18px;

  text-decoration:none;
  color:#fff;

  font-weight:600;

  background:
    linear-gradient(
      135deg,
      rgba(168,85,247,.28),
      rgba(59,130,246,.28)
    );

  border:1px solid rgba(255,255,255,.08);

  transition:.25s ease;
}

.support-btn:hover{
  transform:translateY(-2px);

  box-shadow:
    0 10px 30px rgba(168,85,247,.22);
}

/* =========================
   💎 PREMIUM RESULT
========================= */

.result-block{
  margin-top:14px;
}

.result-title{

  font-size:13px;
  font-weight:700;

  margin-bottom:14px;

  color:#fff;

  letter-spacing:.5px;

  padding-bottom:10px;

  border-bottom:
    1px solid rgba(255,255,255,.06);

  display:flex;
  align-items:center;
  gap:8px;
}

.result-lines{
  display:flex;
  flex-direction:column;
  gap:10px;
}

.premium-field{

  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,.03),
      rgba(255,255,255,.01)
    );

  border:
    1px solid rgba(255,255,255,.04);

  border-radius:14px;

  padding:14px;

  transition:.25s ease;
}

.premium-field:hover{

  transform:translateY(-2px);

  border-color:
    rgba(168,85,247,.25);

  box-shadow:
    0 10px 30px rgba(0,0,0,.35);
}

.premium-label{

  font-size:11px;

  text-transform:uppercase;

  letter-spacing:.7px;

  opacity:.5;

  margin-bottom:6px;
}

.premium-value{

  font-size:15px;

  line-height:1.5;

  color:#fff;

  font-weight:600;

  word-break:break-word;
}

.premium-text{

  font-size:13px;

  opacity:.8;

  line-height:1.6;
}

/* =========================
   🚀 PLANS SHORTCUT
========================= */

.plans-shortcut{
  position:relative;
  overflow:hidden;

  display:flex;
  align-items:center;
  justify-content:space-between;

  gap:14px;

  margin-bottom:18px;
  padding:16px 18px;

  border-radius:20px;

  cursor:pointer;

  background:
    linear-gradient(
      135deg,
      rgba(15,23,42,.78),
      rgba(15,23,42,.52)
    );

  border:1px solid rgba(255,255,255,.06);

  backdrop-filter:blur(18px);

  transition:
    transform .35s ease,
    border-color .35s ease,
    box-shadow .35s ease;

  isolation:isolate;
}

.plans-shortcut:hover{

  transform:translateY(-3px);

  border-color:
    rgba(168,85,247,.28);

  box-shadow:
    0 18px 45px rgba(0,0,0,.45),
    0 0 30px rgba(168,85,247,.12);
}

.plans-shortcut:active{
  transform:scale(.985);
}

.plans-shortcut::before{
  content:"";

  position:absolute;
  inset:-1px;

  border-radius:inherit;

  background:
    radial-gradient(
      500px circle at var(--mx,50%) var(--my,50%),
      rgba(255,255,255,.07),
      transparent 40%
    );

  opacity:0;
  transition:.35s ease;
}

.plans-shortcut:hover::before{
  opacity:1;
}

.plans-shortcut-glow{
  position:absolute;

  top:-80px;
  right:-40px;

  width:180px;
  height:180px;

  border-radius:50%;

  background:
    radial-gradient(
      circle,
      rgba(168,85,247,.18),
      transparent 70%
    );

  filter:blur(30px);

  pointer-events:none;
}

.plans-shortcut-left{
  position:relative;
  z-index:2;
}

.plans-shortcut-mini{

  font-size:10px;
  font-weight:700;

  letter-spacing:1.3px;

  margin-bottom:5px;

  color:#c084fc;

  opacity:.9;
}

.plans-shortcut-title{

  font-size:15px;
  font-weight:600;

  color:#fff;
}

.plans-shortcut-sub{

  margin-top:3px;

  font-size:11px;

  color:#94a3b8;
}

.plans-shortcut-arrow{

  position:relative;
  z-index:2;

  width:44px;
  height:44px;

  border-radius:14px;

  display:flex;
  align-items:center;
  justify-content:center;

  font-size:18px;

  color:#fff;

  background:
    linear-gradient(
      135deg,
      rgba(168,85,247,.18),
      rgba(59,130,246,.18)
    );

  border:1px solid rgba(255,255,255,.08);

  animation:plansArrow 2s ease-in-out infinite;

  box-shadow:
    inset 0 0 12px rgba(255,255,255,.04);
}

@keyframes plansArrow{

  0%{
    transform:translateY(0px);
  }

  50%{
    transform:translateY(4px);
  }

  100%{
    transform:translateY(0px);
  }

}

.plan-box{
  scroll-margin-top:30px;
}

.plan-box.plans-highlight{
  animation:plansPulse 1.8s ease;
}

@keyframes plansPulse{

  0%{
    transform:scale(1);
    filter:brightness(1);
  }

  30%{
    transform:scale(1.015);
    filter:brightness(1.08);
  }

  100%{
    transform:scale(1);
    filter:brightness(1);
  }

}

/* =========================
   🚀 ASTRO TOPBAR
========================= */

.topbar{

  position:sticky;
  top:14px;

  z-index:999;

  display:flex;
  align-items:center;
  justify-content:space-between;

  flex-wrap:wrap;

  gap:16px;

  width:100%;

  margin-bottom:22px;

  padding:16px;

  border-radius:24px;

  background:
    linear-gradient(
      135deg,
      rgba(15,23,42,.72),
      rgba(15,23,42,.45)
    );

  border:
    1px solid rgba(255,255,255,.06);

  backdrop-filter:blur(24px);

  box-shadow:
    0 10px 50px rgba(0,0,0,.35);

  overflow:hidden;
}

.topbar::before{

  content:"";

  position:absolute;
  inset:-1px;

  border-radius:inherit;

  background:
    radial-gradient(
      600px circle at var(--mx,50%) var(--my,50%),
      rgba(255,255,255,.08),
      transparent 40%
    );

  opacity:0;
  transition:.35s;
}

.topbar:hover::before{
  opacity:1;
}

.topbar-blur{

  position:absolute;

  top:-100px;
  right:-80px;

  width:240px;
  height:240px;

  border-radius:50%;

  background:
    radial-gradient(
      circle,
      rgba(168,85,247,.20),
      transparent 70%
    );

  filter:blur(40px);
}

.topbar-left,
.topbar-right{
  position:relative;
  z-index:2;
}

.topbar-right{

  display:flex;
  align-items:center;
  justify-content:flex-end;

  flex-wrap:wrap;

  gap:10px;

  flex:1;

  min-width:0;
}

.astro-logo{
  display:flex;
  align-items:center;
  gap:14px;
}

.topbar-link{
  white-space:nowrap;
}

.topbar-left{
  flex-shrink:0;
}

.astro-icon{

  width:48px;
  height:48px;

  border-radius:18px;

  display:flex;
  align-items:center;
  justify-content:center;

  font-size:18px;

  background:
    linear-gradient(
      135deg,
      rgba(168,85,247,.25),
      rgba(59,130,246,.25)
    );

  border:
    1px solid rgba(255,255,255,.08);

  box-shadow:
    0 0 25px rgba(168,85,247,.25);

  animation:astroRotate 7s linear infinite;
}

@keyframes astroRotate{

  0%{
    transform:rotate(0deg);
  }

  100%{
    transform:rotate(360deg);
  }

}

.astro-mini{

  font-size:10px;
  letter-spacing:1.5px;

  color:#c084fc;

  margin-bottom:3px;

  font-weight:700;
}

.astro-title{

  font-size:16px;
  font-weight:700;

  color:#fff;
}

.topbar-link{

  height:42px;
  padding:0 16px;

  border-radius:14px;

  display:flex;
  align-items:center;
  justify-content:center;

  text-decoration:none;

  color:#cbd5e1;

  font-size:13px;
  font-weight:600;

  background:
    rgba(255,255,255,.03);

  border:
    1px solid rgba(255,255,255,.05);

  transition:.25s;
}

.topbar-link:hover{

  color:#fff;

  transform:translateY(-2px);

  background:
    rgba(255,255,255,.06);
}

.topbar-btn{

  min-height:44px;

  padding:0 18px;

  border-radius:16px;

  display:flex;
  align-items:center;
  justify-content:center;

  text-decoration:none;

  color:#fff;

  font-size:13px;
  font-weight:700;

  white-space:nowrap;

  flex-shrink:0;

  background:
    linear-gradient(
      135deg,
      rgba(168,85,247,.32),
      rgba(59,130,246,.32)
    );

  border:
    1px solid rgba(255,255,255,.08);

  box-shadow:
    0 0 25px rgba(168,85,247,.14);

  transition:
    transform .25s ease,
    box-shadow .25s ease,
    background .25s ease;
}

.topbar-btn:hover{

  transform:
    translateY(-3px)
    scale(1.02);

  box-shadow:
    0 12px 40px rgba(168,85,247,.22);

  background:
    linear-gradient(
      135deg,
      rgba(168,85,247,.40),
      rgba(59,130,246,.40)
    );
}

@media(max-width:700px){

  .plans-shortcut{
    padding:14px 15px;
  }

  .plans-shortcut-title{
    font-size:14px;
  }

  .plans-shortcut-arrow{
    width:38px;
    height:38px;
    font-size:16px;
  }

}

.top-stars{
  position:absolute;
  inset:0;

  pointer-events:none;
}

.top-stars span{
  position:absolute;

  color:#fff;

  opacity:.9;

  animation:premiumSparkle 2.8s infinite;
}

.top-stars span:nth-child(1){
  top:14px;
  left:18px;
  font-size:11px;
}

.top-stars span:nth-child(2){
  top:20px;
  right:20px;
  font-size:13px;
  animation-delay:.8s;
}

.top-stars span:nth-child(3){
  bottom:24px;
  left:24px;
  font-size:10px;
  animation-delay:1.5s;
}

@media(max-width:700px){

  .topbar{

    flex-direction:column;
    align-items:stretch;

    padding:14px;
  }

  .topbar-left{

    width:100%;

    display:flex;
    justify-content:center;
  }

  .topbar-right{

    width:100%;

    display:grid;

    grid-template-columns:
      repeat(3,1fr);

    gap:10px;
  }

  .topbar-link,
  .topbar-btn{

    width:100%;

    justify-content:center;
  }

}

</style>
</head>

<body>

<canvas id="bg"></canvas>

<div class="container">

<header class="topbar">

<div class="topbar-blur"></div>

<div class="topbar-left">

  <div class="astro-logo">

    <div class="astro-icon">
      ✦
    </div>

    <div class="astro-logo-text">

      <div class="astro-mini">
        ASTRO SYSTEM
      </div>

      <div class="astro-title">
        ${isVip ? 'PAINEL PREMIUM' : 'PAINEL STANDARD'}
      </div>

    </div>

  </div>

</div>

<div class="topbar-right">

  <a
    href="/"
    class="topbar-link"
  >
    Home
  </a>

  <a
    href="#plansSection"
    class="topbar-link"
    onclick="scrollToPlans()"
  >
    Planos
  </a>

  <a
    href="https://t.me/consultasdedados_bot"
    target="_blank"
    class="topbar-btn"
  >
    Abrir Bot
  </a>

</div>

</header>

<!-- =========================
     🚀 QUICK PLANS NAV
========================= -->

<div class="plans-shortcut" onclick="scrollToPlans()">

  <div class="plans-shortcut-glow"></div>

  <div class="plans-shortcut-left">

    <div class="plans-shortcut-mini">
      PREMIUM
    </div>

    <div class="plans-shortcut-title">
      Ver planos disponíveis
    </div>

  </div>

  <div class="plans-shortcut-arrow">
    ↓
  </div>

</div>

<div class="card">
  <div class="title">Consulta</div>
  <div class="muted">
    ${data.tipo || "-"} • ${data.query || "-"}<br>
    ${results.length} resultado(s)
  </div>

  <a class="btn btn-primary" href="https://t.me/consultasdedados_bot" target="_blank">
    Abrir no bot
  </a>
</div>

${results.map((p,i)=>`
<div class="card">
  <div class="result-header">
    <div class="title">Resultado ${i+1}</div>
    <div class="copy" onclick="copyCard(this)">Copiar</div>
  </div>

  <div class="preview-name">${p.nome || "-"}</div>
  <div class="preview-sub">${p.telefone || "-"} • ${p.cpf || "-"}</div>

  ${renderFields(p)}
</div>
`).join("")}

<div class="plan-box" id="plansSection">

  <!-- =========================
       💎 DIÁRIO
  ========================= -->
  <div class="plan">
  <div class="aurora"></div>

    <div class="plan-particles">
      <span style="left:8%;animation-duration:7s"></span>
      <span style="left:18%;animation-duration:11s"></span>
      <span style="left:32%;animation-duration:9s"></span>
      <span style="left:48%;animation-duration:13s"></span>
      <span style="left:66%;animation-duration:8s"></span>
      <span style="left:82%;animation-duration:10s"></span>
    </div>

    <div>

      <div class="plan-title">
        Diário
      </div>

      <div class="price">
        <span class="new-price">
          R$14,90
        </span>
      </div>

      <div class="features">
        <div>✦ Acesso por 24 horas</div>
        <div>✦ Consultas básicas</div>
        <div>✦ Liberação imediata</div>
        <div>✦ Suporte rápido</div>
      </div>

    </div>

<button class="btn"
        onclick="openPayment('Plano Diário • R$14,90')">
  Adquirir
</button>

  </div>

  <!-- =========================
       🚀 MENSAL
  ========================= -->
  <div class="plan highlight">
  <div class="aurora"></div>

    <div class="plan-particles">
      <span style="left:6%;animation-duration:6s"></span>
      <span style="left:20%;animation-duration:9s"></span>
      <span style="left:34%;animation-duration:7s"></span>
      <span style="left:52%;animation-duration:11s"></span>
      <span style="left:70%;animation-duration:8s"></span>
      <span style="left:88%;animation-duration:10s"></span>
    </div>

    <div>

      <div class="plan-header">
        <span class="tag best">MAIS VENDIDO</span>
      </div>

      <div class="plan-title">
        Semanal
      </div>

      <div class="price">
        <span class="new-price">
          R$24,90
        </span>
      </div>

      <div class="features">
        <div>✦ Consultas ilimitadas</div>
        <div>✦ Prioridade no sistema</div>
        <div>✦ Atualizações premium</div>
      </div>

    </div>

<button class="btn"
        onclick="openPayment('Plano Semanal • R$24,90')">
  Adquirir
</button>

  </div>

  <!-- =========================
       👑 VITALÍCIO
  ========================= -->
  <div class="plan premium">
  <div class="top-stars">
  <span>✦</span>
  <span>✧</span>
  <span>✦</span>
</div>
  <div class="aurora"></div>

    <div class="plan-particles">
      <span style="left:5%;animation-duration:8s"></span>
      <span style="left:16%;animation-duration:12s"></span>
      <span style="left:28%;animation-duration:7s"></span>
      <span style="left:44%;animation-duration:10s"></span>
      <span style="left:58%;animation-duration:9s"></span>
      <span style="left:74%;animation-duration:13s"></span>
      <span style="left:90%;animation-duration:8s"></span>
    </div>

    <div>

      <div class="plan-header">
        <span class="tag offer">OFERTA</span>
        <span class="tag lifetime">ILIMITADO</span>
      </div>

      <div class="plan-title">
        Vitalício
      </div>

      <div class="price">
        <span class="old-price">R$50</span>

        <span class="new-price">
          R$20,90
        </span>
      </div>

      <div class="features">
        <div>✦ Acesso vitalício</div>
        <div>✦ Tudo desbloqueado</div>
        <div>✦ Sem limites</div>
        <div>✦ Acesso aos códigos</div>
        <div>✦ Recursos premium</div>
        <div>✦ Prioridade máxima</div>
        <div>✦ Atualizações futuras grátis</div>
      </div>

    </div>

<button class="btn"
        onclick="openPayment('Plano Vitalício • R$20,90')">
  🚀 Desbloquear
</button>

  </div>

</div>

<div class="modal" id="paymentModal">

  <div class="modal-box">

    <div class="modal-glow"></div>

    <div class="modal-content">

      <div class="modal-top">

        <div class="modal-title">
          Astro Premium
        </div>

        <button class="close-modal"
                onclick="closePayment()">
          ✕
        </button>

      </div>

      <div class="modal-plan">

        <small>Plano selecionado</small>

        <b id="modalPlanName">
          VIP
        </b>

      </div>

      <div class="pix-label">
        Chave PIX
      </div>

      <div class="pix-box">

        <div class="pix-key" id="pixKey">
          f0d0f3b1-8776-4f06-a254-b6ea3686f71a
        </div>

        <button class="copy-pix"
                onclick="copyPix()">
          ⧉
        </button>

      </div>

      <div class="modal-text">
        Após efetuar o pagamento, envie o comprovante
        para o suporte e seu acesso será liberado
        imediatamente.
      </div>

      <a href="https://t.me/puxardados5"
         target="_blank"
         class="support-btn">
        Já paguei
      </a>

    </div>

  </div>

</div>

<script>
function copyCard(el){
  navigator.clipboard.writeText(el.closest(".card").innerText).catch(()=>{})
  el.innerText="Copiado"
  setTimeout(()=> el.innerText="Copiar",1500)
}

function toggleSection(el){
  const section = el.parentElement
  section.classList.toggle("closed")
}

const cards = document.querySelectorAll(".card");

window.addEventListener("mousemove", e=>{
  let x = (e.clientX / window.innerWidth - 0.5) * 20;
  let y = (e.clientY / window.innerHeight - 0.5) * 20;

  cards.forEach(el=>{
    el.style.setProperty("--x", x + "px");
    el.style.setProperty("--y", y + "px");
  });
});

const topbar =
document.querySelector(".topbar")

document.addEventListener("mousemove",e=>{

  const x = e.clientX
  const y = e.clientY

  document
    .querySelectorAll(".card,.plan,.topbar")
    .forEach(el=>{

      const rect =
        el.getBoundingClientRect()

      el.style.setProperty(
        "--mx",
        (x - rect.left) + "px"
      )

      el.style.setProperty(
        "--my",
        (y - rect.top) + "px"
      )

    })

})

function scrollToPlans(){

  const section =
    document.getElementById("plansSection")

  if(!section) return

  section.scrollIntoView({
    behavior:"smooth",
    block:"start"
  })

  section.classList.add("plans-highlight")

  setTimeout(()=>{
    section.classList.remove("plans-highlight")
  },1800)
}

const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".card").forEach(el=>{
  observer.observe(el);
});

document.querySelectorAll(".card .btn").forEach(btn=>{
  btn.addEventListener("mousemove", e=>{
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;

btn.style.transform = "translate(" + (x*0.2) + "px, " + (y*0.2) + "px)";
  });

  btn.addEventListener("mouseleave", ()=>{
    btn.style.transform = "translate(0,0)";
  });
});

/* =========================
PARTICLES
========================= */

const c = document.getElementById("bg");
const ctx = c.getContext("2d");

function resize(){

  c.width = innerWidth;
  c.height = innerHeight;

}

resize();

addEventListener("resize", resize);

const particles = [];

for(let i=0;i<180;i++){

  particles.push({

    x:Math.random()*c.width,
    y:Math.random()*c.height,

    r:Math.random()*2,

    o:Math.random()*0.4,

    s:Math.random()*0.4+.05

  })

}

function render(){

  ctx.clearRect(0,0,c.width,c.height);

  for(const p of particles){

    p.y += p.s;

    if(p.y > c.height){

      p.y = -10;
      p.x = Math.random()*c.width;

    }

    ctx.beginPath();

    ctx.fillStyle =
    "rgba(255,255,255,"+p.o+")";

    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);

    ctx.fill();

  }

  requestAnimationFrame(render);

}

render();

// 💎 PLANS 3D EFFECT

document.querySelectorAll(".plan").forEach(card=>{

  card.addEventListener("mousemove", e=>{

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mx", x + "px");
    card.style.setProperty("--my", y + "px");

    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;

    card.style.transform =
  "perspective(1200px) " +
  "rotateX(" + rotateX + "deg) " +
  "rotateY(" + rotateY + "deg) " +
  "translateY(-8px)";

  });

  card.addEventListener("mouseleave", ()=>{

    card.style.transform =
  "perspective(1200px) " +
  "rotateX(0deg) " +
  "rotateY(0deg) " +
  "translateY(0px)";
  });

});

function openPayment(plan){

  document.getElementById("modalPlanName")
    .innerText = plan

  document.getElementById("paymentModal")
    .classList.add("show")
}

function closePayment(){

  document.getElementById("paymentModal")
    .classList.remove("show")
}

function copyPix(){

  const key =
    "f0d0f3b1-8776-4f06-a254-b6ea3686f71a"

  navigator.clipboard.writeText(key)

  const btn = document.querySelector(".copy-pix")

  btn.innerText = "✓"

  setTimeout(()=>{
    btn.innerText = "⧉"
  },1400)
}

document.getElementById("paymentModal")
.addEventListener("click", e=>{

  if(e.target.id === "paymentModal"){
    closePayment()
  }

})

</script>

</body>
</html>
`
}

// =========================
// ❌ ERRO
// =========================

function renderError(){

return `
<!DOCTYPE html>
<html lang="pt-br">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0, viewport-fit=cover"
/>

<title>Astro • Expirado</title>

<link
href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
rel="stylesheet"
/>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

html{
width:100%;
min-height:100%;
overflow-x:hidden;
-webkit-text-size-adjust:100%;
}

body{

font-family:'Inter',sans-serif;

background:
radial-gradient(circle at top left,
rgba(168,85,247,.16),
transparent 30%),

radial-gradient(circle at top right,
rgba(59,130,246,.14),
transparent 35%),

#020617;

min-height:100dvh;

overflow-x:hidden;
overflow-y:auto;

color:#fff;

position:relative;

-webkit-font-smoothing:antialiased;
text-rendering:optimizeLegibility;

touch-action:manipulation;
}

/* =========================
BACKGROUND
========================= */

canvas{
position:fixed;
inset:0;
width:100%;
height:100%;
z-index:0;
pointer-events:none;
touch-action:none;
}

/* =========================
AURORA
========================= */

.aurora{

position:fixed;

width:700px;
height:700px;

border-radius:50%;

background:
radial-gradient(circle,
rgba(168,85,247,.12),
transparent 70%);

filter:blur(80px);

top:-300px;
left:-200px;

animation:auroraMove 12s ease-in-out infinite;

pointer-events:none;
}

.aurora.two{

left:auto;
right:-240px;

top:auto;
bottom:-320px;

background:
radial-gradient(circle,
rgba(59,130,246,.10),
transparent 70%);

animation-delay:4s;
}

@keyframes auroraMove{

0%{
transform:translate(0,0) scale(1);
}

50%{
transform:translate(40px,-30px) scale(1.08);
}

100%{
transform:translate(0,0) scale(1);
}

}

/* =========================
WRAPPER
========================= */

.wrapper{
position:relative;
z-index:5;

width:100%;
max-width:960px;

margin:auto;

padding:24px;

display:flex;
align-items:center;
justify-content:center;

min-height:100dvh;
}

/* =========================
CARD
========================= */

.card{

position:relative;

overflow:hidden;

width:100%;

border-radius:36px;

background:
linear-gradient(
180deg,
rgba(15,23,42,.92),
rgba(2,6,23,.96)
);

border:
1px solid rgba(255,255,255,.08);

backdrop-filter:blur(20px);

box-shadow:
0 40px 120px rgba(0,0,0,.75),
0 0 70px rgba(168,85,247,.14);

padding:42px;

z-index:10;
}

.card *{
position:relative;
z-index:20;
}

.card::before{

content:"";

position:absolute;
inset:-1px;

border-radius:inherit;

background:
radial-gradient(
600px circle at var(--mx,50%) var(--my,50%),
rgba(255,255,255,.08),
transparent 40%
);

opacity:0;
transition:.3s;

pointer-events:none;
}

.card:hover::before{
opacity:1;
}

/* =========================
TOP
========================= */

.top{

display:flex;
align-items:center;
justify-content:space-between;

gap:20px;

margin-bottom:32px;
}

.logo{

display:flex;
align-items:center;
gap:14px;
}

.logo-icon{

width:54px;
height:54px;

border-radius:18px;

display:flex;
align-items:center;
justify-content:center;

font-size:24px;

background:
linear-gradient(
135deg,
rgba(168,85,247,.28),
rgba(59,130,246,.24)
);

border:
1px solid rgba(255,255,255,.08);

box-shadow:
0 0 35px rgba(168,85,247,.25);
}

.logo-text{

font-size:22px;
font-weight:800;
letter-spacing:-1px;
}

.status{

padding:10px 16px;

border-radius:999px;

font-size:11px;
font-weight:700;
letter-spacing:1px;

background:
rgba(255,255,255,.04);

border:
1px solid rgba(255,255,255,.08);

color:#fca5a5;
}

/* =========================
CONTENT
========================= */

.content{

display:grid;
grid-template-columns:1fr 360px;
gap:30px;
align-items:center;
}

.expire-tag{

display:inline-flex;
align-items:center;
gap:8px;

padding:10px 16px;

border-radius:999px;

margin-bottom:20px;

font-size:11px;
font-weight:700;
letter-spacing:1px;

background:
rgba(255,255,255,.04);

border:
1px solid rgba(255,255,255,.08);

color:#c084fc;
}

.title{

font-size:64px;
line-height:.92;

font-weight:800;

letter-spacing:-4px;

margin-bottom:22px;
}

.title span{

background:
linear-gradient(
90deg,
#fff,
#c084fc,
#60a5fa
);

-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
}

.text{

font-size:16px;
line-height:1.8;

color:#94a3b8;

max-width:580px;

margin-bottom:28px;
}

/* =========================
BUTTONS
========================= */

.actions{
display:flex;
gap:14px;
flex-wrap:wrap;
}

.btn{

height:58px;
padding:0 26px;

border-radius:18px;

display:flex;
align-items:center;
justify-content:center;

text-decoration:none;
color:#fff;

font-size:14px;
font-weight:700;

transition:.25s;
}

.btn-primary{

background:
linear-gradient(
135deg,
rgba(168,85,247,.35),
rgba(59,130,246,.35)
);

border:
1px solid rgba(255,255,255,.10);

box-shadow:
0 0 40px rgba(168,85,247,.22);
}

.btn-primary:hover{
transform:translateY(-4px);
}

.btn-secondary{

background:
rgba(255,255,255,.03);

border:
1px solid rgba(255,255,255,.08);
}

.btn-secondary:hover{
background:
rgba(255,255,255,.06);
}

/* =========================
SIDE PANEL
========================= */

.side{

position:relative;

border-radius:28px;

padding:22px;

background:
rgba(255,255,255,.03);

border:
1px solid rgba(255,255,255,.06);

overflow:hidden;
}

.side::before{

content:"";

position:absolute;

width:240px;
height:240px;

border-radius:50%;

background:
radial-gradient(circle,
rgba(168,85,247,.16),
transparent 70%);

top:-120px;
right:-80px;

filter:blur(30px);

pointer-events:none;
}

.side-title{

font-size:13px;
font-weight:700;
letter-spacing:1px;

opacity:.7;

margin-bottom:18px;
}

/* =========================
PLANS
========================= */

.plan{

padding:16px;

border-radius:18px;

background:
rgba(255,255,255,.03);

border:
1px solid rgba(255,255,255,.05);

margin-bottom:14px;

transition:.25s;
}

.plan:hover{

transform:translateY(-3px);

border-color:
rgba(168,85,247,.25);

box-shadow:
0 10px 30px rgba(0,0,0,.35);
}

.plan-top{

display:flex;
justify-content:space-between;
align-items:center;

margin-bottom:10px;
}

.plan-name{
font-size:16px;
font-weight:700;
}

.plan-price{

font-size:24px;
font-weight:800;
letter-spacing:-1px;
}

.plan-price small{
font-size:12px;
opacity:.6;
}

.plan-features{
font-size:12px;
line-height:1.8;
color:#94a3b8;
}

/* =========================
FOOTER
========================= */

.footer{

margin-top:28px;

display:flex;
justify-content:space-between;
align-items:center;

gap:20px;

font-size:12px;

color:#64748b;
}

.online{

display:flex;
align-items:center;
gap:8px;
}

.dot{

width:8px;
height:8px;

border-radius:50%;

background:#4ade80;

box-shadow:
0 0 10px #4ade80;

animation:pulse 1.8s infinite;
}

@keyframes pulse{

0%{
transform:scale(1);
opacity:1;
}

50%{
transform:scale(1.5);
opacity:.6;
}

100%{
transform:scale(1);
opacity:1;
}

}

/* =========================
RESPONSIVE
========================= */

@media(max-width:900px){

.content{
grid-template-columns:1fr;
}

.title{
font-size:46px;
letter-spacing:-2px;
}

}

@media(max-width:700px){

html,
body{
overflow-x:hidden;
}

.wrapper{
padding:14px;
align-items:flex-start;
padding-top:30px;
padding-bottom:40px;
}

.card{
padding:22px;
border-radius:24px;
}

.top{
flex-direction:column;
align-items:flex-start;
}

.content{
grid-template-columns:1fr !important;
}

.title{
font-size:38px !important;
line-height:1.02;
letter-spacing:-2px !important;
}

.actions{
flex-direction:column;
}

.btn{
width:100%;
min-height:56px;
}

.side{
margin-top:10px;
}

.footer{
flex-direction:column;
align-items:flex-start;
}

}

/* zoom fix */

input,
select,
textarea,
button{
font-size:16px;
}

</style>
</head>

<body>

<canvas id="bg"></canvas>

<div class="aurora"></div>
<div class="aurora two"></div>

<div class="wrapper">

<div class="card" id="card">

<div class="top">

<div class="logo">

<div class="logo-icon">
✦
</div>

<div class="logo-text">
Astro
</div>

</div>

<div class="status">
LINK EXPIRADO
</div>

</div>

<div class="content">

<div>

<div class="expire-tag">
✦ CONSULTA REMOVIDA AUTOMATICAMENTE
</div>

<div class="title">
Seu acesso <span>expirou</span>
do sistema
</div>

<div class="text">

Esse resultado foi removido automaticamente
da infraestrutura da Astro por segurança.

Gere uma nova consulta ou desbloqueie
o acesso premium ilimitado.

</div>

<div class="actions">

<a
href="https://t.me/consultasdedados_bot"
target="_blank"
class="btn btn-primary"
>
GERAR NOVA CONSULTA
</a>

<a
href="/"
class="btn btn-secondary"
>
PÁGINA INICIAL
</a>

</div>

</div>

<div class="side">

<div class="side-title">
PLANOS PREMIUM
</div>

<div class="plan">

<div class="plan-top">

<div class="plan-name">
Diário
</div>

<div class="plan-price">
R$14<small>,90</small>
</div>

</div>

<div class="plan-features">
✦ 24h de acesso<br>
✦ Liberação imediata<br>
✦ Consultas rápidas
</div>

</div>

<div class="plan">

<div class="plan-top">

<div class="plan-name">
Semanal
</div>

<div class="plan-price">
R$24<small>,90</small>
</div>

</div>

<div class="plan-features">
✦ Consultas ilimitadas<br>
✦ Prioridade máxima<br>
✦ Recursos premium
</div>

</div>

<div class="plan">

<div class="plan-top">

<div class="plan-name">
Vitalício
</div>

<div class="plan-price">
R$20<small>,90</small>
</div>

</div>

<div class="plan-features">
✦ Sem limites<br>
✦ Tudo desbloqueado<br>
✦ Atualizações futuras grátis
</div>

</div>

</div>

</div>

<div class="footer">

<div>
Astro.app • Sistema premium online
</div>

<div class="online">

<div class="dot"></div>

Online

</div>

</div>

</div>

</div>

<script>

/* =========================
PARTICLES
========================= */

const c =
document.getElementById("bg");

const ctx =
c.getContext("2d");

function resize(){

c.width = innerWidth;
c.height = innerHeight;

}

resize();

addEventListener("resize",resize);

const stars = [];

for(let i=0;i<240;i++){

const bright =
Math.random() > .92;

stars.push({

x:Math.random()*c.width,
y:Math.random()*c.height,

r:
bright
? Math.random()*1.8+.8
: Math.random()*1.1,

o:
bright
? Math.random()*.8+.2
: Math.random()*.25,

s:
Math.random()*.18+.03

})

}

function render(){

ctx.clearRect(0,0,c.width,c.height);

for(const p of stars){

p.y += p.s;

if(p.y > c.height){

p.y = -10;
p.x = Math.random()*c.width;

}

ctx.beginPath();

ctx.fillStyle =
"rgba(255,255,255,"+p.o+")";

ctx.arc(
p.x,
p.y,
p.r,
0,
Math.PI*2
);

ctx.fill();

}

requestAnimationFrame(render);

}

render();

/* =========================
LIGHT EFFECT
========================= */

const card =
document.getElementById("card");

card.addEventListener("mousemove",e=>{

const rect =
card.getBoundingClientRect();

const x =
e.clientX - rect.left;

const y =
e.clientY - rect.top;

card.style.setProperty(
"--mx",
x+"px"
);

card.style.setProperty(
"--my",
y+"px"
);

});

</script>

</body>
</html>
`
}