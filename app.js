const vm = new Vue({
    el: '#app',
    data: {
        produtos: [],
        produto: false,
        carrinho: [],
        mensagemAlerta: 'Item adicionado!',
        alertaActive: false,
    },
    filters: {
        numeroPreco(valor) {
            /* Filter para converter a string em valor e aplicar o BRL */
            //return `R$ ${valor},00`
            return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    },
    computed: {
        carrinhoTotal() {
            let total = 0;
            if (this.carrinho.length) {
                this.carrinho.forEach(item => {
                    total += item.preco;
                })
            }
            return total;
        }
    },
    methods: {
        fetchProducts() {
            fetch('./api/produtos.json')
                .then(r => r.json())
                .then(r => {
                    this.produtos = r;
                })
        },

        fetchProduct(id) {
            fetch(`./api/produtos/${id}/dados.json`)
                .then(r => r.json())
                .then(r => {
                    this.produto = r;
                })
        },

        openModal(id) {
            this.fetchProduct(id);
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        },

        closeModal({ target, currentTarget }) {
            if (target === currentTarget) {
                this.produto = false;
            }
        },

        addCarrinho() {
            this.produto.estoque--;
            const { id, nome, preco } = this.produto;
            this.carrinho.push({ id, nome, preco });
            this.alertaCarrinho(`${nome} adicionado ao carrinho`)
        },

        removeCarrinho(index) {
            this.carrinho.splice(index);
        },

        checkLocalStorage() {
            if (window.localStorage.carrinho) {
                this.carrinho = JSON.parse(window.localStorage.carrinho); // json.parse = converter string em array
            }
        },

        alertaCarrinho(msg) {
            this.mensagemAlerta = msg;
            this.alertaActive = true;
            setTimeout(() => {
                this.alertaActive = false;
            }, 1500);
        },

        router() {
            const hash = document.location.hash;
            if (hash) {
                this.fetchProduct(hash.replace('#', ''));
            }
        }
    },
    watch: {
        produto() {
            document.title = this.produto.nome || 'Tecnho Project';
            const hash = this.produto.id || '';
            history.pushState(null, null, `#${hash}`);
        },

        carrinho() {
            window.localStorage.carrinho = JSON.stringify(this.carrinho); // json.stringify = converter array/objeto em String
        }
    },
    created() {
        this.fetchProducts();
        this.checkLocalStorage();
        this.router();
    }
});
