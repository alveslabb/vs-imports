const listaPedidos = document.querySelector("#lista-pedidos");


async function carregarPedidos() {

    try {

        const resposta = await fetch("https://vs-imports.onrender.com/pedidos");

        const pedidos = await resposta.json();


        listaPedidos.innerHTML = "";


        if (pedidos.length === 0) {

            listaPedidos.innerHTML = "<p>Nenhum pedido encontrado.</p>";

            return;

        }


        pedidos.forEach(function(pedido) {

            const div = document.createElement("div");

            div.classList.add("pedido");


            div.innerHTML = `

                <h2>Pedido #${pedido.id}</h2>

                <p><strong>Cliente:</strong> ${pedido.cliente}</p>

                <p><strong>CPF:</strong> ${pedido.cpf || "Não informado"}</p>

                <p><strong>E-mail:</strong> ${pedido.email || "Não informado"}</p>

                <p><strong>CEP:</strong> ${pedido.cep || "Não informado"}</p>

                <p><strong>Endereço:</strong> ${pedido.endereco || "Não informado"}</p>

                <p><strong>Número:</strong> ${pedido.numero || "Não informado"}</p>

                <p><strong>Complemento:</strong> ${pedido.complemento || "Não informado"}</p>

                <p><strong>Cidade:</strong> ${pedido.cidade || "Não informado"}</p>

                <p><strong>Estado:</strong> ${pedido.estado || "Não informado"}</p>

                <p><strong>Produto:</strong> ${pedido.produto}</p>

                <p><strong>Tamanho:</strong> ${pedido.tamanho}</p>

                <p><strong>Quantidade:</strong> ${pedido.quantidade}</p>

                <p><strong>Tipo de frete:</strong> ${pedido.tipoFrete || "Não informado"}</p>

                <p><strong>Valor do frete:</strong> R$ ${Number(pedido.frete || 0).toFixed(2).replace(".", ",")}</p>

                <p><strong>Total:</strong> R$ ${Number(pedido.total || 0).toFixed(2).replace(".", ",")}</p>

                <p class="status">

                    <strong>Status:</strong> ${pedido.status}

                </p>

            `;


            listaPedidos.appendChild(div);

        });


    } catch (erro) {

        console.log(erro);

        listaPedidos.innerHTML =
            "<p>Não foi possível carregar os pedidos.</p>";

    }

}


carregarPedidos();