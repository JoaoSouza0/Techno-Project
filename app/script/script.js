const vm = new Vue({
    el: '#app',
    data: {
        produtos: [],
        carrinho: [],
        produto: '',
        mensagemAlerta: 'Item adicionado',
        alertaAtivo: false,
        carrinhoAtivo: false

    },
    computed: {
        carrinhoTotal() {
            total = 0

            if (this.carrinho.length) {
                this.carrinho.forEach(item => {
                    total += item.preco
                });
            }

            return total
        }
    },
    filters: {

        precoFiltro(valor) {
            return valor.toLocaleString('pt-BT', { style: 'currency', currency: 'BRL' })
        }
    },

    methods: {
        async fecthProdutos() {
            const fecthProdutos = await fetch('../../../api/produtos.json')
            const responseProdutos = await fecthProdutos.json()

            this.produtos = responseProdutos
        },
        async fecthProduto(id) {
            const fecthProduto = await fetch(`../../../api/produtos/${id}/dados.json`)
            const responseProduto = await fecthProduto.json()

            this.produto = responseProduto
        },

        abrirModal(id) {

            this.fecthProduto(id)
            window.scrollTo({
                top: 10,
                behavior: "smooth"

            })
        },
        closeModal({ target, currentTarget }) {

            if (target === currentTarget) this.produto = false

        },

        cliqueForaCarrinho({ target, currentTarget }) {

            if (target === currentTarget) this.carrinhoAtivo = false

        },
        addCarrinho() {

            this.produto.estoque--

            const { id, nome, preco, } = this.produto
            this.carrinho.push({ id, nome, preco })
            this.alerta()

        },

        rmvCarrinho(index) {

            this.carrinho.splice(index, 1)

        },
        checkCarrinho() {
            if (window.localStorage.carrinho) {
                this.carrinho = JSON.parse(window.localStorage.carrinho)
            }
        },
        alerta() {

            this.alertaAtivo = true
            setTimeout(() => {
                this.alertaAtivo = false
            }, 1500)
        },
        router() {
            const hash = document.location.hash
            if (hash) {

                this.fecthProduto(hash.replace('#', ''))
            }
        },
        compararEstoque() {
            const itens = this.carrinho.filter(({ id }) => id == this.produto.id)
            this.produto.estoque -= itens.length 

        }


    },
    watch: {
        carrinho() {
            window.localStorage.carrinho = JSON.stringify(this.carrinho)
        },
        produto() {
            document.title = this.produto.nome || 'Techno'
            const hash = this.produto.id || ''
            history.pushState(null, null, `#${hash}`)

            this.compararEstoque()

        },

    },
    created() {
        this.router()
        this.fecthProdutos()
        this.checkCarrinho()
    }
})
