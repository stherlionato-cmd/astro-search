function renderHome(){
return `
<!DOCTYPE html>
<html lang="pt-br">
<head>

<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>

<title>Astro APIs • Plataforma Premium</title>

<meta name="theme-color" content="#020617"/>

<meta
name="description"
content="APIs premium com consultas em tempo real, endpoints privados, documentação moderna e dashboard interativo."
/>

<meta property="og:title" content="Astro APIs"/>
<meta property="og:description" content="Sistema premium de APIs privadas"/>
<meta property="og:type" content="website"/>

<link rel="preconnect" href="https://fonts.googleapis.com"/>

<link
href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
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

:root{

--bg:#020617;
--card:#0f172a;
--line:rgba(255,255,255,.07);

--purple:#a855f7;
--blue:#3b82f6;

--text:#fff;
--muted:#94a3b8;

}

body{

font-family:'Inter',sans-serif;

background:
radial-gradient(circle at top left,
rgba(168,85,247,.15),
transparent 35%),

radial-gradient(circle at top right,
rgba(59,130,246,.15),
transparent 35%),

#020617;

color:#fff;
overflow-x:hidden;

-webkit-font-smoothing:antialiased;
text-rendering:optimizeLegibility;
}

canvas{
position:fixed;
inset:0;
width:100%;
height:100%;
pointer-events:none;
z-index:0;
}

.container{
position:relative;
z-index:2;
max-width:1280px;
margin:auto;
padding:0 18px;
}

/* =========================
HEADER
========================= */

.header{

position:sticky;
top:0;

z-index:999;

backdrop-filter:blur(18px);

background:
rgba(2,6,23,.72);

border-bottom:
1px solid rgba(255,255,255,.05);

}

.header-wrap{

height:82px;

display:flex;
align-items:center;
justify-content:space-between;
gap:20px;
}

.logo{

display:flex;
align-items:center;
gap:14px;

font-weight:800;
font-size:20px;
letter-spacing:-1px;
}

.logo-icon{

width:48px;
height:48px;

border-radius:18px;

display:flex;
align-items:center;
justify-content:center;

background:
linear-gradient(
135deg,
rgba(168,85,247,.28),
rgba(59,130,246,.28)
);

border:
1px solid rgba(255,255,255,.08);

box-shadow:
0 0 35px rgba(168,85,247,.24);

font-size:18px;
}

.header-right{
display:flex;
align-items:center;
gap:12px;
}

.header-link{

height:44px;
padding:0 18px;

display:flex;
align-items:center;
justify-content:center;

border-radius:14px;

text-decoration:none;
color:#cbd5e1;

font-size:13px;
font-weight:600;

background:
rgba(255,255,255,.03);

border:
1px solid rgba(255,255,255,.06);

transition:.25s;
}

.header-link:hover{
transform:translateY(-2px);
color:#fff;
}

.header-btn{

height:46px;
padding:0 20px;

border-radius:16px;

display:flex;
align-items:center;
justify-content:center;

text-decoration:none;
color:#fff;

font-size:13px;
font-weight:700;

background:
linear-gradient(
135deg,
rgba(168,85,247,.35),
rgba(59,130,246,.35)
);

border:
1px solid rgba(255,255,255,.08);

box-shadow:
0 0 30px rgba(168,85,247,.18);

transition:.25s;
}

.header-btn:hover{
transform:translateY(-3px);
}

/* =========================
HERO
========================= */

.hero{

position:relative;

padding-top:90px;
padding-bottom:100px;

display:grid;
grid-template-columns:1.1fr .9fr;
gap:40px;
align-items:center;
}

.hero-badge{

display:inline-flex;
align-items:center;
gap:10px;

padding:12px 18px;

border-radius:999px;

margin-bottom:26px;

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

font-size:78px;
line-height:.92;

font-weight:900;

letter-spacing:-5px;

margin-bottom:24px;

max-width:780px;
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
line-height:1.9;

max-width:640px;

color:#94a3b8;

margin-bottom:34px;
}

.hero-actions{
display:flex;
gap:14px;
flex-wrap:wrap;
}

.btn{

height:60px;
padding:0 30px;

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
rgba(168,85,247,.36),
rgba(59,130,246,.36)
);

border:
1px solid rgba(255,255,255,.08);

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
LIVE TERMINAL
========================= */

.hero-side{
position:relative;
}

.terminal-box{

position:relative;

padding:22px;

border-radius:30px;

background:
linear-gradient(
180deg,
rgba(15,23,42,.95),
rgba(2,6,23,.98)
);

border:
1px solid rgba(255,255,255,.08);

box-shadow:
0 40px 120px rgba(0,0,0,.75),
0 0 70px rgba(168,85,247,.14);

overflow:hidden;
}

.terminal-box::before{

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

.terminal-box:hover::before{
opacity:1;
}

.term-top{
display:flex;
gap:8px;
margin-bottom:18px;
}

.term-dot{
width:10px;
height:10px;
border-radius:50%;
background:#334155;
}

.terminal{

background:#020617;

border-radius:22px;

padding:18px;

border:
1px solid rgba(255,255,255,.06);

min-height:430px;

overflow:auto;
}

.term-line{

font-size:13px;
line-height:1.9;

font-family:monospace;

color:#d1d5db;

opacity:0;

transform:translateY(6px);

animation:termAppear .5s forwards;
}

.term-line:nth-child(1){animation-delay:.2s}
.term-line:nth-child(2){animation-delay:.5s}
.term-line:nth-child(3){animation-delay:.8s}
.term-line:nth-child(4){animation-delay:1.1s}
.term-line:nth-child(5){animation-delay:1.4s}
.term-line:nth-child(6){animation-delay:1.7s}

@keyframes termAppear{
to{
opacity:1;
transform:translateY(0);
}
}

.term-purple{color:#c084fc}
.term-blue{color:#60a5fa}
.term-green{color:#4ade80}
.term-red{color:#f87171}

/* =========================
FLOAT CARDS
========================= */

.float-card{

position:absolute;

padding:16px 18px;

border-radius:22px;

background:
rgba(15,23,42,.92);

backdrop-filter:blur(18px);

border:
1px solid rgba(255,255,255,.08);

box-shadow:
0 15px 50px rgba(0,0,0,.55);

animation:floatCard 4s ease-in-out infinite;
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
top:-20px;
left:-20px;
}

.float-2{
bottom:-20px;
right:-20px;
animation-delay:1.2s;
}

@keyframes floatCard{

0%{transform:translateY(0)}
50%{transform:translateY(-10px)}
100%{transform:translateY(0)}

}

/* =========================
SECTIONS
========================= */

.section{
margin-bottom:120px;
}

.section-top{
margin-bottom:34px;
}

.section-mini{

font-size:11px;
letter-spacing:1px;
font-weight:700;

color:#c084fc;

margin-bottom:10px;
}

.section-title{

font-size:50px;
line-height:1;

font-weight:900;

letter-spacing:-3px;

margin-bottom:14px;
}

.section-sub{

font-size:15px;
line-height:1.9;

max-width:760px;

color:#94a3b8;
}

/* =========================
STATS
========================= */

.stats{

display:grid;
grid-template-columns:
repeat(auto-fit,minmax(220px,1fr));

gap:18px;

margin-bottom:100px;
}

.stat{

padding:26px;

border-radius:28px;

background:
rgba(15,23,42,.68);

backdrop-filter:blur(20px);

border:
1px solid rgba(255,255,255,.06);

transition:.25s;
}

.stat:hover{

transform:translateY(-6px);

box-shadow:
0 25px 60px rgba(0,0,0,.45);

}

.stat-number{

font-size:38px;
font-weight:900;
letter-spacing:-3px;

margin-bottom:10px;
}

.stat-text{
font-size:13px;
line-height:1.7;
color:#94a3b8;
}

/* =========================
API CARDS
========================= */

.api-grid{

display:grid;
grid-template-columns:
repeat(auto-fit,minmax(320px,1fr));

gap:20px;
}

.api-card{

position:relative;

overflow:hidden;

padding:26px;

border-radius:30px;

background:
linear-gradient(
180deg,
rgba(15,23,42,.92),
rgba(2,6,23,.96)
);

border:
1px solid rgba(255,255,255,.06);

transition:.3s;
}

.api-card:hover{

transform:
translateY(-8px);

border-color:
rgba(168,85,247,.25);

box-shadow:
0 30px 80px rgba(0,0,0,.6);

}

.api-icon{

width:58px;
height:58px;

border-radius:20px;

display:flex;
align-items:center;
justify-content:center;

font-size:24px;

margin-bottom:20px;

background:
linear-gradient(
135deg,
rgba(168,85,247,.22),
rgba(59,130,246,.22)
);

}

.api-title{

font-size:20px;
font-weight:800;

margin-bottom:12px;
}

.api-desc{

font-size:14px;
line-height:1.8;

color:#94a3b8;

margin-bottom:20px;
}

.endpoint{

padding:14px;

border-radius:18px;

font-family:monospace;
font-size:12px;

background:
rgba(255,255,255,.03);

border:
1px solid rgba(255,255,255,.05);

word-break:break-all;

margin-bottom:20px;
}

.api-tags{
display:flex;
flex-wrap:wrap;
gap:10px;
}

.api-tag{

padding:8px 12px;

border-radius:999px;

font-size:11px;
font-weight:700;

background:
rgba(255,255,255,.04);

border:
1px solid rgba(255,255,255,.06);

color:#cbd5e1;
}

/* =========================
LIVE TEST
========================= */

.live-box{

display:grid;
grid-template-columns:.95fr 1.05fr;
gap:22px;
}

.live-panel{

padding:26px;

border-radius:32px;

background:
linear-gradient(
180deg,
rgba(15,23,42,.94),
rgba(2,6,23,.98)
);

border:
1px solid rgba(255,255,255,.06);
}

.form-group{
margin-bottom:18px;
}

.label{

display:block;

font-size:12px;
font-weight:700;

letter-spacing:.8px;

margin-bottom:10px;

color:#cbd5e1;
}

.input{

width:100%;
height:58px;

padding:0 18px;

border:none;
outline:none;

border-radius:18px;

background:
rgba(255,255,255,.04);

border:
1px solid rgba(255,255,255,.06);

color:#fff;

font-size:14px;
}

.select{
appearance:none;
}

.test-btn{

width:100%;
height:58px;

border:none;
cursor:pointer;

border-radius:18px;

color:#fff;

font-size:14px;
font-weight:800;

background:
linear-gradient(
135deg,
rgba(168,85,247,.36),
rgba(59,130,246,.36)
);

border:
1px solid rgba(255,255,255,.08);

transition:.25s;
}

.test-btn:hover{
transform:translateY(-3px);
}

.result{

height:100%;

min-height:500px;

background:#020617;

border-radius:24px;

padding:20px;

border:
1px solid rgba(255,255,255,.06);

overflow:auto;
}

pre{

font-size:12px;
line-height:1.7;

color:#d1d5db;

white-space:pre-wrap;
word-break:break-word;

font-family:monospace;
}

/* =========================
PLANS
========================= */

.plan-box{

display:grid;
grid-template-columns:
repeat(auto-fit,minmax(320px,1fr));

gap:22px;
}

.plan{

position:relative;

overflow:hidden;

padding:32px;

border-radius:34px;

background:
linear-gradient(
180deg,
rgba(15,23,42,.95),
rgba(2,6,23,.98)
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
1px solid rgba(168,85,247,.3);

box-shadow:
0 0 60px rgba(168,85,247,.12);
}

.plan-tag{

display:inline-flex;

padding:8px 14px;

border-radius:999px;

font-size:10px;
font-weight:700;
letter-spacing:1px;

margin-bottom:18px;

background:
rgba(255,255,255,.04);

border:
1px solid rgba(255,255,255,.06);
}

.plan-title{

font-size:34px;
font-weight:900;

letter-spacing:-3px;

margin-bottom:12px;
}

.price{

display:flex;
align-items:flex-end;
gap:8px;

margin-bottom:24px;
}

.price b{

font-size:54px;
line-height:1;

font-weight:900;
letter-spacing:-4px;
}

.price span{
font-size:14px;
opacity:.6;
}

.features{
display:flex;
flex-direction:column;
gap:14px;
}

.features div{

font-size:14px;
line-height:1.7;

color:#d1d5db;
}

.plan-btn{

width:100%;
height:58px;

margin-top:28px;

border:none;
cursor:pointer;

border-radius:18px;

font-size:14px;
font-weight:800;

color:#fff;

background:
linear-gradient(
135deg,
rgba(168,85,247,.36),
rgba(59,130,246,.36)
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
gap:18px;
}

.faq{

border-radius:26px;

overflow:hidden;

background:
rgba(15,23,42,.72);

border:
1px solid rgba(255,255,255,.06);
}

.faq-head{

padding:24px;

display:flex;
justify-content:space-between;
align-items:center;

cursor:pointer;
}

.faq-title{
font-weight:700;
}

.faq-body{

max-height:0;
overflow:hidden;

transition:.35s ease;
}

.faq-content{

padding:0 24px 24px;

font-size:14px;
line-height:1.9;

color:#94a3b8;
}

.faq.active .faq-body{
max-height:220px;
}

/* =========================
CTA
========================= */

.cta{

position:relative;

overflow:hidden;

padding:70px;

border-radius:42px;

background:
linear-gradient(
135deg,
rgba(168,85,247,.22),
rgba(59,130,246,.22)
);

border:
1px solid rgba(255,255,255,.08);

text-align:center;
}

.cta::before{

content:"";

position:absolute;

width:600px;
height:600px;

border-radius:50%;

background:
radial-gradient(
circle,
rgba(255,255,255,.08),
transparent 70%
);

top:-300px;
right:-100px;
}

.cta-title{

font-size:58px;
line-height:1;

font-weight:900;

letter-spacing:-4px;

margin-bottom:18px;
}

.cta-sub{

max-width:720px;

margin:auto;

font-size:16px;
line-height:1.9;

color:#d1d5db;

margin-bottom:28px;
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
rgba(2,6,23,.84);

backdrop-filter:blur(18px);

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

width:100%;
max-width:430px;

padding:28px;

border-radius:34px;

background:
linear-gradient(
180deg,
rgba(15,23,42,.96),
rgba(2,6,23,.99)
);

border:
1px solid rgba(255,255,255,.08);

box-shadow:
0 40px 120px rgba(0,0,0,.85),
0 0 70px rgba(168,85,247,.18);

transform:scale(.92);

transition:.35s;
}

.modal.show .modal-box{
transform:scale(1);
}

.modal-title{

font-size:28px;
font-weight:900;

margin-bottom:20px;
}

.pix-box{

display:flex;
align-items:center;
gap:12px;

padding:16px;

border-radius:20px;

background:
rgba(255,255,255,.04);

border:
1px solid rgba(255,255,255,.06);

margin-bottom:18px;
}

.pix-key{

flex:1;

font-size:12px;
line-height:1.7;

word-break:break-all;
}

.copy-btn{

width:52px;
height:52px;

border:none;
cursor:pointer;

border-radius:16px;

background:
rgba(255,255,255,.06);

color:#fff;

font-size:18px;
}

.modal-text{

font-size:14px;
line-height:1.9;

color:#cbd5e1;

margin-bottom:24px;
}

/* =========================
RESPONSIVE
========================= */

@media(max-width:980px){

.hero{
grid-template-columns:1fr;
}

.live-box{
grid-template-columns:1fr;
}

.hero-title{
font-size:58px;
}

.cta-title{
font-size:44px;
}

}

@media(max-width:700px){

.hero-title{
font-size:42px;
letter-spacing:-2px;
}

.section-title{
font-size:36px;
}

.cta{
padding:42px 24px;
}

.cta-title{
font-size:34px;
}

.header-right .header-link{
display:none;
}

}

</style>
</head>

<body>

<canvas id="particles"></canvas>

<header class="header">

<div class="container">

<div class="header-wrap">

<div class="logo">

<div class="logo-icon">✦</div>

<div>
<div style="font-size:11px;opacity:.6;letter-spacing:1px">
ASTRO PLATFORM
</div>

<div>
Astro APIs
</div>
</div>

</div>

<div class="header-right">

<a href="#apis" class="header-link">
APIs
</a>

<a href="#tester" class="header-link">
Testar
</a>

<a href="#planos" class="header-link">
Planos
</a>

<a href="#" class="header-btn" onclick="openModal()">
Comprar acesso
</a>

</div>

</div>

</div>

</header>

<section class="hero">

<div class="container">

<div class="hero">

<div>

<div class="hero-badge">
⚡ APIs premium • Respostas em tempo real
</div>

<h1 class="hero-title">
Infraestrutura <span>premium</span> para consultas privadas
</h1>

<p class="hero-sub">

Sistema avançado de APIs com consultas instantâneas,
retorno em JSON formatado, endpoints privados, dashboard
moderno e integração ultra rápida.

</p>

<div class="hero-actions">

<a href="#tester" class="btn btn-primary">
TESTAR AGORA
</a>

<a href="#planos" class="btn btn-secondary">
VER PLANOS
</a>

</div>

</div>

<div class="hero-side">

<div class="float-card float-1">
<small>LATÊNCIA</small>
<b>32ms</b>
</div>

<div class="float-card float-2">
<small>STATUS</small>
<b style="color:#4ade80">
ONLINE
</b>
</div>

<div class="terminal-box" id="mock">

<div class="term-top">
<div class="term-dot"></div>
<div class="term-dot"></div>
<div class="term-dot"></div>
</div>

<div class="terminal">

<div class="term-line">
<span class="term-purple">$</span>
Executando consulta CPF...
</div>

<div class="term-line">
<span class="term-blue">GET</span>
/cpf?token=astro&cpf=09009463699
</div>

<div class="term-line">
<span class="term-green">✓</span>
Status 200 OK
</div>

<div class="term-line">
Nome:
<span class="term-purple">
FLAVIANE DA SILVA AVELAR
</span>
</div>

<div class="term-line">
Cidade:
<span class="term-blue">
BETIM - MG
</span>
</div>

<div class="term-line">
<span class="term-green">
Consulta finalizada com sucesso
</span>
</div>

</div>

</div>

</div>

</div>

</div>

</section>

<div class="container">

<section class="stats">

<div class="stat">

<div class="stat-number">
99.9%
</div>

<div class="stat-text">
Uptime premium com servidores ultra rápidos e baixa latência.
</div>

</div>

<div class="stat">

<div class="stat-number">
+120M
</div>

<div class="stat-text">
Consultas processadas diariamente em nossa infraestrutura.
</div>

</div>

<div class="stat">

<div class="stat-number">
24/7
</div>

<div class="stat-text">
Sistema monitorado em tempo integral com proteção anti flood.
</div>

</div>

<div class="stat">

<div class="stat-number">
ILIMITADO
</div>

<div class="stat-text">
Plano premium sem limite de requisições e sem throttling.
</div>

</div>

</section>

<section class="section" id="apis">

<div class="section-top">

<div class="section-mini">
ENDPOINTS PREMIUM
</div>

<h2 class="section-title">
APIs disponíveis
</h2>

<p class="section-sub">

Explore endpoints privados com respostas ultra detalhadas
em tempo real.

</p>

</div>

<div class="api-grid">

<div class="api-card">

<div class="api-icon">
🪪
</div>

<div class="api-title">
Consulta CPF
</div>

<div class="api-desc">
Consulta completa de CPF com dados pessoais,
telefones, endereços, renda, score e muito mais.
</div>

<div class="endpoint">
/cpf?token=SEU_TOKEN&cpf=09009463699
</div>

<div class="api-tags">

<div class="api-tag">
JSON
</div>

<div class="api-tag">
Tempo real
</div>

<div class="api-tag">
Alta velocidade
</div>

</div>

</div>

<div class="api-card">

<div class="api-icon">
🏢
</div>

<div class="api-title">
Consulta CNPJ
</div>

<div class="api-desc">
Dados empresariais completos com sócios,
QSA, situação cadastral e atividades.
</div>

<div class="endpoint">
/cnpj?token=SEU_TOKEN&cnpj=00000000000191
</div>

<div class="api-tags">

<div class="api-tag">
Empresas
</div>

<div class="api-tag">
Receita
</div>

<div class="api-tag">
Completo
</div>

</div>

</div>

<div class="api-card">

<div class="api-icon">
📱
</div>

<div class="api-title">
Consulta Telefone
</div>

<div class="api-desc">
Retorno detalhado de operadora,
status, WhatsApp e informações adicionais.
</div>

<div class="endpoint">
/telefone?token=SEU_TOKEN&numero=31999999999
</div>

<div class="api-tags">

<div class="api-tag">
Operadora
</div>

<div class="api-tag">
WhatsApp
</div>

<div class="api-tag">
Lookup
</div>

</div>

</div>

</div>

</section>

<section class="section" id="tester">

<div class="section-top">

<div class="section-mini">
LIVE API TEST
</div>

<h2 class="section-title">
Teste em tempo real
</h2>

<p class="section-sub">

Digite um CPF e visualize o retorno da API ao vivo
diretamente na interface premium.

</p>

</div>

<div class="live-box">

<div class="live-panel">

<div class="form-group">

<label class="label">
ENDPOINT
</label>

<select class="input select" id="endpoint">

<option value="cpf">
Consulta CPF
</option>

</select>

</div>

<div class="form-group">

<label class="label">
CPF PARA CONSULTA
</label>

<input
type="text"
class="input"
id="cpf"
value="09009463699"
/>

</div>

<div class="form-group">

<label class="label">
TOKEN
</label>

<input
type="text"
class="input"
id="token"
value="fxckbuscas"
/>

</div>

<button class="test-btn" onclick="testApi()">
EXECUTAR CONSULTA
</button>

</div>

<div class="live-panel">

<div class="result">

<pre id="result">

{
"status": "aguardando consulta..."
}

</pre>

</div>

</div>

</div>

</section>

<section class="section" id="planos">

<div class="section-top">

<div class="section-mini">
PLANOS PREMIUM
</div>

<h2 class="section-title">
Escolha seu acesso
</h2>

<p class="section-sub">

Infraestrutura premium com acesso instantâneo
e requisições ilimitadas.

</p>

</div>

<div class="plan-box">

<div class="plan">

<div class="plan-tag">
PLANO INDIVIDUAL
</div>

<div class="plan-title">
1 API
</div>

<div class="price">
<b>R$20</b>
<span>pagamento único</span>
</div>

<div class="features">

<div>
✓ 1 endpoint premium
</div>

<div>
✓ Sem limite de consultas
</div>

<div>
✓ Alta velocidade
</div>

<div>
✓ Suporte prioritário
</div>

</div>

<button class="plan-btn" onclick="openModal('1 API • R$20')">
COMPRAR AGORA
</button>

</div>

<div class="plan plan-premium">

<div class="plan-tag">
MELHOR OFERTA
</div>

<div class="plan-title">
Todas APIs
</div>

<div class="price">
<b>R$50</b>
<span>vitalício</span>
</div>

<div class="features">

<div>
✓ Todas APIs liberadas
</div>

<div>
✓ Requisições ilimitadas
</div>

<div>
✓ Sem rate limit
</div>

<div>
✓ Atualizações inclusas
</div>

<div>
✓ Infraestrutura premium
</div>

</div>

<button class="plan-btn" onclick="openModal('Todas APIs • R$50')">
LIBERAR ACESSO
</button>

</div>

</div>

</section>

<section class="section">

<div class="section-top">

<div class="section-mini">
DÚVIDAS
</div>

<h2 class="section-title">
Perguntas frequentes
</h2>

</div>

<div class="faq-wrap">

<div class="faq">

<div class="faq-head">

<div class="faq-title">
As APIs possuem limite?
</div>

<div>+</div>

</div>

<div class="faq-body">

<div class="faq-content">

Não. Todos os planos funcionam sem limite
de requisições.

</div>

</div>

</div>

<div class="faq">

<div class="faq-head">

<div class="faq-title">
O acesso é imediato?
</div>

<div>+</div>

</div>

<div class="faq-body">

<div class="faq-content">

Sim. Após confirmação do pagamento o token
é liberado imediatamente.

</div>

</div>

</div>

<div class="faq">

<div class="faq-head">

<div class="faq-title">
Qual formato de resposta?
</div>

<div>+</div>

</div>

<div class="faq-body">

<div class="faq-content">

Todas APIs retornam JSON estruturado pronto
para integração em qualquer sistema.

</div>

</div>

</div>

</div>

</section>

<section class="cta">

<h2 class="cta-title">
Infraestrutura premium para APIs privadas
</h2>

<p class="cta-sub">

Integre consultas avançadas em segundos
com endpoints ultra rápidos, seguros e estáveis.

</p>

<a href="#" class="btn btn-primary" onclick="openModal()">
COMEÇAR AGORA
</a>

</section>

</div>

<!-- MODAL -->

<div class="modal" id="modal">

<div class="modal-box">

<div class="modal-title">
Finalizar compra
</div>

<div class="pix-box">

<div class="pix-key" id="pixText">
00020126580014BR.GOV.BCB.PIX0136SEU-PIX-AQUI520400005303986540550.005802BR5920ASTRO PREMIUM6009SAO PAULO62070503***6304ABCD
</div>

<button class="copy-btn" onclick="copyPix()">
⧉
</button>

</div>

<div class="modal-text">

Após o pagamento envie o comprovante para
o suporte e receba seu token premium instantaneamente.

</div>

<a href="#" class="btn btn-primary" style="width:100%">
CHAMAR SUPORTE
</a>

</div>

</div>

<script>

/* =========================
PARTICLES
========================= */

const canvas = document.getElementById('particles')
const ctx = canvas.getContext('2d')

let particles = []

function resize(){

canvas.width = innerWidth
canvas.height = innerHeight

}

addEventListener('resize',resize)

resize()

for(let i=0;i<120;i++){

particles.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height,

r:Math.random()*2,

dx:(Math.random()-.5)*.4,
dy:(Math.random()-.5)*.4

})

}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height)

particles.forEach(p=>{

p.x+=p.dx
p.y+=p.dy

if(p.x<0||p.x>canvas.width)p.dx*=-1
if(p.y<0||p.y>canvas.height)p.dy*=-1

ctx.beginPath()

ctx.arc(p.x,p.y,p.r,0,Math.PI*2)

ctx.fillStyle='rgba(255,255,255,.7)'

ctx.fill()

})

requestAnimationFrame(animate)

}

animate()

/* =========================
GLOW EFFECT
========================= */

document.querySelectorAll('.terminal-box').forEach(card=>{

card.addEventListener('mousemove',e=>{

const rect = card.getBoundingClientRect()

card.style.setProperty('--mx',
e.clientX-rect.left+'px')

card.style.setProperty('--my',
e.clientY-rect.top+'px')

})

})

/* =========================
FAQ
========================= */

document.querySelectorAll('.faq').forEach(faq=>{

faq.querySelector('.faq-head')
.addEventListener('click',()=>{

faq.classList.toggle('active')

})

})

/* =========================
MODAL
========================= */

const modal =
document.getElementById('modal')

function openModal(plan){

modal.classList.add('show')

}

function closeModal(){

modal.classList.remove('show')

}

modal.addEventListener('click',e=>{

if(e.target===modal){
closeModal()
}

})

function copyPix(){

const text =
document.getElementById('pixText').innerText

navigator.clipboard.writeText(text)

alert('PIX copiado.')

}

/* =========================
API TEST
========================= */

async function testApi(){

const cpf =
document.getElementById('cpf').value

const token =
document.getElementById('token').value

const result =
document.getElementById('result')

result.innerHTML =
'Consultando API...'

try{

const req =
await fetch(
'https://boks.stherlionato.workers.dev/cpf?token='
+ token +
'&cpf=' +
cpf
)

const json =
await req.json()

result.innerHTML =
JSON.stringify(json,null,2)

}catch(err){

result.innerHTML =
JSON.stringify({
status:false,
erro:err.message
},null,2)

}

}

</script>

</body>
</html>
`
}