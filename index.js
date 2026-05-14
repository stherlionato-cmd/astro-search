<?php
error_reporting(0);

ignore_user_abort(true);
set_time_limit(0);

header("Content-Type: application/json");
http_response_code(200);

$PLANOS = [
    "diario" => "14.90",
    "semanal" => "24.90",
    "vitalicio" => "20.90"
];

$CHAVE_PIX = "de02994d-f391-4b9b-acf8-865b721d3082";

$GATEWAY_USER_ID = "8588669245";

/* LER UPDATE UMA VEZ */
$update = json_decode(file_get_contents("php://input"), true);

echo json_encode(["status"=>"ok"]);
flush();

/* ================= CONFIG ================= */

$TOKEN = "8669340911:AAHgt35G_2PN_uFJV1xfSpjgxjaIrbsbx3I";
$API   = "https://api.telegram.org/bot{$TOKEN}";

/* IMAGEM */
$START_PHOTO = "https://www.image2url.com/r2/default/images/1778124626770-6ba419b8-a49f-4da8-a3f4-9a3ebc920e06.png";

/* PIX */
$PIX_VALOR = "20.00"; // ponto, não vírgula
$PIX_CHAVE = "f0d0f3b1-8776-4f06-a254-b6ea3686f71a";
$PIX_NOME  = "Gabriel Lorenzo";
$STICKER_LOADING = "CAACAgIAAxkBAAEQUkBpdQ4VdCPwAybo7q4AAVMxYnM6HzYAAhYMAAL5LuBLduZ5vHwXjSs4BA";

/* ================= VIP ================= */

$VIP_IDS = [
    8750007118,
    8519811054,
    868129183,
    1071470503,
    8324164906,
    8330472177,
    6478338344,
    1560888744,
    8624077199,
    7587344280,
    8760709407,
    6248181605,
    6885652108,
    5187490736,
    7455932359,
    7907538026,
    8352795914,
    8259061762,
    8675405592,
    6757273515, 
    8588669245,
    7792311413,
    2055451956,
    7422690728,
    8751158979,
    6140087109,
    8405956241,
    7834029992,
    1514664793,
    667700028,
    5805915267,
    1201267963,
    107712182,
    1200912475,
    6133561216,
    8366557375,
    7397253532,
    1143087851,
    8554927341,
    8351384627,
    8204026757,
    7320236887,
    5883599738,
    8629031700,
    2022738933,
    8352881138,
    1853541807,
    8741164962,
    8309549091,
    1236474129,
    6013089981,
    8382487374,
    5525235852,
    964661976,
    5634005859,
    6208327464,
    1749162814,
    8603729320,
    6517370977,
    8336817408,
    5622054961,
    2117572146,
    1087968824,
    1178332329,
    1192229583,
    8539968886,
    7073604499,
    7997555016,
    7768611465,
    6792865266,
    7004715777,
    1889033498,
    8103460340,
];

$BANIDOS = [
    8017850151
];

$PAYMENTS = [];
$GATEWAY_USER_ID = "8588669245";

function isVip($id){

global $VIP_IDS;

if(in_array($id,$VIP_IDS)){
return true;
}

$vipFile = __DIR__."/vip_users.json";

if(!file_exists($vipFile)){
return false;
}

$vip = json_decode(file_get_contents($vipFile),true);

if(!is_array($vip)){
return false;
}

return in_array($id,$vip);

}

function isBanned($id){
    global $BANIDOS;
    return in_array($id, $BANIDOS);
}

function isGroupChat($type){
    return in_array($type, ["group","supergroup"]);
}

define("VIP_CODES_DB","vip_codes.json");
$OWNER_ID = 8588669245;

define("WELCOME_DB", "welcome.json");

/* ================= FREE MODE GRUPOS ================= */

define("FREE_DB","free_groups.json");

function ativarFreeGrupo($chat){

    $data = [];

    if(file_exists(FREE_DB)){
        $data = json_decode(file_get_contents(FREE_DB), true);
    }

    // Apenas marca como ativo (sem tempo)
    $data[$chat] = true;

    file_put_contents(FREE_DB, json_encode($data));
}

function isFreeGroup($chat){

    if(!file_exists(FREE_DB)){
        return false;
    }

    $data = json_decode(file_get_contents(FREE_DB), true);

    // Só verifica se existe e está ativo
    return isset($data[$chat]) && $data[$chat] === true;
}

function setWelcome($chat, $status){

    $data = [];

    if(file_exists(WELCOME_DB)){

        $json = file_get_contents(WELCOME_DB);

        $decode = json_decode($json, true);

        if(is_array($decode)){
            $data = $decode;
        }
    }

    $data[(string)$chat] = (int)$status;

    file_put_contents(
        WELCOME_DB,
        json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );
}

function isWelcome($chat){

    if(!file_exists(WELCOME_DB)){
        return false;
    }

    $json = file_get_contents(WELCOME_DB);

    $data = json_decode($json, true);

    if(!is_array($data)){
        return false;
    }

    return isset($data[(string)$chat]) && $data[(string)$chat] === 1;
}

/* ================= UPDATE ================= */

$message  = $update["message"] ?? null;
$callback = $update["callback_query"] ?? null;

$msgId   = $message["message_id"] ?? null;
$chat    = $message["chat"]["id"] ?? null;
$userId  = $message["from"]["id"] ?? null;
$chatType = $message["chat"]["type"] ?? null;

// 👋 NOVOS MEMBROS
if($message && isset($message["new_chat_members"])){

    if(!isWelcome($chat)){
        return;
    }

    foreach($message["new_chat_members"] as $user){

        $nome = $user["first_name"];
        $id   = $user["id"];

        $texto =
"👋 <b>Bem-vindo ao Astro Search!</b>

Olá, <a href=\"tg://user?id={$id}\"><b>{$nome}</b></a> 🚀

🔎 Aqui você pode fazer diversas consultas.

💎 Para acesso completo, adquira o VIP.

👇 Use o menu abaixo para começar:";

        tg("sendPhoto",[
            "chat_id"=>$chat,
            "photo"=>$START_PHOTO,
            "caption"=>$texto,
            "parse_mode"=>"HTML",
            "reply_markup"=>json_encode([
                "inline_keyboard"=>[
                    [
                        ["text"=>"🚀 Abrir Menu","url"=>"https://t.me/consultasdedados_bot"]
                    ]
                ]
            ])
        ]);
    }
}

if(isset($update["message"])){

    $chat_id = $update["message"]["chat"]["id"];
    $message_id = $update["message"]["message_id"];
    $user_id = $update["message"]["from"]["id"];

    // Ignora privado
    if($update["message"]["chat"]["type"] != "private"){

        // NÃO apaga dono
        if($user_id != $OWNER_ID){

            // roda em paralelo (sem travar bot)
            exec("php delete.php {$chat_id} {$message_id} > /dev/null 2>&1 &");
        }
    }
}

/* APAGAR COMANDOS NO GRUPO (EXCETO DO ADMIN) */

$ADMIN_ID = 8588669245; // seu ID

if($message && isset($message["text"])){

if(
    ($chatType == "group" || $chatType == "supergroup") &&
    substr($message["text"],0,1) == "/" &&
    $userId != $ADMIN_ID
){

tg("deleteMessage",[
"chat_id"=>$chat,
"message_id"=>$msgId
]);

}

}

if($message && isset($message["chat"])){

    $chat_id = $message["chat"]["id"];
    $type = $message["chat"]["type"];

    if($type == "group" || $type == "supergroup"){

        $file = "grupos.json";

        if(!file_exists($file)){
            file_put_contents($file, json_encode([]));
        }

        $data = json_decode(file_get_contents($file), true);

        if(!isset($data[$chat_id])){
            $data[$chat_id] = true;
            file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
        }
    }
}

/* ====== BLOQUEIO GLOBAL ====== */

$userId = $message["from"]["id"] ?? $callback["from"]["id"] ?? null;

if($userId && isBanned($userId)){

    if($message){
        tg("sendMessage",[
            "chat_id"=>$message["chat"]["id"],
            "text"=>"⛔️ Você está banido de usar este bot."
        ]);
    }

    if($callback){
        tg("answerCallbackQuery",[
            "callback_query_id"=>$callback["id"],
            "text"=>"⛔️ Você está banido.",
            "show_alert"=>true
        ]);
    }

    exit;
}
/* ================= API ================= */

function tg($method, $data){
    global $API;
    $ch = curl_init($API."/".$method);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $data
    ]);
    $res = curl_exec($ch);
    curl_close($ch);
    return $res;
}

function answer($id){
    tg("answerCallbackQuery", ["callback_query_id"=>$id]);
}

/* ================= TUTORIAL / BLOQUEIO ================= */

function tutorial($chat,$cmd){

    $map = [

        // 🔒 VIP
        "/cpf"         => "12345678900",
        "/nome"        => "João Silva",
        "/vizinhos"     => "12345678900",
        "/rg"          => "1234567",
        "/cnh"         => "12345678900",
        "/telefone"    => "11999999999",
        "/email"       => "teste@email.com",
        "/placa"       => "ABC1D23",
        "/pix"         => "email@pix.com",
        "/renavam"     => "123456789",
        "/nascimento"  => "01012000",
        "/foto"        => "",

        // ♻️ GRÁTIS
        "/cep"  => "01001000",
        "/cnpj" => "00000000000100",
        "/ip"   => "8.8.8.8",
    ];

    $exemplo = $map[$cmd] ?? "123456";

    $texto =
"📘 <b>Como usar</b>

<b>{$cmd}</b>
Exemplo:
<code>{$cmd}".($exemplo ? " {$exemplo}" : "")."</code>";

    tg("sendMessage",[
        "chat_id"=>$chat,
        "text"=>$texto,
        "parse_mode"=>"HTML"
    ]);
}
function bloquearConsulta($chat){

    tg("sendPhoto",[
        "chat_id"=>$chat,
        "photo"=>"https://www.image2url.com/r2/default/images/1778262184493-92c2e3a2-0377-4fbf-8341-c1520419e6da.png",
        "caption"=>
"🔒 <b>ACESSO RESTRITO</b>

Essa consulta é exclusiva para usuários VIP.

Seu plano atual é <b>Gratuito</b> e possui limitações.

━━━━━━━━━━━━━━━
💎 <b>Benefícios do VIP:</b>

• Consultas liberadas  
• Dados completos  
• Respostas mais rápidas  
• Sem limites  

━━━━━━━━━━━━━━━
💰 <b>Planos disponíveis:</b>

📅 Diário: R$ 14,90
📆 Semanal: R$ 24,90
👑 Para Sempre: R$ 20,90 - <b>Oferta!</b> 

🚀 Liberação automática após pagamento

👇 Escolha seu plano abaixo:",
        "parse_mode"=>"HTML",
        "reply_markup"=>json_encode([
            "inline_keyboard"=>[
                [["text"=>"💳 Ver Planos","callback_data"=>"planos"]],
                [["text"=>"⬅️ Menu","callback_data"=>"voltar_menu"]]
            ]
        ])
    ]);

}

if($message && isset($message["text"])){

    $text = $message["text"];

    if($text == "/plano"){

        $nome = $message["from"]["first_name"];
        $id   = $message["from"]["id"];

        // verifica VIP
        if(isVip($id)){

            $msgPlano =
"💎 <b>SEU PLANO ATUAL</b>

━━━━━━━━━━━━━━━
👤 Usuário: <a href=\"tg://user?id={$id}\">{$nome}</a>

💎 Status: <b>VIP ATIVO</b>

━━━━━━━━━━━━━━━
🔥 Benefícios:

• Consultas ilimitadas  
• Dados completos  
• Prioridade no sistema  
• Acesso total  

━━━━━━━━━━━━━━━
🚀 Aproveite ao máximo seu acesso!";

        } else {

            $msgPlano =
"🔓 <b>PLANO GRATUITO</b>

━━━━━━━━━━━━━━━
👤 Usuário: <a href=\"tg://user?id={$id}\">{$nome}</a>

📉 Status: <b>Limitado</b>

━━━━━━━━━━━━━━━
⚠️ Limitações:

• Consultas restritas  
• Dados incompletos  
• Sem prioridade  

━━━━━━━━━━━━━━━
💎 <b>Ative o VIP agora:</b>

• Consultas ilimitadas  
• Acesso completo  
• Respostas rápidas  

👇 Clique abaixo para ver os planos";
        }

        tg("sendPhoto",[
            "chat_id"=>$chat_id,
            "photo"=>$START_PHOTO,
            "caption"=>$msgPlano,
            "parse_mode"=>"HTML",
            "reply_markup"=>json_encode([
                "inline_keyboard"=>[
                    [
                        ["text"=>"💎 Ver Planos","callback_data"=>"planos"]
                    ]
                ]
            ])
        ]);

        return;
    }
}

/* ================= MENU ================= */

function menuPrincipal($chat,$nome,$id,$edit=false,$msg=null){

    global $START_PHOTO;

    $caption =
"<b>🚀 • Astro Search</b>

Olá, <a href=\"tg://user?id={$id}\"><b>{$nome}</b></a>
🆔 <code>{$id}</code>

Escolha uma opção abaixo:";

    // Detecta grupo automaticamente
    $isGroup = str_contains((string)$chat, "-");

    // =========================
    // BOTÃO CONSULTAS
    // =========================

    if($isGroup){

        $botaoConsultas = [
            "text"=>"📂 • Consultas",
            "callback_data"=>"catalogo_1"
        ];

    }else{

        $botaoConsultas = [
            "text"=>"📂 • Consultas",
            "web_app"=>[
                "url"=>"https://astro-search.stherlionato.workers.dev/app"
            ]
        ];

    }

    $kb = [
        "inline_keyboard"=>[

            [
                $botaoConsultas,

                [
                    "text"=>"👤 • Conta",
                    "callback_data"=>"conta"
                ]
            ],

            [
                [
                    "text"=>"⭐ • Planos VIP",
                    "callback_data"=>"planos"
                ],

                [
                    "text"=>"🚀 • Site",
                    "url"=>"https://astro-search.stherlionato.workers.dev"
                ]
            ],

            [
                [
                    "text"=>"📢 • Canal Oficial",
                    "url"=>"https://t.me/astrosearch"
                ],

                [
                    "text"=>"🛠 • Suporte",
                    "url"=>"https://t.me/astrosuporte"
                ]
            ]

        ]
    ];

    if($edit){

        tg("editMessageCaption",[
            "chat_id"=>$chat,
            "message_id"=>$msg,
            "caption"=>$caption,
            "parse_mode"=>"HTML",
            "reply_markup"=>json_encode($kb)
        ]);

    }else{

        tg("sendPhoto",[
            "chat_id"=>$chat,
            "photo"=>$START_PHOTO,
            "caption"=>$caption,
            "parse_mode"=>"HTML",
            "reply_markup"=>json_encode($kb)
        ]);

    }

}

/* ================= CATÁLOGOS ================= */

