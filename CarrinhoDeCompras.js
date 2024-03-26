const fs = require('fs');
const path = require('path');

class CarrinhoDeCompras {
    constructor(folderPath) {
        this.folderPath = folderPath;
        // Verifica se o diretório existe, se não, cria
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    }

    // Adiciona um produto ao carrinho de um usuário
    adicionarAoCarrinho(userId, productId, variacoes, quantidade) {
        const parsedQuantity =  parseInt(quantidade)
        const carrinhoPath = this.getCarrinhoPath(userId);
        let carrinho = this.carregarCarrinho(carrinhoPath);

        const produtoIndex = carrinho.produtos.findIndex(item => item.productId === productId && item.variacoes === variacoes);

        if (produtoIndex !== -1) {
            carrinho.produtos[produtoIndex].quantidade += parsedQuantity;
        } else {
            carrinho.produtos.push({ productId: parseInt(productId), variacoes, quantidade:parsedQuantity });
        }

        this.salvarCarrinho(carrinhoPath, carrinho);
    }

    // Remove completamente um produto do carrinho de um usuário
    removerProdutoDoCarrinho(userId, productId) {
        const carrinhoPath = this.getCarrinhoPath(userId);
        let carrinho = this.carregarCarrinho(carrinhoPath);

        carrinho.produtos = carrinho.produtos.filter(item => !(item.productId === parseInt(productId)));

        this.salvarCarrinho(carrinhoPath, carrinho);
    }

    // Altera a quantidade de um produto no carrinho de um usuário
    alterarQuantidadeDoProdutoNoCarrinho(userId, productId, novaQuantidade) {
        const carrinhoPath = this.getCarrinhoPath(userId);
        let carrinho = this.carregarCarrinho(carrinhoPath);

        const produtoIndex = carrinho.produtos.findIndex(item => item.productId === parseInt(productId));
        console.log(produtoIndex, carrinhoPath,userId, novaQuantidade, productId  )
        if (produtoIndex !== -1) {
            if (novaQuantidade <= 0) {
                carrinho.produtos.splice(produtoIndex, 1);
            } else {
                carrinho.produtos[produtoIndex].quantidade = novaQuantidade;
            }
        }

        this.salvarCarrinho(carrinhoPath, carrinho);
    }

    // Retorna o carrinho de um usuário
    obterCarrinhoDoUsuario(userId) {
        const carrinhoPath = this.getCarrinhoPath(userId);
        return this.carregarCarrinho(carrinhoPath);
    }

    // Retorna o caminho para o arquivo JSON do carrinho de um usuário
    getCarrinhoPath(userId) {
        return path.join(this.folderPath, `${userId}.json`);
    }

    // Carrega o carrinho de um arquivo JSON
    carregarCarrinho(carrinhoPath) {
        try {
            const carrinhoData = fs.readFileSync(carrinhoPath);
            return JSON.parse(carrinhoData);
        } catch (error) {
            return { produtos: [] };
        }
    }

    // Salva o carrinho em um arquivo JSON
    salvarCarrinho(carrinhoPath, carrinho) {
        try {
            fs.writeFileSync(carrinhoPath, JSON.stringify(carrinho, null, 2));
        } catch (error) {
            console.error(`Erro ao salvar carrinho em ${carrinhoPath}: ${error}`);
        }
    }

    calcularPrecoTotalDoCarrinho(userId, products) {
        const carrinho = this.obterCarrinhoDoUsuario(userId);
        let totalPrice = 0;
    
        // Agrupar itens por productId
        const agrupadosPorId = {};
        for (const item of carrinho.produtos) {
            const productId = parseInt(item.productId);
            if (!agrupadosPorId[productId]) {
                agrupadosPorId[productId] = {...item, quantidade: parseInt(item.quantidade)};
            } else {
                agrupadosPorId[productId].quantidade += parseInt(item.quantidade);
            }
        }
    
        // Calcular o preço total
        for (const id in agrupadosPorId) {
            const item = agrupadosPorId[id];
            const product = products.find(p => parseInt(p.id) === parseInt(item.productId));
            if (product) {
                totalPrice += product.preco_atual * item.quantidade;
            }
        }
    
        return totalPrice;
    }
    
}

module.exports = {
    CarrinhoDeCompras
};
