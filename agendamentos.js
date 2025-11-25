import express from "express";
import db from "./db.js";
import { Sequelize } from "sequelize";

/*
    Agendamento model alinhado ao HTML:
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
    Router simples para receber agendamentos do frontend.
    Endpoints:
     - POST /agendamentos       -> payload: { name, phone, service, date, time, notes }
*/
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, phone, service, date, time, notes } = req.body || {};

        if (!name || !phone) {
            return res.status(400).json({ error: "name and phone are required" });
        }

        const ag = await Agendamento.create({
            name: name.trim(),
            phone: phone.trim(),
            service: service ? service.trim() : null,
            date: date || null,
            time: time || null,
            notes: notes || null,
        });

        return res.status(201).json({ success: true, agendamento: ag });
    } catch (err) {
        console.error("Erro ao criar agendamento:", err);
        return res.status(500).json({ error: "internal_server_error" });
    }
});

export default Agendamento;
export { router as agendamentosRouter };