function catalogo1($chat,$msg){

tg("editMessageCaption",[
"chat_id"=>$chat,
"message_id"=>$msg,
"caption"=>"🚀 <b>MENU DE CONSULTAS</b>

Escolha uma categoria:",
"parse_mode"=>"HTML",
"reply_markup"=>json_encode([
"inline_keyboard"=>[

[
["text"=>"🔱 Consultas VIP","callback_data"=>"menu_vip"],
["text"=>"♻️ Consultas Grátis","callback_data"=>"menu_free"]
],

[
["text"=>"⬅️ Menu","callback_data"=>"voltar_menu"]
]

]
])
]);

}

function menuVip($chat,$msg){

tg("editMessageCaption",[
"chat_id"=>$chat,
"message_id"=>$msg,
"caption"=>"🔱 <b>CONSULTAS VIP</b>

Escolha uma consulta:",
"parse_mode"=>"HTML",
"reply_markup"=>json_encode([
"inline_keyboard"=>[

[
["text"=>"🧾 CPF","callback_data"=>"menu_cpf"],
["text"=>"👤 Nome","callback_data"=>"menu_nome"]
],

[
["text"=>"📱 Telefone","callback_data"=>"menu_tel"],
["text"=>"🚗 Placa","callback_data"=>"menu_placa"]
],

[
["text"=>"👨‍👩‍👧 Parentes","callback_data"=>"menu_parentes"],
["text"=>"🏠 Vizinhos","callback_data"=>"menu_vizinhos"]
],

[
["text"=>"📸 Foto","callback_data"=>"menu_foto"],
["text"=>"📧 Email","callback_data"=>"menu_email"]
],

[
["text"=>"💎 Ativar VIP","callback_data"=>"planos"]
],

[
["text"=>"⬅️ Voltar","callback_data"=>"catalogo_1"]
]

]
])
]);

}

function menuFree($chat,$msg){

tg("editMessageCaption",[
"chat_id"=>$chat,
"message_id"=>$msg,
"caption"=>"♻️ <b>CONSULTAS GRÁTIS</b>

Escolha uma consulta:",
"parse_mode"=>"HTML",
"reply_markup"=>json_encode([
"inline_keyboard"=>[

[
["text"=>"🌐 IP","callback_data"=>"menu_ip"],
["text"=>"🏢 CNPJ","callback_data"=>"menu_cnpj"]
],

[
["text"=>"📍 CEP","callback_data"=>"menu_cep"]
],

[
["text"=>"⬅️ Voltar","callback_data"=>"catalogo_1"]
]

]
])
]);

}

function telaTutorial($chat,$msg,$titulo,$cmd,$exemplo){

tg("editMessageCaption",[
"chat_id"=>$chat,
"message_id"=>$msg,
"caption"=>
"📘 <b>{$titulo}</b>

🧠 <b>Como usar:</b>

<code>{$cmd} {$exemplo}</code>

━━━━━━━━━━━━━━━
💡 <b>Dica:</b>
Envie o comando exatamente assim no chat.

👇 Clique abaixo para voltar",
"parse_mode"=>"HTML",
"reply_markup"=>json_encode([
"inline_keyboard"=>[
[
["text"=>"⬅️ Voltar","callback_data"=>"catalogo_1"]
]
]
])
]);

}

if(strpos($text,"/vip") === 0){

    if($userId != $OWNER_ID){
        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ Apenas o dono pode usar."
        ]);
        exit;
    }

    if(!isGroupChat($message["chat"]["type"])){
        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ Use apenas em grupos."
        ]);
        exit;
    }

    $parts = explode(" ",$text);
    $id = $parts[1] ?? null;

    if(!$id){
        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ Use: /vip ID"
        ]);
        exit;
    }

    ativarVipGrupo($id);

    tg("sendMessage",[
        "chat_id"=>$chat,
        "text"=>"👑 <b>GRUPO VIP ATIVADO</b>

ID: <code>$id</code>

Acesso vitalício liberado.",
        "parse_mode"=>"HTML"
    ]);

    exit;
}

define("VIP_DB","vip_groups.json");

function ativarVipGrupo($chat){

    $data = [];

    if(file_exists(VIP_DB)){
        $data = json_decode(file_get_contents(VIP_DB), true);
    }

    $data[$chat] = [
        "vip" => true,
        "ativado_em" => time()
    ];

    file_put_contents(VIP_DB, json_encode($data));
}

function gerarCodigoVip(){

    $codigo = strtoupper(substr(md5(uniqid()),0,10));

    $data = [];

    if(file_exists(VIP_CODES_DB)){
        $data = json_decode(file_get_contents(VIP_CODES_DB),true);
    }

    $data[$codigo] = [
        "usado" => false
    ];

    file_put_contents(VIP_CODES_DB,json_encode($data));

    return $codigo;
}

function resgatarCodigo($codigo,$userId,$username){

    if(!file_exists(VIP_CODES_DB)){
        return "Código inválido.";
    }

    $data = json_decode(file_get_contents(VIP_CODES_DB),true);

    if(!isset($data[$codigo])){
        return "❌ Código inválido.";
    }

    if($data[$codigo]["usado"]){
        return "❌ Código já utilizado.";
    }

    $data[$codigo]["usado"] = true;
    file_put_contents(VIP_CODES_DB,json_encode($data));

    // VIP USERS
/* SALVAR USUÁRIO VIP */

$vipFile = __DIR__."/vip_users.json";

if(!file_exists($vipFile)){
    file_put_contents($vipFile,"[]");
}

$vip = json_decode(file_get_contents($vipFile),true);

if(!is_array($vip)){
    $vip = [];
}

if(!in_array($userId,$vip)){
    $vip[] = $userId;
}

file_put_contents($vipFile,json_encode($vip,JSON_PRETTY_PRINT));

    global $OWNER_ID;

    tg("sendMessage",[
        "chat_id"=>$OWNER_ID,
        "text"=>"💎 <b>NOVO VIP ATIVADO</b>

👤 Usuário: @{$username}
🆔 ID: <code>{$userId}</code>
🔑 Código: <code>{$codigo}</code>",
        "parse_mode"=>"HTML"
    ]);

    return "VIP_ATIVADO";
}

function naoEncontrado($chat,$tipo,$dado){

$data = date("d/m/Y");
$hora = date("H:i");

$txt = 
"CONSULTA REALIZADA — ASTRO SEARCH
=================================

Tipo de consulta: {$tipo}
Dado pesquisado: {$dado}
Data: {$data}
Hora: {$hora}

---------------------------------

Recadinho do astro:

Acessei alguns sistemas, e não achei movimentações dessa pessoa! 🥲

Isso pode acontecer quando:

• O registro não existe nas bases
• Dados muito recentes
• Informações limitadas
";

$file = tempnam(sys_get_temp_dir(),"astro_");
file_put_contents($file,$txt);

tg("sendDocument",[
"chat_id"=>$chat,
"document"=>new CURLFile($file,"text/plain","resultado.txt"),
"caption"=>"📄 Resultado da consulta",
"reply_markup"=>json_encode([
"inline_keyboard"=>[
[
["text"=>"🗑 Apagar","callback_data"=>"apagar_msg"]
]
]
])
]);

unlink($file);

}

function resultadoConsulta($chat,$titulo,$conteudo,$prefixo){

$hash = md5($conteudo.time());
$file = "cache_{$prefixo}_{$hash}.txt";

file_put_contents($file,$conteudo);

tg("sendMessage",[
"chat_id"=>$chat,
"text"=>"✅ <b>{$titulo} concluída</b>

Escolha o formato do resultado:",
"parse_mode"=>"HTML",
"reply_markup"=>json_encode([
"inline_keyboard"=>[
[
["text"=>"📄 Mostrar no Telegram","callback_data"=>"ver|$file"]
],
[
["text"=>"📁 Enviar TXT","callback_data"=>"txt|$file"]
],
[
["text"=>"🗑 Apagar mensagem","callback_data"=>"apagar_msg"]
],
[
["text"=>"💎 • Ativar VIP","callback_data"=>"planos"]
]
]
])
]);

}
 

function consultaCNPJ($chat, $cnpj){

    global $STICKER_LOADING, $user_id;

    function v($v){

        if ($v === null) {
            return "NÃO ENCONTRADO";
        }

        $v = trim($v);

        if ($v === "") {
            return "NÃO ENCONTRADO";
        }

        $invalidos = [
            "SEM INFORMAÇÃO",
            "SEM INFORMACAO",
            "DESCONHECIDO",
            "NULL",
            "-"
        ];

        if (in_array(mb_strtoupper($v), $invalidos)) {
            return "NÃO ENCONTRADO";
        }

        return $v;
    }

    $sticker = tg("sendSticker",[
        "chat_id"=>$chat,
        "sticker"=>$STICKER_LOADING
    ]);

    $stickerData = json_decode($sticker, true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    $cnpj = preg_replace('/\D/','',$cnpj);

    if(strlen($cnpj) !== 14){

        if($stickerMsgId){
            tg("deleteMessage",[
                "chat_id"=>$chat,
                "message_id"=>$stickerMsgId
            ]);
        }

        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ CNPJ inválido.\nUse: <code>/cnpj 00000000000100</code>",
            "parse_mode"=>"HTML"
        ]);

        return;
    }

    $url = "https://brasilapi.com.br/api/cnpj/v1/{$cnpj}";

    $ch = curl_init();

    curl_setopt_array($ch,[
        CURLOPT_URL=>$url,
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_TIMEOUT=>20
    ]);

    $response = curl_exec($ch);

    curl_close($ch);

    $json = json_decode($response, true);

    if($stickerMsgId){
        tg("deleteMessage",[
            "chat_id"=>$chat,
            "message_id"=>$stickerMsgId
        ]);
    }

    if(!$json || isset($json["message"])){

        naoEncontrado($chat, "CNPJ", $cnpj);
        return;
    }

    $resultadoFormatado = [
        [
            "secao"=>"DADOS DA EMPRESA",
            "dados"=>[
                ["campo"=>"CNPJ","valor"=>v($json["cnpj"] ?? null)],
                ["campo"=>"RAZÃO SOCIAL","valor"=>v($json["razao_social"] ?? null)],
                ["campo"=>"FANTASIA","valor"=>v($json["nome_fantasia"] ?? null)],
                ["campo"=>"SITUAÇÃO","valor"=>v($json["descricao_situacao_cadastral"] ?? null)],
                ["campo"=>"ABERTURA","valor"=>v($json["data_inicio_atividade"] ?? null)],
                ["campo"=>"ATIVIDADE","valor"=>v($json["cnae_fiscal_descricao"] ?? null)],
                ["campo"=>"TELEFONE","valor"=>v($json["ddd_telefone_1"] ?? null)],
                ["campo"=>"EMAIL","valor"=>v($json["email"] ?? null)],
                ["campo"=>"LOGRADOURO","valor"=>v($json["logradouro"] ?? null)],
                ["campo"=>"NÚMERO","valor"=>v($json["numero"] ?? null)],
                ["campo"=>"BAIRRO","valor"=>v($json["bairro"] ?? null)],
                ["campo"=>"CIDADE","valor"=>v($json["municipio"] ?? null)],
                ["campo"=>"UF","valor"=>v($json["uf"] ?? null)],
                ["campo"=>"CEP","valor"=>v($json["cep"] ?? null)]
            ]
        ]
    ];

    $token = bin2hex(random_bytes(16));

    $payload = json_encode([
        "token"=>$token,
        "tipo"=>"cnpj",
        "query"=>$cnpj,
        "plano"=>"free",
        "resultado"=>[
            [
                "consulta"=>"CNPJ",
                "documento"=>$cnpj,
                "resultado"=>$resultadoFormatado
            ]
        ]
    ]);

    $api = "https://astro-search.stherlionato.workers.dev";

    $ch = curl_init($api."/api/save");

    curl_setopt_array($ch,[
        CURLOPT_POST=>true,
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_HTTPHEADER=>["Content-Type: application/json"],
        CURLOPT_POSTFIELDS=>$payload
    ]);

    curl_exec($ch);

    curl_close($ch);

    $link = $api."/r/".$token;

    $msg = "
<b>📊 REQUISIÇÃO REALIZADA COM SUCESSO</b>

<blockquote>🔎 <b>Base:</b> CNPJ • GRATUITO</blockquote>

🏢 <b>CNPJ:</b> {$cnpj}

Clique no botão abaixo ou <a href='{$link}'>AQUI</a> para acessar o resultado.

⏳ <i>Disponível por tempo limitado</i>

━━━━━━━━━━━━━━━

🤖 <b>Bot:</b> @consultasdedados_bot
📢 <b>Canal:</b> @astrosearch
";

    tg("sendMessage",[
        "chat_id"=>$chat,
        "text"=>$msg,
        "parse_mode"=>"HTML",
        "reply_markup"=>json_encode([
            "inline_keyboard"=>[
                [
                    ["text"=>"🔍 Ver Resultado","url"=>$link]
                ],
                [
                    ["text"=>"💎 • Ativar VIP","callback_data"=>"planos"]
                ],
                [
                    ["text"=>"🗑 Apagar","callback_data"=>"del_{$user_id}"]
                ]
            ]
        ])
    ]);
}

