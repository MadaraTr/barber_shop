import express from "express";
import db from "./db.js";
import { Sequelize } from "sequelize";

/*
    Agendamento model com campos em inglês (compatível com banco existente):
    campos: name, phone, service, date, time, notes
*/
const Agendamento = db.define(
    "agendamentos",
    {
        name: { type: Sequelize.STRING, allowNull: false },
        phone: { type: Sequelize.STRING, allowNull: false },
        service: { type: Sequelize.STRING, allowNull: true },
        date: { type: Sequelize.DATEONLY, allowNull: true },
        time: { type: Sequelize.TIME, allowNull: true },
        notes: { type: Sequelize.TEXT, allowNull: true },
    },
    { timestamps: true }
);

Agendamento.sync({ force: false });

/*
    Router para gerenciar agendamentos.
    Aceita campos em português ou inglês no body e converte para inglês
    Endpoints:
     - GET /agendamentos        -> retorna todos os agendamentos
     - POST /agendamentos       -> cria novo agendamento
     - PATCH /agendamentos/:id  -> atualiza agendamento
     - DELETE /agendamentos/:id -> deleta agendamento
*/
const router = express.Router();

// Função helper para normalizar campos (aceita português ou inglês)
function normalizeFields(body) {
    return {
        name: body.name || body.nome,
        phone: body.phone || body.telefone,
        service: body.service || body.servico,
        date: body.date || body.data,
        time: body.time || body.horario,
        notes: body.notes || body.observacoes
    };
}

// Listar todos os agendamentos
router.get("/agendamentos", async (req, res) => {
    try {
        const items = await Agendamento.findAll({
            order: [['date', 'DESC'], ['time', 'DESC']]
        });
        return res.status(200).json(items);
    } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        return res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
});

// Criar novo agendamento
router.post("/", async (req, res) => {
    try {
        const fields = normalizeFields(req.body || {});

        if (!fields.name || !fields.phone) {
            return res.status(400).json({ error: "Nome e telefone são obrigatórios" });
        }

        const ag = await Agendamento.create({
            name: fields.name.trim(),
            phone: fields.phone.trim(),
            service: fields.service ? fields.service.trim() : null,
            date: fields.date || null,
            time: fields.time || null,
            notes: fields.notes || null,
        });

        return res.status(201).json({ success: true, message: "Agendamento criado com sucesso", agendamento: ag });
    } catch (err) {
        console.error("Erro ao criar agendamento:", err);
        return res.status(500).json({ error: "Erro ao criar agendamento" });
    }
});

// Atualizar agendamento
router.patch("/:id", async (req, res) => {
    try {
        const fields = normalizeFields(req.body || {});
        
        const [updated] = await Agendamento.update(
            {
                name: fields.name,
                phone: fields.phone,
                service: fields.service,
                date: fields.date,
                time: fields.time,
                notes: fields.notes,
            },
            { where: { id: req.params.id } }
        );

        if (!updated) {
            return res.status(404).json({ error: "Agendamento não encontrado" });
        }
        
        return res.status(200).json({ success: true, message: "Agendamento atualizado com sucesso" });
    } catch (err) {
        console.error("Erro ao atualizar agendamento:", err);
        return res.status(500).json({ error: "Erro ao atualizar agendamento" });
    }
});

// Deletar agendamento
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Agendamento.destroy({ where: { id: req.params.id } });
        
        if (!deleted) {
            return res.status(404).json({ error: "Agendamento não encontrado" });
        }
        
        return res.status(200).json({ success: true, message: "Agendamento deletado com sucesso" });
    } catch (err) {
        console.error("Erro ao deletar agendamento:", err);
        return res.status(500).json({ error: "Erro ao deletar agendamento" });
    }
});

export default Agendamento;
export { router as agendamentosRouter };