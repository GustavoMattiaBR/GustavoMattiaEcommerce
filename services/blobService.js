const {
    BlobServiceClient
} = require("@azure/storage-blob");

const blobServiceClient = new BlobServiceClient(
    process.env.AZURE_BLOB_SAS_URL
);

const containerName = "gustavo-mattia-produtos";

async function criarContainer() {

    const containerClient =
        blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists();

    console.log(`Container "${containerName}" pronto.`);

    return containerClient;
}

async function uploadImagem(file) {

    const containerClient =
        blobServiceClient.getContainerClient(containerName);

    const nomeArquivo =
        `${Date.now()}-${file.originalname}`;

    const blockBlobClient =
        containerClient.getBlockBlobClient(nomeArquivo);

    await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
            blobContentType: file.mimetype
        }
    });

    return blockBlobClient.url;
}

module.exports = {
    criarContainer,
    uploadImagem
};