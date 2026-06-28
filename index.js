import express from "express";
import cors from "cors";
import fs from "fs";
import routes from "./routes/index.js";

const port = 3001;
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/sobre", (req, res) => {
  res.send("Página sobre");
});

app.use("/", routes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