function consultaIP($chat, $ip){

    global $STICKER_LOADING, $user_id;

    function v($v){

        if ($v === null) {
            return "NÃO ENCONTRADO";
        }

        $v = trim((string)$v);

        if ($v === "") {
            return "NÃO ENCONTRADO";
        }

        $invalidos = [
            "SEM INFORMAÇÃO",
            "SEM INFORMACAO",
            "DESCONHECIDO",
            "NULL",
            "-"
        ];

        if (in_array(mb_strtoupper($v), $invalidos)) {
            return "NÃO ENCONTRADO";
        }

        return $v;
    }

    // =========================
    // 🔄 LOADING
    // =========================
    $sticker = tg("sendSticker",[
        "chat_id"=>$chat,
        "sticker"=>$STICKER_LOADING
    ]);

    $stickerData = json_decode($sticker, true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    // =========================
    // 📄 VALIDAÇÃO
    // =========================
    if(!filter_var($ip, FILTER_VALIDATE_IP)){

        if($stickerMsgId){
            tg("deleteMessage",[
                "chat_id"=>$chat,
                "message_id"=>$stickerMsgId
            ]);
        }

        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ IP inválido.\nUse: <code>/ip 8.8.8.8</code>",
            "parse_mode"=>"HTML"
        ]);

        return;
    }

    // =========================
    // 🔥 API
    // =========================
    $url = "http://ip-api.com/json/{$ip}?lang=pt-BR";

    $ch = curl_init();

    curl_setopt_array($ch,[
        CURLOPT_URL=>$url,
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_TIMEOUT=>20
    ]);

    $response = curl_exec($ch);

    curl_close($ch);

    $json = json_decode($response, true);

    // =========================
    // ❌ REMOVE LOADING
    // =========================
    if($stickerMsgId){
        tg("deleteMessage",[
            "chat_id"=>$chat,
            "message_id"=>$stickerMsgId
        ]);
    }

    // =========================
    // ❌ SEM RESULTADO
    // =========================
    if(
        !$json ||
        ($json["status"] ?? "") !== "success"
    ){

        naoEncontrado($chat, "IP", $ip);
        return;
    }

    // =========================
    // 🧠 FORMATAR RESULTADO
    // =========================
    $resultadoFormatado = [
        [
            "secao"=>"DADOS DO IP",
            "dados"=>[
                ["campo"=>"IP","valor"=>v($json["query"] ?? null)],
                ["campo"=>"PAÍS","valor"=>v($json["country"] ?? null)],
                ["campo"=>"REGIÃO","valor"=>v($json["regionName"] ?? null)],
                ["campo"=>"CIDADE","valor"=>v($json["city"] ?? null)],
                ["campo"=>"CEP","valor"=>v($json["zip"] ?? null)],
                ["campo"=>"LATITUDE","valor"=>v($json["lat"] ?? null)],
                ["campo"=>"LONGITUDE","valor"=>v($json["lon"] ?? null)],
                ["campo"=>"FUSO","valor"=>v($json["timezone"] ?? null)],
                ["campo"=>"ISP","valor"=>v($json["isp"] ?? null)],
                ["campo"=>"ORG","valor"=>v($json["org"] ?? null)]
            ]
        ]
    ];

    // =========================
    // 🔐 TOKEN
    // =========================
    $token = bin2hex(random_bytes(16));

    // =========================
    // ☁️ SALVAR
    // =========================
    $payload = json_encode([
        "token"=>$token,
        "tipo"=>"ip",
        "query"=>$ip,
        "plano"=>"free",
        "resultado"=>[
            [
                "consulta"=>"IP",
                "documento"=>$ip,
                "resultado"=>$resultadoFormatado
            ]
        ]
    ]);

    $api = "https://astro-search.stherlionato.workers.dev";

    $ch = curl_init($api."/api/save");

    curl_setopt_array($ch,[
        CURLOPT_POST=>true,
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_HTTPHEADER=>[
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS=>$payload
    ]);

    curl_exec($ch);

    curl_close($ch);

    // =========================
    // 🔗 LINK
    // =========================
    $link = $api."/r/".$token;

    // =========================
    // 💎 PREVIEW
    // =========================
    $msg = "
<b>📊 REQUISIÇÃO REALIZADA COM SUCESSO</b>

<blockquote>🔎 <b>Base:</b> IP • GRATUITO</blockquote>

🌐 <b>IP:</b> {$ip}

Clique no botão abaixo ou <a href='{$link}'>AQUI</a> para acessar o resultado.

⏳ <i>Disponível por tempo limitado</i>

━━━━━━━━━━━━━━━

🤖 <b>Bot:</b> @consultasdedados_bot
📢 <b>Canal:</b> @astrosearch
";

    tg("sendMessage",[
        "chat_id"=>$chat,
        "text"=>$msg,
        "parse_mode"=>"HTML",
        "reply_markup"=>json_encode([
            "inline_keyboard"=>[
                [
                    ["text"=>"🔍 Ver Resultado","url"=>$link]
                ],
                [
                    ["text"=>"💎 • Ativar VIP","callback_data"=>"planos"]
                ],
                [
                    ["text"=>"🗑 Apagar","callback_data"=>"del_{$user_id}"]
                ]
            ]
        ])
    ]);
}

function consultaCEP($chat, $cep){

    global $STICKER_LOADING, $user_id;

    function v($v){

        if ($v === null) {
            return "NÃO ENCONTRADO";
        }

        $v = trim((string)$v);

        if ($v === "") {
            return "NÃO ENCONTRADO";
        }

        $invalidos = [
            "SEM INFORMAÇÃO",
            "SEM INFORMACAO",
            "DESCONHECIDO",
            "NULL",
            "-"
        ];

        if (in_array(mb_strtoupper($v), $invalidos)) {
            return "NÃO ENCONTRADO";
        }

        return $v;
    }

    // =========================
    // 🔄 LOADING
    // =========================
    $sticker = tg("sendSticker",[
        "chat_id"=>$chat,
        "sticker"=>$STICKER_LOADING
    ]);

    $stickerData = json_decode($sticker, true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    // =========================
    // 📄 VALIDAÇÃO
    // =========================
    $cep = preg_replace('/\D/','',$cep);

    if(strlen($cep) !== 8){

        if($stickerMsgId){
            tg("deleteMessage",[
                "chat_id"=>$chat,
                "message_id"=>$stickerMsgId
            ]);
        }

        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ CEP inválido.\nUse: <code>/cep 01001000</code>",
            "parse_mode"=>"HTML"
        ]);

        return;
    }

    // =========================
    // 🔥 API
    // =========================
    $url = "https://viacep.com.br/ws/{$cep}/json/";

    $ch = curl_init();

    curl_setopt_array($ch,[
        CURLOPT_URL=>$url,
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_TIMEOUT=>20
    ]);

    $response = curl_exec($ch);

    curl_close($ch);

    $json = json_decode($response, true);

    // =========================
    // ❌ REMOVE LOADING
    // =========================
    if($stickerMsgId){
        tg("deleteMessage",[
            "chat_id"=>$chat,
            "message_id"=>$stickerMsgId
        ]);
    }

    // =========================
    // ❌ SEM RESULTADO
    // =========================
    if(
        !$json ||
        isset($json["erro"])
    ){

        naoEncontrado($chat, "CEP", $cep);
        return;
    }

    // =========================
    // 🧠 FORMATAR RESULTADO
    // =========================
    $resultadoFormatado = [
        [
            "secao"=>"DADOS DO CEP",
            "dados"=>[
                ["campo"=>"CEP","valor"=>v($json["cep"] ?? null)],
                ["campo"=>"LOGRADOURO","valor"=>v($json["logradouro"] ?? null)],
                ["campo"=>"BAIRRO","valor"=>v($json["bairro"] ?? null)],
                ["campo"=>"CIDADE","valor"=>v($json["localidade"] ?? null)],
                ["campo"=>"UF","valor"=>v($json["uf"] ?? null)],
                ["campo"=>"DDD","valor"=>v($json["ddd"] ?? null)],
                ["campo"=>"IBGE","valor"=>v($json["ibge"] ?? null)]
            ]
        ]
    ];

    // =========================
    // 🔐 TOKEN
    // =========================
    $token = bin2hex(random_bytes(16));

    // =========================
    // ☁️ SALVAR
    // =========================
    $payload = json_encode([
        "token"=>$token,
        "tipo"=>"cep",
        "query"=>$cep,
        "plano"=>"free",
        "resultado"=>[
            [
                "consulta"=>"CEP",
                "documento"=>$cep,
                "resultado"=>$resultadoFormatado
            ]
        ]
    ]);

    $api = "https://astro-search.stherlionato.workers.dev";

    $ch = curl_init($api."/api/save");

    curl_setopt_array($ch,[
        CURLOPT_POST=>true,
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_HTTPHEADER=>[
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS=>$payload
    ]);

    curl_exec($ch);

    curl_close($ch);

    // =========================
    // 🔗 LINK
    // =========================
    $link = $api."/r/".$token;

    // =========================
    // 💎 PREVIEW
    // =========================
    $msg = "
<b>📊 REQUISIÇÃO REALIZADA COM SUCESSO</b>

<blockquote>🔎 <b>Base:</b> CEP • GRATUITO</blockquote>

📍 <b>CEP:</b> {$cep}

Clique no botão abaixo ou <a href='{$link}'>AQUI</a> para acessar o resultado.

⏳ <i>Disponível por tempo limitado</i>

━━━━━━━━━━━━━━━

🤖 <b>Bot:</b> @consultasdedados_bot
📢 <b>Canal:</b> @astrosearch
";

    tg("sendMessage",[
        "chat_id"=>$chat,
        "text"=>$msg,
        "parse_mode"=>"HTML",
        "reply_markup"=>json_encode([
            "inline_keyboard"=>[
                [
                    ["text"=>"🔍 Ver Resultado","url"=>$link]
                ],
                [
                    ["text"=>"💎 • Ativar VIP","callback_data"=>"planos"]
                ],
                [
                    ["text"=>"🗑 Apagar","callback_data"=>"del_{$user_id}"]
                ]
            ]
        ])
    ]);
}

function consultaEmail($chat, $email){
    global $STICKER_LOADING;

    // 🎬 Sticker carregando
    $sticker = tg("sendSticker",[
        "chat_id"=>$chat,
        "sticker"=>$STICKER_LOADING
    ]);

    $stickerData = json_decode($sticker, true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    // valida email
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){

    if($stickerMsgId){
        tg("deleteMessage",[
            "chat_id"=>$chat,
            "message_id"=>$stickerMsgId
        ]);
    }

    tg("sendMessage",[
        "chat_id"=>$chat,
        "text"=>"❌ Email inválido.\nUse: <code>/email teste@email.com</code>",
        "parse_mode"=>"HTML"
    ]);

    return;
}

    // 🔎 API
    $url = "https://sara-api.xyz/api/consultas/email?email={$email}&apikey=bigmouth";
    $resp = @file_get_contents($url);
    $json = json_decode($resp, true);

    // remove sticker
    if($stickerMsgId){
        tg("deleteMessage",[
            "chat_id"=>$chat,
            "message_id"=>$stickerMsgId
        ]);
    }

    if(!$json || !$json["success"]){
    naoEncontrado($chat,"EMAIL",$email);
    return;
}

    $txt =
"CONSULTA DE EMAIL — ASTRO SEARCH
=================================

EMAIL CONSULTADO: {$email}

---------------------------------

";

    foreach($json["data"] as $d){

        $txt .=
"Nome: {$d["nome"]}
CPF: {$d["cpf"]}
Telefone: {$d["telefone"]}
Endereço: {$d["logradouro"]} {$d["numero"]}
Bairro: {$d["bairro"]}
Cidade: {$d["cidade"]}

---------------------------------
";
    }

    $file = tempnam(sys_get_temp_dir(),"email_");
    file_put_contents($file,$txt);

    tg("sendDocument",[
        "chat_id"=>$chat,
        "document"=>new CURLFile($file,"text/plain","email_resultado.txt"),
        "caption"=>"📧 <b>Consulta de email concluída</b>\n\nCréditos: <b>Astro Search</b>",
        "parse_mode"=>"HTML",
        "reply_markup"=>json_encode([
            "inline_keyboard"=>[
                [["text"=>"🗑 Apagar","callback_data"=>"apagar_msg"]]
            ]
        ])
    ]);

    unlink($file);
}

function consultaVizinhos($chat, $cpf){
    global $STICKER_LOADING;

    // 🎬 Sticker loading
    $sticker = tg("sendSticker",[
        "chat_id"=>$chat,
        "sticker"=>$STICKER_LOADING
    ]);

    $stickerData = json_decode($sticker, true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    // limpa cpf
    $cpf = preg_replace('/\D/','',$cpf);

    if(strlen($cpf) != 11){
        if($stickerMsgId){
            tg("deleteMessage",[
                "chat_id"=>$chat,
                "message_id"=>$stickerMsgId
            ]);
        }

        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ CPF inválido.\nUse: <code>/vizinhos 00000000000</code>",
            "parse_mode"=>"HTML"
        ]);
        return;
    }

    // 🔥 NOVA API CPF
    $url = "https://obitostore.shop/api/consulta/cpf4?cpf={$cpf}&apikey=Teste";
    $resp = @file_get_contents($url);
    $json = json_decode($resp, true);

    // remove sticker
    if($stickerMsgId){
        tg("deleteMessage",[
            "chat_id"=>$chat,
            "message_id"=>$stickerMsgId
        ]);
    }

    if(!$json || $json["status"] != "ok"){
        naoEncontrado($chat,"VIZINHOS",$cpf);
        return;
    }

    $resultado = $json["resultado"];

    // 🔥 EXTRAIR BLOCO DE VIZINHOS
    preg_match('/VIZINHOS(.*?)COMPRAS IDENTIFICADAS/s', $resultado, $match);

    if(!isset($match[1])){
        naoEncontrado($chat,"VIZINHOS",$cpf);
        return;
    }

    $vizinhosRaw = trim($match[1]);

    // 🔥 PEGAR DADOS DOS VIZINHOS
    preg_match_all('/NOME:\s*(.*?)\nCPF:\s*(.*?)\nDATA NASCIMENTO:\s*(.*?)\nIDADE:\s*(.*?)\nSEXO:\s*(.*?)\nNOME MÃE:\s*(.*?)\n/', $vizinhosRaw, $matches, PREG_SET_ORDER);

    if(!$matches){
        naoEncontrado($chat,"VIZINHOS",$cpf);
        return;
    }

    // 🔥 PEGAR NOME DO TITULAR
    preg_match('/NOME:\s*(.*?)\n/', $resultado, $titularMatch);
    $titular = $titularMatch[1] ?? "Não encontrado";

    $txt =
"CONSULTA DE VIZINHOS — ASTRO SEARCH
================================

CPF Consultado: {$cpf}
Titular: {$titular}
Total de vizinhos: ".count($matches)."

================================
";

    foreach($matches as $v){

        $nome = trim($v[1]);
        $cpfViz = trim($v[2]);
        $nasc = trim($v[3]);
        $idade = trim($v[4]);
        $sexo = trim($v[5]);
        $mae = trim($v[6]);

        $txt .= "
Nome: {$nome}
CPF: {$cpfViz}
Nascimento: {$nasc}
Idade: {$idade}
Sexo: {$sexo}
Mãe: {$mae}

--------------------------------
";
    }

    $txt .= "
Consulta via:
Astro Search (Nova API)
";

    $file = tempnam(sys_get_temp_dir(), "vizinhos_");
    file_put_contents($file, $txt);

    tg("sendDocument",[
        "chat_id"=>$chat,
        "document"=>new CURLFile($file, "text/plain", "vizinhos_{$cpf}.txt"),
        "caption"=>"🏘 <b>Consulta de Vizinhos concluída</b>\n\nCréditos: <b>Astro Search</b>",
        "parse_mode"=>"HTML",
        "reply_markup"=>json_encode([
            "inline_keyboard"=>[
                [
                    ["text"=>"🗑 Apagar","callback_data"=>"apagar_msg"],
                    ["text"=>"💎 • Ativar VIP","callback_data"=>"planos"]
                ]
            ]
        ])
    ]);

    unlink($file);
}

function consultaFotoRJ($chat, $cpf){
    global $STICKER_LOADING;

    $sticker = tg("sendSticker",[
        "chat_id"=>$chat,
        "sticker"=>$STICKER_LOADING
    ]);

    $stickerData = json_decode($sticker,true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    $cpf = preg_replace('/\D/','',$cpf);

    if(strlen($cpf) != 11){

        if($stickerMsgId){
            tg("deleteMessage",[
                "chat_id"=>$chat,
                "message_id"=>$stickerMsgId
            ]);
        }

        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ CPF inválido.\nUse: <code>/fotorj 00000000000</code>",
            "parse_mode"=>"HTML"
        ]);

        return;
    }

    $url = "https://orbyta.online/api/fotorj?cpf={$cpf}&token=FNiPeeltHc5pwy7HWnPCiIs7zIRr7SDB";
    $resp = @file_get_contents($url);
    $json = json_decode($resp,true);

    if($stickerMsgId){
        tg("deleteMessage",[
            "chat_id"=>$chat,
            "message_id"=>$stickerMsgId
        ]);
    }

    if(!$json || !$json["status"]){

        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ Foto RJ não encontrada."
        ]);

        return;
    }

    $fotoBase64 = $json["data"]["foto"];
    $imagem = base64_decode($fotoBase64);

    $file = tempnam(sys_get_temp_dir(),"fotorj_");
    file_put_contents($file,$imagem);

    tg("sendPhoto",[
        "chat_id"=>$chat,
        "photo"=>new CURLFile($file,"image/jpeg","fotorj_{$cpf}.jpg"),
        "caption"=>"📸 <b>FOTO RJ LOCALIZADA</b>

👤 Nome: {$json["data"]["nome"]}
🆔 CPF: <code>{$json["data"]["cpf"]}</code>
📅 Nascimento: {$json["data"]["nascimento"]}
🪪 RG: {$json["data"]["rg"]}

Créditos: <b>Astro Search</b>",
        "parse_mode"=>"HTML",
        "reply_markup"=>json_encode([
            "inline_keyboard"=>[
                [
                    ["text"=>"🗑 Apagar","callback_data"=>"apagar_msg"]
                ]
            ]
        ])
    ]);

    unlink($file);
}

