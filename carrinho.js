const cep = document.querySelector("#cep");
const calcularFrete = document.querySelector("#calcular-frete");
const resultadoFrete = document.querySelector("#resultado-frete");
const frete = document.querySelector("#frete");
const total = document.querySelector("#total");
const listaCarrinho = document.querySelector("#lista-carrinho");
const subtotal = document.querySelector("#subtotal");
const finalizarCompra = document.querySelector("#finalizar-compra");

const produtoSalvo = localStorage.getItem("produtoCarrinho");

let valorProduto = 0;
let quantidadeProduto = 1;
let valorFrete = Number(localStorage.getItem("freteCarrinho")) || 0;
let tipoFrete = localStorage.getItem("tipoFreteCarrinho") || "";

if (produtoSalvo) {

    const produto = JSON.parse(produtoSalvo);

    valorProduto = Number(produto.preco) || 0;

    quantidadeProduto =
        Number(localStorage.getItem("quantidadeCarrinho")) || 1;

    listaCarrinho.innerHTML =
        '<div class="produto-carrinho">' +
            '<img src="' + produto.imagem + '" alt="' + produto.nome + '">' +
            '<div class="produto-carrinho-info">' +
                '<h3>' + produto.nome + '</h3>' +
                '<p>Tamanho: <strong>' + produto.tamanho + '</strong></p>' +
                '<p>R$ ' + valorProduto.toFixed(2).replace(".", ",") + '</p>' +
                '<div class="quantidade">' +
                    '<button id="diminuir">−</button>' +
                    '<span id="quantidade">1</span>' +
                    '<button id="aumentar">+</button>' +
                '</div>' +
                '<button id="excluir-produto">EXCLUIR PRODUTO</button>' +
            '</div>' +
        '</div>';

    const quantidade = document.querySelector("#quantidade");
    const aumentar = document.querySelector("#aumentar");
    const diminuir = document.querySelector("#diminuir");
    const excluir = document.querySelector("#excluir-produto");

    function atualizarValores() {

        quantidade.innerHTML = quantidadeProduto;

        localStorage.setItem("quantidadeCarrinho", quantidadeProduto);

        const novoSubtotal = valorProduto * quantidadeProduto;

        subtotal.innerHTML =
            "R$ " + novoSubtotal.toFixed(2).replace(".", ",");

        const novoTotal = novoSubtotal + valorFrete;

        total.innerHTML =
            "R$ " + novoTotal.toFixed(2).replace(".", ",");

        frete.innerHTML =
            "R$ " + valorFrete.toFixed(2).replace(".", ",");

    }

    aumentar.addEventListener("click", function() {

        quantidadeProduto++;
        atualizarValores();

    });

    diminuir.addEventListener("click", function() {

        if (quantidadeProduto > 1) {
            quantidadeProduto--;
            atualizarValores();
        }

    });

    excluir.addEventListener("click", function() {

        localStorage.removeItem("produtoCarrinho");
        localStorage.removeItem("quantidadeCarrinho");
        localStorage.removeItem("freteCarrinho");
        localStorage.removeItem("tipoFreteCarrinho");

        listaCarrinho.innerHTML =
            '<div class="carrinho-vazio">' +
                '<p>Seu carrinho está vazio.</p>' +
                '<a href="index.html">CONTINUAR COMPRANDO</a>' +
            '</div>';

        subtotal.innerHTML = "R$ 0,00";
        frete.innerHTML = "R$ 0,00";
        total.innerHTML = "R$ 0,00";

        valorProduto = 0;
        quantidadeProduto = 1;
        valorFrete = 0;
        tipoFrete = "";

    });

    atualizarValores();

}

calcularFrete.addEventListener("click", async function() {

    const valorCep = cep.value.replace(/\D/g, "");

    if (valorCep.length !== 8) {
        resultadoFrete.innerHTML =
            "Digite um CEP válido com 8 números.";
        return;
    }

    resultadoFrete.innerHTML = "Calculando frete...";
    calcularFrete.disabled = true;

    try {

        const resposta = await fetch(
            "https://vs-imports.onrender.com/frete?cep=" + valorCep
        );

        const dados = await resposta.json();

        console.log(
            "Resposta completa do frete:",
            JSON.stringify(dados, null, 2)
        );

        if (
            !resposta.ok ||
            !Array.isArray(dados) ||
            dados.length < 2 ||
            !dados[0].price ||
            !dados[1].price
        ) {

            resultadoFrete.innerHTML =
                "Não foi possível calcular o frete. Tente novamente mais tarde.";

            return;
        }

        resultadoFrete.innerHTML =
            '<div class="opcao-frete">' +
                '<label>' +
                    '<input type="radio" name="frete" value="' + dados[0].price + '">' +
                    '<span>PAC</span>' +
                    '<strong>R$ ' + Number(dados[0].price).toFixed(2).replace(".", ",") + '</strong>' +
                '</label>' +
            '</div>' +
            '<div class="opcao-frete">' +
                '<label>' +
                    '<input type="radio" name="frete" value="' + dados[1].price + '">' +
                    '<span>SEDEX</span>' +
                    '<strong>R$ ' + Number(dados[1].price).toFixed(2).replace(".", ",") + '</strong>' +
                '</label>' +
            '</div>';

        const opcoesFrete =
            document.querySelectorAll('input[name="frete"]');

        opcoesFrete.forEach(function(opcao) {

            opcao.addEventListener("change", function() {

                valorFrete = Number(this.value);

                tipoFrete =
                    this.parentElement.querySelector("span").innerText;

                localStorage.setItem("freteCarrinho", valorFrete);
                localStorage.setItem("tipoFreteCarrinho", tipoFrete);

                frete.innerHTML =
                    "R$ " + valorFrete.toFixed(2).replace(".", ",");

                const valorTotal =
                    (valorProduto * quantidadeProduto) + valorFrete;

                total.innerHTML =
                    "R$ " + valorTotal.toFixed(2).replace(".", ",");

            });

        });

    } catch (erro) {

        console.log("Erro ao calcular o frete:", erro);

        resultadoFrete.innerHTML =
            "Erro ao conectar para calcular o frete.";

    } finally {

        calcularFrete.disabled = false;

    }

});

finalizarCompra.addEventListener("click", function() {

    const produto = localStorage.getItem("produtoCarrinho");

    if (!produto) {
        alert("Seu carrinho está vazio!");
        return;
    }

    window.location.href = "pagamento.html";

});
