const { TableClient } = require("@azure/data-tables");

const tableServiceUrl = process.env.AZURE_TABLE_SAS_URL;

const produtosTable = new TableClient(
    tableServiceUrl,
    "GustavoMattiaProdutos"
);

async function criarTabelaProdutos() {
    try {
        await produtosTable.createTable();
        console.log('Tabela "GustavoMattiaProdutos" criada com sucesso!');
    } catch (error) {
        if (error.statusCode === 409) {
            console.log('Tabela "GustavoMattiaProdutos" já existe.');
        } else {
            throw error;
        }
    }
}

async function adicionarProduto(produto) {

    const entity = {
        partitionKey: "Produtos",
        rowKey: Date.now().toString(),

        marca: produto.marca,
        modelo: produto.modelo,
        preco: Number(produto.preco),
        quantidade: Number(produto.quantidade),
        imagemUrl: produto.imagemUrl || "",
        descricao: produto.descricao || ""
    };

    await produtosTable.createEntity(entity);

    return entity;
}

async function listarProdutos() {

    const produtos = [];

    for await (const entity of produtosTable.listEntities()) {

        produtos.push({
            id: entity.rowKey,
            marca: entity.marca,
            modelo: entity.modelo,
            preco: entity.preco,
            quantidade: entity.quantidade,
            imagemUrl: entity.imagemUrl,
            descricao: entity.descricao
        });
    }

    return produtos;
}

async function editarProduto(id, dados) {

    const produto = {
        partitionKey: "Produtos",
        rowKey: id,

        marca: dados.marca,
        modelo: dados.modelo,
        preco: Number(dados.preco),
        quantidade: Number(dados.quantidade),
        imagemUrl: dados.imagemUrl || "",
        descricao: dados.descricao || ""
    };

    await produtosTable.updateEntity(
        produto,
        "Merge"
    );

    return produto;
}


async function excluirProduto(id) {

    await produtosTable.deleteEntity(
        "Produtos",
        id
    );
}

const clientesTable = new TableClient(
    tableServiceUrl,
    "GustavoMattiaClientes"
);

async function criarTabelaClientes() {
    try {
        await clientesTable.createTable();
        console.log('Tabela "GustavoMattiaClientes" criada com sucesso!');
    } catch (error) {
        if (error.statusCode === 409) {
            console.log('Tabela "GustavoMattiaClientes" já existe.');
        } else {
            throw error;
        }
    }
}

async function adicionarCliente(cliente) {
    const entity = {
        partitionKey: "Clientes",
        rowKey: Date.now().toString(),
        nome: cliente.nome,
        cpf: cliente.cpf,
        email: cliente.email,
        telefone: cliente.telefone,
        endereco: cliente.endereco
    };

    await clientesTable.createEntity(entity);

    return entity;
}

async function listarClientes() {
    const clientes = [];

    for await (const entity of clientesTable.listEntities()) {
        clientes.push({
            id: entity.rowKey,
            nome: entity.nome,
            cpf: entity.cpf,
            email: entity.email,
            telefone: entity.telefone,
            endereco: entity.endereco
        });
    }

    return clientes;
}

async function editarCliente(id, dados) {
    const cliente = {
        partitionKey: "Clientes",
        rowKey: id,
        nome: dados.nome,
        cpf: dados.cpf,
        email: dados.email,
        telefone: dados.telefone,
        endereco: dados.endereco
    };

    await clientesTable.updateEntity(cliente, "Merge");

    return cliente;
}

async function excluirCliente(id) {
    await clientesTable.deleteEntity(
        "Clientes",
        id
    );
}

const pedidosTable = new TableClient(
    tableServiceUrl,
    "GustavoMattiaPedidos"
);

async function criarTabelaPedidos() {
    try {
        await pedidosTable.createTable();
        console.log('Tabela "GustavoMattiaPedidos" criada com sucesso!');
    } catch (error) {
        if (error.statusCode === 409) {
            console.log('Tabela "GustavoMattiaPedidos" já existe.');
        } else {
            throw error;
        }
    }
}

async function adicionarPedido(pedido) {
    const entity = {
        partitionKey: "Pedidos",
        rowKey: Date.now().toString(),

        cliente: pedido.cliente,
        produtoId: pedido.produtoId,
        produto: pedido.produto,
        quantidade: Number(pedido.quantidade),
        valor: Number(pedido.valor),
        pagamento: pedido.pagamento,
        entrega: pedido.entrega,
        data: new Date().toLocaleString("pt-BR")
    };

    await pedidosTable.createEntity(entity);

    return entity;
}

async function listarPedidos() {
    const pedidos = [];

    for await (const entity of pedidosTable.listEntities()) {
        pedidos.push({
            id: entity.rowKey,
            cliente: entity.cliente,
            produtoId: entity.produtoId,
            produto: entity.produto,
            quantidade: entity.quantidade,
            valor: entity.valor,
            pagamento: entity.pagamento,
            entrega: entity.entrega,
            data: entity.data
        });
    }

    return pedidos;
}

async function diminuirEstoque(id, quantidade) {
    const produto = await produtosTable.getEntity(
        "Produtos",
        id
    );

    const estoqueAtual = Number(produto.quantidade);

    if (estoqueAtual < Number(quantidade)) {
        throw new Error("Quantidade solicitada maior que o estoque.");
    }

    produto.quantidade = estoqueAtual - Number(quantidade);

    await produtosTable.updateEntity(
        produto,
        "Merge"
    );

    return produto;
}

module.exports = {
    produtosTable,
    criarTabelaProdutos,
    adicionarProduto,
    listarProdutos,
    editarProduto,
    excluirProduto,
    diminuirEstoque,

    criarTabelaClientes,
    adicionarCliente,
    listarClientes,
    editarCliente,
    excluirCliente,

    
    criarTabelaPedidos,
    adicionarPedido,
    listarPedidos
};