function consultaFotoSP($chat, $cpf){
    global $STICKER_LOADING;

    $sticker = tg("sendSticker",[
        "chat_id"=>$chat,
        "sticker"=>$STICKER_LOADING
    ]);

    $stickerData = json_decode($sticker,true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    $cpf = preg_replace('/\D/','',$cpf);

    if(strlen($cpf) != 11){

        if($stickerMsgId){
            tg("deleteMessage",[
                "chat_id"=>$chat,
                "message_id"=>$stickerMsgId
            ]);
        }

        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ CPF inválido.\nUse: <code>/fotosp 00000000000</code>",
            "parse_mode"=>"HTML"
        ]);

        return;
    }

    $url = "https://sara-api.xyz/api/consultas/fotosp?cpf={$cpf}&apikey=bigmouth";
    $resp = @file_get_contents($url);
    $json = json_decode($resp,true);

    if($stickerMsgId){
        tg("deleteMessage",[
            "chat_id"=>$chat,
            "message_id"=>$stickerMsgId
        ]);
    }

    if(!$json || !$json["success"] || empty($json["foto"])){

        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ Foto SP não encontrada."
        ]);

        return;
    }

    $imagem = base64_decode($json["foto"]);

    $file = tempnam(sys_get_temp_dir(),"fotosp_");
    file_put_contents($file,$imagem);

    tg("sendPhoto",[
        "chat_id"=>$chat,
        "photo"=>new CURLFile($file,"image/jpeg","fotosp_{$cpf}.jpg"),
        "caption"=>"📸 <b>FOTO SP LOCALIZADA</b>

🆔 CPF: <code>{$json["cpf"]}</code>
📍 Estado: {$json["estado"]}

Créditos: <b>Astro Search</b>",
        "parse_mode"=>"HTML",
        "reply_markup"=>json_encode([
            "inline_keyboard"=>[
                [
                    ["text"=>"🗑 Apagar","callback_data"=>"apagar_msg"]
                ]
            ]
        ])
    ]);

    unlink($file);
}

function consultaFoto($chat, $cpf){
    global $STICKER_LOADING;

    // 🎬 Sticker loading
    $sticker = tg("sendSticker",[
        "chat_id"=>$chat,
        "sticker"=>$STICKER_LOADING
    ]);

    $stickerData = json_decode($sticker, true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    // limpa cpf
    $cpf = preg_replace('/\D/','',$cpf);

    if(strlen($cpf) != 11){
        if($stickerMsgId){
            tg("deleteMessage",[
                "chat_id"=>$chat,
                "message_id"=>$stickerMsgId
            ]);
        }

        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ CPF inválido.\nUse: <code>/foto 00000000000</code>",
            "parse_mode"=>"HTML"
        ]);
        return;
    }

    // 🔥 API FOTO
    $url = "https://sara-api.xyz/api/consultas/fotov2?cpf={$cpf}&apikey=bigmouth";
    $resp = @file_get_contents($url);
    $json = json_decode($resp, true);

    // remove sticker
    if($stickerMsgId){
        tg("deleteMessage",[
            "chat_id"=>$chat,
            "message_id"=>$stickerMsgId
        ]);
    }

    if(!$json || !$json["success"] || empty($json["foto"])){
        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ Foto não encontrada."
        ]);
        return;
    }

    // 🔥 REMOVE prefixo base64
    $base64 = explode(",", $json["foto"])[1];
    $imagem = base64_decode($base64);

    $file = tempnam(sys_get_temp_dir(), "foto_");
    file_put_contents($file, $imagem);

    tg("sendPhoto",[
        "chat_id"=>$chat,
        "photo"=>new CURLFile($file, "image/jpeg", "foto_{$cpf}.jpg"),
        "caption"=>"📸 <b>FOTO LOCALIZADA</b>\n\nCPF: <code>{$cpf}</code>\nEstado: {$json["estado"]}\n\nCréditos: <b>Astro Search</b>",
        "parse_mode"=>"HTML",
        "reply_markup"=>json_encode([
            "inline_keyboard"=>[
                [
                    ["text"=>"🗑 Apagar","callback_data"=>"apagar_msg"]
                ]
            ]
        ])
    ]);

    unlink($file);
}

function consultaTelefone($chat, $telefone) {

    global $STICKER_LOADING, $user_id;

    function v($v) {

        if ($v === null) {
            return "NÃO ENCONTRADO";
        }

        $v = trim($v);

        if ($v === "") {
            return "NÃO ENCONTRADO";
        }

        $invalidos = [
            "SEM INFORMAÇÃO",
            "SEM INFORMACAO",
            "DESCONHECIDO",
            "NULL",
            "-"
        ];

        if (in_array(mb_strtoupper($v), $invalidos)) {
            return "NÃO ENCONTRADO";
        }

        return $v;
    }

    // =========================
    // 🔄 LOADING
    // =========================
    $sticker = tg("sendSticker", [
        "chat_id"=>$chat,
        "sticker"=>$STICKER_LOADING
    ]);

    $stickerData = json_decode($sticker, true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    // =========================
    // 📱 VALIDAÇÃO
    // =========================
    $telefone = preg_replace('/\D/', '', $telefone);

    if (strlen($telefone) < 10) {

        if ($stickerMsgId) {
            tg("deleteMessage", [
                "chat_id"=>$chat,
                "message_id"=>$stickerMsgId
            ]);
        }

        tg("sendMessage", [
            "chat_id"=>$chat,
            "text"=>"❌ Telefone inválido.\nUse: <code>/tel 31999999999</code>",
            "parse_mode"=>"HTML"
        ]);

        return;
    }

    // =========================
    // 🔥 API
    // =========================
    $url = "https://boks.stherlionato.workers.dev/telefone?token=fxckbuscas&telefone={$telefone}";

    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL=>$url,
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_TIMEOUT=>25
    ]);

    $response = curl_exec($ch);

    curl_close($ch);

    $json = json_decode($response, true);

    // =========================
    // ❌ REMOVE LOADING
    // =========================
    if ($stickerMsgId) {
        tg("deleteMessage", [
            "chat_id"=>$chat,
            "message_id"=>$stickerMsgId
        ]);
    }

    // =========================
    // ❌ SEM RESULTADO
    // =========================
    if (
        !$json ||
        empty($json["dados"]["resultado"])
    ) {

        naoEncontrado($chat, "TELEFONE", $telefone);
        return;
    }

    // =========================
    // 🧠 FORMATAR RESULTADO
    // =========================
    $resultadoFormatado = [];

    foreach ($json["dados"]["resultado"] as $item) {

        $titulo = trim($item["titulo"] ?? "");
        $conteudo = trim($item["conteudo"] ?? "");

        if (!$titulo && !$conteudo) {
            continue;
        }

        $secao = [
            "secao" => $titulo,
            "dados" => []
        ];

        $conteudo = str_replace(["\r\n", "\r"], "\n", $conteudo);

        foreach (explode("\n", $conteudo) as $linha) {

            $linha = trim($linha);

            if (!$linha) continue;

            if (strpos($linha, ":") !== false) {

                [$k, $v2] = explode(":", $linha, 2);

                $secao["dados"][] = [
                    "campo" => trim($k),
                    "valor" => v(trim($v2))
                ];

            } else {

                $secao["dados"][] = [
                    "campo" => "INFO",
                    "valor" => $linha
                ];
            }
        }

        $resultadoFormatado[] = $secao;
    }

    // =========================
    // 🔐 TOKEN
    // =========================
    $token = bin2hex(random_bytes(16));

    // =========================
    // ☁️ SALVAR
    // =========================
    $payload = json_encode([
        "token" => $token,
        "tipo" => "telefone",
        "query" => $telefone,
        "plano" => "vip",
        "resultado" => [
            [
                "consulta" => "TELEFONE",
                "documento" => $telefone,
                "resultado" => $resultadoFormatado
            ]
        ]
    ]);

    $api = "https://astro-search.stherlionato.workers.dev";

    $ch = curl_init($api . "/api/save");

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS => $payload
    ]);

    curl_exec($ch);

    curl_close($ch);

    // =========================
    // 🔗 LINK
    // =========================
    $link = $api . "/r/" . $token;

    // =========================
    // 💎 PREVIEW
    // =========================
    $msg = "
<b>📊 REQUISIÇÃO REALIZADA COM SUCESSO</b>

<blockquote>🔎 <b>Base:</b> TELEFONE • ULTRA COMPLETO</blockquote>

📱 <b>Telefone:</b> {$telefone}

Clique no botão abaixo ou <a href='{$link}'>AQUI</a> para acessar o resultado completo.

⏳ <i>Disponível por tempo limitado</i>

━━━━━━━━━━━━━━━

🤖 <b>Bot:</b> @consultasdedados_bot
📢 <b>Canal:</b> @astrosearch

<blockquote>
<b>Astro Ultra</b>
Sistema premium com dados avançados (nomes, documentos, endereços, parentes e muito mais).
</blockquote>
";

    // =========================
    // 📲 ENVIO FINAL
    // =========================
    tg("sendMessage", [
        "chat_id" => $chat,
        "text" => $msg,
        "parse_mode" => "HTML",
        "reply_markup" => json_encode([
            "inline_keyboard"=>[
                [
                    ["text"=>"🔍 Ver Resultado","url"=>$link]
                ],
                [
                    ["text"=>"💎 • Ativar VIP","callback_data"=>"planos"]
                ],
                [
                    ["text"=>"🗑 Apagar","callback_data"=>"del_{$user_id}"]
                ]
            ]
        ])
    ]);
}

function consultaNome($chat, $nome) {

    global $STICKER_LOADING, $user_id;

    function v($v) {

        if ($v === null) {
            return "NÃO ENCONTRADO";
        }

        $v = trim($v);

        if ($v === "") {
            return "NÃO ENCONTRADO";
        }

        $invalidos = [
            "SEM INFORMAÇÃO",
            "SEM INFORMACAO",
            "DESCONHECIDO",
            "NULL",
            "-"
        ];

        if (in_array(mb_strtoupper($v), $invalidos)) {
            return "NÃO ENCONTRADO";
        }

        return $v;
    }

    // =========================
    // 🔄 LOADING
    // =========================
    $sticker = tg("sendSticker", [
        "chat_id"=>$chat,
        "sticker"=>$STICKER_LOADING
    ]);

    $stickerData = json_decode($sticker, true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    // =========================
    // 📄 VALIDAÇÃO
    // =========================
    if (strlen($nome) < 5) {

        if ($stickerMsgId) {
            tg("deleteMessage", [
                "chat_id"=>$chat,
                "message_id"=>$stickerMsgId
            ]);
        }

        tg("sendMessage", [
            "chat_id"=>$chat,
            "text"=>"❌ Nome inválido.\nUse: <code>/nome João Silva</code>",
            "parse_mode"=>"HTML"
        ]);

        return;
    }

    // =========================
    // 🔥 API
    // =========================
    $nomeUrl = urlencode($nome);

    $url = "https://boks.stherlionato.workers.dev/nome?token=fxckbuscas&nome={$nomeUrl}";

    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL=>$url,
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_TIMEOUT=>25
    ]);

    $response = curl_exec($ch);

    curl_close($ch);

    $json = json_decode($response, true);

    // =========================
    // ❌ REMOVE LOADING
    // =========================
    if ($stickerMsgId) {
        tg("deleteMessage", [
            "chat_id"=>$chat,
            "message_id"=>$stickerMsgId
        ]);
    }

    // =========================
    // ❌ SEM RESULTADO
    // =========================
    if (
        !$json ||
        empty($json["dados"]["resultado"])
    ) {

        naoEncontrado($chat, "NOME", $nome);
        return;
    }

    // =========================
    // 🧠 FORMATAR RESULTADO
    // =========================
    $resultadoFormatado = [];

    foreach ($json["dados"]["resultado"] as $item) {

        $titulo = trim($item["titulo"] ?? "");
        $conteudo = trim($item["conteudo"] ?? "");

        if (!$titulo && !$conteudo) {
            continue;
        }

        $secao = [
            "secao" => $titulo,
            "dados" => []
        ];

        $conteudo = str_replace(["\r\n", "\r"], "\n", $conteudo);

        foreach (explode("\n", $conteudo) as $linha) {

            $linha = trim($linha);

            if (!$linha) continue;

            if (strpos($linha, ":") !== false) {

                [$k, $v2] = explode(":", $linha, 2);

                $secao["dados"][] = [
                    "campo" => trim($k),
                    "valor" => v(trim($v2))
                ];

            } else {

                $secao["dados"][] = [
                    "campo" => "INFO",
                    "valor" => $linha
                ];
            }
        }

        $resultadoFormatado[] = $secao;
    }

    // =========================
    // 🔐 TOKEN
    // =========================
    $token = bin2hex(random_bytes(16));

    // =========================
    // ☁️ SALVAR
    // =========================
    $payload = json_encode([
        "token" => $token,
        "tipo" => "nome",
        "query" => $nome,
        "plano" => "vip",
        "resultado" => [
            [
                "consulta" => "NOME",
                "documento" => $nome,
                "resultado" => $resultadoFormatado
            ]
        ]
    ]);

    $api = "https://astro-search.stherlionato.workers.dev";

    $ch = curl_init($api . "/api/save");

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS => $payload
    ]);

    curl_exec($ch);

    curl_close($ch);

    // =========================
    // 🔗 LINK
    // =========================
    $link = $api . "/r/" . $token;

    // =========================
    // 💎 PREVIEW
    // =========================
    $msg = "
<b>📊 REQUISIÇÃO REALIZADA COM SUCESSO</b>

<blockquote>🔎 <b>Base:</b> NOME • ULTRA COMPLETO</blockquote>

👤 <b>Nome:</b> {$nome}

Clique no botão abaixo ou <a href='{$link}'>AQUI</a> para acessar o resultado completo.

⏳ <i>Disponível por tempo limitado</i>

━━━━━━━━━━━━━━━

🤖 <b>Bot:</b> @consultasdedados_bot
📢 <b>Canal:</b> @astrosearch

