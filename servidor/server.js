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


app.get("/teste-asaas", async (req, res) => {

    try {

        const resposta = await fetch("https://api.asaas.com/v3/customers?limit=1", {

            headers: {
                "access_token": process.env.ASAAS_API_KEY,
                "accept": "application/json"
            }

        });

        const dados = await resposta.json();

        res.status(resposta.status).json(dados);

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

});


app.post("/criar-cobranca", async (req, res) => {

    try {

        const valor = Number(req.body.valor);

        if (!valor || valor <= 0) {

            return res.status(400).json({
                erro: "Valor inválido."
            });

        }


        const resposta = await fetch("https://api.asaas.com/v3/paymentLinks", {

            method: "POST",

            headers: {
                "access_token": process.env.ASAAS_API_KEY,
                "accept": "application/json",
                "content-type": "application/json"
            },

            body: JSON.stringify({

                name: "Pedido VS Imports",

                description: "Compra na VS Imports",

                value: valor,

                billingType: "PIX",

                chargeType: "DETACHED",

                dueDateLimitDays: 1

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