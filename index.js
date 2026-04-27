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

  // 🔥 normaliza qualquer retorno
  function normalize(res){
    if (!res) return []
    if (Array.isArray(res)) return res
    if (typeof res === "object") return [res]
    return [{ valor: res }]
  }

  // 🔥 achata objetos (nested)
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

  // 🔥 traduz campos automaticamente
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

  // 🔥 label bonita
  function formatLabel(key){
    return key
      .replace(/_/g," ")
      .replace(/\b\w/g,l=>l.toUpperCase())
  }

  // 🔥 render automático
  function renderFields(obj){
    const flat = flatten(obj)

    return Object.entries(flat)
      .filter(([_,v]) => v !== null && v !== "" && v !== undefined)
      .map(([k,v]) => `<div><b>${formatLabel(k)}:</b> ${v}</div>`)
      .join("")
  }

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

body{
  font-family:'Inter',sans-serif;
  background:#020617;
  color:#fff;
}

/* layout */
.container{
  max-width:900px;
  margin:auto;
  padding:20px;
}

/* card */
.card{
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:16px;
  padding:20px;
  margin-bottom:15px;
}

/* título */
.title{
  font-size:18px;
  margin-bottom:10px;
}

/* texto */
.small{
  opacity:.8;
  font-size:14px;
}

/* botão */
.btn{
  display:inline-block;
  padding:10px 16px;
  border-radius:10px;
  background:#6366f1;
  color:#fff;
  text-decoration:none;
  margin-top:10px;
}

/* copiar */
.copy{
  float:right;
  font-size:12px;
  opacity:.6;
  cursor:pointer;
}
</style>
</head>

<body>

<div class="container">

<!-- HEADER -->
<div class="card">
<div class="title">🚀 Astro Search</div>
<div class="small">
Tipo: ${data.tipo || "-"}<br>
Busca: ${data.query || "-"}<br>
Total: ${results.length}
</div>
</div>

<!-- RESULTADOS -->
${results.map((p,i)=>{

  const mapped = smartMap(p)

  return `
<div class="card">

<div class="title">
👤 Resultado ${i+1}
<span class="copy" onclick="copyCard(this)">Copiar</span>
</div>

<div class="small">

<!-- preview estilo bot -->
📱 ${mapped.telefone || "-"}<br>
👤 ${mapped.nome || "-"}<br>
🪪 ${mapped.cpf || "-"}<br>
📍 ${(mapped.cidade || "-")} - ${(mapped.estado || "-")}

<br><br>

${renderFields(mapped)}

</div>

</div>
`
}).join("")}

</div>

<script>
function copyCard(el){
  const text = el.parentElement.parentElement.innerText
  navigator.clipboard.writeText(text)
  el.innerText = "Copiado!"
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