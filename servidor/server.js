require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/frete", async (req, res) => {

    try {

        const resposta = await fetch("https://sandbox.superfrete.com/api/v0/calculator", {
            method: "POST",

            headers: {
                "Authorization": `Bearer ${process.env.SUPERFRETE_TOKEN}`,
                "User-Agent": "VS Imports - contato técnico",
                "accept": "application/json",
                "content-type": "application/json"
            },

            body: JSON.stringify({
                from: {
                    postal_code: "13905-710"
                },

                to: {
                    postal_code: req.query.cep
                },

                package: {
                    weight: 0.3,
                    height: 5,
                    width: 25,
                    length: 35
                },

                services: "1,2",

                options: {
                    own_hand: false,
                    receipt: false,
                    insurance_value: 199.99,
                    use_insurance_value: true
                }
            })
        });

        const dados = await resposta.json();

        res.status(resposta.status).json(dados);

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});