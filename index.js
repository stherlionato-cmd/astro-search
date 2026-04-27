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

  function formatLabel(key){
    return key.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())
  }

  const results = normalize(data.resultado)

  return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Astro</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

<style>
*{margin:0;padding:0;box-sizing:border-box}

body{
  font-family:'Inter',sans-serif;
  background:radial-gradient(circle at top,#0f172a,#020617);
  color:#e2e8f0;
  overflow-x:hidden;
}

/* partículas */
canvas{
  position:fixed;
  inset:0;
  z-index:-1;
  opacity:.4;
}

/* container */
.container{
  max-width:900px;
  margin:auto;
  padding:20px;
}

/* animação entrada */
.fade{
  animation:fade .6s ease;
}
@keyframes fade{
  from{opacity:0;transform:translateY(10px)}
  to{opacity:1;transform:translateY(0)}
}

/* card */
.card{
  background:rgba(15,23,42,.6);
  backdrop-filter:blur(14px);
  border:1px solid rgba(255,255,255,.06);
  border-radius:18px;
  padding:20px;
  margin-bottom:16px;
  transition:.25s;
}

.card:hover{
  border-color:#3b82f6;
  box-shadow:0 10px 30px rgba(59,130,246,.1);
}

/* header */
.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
}

.logo{
  font-size:20px;
  font-weight:600;
}

.badge{
  font-size:12px;
  padding:6px 12px;
  border-radius:999px;
  background:linear-gradient(45deg,#3b82f6,#6366f1);
  color:#fff;
}

/* sucesso */
.success{
  display:flex;
  gap:12px;
  align-items:flex-start;
}

.success-icon{
  width:40px;height:40px;
  border-radius:50%;
  background:#22c55e22;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#22c55e;
  font-size:18px;
}

/* botão */
.btn{
  padding:10px 14px;
  border-radius:10px;
  font-size:13px;
  text-decoration:none;
  border:1px solid rgba(255,255,255,.08);
  background:rgba(255,255,255,.04);
  color:#fff;
  transition:.2s;
  cursor:pointer;
}

.btn:hover{
  background:rgba(255,255,255,.08);
}

.btn-primary{
  background:linear-gradient(45deg,#3b82f6,#6366f1);
  border:none;
}

/* resultado */
.title{
  font-weight:500;
  margin-bottom:10px;
}

.preview{
  margin-bottom:10px;
  color:#cbd5f5;
}

/* fields */
.field{
  display:flex;
  justify-content:space-between;
  font-size:13px;
  padding:6px 0;
  border-bottom:1px dashed rgba(255,255,255,.05);
}

.field span{
  color:#94a3b8;
}

/* blur */
.blur{
  filter:blur(6px);
  cursor:pointer;
}

/* copy */
.copy{
  float:right;
  font-size:12px;
  color:#64748b;
  cursor:pointer;
}

/* modal */
.modal{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.7);
  display:none;
  align-items:center;
  justify-content:center;
}

.modal-box{
  background:#020617;
  padding:30px;
  border-radius:16px;
  text-align:center;
  width:300px;
  border:1px solid rgba(255,255,255,.08);
}
</style>
</head>

<body>

<canvas id="bg"></canvas>

<div class="container fade">

<div class="header">
  <div class="logo">Astro</div>
  <div class="badge">Premium</div>
</div>

<div class="card fade">

<div class="success">
<div class="success-icon">✓</div>
<div>
<b>Consulta realizada com sucesso</b>
<div style="font-size:13px;color:#94a3b8;margin-top:4px;">
Dados encontrados com alta precisão.
</div>
</div>
</div>

<br>

<button class="btn btn-primary" onclick="goBot()">Desbloquear completo</button>
<button class="btn" onclick="goChannel()">Canal</button>
<button class="btn" onclick="openModal()">Info</button>

</div>

${results.map((p,i)=>{
  const flat = flatten(p)

  return `
<div class="card fade">

<div class="title">
Resultado ${i+1}
<span class="copy" onclick="copyCard(this)">Copiar</span>
</div>

<div class="preview">
${flat.nome || "-"}<br>
${flat.telefone || "-"} • <span class="blur">${flat.cpf || "-"}</span>
</div>

${Object.entries(flat).map(([k,v])=>{
  if(!v) return ""
  const isSensitive = k.includes("cpf")

  return `
  <div class="field">
    <span>${formatLabel(k)}</span>
    <b class="${isSensitive?"blur":""}">${v}</b>
  </div>
  `
}).join("")}

</div>
`
}).join("")}

</div>

<!-- modal -->
<div class="modal" id="modal">
  <div class="modal-box">
    <h3>Astro Premium</h3>
    <p style="font-size:13px;color:#94a3b8;margin-top:6px;">
    Acesso completo, sem limites e prioridade.
    </p>
    <br>
    <button class="btn btn-primary" onclick="goBot()">Acessar</button>
    <br><br>
    <button class="btn" onclick="closeModal()">Fechar</button>
  </div>
</div>

<script>
// partículas elegantes
const c=document.getElementById("bg")
const ctx=c.getContext("2d")
c.width=innerWidth
c.height=innerHeight

let p=[]
for(let i=0;i<40;i++){
  p.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:.3,vy:.3})
}

function loop(){
  ctx.clearRect(0,0,c.width,c.height)
  p.forEach(d=>{
    d.x+=d.vx
    d.y+=d.vy
    if(d.x>c.width||d.y>c.height){d.x=0;d.y=0}
    ctx.beginPath()
    ctx.arc(d.x,d.y,1.2,0,6.28)
    ctx.fillStyle="#3b82f6"
    ctx.fill()
  })
  requestAnimationFrame(loop)
}
loop()

function copyCard(el){
  navigator.clipboard.writeText(el.parentElement.parentElement.innerText)
  el.innerText="Copiado"
  setTimeout(()=>el.innerText="Copiar",1500)
}

function openModal(){
  document.getElementById("modal").style.display="flex"
}
function closeModal(){
  document.getElementById("modal").style.display="none"
}

function goBot(){
  window.open("https://t.me/consutasdedados_bot","_blank")
}

function goChannel(){
  window.open("https://t.me/consltas24","_blank")
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
  <html>
  <body style="background:#000;color:#fff;text-align:center;padding:50px">
  <h1>❌ Expirado ou inválido</h1>
  </body>
  </html>
  `
}