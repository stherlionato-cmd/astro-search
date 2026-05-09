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

    return new Response("Not Found", { status: 404 })
  }
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

    let html = ""

    for(let key in obj){

      let value = obj[key]
      if(!value) continue

      if(Array.isArray(value)){
        if(value.length === 0) continue

        html += `
        <div class="section closed">
          <div class="section-title" onclick="toggleSection(this)">
            ${formatLabel(key)}
            <span class="arrow">›</span>
          </div>
          <div class="section-content">
        `

        value.forEach(item=>{
          if(typeof item === "object"){
            html += `<div class="sub-card">`

            for(let k in item){
              if(!item[k]) continue
              html += `
              <div class="field">
                <span>${formatLabel(k)}</span>
                <b>${item[k]}</b>
              </div>`
            }

            html += `</div>`
          }
        })

        html += `</div></div>`
        continue
      }

      if(typeof value === "object"){

        html += `
        <div class="section closed">
          <div class="section-title" onclick="toggleSection(this)">
            ${formatLabel(key)}
            <span class="arrow">›</span>
          </div>
          <div class="section-content">
        `

        for(let k in value){
          if(!value[k]) continue
          html += `
          <div class="field">
            <span>${formatLabel(k)}</span>
            <b>${value[k]}</b>
          </div>`
        }

        html += `</div></div>`
        continue
      }

      html += `
      <div class="field">
        <span>${formatLabel(key)}</span>
        <b>${value}</b>
      </div>`
    }

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

  border-radius:20px;
  padding:18px;
  margin-bottom:14px;

  border:1px solid rgba(255,255,255,0.05);

  transition:.25s ease;
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
 top:0;
 left:0;
 width:100%;
 height:100%;
 z-index:-1;
}

/* =========================
   💎 PLANS SECTION
========================= */

.plan-box{
  margin-top:22px;

  display:grid;

  grid-template-columns:
    repeat(auto-fit,minmax(210px,1fr));

  gap:14px;

  max-width:760px;
  margin-left:auto;
  margin-right:auto;
}

/* CARD */

.plan{
  position:relative;
  overflow:hidden;

min-height:295px;
padding:18px;
border-radius:22px;

  background:
    linear-gradient(
      180deg,
      rgba(15,23,42,.92),
      rgba(2,6,23,.88)
    );

  border:1px solid rgba(255,255,255,.06);

  backdrop-filter:blur(20px);

  display:flex;
  flex-direction:column;
  justify-content:space-between;

  transition:
    transform .45s ease,
    border-color .45s ease,
    box-shadow .45s ease;

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
      600px circle at var(--mx,50%) var(--my,50%),
      rgba(255,255,255,.10),
      transparent 40%
    );

  opacity:0;
  transition:.4s;
  z-index:0;
}

.plan:hover::before{
  opacity:1;
}

/* animated border */

.plan::after{
  content:"";

  position:absolute;
  inset:0;

  border-radius:inherit;
  padding:1px;

  background:
    linear-gradient(
      130deg,
      transparent,
      rgba(255,255,255,.18),
      transparent
    );

  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);

  -webkit-mask-composite:xor;
  mask-composite:exclude;

  opacity:.45;
}

/* hover */

.plan:hover{
  transform:
    perspective(1200px)
    rotateX(5deg)
    rotateY(-5deg)
    translateY(-10px);

  border-color:rgba(255,255,255,.14);

  box-shadow:
    0 30px 80px rgba(0,0,0,.65),
    0 0 50px rgba(59,130,246,.12);
}

/* featured */

.plan.highlight{
  border-color:rgba(59,130,246,.35);

  box-shadow:
    0 0 40px rgba(59,130,246,.18),
    inset 0 0 40px rgba(59,130,246,.05);
}

.plan.highlight:hover{
  box-shadow:
    0 0 60px rgba(59,130,246,.26),
    0 30px 80px rgba(0,0,0,.7);
}

/* premium */

.plan.premium{

  transform:scale(1.04);

  border:1px solid rgba(168,85,247,.45);

  background:
    linear-gradient(
      180deg,
      rgba(40,20,70,.96),
      rgba(10,6,25,.96)
    );

  box-shadow:
    0 0 70px rgba(168,85,247,.28),
    inset 0 0 80px rgba(168,85,247,.08);
}

.plan.premium:hover{
  box-shadow:
    0 0 70px rgba(168,85,247,.32),
    0 30px 80px rgba(0,0,0,.72);
}

/* particles */

.plan-particles{
  position:absolute;
  inset:0;
  overflow:hidden;
  pointer-events:none;
  z-index:0;
}

.plan-particles span{
  position:absolute;

  width:3px;
  height:3px;

  border-radius:50%;
  background:rgba(255,255,255,.55);

  animation:floatParticle linear infinite;
}

@keyframes floatParticle{
  from{
    transform:translateY(120px);
    opacity:0;
  }

  30%{
    opacity:1;
  }

  to{
    transform:translateY(-180px);
    opacity:0;
  }
}

