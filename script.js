// ===================== STATE =====================

let questoes = [];
let atual = null;

let stats = {
    total: 0,
    acertos: 0,
    erros: 0,
    streak: 0,
    historico: [],
    favoritos: []
};

// ===================== INIT =====================

window.onload = () => {
    carregarLocal();
    carregarEventos();
    atualizarUI();
};

// ===================== LOCAL STORAGE =====================

function salvarLocal() {
    localStorage.setItem("studychat_stats", JSON.stringify(stats));
}

function carregarLocal() {
    const data = localStorage.getItem("studychat_stats");
    if (data) stats = JSON.parse(data);
}

// ===================== EVENTOS =====================

function carregarEventos() {

    document.getElementById("novaQuestao").onclick = novaQuestao;
    document.getElementById("proxima").onclick = novaQuestao;

    document.querySelectorAll(".alternativa").forEach(btn => {
        btn.onclick = () => responder(btn.getAttribute("data"));
    });

    document.getElementById("dica").onclick = mostrarDica;
    document.getElementById("explicacao").onclick = mostrarExplicacao;
    document.getElementById("favoritar").onclick = favoritar;

    // Import JSON
    const fileJson = document.getElementById("fileJson");
    if (fileJson) {
        fileJson.onchange = importarJSON;
    }

    document.querySelectorAll(".fechar").forEach(btn => {
        btn.onclick = fecharModais;
    });

    // Menus (abrir modais simples)
    document.querySelectorAll(".menu").forEach(btn => {
        btn.onclick = () => {
            const texto = btn.innerText;

            if (texto.includes("Biblioteca")) abrir("biblioteca");
            if (texto.includes("FlashCards")) abrir("flashcards");
            if (texto.includes("Estatísticas")) abrir("estatisticas");
            if (texto.includes("Simulado")) abrir("simulado");
        };
    });
}

// ===================== QUESTÕES =====================

function novaQuestao() {

    if (questoes.length === 0) {
        alert("Importe um JSON de questões primeiro!");
        return;
    }

    atual = questoes[Math.floor(Math.random() * questoes.length)];

    document.getElementById("pergunta").innerText = atual.pergunta;

    adicionarMensagem("bot", "Nova questão carregada!");
}

// ===================== RESPOSTA =====================

function responder(letra) {

    if (!atual) return;

    stats.total++;

    let certo = atual.correta.toUpperCase() === letra.toUpperCase();

    if (certo) {
        stats.acertos++;
        stats.streak++;
        adicionarMensagem("bot", "✅ Correto!");
    } else {
        stats.erros++;
        stats.streak = 0;
        adicionarMensagem("bot", "❌ Errado! Resposta correta: " + atual.correta);
    }

    stats.historico.push({
        pergunta: atual.pergunta,
        resposta: letra,
        correta: atual.correta,
        certo: certo
    });

    salvarLocal();
    atualizarUI();
}

// ===================== DICA =====================

function mostrarDica() {
    if (!atual) return;
    adicionarMensagem("bot", "💡 Dica: " + (atual.dica || "Leia com atenção os conceitos principais."));
}

// ===================== EXPLICAÇÃO =====================

function mostrarExplicacao() {
    if (!atual) return;
    adicionarMensagem("bot", "📖 " + (atual.explicacao || "Sem explicação disponível."));
}

// ===================== FAVORITOS =====================

function favoritar() {
    if (!atual) return;

    stats.favoritos.push(atual);
    salvarLocal();

    adicionarMensagem("bot", "⭐ Adicionado aos favoritos!");
}

// ===================== MENSAGENS =====================

function adicionarMensagem(tipo, texto) {

    const div = document.createElement("div");
    div.classList.add("mensagem", tipo);

    div.innerHTML = `
        <div class="icone">🤖</div>
        <div class="texto">${texto}</div>
    `;

    document.getElementById("mensagens").appendChild(div);
}

// ===================== UI =====================

function atualizarUI() {

    document.getElementById("total").innerText = stats.total;
    document.getElementById("acertos").innerText = stats.acertos;
    document.getElementById("erros").innerText = stats.erros;

    let perc = stats.total === 0 ? 0 : Math.round((stats.acertos / stats.total) * 100);

    document.getElementById("percentual").innerText = perc + "%";

    document.getElementById("streak").innerText = stats.streak;
}

// ===================== IMPORT JSON =====================

function importarJSON(e) {

    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = function(event) {

        try {
            questoes = JSON.parse(event.target.result);
            alert("Questões importadas com sucesso!");
        } catch (err) {
            alert("Erro ao ler JSON");
        }
    };
    function exportarDados() {

    const dados = {
        stats,
        questoes,
        revisaoEspacada
    };

    const blob = new Blob([JSON.stringify(dados)], { type: "application/json" });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "backup-studychat.json";

    link.click();
}

function importarDados(event) {

    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = e => {
        const dados = JSON.parse(e.target.result);

        stats = dados.stats || stats;
        questoes = dados.questoes || questoes;
        revisaoEspacada = dados.revisaoEspacada || [];

        salvarLocal();
        atualizarUI();

        alert("Dados importados com sucesso!");
    };

    reader.readAsText(file);
}

    reader.readAsText(file);
}

