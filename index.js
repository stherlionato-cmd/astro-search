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

  function flatten(obj, prefix=""){
    let out = {}
    for(let k in obj){
      let v = obj[k]
      let nk = prefix ? prefix+"_"+k : k
      if(v && typeof v === "object" && !Array.isArray(v)){
        Object.assign(out, flatten(v, nk))
      } else {
        out[nk] = v
      }
    }
    return out
  }

  function smartMap(obj){
    return {
      nome: obj.nome || obj.name || obj.nome_completo,
      cpf: obj.cpf || obj.doc || obj.documento,
      telefone: obj.telefone || obj.phone,
      nascimento: obj.nascimento || obj.birth_date,
      sexo: obj.sexo || obj.gender,
      cidade: obj.cidade || obj.city,
      estado: obj.uf || obj.state,
      ...obj
    }
  }

  function formatLabel(key){
    return key.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())
  }

  function renderFields(obj){
    const flat = flatten(obj)
    return Object.entries(flat)
      .filter(([_,v]) => v)
      .map(([k,v]) => `<div class="field"><b>${formatLabel(k)}:</b> ${v}</div>`)
      .join("")
  }

  const results = normalize(data.resultado)

  return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Astro SaaS</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">

<style>
*{margin:0;padding:0;box-sizing:border-box}

body{
  font-family:'Inter',sans-serif;
  background:#020617;
  color:#fff;
  overflow-x:hidden;
}

/* partículas */
canvas{
  position:fixed;
  top:0;left:0;
  z-index:-1;
}

/* layout */
.container{
  max-width:1000px;
  margin:auto;
  padding:20px;
}

/* header */
.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
}

.logo{
  font-size:22px;
  font-weight:600;
}

.badge{
  background:linear-gradient(45deg,#6366f1,#8b5cf6);
  padding:6px 12px;
  border-radius:999px;
  font-size:12px;
}

/* card */
.card{
  background:rgba(255,255,255,0.05);
  backdrop-filter:blur(12px);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:16px;
  padding:20px;
  margin-bottom:15px;
  transition:.3s;
}

.card:hover{
  transform:translateY(-3px);
  box-shadow:0 0 20px rgba(99,102,241,.2);
}

/* botão */
.btn{
  display:inline-block;
  padding:10px 16px;
  border-radius:10px;
  background:linear-gradient(45deg,#6366f1,#8b5cf6);
  color:#fff;
  text-decoration:none;
  margin-top:10px;
  margin-right:10px;
  font-size:14px;
}

/* campos */
.field{
  margin-bottom:4px;
  font-size:14px;
}

/* copiar */
.copy{
  float:right;
  font-size:12px;
  opacity:.6;
  cursor:pointer;
}

/* modal */
.modal{
  position:fixed;
  top:0;left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,.7);
  display:none;
  align-items:center;
  justify-content:center;
}

.modal-content{
  background:#020617;
  padding:30px;
  border-radius:16px;
  text-align:center;
}

</style>
</head>

<body>

<canvas id="bg"></canvas>

<div class="container">

<div class="header">
  <div class="logo">🚀 Astro SaaS</div>
  <div class="badge">💎 Premium</div>
</div>

<div class="card">
<b>Tipo:</b> ${data.tipo || "-"}<br>
<b>Busca:</b> ${data.query || "-"}<br>
<b>Total:</b> ${results.length}

<br><br>

<a class="btn" href="https://t.me/consutasdedados_bot" target="_blank">
🤖 Adquirir Bot
</a>

<a class="btn" href="https://t.me/consltas24" target="_blank">
📢 Canal Oficial
</a>

<button class="btn" onclick="openModal()">⚡ Sobre</button>

</div>

${results.map((p,i)=>{
  const mapped = smartMap(p)

  return `
<div class="card">
<div>
<b>👤 Resultado ${i+1}</b>
<span class="copy" onclick="copyCard(this)">Copiar</span>
</div>

<br>

📱 ${mapped.telefone || "-"}<br>
👤 ${mapped.nome || "-"}<br>
🪪 ${mapped.cpf || "-"}<br>
📍 ${(mapped.cidade || "-")} - ${(mapped.estado || "-")}

<br><br>

${renderFields(mapped)}

</div>
`
}).join("")}

</div>

<!-- MODAL -->
<div class="modal" id="modal">
  <div class="modal-content">
    <h2>🔥 Astro SaaS</h2>
    <p>Sistema Premium de consultas avançadas</p>
    <br>
    <button class="btn" onclick="closeModal()">Fechar</button>
  </div>
</div>

<script>
// copiar
function copyCard(el){
  const text = el.parentElement.parentElement.innerText
  navigator.clipboard.writeText(text)
  el.innerText = "Copiado!"
  setTimeout(()=>el.innerText="Copiar",1500)
}

// modal
function openModal(){
  document.getElementById("modal").style.display="flex"
}
function closeModal(){
  document.getElementById("modal").style.display="none"
}

// partículas
const canvas = document.getElementById("bg")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particles = []

for(let i=0;i<60;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    vx:(Math.random()-.5)*1,
    vy:(Math.random()-.5)*1
  })
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height)

  particles.forEach(p=>{
    p.x+=p.vx
    p.y+=p.vy

    if(p.x<0||p.x>canvas.width) p.vx*=-1
    if(p.y<0||p.y>canvas.height) p.vy*=-1

    ctx.beginPath()
    ctx.arc(p.x,p.y,1.5,0,Math.PI*2)
    ctx.fillStyle="#6366f1"
    ctx.fill()
  })

  requestAnimationFrame(animate)
}

animate()
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
  <body style="background:#000;color:#fff;text-align:center;padding:50px">
  <h1>❌ Expirado ou inválido</h1>
  </body>
  </html>
  `
}