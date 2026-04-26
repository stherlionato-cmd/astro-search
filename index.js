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
function renderApp(data) {
return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Astro Search</title>

<style>
body{
  font-family:sans-serif;
  background:#020617;
  color:#fff;
  padding:20px;
}

.card{
  background:#0f172a;
  padding:20px;
  border-radius:12px;
  margin-bottom:10px;
}

.title{
  font-size:20px;
  margin-bottom:10px;
}
</style>
</head>

<body>

<div class="title">🔍 Resultado</div>

<div class="card">
Busca: ${data.query}
</div>

${data.resultado.map(p => `
<div class="card">
<b>${p.name || "-"}</b><br>
CPF: ${p.cpf || "-"}<br>
Nascimento: ${p.birth_date || "-"}<br>
Mãe: ${p.mother_name || "-"}
</div>
`).join("")}

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
