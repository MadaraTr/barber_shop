import express from "express";
import path from "path";
import Agendamento from "./agendamentos.js"; // Sequelize model (assumed)

const app = express();
app.use(express.json());

const __dirname = path.resolve();
const publicDir = path.join(__dirname, "public");

// Serve static assets (expects the HTML you provided at public/index.html)
app.use(express.static(publicDir));

// Helper to normalize form fields from the HTML (miniBooking and contactForm)
function normalizeBody(body) {
    return {
        nome: body.nome || body.name || body.mname || null,
        telefone: body.telefone || body.phone || body.mphone || null,
        servico: body.servico || body.service || null,
        data: body.data || body.date || body.mdate || null,
        horario: body.horario || body.time || null,
        observacoes: body.notes || body.observacoes || null,
    };
}

// API: list all agendamentos
app.get("/agendamentos", async (req, res) => {
    try {
        const items = await Agendamento.findAll();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar os agendamentos", details: err.message });
    }
});

// API: create agendamento (used by contactForm and miniBooking)
app.post("/agendamentos", async (req, res) => {
    try {
        const body = normalizeBody(req.body);
        if (!body.nome || !body.telefone) {
            return res.status(400).json({ error: "Nome e telefone são obrigatórios" });
        }

        const created = await Agendamento.create({
            nome: body.nome,
            telefone: body.telefone,
            servico: body.servico,
            data: body.data,
            horario: body.horario,
            observacoes: body.observacoes,
        });

        res.status(201).json({ message: "Agendamento cadastrado com sucesso", agendamento: created });
    } catch (err) {
        res.status(500).json({ error: "Erro ao cadastrar o agendamento", details: err.message });
    }
});

// API: update agendamento by id
app.patch("/agendamentos/:id", async (req, res) => {
    try {
        const body = normalizeBody(req.body);
        const [updated] = await Agendamento.update(
            {
                nome: body.nome,
                telefone: body.telefone,
                servico: body.servico,
                data: body.data,
                horario: body.horario,
                observacoes: body.observacoes,
            },
            { where: { id: req.params.id } }
        );

        if (!updated) return res.status(404).json({ error: "Agendamento não encontrado" });
        res.json({ message: "Agendamento atualizado com sucesso" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar o agendamento", details: err.message });
    }
});

// API: delete agendamento by id
app.delete("/agendamentos/:id", async (req, res) => {
    try {
        const deleted = await Agendamento.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ error: "Agendamento não encontrado" });
        res.json({ message: "Agendamento deletado com sucesso" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar o agendamento", details: err.message });
    }
});

// SPA fallback: serve index.html for non-API GET requests so client-side can route/search anchors
app.get(/^(?!\/agendamentos).*/, (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});