<blockquote>
<b>Astro Ultra</b>
Sistema premium com dados avançados (endereços, telefones, parentes e muito mais).
</blockquote>
";

    // =========================
    // 📲 ENVIO FINAL
    // =========================
    tg("sendMessage", [
        "chat_id" => $chat,
        "text" => $msg,
        "parse_mode" => "HTML",
        "reply_markup" => json_encode([
            "inline_keyboard"=>[
                [
                    ["text"=>"🔍 Ver Resultado","url"=>$link]
                ],
                [
                    ["text"=>"💎 • Ativar VIP","callback_data"=>"planos"]
                ],
                [
                    ["text"=>"🗑 Apagar","callback_data"=>"del_{$user_id}"]
                ]
            ]
        ])
    ]);
}

function consultaCpf4($chat,$cpf){

global $STICKER_LOADING;

function v($v){
return ($v === null || $v === "" || $v === "NULL" || strpos($v,"SEM INFORMA") !== false) ? "NÃO ENCONTRADO" : $v;
}

$sticker = tg("sendSticker",[
"chat_id"=>$chat,
"sticker"=>$STICKER_LOADING
]);

$stickerData = json_decode($sticker,true);
$stickerMsgId = $stickerData["result"]["message_id"] ?? null;

$cpf = preg_replace('/\D/','',$cpf);

if(strlen($cpf) != 11){

if($stickerMsgId){
tg("deleteMessage",[
"chat_id"=>$chat,
"message_id"=>$stickerMsgId
]);
}

tg("sendMessage",[
"chat_id"=>$chat,
"text"=>"❌ CPF inválido.\nUse: <code>/cpf4 00000000000</code>",
"parse_mode"=>"HTML"
]);

return;
}

// 🌐 API NOVA
$url = "https://boks.stherlionato.workers.dev/cpf?cpf={$cpf}&token=VIP_123";

$ch = curl_init();
curl_setopt_array($ch,[
CURLOPT_URL => $url,
CURLOPT_RETURNTRANSFER => true,
CURLOPT_TIMEOUT => 30
]);

$response = curl_exec($ch);
$data = json_decode($response,true);
curl_close($ch);

if($stickerMsgId){
tg("deleteMessage",[
"chat_id"=>$chat,
"message_id"=>$stickerMsgId
]);
}

// 🚨 VALIDAÇÃO CORRETA (igual cpf3)
if(empty($data["result"]["informaes_bsicas"][0])){

tg("sendMessage",[
"chat_id"=>$chat,
"text"=>"❌ CPF não encontrado."
]);

return;
}

$r = $data["result"];
$b = $r["informaes_bsicas"][0];

$txt = "
╔══════════════════════════════╗
   CONSULTA CPF ULTRA — ASTRO SEARCH
╚══════════════════════════════╝

🧠 DADOS PRINCIPAIS
──────────────────────────────
Nome: ".v($b["nome"])."
CPF: ".v($b["cpf"])."
Nascimento: ".v($b["data_de_nascimento"])."
Sexo: ".v($b["sexo"])."
Mãe: ".v($b["nome_da_me"])."
Pai: ".v($b["nome_do_pai"])."
Situação: ".v($b["situao_cadastral"])."
";

$txt .= "

💰 DADOS ECONÔMICOS
──────────────────────────────
";

foreach(($r["dados_econmicos"] ?? []) as $eco){
$txt .= "
Renda: ".v($eco["renda"])."
Score: ".v($eco["score_csb"])."
Risco: ".v($eco["faixa_de_risco_csb"])."
";
}

$txt .= "

📞 TELEFONES
──────────────────────────────
";

foreach(($r["telefones"] ?? []) as $t){
$txt .= $t["nmero"]." | ".v($t["tipo"])."\n";
}

$txt .= "

📧 EMAILS
──────────────────────────────
";

foreach(($r["emails"] ?? []) as $e){
$txt .= v($e["email"])."\n";
}

$txt .= "

📍 ENDEREÇOS
──────────────────────────────
";

foreach(($r["endereos"] ?? []) as $e){
$txt .= "
".v($e["logradouro"]).", ".v($e["nmero"])."
".v($e["bairro"])."
".v($e["cidade"])." - ".v($e["uf"])."
CEP: ".v($e["cep"])."
";
}

$txt .= "

👨‍👩‍👧 PARENTES
──────────────────────────────
";

foreach(($r["parentes"] ?? []) as $p){
$txt .= v($p["nome"])." - ".v($p["grau_de_parentesco"])."\n";
}

$txt .= "

🏢 EMPRESAS
──────────────────────────────
";

foreach(($r["empresas"] ?? []) as $e){
$txt .= "CNPJ: ".v($e["cnpj"])." | ".v($e["relao"])."\n";
}

$txt .= "

💰 BENEFÍCIOS
──────────────────────────────
";

foreach(($r["benefcios"] ?? []) as $b2){
$txt .= $b2["tipo"].": ".$b2["total_recebido"]."\n";
}

$txt .= "

💉 VACINAS
──────────────────────────────
";

foreach(($r["vacinas"] ?? []) as $vcn){
$txt .= $vcn["fabricante"]." - ".$vcn["data_aplicao"]."\n";
}

$txt .= "

🏘 VIZINHOS
──────────────────────────────
";

foreach(($r["vizinhos"] ?? []) as $v){
$txt .= v($v["nome"])."\n";
}

$txt .= "

🛒 COMPRAS
──────────────────────────────
";

foreach(($r["compras_identificadas"] ?? []) as $c){
$txt .= v($c["produto"])." - ".v($c["preo"])."\n";
}

$txt .= "

📊 PERFIL DE CONSUMO
──────────────────────────────
";

foreach(($r["perfil_de_consumo"] ?? []) as $pc){
foreach($pc as $k=>$v2){
$txt .= "{$k}: {$v2}\n";
}
}

$txt .= "

──────────────────────────────
Consulta realizada via:
ASTRO SEARCH ULTRA
";

// 📁 TXT
$file = tempnam(sys_get_temp_dir(),"cpf4_");
file_put_contents($file,$txt);

// 💎 Preview (igual cpf3)
$preview = "
💎 <b>Consulta VIP Realizada</b>

<blockquote>
👤 ".v($b["nome"])."
🪪 CPF: ".v($b["cpf"])."
🎂 ".v($b["data_de_nascimento"])."
👩 Mãe: ".v($b["nome_da_me"])."
</blockquote>

📄 Relatório completo disponível no arquivo TXT.
";

tg("sendDocument",[
"chat_id"=>$chat,
"document"=>new CURLFile($file,"text/plain","cpf4_{$cpf}.txt"),
"caption"=>$preview,
"parse_mode"=>"HTML",
"reply_markup"=>json_encode([
"inline_keyboard"=>[
[
["text"=>"💎 • Ativar VIP","callback_data"=>"planos"]
],
[
["text"=>"🗑 • Apagar","callback_data"=>"apagar_msg"]
]
]
])
]);

unlink($file);

}

function consultaParentes($chat, $cpf) {

    global $STICKER_LOADING, $user_id;

    function v($v) {

        if ($v === null) {
            return "NÃO ENCONTRADO";
        }

        $v = trim($v);

        if ($v === "") {
            return "NÃO ENCONTRADO";
        }

        $invalidos = [
            "SEM INFORMAÇÃO",
            "SEM INFORMACAO",
            "DESCONHECIDO",
            "NULL",
            "-"
        ];

        if (in_array(mb_strtoupper($v), $invalidos)) {
            return "NÃO ENCONTRADO";
        }

        return $v;
    }

    // =========================
    // 🔄 LOADING
    // =========================
    $sticker = tg("sendSticker", [
        "chat_id"=>$chat,
        "sticker"=>$STICKER_LOADING
    ]);

    $stickerData = json_decode($sticker, true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    // =========================
    // 📄 VALIDAÇÃO
    // =========================
    $cpf = preg_replace('/\D/', '', $cpf);

    if (strlen($cpf) != 11) {

        if ($stickerMsgId) {
            tg("deleteMessage", [
                "chat_id"=>$chat,
                "message_id"=>$stickerMsgId
            ]);
        }

        tg("sendMessage", [
            "chat_id"=>$chat,
            "text"=>"❌ CPF inválido.\nUse: <code>/parentes 00000000000</code>",
            "parse_mode"=>"HTML"
        ]);

        return;
    }

    // =========================
    // 🔥 API
    // =========================
    $url = "https://boks.stherlionato.workers.dev/cpf?token=fxckbuscas&cpf={$cpf}";

    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 25
    ]);

    $response = curl_exec($ch);

    curl_close($ch);

    $json = json_decode($response, true);

    // remove loading
    if ($stickerMsgId) {
        tg("deleteMessage", [
            "chat_id"=>$chat,
            "message_id"=>$stickerMsgId
        ]);
    }

    if (
        !$json ||
        empty($json["dados"]["resultado"])
    ) {
        naoEncontrado($chat, "PARENTES", $cpf);
        return;
    }

    // =========================
    // 👨‍👩‍👧 EXTRAIR PARENTES
    // =========================
    $parentes = [];

    foreach ($json["dados"]["resultado"] as $item) {

        $titulo = trim($item["titulo"] ?? "");
        $conteudo = trim($item["conteudo"] ?? "");

        if (
            stripos($conteudo, "GRAU DE PARENTESCO") !== false
        ) {

            preg_match('/NOME:\s*(.*)/i', $titulo, $nomeMatch);
            preg_match('/CPF:\s*(.*)/i', $conteudo, $cpfMatch);
            preg_match('/GRAU DE PARENTESCO:\s*(.*)/i', $conteudo, $grauMatch);

            $parentes[] = [
                "secao" => v($nomeMatch[1] ?? "PARANTE"),
                "dados" => [
                    [
                        "campo" => "CPF",
                        "valor" => v($cpfMatch[1] ?? "")
                    ],
                    [
                        "campo" => "PARENTESCO",
                        "valor" => v($grauMatch[1] ?? "")
                    ]
                ]
            ];
        }
    }

    if (empty($parentes)) {
        naoEncontrado($chat, "PARENTES", $cpf);
        return;
    }

    // =========================
    // 🔐 TOKEN
    // =========================
    $token = bin2hex(random_bytes(16));

    // =========================
    // ☁️ SALVAR
    // =========================
    $payload = json_encode([
        "token" => $token,
        "tipo" => "parentes",
        "query" => $cpf,
        "plano" => "vip",
        "resultado" => [
            [
                "consulta" => "PARENTES",
                "documento" => $cpf,
                "resultado" => $parentes
            ]
        ]
    ]);

    $api = "https://astro-search.stherlionato.workers.dev";

    $ch = curl_init($api . "/api/save");

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS => $payload
    ]);

    curl_exec($ch);

    curl_close($ch);

    // =========================
    // 🔗 LINK
    // =========================
    $link = $api . "/r/" . $token;

    // =========================
    // 💎 PREVIEW
    // =========================
    $msg = "
<b>📊 REQUISIÇÃO REALIZADA COM SUCESSO</b>

<blockquote>🔎 <b>Base:</b> PARENTES • ULTRA COMPLETO</blockquote>

Clique no botão abaixo ou <a href='{$link}'>AQUI</a> para acessar o resultado completo.

⏳ <i>Disponível por tempo limitado</i>

━━━━━━━━━━━━━━━

🤖 <b>Bot:</b> @consultasdedados_bot
📢 <b>Canal:</b> @astrosearch

<blockquote>
<b>Astro Ultra</b>
Sistema premium com vínculos familiares avançados e dados completos.
</blockquote>
";

    // =========================
    // 📲 ENVIO FINAL
    // =========================
    tg("sendMessage", [
        "chat_id" => $chat,
        "text" => $msg,
        "parse_mode" => "HTML",
        "reply_markup" => json_encode([
            "inline_keyboard"=>[
                [
                    ["text"=>"🔍 Ver Resultado","url"=>$link]
                ],
                [
                    ["text"=>"💎 • Ativar VIP","callback_data"=>"planos"]
                ],
                [
                    ["text"=>"🗑 Apagar","callback_data"=>"del_{$user_id}"]
                ]
            ]
        ])
    ]);
}

function consultaCPF1($chat, $cpf) {

    global $STICKER_LOADING, $user_id, $nome;

function v($v) {

    if ($v === null) {
        return "NÃO ENCONTRADO";
    }

    $v = trim($v);

    if ($v === "") {
        return "NÃO ENCONTRADO";
    }

    // só substitui se o TEXTO TODO for sem informação
    $invalidos = [
        "SEM INFORMAÇÃO",
        "SEM INFORMACAO",
        "DESCONHECIDO",
        "NULL",
        "-"
    ];

    if (in_array(mb_strtoupper($v), $invalidos)) {
        return "NÃO ENCONTRADO";
    }

    return $v;
}

    // =========================
    // 🔄 LOADING
    // =========================
    $sticker = tg("sendSticker", [
        "chat_id"=>$chat,
        "sticker"=>$STICKER_LOADING
    ]);
    $stickerData = json_decode($sticker, true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    // =========================
    // 📄 VALIDAÇÃO
    // =========================
    $cpf = preg_replace('/\D/', '', $cpf);

    if (strlen($cpf) != 11) {
        if ($stickerMsgId) {
            tg("deleteMessage", ["chat_id"=>$chat,"message_id"=>$stickerMsgId]);
        }

        tg("sendMessage", [
            "chat_id"=>$chat,
            "text"=>"❌ CPF inválido.\nUse: <code>/cpf 00000000000</code>",
            "parse_mode"=>"HTML"
        ]);
        return;
    }

    // =========================
    // 🔥 NOVA API
    // =========================
    $url = "https://boks.stherlionato.workers.dev/cpf?token=fxckbuscas&cpf={$cpf}";

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL=>$url,
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_TIMEOUT=>25
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $json = json_decode($response, true);

    // remove loading
    if ($stickerMsgId) {
        tg("deleteMessage", ["chat_id"=>$chat,"message_id"=>$stickerMsgId]);
    }

    if (!$json || empty($json["dados"]["resultado"])) {
        naoEncontrado($chat, "CPF", $cpf);
        return;
    }

// =========================
// 🧠 FORMATAR RESULTADO
// =========================
$resultadoFormatado = [];

foreach ($json["dados"]["resultado"] as $item) {

    $titulo = trim($item["titulo"] ?? "");
    $conteudo = trim($item["conteudo"] ?? "");

    if (!$titulo && !$conteudo) {
        continue;
    }

    // cria seção
    $secao = [
        "secao" => $titulo,
        "dados" => []
    ];

    // quebra linhas
    $conteudo = str_replace(["\r\n", "\r"], "\n", $conteudo);

    foreach (explode("\n", $conteudo) as $linha) {

        $linha = trim($linha);

        if (!$linha) continue;

        // separa chave : valor
        if (strpos($linha, ":") !== false) {

            [$k, $v2] = explode(":", $linha, 2);

            $secao["dados"][] = [
                "campo" => trim($k),
                "valor" => v(trim($v2))
            ];

        } else {

            $secao["dados"][] = [
                "campo" => "INFO",
                "valor" => $linha
            ];
        }
    }

    $resultadoFormatado[] = $secao;
}

    // =========================
    // 🔐 TOKEN
    // =========================
    $token = bin2hex(random_bytes(16));

    // =========================
    // ☁️ SALVAR
    // =========================
$payload = json_encode([
    "token" => $token,
    "tipo" => "cpf",
    "query" => $cpf,
    "plano" => "vip",
    "resultado" => [
        [
            "consulta" => "CPF",
            "documento" => $cpf,
            "resultado" => $resultadoFormatado
        ]
    ]
]);

    $api = "https://astro-search.stherlionato.workers.dev";

    $ch = curl_init($api . "/api/save");
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
        CURLOPT_POSTFIELDS => $payload
    ]);
    curl_exec($ch);
    curl_close($ch);

    // =========================
    // 🔗 LINK
    // =========================
    $link = $api . "/r/" . $token;

    // =========================
    // 💎 PREVIEW
    // =========================
    $msg = "
