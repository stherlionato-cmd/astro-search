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
      .map(([k,v])=>{
        const isSensitive = ["cpf","documento"].some(s=>k.toLowerCase().includes(s))

        return `
        <div class="field">
          <span>${formatLabel(k)}</span>
          <b class="${isSensitive ? "blur" : ""}">${v}</b>
        </div>
        `
      }).join("")
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
  background:#0b0f1a;
  color:#e5e7eb;
}

/* layout */
.container{
  max-width:820px;
  margin:auto;
  padding:20px;
}

/* header */
.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:24px;
}

.logo{
  font-size:18px;
  font-weight:500;
}

.badge{
  font-size:11px;
  padding:5px 10px;
  border-radius:999px;
  border:1px solid #1f2937;
  color:#9ca3af;
}

/* card */
.card{
  background:#0f172a;
  border:1px solid #1e293b;
  border-radius:14px;
  padding:18px;
  margin-bottom:14px;
  transition:.2s;
}

.card:hover{
  border-color:#334155;
}

/* title */
.title{
  font-size:15px;
  font-weight:500;
  margin-bottom:6px;
}

/* preview */
.preview{
  font-size:14px;
  margin-bottom:10px;
  color:#cbd5f5;
}

/* fields */
.field{
  display:flex;
  justify-content:space-between;
  font-size:13px;
  padding:4px 0;
  border-bottom:1px dashed #1e293b;
}

.field span{
  color:#6b7280;
}

/* blur premium */
.blur{
  filter:blur(5px);
  cursor:pointer;
  transition:.2s;
}

.blur:hover{
  filter:blur(0);
}

/* botão */
.btn{
  display:inline-block;
  padding:9px 14px;
  border-radius:8px;
  font-size:13px;
  text-decoration:none;
  margin-right:8px;
  border:1px solid #1f2937;
  background:#111827;
  color:#e5e7eb;
  transition:.2s;
}

.btn:hover{
  background:#1f2937;
}

/* destaque */
.btn-primary{
  background:#2563eb;
  border-color:#2563eb;
  color:#fff;
}

.btn-primary:hover{
  background:#1d4ed8;
}

/* copy */
.copy{
  float:right;
  font-size:12px;
  color:#6b7280;
  cursor:pointer;
}

/* modal */
.modal{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.6);
  display:none;
  align-items:center;
  justify-content:center;
}

.modal-box{
  background:#0f172a;
  border:1px solid #1e293b;
  padding:25px;
  border-radius:12px;
  text-align:center;
  max-width:300px;
}

</style>
</head>

<body>

<div class="container">

<div class="header">
  <div class="logo">Astro</div>
  <div class="badge">Premium</div>
</div>

<div class="card">

<div class="title">Consulta</div>

<div style="font-size:14px;color:#9ca3af;">
${data.tipo || "-"} • ${data.query || "-"}<br>
${results.length} resultado(s)
</div>

<br>

<a class="btn btn-primary" href="https://t.me/consutasdedados_bot" target="_blank">
Desbloquear completo
</a>

<a class="btn" href="https://t.me/consltas24" target="_blank">
Canal oficial
</a>

<button class="btn" onclick="openModal()">Sobre</button>

</div>

${results.map((p,i)=>{
  const mapped = smartMap(p)

  return `
<div class="card">

<div class="title">
Resultado ${i+1}
<span class="copy" onclick="copyCard(this)">Copiar</span>
</div>

<div class="preview">
${mapped.nome || "-"}<br>
${mapped.telefone || "-"} • <span class="blur">${mapped.cpf || "-"}</span>
</div>

${renderFields(mapped)}

</div>
`
}).join("")}

</div>

<!-- MODAL -->
<div class="modal" id="modal">
  <div class="modal-box">
    <h3>Astro Premium</h3>
    <p style="font-size:13px;color:#9ca3af;margin-top:8px;">
    Desbloqueie dados completos, consultas ilimitadas e prioridade.
    </p>
    <br>
    <a class="btn btn-primary" href="https://t.me/consutasdedados_bot">Acessar bot</a>
    <br><br>
    <button class="btn" onclick="closeModal()">Fechar</button>
  </div>
</div>

<script>
function copyCard(el){
  const text = el.parentElement.parentElement.innerText
  navigator.clipboard.writeText(text)
  el.innerText = "Copiado"
  setTimeout(()=>el.innerText="Copiar",1500)
}

function openModal(){
  document.getElementById("modal").style.display="flex"
}

function closeModal(){
  document.getElementById("modal").style.display="none"
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