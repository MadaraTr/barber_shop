import express from "express";
import path from "path";
import { agendamentosRouter } from "./agendamentos.js";

const app = express();
app.use(express.json());

const __dirname = path.resolve();
const publicDir = path.join(__dirname, "public");

// Serve static assets (HTML, CSS, JS)
app.use(express.static(publicDir));

// API Routes - usar o router de agendamentos
app.use("/agendamentos", agendamentosRouter);

// SPA fallback: serve index.html for non-API GET requests
app.get(/^(?!\/agendamentos).*/, (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});