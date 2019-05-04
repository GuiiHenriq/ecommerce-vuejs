const vm = new Vue({
    el: '#app',
    data: {
        produtos: [],
        produto: false,
        carrinho: [],
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
        },

        removeCarrinho(index) {
            this.carrinho.splice(index);
        },
    },
    watch: {
        carrinho() {
            window.localStorage.carrinho = this.carrinho;
        }
    },
    created() {
        this.fetchProducts();
    }
});
