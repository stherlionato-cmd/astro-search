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
function renderApp(data){

function formatLabel(key){
  return key
    .replace(/_/g," ")
    .replace(/\b\w/g,l=>l.toUpperCase())
}

// 🔥 render dinâmico
function renderFields(obj){
  return Object.entries(obj).map(([k,v])=>`
    • ${formatLabel(k)}: ${v || "-"}
  `).join("<br>")
}

return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Astro Search</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">

<style>
*{margin:0;padding:0;box-sizing:border-box}

body{
  font-family:'Inter',sans-serif;
  background:#020617;
  color:#fff;
}

/* partículas */
canvas{
  position:fixed;
  inset:0;
  z-index:-1;
}

/* layout */
.container{
  max-width:900px;
  margin:auto;
  padding:20px;
}

.card{
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  backdrop-filter:blur(12px);
  border-radius:18px;
  padding:20px;
  margin-bottom:15px;
  transition:.3s;
}

.card:hover{ transform:translateY(-3px) }

.title{ font-size:18px; margin-bottom:10px }
.small{ opacity:.6; font-size:13px }

.btn{
  display:inline-block;
  padding:10px 16px;
  border-radius:10px;
  background:#6366f1;
  color:#fff;
  text-decoration:none;
  margin-top:10px;
}

.copy{
  float:right;
  font-size:12px;
  opacity:.6;
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
  background:#0f172a;
  padding:20px;
  border-radius:12px;
}
</style>
</head>

<body>

<canvas id="particles"></canvas>

<div class="container">

<!-- HEADER -->
<div class="card">
<div class="title">🚀 Astro Search</div>
<div class="small">Bot mais completo do Telegram</div>

<a class="btn" href="https://t.me/consultasdedados_bot">💎 Adquirir VIP</a>
</div>

<!-- UPDATES -->
<div class="card">
<div class="title">✅ Consulta realizada com sucesso!</div>
<div class="small">Entre no canal para atualizações</div>

<a class="btn" href="https://t.me/consultas24">📢 Acessar Updates</a>
</div>

<!-- INFO -->
<div class="card">
<div class="title">
🔍 Resultado da Consulta
<span class="copy" onclick="copyAll()">Copiar</span>
</div>

<div class="small">
📂 Tipo: ${data.tipo || "consulta"}<br>
🔎 Busca: ${data.query}<br>
📊 Total: ${data.resultado.length}
</div>
</div>

<!-- RESULTADOS -->
${data.resultado.map((p,i)=>`
<div class="card">
<div class="title">👤 RESULTADO ${i+1}</div>
function renderApp(data){

function formatLabel(key){
  return key
    .replace(/_/g," ")
    .replace(/\b\w/g,l=>l.toUpperCase())
}

// 🔥 transforma QUALQUER coisa em array
function normalizeResults(res){
  if (!res) return []
  if (Array.isArray(res)) return res
  if (typeof res === "object") return [res]
  return [{ valor: res }]
}

// 🔥 flatten (resolve objetos dentro de objetos)
function flatten(obj, prefix = ""){
  let out = {}

  for (let k in obj){
    let val = obj[k]
    let newKey = prefix ? `${prefix}_${k}` : k

    if (val && typeof val === "object" && !Array.isArray(val)){
      Object.assign(out, flatten(val, newKey))
    } else {
      out[newKey] = val
    }
  }

  return out
}

// 🔥 remove lixo
function cleanValue(v){
  if (v === null || v === undefined) return "-"
  if (typeof v === "string" && v.trim() === "") return "-"
  return v
}

// 🔥 render dinâmico INTELIGENTE
function renderFields(obj){

  const flat = flatten(obj)

  return Object.entries(flat)
    .filter(([_,v]) => v !== null && v !== "" && v !== undefined)
    .map(([k,v])=>`
      • ${formatLabel(k)}: ${cleanValue(v)}
    `)
    .join("<br>")
}

// 🔥 aplica normalização
const results = normalizeResults(data.resultado)

return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Astro Search</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">

<style>
*{margin:0;padding:0;box-sizing:border-box}

body{
  font-family:'Inter',sans-serif;
  background:#020617;
  color:#fff;
}

canvas{
  position:fixed;
  inset:0;
  z-index:-1;
}

.container{
  max-width:900px;
  margin:auto;
  padding:20px;
}

.card{
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  backdrop-filter:blur(12px);
  border-radius:18px;
  padding:20px;
  margin-bottom:15px;
}

.title{ font-size:18px; margin-bottom:10px }
.small{ opacity:.6; font-size:13px }

.btn{
  display:inline-block;
  padding:10px 16px;
  border-radius:10px;
  background:#6366f1;
  color:#fff;
  text-decoration:none;
  margin-top:10px;
}

.copy{
  float:right;
  font-size:12px;
  opacity:.6;
  cursor:pointer;
}

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
  padding:20px;
  border-radius:12px;
}
</style>
</head>

<body>

<canvas id="particles"></canvas>

<div class="container">

<div class="card">
function renderApp(data){

// 🔥 helpers
function formatLabel(key){
  return key.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())
}

function normalize(res){
  if (!res) return []
  if (Array.isArray(res)) return res
  if (typeof res === "object") return [res]
  return [{ valor: res }]
}

function flatten(obj, prefix=""){
  let out={}
  for(let k in obj){
    let v=obj[k]
    let nk = prefix ? prefix+"_"+k : k

    if(v && typeof v==="object" && !Array.isArray(v)){
      Object.assign(out, flatten(v,nk))
    } else {
      out[nk]=v
    }
  }
  return out
}

function renderFields(obj){
  const flat = flatten(obj)

  return Object.entries(flat)
    .filter(([_,v]) => v!==null && v!=="" && v!==undefined)
    .map(([k,v])=>`• ${formatLabel(k)}: ${v}`)
    .join("<br>")
}

// 🔥 normaliza resultado
const results = normalize(data.resultado)

return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Astro Search</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">

<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter';background:#020617;color:#fff}
canvas{position:fixed;inset:0;z-index:-1}

.container{max-width:900px;margin:auto;padding:20px}

function renderApp(data){

function formatLabel(key){
  return key.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())
}

// normaliza QUALQUER resposta
function normalize(res){
  if (!res) return []
  if (Array.isArray(res)) return res
  if (typeof res === "object") return [res]
  return [{ valor: res }]
}

// achata objetos (resolve nested tipo endereco.cidade)
function flatten(obj, prefix=""){
  let out = {}

  for(let k in obj){
    let v = obj[k]
    let nk = prefix ? prefix+"_"+k : k

    if(v && typeof v==="object" && !Array.isArray(v)){
      Object.assign(out, flatten(v,nk))
    } else {
      out[nk] = v
    }
  }

  return out
}

// render dinâmico
function renderFields(obj){
  const flat = flatten(obj)

  return Object.entries(flat)
    .filter(([_,v]) => v !== null && v !== "" && v !== undefined)
    .map(([k,v])=>`• ${formatLabel(k)}: ${v}`)
    .join("<br>")
}

const results = normalize(data.resultado)

return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Astro Search</title>

<style>
body{font-family:Arial;background:#020617;color:#fff}
.container{max-width:900px;margin:auto;padding:20px}
.card{background:#111;padding:15px;border-radius:12px;margin-bottom:10px}
.title{font-size:18px;margin-bottom:10px}
.small{opacity:.7;font-size:13px}
</style>
</head>

<body>

<div class="container">

<div class="card">
<div class="title">🔍 Resultado</div>
<div class="small">
Tipo: ${data.tipo || "-"}<br>
Busca: ${data.query || "-"}<br>
Total: ${results.length}
</div>
</div>

${results.map((p,i)=>`
<div class="card">
<div class="title">👤 Resultado ${i+1}</div>
<div class="small">${renderFields(p)}</div>
</div>
`).join("")}

</div>

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
