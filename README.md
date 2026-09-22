# Gustavo Mattia E-commerce

Aplicação web de e-commerce desenvolvida para a avaliação prática da disciplina de Computação em Nuvem II.

## Tecnologias

* Node.js
* Express
* JavaScript
* HTML
* CSS
* Azure Blob Storage
* Azure Table Storage

## Funcionalidades

* Cadastro de produtos
* Edição e exclusão de produtos
* Busca de produtos por marca, modelo e preço
* Upload de imagens dos produtos no Azure Blob Storage
* Controle de estoque
* Cadastro, edição e exclusão de clientes
* Realização de pedidos
* Escolha de forma de pagamento e entrega
* Histórico de pedidos
* Interface web para administração e clientes

## Como executar localmente

### 1. Instalar as dependências

Com o Node.js instalado, execute:

```bash
npm install
```

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
AZURE_STORAGE_ACCOUNT=stop1nuvem2
AZURE_BLOB_SAS_URL=COLE_AQUI_A_BLOB_SAS_URL
AZURE_TABLE_SAS_URL=COLE_AQUI_A_TABLE_SAS_URL
```

### 3. Executar a aplicação

```bash
npm start
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## Estrutura principal

```text
GustavoMattiaEcommerce/
├── public/
│   ├── index.html
│   ├── produtos.html
│   ├── admin.html
│   ├── cliente.html
│   ├── style.css
│   └── script.js
├── services/
│   ├── tableService.js
│   └── blobService.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```