/* content */

.plan > *{
  position:relative;
  z-index:2;
}

.plan .aurora{
  position:absolute;

  top:-120px;
  left:-40px;

  width:240px;
  height:240px;

  border-radius:50%;

  background:
    radial-gradient(
      circle,
      rgba(59,130,246,.22),
      transparent 70%
    );

  filter:blur(40px);

  z-index:0;

  animation:auroraMove 8s ease-in-out infinite;
}

.plan.premium .aurora{
  background:
    radial-gradient(
      circle,
      rgba(168,85,247,.28),
      transparent 70%
    );
}

@keyframes auroraMove{

  0%{
    transform:translate(0,0) scale(1);
  }

  50%{
    transform:translate(40px,20px) scale(1.1);
  }

  100%{
    transform:translate(0,0) scale(1);
  }

}

/* tags */

.plan-header{
  display:flex;
  gap:8px;
  margin-bottom:12px;
}

.tag{
  font-size:10px;
  font-weight:600;

  padding:5px 9px;

  border-radius:999px;

  backdrop-filter:blur(10px);

  border:1px solid rgba(255,255,255,.06);

  background:rgba(255,255,255,.04);
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
  font-size:24px;
  font-weight:700;

  margin-bottom:6px;

  letter-spacing:-1px;
}

/* price */

.price{
  display:flex;
  align-items:flex-end;
  gap:10px;

  margin:18px 0;
}

.old-price{
  font-size:13px;
  text-decoration:line-through;
  opacity:.35;
}

.new-price{
  font-size:34px;
  line-height:1;
  font-weight:800;
  letter-spacing:-2px;
}

.new-price small{
  font-size:14px;
  opacity:.6;
}

/* features */

.features{
  display:flex;
  flex-direction:column;
  gap:12px;

  margin-top:8px;
}

.features div{
  font-size:13px;
  color:#d1d5db;

  display:flex;
  align-items:center;
  gap:8px;
}

/* premium button */

.plan .btn{
  position:relative;
  overflow:hidden;

  margin-top:24px;

  min-height:56px;

  border-radius:16px;

  font-weight:600;

  background:
    linear-gradient(
      135deg,
      rgba(59,130,246,.22),
      rgba(139,92,246,.22)
    );

  border:1px solid rgba(255,255,255,.08);

  backdrop-filter:blur(10px);

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.06),
    0 10px 25px rgba(0,0,0,.35);
}

.plan .btn::before{
  content:"";

  position:absolute;
  top:0;
  left:-120%;

  width:80%;
  height:100%;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.25),
      transparent
    );

  transform:skewX(-25deg);

  transition:.7s;
}

.plan:hover .btn::before{
  left:150%;
}

.plan .btn:hover{
  transform:translateY(-2px) scale(1.01);

  box-shadow:
    0 0 30px rgba(59,130,246,.25),
    0 12px 30px rgba(0,0,0,.45);
}

@media(max-width:700px){

  .plan{
    min-height:auto;
  }

  .plan-title{
    font-size:24px;
  }

  .new-price{
    font-size:36px;
  }

}

.plan{
  opacity:0;
  transform:
    perspective(1200px)
    translateY(60px)
    scale(.92);

  animation:planReveal .9s cubic-bezier(.2,.8,.2,1) forwards;
}

.plan:nth-child(1){
  animation-delay:.08s;
}

.plan:nth-child(2){
  animation-delay:.18s;
}

.plan:nth-child(3){
  animation-delay:.28s;
}

@keyframes planReveal{

  to{
    opacity:1;

    transform:
      perspective(1200px)
      translateY(0)
      scale(1);
  }

}

/* ✨ estrelas topo premium */

.plan.premium .top-stars{
  position:absolute;
  top:10px;
  right:14px;

  display:flex;
  gap:6px;

  z-index:5;
}

.plan.premium .top-stars span{
  font-size:11px;
  color:#fff;

  opacity:.9;

  animation: premiumSparkle 2.2s infinite;
}

.plan.premium .top-stars span:nth-child(2){
  animation-delay:.8s;
}

.plan.premium .top-stars span:nth-child(3){
  animation-delay:1.5s;
}