// ===================== MODAIS =====================

function abrir(id) {
    document.getElementById(id).style.display = "flex";
}

function fecharModais() {
    document.querySelectorAll(".modal").forEach(m => {
        m.style.display = "none";
    });
}
let tempoSimulado = 0;
let intervaloSimulado = null;
let simuladoAtivo = false;

function iniciarSimulado() {

    if (questoes.length === 0) {
        alert("Importe questões primeiro!");
        return;
    }

    simuladoAtivo = true;
    tempoSimulado = 0;

    intervaloSimulado = setInterval(() => {
        tempoSimulado++;

        let min = String(Math.floor(tempoSimulado / 60)).padStart(2, "0");
        let seg = String(tempoSimulado % 60).padStart(2, "0");

        document.getElementById("tempoSimulado").innerText = `${min}:${seg}`;

    }, 1000);

    novaQuestao();
}

function finalizarSimulado() {
    simuladoAtivo = false;
    clearInterval(intervaloSimulado);

    alert(`Simulado finalizado!\nAcertos: ${stats.acertos}\nErros: ${stats.erros}`);
}
function revisarQuestoes() {

    let erros = stats.historico.filter(q => q.certo === false);

    if (erros.length === 0) {
        alert("Nenhuma questão para revisar!");
        return;
    }

    atual = erros[Math.floor(Math.random() * erros.length)];

    document.getElementById("pergunta").innerText = atual.pergunta;

    adicionarMensagem("bot", "🔁 Revisando questão que você errou!");
}
function notificar(msg) {

    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
        new Notification("StudyChat", {
            body: msg
        });
    }
}

function pedirPermissaoNotif() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}
if (!certo) {

    stats.erros++;
    stats.streak = 0;

    // joga de volta para revisão futura
    questoes.push(atual);
}
function novaQuestao() {

    if (questoes.length === 0) {
        alert("Importe um JSON de questões primeiro!");
        return;
    }

    // prioriza questões erradas
    let pool = questoes;

    atual = pool[Math.floor(Math.random() * pool.length)];

    document.getElementById("pergunta").innerText = atual.pergunta;

    adicionarMensagem("bot", "📘 Nova questão carregada!");
}
let grafico = null;

function atualizarGrafico() {

    const ctx = document.getElementById("grafico");

    if (!ctx) return;

    if (grafico) grafico.destroy();

    grafico = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Acertos", "Erros"],
            datasets: [{
                data: [stats.acertos, stats.erros],
                backgroundColor: ["#22c55e", "#ef4444"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}
let revisaoEspacada = [];

function registrarResposta(q, certo) {

    let hoje = Date.now();

    revisaoEspacada.push({
        pergunta: q.pergunta,
        correta: q.correta,
        proximaRevisao: certo ? hoje + 86400000 : hoje + 300000 // 1 dia ou 5 min
    });

    localStorage.setItem("revisao", JSON.stringify(revisaoEspacada));
}
function carregarRevisao() {

    let dados = JSON.parse(localStorage.getItem("revisao")) || [];

    let agora = Date.now();

    let prontos = dados.filter(q => q.proximaRevisao <= agora);

    if (prontos.length > 0) {
        atual = prontos[Math.floor(Math.random() * prontos.length)];
        document.getElementById("pergunta").innerText = atual.pergunta;

        adicionarMensagem("bot", "🔁 Revisão inteligente ativada!");
    }

    function salvarBancoLocal() {

    localStorage.setItem("questoesDB", JSON.stringify(questoes));
}
    setInterval(() => {
    salvarLocal();
    salvarBancoLocal();
}, 5000);

function carregarBancoLocal() {

    let dados = localStorage.getItem("questoesDB");

    if (dados) {
        questoes = JSON.parse(dados);
    }
}
}
function calcularNivel() {

    let xp = stats.acertos * 10;

    let nivel = Math.floor(xp / 100) + 1;

    document.getElementById("nivel").innerText = "Nível " + nivel;

    let progresso = (xp % 100);

    document.getElementById("xp").style.width = progresso + "%";
}
calcularNivel();

let disciplinaAtual = "geral";

function filtrarDisciplina(nome) {

    disciplinaAtual = nome;

    let filtradas = questoes.filter(q => q.disciplina === nome);

    if (filtradas.length > 0) {
        atual = filtradas[Math.floor(Math.random() * filtradas.length)];
        document.getElementById("pergunta").innerText = atual.pergunta;
    }
}
function buscarQuestao(texto) {

    let resultado = questoes.filter(q =>
        q.pergunta.toLowerCase().includes(texto.toLowerCase())
    );

    if (resultado.length > 0) {
        atual = resultado[0];
        document.getElementById("pergunta").innerText = atual.pergunta;
    } else {
        alert("Nada encontrado");
    }
}
// ===================== PWA INSTALL =====================

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("PWA ativado"));
}
