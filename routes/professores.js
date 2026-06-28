import express from "express";
import { readFile, writeFile } from "../utils/file.js";

const router = express.Router();

const readProfessores = () => {
  return readFile("public/professores.json");
};

const writeProfessores = (professores) => {
  writeFile("public/professores.json", professores);
};

router.get("/", (req, res) => {
  const getProfessores = readProfessores();
  res.json(getProfessores);
});

router.get("/:id", (req, res) => {
  const professores = readProfessores();
  const id = parseInt(req.params.id);

  const professor = professores.find((p) => p.id === id);
  if (professor) {
    res.json(professor);
  } else {
    res.status(404).json({ message: "Professor não encontrado" });
  }
});

router.post("/", (req, res) => {
  const professores = readProfessores();

  console.log(req.body);

  const novoProfessor = {
    id:
      professores.length > 0
        ? Math.max(...professores.map((p) => p.id)) + 1
        : 1,
    nome: req.body.nome,
    email: req.body.email,
  };

  professores.push(novoProfessor);

  writeProfessores(professores);

  res.status(201).json(novoProfessor);
});

router.delete("/:id", (req, res) => {
  const professores = readProfessores();
  const id = parseInt(req.params.id);

  const index = professores.findIndex((p) => p.id === id);
  if (index !== -1) {
    const deletedProfessor = professores.splice(index, 1)[0];
    writeProfessores(professores);
    res.json(deletedProfessor);
  } else {
    res.status(404).json({ message: "Professor não encontrado" });
  }
});

router.put("/:id", (req, res) => {
  const professores = readProfessores();
  const id = parseInt(req.params.id);

  const index = professores.findIndex((p) => p.id === id);
  if (index !== -1) {
    professores[index] = { ...professores[index], ...req.body };
    writeProfessores(professores);
    res.json(professores[index]);
  } else {
    res.status(404).json({ message: "Professor não encontrado" });
  }
});

export default router;
