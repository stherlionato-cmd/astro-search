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
        { expirationTtl: 3600
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

      // ARRAY
      if(Array.isArray(value)){
        if(value.length === 0) continue

        html += `
     <div class="section closed">
          <div class="section-title" onclick="toggleSection(this)">
            ${formatLabel(key)}
            <span class="arrow">▼</span>
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

      // OBJECT
      if(typeof value === "object"){

        html += `
       <div class="section closed">
          <div class="section-title" onclick="toggleSection(this)">
            ${formatLabel(key)}
            <span class="arrow">▼</span>
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

      // NORMAL
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
    <div class="card premium">
      <div class="title">Acesso Premium</div>
      <div class="muted">Desbloqueie tudo sem limites</div>

      <div class="plans">
        <div class="plan"><b>Diário</b><span>R$14,90</span></div>
        <div class="plan"><b>Semanal</b><span>R$24,90</span></div>
        <div class="plan highlight"><b>Vitalício</b><span>R$20,90</span></div>
      </div>

      <a class="btn btn-primary" href="https://t.me/consultasdedados_bot" target="_blank">
        Ativar acesso
      </a>
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
  background:
    radial-gradient(circle at 20% 20%, rgba(59,130,246,0.12), transparent 40%),
    radial-gradient(circle at 80% 0%, rgba(147,51,234,0.12), transparent 40%),
    #020617;
  color:#e5e7eb;
  display:flex;
  justify-content:center;

  /* 👇 AQUI */
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* CONTAINER */
.container{
  width:100%;
  max-width:900px;
  padding:24px 16px;
}

/* HEADER */
.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:24px;
}

.logo{
  font-size:20px;
  font-weight:600;
  letter-spacing:.8px;
}

.badge{
  font-size:11px;
  padding:6px 12px;
  border-radius:999px;
  background: linear-gradient(135deg,#2563eb,#9333ea);
  box-shadow:0 0 20px rgba(59,130,246,0.4);
}

/* CARD */
.card{
  background: rgba(15,23,42,0.6);
  backdrop-filter: blur(16px);
  border-radius:18px;
  padding:20px;
  margin-bottom:16px;
  border:1px solid rgba(255,255,255,0.06);

  transition:.25s;
}

.card{
  position:relative;
  overflow:hidden;
}

.card:hover{
  transform:translateY(-6px) scale(1.01);
  box-shadow:
    0 25px 80px rgba(37,99,235,0.25),
    0 0 0 1px rgba(59,130,246,0.2) inset;
}

.btn:active{
  transform: scale(.97);
}

/* PREMIUM CARD */
.card.premium{
  position:relative;
  border:1px solid rgba(59,130,246,0.5);
  background: linear-gradient(
    rgba(15,23,42,0.7),
    rgba(15,23,42,0.7)
  );

  box-shadow:
    0 0 50px rgba(59,130,246,0.2);
}

/* TEXT */
.title{font-size:15px;font-weight:500;margin-bottom:6px}
.muted{font-size:13px;color:#9ca3af}

/* BUTTON */
.btn{
  display:block;
  margin-top:14px;
  text-align:center;
  padding:12px;
  border-radius:10px;
  text-decoration:none;
  color:#fff;
  font-weight:500;
}

.btn-primary{
  background: linear-gradient(90deg,#2563eb,#9333ea,#2563eb);
  background-size:200%;
  animation:gradientMove 4s linear infinite;
}

@keyframes gradientMove{
  0%{background-position:0%}
  100%{background-position:200%}
}

/* RESULT */
.result-header{
  display:flex;
  justify-content:space-between;
  margin-bottom:10px;
}

.copy{
  font-size:12px;
  color:#6b7280;
  cursor:pointer;
}

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

/* FIELD */
.field{
  display:grid;
  grid-template-columns:110px 1fr;
  gap:10px;
  padding:10px 0;
  border-bottom:1px solid rgba(255,255,255,0.04);
}

.field b{
  font-weight:500;
  color:#f1f5f9;
}

/* SECTION */
.section{
  margin-top:16px;
}

.section-title{
  display:flex;
  justify-content:space-between;
  align-items:center;
  font-size:13px;
  font-weight:600;
  cursor:pointer;
  margin-bottom:6px;
}

.section-content{
  max-height: 1000px;
  overflow: hidden;
  transition: max-height .35s ease, opacity .25s ease;
  opacity:1;
}

.section.closed .section-content{
  max-height:0;
  opacity:0;
}

.arrow{
  font-size:10px;
  opacity:.6;
}

/* SUBCARD */
.sub-card{
  background: rgba(2,6,23,0.7);
  border-radius:12px;
  padding:10px;
  margin-bottom:8px;
}

/* PLANOS */
.plans{
  margin-top:12px;
  display:flex;
  flex-direction:column;
  gap:8px;
}

.plan{
  display:flex;
  justify-content:space-between;
  padding:10px;
  border-radius:10px;
  background:#020617;
  border:1px solid rgba(255,255,255,0.05);
}

.plan.highlight{
  border:1px solid #2563eb;
}

.arrow{
  transition: transform .3s ease;
}

.section.closed .arrow{
  transform: rotate(-90deg);
}

.header{
  position:sticky;
  top:0;
  backdrop-filter: blur(10px);
  background: rgba(2,6,23,0.6);
  padding-bottom:10px;
  z-index:10;
}

.card::before{
  content:"";
  position:absolute;
  left:0;
  top:0;
  height:100%;
  width:2px;
  background: linear-gradient(#2563eb,#9333ea);
  opacity:.4;
  border-radius:2px;
}

.section-title{
  cursor:pointer;
}

.btn{
  cursor:pointer;
}

</style>
</head>

<body>

<div class="container">

<div class="header">
<div class="logo">Astro<span style="opacity:.5">.app</span></div>
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
function copyCard(el){
navigator.clipboard.writeText(el.closest(".card").innerText).catch(()=>{})
  el.innerText="Copiado ✓"
  el.style.color="#22c55e"

  setTimeout(()=>{
    el.innerText="Copiar"
    el.style.color=""
  },1500)
}

function toggleSection(el){
  const section = el.parentElement
  const content = section.querySelector(".section-content")

  if(section.classList.contains("closed")){
    section.classList.remove("closed")
    content.style.maxHeight = content.scrollHeight + "px"
  } else {
    content.style.maxHeight = content.scrollHeight + "px"
    setTimeout(()=>{
      content.style.maxHeight = "0px"
    },10)
    section.classList.add("closed")
  }
}

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