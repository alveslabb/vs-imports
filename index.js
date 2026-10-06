const botao = document.querySelector(".adicionar-carrinho");

botao.addEventListener("click", function() {

    const produto = {
        nome: botao.dataset.nome,
        preco: Number(botao.dataset.preco),
        imagem: "imagens/miami.png"
    };

    localStorage.setItem("produtoCarrinho", JSON.stringify(produto));

    window.location.href = "carrinho.html";

});