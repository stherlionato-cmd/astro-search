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
        { expirationTtl: 600 }
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
          headers: { "Content-Type": "text/html" }
        })
      }

      return new Response(renderApp(JSON.parse(data)), {
        headers: { "Content-Type": "text/html" }
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
        <div class="section">
          <div class="section-title">${formatLabel(key)}</div>
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
          } else {
            html += `
            <div class="sub-card">
              <div class="field">
                <span>Valor</span>
                <b>${item}</b>
              </div>
            </div>`
          }

        })

        html += `</div>`
        continue
      }

      if(typeof value === "object"){

        html += `
        <div class="section">
          <div class="section-title">${formatLabel(key)}</div>
        `

        for(let k in value){
          if(!value[k]) continue
          html += `
          <div class="field">
            <span>${formatLabel(k)}</span>
            <b>${value[k]}</b>
          </div>`
        }

        html += `</div>`
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

  function renderPlans(){
    return `
    <div class="card">
      <div class="title">💎 Acesso Premium</div>
      <div class="muted">Desbloqueie consultas ilimitadas</div>

      <div class="plans">
        <div class="plan"><b>📅 Diário</b><span>R$14,90</span></div>
        <div class="plan"><b>📆 Semanal</b><span>R$24,90</span></div>
        <div class="plan highlight"><b>👑 Vitalício</b><span>R$20,90</span></div>
      </div>

      <div class="actions">
        <a class="btn btn-primary" href="https://t.me/consultasdedados_bot" target="_blank">
          🚀 Ativar agora
        </a>
      </div>
    </div>
    `
  }

  const results = normalize(data.resultado)

  return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Astro • Resultado</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

<style>
*{margin:0;padding:0;box-sizing:border-box}

body{
  font-family:'Inter',sans-serif;
  background: radial-gradient(circle at top, #0f172a, #020617);
  color:#e5e7eb;
  display:flex;
  justify-content:center;
}

/* PARTICULAS */
#stars{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index:0;
}

.container{
  position:relative;
  z-index:1;
  width:100%;
  max-width:860px;
  padding:24px 16px;
}

/* HEADER */
.header{
  display:flex;
  justify-content:space-between;
  margin-bottom:20px;
}

.logo{font-size:18px;font-weight:600}

.badge{
  font-size:11px;
  padding:6px 12px;
  border-radius:999px;
  background: linear-gradient(90deg,#2563eb,#9333ea);
}

/* CARD */
.card{
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border:1px solid rgba(255,255,255,0.05);
  border-radius:20px;
  padding:20px;
  margin-bottom:16px;
  box-shadow:0 10px 30px rgba(0,0,0,0.6);

  opacity:0;
  transform:translateY(10px);
  animation:fadeUp .5s ease forwards;
}

.card:nth-child(2){animation-delay:.1s}
.card:nth-child(3){animation-delay:.2s}
.card:nth-child(4){animation-delay:.3s}

@keyframes fadeUp{
  to{opacity:1;transform:translateY(0)}
}

/* TEXT */
.title{font-size:15px;font-weight:500;margin-bottom:6px}
.muted{font-size:13px;color:#9ca3af}

/* BUTTONS */
.actions{display:flex;gap:10px;margin-top:14px}

.btn{
  flex:1;
  text-align:center;
  padding:11px;
  border-radius:10px;
  background:#111827;
  color:#fff;
  text-decoration:none;
  transition:.2s;
}

.btn:hover{transform:translateY(-1px)}

.btn-primary{
  background: linear-gradient(135deg,#2563eb,#1d4ed8);
}

/* RESULT */
.result-header{
  display:flex;
  justify-content:space-between;
  margin-bottom:10px;
}

.copy{font-size:12px;color:#6b7280;cursor:pointer}
.copy:hover{color:#3b82f6}

/* PREVIEW */
.preview-name{
  font-size:16px;
  font-weight:600;
}

.preview-sub{
  font-size:13px;
  color:#9ca3af;
  margin-bottom:10px;
}

/* FIELD GRID */
.field{
  display:grid;
  grid-template-columns:130px 1fr;
  gap:12px;
  padding:10px 0;
  border-bottom:1px solid rgba(255,255,255,0.04);
}

.field:last-child{border:none}

.field span{color:#6b7280;font-size:12px}
.field b{word-break:break-word}

/* SECTIONS */
.section{
  margin-top:18px;
  padding-top:10px;
  border-top:1px solid rgba(255,255,255,0.04);
}

.section-title{
  font-size:13px;
  font-weight:600;
  margin-bottom:8px;
  color:#cbd5f5;
}

/* SUB CARD */
.sub-card{
  background: rgba(2,6,23,0.7);
  border:1px solid rgba(255,255,255,0.04);
  border-radius:12px;
  padding:12px;
  margin-bottom:10px;
}

/* PLANOS */
.plans{
  margin-top:12px;
  display:flex;
  flex-direction:column;
  gap:10px;
}

.plan{
  display:flex;
  justify-content:space-between;
  background:#020617;
  padding:12px;
  border-radius:10px;
  border:1px solid rgba(255,255,255,0.05);
}

.plan.highlight{
  border:1px solid #2563eb;
}
</style>
</head>

<body>

<canvas id="stars"></canvas>

<div class="container">

<div class="header">
  <div class="logo">Astro</div>
  <div class="badge">Premium</div>
</div>

<div class="card">
  <div class="title">Consulta realizada</div>
  <div class="muted">
    ${data.tipo || "-"} • ${data.query || "-"}<br>
    ${results.length} resultado(s)
  </div>

  <div class="actions">
    <a class="btn btn-primary" href="https://t.me/consultasdedados_bot" target="_blank">
      🚀 Acessar bot
    </a>
  </div>
</div>

${renderPlans()}

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
// COPY
function copyCard(el){
  navigator.clipboard.writeText(el.closest(".card").innerText)
  el.innerText="Copiado"
  setTimeout(()=>el.innerText="Copiar",1500)
}

// PARTICULAS
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

function createStars(){
  stars = [];
  for(let i=0;i<80;i++){
    stars.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.5,
      o: Math.random(),
      speed: Math.random()*0.3
    });
  }
}
createStars();

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  stars.forEach(s=>{
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle = \`rgba(59,130,246,\${s.o})\`;
    ctx.fill();

    s.y += s.speed;
    if(s.y > canvas.height){
      s.y = 0;
      s.x = Math.random()*canvas.width;
    }
  });

  requestAnimationFrame(draw);
}
draw();
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
  <html>
  <body style="
    background: radial-gradient(circle at top,#0f172a,#020617);
    color:#fff;
    display:flex;
    align-items:center;
    justify-content:center;
    height:100vh;
    font-family:Inter;
    text-align:center;
  ">

  <div>
    <h1>⏳ Resultado expirado</h1>
    <p style="color:#9ca3af;margin:10px 0 20px">
      Gere uma nova consulta ou desbloqueie acesso ilimitado
    </p>

    <a href="https://t.me/consultasdedados_bot"
       style="
       background:#2563eb;
       padding:12px 20px;
       border-radius:10px;
       color:#fff;
       text-decoration:none;
       display:inline-block;
       ">
       🚀 Acessar agora
    </a>

  </div>

  </body>
  </html>
  `
}