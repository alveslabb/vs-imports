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