<b>📊 REQUISIÇÃO REALIZADA COM SUCESSO</b>

<blockquote>🔎 <b>Base:</b> CPF • ULTRA COMPLETO</blockquote>

👤 <b>Nome:</b> {$nomePessoa}

Clique no botão abaixo ou <a href='{$link}'>AQUI</a> para acessar o resultado completo.

⏳ <i>Disponível por tempo limitado</i>

━━━━━━━━━━━━━━━

🤖 <b>Bot:</b> @consultasdedados_bot
📢 <b>Canal:</b> @astrosearch

<blockquote>
<b>Astro Ultra</b>
Sistema premium com dados avançados (endereços, score, parentes, vacinas, consumo e muito mais).
</blockquote>
";

    // =========================
    // 📲 ENVIO FINAL
    // =========================
    tg("sendMessage", [
        "chat_id" => $chat,
        "text" => $msg,
        "parse_mode" => "HTML",
        "reply_markup" => json_encode([
            "inline_keyboard"=>[
                [
                    ["text"=>"🔍 Ver Resultado","url"=>$link]
                ],
                [
                    ["text"=>"💎 • Ativar VIP","callback_data"=>"planos"]
                ],
                [
                    ["text"=>"🗑 Apagar","callback_data"=>"del_{$user_id}"]
                ]
            ]
        ])
    ]);
}


function consultaCPF2($chat,$cpf){

global $STICKER_LOADING;

$sticker = tg("sendSticker",[
"chat_id"=>$chat,
"sticker"=>$STICKER_LOADING
]);

$stickerData = json_decode($sticker,true);
$stickerMsgId = $stickerData["result"]["message_id"] ?? null;

$cpf = preg_replace('/\D/','',$cpf);

if(strlen($cpf) != 11){

if($stickerMsgId){
tg("deleteMessage",[
"chat_id"=>$chat,
"message_id"=>$stickerMsgId
]);
}

tg("sendMessage",[
"chat_id"=>$chat,
"text"=>"❌ CPF inválido.\nUse: <code>/cpf2 00000000000</code>",
"parse_mode"=>"HTML"
]);

return;
}

$url = "https://api.blackaut.shop/api/dados-pessoais/cpf?cpf={$cpf}&apikey=EbmScZ0ntHf61KJz3H";

$ch = curl_init($url);
curl_setopt_array($ch,[
CURLOPT_RETURNTRANSFER => true,
CURLOPT_TIMEOUT => 20
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response,true);

if($stickerMsgId){
tg("deleteMessage",[
"chat_id"=>$chat,
"message_id"=>$stickerMsgId
]);
}

if(!$data || empty($data["resultado"])){

tg("sendMessage",[
"chat_id"=>$chat,
"text"=>"❌ CPF não encontrado ou instabilidade na API."
]);

return;
}

$d = $data["resultado"];

$txt = "
╔══════════════════════════════╗
   CONSULTA CPF VIP — ASTRO SEARCH
╚══════════════════════════════╝

DADOS PESSOAIS
──────────────────────────────

CPF: {$d["cpf"]}
Nome: {$d["name"]}
Sexo: {$d["gender"]}
Nascimento: {$d["birth"]}
Idade: {$d["age"]}
Signo: {$d["sign"]}

Mãe: {$d["mother_name"]}
Pai: {$d["father_name"]}

Estado civil: {$d["marital_status"]}
RG: {$d["rg"]}

Situação Receita: {$d["cd_sit_cad"]}
Data situação: {$d["dt_sit_cad"]}
";

if(!empty($d["income"])){

$txt .= "

RENDA
──────────────────────────────
Renda estimada: R$ {$d["income"]}
";
}

# ENDEREÇOS
if(!empty($d["addresses"])){

$txt .= "

ENDEREÇOS
──────────────────────────────
";

foreach($d["addresses"] as $a){

$txt .= "
{$a["logr_type"]} {$a["logr_name"]}, {$a["logr_number"]}
Bairro: {$a["neighborhood"]}
Cidade: {$a["city"]} - {$a["state"]}
CEP: {$a["zip_code"]}
Complemento: {$a["logr_complement"]}
";
}
}

# TELEFONES
if(!empty($d["telephones"])){

$txt .= "

TELEFONES
──────────────────────────────
";

foreach($d["telephones"] as $t){

$txt .= "
({$t["ddd"]}) {$t["phone_number"]}
Tipo: {$t["phone_type"]}
";
}
}

# PODER DE COMPRA
if(!empty($d["purchasing_power"])){

$p = $d["purchasing_power"];

$txt .= "

PODER AQUISITIVO
──────────────────────────────
Faixa: {$p["purchasing_power"]}
Renda estimada: {$p["fx_purchasing_power"]}
";
}

# PARENTES
if(!empty($d["relatives"])){

$txt .= "

PARENTES
──────────────────────────────
";

foreach($d["relatives"] as $r){

$txt .= "
{$r["name"]} - {$r["relationship"]}
CPF: {$r["cpf_complete"]}
";
}
}

# SCORE
if(!empty($d["score"])){

$s = $d["score"];

$txt .= "

SCORE
──────────────────────────────
CSB8: {$s["csb8"]} ({$s["csb8_range"]})
CSBA: {$s["csba"]} ({$s["csba_range"]})
";
}

$txt .= "

──────────────────────────────
Consulta realizada via:
ASTRO SEARCH
";

$file = "cache_cpf2_{$cpf}.txt";
file_put_contents($file,$txt);

tg("sendMessage",[
"chat_id"=>$chat,
"text"=>"✅ <b>Consulta VIP realizada</b>\n\nEscolha o formato do resultado:",
"parse_mode"=>"HTML",
"reply_markup"=>json_encode([
"inline_keyboard"=>[
[
["text"=>"📄 Mostrar no Telegram","callback_data"=>"cpf2_msg|$cpf"]
],
[
["text"=>"📁 Enviar arquivo TXT","callback_data"=>"cpf2_file|$cpf"]
],
[
["text"=>"🗑 Apagar","callback_data"=>"apagar_msg"]
],
[
["text"=>"💎 • Ativar VIP","callback_data"=>"planos"]
]
]
])
]);

}

function consultaCPF3($chat,$cpf){

global $STICKER_LOADING;

function v($v){
return ($v === null || $v === "" || $v === "NULL") ? "NÃO ENCONTRADO" : $v;
}

$sticker = tg("sendSticker",[
"chat_id"=>$chat,
"sticker"=>$STICKER_LOADING
]);

$stickerData = json_decode($sticker,true);
$stickerMsgId = $stickerData["result"]["message_id"] ?? null;

$cpf = preg_replace('/\D/','',$cpf);

if(strlen($cpf) != 11){

if($stickerMsgId){
tg("deleteMessage",[
"chat_id"=>$chat,
"message_id"=>$stickerMsgId
]);
}

tg("sendMessage",[
"chat_id"=>$chat,
"text"=>"❌ CPF inválido.\nUse: <code>/cpf3 00000000000</code>",
"parse_mode"=>"HTML"
]);

return;
}

$url1 = "https://knowsapi.shop/api/consultas/cpf?cpf={$cpf}&apikey=bigmouth";
$url2 = "https://knowsapi.shop/api/consulta/cpf-v5?code={$cpf}&apikey=bigmouth";

$ch = curl_init();
curl_setopt_array($ch,[
CURLOPT_RETURNTRANSFER => true,
CURLOPT_TIMEOUT => 30
]);

curl_setopt($ch,CURLOPT_URL,$url1);
$res1 = curl_exec($ch);
$data1 = json_decode($res1,true);

curl_setopt($ch,CURLOPT_URL,$url2);
$res2 = curl_exec($ch);
$data2 = json_decode($res2,true);

curl_close($ch);

if($stickerMsgId){
tg("deleteMessage",[
"chat_id"=>$chat,
"message_id"=>$stickerMsgId
]);
}

if(empty($data1["body"]) && empty($data2["resultado"])){

tg("sendMessage",[
"chat_id"=>$chat,
"text"=>"❌ CPF não encontrado."
]);

return;
}

$d = $data1["body"];
$v5 = $data2["resultado"];

$txt = "
╔══════════════════════════════╗
   CONSULTA CPF ULTRA — ASTRO SEARCH
╚══════════════════════════════╝

🧠 DADOS PRINCIPAIS
──────────────────────────────
Nome: ".v($v5["pessoal"]["nome"] ?? $d["name"])."
CPF: ".v($d["cpf_masked"])."
Nascimento: ".v($v5["pessoal"]["nascimento"] ?? $d["birth_date"])."
Sexo: ".v($v5["pessoal"]["sexo"] ?? $d["gender"])."
Raça: ".v($v5["pessoal"]["raca"] ?? null)."
Escolaridade: ".v($v5["pessoal"]["escolaridade"] ?? null)."
Profissão: ".v($v5["pessoal"]["profissao"] ?? null)."

Situação Receita: ".v($d["federal_status"])."

Mãe: ".v($d["mother_name"])."
Pai: ".v($d["father_name"])."

RG: ".v($d["rg"])."
Título eleitor: ".v($d["voter_id"])."

CNS: ".v($v5["documentos"]["cns"] ?? null)."
NIS: ".v($v5["documentos"]["nis"] ?? null)."

💰 DADOS FINANCEIROS
──────────────────────────────
Renda: ".v($v5["financeiro"]["renda"] ?? $d["income"])."
Score: ".v($v5["financeiro"]["score"] ?? $d["score"]["value"])."
INSS: ".v($v5["financeiro"]["inss"] ?? null)."
";

$txt .= "

📡 CONTATOS
──────────────────────────────
";

foreach(($v5["contatos_verificados"]["telefones"] ?? []) as $t){

$wpp = $t["tem_whatsapp"] ? "SIM" : "NÃO";

$txt .= "Telefone: ".$t["numero"]." | WhatsApp: {$wpp}\n";
}

foreach(($v5["contatos_verificados"]["emails"] ?? []) as $e){

$txt .= "Email: {$e}\n";
}

$txt .= "

📍 ENDEREÇOS
──────────────────────────────
";

foreach(($v5["contatos_verificados"]["enderecos"] ?? []) as $e){

$txt .= "{$e}\n";
}

$a = $d["address"] ?? [];

$txt .= "

📌 ENDEREÇO PRINCIPAL
──────────────────────────────
".v($a["type"])." ".v($a["street"])." ".v($a["number"])."
Bairro: ".v($a["neighborhood"])."
Cidade: ".v($a["city"])." - ".v($a["state"])."
CEP: ".v($a["zip_code"])."
";

$txt .= "

🏠 HISTÓRICO DE ENDEREÇOS
──────────────────────────────
";

foreach(($d["all_addresses"] ?? []) as $a){

$txt .= "
".v($a["type"])." ".v($a["street"])." ".v($a["number"])."
".v($a["city"])." - ".v($a["state"])."
CEP: ".v($a["zip_code"])."
Fonte: ".v($a["source"])."
";
}

$txt .= "

👨‍👩‍👧 PARENTES
──────────────────────────────
";

foreach(($v5["filiacao_e_parentes"] ?? []) as $p){

$txt .= v($p["nome"])." - ".v($p["tipo"])."\n";
}

$txt .= "

🏘 VIZINHOS
──────────────────────────────
";

foreach(($data1["body"]["vizinhos"] ?? []) as $v){

$txt .= "
".v($v["nome"])."
".v($v["logradouro"])." ".v($v["numero"])."
Bairro: ".v($v["bairro"])."
";
}

$txt .= "

🛍 PERFIL DE CONSUMO
──────────────────────────────
";

foreach(($v5["perfil_consumo"] ?? []) as $k=>$v){

$txt .= "{$k}: {$v}\n";
}

$txt .= "

💼 HISTÓRICO DE EMPREGOS
──────────────────────────────
";

foreach(($v5["historico_empregos"] ?? []) as $e){

$txt .= "{$e}\n";
}

/* COMPRAS SIMULADAS */

$nascimento = $v5["pessoal"]["nascimento"] ?? $d["birth_date"] ?? null;

if($nascimento){

$idade = floor((time() - strtotime($nascimento)) / 31557600);

if($idade >= 18){

$itens = [
"Biscoitos",
"Refrigerante",
"Café",
"Arroz",
"Sabonete",
"Papel Higiênico",
"Shampoo",
"Cerveja",
"Chocolate",
"Detergente",
"Leite",
"Pão",
"Macarrão",
"Desodorante",
"Cortina",
"Abajur"
];

shuffle($itens);

$qtd = rand(3,7);

$txt .= "

🛒 HISTÓRICO DE COMPRAS
──────────────────────────────
";

for($i=0;$i<$qtd;$i++){

$quant = rand(1,3);

$txt .= $itens[$i]." — {$quant} unidade(s)\n";

}

}

}

$txt .= "

──────────────────────────────
Consulta realizada via:
ASTRO SEARCH ULTRA
";

$file = tempnam(sys_get_temp_dir(),"cpf3_");
file_put_contents($file,$txt);

$preview = "
💎 <b>Consulta VIP Realizada</b>

<blockquote>
👤 ".v($v5["pessoal"]["nome"] ?? $d["name"])."
🪪 CPF: ".v($d["cpf_masked"])."
🎂 ".v($v5["pessoal"]["nascimento"] ?? $d["birth_date"])."
👩 Mãe: ".v($d["mother_name"])."
📍 ".v($d["address"]["city"])." - ".v($d["address"]["state"])."
</blockquote>

📄 Relatório completo disponível no arquivo TXT.
";

tg("sendDocument",[
"chat_id"=>$chat,
"document"=>new CURLFile($file,"text/plain","cpf3_{$cpf}.txt"),
"caption"=>$preview,
"parse_mode"=>"HTML",
"reply_markup"=>json_encode([
"inline_keyboard"=>[
[
["text"=>"💎 • Ativar VIP","callback_data"=>"planos"]
],
[
["text"=>"🗑 • Apagar","callback_data"=>"apagar_msg"]
]
]
])
]);

unlink($file);

}

function consultaPlaca($chat, $placa) {

    global $STICKER_LOADING, $user_id;

    function v($v) {

        if ($v === null) {
            return "NÃO ENCONTRADO";
        }

        $v = trim($v);

        if ($v === "") {
            return "NÃO ENCONTRADO";
        }

        $invalidos = [
            "SEM INFORMAÇÃO",
            "SEM INFORMACAO",
            "DESCONHECIDO",
            "NULL",
            "-"
        ];

        if (in_array(mb_strtoupper($v), $invalidos)) {
            return "NÃO ENCONTRADO";
        }

        return $v;
    }

    // =========================
    // 🔄 LOADING
    // =========================
    $sticker = tg("sendSticker", [
        "chat_id"=>$chat,
        "sticker"=>$STICKER_LOADING
    ]);

    $stickerData = json_decode($sticker, true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    // =========================
    // 🚗 VALIDAÇÃO
    // =========================
    $placa = strtoupper(
        preg_replace('/[^A-Z0-9]/', '', $placa)
    );

    if (strlen($placa) < 7) {

        if ($stickerMsgId) {
            tg("deleteMessage", [
                "chat_id"=>$chat,
                "message_id"=>$stickerMsgId
            ]);
        }

        tg("sendMessage", [
            "chat_id"=>$chat,
            "text"=>"❌ Placa inválida.\nUse: <code>/placa ABC1234</code>",
            "parse_mode"=>"HTML"
        ]);

        return;
    }

    // =========================
    // 🔥 API
    // =========================
    $url = "https://boks.stherlionato.workers.dev/placa?token=fxckbuscas&placa={$placa}";

    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL=>$url,
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_TIMEOUT=>25
    ]);

    $response = curl_exec($ch);

    curl_close($ch);

    $json = json_decode($response, true);

    // =========================
    // ❌ REMOVE LOADING
    // =========================
    if ($stickerMsgId) {
        tg("deleteMessage", [
            "chat_id"=>$chat,
            "message_id"=>$stickerMsgId
        ]);
    }

    // =========================
    // ❌ SEM RESULTADO
    // =========================
    if (
        !$json ||
        empty($json["dados"]["resultado"])
    ) {

        naoEncontrado($chat, "PLACA", $placa);
        return;
    }

    // =========================
    // 🧠 FORMATAR RESULTADO
    // =========================
    $resultadoFormatado = [];

    foreach ($json["dados"]["resultado"] as $item) {

        $titulo = trim($item["titulo"] ?? "");
        $conteudo = trim($item["conteudo"] ?? "");

        if (!$titulo && !$conteudo) {
            continue;
        }

        $secao = [
            "secao" => $titulo,
            "dados" => []
        ];

        $conteudo = str_replace(["\r\n", "\r"], "\n", $conteudo);

        foreach (explode("\n", $conteudo) as $linha) {

            $linha = trim($linha);

            if (!$linha) continue;

            if (strpos($linha, ":") !== false) {

                [$k, $v2] = explode(":", $linha, 2);

                $secao["dados"][] = [
                    "campo" => trim($k),
                    "valor" => v(trim($v2))
                ];

            } else {

                $secao["dados"][] = [
                    "campo" => "INFO",
                    "valor" => $linha
                ];
            }
        }

        $resultadoFormatado[] = $secao;
    }

    // =========================
    // 🔐 TOKEN
    // =========================
    $token = bin2hex(random_bytes(16));

    // =========================
    // ☁️ SALVAR
    // =========================
    $payload = json_encode([
        "token" => $token,
        "tipo" => "placa",
        "query" => $placa,
        "plano" => "vip",
        "resultado" => [
            [
                "consulta" => "PLACA",
                "documento" => $placa,
                "resultado" => $resultadoFormatado
            ]
        ]
    ]);

    $api = "https://astro-search.stherlionato.workers.dev";

    $ch = curl_init($api . "/api/save");

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS => $payload
    ]);

    curl_exec($ch);

    curl_close($ch);

    // =========================
    // 🔗 LINK
    // =========================
    $link = $api . "/r/" . $token;

    // =========================
    // 💎 PREVIEW
    // =========================
    $msg = "
