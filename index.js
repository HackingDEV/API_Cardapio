// index.js
const express = require ('express');
const bodyParser = require ('body-parser');
const cors = require ('cors');
const products = require ('./src/data/products');
const path = require('path');
require('dotenv').config()
const fs = require('fs');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uploadDir = './src/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Rota para obter todos os produtos
app.get('/products', (req, res) => {
    res.status(200).json(products); // Retorna produtos com status 200
});

// Rota para obter um produto por ID
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.status(200).json(product); // Retorna o produto encontrado
    } else {
        res.status(404).send('Produto não encontrado'); // Retorna 404 se não encontrado
    }
});

app.get('/uploads/:id', (req, res) => {
    res.sendFile(path.join(__dirname, `./uploads/${req.params.id}`))
});

app.post('/uploads', (req, res) => {
    parseMultipart(req, res, (filePath) => {
        res.send(`Arquivo enviado com sucesso! Salvo em: ${filePath}`);
    });
});

// Função para processar o corpo multipart manualmente
function parseMultipart(req, res, callback) {
    let data = '';
    let fileData = null;
    let isFile = false;
    let fileName = '';
    
    req.on('data', chunk => {
        data += chunk;

        // Se estamos no início de um arquivo, começamos a armazenar seus dados
        if (data.includes('Content-Disposition') && data.includes('filename')) {
            const start = data.indexOf('filename="') + 10;
            const end = data.indexOf('"', start);
            fileName = data.substring(start, end);

            // Remove a parte do cabeçalho do arquivo
            data = data.substring(data.indexOf('\r\n\r\n') + 4);
            isFile = true;
        }

        if (isFile) {
            fileData = data;
        }
    });

    req.on('end', () => {
        if (fileData) {
            const filePath = path.join(uploadDir, generateRandomId() + path.extname(fileName));
            fs.writeFileSync(filePath, fileData);
            callback(filePath);
        } else {
            res.status(400).send('Nenhum arquivo enviado.');
        }
    });
}

function generateRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i <= 16; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}




// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);  
});
