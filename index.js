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

      // =========================
      // ARRAY
      // =========================
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
            html += `<div class="field"><b>${item}</b></div>`
          }

        })

        html += `</div>`
        continue
      }

      // =========================
      // OBJETO
      // =========================
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

      // =========================
      // SIMPLES
      // =========================
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

<title>Astro</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

<style>
*{margin:0;padding:0;box-sizing:border-box}

body{
  font-family:'Inter',sans-serif;
  background:#0b0f1a;
  color:#e5e7eb;
}

.container{
  max-width:820px;
  margin:auto;
  padding:20px;
}

.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:24px;
}

.logo{
  font-size:18px;
  font-weight:600;
}

.badge{
  font-size:11px;
  padding:5px 10px;
  border-radius:999px;
  border:1px solid #1f2937;
  color:#9ca3af;
}

.card{
  background:#0f172a;
  border:1px solid #1e293b;
  border-radius:16px;
  padding:18px;
  margin-bottom:14px;
}

.title{
  font-size:15px;
  font-weight:500;
  margin-bottom:6px;
}

.muted{
  font-size:13px;
  color:#9ca3af;
}

.actions{
  display:flex;
  gap:10px;
  margin-top:12px;
}

.btn{
  flex:1;
  text-align:center;
  padding:10px;
  border-radius:10px;
  font-size:13px;
  text-decoration:none;
  border:1px solid #1f2937;
  background:#111827;
  color:#e5e7eb;
}

.btn:hover{
  background:#1f2937;
}

.btn-primary{
  background:#2563eb;
  border-color:#2563eb;
  color:#fff;
}

.result-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:10px;
}

.copy{
  font-size:12px;
  color:#6b7280;
  cursor:pointer;
}

.preview{
  font-size:14px;
  margin-bottom:10px;
  color:#cbd5f5;
}

.field{
  display:flex;
  justify-content:space-between;
  font-size:13px;
  padding:5px 0;
  border-bottom:1px dashed #1e293b;
}

.field span{
  color:#6b7280;
}

.section{
  margin-top:16px;
}

.section-title{
  font-size:13px;
  font-weight:600;
  margin-bottom:6px;
  color:#cbd5f5;
}

.sub-card{
  background:#020617;
  border:1px solid #1e293b;
  border-radius:10px;
  padding:10px;
  margin-bottom:8px;
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
  <div class="title">Consulta realizada</div>
  <div class="muted">
    ${data.tipo || "-"} • ${data.query || "-"}<br>
    ${results.length} resultado(s)
  </div>

  <div class="actions">
    <a class="btn btn-primary" href="https://t.me/consultasdedados_bot" target="_blank">
      Adquirir bot
    </a>
    <a class="btn" href="https://t.me/consultas24" target="_blank">
      Canal oficial
    </a>
  </div>
</div>

${results.map((p,i)=>{

  return `
  <div class="card">

    <div class="result-header">
      <div class="title">Resultado ${i+1}</div>
      <div class="copy" onclick="copyCard(this)">Copiar</div>
    </div>

    <div class="preview">
      ${p.nome || "-"}<br>
      ${p.telefone || "-"} • ${p.cpf || "-"}
    </div>

    ${renderFields(p)}

  </div>
  `
}).join("")}

</div>

<script>
function copyCard(el){
  navigator.clipboard.writeText(el.parentElement.parentElement.innerText)
  el.innerText="Copiado"
  setTimeout(()=>el.innerText="Copiar",1500)
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