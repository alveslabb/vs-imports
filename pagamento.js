const produtoResumo = document.querySelector("#produto-pagamento");
const subtotalPagamento = document.querySelector("#subtotal-pagamento");
const fretePagamento = document.querySelector("#frete-pagamento");
const totalPagamento = document.querySelector("#total-pagamento");

const produtoSalvo = localStorage.getItem("produtoCarrinho");
const quantidadeSalva = localStorage.getItem("quantidadeCarrinho");
const freteSalvo = localStorage.getItem("freteCarrinho");


if (produtoSalvo) {

    const produto = JSON.parse(produtoSalvo);

    const quantidade = Number(quantidadeSalva) || 1;
    const valorFrete = Number(freteSalvo) || 0;

    const subtotal = produto.preco * quantidade;
    const total = subtotal + valorFrete;


    produtoResumo.innerHTML = `
        <div class="produto-resumo">

            <img src="${produto.imagem}" alt="${produto.nome}">

            <div>

                <h3>${produto.nome}</h3>

                <p>
                    ${quantidade}x R$ ${produto.preco.toFixed(2).replace(".", ",")}
                </p>

            </div>

        </div>
    `;


    subtotalPagamento.innerHTML =
        `R$ ${subtotal.toFixed(2).replace(".", ",")}`;


    fretePagamento.innerHTML =
        `R$ ${valorFrete.toFixed(2).replace(".", ",")}`;


    totalPagamento.innerHTML =
        `R$ ${total.toFixed(2).replace(".", ",")}`;

}


/* CEP */

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
            `https://viacep.com.br/ws/${cep}/json/`
        );


        const dados = await resposta.json();


        if (dados.erro) {

            alert("CEP não encontrado.");

            return;

        }


        endereco.value = dados.logradouro;
        cidade.value = dados.localidade;
        estado.value = dados.uf;

    }


    catch (erro) {

        console.log(erro);

    }

});


/* FORMA DE PAGAMENTO */

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


finalizarPedido.addEventListener("click", function() {

    if (nome.value === "" ||
        email.value === "" ||
        cpf.value === "" ||
        cepPagamento.value === "" ||
        endereco.value === "" ||
        numero.value === "" ||
        cidade.value === "" ||
        estado.value === "") {

        alert("Preencha todos os dados obrigatórios.");

        return;

    }


    if (!pix.checked && !cartao.checked) {

        alert("Escolha uma forma de pagamento.");

        return;

    }


    if (cartao.checked) {

        if (numeroCartao.value === "" ||
            nomeCartao.value === "" ||
            validadeCartao.value === "" ||
            cvvCartao.value === "") {

            alert("Preencha todos os dados do cartão.");

            return;

        }

    }


    alert("Pedido realizado com sucesso!");


});