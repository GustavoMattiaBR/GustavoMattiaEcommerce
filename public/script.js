const produtoForm = document.getElementById("produtoForm");

if (produtoForm) {

    produtoForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const mensagem = document.getElementById("mensagem");

        const formData = new FormData(produtoForm);

        mensagem.textContent = "Cadastrando produto...";

        try {

            const resposta = await fetch("/api/produtos", {
                method: "POST",
                body: formData
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro || "Erro ao cadastrar produto.");
            }

            mensagem.textContent =
                "Produto cadastrado com sucesso!";

            produtoForm.reset();

            console.log("Produto:", dados.produto);

        } catch (error) {

            console.error(error);

            mensagem.textContent =
                error.message;
        }
    });
}

const listaProdutos = document.getElementById("listaProdutos");

if (listaProdutos) {
    carregarProdutos();
}

async function carregarProdutos(filtros = "") {
    try {
        const resposta = await fetch(`/api/produtos${filtros}`);
        const produtos = await resposta.json();

        listaProdutos.innerHTML = "";

        if (produtos.length === 0) {
            listaProdutos.innerHTML = "<p>Nenhum produto encontrado.</p>";
            return;
        }

        produtos.forEach(produto => {

            const card =
                document.createElement("div");

            card.className = "produto-card";

            card.innerHTML = `

                ${
                    produto.imagemUrl
                    ? `<img src="${produto.imagemUrl}"
                             alt="${produto.modelo}">`
                    : ""
                }

                <div class="produto-info">

                    <div class="produto-marca">
                        ${produto.marca}
                    </div>

                    <h3>
                        ${produto.modelo}
                    </h3>

                    <div class="produto-preco">
                        R$ ${Number(produto.preco)
                            .toFixed(2)
                            .replace(".", ",")}
                    </div>

                    <div class="produto-estoque">
                        Estoque: ${produto.quantidade}
                    </div>

                    <div class="produto-acoes">
                        <button onclick="fazerPedido('${produto.id}')">
                            Fazer pedido
                        </button>

                        <button onclick="editarProduto('${produto.id}')">
                            Editar
                        </button>

                        <button onclick="excluirProduto('${produto.id}')">
                            Excluir
                        </button>
                    </div>

                </div>
            `;

            listaProdutos.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        listaProdutos.innerHTML =
            "<p>Erro ao carregar produtos.</p>";
    }
}

async function excluirProduto(id) {

    const confirmar =
        confirm("Deseja realmente excluir este produto?");

    if (!confirmar) {
        return;
    }

    try {

        const resposta =
            await fetch(`/api/produtos/${id}`, {
                method: "DELETE"
            });

        const dados =
            await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro);
        }

        alert("Produto excluído com sucesso!");

        carregarProdutos();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

async function editarProduto(id) {

    try {

        const resposta =
            await fetch("/api/produtos");

        const produtos =
            await resposta.json();

        const produto =
            produtos.find(p => p.id === id);

        if (!produto) {
            alert("Produto não encontrado.");
            return;
        }

        const marca =
            prompt("Marca:", produto.marca);

        if (marca === null) return;

        const modelo =
            prompt("Modelo:", produto.modelo);

        if (modelo === null) return;

        const preco =
            prompt("Preço:", produto.preco);

        if (preco === null) return;

        const quantidade =
            prompt("Quantidade:", produto.quantidade);

        if (quantidade === null) return;

        const descricao =
            prompt("Descrição:", produto.descricao);

        if (descricao === null) return;

        const respostaEdicao =
            await fetch(`/api/produtos/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    marca,
                    modelo,
                    preco,
                    quantidade,
                    descricao
                })
            });

        const dados =
            await respostaEdicao.json();

        if (!respostaEdicao.ok) {
            throw new Error(dados.erro);
        }

        alert("Produto atualizado com sucesso!");

        carregarProdutos();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

function buscarProdutos() {
    const marca = document.getElementById("filtroMarca").value;
    const modelo = document.getElementById("filtroModelo").value;
    const precoMin = document.getElementById("filtroPrecoMin").value;
    const precoMax = document.getElementById("filtroPrecoMax").value;

    const parametros = new URLSearchParams();

    if (marca) parametros.append("marca", marca);
    if (modelo) parametros.append("modelo", modelo);
    if (precoMin) parametros.append("precoMin", precoMin);
    if (precoMax) parametros.append("precoMax", precoMax);

    const query = parametros.toString();

    carregarProdutos(query ? `?${query}` : "");
}

function limparFiltros() {
    document.getElementById("filtroMarca").value = "";
    document.getElementById("filtroModelo").value = "";
    document.getElementById("filtroPrecoMin").value = "";
    document.getElementById("filtroPrecoMax").value = "";

    carregarProdutos();
}

const clienteForm = document.getElementById("clienteForm");

if (clienteForm) {
    carregarClientes();

    clienteForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const mensagem = document.getElementById("mensagemCliente");

        const cliente = {
            nome: document.getElementById("nome").value,
            cpf: document.getElementById("cpf").value,
            email: document.getElementById("email").value,
            telefone: document.getElementById("telefone").value,
            endereco: document.getElementById("endereco").value
        };

        try {
            const resposta = await fetch("/api/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cliente)
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro);
            }

            mensagem.textContent = "Cliente cadastrado com sucesso!";

            clienteForm.reset();

            carregarClientes();

        } catch (error) {
            console.error(error);
            mensagem.textContent = error.message;
        }
    });
}

async function carregarClientes() {
    const lista = document.getElementById("listaClientes");

    if (!lista) return;

    try {
        const resposta = await fetch("/api/clientes");

        const clientes = await resposta.json();

        lista.innerHTML = "";

        if (clientes.length === 0) {
            lista.innerHTML = "<p>Nenhum cliente cadastrado.</p>";
            return;
        }

        clientes.forEach(cliente => {

            const card = document.createElement("div");

            card.className = "cliente-card";

            card.innerHTML = `
                <h3>${cliente.nome}</h3>

                <p><strong>CPF:</strong> ${cliente.cpf || "-"}</p>
                <p><strong>E-mail:</strong> ${cliente.email}</p>
                <p><strong>Telefone:</strong> ${cliente.telefone}</p>
                <p><strong>Endereço:</strong> ${cliente.endereco || "-"}</p>

                <div class="produto-acoes">
                    <button onclick="editarCliente('${cliente.id}')">
                        Editar
                    </button>

                    <button onclick="excluirCliente('${cliente.id}')">
                        Excluir
                    </button>
                </div>
            `;

            lista.appendChild(card);
        });

    } catch (error) {
        console.error(error);

        lista.innerHTML = "<p>Erro ao carregar clientes.</p>";
    }
}

async function editarCliente(id) {

    try {

        const resposta = await fetch("/api/clientes");

        const clientes = await resposta.json();

        const cliente = clientes.find(c => c.id === id);

        if (!cliente) {
            alert("Cliente não encontrado.");
            return;
        }

        const nome = prompt("Nome:", cliente.nome);
        if (nome === null) return;

        const cpf = prompt("CPF:", cliente.cpf);
        if (cpf === null) return;

        const email = prompt("E-mail:", cliente.email);
        if (email === null) return;

        const telefone = prompt("Telefone:", cliente.telefone);
        if (telefone === null) return;

        const endereco = prompt("Endereço:", cliente.endereco);
        if (endereco === null) return;

        const respostaEdicao = await fetch(
            `/api/clientes/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    nome,
                    cpf,
                    email,
                    telefone,
                    endereco
                })
            }
        );

        const dados = await respostaEdicao.json();

        if (!respostaEdicao.ok) {
            throw new Error(dados.erro);
        }

        alert("Cliente atualizado com sucesso!");

        carregarClientes();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

async function excluirCliente(id) {

    const confirmar = confirm(
        "Deseja realmente excluir este cliente?"
    );

    if (!confirmar) return;

    try {

        const resposta = await fetch(
            `/api/clientes/${id}`,
            {
                method: "DELETE"
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro);
        }

        alert("Cliente excluído com sucesso!");

        carregarClientes();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}

async function fazerPedido(id) {

    try {

        const respostaProdutos = await fetch("/api/produtos");

        const produtos = await respostaProdutos.json();

        const produto = produtos.find(p => p.id === id);

        if (!produto) {
            alert("Produto não encontrado.");
            return;
        }

        if (produto.quantidade <= 0) {
            alert("Produto sem estoque.");
            return;
        }

        const cliente = prompt("Nome do cliente:");

        if (!cliente) return;

        const quantidade = prompt(
            `Quantidade de "${produto.modelo}" disponível: ${produto.quantidade}`,
            "1"
        );

        if (!quantidade) return;

        const qtd = Number(quantidade);

        if (
            !Number.isInteger(qtd) ||
            qtd <= 0 ||
            qtd > produto.quantidade
        ) {
            alert("Quantidade inválida.");
            return;
        }

        const pagamento = prompt(
            "Forma de pagamento:\n1 - Pix\n2 - Cartão\n3 - Dinheiro"
        );

        if (!pagamento) return;

        const entrega = prompt(
            "Forma de entrega:\n1 - Retirada na loja\n2 - Entrega"
        );

        if (!entrega) return;

        const formasPagamento = {
            "1": "Pix",
            "2": "Cartão",
            "3": "Dinheiro"
        };

        const formasEntrega = {
            "1": "Retirada na loja",
            "2": "Entrega"
        };

        if (!formasPagamento[pagamento]) {
            alert("Forma de pagamento inválida.");
            return;
        }

        if (!formasEntrega[entrega]) {
            alert("Forma de entrega inválida.");
            return;
        }

        const valorTotal = Number(produto.preco) * qtd;

        const respostaPedido = await fetch("/api/pedidos", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                cliente,
                produtoId: produto.id,
                produto: `${produto.marca} ${produto.modelo}`,
                quantidade: qtd,
                valor: valorTotal,
                pagamento: formasPagamento[pagamento],
                entrega: formasEntrega[entrega]
            })
        });

        const dados = await respostaPedido.json();

        if (!respostaPedido.ok) {
            throw new Error(dados.erro);
        }

        alert(
            `Pedido realizado com sucesso!\n\n` +
            `Produto: ${produto.modelo}\n` +
            `Quantidade: ${qtd}\n` +
            `Total: R$ ${valorTotal.toFixed(2).replace(".", ",")}`
        );

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}
const listaPedidos = document.getElementById("listaPedidos");

