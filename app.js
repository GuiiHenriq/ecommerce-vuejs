const vm = new Vue({
    el: '#app',
    data: {
        produtos: [],
        produto: false,
    },
    filters: {
        numeroPreco(valor) {
            /* Filter para converter a string em valor e aplicar o BRL */
            //return `R$ ${valor},00`
            return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
        }
    },
    created() {
        this.fetchProducts();
    }
});
