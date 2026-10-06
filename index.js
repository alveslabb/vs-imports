console.log("index.js funcionando");

const produtos = document.querySelectorAll(".produto");

produtos.forEach(function(produto) {

    const botoesTamanho = produto.querySelectorAll(".tamanho");
    const botaoCarrinho = produto.querySelector(".adicionar-carrinho");

    let tamanhoSelecionado = "";

    botoesTamanho.forEach(function(botao) {

        botao.addEventListener("click", function() {

            botoesTamanho.forEach(function(outroBotao) {

                outroBotao.classList.remove("selecionado");

            });

            botao.classList.add("selecionado");

            tamanhoSelecionado = botao.dataset.tamanho;

        });

    });


    botaoCarrinho.addEventListener("click", function() {

        if (tamanhoSelecionado === "") {

            alert("Selecione um tamanho.");

            return;

        }


        const produtoCarrinho = {

            nome: botaoCarrinho.dataset.nome,

            preco: Number(botaoCarrinho.dataset.preco),

            tamanho: tamanhoSelecionado,

            imagem: produto.querySelector(".produto-img img").src

        };


        localStorage.setItem(
            "produtoCarrinho",
            JSON.stringify(produtoCarrinho)
        );

        localStorage.setItem(
            "quantidadeCarrinho",
            "1"
        );

        localStorage.removeItem("freteCarrinho");


        window.location.href = "carrinho.html";

    });

});