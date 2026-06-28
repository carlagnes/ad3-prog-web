const API = "http://localhost:3001/professores";

const modal = document.getElementById("modal-container");
const btnAbrir = document.getElementById("btn-abrir-modal");
const btnFechar = document.getElementById("btn-fechar");
const form = document.getElementById("form-professor");
const tabela = document.getElementById("tabela-corpo");

let editandoId = null;

// Busca os professores do servidor e monta a tabela
async function carregarProfessores() {
  const resposta = await fetch(API);
  const professores = await resposta.json();

  tabela.innerHTML = "";

  professores.forEach(function (professor) {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${professor.nome}</td>
      <td>${professor.email}</td>
      <td>
        <button class="btn-primario" onclick="abrirEdicao(${professor.id}, '${professor.nome}', '${professor.email}')">Editar</button>
        <button class="btn-primario" onclick="excluirProfessor(${professor.id})">Excluir</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

// Abre o modal preenchido para editar um professor
function abrirEdicao(id, nome, email) {
  editandoId = id;
  document.getElementById("nome").value = nome;
  document.getElementById("email").value = email;
  document.querySelector(".modal-conteudo h2").textContent = "Editar Professor";
  modal.style.display = "block";
}

// Exclui um professor pelo id
async function excluirProfessor(id) {
  await fetch(API + "/" + id, { method: "DELETE" });
  carregarProfessores();
}

// Abre modal para adicionar novo professor
btnAbrir.onclick = function () {
  editandoId = null;
  form.reset();
  document.querySelector(".modal-conteudo h2").textContent = "Novo Professor";
  modal.style.display = "block";
};

// Fecha o modal
btnFechar.onclick = function () {
  modal.style.display = "none";
};

// Fecha o modal ao clicar fora dele
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Envia o formulário (adicionar ou editar)
form.onsubmit = async function (e) {
  e.preventDefault();

  const dados = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
  };

  if (editandoId !== null) {
    await fetch(API + "/" + editandoId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  } else {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  }

  editandoId = null;
  form.reset();
  modal.style.display = "none";
  carregarProfessores();
};

// Carrega a lista ao abrir a página
carregarProfessores();