if (listaPedidos) {
    carregarPedidos();
}

async function carregarPedidos() {

    try {

        const resposta = await fetch("/api/pedidos");

        const pedidos = await resposta.json();

        listaPedidos.innerHTML = "";

        if (pedidos.length === 0) {
            listaPedidos.innerHTML = "<p>Nenhum pedido realizado.</p>";
            return;
        }

        pedidos.reverse();

        pedidos.forEach(pedido => {

            const card = document.createElement("div");

            card.className = "cliente-card";

            card.innerHTML = `
                <h3>${pedido.produto}</h3>

                <p>
                    <strong>Cliente:</strong>
                    ${pedido.cliente}
                </p>

                <p>
                    <strong>Quantidade:</strong>
                    ${pedido.quantidade}
                </p>

                <p>
                    <strong>Total:</strong>
                    R$ ${Number(pedido.valor)
                        .toFixed(2)
                        .replace(".", ",")}
                </p>

                <p>
                    <strong>Pagamento:</strong>
                    ${pedido.pagamento}
                </p>

                <p>
                    <strong>Entrega:</strong>
                    ${pedido.entrega}
                </p>

                <p>
                    <strong>Data:</strong>
                    ${pedido.data}
                </p>
            `;

            listaPedidos.appendChild(card);
        });

    } catch (error) {

        console.error(error);

        listaPedidos.innerHTML =
            "<p>Erro ao carregar histórico.</p>";
    }
}