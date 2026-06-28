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
