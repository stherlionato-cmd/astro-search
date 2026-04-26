export default {
  async fetch(request, env) {

    const url = new URL(request.url)

    // =========================
    // SALVAR RESULTADO
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
        { expirationTtl: 600 } // 10 min
      )

      return new Response("OK")
    }

    // =========================
    // VER RESULTADO
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
// HTML PREMIUM
// =========================
function renderApp(data){

return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Astro Search</title>

<!-- Fonte -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">

<style>

*{margin:0;padding:0;box-sizing:border-box}

body{
  font-family:'Inter',sans-serif;
  background:#020617;
  color:#fff;
  overflow-x:hidden;
}

/* 🌌 PARTICULAS */
canvas{
  position:fixed;
  top:0;
  left:0;
  z-index:-1;
}

/* CONTAINER */
.container{
  max-width:900px;
  margin:auto;
  padding:20px;
}

/* CARD */
.card{
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  backdrop-filter:blur(12px);
  border-radius:18px;
  padding:20px;
  margin-bottom:15px;
  transition:.3s;
}

.card:hover{
  transform:translateY(-3px);
}

/* TITULOS */
.title{
  font-size:18px;
  margin-bottom:10px;
  opacity:.9;
}

/* TEXTO */
.small{
  opacity:.6;
  font-size:13px;
}

/* BOTÃO */
.btn{
  display:inline-block;
  padding:10px 16px;
  border-radius:10px;
  background:#6366f1;
  color:#fff;
  text-decoration:none;
  margin-top:10px;
  font-size:14px;
  transition:.3s;
  cursor:pointer;
}

.btn:hover{
  background:#4f46e5;
}

/* COPY */
.copy{
  float:right;
  font-size:12px;
  opacity:.6;
  cursor:pointer;
}

/* MODAL */
.modal{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.7);
  display:none;
  align-items:center;
  justify-content:center;
}

.modal-box{
  background:#0f172a;
  padding:25px;
  border-radius:16px;
  text-align:center;
}

</style>
</head>

<body>

<canvas id="particles"></canvas>

<div class="container">

<!-- 🧠 ASTRO -->
<div class="card">
<div class="title">🚀 Astro Search</div>
<div class="small">Bot mais completo do Telegram</div>

<a class="btn" href="https://t.me/consultasdedados_bot">💎 Adquirir VIP</a>
</div>

<!-- 📢 UPDATES -->
<div class="card">
<div class="title">✅ Consulta realizada com sucesso!</div>
<div class="small">
Entre no canal de atualizações para acompanhar novidades e melhorias.
</div>

<a class="btn" href="https://t.me/consultas24">📢 Acessar Updates</a>
</div>

<!-- RESULTADO -->
<div class="card">
<div class="title">
🔍 Resultado da Consulta
<span class="copy" onclick="copyAll()">Copiar</span>
</div>

<div class="small">
👤 CONSULTA - NOME<br>
• Total de resultados: ${data.resultado.length}
</div>
</div>

<!-- LISTA -->
${data.resultado.map((p,i)=>`
<div class="card">

<div class="title">👤 RESULTADO ${i+1}</div>

<div class="small">
• CPF: ${p.cpf || "-"}<br>
• Nome: ${p.name || "-"}<br>
• Nascimento: ${p.birth_date || "-"}<br>
• Sexo: ${p.gender || "-"}<br>
• Mãe: ${p.mother_name || "-"}<br>
• Logradouro: ${p.address || "-"}<br>
</div>

</div>
`).join("")}

</div>

<!-- MODAL -->
<div class="modal" id="modal">
  <div class="modal-box">
    <div>📋 Copiado com sucesso!</div>
  </div>
</div>

<script>

// =======================
// COPIAR TUDO
// =======================
function copyAll(){
  let text = document.body.innerText;
  navigator.clipboard.writeText(text);

  let m = document.getElementById("modal");
  m.style.display="flex";
  setTimeout(()=>m.style.display="none",1500);
}

// =======================
// PARTICULAS SIMPLES
// =======================
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for(let i=0;i<60;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*2,
    d:Math.random()
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="rgba(99,102,241,0.5)";

  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();

    p.y += p.d;
    if(p.y > canvas.height){
      p.y = 0;
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

function renderError(){
return `
<html>
<body style="background:#000;color:#fff;text-align:center;padding:50px">
<h1>❌ Expirado ou inválido</h1>
</body>
</html>
`
  }
