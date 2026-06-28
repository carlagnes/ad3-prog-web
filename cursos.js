const API = "http://localhost:3001/cursos";
const API_PROFESSORES = "http://localhost:3001/professores";

// Selecionar os elementos do DOM
const modal = document.getElementById("modal-container");
const btnAbrir = document.getElementById("btn-abrir-modal");
const btnFechar = document.getElementById("btn-fechar");
const form = document.getElementById("form-curso");
const tabela = document.getElementById("tabela-corpo");

let editandoId = null;

async function carregarProfessores() {
  const resposta = await fetch(API_PROFESSORES);
  const professores = await resposta.json();

  const select = document.getElementById("coordenador");

  // Mantém apenas a primeira opção
  select.innerHTML = '<option value="">Selecione um professor</option>';

  professores.forEach((professor) => {
    const option = document.createElement("option");
    option.value = professor.nome;
    option.textContent = professor.nome;
    select.appendChild(option);
  });
}

async function carregarCursos() {
  const resposta = await fetch(API);
  const cursos = await resposta.json();

  tabela.innerHTML = "";

  cursos.forEach(function (curso) {
    const linha = document.createElement("tr");
    linha.innerHTML = `
        <td>${curso.nome}</td>
        <td>${curso.sigla}</td>
        <td>${curso.descricao}</td>
        <td>${curso.coordenador}</td>
        <td>
        <button class="btn-primario" onclick="abrirEdicao(${curso.id}, '${curso.nome}', '${curso.sigla}', '${curso.descricao}', '${curso.coordenador}')">Editar</button>
        <button class="btn-primario" onclick="excluirCurso(${curso.id})">Excluir</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

function abrirEdicao(id, nome, sigla, descricao, coordenador) {
  editandoId = id;

  document.getElementById("nome-curso").value = nome;
  document.getElementById("sigla").value = sigla;
  document.getElementById("descricao").value = descricao;
  document.getElementById("coordenador").value = coordenador;

  modal.style.display = "block";
}

async function excluirCurso(id) {
  await fetch(API + "/" + id, { method: "DELETE" });
  carregarCursos();
}

// Função para abrir o modal
btnAbrir.onclick = async function () {
  editandoId = null;
  form.reset();

  await carregarProfessores();

  document.querySelector(".modal-conteudo h2").textContent = "Novo Curso";
  modal.style.display = "block";
};

// Função para fechar o modal no botão 'X'
btnFechar.onclick = function () {
  modal.style.display = "none";
};

// Fechar o modal se o usuário clicar fora da caixa branca
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Lógica para salvar o curso e adicionar na tabela
form.onsubmit = async function (evento) {
  evento.preventDefault(); // Impede a página de recarregar

  const curso = {
    nome: document.getElementById("nome-curso").value,
    sigla: document.getElementById("sigla").value,
    descricao: document.getElementById("descricao").value,
    coordenador: document.getElementById("coordenador").value,
  };

  if (editandoId !== null) {
    await fetch(API + "/" + editandoId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(curso),
    });
  } else {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(curso),
    });
  }

  editandoId = null;
  form.reset();
  modal.style.display = "none";
  carregarCursos();
};

// Carrega a lista de cursos ao abrir a página
carregarCursos();
carregarProfessores();
