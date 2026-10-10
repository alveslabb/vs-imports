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

    const subtotal = Number(produto.preco) * quantidade;
    valorTotal = subtotal + valorFrete;

    produtoResumo.innerHTML =
        '<div class="produto-resumo">' +
            '<img src="' + produto.imagem + '" alt="' + produto.nome + '">' +
            '<div>' +
                '<h3>' + produto.nome + '</h3>' +
                '<p>' + quantidade + 'x R$ ' +
                Number(produto.preco).toFixed(2).replace(".", ",") + '</p>' +
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
const dadosPix = document.querySelector("#dados-pix");

dadosPix.style.display = "none";

pix.addEventListener("change", function() {
    if (pix.checked) {
        dadosPix.style.display = "block";
    }
});

const finalizarPedido = document.querySelector("#finalizar-pedido");
const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const cpf = document.querySelector("#cpf");
const numero = document.querySelector("#numero");
const complemento = document.querySelector("#complemento");

finalizarPedido.addEventListener("click", async function() {
    if (!produto) {
        alert("Seu carrinho está vazio.");
        return;
    }

    if (
        nome.value.trim() === "" ||
        email.value.trim() === "" ||
        cpf.value.trim() === "" ||
        cepPagamento.value.trim() === "" ||
        endereco.value.trim() === "" ||
        numero.value.trim() === "" ||
        cidade.value.trim() === "" ||
        estado.value.trim() === ""
    ) {
        alert("Preencha todos os dados obrigatórios.");
        return;
    }

    if (!pix.checked) {
        alert("Selecione PIX como forma de pagamento.");
        return;
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

        if (!resposta.ok || !dados.url) {
            alert("Não foi possível criar o pagamento. Tente novamente.");
            finalizarPedido.innerText = "FINALIZAR PEDIDO";
            finalizarPedido.disabled = false;
            return;
        }

        const respostaPedido = await fetch(
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
                    pagamento: "PIX",
                    status: "AGUARDANDO PAGAMENTO",
                    paymentId: dados.id
                })
            }
        );

        if (!respostaPedido.ok) {
            alert("O pagamento foi criado, mas não foi possível registrar o pedido. Entre em contato com a loja.");
            finalizarPedido.innerText = "FINALIZAR PEDIDO";
            finalizarPedido.disabled = false;
            return;
        }

        window.location.href = dados.url;

    } catch (erro) {
        console.log("Erro ao finalizar pedido:", erro);
        alert("Erro ao conectar com o pagamento.");
        finalizarPedido.innerText = "FINALIZAR PEDIDO";
        finalizarPedido.disabled = false;
    }
});
