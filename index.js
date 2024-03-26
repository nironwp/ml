const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const { default: axios } = require('axios');
const { CarrinhoDeCompras } = require('./CarrinhoDeCompras');
const session = require('express-session');
const { products } = require('./products');
const { PrismaClient } = require('@prisma/client');
const { enviarTransacao } = require('./enviarTransacao');

// Create Express app
const app = express();

// Configuração para lidar com dados JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'r780t3x12rng21387n21g21go*dGMM213NF5679F1628',
    resave: false,
    userId: null,
    saveUninitialized: true
}));
const prisma = new PrismaClient()
const carrinhos = new CarrinhoDeCompras('carrinhos')

// Set up middleware to serve static files (HTML, CSS, JavaScript, etc.)
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use("/css", express.static(path.join(__dirname, 'css')));
app.use("/js", express.static(path.join(__dirname, 'js')));
app.use("/images", express.static(path.join(__dirname, 'images')));
app.use("/fontes", express.static(path.join(__dirname, 'fontes')));
// Define o diretório de visualizações
app.set('views', path.join(__dirname, 'views'));

// Define o mecanismo de visualização como EJS
app.set('view engine', 'ejs');
app.use((req, res, next) => {
    try {
        console.log(`Recebido ${req.method} na URL ${req.url}`);
        next();
    } catch (error) {
        console.log('Erro ao logar Requisição')
    }
});
function obterProdutosAleatorios(produtos, n) {
    const shuffled = produtos.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

app.get('/dashboard', requireAuth, (req, res) => {
    // Renderize sua página de dashboard aqui
    res.render('dashboard');
});

app.get('/', async (req, res) => {
    const products = await prisma.produto.findMany({})
    try {
        return res.render('index', {
            produtos: obterProdutosAleatorios(products, 30)
        });
    } catch (error) {
        console.log('Erro ao renderizar HomePage')
    }
});



app.post('/api/', async (req, res) => {
    const produtos = await prisma.produto.findMany()
    try {
        if (req.query.metodo === 'perguntar' || req.query.metodo === 'adicionarProdutoNoCarrinho' || req.query.metodo === 'online') {
            return res.send('ok')
        }
        if (req.body.metodo === 'perguntasDoProduto') {
            return res.send()
        }
        if (req.body.metodo === 'perguntar') {
            return res.send(req.body.pergunta)
        }
        if (req.query.metodo === 'mostrarCarrinho' || req.body.metodo === 'mostrarCarrinho') {
            const carrinho = carrinhos.obterCarrinhoDoUsuario(req.body.userID)
            console.log(produtos)
            return res.render('render-cart', {
                carrinho: carrinho,
                produtos: produtos,
            })
        }
        if (req.query.metodo === 'consultarCEP' || req.body.metodo === 'consultarCEP') {
            const cep = req.body.cep;

            if (!cep) {
                return res.status(400).json({ error: 'CEP não fornecido' });
            }

            try {
                // Fazendo a requisição para a API do ViaCEP
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

                if (response.status !== 200) {
                    return res.status(404).json({ error: 'CEP não encontrado' });
                }

                // Extraindo os dados do JSON retornado
                const data = response.data;

                // Formatando a resposta
                const formattedResponse = `${data.logradouro || data.complemento}|${data.localidade || data.bairro}|${data.localidade}|${data.uf}`;
                return res.send(formattedResponse);
            } catch (error) {
                console.error('Erro ao consultar o CEP:', error.message);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
        if (req.body.metodo === "buscarQuantidades") {
            return res.render('render-quantidade', {
                productId: req.body.fullid
            })
        }
        if (req.body.metodo === 'online') {
            return res.send('ok')
        }
        if (req.body.metodo === 'alterarQuantidadeDoProdutoNoCarrinho') {
            console.log(req.body.userID, req.body.fullid, req.body.quantidade)
            carrinhos.alterarQuantidadeDoProdutoNoCarrinho(req.body.userID, req.body.fullid, req.body.quantidade)

            return res.send('Alterado')
        }
        if (req.body.metodo === 'removerProdutoDoCarrinho') {
            carrinhos.removerProdutoDoCarrinho(req.body.userID, req.body.fullid)

            return res.send('Alterado')
        }
        if (req.body.metodo === 'buscarValoresDoPedido' && req.body.formaDePagamento === 'Pix') {
            const valor = carrinhos.calcularPrecoTotalDoCarrinho(req.body.userID, produtos)
            console.log(valor)

            if(!valor) {
                return res.redirect('/')
            }

            return res.send(`${valor.toFixed(2)}|0.00|${valor.toFixed(2)}|${valor.toFixed(2)}`)
        }
        if (req.body.metodo === 'adicionarProdutoNoCarrinho') {
            carrinhos.adicionarAoCarrinho(req.body.userID, req.body.fullid, req.body.variações, req.body.quantidade)
        }
        if (req.body.metodo === 'gerarPix') {

            try {

                const valor = carrinhos.calcularPrecoTotalDoCarrinho(req.body.userID, produtos)
                const transacao = await enviarTransacao(req.body.formaDePagamento, valor, req.body.cpfParaNotaFiscal, req.body.nomeEndereço, req.body.email)
    
                return res.send(`${transacao.qrcode}|${transacao.qrcode}|Código Pix|${transacao.qrcode}|R$${valor.toFixed(2)}`)

            } catch (error) {
                return res.redirect('/pagamento')
            }
        }
        return res.send('não implementado')

    } catch (error) {
        return res.redirect('/')
    }
})


app.get('/:product', async (req, res) => {
    const products = await prisma.produto.findMany({})
    console.log(req.params.product)
    try {
        if (req.query.local === 'carrinho') {
            return res.render('cr1')
        }

        if (req.params.product === 'inicio') {
            return res.render('index', {
                produtos: obterProdutosAleatorios(products, 30)
            })
        }
        return res.render(req.params.product, {
            produtos: products,
            produtos_aleatorios: obterProdutosAleatorios(products, 20)
        });

    } catch (error) {
        console.log('Error ao exibir página:' + req.params.product)
        return res.send('Erro')
    }

});

app.get('/produto/:id', async (req, res) => {
    const produto = await prisma.produto.findUnique({
        where: {
            id: parseInt(req.params.id)
        },
        include: {
            modelAvaliations: {
                include: {
                    user_avaliations: true
                }
            }
        }
    })

    if (!produto) {
        return res.redirect('/')
    }
    const relatedProductsIds = produto.related_products.split(',')
    console.log(relatedProductsIds)
    const related_products = await Promise.all(relatedProductsIds.map(async (id) => {
        if (!id) return
        return await prisma.produto.findUnique({
            where: {
                id: parseInt(id)
            }
        })
    }))

    console.log(related_products)

    return res.render('produto', {
        produto,
        slider_images: JSON.parse(produto.slider_images),
        variacoes: JSON.parse(produto.variacoes),
        fotos_produto: JSON.parse(produto.fotos_do_produto),
        details: JSON.parse(produto.product_details).details,
        especificacoes_gerais: JSON.parse(produto.especificacoes_gerais),
        questions: JSON.parse(produto.questions).questions,
        model_avaliation: produto.modelAvaliations,
        user_avaliations: produto.modelAvaliations.user_avaliations,
        extra_details_model_avaliation: JSON.parse(produto.modelAvaliations.extra_details_string),
        relatedProducts: related_products
    })
})
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}


const users = [
    { id: 1, username: 'admin', password: '$2b$10$JAVBECw.UqwB1F76hNY2AOVIcgS51k3zWapDUy1ABqhuaV5N0Vh1.' } // Exemplo de hash para 'senha123'
];


app.get('/admin/login', (req, res) => {
    res.render('login-admin');
});

async function hashPassword(password) {
    const saltRounds = 10; // Recomendado pelo bcrypt
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(hash);
}


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    console.log(req.body)
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id;
        return res.redirect('/dashboard');
    }

    res.redirect('/login');
});


// Definindo a porta do servidor
const PORT = process.env.PORT || 3000;

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);

    // Adicionando logs de depuração para verificar os diretórios de arquivos estáticos
    console.log('Diretório de arquivos estáticos:');
    console.log('Public:', path.join(__dirname, 'public'));
    console.log('CSS:', path.join(__dirname, 'css'));
    console.log('JS:', path.join(__dirname, 'js'));
    console.log('Images:', path.join(__dirname, 'images'));
});
