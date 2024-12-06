// index.js
const express = require ('express');
const bodyParser = require ('body-parser');
const cors = require ('cors');
const products = require ('./src/data/products');
const path = require('path');



const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para obter todos os produtos
app.get('/api/products', (req, res) => {
    res.status(200).json(products); // Retorna produtos com status 200
});

// Rota para obter um produto por ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.status(200).json(product); // Retorna o produto encontrado
    } else {
        res.status(404).send('Produto não encontrado'); // Retorna 404 se não encontrado
    }
});
app.get('/api/uploads/:id', (req, res) => {
    res.sendFile(path.join(__dirname, `./uploads/${req.params.id}`))
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);  
});
