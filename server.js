require("dotenv").config();

const express = require("express");
const path = require("path");
const multer = require("multer");

const { criarContainer, uploadImagem } =
    require("./services/blobService");

const {
    criarTabelaProdutos,
    adicionarProduto,
    listarProdutos,
    editarProduto,
    excluirProduto,
    criarTabelaClientes,
    adicionarCliente,
    listarClientes,
    editarCliente,
    excluirCliente,
    criarTabelaPedidos,
    adicionarPedido,
    diminuirEstoque,
    listarPedidos
} = require("./services/tableService");
const upload = multer({
    storage: multer.memoryStorage()
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/status", (req, res) => {
    res.json({
        sistema: "Gustavo Mattia E-commerce",
        status: "online"
    });
});

app.post("/api/produtos", upload.single("imagem"), async (req, res) => {

    try {

        const {
            marca,
            modelo,
            preco,
            quantidade,
            descricao
        } = req.body;

        if (!marca || !modelo || !preco || !quantidade) {
            return res.status(400).json({
                erro: "Preencha todos os campos obrigatórios."
            });
        }

        if (Number(preco) <= 0) {
            return res.status(400).json({
                erro: "O preço deve ser maior que zero."
            });
        }

        if (Number(quantidade) < 0) {
            return res.status(400).json({
                erro: "A quantidade não pode ser negativa."
            });
        }

        let imagemUrl = "";

        if (req.file) {
            imagemUrl = await uploadImagem(req.file);
        }

        const produto = await adicionarProduto({
            marca,
            modelo,
            preco,
            quantidade,
            descricao,
            imagemUrl
        });

        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!",
            produto
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: "Erro ao cadastrar produto."
        });
    }
});

app.get("/api/produtos", async (req, res) => {
    try {
        let produtos = await listarProdutos();

        const { marca, modelo, precoMin, precoMax } = req.query;

        if (marca) {
            produtos = produtos.filter(produto =>
                produto.marca.toLowerCase().includes(marca.toLowerCase())
            );
        }

        if (modelo) {
            produtos = produtos.filter(produto =>
                produto.modelo.toLowerCase().includes(modelo.toLowerCase())
            );
        }

        if (precoMin) {
            produtos = produtos.filter(produto =>
                Number(produto.preco) >= Number(precoMin)
            );
        }

        if (precoMax) {
            produtos = produtos.filter(produto =>
                Number(produto.preco) <= Number(precoMax)
            );
        }

        res.json(produtos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            erro: "Erro ao buscar produtos."
        });
    }
});
app.put("/api/produtos/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            marca,
            modelo,
            preco,
            quantidade,
            descricao
        } = req.body;

        if (!marca || !modelo || !preco || quantidade === undefined) {
            return res.status(400).json({
                erro: "Preencha todos os campos obrigatórios."
            });
        }

        if (Number(preco) <= 0) {
            return res.status(400).json({
                erro: "O preço deve ser maior que zero."
            });
        }

        if (Number(quantidade) < 0) {
            return res.status(400).json({
                erro: "A quantidade não pode ser negativa."
            });
        }

        const produto = await editarProduto(id, {
            marca,
            modelo,
            preco,
            quantidade,
            descricao
        });

        res.json({
            mensagem: "Produto atualizado com sucesso!",
            produto
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: "Erro ao atualizar produto."
        });
    }
});

app.delete("/api/produtos/:id", async (req, res) => {

    try {

        const { id } = req.params;

        await excluirProduto(id);

        res.json({
            mensagem: "Produto excluído com sucesso!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: "Erro ao excluir produto."
        });
    }
});

app.post("/api/clientes", async (req, res) => {
    try {
        const {
            nome,
            cpf,
            email,
            telefone,
            endereco
        } = req.body;

        if (!nome || !email || !telefone) {
            return res.status(400).json({
                erro: "Preencha nome, email e telefone."
            });
        }

        const cliente = await adicionarCliente({
            nome,
            cpf,
            email,
            telefone,
            endereco
        });

        res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso!",
            cliente
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao cadastrar cliente."
        });
    }
});

app.get("/api/clientes", async (req, res) => {
    try {
        const clientes = await listarClientes();

        res.json(clientes);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao buscar clientes."
        });
    }
});

app.put("/api/clientes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nome,
            cpf,
            email,
            telefone,
            endereco
        } = req.body;

        if (!nome || !email || !telefone) {
            return res.status(400).json({
                erro: "Preencha nome, email e telefone."
            });
        }

        const cliente = await editarCliente(id, {
            nome,
            cpf,
            email,
            telefone,
            endereco
        });

        res.json({
            mensagem: "Cliente atualizado com sucesso!",
            cliente
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao atualizar cliente."
        });
    }
});

app.delete("/api/clientes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await excluirCliente(id);

        res.json({
            mensagem: "Cliente excluído com sucesso!"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao excluir cliente."
        });
    }
});

app.post("/api/pedidos", async (req, res) => {
    try {
        const {
            cliente,
            produtoId,
            produto,
            quantidade,
            valor,
            pagamento,
            entrega
        } = req.body;

        if (
            !cliente ||
            !produtoId ||
            !produto ||
            !quantidade ||
            !pagamento ||
            !entrega
        ) {
            return res.status(400).json({
                erro: "Preencha todos os dados do pedido."
            });
        }

        await diminuirEstoque(
            produtoId,
            quantidade
        );

        const pedido = await adicionarPedido({
            cliente,
            produtoId,
            produto,
            quantidade,
            valor,
            pagamento,
            entrega
        });

        res.status(201).json({
            mensagem: "Pedido realizado com sucesso!",
            pedido
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao realizar pedido."
        });
    }
});

app.get("/api/pedidos", async (req, res) => {
    try {
        const pedidos = await listarPedidos();

        res.json(pedidos);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao buscar pedidos."
        });
    }
});

app.listen(PORT, async () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);

    try {
        await criarContainer();
        console.log("Azure Blob Storage conectado com sucesso!");
    } catch (error) {
        console.error("Erro no Blob Storage:");
        console.error(error.message);
    }

    try {
    await criarTabelaClientes();
    } catch (error) {
        console.error("Erro na tabela de clientes:");
        console.error(error.message);
    }

    try {
        await criarTabelaProdutos();
    } catch (error) {
        console.error("Erro no Table Storage:");
        console.error(error.message);
    }

    try {
    await criarTabelaPedidos();
    } catch (error) {
        console.error("Erro na tabela de pedidos:");
        console.error(error.message);
    }
});