<b>📊 REQUISIÇÃO REALIZADA COM SUCESSO</b>

<blockquote>🚗 <b>Base:</b> PLACA • ULTRA COMPLETO</blockquote>

🚘 <b>Placa:</b> {$placa}

Clique no botão abaixo ou <a href='{$link}'>AQUI</a> para acessar o resultado completo.

⏳ <i>Disponível por tempo limitado</i>

━━━━━━━━━━━━━━━

🤖 <b>Bot:</b> @consultasdedados_bot
📢 <b>Canal:</b> @astrosearch

<blockquote>
<b>Astro Ultra</b>
Dados completos do veículo, proprietário, restrições e muito mais.
</blockquote>
";

    // =========================
    // 📲 ENVIO FINAL
    // =========================
    tg("sendMessage", [
        "chat_id" => $chat,
        "text" => $msg,
        "parse_mode" => "HTML",
        "reply_markup" => json_encode([
            "inline_keyboard"=>[
                [
                    ["text"=>"🔍 Ver Resultado","url"=>$link]
                ],
                [
                    ["text"=>"💎 • Ativar VIP","callback_data"=>"planos"]
                ],
                [
                    ["text"=>"🗑 Apagar","callback_data"=>"del_{$user_id}"]
                ]
            ]
        ])
    ]);
}

function consultaInstagram($chat,$user){

global $STICKER_LOADING;

if(!$user){
tg("sendMessage",[
"chat_id"=>$chat,
"text"=>"❌ Use assim:

/instagram usuario"
]);
return;
}

$sticker = tg("sendSticker",[
"chat_id"=>$chat,
"sticker"=>$STICKER_LOADING
]);

$stickerData = json_decode($sticker,true);
$stickerMsgId = $stickerData["result"]["message_id"] ?? null;

$user = urlencode($user);

$url = "https://sara-api.xyz/api/stalking/instagram?user={$user}&apikey=bigmouth";

$resp = @file_get_contents($url);
$json = json_decode($resp,true);

if($stickerMsgId){
tg("deleteMessage",[
"chat_id"=>$chat,
"message_id"=>$stickerMsgId
]);
}

if(!$json || !$json["data"]["resultado"]){

tg("sendMessage",[
"chat_id"=>$chat,
"text"=>"❌ Instagram não encontrado."
]);

return;
}

$d = $json["data"]["resultado"];

$nome = htmlspecialchars($d["nome"] ?? "Não informado");
$username = htmlspecialchars($d["username"] ?? "");
$id = $d["id"] ?? "Não encontrado";
$categoria = htmlspecialchars($d["categoria"] ?? "Não informado");
$bio = !empty($d["bio"]) ? htmlspecialchars($d["bio"]) : "Sem bio";
$empresa = htmlspecialchars($d["empresa"] ?? "Não informado");
$conta = htmlspecialchars($d["conta"] ?? "Não informado");
$verificada = htmlspecialchars($d["verificada"] ?? "Não informado");
$seguidores = $d["seguidores"] ?? "0";
$seguindo = $d["seguindo"] ?? "0";
$postagens = $d["postagens"] ?? "0";
$foto = $d["imagem"] ?? "https://i.imgur.com/9Xn4K2B.png";

$msg = "📸 <b>CONSULTA INSTAGRAM</b>

👤 <b>Nome:</b> {$nome}
📛 <b>Usuário:</b> @{$username}
🆔 <b>ID:</b> <code>{$id}</code>

🏷 <b>Categoria:</b> {$categoria}
🏢 <b>Empresa:</b> {$empresa}
🔓 <b>Conta:</b> {$conta}
✔️ <b>Verificada:</b> {$verificada}

👥 <b>Seguidores:</b> {$seguidores}
➡️ <b>Seguindo:</b> {$seguindo}
🖼 <b>Postagens:</b> {$postagens}

📝 <b>Bio:</b>
{$bio}";

tg("sendPhoto",[
"chat_id"=>$chat,
"photo"=>$foto,
"caption"=>$msg,
"parse_mode"=>"HTML",
"reply_markup"=>json_encode([
"inline_keyboard"=>[
[
["text"=>"🌐 Abrir Perfil","url"=>"https://instagram.com/".$username]
],
[
["text"=>"🗑 Apagar","callback_data"=>"apagar_msg"]
]
]
])
]);

}

function consultaCPF($chat, $cpf) {

    global $STICKER_LOADING, $user_id, $nome;

    // =========================
    // 🧠 FORMATADOR
    // =========================
    function v($v) {

        if ($v === null) {
            return "NÃO ENCONTRADO";
        }

        $v = trim($v);

        if ($v === "") {
            return "NÃO ENCONTRADO";
        }

        $invalidos = [
            "SEM INFORMAÇÃO",
            "SEM INFORMACAO",
            "DESCONHECIDO",
            "NULL",
            "-"
        ];

        if (in_array(mb_strtoupper($v), $invalidos)) {
            return "NÃO ENCONTRADO";
        }

        return $v;
    }

    // =========================
    // 🔄 LOADING
    // =========================
    $sticker = tg("sendSticker", [
        "chat_id" => $chat,
        "sticker" => $STICKER_LOADING
    ]);

    $stickerData = json_decode($sticker, true);
    $stickerMsgId = $stickerData["result"]["message_id"] ?? null;

    // =========================
    // 📄 VALIDAR CPF
    // =========================
    $cpf = preg_replace('/\D/', '', $cpf);

    if (strlen($cpf) != 11) {

        if ($stickerMsgId) {
            tg("deleteMessage", [
                "chat_id" => $chat,
                "message_id" => $stickerMsgId
            ]);
        }

        tg("sendMessage", [
            "chat_id" => $chat,
            "text" => "❌ CPF inválido.\nUse: <code>/cpf 00000000000</code>",
            "parse_mode" => "HTML"
        ]);

        return;
    }

    // =========================
    // 🔥 API
    // =========================
    $url = "https://boks.stherlionato.workers.dev/cpf?token=fxckbuscas&cpf={$cpf}";

    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 25
    ]);

    $response = curl_exec($ch);

    curl_close($ch);

    $json = json_decode($response, true);

    // remove loading
    if ($stickerMsgId) {

        tg("deleteMessage", [
            "chat_id" => $chat,
            "message_id" => $stickerMsgId
        ]);
    }

    // =========================
    // ❌ NÃO ENCONTRADO
    // =========================
    if (
        !$json ||
        empty($json["dados"]["resultado"])
    ) {

        naoEncontrado($chat, "CPF", $cpf);

        return;
    }

    // =========================
    // 🧠 CAMPOS PERMITIDOS
    // =========================
    $permitidos = [

        "NOME",
        "CPF",
        "DATA DE NASCIMENTO",
        "IDADE",
        "SEXO",

        "NOME DA MÃE",
        "NOME DA MAE",

        "ENDEREÇO",
        "ENDERECO",
        "BAIRRO",
        "CIDADE",
        "UF",
        "CEP",

        "TELEFONE",
        "CELULAR",

        "SITUAÇÃO CADASTRAL",
        "SITUACAO CADASTRAL"
    ];

    // =========================
    // 🧠 FORMATAR RESULTADO
    // =========================
    $resultadoFormatado = [];

    foreach ($json["dados"]["resultado"] as $item) {

        $titulo = trim($item["titulo"] ?? "");
        $conteudo = trim($item["conteudo"] ?? "");

        if (!$titulo && !$conteudo) {
            continue;
        }

        $secao = [
            "secao" => $titulo,
            "dados" => []
        ];

        $conteudo = str_replace(
            ["\r\n", "\r"],
            "\n",
            $conteudo
        );

        foreach (explode("\n", $conteudo) as $linha) {

            $linha = trim($linha);

            if (!$linha) {
                continue;
            }

            if (strpos($linha, ":") !== false) {

                [$k, $v2] = explode(":", $linha, 2);

                $campo = trim($k);
                $valor = v(trim($v2));

                $campoUpper = mb_strtoupper($campo);

                // filtra somente os campos permitidos
                if (!in_array($campoUpper, $permitidos)) {
                    continue;
                }

                $secao["dados"][] = [
                    "campo" => $campo,
                    "valor" => $valor
                ];
            }
        }

        // evita seção vazia
        if (!empty($secao["dados"])) {
            $resultadoFormatado[] = $secao;
        }
    }

    // =========================
    // 👤 PEGAR NOME
    // =========================
    $nomePessoa = "NÃO ENCONTRADO";

    foreach ($resultadoFormatado as $secao) {

        foreach ($secao["dados"] as $dado) {

            $campo = mb_strtoupper($dado["campo"]);

            if ($campo == "NOME") {

                $nomePessoa = $dado["valor"];

                break 2;
            }
        }
    }

    // =========================
    // 🔐 TOKEN
    // =========================
    $token = bin2hex(random_bytes(16));

    // =========================
    // ☁️ SALVAR RESULTADO
    // =========================
    $payload = json_encode([
        "token" => $token,
        "tipo" => "cpf",
        "query" => $cpf,
        "plano" => "vip",
        "resultado" => [
            [
                "consulta" => "CPF",
                "documento" => $cpf,
                "resultado" => $resultadoFormatado
            ]
        ]
    ]);

    $api = "https://astro-search.stherlionato.workers.dev";

    $ch = curl_init($api . "/api/save");

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS => $payload
    ]);

    curl_exec($ch);

    curl_close($ch);

    // =========================
    // 🔗 LINK
    // =========================
    $link = $api . "/r/" . $token;

    // =========================
    // 💎 PREVIEW
    // =========================
    $msg = "
<b>📊 REQUISIÇÃO REALIZADA COM SUCESSO</b>

<blockquote>🔎 <b>Base:</b> CPF • SIMPLES</blockquote>

👤 <b>Nome:</b> {$nomePessoa}

Clique no botão abaixo ou <a href='{$link}'>AQUI</a> para acessar o resultado completo.

⏳ <i>Disponível por tempo limitado</i>

━━━━━━━━━━━━━━━

🤖 <b>Bot:</b> @consultasdedados_bot
📢 <b>Canal:</b> @astrosearch

<blockquote>
<b>Astro Premium</b>
Consultas rápidas com dados organizados,
interface premium e acesso imediato.
</blockquote>
";

    // =========================
    // 📲 ENVIO
    // =========================
    tg("sendMessage", [

        "chat_id" => $chat,

        "text" => $msg,

        "parse_mode" => "HTML",

        "disable_web_page_preview" => true,

        "reply_markup" => json_encode([

            "inline_keyboard" => [

                [
                    [
                        "text" => "🔍 Ver Resultado",
                        "url" => $link
                    ]
                ],

                [
                    [
                        "text" => "💎 • Ativar VIP",
                        "callback_data" => "planos"
                    ]
                ],

                [
                    [
                        "text" => "🗑 Apagar",
                        "callback_data" => "del_{$user_id}"
                    ]
                ]
            ]
        ])
    ]);
}

/* ================= START ================= */

if($message && isset($message["text"])){

    $text = explode(" ", $message["text"])[0];
    $text = explode("@", $text)[0];

    if(in_array($text, ["/start", "/menu"])){

        $chat_id = $message["chat"]["id"];
        $nome    = $message["from"]["first_name"] ?? "usuário";
        $user_id = $message["from"]["id"];

        menuPrincipal($chat_id, $nome, $user_id);
        exit;
    }
}

if($message && isset($message["text"])){

$text = $message["text"];

// 🔹 ATIVAR/DESATIVAR WELCOME
if(strpos($text, "/setwelcome") === 0){

    if($chatType == "private"){
        return;
    }

    if($userId != $ADMIN_ID){
        return;
    }

    $args = explode(" ", $text);
    $status = $args[1] ?? null;

    if($status != "1" && $status != "0"){
        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"⚙️ Use:\n<code>/setwelcome 1</code> para ativar\n<code>/setwelcome 0</code> para desativar",
            "parse_mode"=>"HTML"
        ]);
        return;
    }

    setWelcome($chat, $status);

    tg("sendMessage",[
        "chat_id"=>$chat,
        "text"=>$status == 1 ? "✅ Welcome ativado!" : "❌ Welcome desativado!"
    ]);
}
}

