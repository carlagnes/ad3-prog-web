import express from "express";
import professores from "./professores.js";
import cursos from "./cursos.js";

const router = express.Router();

router.use("/professores", professores);
router.use("/cursos", cursos);

export default router;
