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
        { expirationTtl: 3600 }
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
    radial-gradient(circle at 10% 10%, rgba(59,130,246,0.08), transparent 40%),
    radial-gradient(circle at 90% 0%, rgba(59,130,246,0.05), transparent 50%),
    #020617;

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
  margin-bottom:20px;

  position:sticky;
  top:0;
  background:rgba(2,6,23,0.6);
  backdrop-filter:blur(12px);
  padding-bottom:10px;
  z-index:10;
}

.logo{
  font-size:15px;
  font-weight:500;
  opacity:.8;
}

.badge{
  font-size:10px;
  padding:5px 10px;
  border-radius:999px;
  background:rgba(59,130,246,0.15);
  border:1px solid rgba(59,130,246,0.3);
}

/* CARD */
.card{
  background: rgba(15,23,42,0.55);
  backdrop-filter: blur(20px);

  border-radius:20px;
  padding:18px;
  margin-bottom:14px;

  border:1px solid rgba(255,255,255,0.05);

  transition:.25s ease;
}

.card:hover{
  transform:translateY(-4px);
  border-color:rgba(59,130,246,0.25);

  box-shadow:
    0 10px 40px rgba(0,0,0,0.6),
    inset 0 0 20px rgba(59,130,246,0.05);
}

/* TEXT */
.title{font-size:14px;font-weight:500;margin-bottom:6px}
.muted{font-size:12px;color:#94a3b8}

/* BUTTON */
.btn{
  display:block;
  margin-top:12px;
  text-align:center;
  padding:11px;
  border-radius:10px;
  text-decoration:none;
  color:#fff;
  font-size:13px;
}

.btn-primary{
  background: rgba(59,130,246,0.15);
  border:1px solid rgba(59,130,246,0.35);
}

.btn-primary:hover{
  background: rgba(59,130,246,0.25);
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

.plan-box{
 margin:20px 0;
}

.plan{
 margin-top:10px;
 padding:12px;
 border-radius:14px;
 background:rgba(255,255,255,0.03);
 border:1px solid rgba(255,255,255,0.05);
 transition:.25s;
}

.plan:hover{
 transform:translateY(-3px);
 border-color:rgba(59,130,246,.4);
}

.plan-title{
 font-size:13px;
 font-weight:600;
}

.price{
 font-size:16px;
 font-weight:700;
 margin:4px 0;
}

.old-price{
 text-decoration:line-through;
 opacity:.4;
 font-size:12px;
 margin-right:6px;
}

.features{
 font-size:11px;
 opacity:.7;
 margin-bottom:8px;
}

.plan.highlight{
 border:1px solid rgba(59,130,246,.5);
 background:rgba(59,130,246,.08);
}

.plan.premium{
 border:1px solid rgba(168,85,247,.5);
 background:rgba(168,85,247,.06);
 box-shadow:0 0 20px rgba(168,85,247,.15);
}

.tag{
 font-size:9px;
 padding:3px 6px;
 border-radius:6px;
 background:rgba(255,255,255,0.05);
}

.tag.offer{
 color:#ef4444;
}

.tag.best{
 color:#facc15;
}

.tag.lifetime{
 color:#c4b5fd;
}

.card{
  opacity:0;
  transform: translate(var(--x,0), var(--y,0)) translateY(30px);
}

.card.show{
  opacity:1;
  transform: translate(var(--x,0), var(--y,0)) translateY(0);
  transition:.6s ease;
}

.btn:active{
  transform:scale(.95);
  box-shadow:0 0 20px rgba(59,130,246,.6);
}

</style>
</head>

<body>

<canvas id="bg"></canvas>

<div class="container">

<div class="header">
  <div class="logo">Consulta</div>
  <div class="badge">Premium</div>
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

<div class="plan-box">

  <div style="font-size:13px; opacity:.7; margin-bottom:6px;">
    Planos
  </div>

  <!-- Diário -->
  <div class="plan">
    <div class="plan-header">
      <span class="tag offer">OFERTA</span>
    </div>

    <div class="plan-title">Diário</div>

    <div class="price">
      <span class="old-price">R$20</span>
      <span class="new-price">R$14,90</span>
    </div>

    <div class="features">
      <div>✔ Acesso por 24h</div>
      <div>✔ Consultas básicas</div>
    </div>

    <a href="https://t.me/consultasdedados_bot" class="btn btn-primary">
      Testar agora
    </a>
  </div>

  <!-- Mensal -->
  <div class="plan highlight">
    <div class="plan-header">
      <span class="tag offer">OFERTA</span>
      <span class="tag best">MAIS VENDIDO</span>
    </div>

    <div class="plan-title">Mensal</div>

    <div class="price">
      <span class="old-price">R$30</span>
      <span class="new-price">R$24,90</span>
    </div>

    <div class="features">
      <div>✔ Acesso ilimitado</div>
      <div>✔ Todas consultas</div>
      <div>✔ Prioridade</div>
    </div>

    <a href="https://t.me/consultasdedados_bot" class="btn btn-primary">
      Assinar agora
    </a>
  </div>

  <!-- Vitalício -->
  <div class="plan premium">
    <div class="plan-header">
      <span class="tag offer">OFERTA</span>
      <span class="tag lifetime">VITALÍCIO</span>
    </div>

    <div class="plan-title">Vitalício</div>

    <div class="price">
      <span class="old-price">R$50</span>
      <span class="new-price">R$20,90</span>
    </div>

    <div class="features">
      <div>✔ Acesso vitalício</div>
      <div>✔ Sem limites</div>
      <div>✔ Tudo liberado</div>
    </div>

    <a href="https://t.me/consultasdedados_bot" class="btn btn-primary">
      🚀 Desbloquear
    </a>
  </div>

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

document.querySelectorAll(".btn").forEach(btn=>{
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

animate();

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