window.onload = function() {
    loadProducts('Comidas');
    loadProducts('Bebidas');
    loadProducts('Doces');
    loadProducts('Combos');
    updateFinalizeButton();
    updateTotal();
};

async function loadProducts(type) {
    try {
        const response = await fetch(`/api/produtos/${type}`);
        const produtos = await response.json();

        const container = document.getElementById(`${type}-container`);
        container.innerHTML = '';

        produtos.forEach(produto => {
            const div = document.createElement('div');
            div.className = 'produto';
            div.setAttribute('onclick', 'incrementClick(this)');
            div.setAttribute('data-name', produto.nome);
            div.setAttribute('data-price', produto.preco);

            div.innerHTML = `
                <img src="${produto.imagem_url}" alt="${produto.nome}">
                <div class="click-counter" style="display:none;">0</div>
                <p class="nome-produto">${produto.nome}</p>
                <p class="preco-produto">R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}</p>
            `;
            container.appendChild(div);
        });
    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
    }
}

function incrementClick(product) {
    const counter = product.querySelector('.click-counter');
    const count = parseInt(counter.textContent) + 1;
    counter.textContent = count;
    counter.style.display = 'flex';

    const name = product.getAttribute('data-name');
    const price = product.getAttribute('data-price');

    let cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    if (cart[name]) {
        cart[name].quantity += 1; 
    } 
    else {
        cart[name] = { 'price': price, 'quantity': 1 };
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateFinalizeButton();
}

function updateFinalizeButton() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    const hasItems = Object.keys(cart).length > 0;
    const finalizeButton = document.querySelector('.finalizar-pedido');

    if (hasItems) {
        finalizeButton.style.backgroundColor = '#60ff60';
        finalizeButton.disabled = false;
    } else {
        finalizeButton.style.backgroundColor = '#C1C1C1';
        finalizeButton.disabled = true;
    }
}

function cancelarPedido() {
    sessionStorage.clear();
    
    const contadoresPedidos = document.querySelectorAll('.click-counter');
    contadoresPedidos.forEach(contador => {
        contador.textContent = '0';
        contador.style.display = 'none';
    });

    updateFinalizeButton();;
}