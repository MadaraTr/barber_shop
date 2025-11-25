import { Sequelize } from "sequelize"; 

const db = new Sequelize( 
    "barber_shop_0cq7",
    "barber_shop_0cq7_user",
    "6AZAeU1tXMZBKvWfhtkYuSH9ny7MoQTT",
    {
        host: "dpg-d4j2urf5r7bs73f3nrsg-a.oregon-postgres.render.com",
        dialect: "postgres",
        port: "5432",
        dialectOptions: {
            ssl:{ require: true,  rejectUnauthorized: false }
        }
        
    }
);

db.authenticate().then((function() {
    console.log("Conectado ao banco de dados com sucesso!" );
})).catch(function(erro) {
    console.log("Erro ao conectar ao banco de dados: " + erro );
});

export default db;