@keyframes premiumSparkle{

  0%{
    transform:scale(.5) rotate(0deg);
    opacity:0;
  }

  50%{
    transform:scale(1.15) rotate(20deg);
    opacity:1;
  }

  100%{
    transform:scale(.5) rotate(0deg);
    opacity:0;
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

</style>
</head>

<body>

<canvas id="bg"></canvas>

<div class="container">

<div class="header">

  <div class="header-left">
    <div class="top-label">
      Plano atual
    </div>

    <div class="plan-name">
      ${isVip ? 'VIP' : 'FREE'}
    </div>
  </div>

  <div class="badge ${isVip ? 'vip' : 'free'}">
    ${isVip ? '✦ PREMIUM' : '● STANDARD'}
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

<div class="plan-box">

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

      <div class="plan-header">
        <span class="tag offer">OFERTA</span>
      </div>

      <div class="plan-title">
        Diário
      </div>

      <div class="price">
        <span class="old-price">R$20</span>

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
        <span class="tag offer">OFERTA</span>
        <span class="tag best">MAIS VENDIDO</span>
      </div>

      <div class="plan-title">
        Semanal
      </div>

      <div class="price">
        <span class="old-price">R$30</span>

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

// ⭐ ESTRELAS PREMIUM
const c = document.getElementById("bg");
const ctx = c.getContext("2d");

function resize(){
  c.width = window.innerWidth;
  c.height = document.body.scrollHeight;
}
let lastScroll = 0;

window.addEventListener("scroll", ()=>{
  lastScroll = window.scrollY;
});

resize();
window.addEventListener("resize", resize);

let stars = [];
let particles = [];

// 🔥 ESTRELAS
for(let i=0;i<220;i++){
  stars.push({
    x: Math.random()*c.width,
    y: Math.random()*c.height,
    speed: Math.random()*0.3 + 0.05,
    size: Math.random()*1.5,
    opacity: Math.random()
  });
}

// ✨ PARTÍCULAS
for(let i=0;i<80;i++){
  particles.push({
    x: Math.random()*c.width,
    y: Math.random()*c.height,
    size: Math.random()*2,
    speed: Math.random()*0.15 + 0.05
  });
}

function animate(){
  ctx.clearRect(0,0,c.width,c.height);

  c.style.top = lastScroll + "px";

  // ⭐ estrelas
  stars.forEach(s=>{
    s.y += s.speed;

    if(s.y > c.height){
      s.y = 0;
      s.x = Math.random()*c.width;
    }

    ctx.fillStyle = "rgba(255,255,255," + (0.2 + s.opacity) + ")";
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });

  // 🌫 partículas
  particles.forEach(p=>{
    p.y += p.speed;

    if(p.y > c.height){
      p.y = 0;
      p.x = Math.random()*c.width;
    }

    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

ctx.shadowBlur = 6;
ctx.shadowColor = "white";

const isVip = ${JSON.stringify(isVip)}

// VIP = mais partículas
if(isVip){

  stars = stars.slice(0,220)
  particles = particles.slice(0,80)

}else{

  // FREE = menos partículas
  stars = stars.slice(0,150)
  particles = particles.slice(0,35)

}

animate()

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
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Astro • Expirado</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

<style>
*{margin:0;padding:0;box-sizing:border-box}

body{
  font-family:'Inter',sans-serif;
  background:
    radial-gradient(circle at 20% 20%, rgba(59,130,246,0.12), transparent 40%),
    radial-gradient(circle at 80% 0%, rgba(147,51,234,0.12), transparent 40%),
    #020617;
  color:#e5e7eb;

  display:flex;
  align-items:center;
  justify-content:center;
  height:100vh;

  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* CARD */
.card{
  width:100%;
  max-width:380px;

  background: rgba(15,23,42,0.6);
  backdrop-filter: blur(16px);
  border-radius:20px;
  padding:24px;

  border:1px solid rgba(255,255,255,0.06);

  text-align:center;

  box-shadow:
    0 20px 60px rgba(0,0,0,0.6),
    0 0 40px rgba(59,130,246,0.15);

  animation:fadeUp .5s ease;
}

@keyframes fadeUp{
  from{
    opacity:0;
    transform:translateY(20px);
  }
  to{
    opacity:1;
    transform:translateY(0);
  }
}

/* ICON */
.icon{
  font-size:38px;
  margin-bottom:10px;
}

/* TITLE */
.title{
  font-size:18px;
  font-weight:600;
  margin-bottom:6px;
}

/* TEXT */
.text{
  font-size:13px;
  color:#9ca3af;
  margin-bottom:18px;
}

/* BUTTON */
.btn{
  display:block;
  text-decoration:none;
  padding:12px;
  border-radius:10px;
  font-weight:500;
  color:#fff;

  background: linear-gradient(90deg,#2563eb,#9333ea,#2563eb);
  background-size:200%;
  animation:gradientMove 4s linear infinite;

  transition:.2s;
}

.btn:hover{
  transform:translateY(-2px);
}

.btn:active{
  transform:scale(.97);
}

@keyframes gradientMove{
  0%{background-position:0%}
  100%{background-position:200%}
}

/* FOOTER */
.footer{
  margin-top:14px;
  font-size:11px;
  color:#6b7280;
}
</style>
</head>

<body>

<div class="card">

  <div class="icon">⏳</div>

  <div class="title">Resultado expirado</div>

  <div class="text">
    Esse link ficou indisponível após 1 hora.<br>
    Gere uma nova consulta ou desbloqueie acesso ilimitado.
  </div>

  <a href="https://t.me/consultasdedados_bot" target="_blank" class="btn">
    Gerar nova consulta
  </a>

  <div class="footer">
    Astro.app • Acesso seguro
  </div>

</div>

</body>
</html>
`
}