// =========================
// FUNÇÃO UNIVERSAL DE EDIÇÃO
// =========================
function editarMsg($callback, $chat, $msg, $texto, $markup){

    if(isset($callback["message"]["caption"])){

        // mensagem com FOTO
        tg("editMessageCaption",[
            "chat_id"=>$chat,
            "message_id"=>$msg,
            "caption"=>$texto,
            "parse_mode"=>"HTML",
            "reply_markup"=>$markup
        ]);

    } else {

        // mensagem de TEXTO
        tg("editMessageText",[
            "chat_id"=>$chat,
            "message_id"=>$msg,
            "text"=>$texto,
            "parse_mode"=>"HTML",
            "reply_markup"=>$markup
        ]);

    }
}

/* ================= COMANDOS ================= */

if($message && isset($message["text"]) && str_starts_with($message["text"], "/")){
    $chat = $message["chat"]["id"];
    $userId = $message["from"]["id"];
    $p = explode(" ", trim($message["text"]), 2);
    $cmd = strtolower($p[0]);
    $arg = $p[1] ?? null;
    
/* GERAR VIP */

if($cmd === "/gerarvip"){

    if($userId != $OWNER_ID){
        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ Você não tem permissão."
        ]);
        exit;
    }

    $codigo = gerarCodigoVip();

    tg("sendMessage",[
        "chat_id"=>$chat,
        "text"=>"🔑 <b>CÓDIGO VIP GERADO</b>

<code>{$codigo}</code>

Envie para o cliente usar:

<code>/resgatar {$codigo}</code>",
        "parse_mode"=>"HTML"
    ]);

    exit;
}

if($cmd === "/resgatar"){

    if(!$arg){
        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"Use:\n/resgatar CODIGO"
        ]);
        exit;
    }

$username = $message["from"]["username"] ?? "sem_username";

$resultado = resgatarCodigo($arg,$userId,$username);

    if($resultado == "VIP_ATIVADO"){

        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"✅ <b>VIP ATIVADO!</b>

Agora você tem acesso às consultas VIP 🚀",
            "parse_mode"=>"HTML"
        ]);

    }else{

        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>$resultado
        ]);

    }

    exit;
}

    /* ATIVAR FREE GRUPO */

if($cmd === "/freevip"){

    if($userId != $OWNER_ID){
        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ Apenas o dono pode usar."
        ]);
        exit;
    }

    if(!isGroupChat($message["chat"]["type"])){
        tg("sendMessage",[
            "chat_id"=>$chat,
            "text"=>"❌ Apenas em grupos."
        ]);
        exit;
    }

    ativarFreeGrupo($chat);

    tg("sendMessage",[
        "chat_id"=>$chat,
        "text"=>"🚀 <b>VIP LIBERADO NO GRUPO</b>

Todas consultas VIP liberadas.",
        "parse_mode"=>"HTML"
    ]);

    exit;
}

    // ===== COMANDOS GRÁTIS =====
    if($cmd === "/cnpj"){
        $arg ? consultaCNPJ($chat, $arg) : tutorial($chat, "/cnpj");
        exit;
    }

    if($cmd === "/ip"){
        $arg ? consultaIP($chat, $arg) : tutorial($chat, "/ip");
        exit;
    }


    if($cmd === "/cep"){
        $arg ? consultaCEP($chat, $arg) : tutorial($chat, "/cep");
        exit;
    }

    // ===== COMANDOS VIP =====
$vipCmds = ["/cpf","/fotorj","/fotosp","/instagram","/cpf1","/cpf2","/cpf3","/cpf4","/vizinhos","/parentes","/nome","/rg","/cnh","/telefone","/email","/placa","/pix","/renavam","/nascimento","/foto"];
    if(in_array($cmd, $vipCmds)){

    // ❗ primeiro valida se enviou argumento
    if(!$arg){
        tutorial($chat, $cmd);
        exit;
    }

    // 🔒 depois verifica VIP
    if(!isVip($userId) && !isFreeGroup($chat)){
    bloquearConsulta($chat);
    exit;
}
        
        if($cmd === "/cpf1"){
            $arg ? consultaCPF1($chat, $arg) : tutorial($chat, "/cpf");
            exit;
        }
        
         if($cmd === "/cpf"){
            $arg ? consultaCPF($chat, $arg) : tutorial($chat, "/cpf");
            exit;
        }

if($cmd === "/instagram"){
    consultaInstagram($chat,$arg);
    exit;
}
        
        if($cmd === "/placa"){
    consultaPlaca($chat, $arg);
    exit;
}
        
        if($cmd === "/parentes"){
    consultaParentes($chat, $arg);
    exit;
        }
        
        if($cmd === "/nome"){
            $arg ? consultaNome($chat, $arg) : tutorial($chat, "/nome");
            exit;
        }
        
        if($cmd === "/telefone"){
    consultaTelefone($chat, $arg);
    exit;
}
        
        if($cmd === "/foto"){

    $chatType = $message["chat"]["type"];

    // 🚫 bloquear foto em grupos FREE
    if(isGroupChat($chatType) && isFreeGroup($chat) && !isVip($userId)){
        bloquearConsulta($chat);
        exit;
    }

    consultaFoto($chat, $arg);
    exit;
}

if($cmd === "/fotosp"){

    $chatType = $message["chat"]["type"];

    if(isGroupChat($chatType) && isFreeGroup($chat) && !isVip($userId)){
        bloquearConsulta($chat);
        exit;
    }

    consultaFotoSP($chat, $arg);
    exit;
}

if($cmd === "/fotorj"){

    $chatType = $message["chat"]["type"];

    if(isGroupChat($chatType) && isFreeGroup($chat) && !isVip($userId)){
        bloquearConsulta($chat);
        exit;
    }

    consultaFotoRJ($chat, $arg);
    exit;
}

if($cmd === "/email"){
    consultaEmail($chat, $arg);
    exit;
}

if($cmd === "/vizinhos"){
    consultaVizinhos($chat, $arg);
    exit;
}

        // outros comandos VIP futuramente aqui
        tutorial($chat, $cmd);
        exit;
    }
}

/* ================= CALLBACKS ================= */
if($callback){

    answer($callback["id"]);

    $chat = $callback["message"]["chat"]["id"];
    $msg  = $callback["message"]["message_id"];
    $id   = $callback["from"]["id"];
    $nome = $callback["from"]["first_name"] ?? "usuário";
    $data = $callback["data"] ?? "";

    // =========================
    // VOLTAR MENU
    // =========================
if($data == "voltar_menu"){

    $tipo = $callback["message"]["chat"]["type"];

    menuPrincipal(
        $chat,
        $nome,
        $id,
        $tipo,
        true,
        $msg
    );

    exit;
}

    // =========================
    // APAGAR MSG
    // =========================
    if($data == "apagar_msg"){
        tg("deleteMessage",[
            "chat_id"=>$chat,
            "message_id"=>$msg
        ]);
        exit;
    }
    
    // =========================
// ABRIR MENUS
// =========================

if($data == "menu_vip"){
    menuVip($chat,$msg);
    exit;
}


if($data == "menu_free"){
    menuFree($chat,$msg);
    exit;
}

if($data == "catalogo_1"){
    catalogo1($chat,$msg);
    exit;
}

if(strpos($data,"menu_") === 0){

$vipMenus = ["menu_cpf","menu_nome","menu_tel","menu_placa","menu_parentes","menu_vizinhos","menu_foto","menu_email"];

if(in_array($data,$vipMenus)){

    if(!isVip($id) && !isFreeGroup($chat)){

        tg("answerCallbackQuery",[
            "callback_query_id"=>$callback["id"],
            "text"=>"🔒 Apenas VIP",
            "show_alert"=>true
        ]);

        return;
    }

}
}
    
    // =========================
// MENUS DE CONSULTA
// =========================

if($data == "menu_cpf"){
    telaTutorial($chat,$msg,"Consulta de CPF","/cpf","12345678900");
    exit;
}

if($data == "menu_nome"){
    telaTutorial($chat,$msg,"Consulta por Nome","/nome","João Silva");
    exit;
}

if($data == "menu_tel"){
    telaTutorial($chat,$msg,"Consulta de Telefone","/telefone","31999999999");
    exit;
}

if($data == "menu_placa"){
    telaTutorial($chat,$msg,"Consulta de Placa","/placa","ABC1D23");
    exit;
}

if($data == "menu_parentes"){
    telaTutorial($chat,$msg,"Consulta de Parentes","/parentes","12345678900");
    exit;
}

if($data == "menu_vizinhos"){
    telaTutorial($chat,$msg,"Consulta de Vizinhos","/vizinhos","12345678900");
    exit;
}

if($data == "menu_foto"){
    telaTutorial($chat,$msg,"Consulta de Foto","/foto","12345678900");
    exit;
}

if($data == "menu_email"){
    telaTutorial($chat,$msg,"Consulta de Email","/email","teste@email.com");
    exit;
}

if($data == "menu_ip"){
    telaTutorial($chat,$msg,"Consulta de IP","/ip","8.8.8.8");
    exit;
}

if($data == "menu_cnpj"){
    telaTutorial($chat,$msg,"Consulta de CNPJ","/cnpj","00000000000100");
    exit;
}

if($data == "menu_cep"){
    telaTutorial($chat,$msg,"Consulta de CEP","/cep","01001000");
    exit;
}

// =========================
// PLANOS
// =========================
if($data == "planos"){

    $texto = "🚀 <b>CONSULTAS ILIMITADAS</b>\n\n💎 Tenha acesso completo à nossa base de consultas avançadas:\n\n✅ RG, CPF e CNH\n✅ Endereços e dados completos\n✅ Score e dados financeiros\n✅ Parentes e vínculos\n✅ Veículos (chassi, motor, laudo)\n✅ Benefícios, CADSUS e muito mais...\n\n⚡ <b>Consultas ilimitadas + acesso instantâneo</b>\n\n👇 <b>Escolha seu plano:</b>";

    $markup = json_encode([
        "inline_keyboard"=>[
            [
                ["text"=>"📅 Diário - R$14,90","callback_data"=>"plano_diario"],
                ["text"=>"📆 Semanal - R$24,90","callback_data"=>"plano_semanal"]
            ],
            [
                ["text"=>"👑 Para Sempre - R$20,90 - Oferta.","callback_data"=>"plano_vitalicio"]
            ],
            [
                ["text"=>"🏠 Início","callback_data"=>"voltar_menu"]
            ]
        ]
    ]);

    editarMsg($callback, $chat, $msg, $texto, $markup);

    exit;
}


// =========================
// ESCOLHA DO PLANO
// =========================
if(strpos($data, "plano_") === 0){

    $plano = str_replace("plano_", "", $data);

    $texto = "💎 <b>Plano ".strtoupper($plano)."</b>\n\n💰 Clique abaixo para ver a chave PIX e realizar o pagamento.";

    $markup = json_encode([
        "inline_keyboard"=>[
            [
                ["text"=>"💳 Chave Pix","callback_data"=>"pix_{$plano}"]
            ],
            [
                ["text"=>"⬅️ Voltar","callback_data"=>"planos"]
            ]
        ]
    ]);

    editarMsg($callback, $chat, $msg, $texto, $markup);

    exit;
}


// =========================
// MOSTRAR PIX
// =========================
if(strpos($data, "pix_") === 0){

    global $PLANOS, $CHAVE_PIX;

    $plano = str_replace("pix_", "", $data);

    if(!isset($PLANOS[$plano])){
        tg("answerCallbackQuery",[
            "callback_query_id"=>$callback["id"],
            "text"=>"❌ Plano inválido",
            "show_alert"=>true
        ]);
        exit;
    }

    $valor = $PLANOS[$plano];

    tg("answerCallbackQuery",[
        "callback_query_id"=>$callback["id"],
        "text"=>"📋 Copie a chave e faça o pagamento",
        "show_alert"=>false
    ]);

    $texto = "💎 <b>PLANO ".strtoupper($plano)."</b>\n\n💰 Valor: <b>R$ {$valor}</b>\n\n📌 <b>Chave PIX:</b>\n<code>{$CHAVE_PIX}</code>\n\n📋 <i>Clique na chave acima para copiar automaticamente</i>\n\n⚠️ <b>IMPORTANTE:</b>\n⏳ Envie o comprovante para liberação imediata";

    $markup = json_encode([
        "inline_keyboard"=>[
            [
                ["text"=>"📄 Enviar Comprovante","url"=>"https://t.me/astrosuporte"]
            ],
            [
                ["text"=>"⬅️ Voltar","callback_data"=>"planos"]
            ]
        ]
    ]);

    editarMsg($callback, $chat, $msg, $texto, $markup);

    exit;
}

    // =========================
    // CONTA
    // =========================
    if($data == "conta"){

        $plano = isVip($id) ? "VIP" : "Grátis";

        tg("editMessageCaption",[
            "chat_id"=>$chat,
            "message_id"=>$msg,
            "caption"=>"👤 <b>MINHA CONTA</b>\n\n🆔 ID: <code>{$id}</code>\n👤 Nome: <b>{$nome}</b>\n⭐ Plano: <b>{$plano}</b>",
            "parse_mode"=>"HTML",
            "reply_markup"=>json_encode([
                "inline_keyboard"=>[
                    [["text"=>"⬅️ Menu","callback_data"=>"voltar_menu"]]
                ]
            ])
        ]);

        exit;
    }

    // =========================
    // CPF CONSULTAS
    // =========================
    if(str_starts_with($data,"cpf_")){

        $dados = explode("|",$data);
        $tipo = $dados[0] ?? "";
        $cpf  = $dados[1] ?? "";

        tg("editMessageCaption",[
            "chat_id"=>$chat,
            "message_id"=>$msg,
            "caption"=>"🔎 <b>CONSULTANDO...</b>\nCPF: <code>{$cpf}</code>",
            "parse_mode"=>"HTML"
        ]);

        if(!isVip($id) && !isFreeGroup($chat)){
            bloquearConsulta($chat);
            exit;
        }

        if($tipo == "cpf_simples") consultaCPF($chat,$cpf);
        if($tipo == "cpf_full") consultaCPF1($chat,$cpf);
        if($tipo == "cpf2") consultaCPF2($chat,$cpf);
        if($tipo == "cpf3") consultaCPF3($chat,$cpf);
        if($tipo == "cpf4") consultaCpf4($chat,$cpf);
        if($tipo == "cpf_vizinhos") consultaVizinhos($chat,$cpf);
        if($tipo == "cpf_parentes") consultaParentes($chat,$cpf);

        exit;
    }

    // =========================
    // CATALOGO
    // =========================
    if($data == "catalogo_1"){
        catalogo1($chat,$msg);
        exit;
    }

    if($data == "catalogo_2"){
        catalogo2($chat,$msg);
        exit;
    }
}

echo "OK";