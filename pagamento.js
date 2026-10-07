const produtoResumo = document.querySelector("#produto-pagamento");

const subtotalPagamento = document.querySelector("#subtotal-pagamento");

const fretePagamento = document.querySelector("#frete-pagamento");

const totalPagamento = document.querySelector("#total-pagamento");

const produtoSalvo = localStorage.getItem("produtoCarrinho");

const quantidadeSalva = localStorage.getItem("quantidadeCarrinho");

const freteSalvo = localStorage.getItem("freteCarrinho");

const tipoFreteSalvo = localStorage.getItem("tipoFreteCarrinho");


let produto;

let quantidade = 1;

let valorFrete = 0;

let tipoFrete = "";

let valorTotal = 0;


if (produtoSalvo) {

    produto = JSON.parse(produtoSalvo);

    quantidade = Number(quantidadeSalva) || 1;

    valorFrete = Number(freteSalvo) || 0;

    tipoFrete = tipoFreteSalvo || "";

    const subtotal = produto.preco * quantidade;

    valorTotal = subtotal + valorFrete;


    produtoResumo.innerHTML =
        '<div class="produto-resumo">' +

            '<img src="' + produto.imagem + '" alt="' + produto.nome + '">' +

            '<div>' +

                '<h3>' + produto.nome + '</h3>' +

                '<p>' +
                    quantidade + "x R$ " +
                    produto.preco.toFixed(2).replace(".", ",") +
                '</p>' +

            '</div>' +

        '</div>';


    subtotalPagamento.innerHTML =
        "R$ " + subtotal.toFixed(2).replace(".", ",");


    fretePagamento.innerHTML =
        tipoFrete + " - R$ " +
        valorFrete.toFixed(2).replace(".", ",");


    totalPagamento.innerHTML =
        "R$ " + valorTotal.toFixed(2).replace(".", ",");

}


const cepPagamento = document.querySelector("#cep-pagamento");

const endereco = document.querySelector("#endereco");

const cidade = document.querySelector("#cidade");

const estado = document.querySelector("#estado");


cepPagamento.addEventListener("blur", async function() {

    const cep = cepPagamento.value.replace(/\D/g, "");

    if (cep.length !== 8) {

        return;

    }


    try {

        const resposta = await fetch(
            "https://viacep.com.br/ws/" + cep + "/json/"
        );


        const dados = await resposta.json();


        if (dados.erro) {

            alert("CEP não encontrado.");

            return;

        }


        endereco.value = dados.logradouro;

        cidade.value = dados.localidade;

        estado.value = dados.uf;


    } catch (erro) {

        console.log(erro);

    }

});


const pix = document.querySelector("#pix");

const cartao = document.querySelector("#cartao");

const dadosPix = document.querySelector("#dados-pix");

const dadosCartao = document.querySelector("#dados-cartao");


dadosPix.style.display = "none";

dadosCartao.style.display = "none";


pix.addEventListener("change", function() {

    if (pix.checked) {

        dadosPix.style.display = "block";

        dadosCartao.style.display = "none";

    }

});


cartao.addEventListener("change", function() {

    if (cartao.checked) {

        dadosPix.style.display = "none";

        dadosCartao.style.display = "block";

    }

});


const finalizarPedido = document.querySelector("#finalizar-pedido");

const nome = document.querySelector("#nome");

const email = document.querySelector("#email");

const cpf = document.querySelector("#cpf");

const numero = document.querySelector("#numero");

const complemento = document.querySelector("#complemento");

const numeroCartao = document.querySelector("#numero-cartao");

const nomeCartao = document.querySelector("#nome-cartao");

const validadeCartao = document.querySelector("#validade-cartao");

const cvvCartao = document.querySelector("#cvv-cartao");


finalizarPedido.addEventListener("click", async function() {

    if (
        nome.value === "" ||
        email.value === "" ||
        cpf.value === "" ||
        cepPagamento.value === "" ||
        endereco.value === "" ||
        numero.value === "" ||
        cidade.value === "" ||
        estado.value === ""
    ) {

        alert("Preencha todos os dados obrigatórios.");

        return;

    }


    if (!pix.checked && !cartao.checked) {

        alert("Escolha uma forma de pagamento.");

        return;

    }


    if (cartao.checked) {

        if (
            numeroCartao.value === "" ||
            nomeCartao.value === "" ||
            validadeCartao.value === "" ||
            cvvCartao.value === ""
        ) {

            alert("Preencha todos os dados do cartão.");

            return;

        }

    }


    try {

        finalizarPedido.innerText = "CRIANDO PAGAMENTO...";

        finalizarPedido.disabled = true;


        const resposta = await fetch(
            "https://vs-imports.onrender.com/criar-cobranca",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    valor: valorTotal

                })

            }
        );


        const dados = await resposta.json();


        if (!resposta.ok) {

            alert("Erro ao criar pagamento.");

            finalizarPedido.innerText = "FINALIZAR PEDIDO";

            finalizarPedido.disabled = false;

            return;

        }


        await fetch(
            "https://vs-imports.onrender.com/pedidos",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    cliente: nome.value,

                    email: email.value,

                    cpf: cpf.value,

                    cep: cepPagamento.value,

                    endereco: endereco.value,

                    numero: numero.value,

                    complemento: complemento.value,

                    cidade: cidade.value,

                    estado: estado.value,

                    produto: produto.nome,

                    tamanho: produto.tamanho,

                    quantidade: quantidade,

                    frete: valorFrete,

                    tipoFrete: tipoFrete,

                    total: valorTotal,

                    pagamento: pix.checked ? "PIX" : "CARTÃO",

                    status: "AGUARDANDO PAGAMENTO",

                    paymentId: dados.id

                })

            }

        );


        window.location.href = dados.url;


    } catch (erro) {

        console.log(erro);

        alert("Erro ao conectar com o pagamento.");

        finalizarPedido.innerText = "FINALIZAR PEDIDO";

        finalizarPedido.disabled = false;

    }

});