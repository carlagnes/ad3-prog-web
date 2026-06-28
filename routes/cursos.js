import express from "express";
import { readFile, writeFile } from "../utils/file.js";

const router = express.Router();

const readCursos = () => {
  return readFile("public/cursos.json");
};

const writeCursos = (cursos) => {
  writeFile("public/cursos.json", cursos);
};

router.get("/", (req, res) => {
  const getCursos = readCursos();
  res.json(getCursos ?? []);
});

router.get("/:id", (req, res) => {
  const cursos = readCursos();
  const id = parseInt(req.params.id);

  const curso = cursos.find((c) => c.id === id);
  if (curso) {
    res.json(curso);
  } else {
    res.status(404).json({ message: "Curso não encontrado" });
  }
});

router.post("/", (req, res) => {
  const cursos = readCursos();
  const professores = readFile("public/professores.json");
  const coordenadorExist = professores.some(
    (p) => p.nome === req.body.coordenador,
  );

  if (!coordenadorExist) {
    return res.status(400).json({ message: "Coordenador não encontrado" });
  }

  const novoCurso = {
    id: cursos.length > 0 ? Math.max(...cursos.map((c) => c.id)) + 1 : 1,
    nome: req.body.nome,
    sigla: req.body.sigla,
    descricao: req.body.descricao,
    coordenador: req.body.coordenador,
  };

  cursos.push(novoCurso);

  writeCursos(cursos);

  res.status(201).json(novoCurso);
});

router.delete("/:id", (req, res) => {
  const cursos = readCursos();
  const id = parseInt(req.params.id);

  const index = cursos.findIndex((c) => c.id === id);
  if (index !== -1) {
    const deletedCurso = cursos.splice(index, 1)[0];
    writeCursos(cursos);
    res.json(deletedCurso);
  } else {
    res.status(404).json({ message: "Curso não encontrado" });
  }
});

router.put("/:id", (req, res) => {
  const cursos = readCursos();
  const professores = readFile("public/professores.json");
  const coordenadorExist = professores.some(
    (p) => p.nome === req.body.coordenador,
  );

  if (!coordenadorExist) {
    return res.status(400).json({ message: "Coordenador não encontrado" });
  }

  const id = parseInt(req.params.id);

  const index = cursos.findIndex((c) => c.id === id);
  if (index !== -1) {
    cursos[index] = { ...cursos[index], ...req.body };
    writeCursos(cursos);
    res.json(cursos[index]);
  } else {
    res.status(404).json({ message: "Curso não encontrado" });
  }
});

export default router;
