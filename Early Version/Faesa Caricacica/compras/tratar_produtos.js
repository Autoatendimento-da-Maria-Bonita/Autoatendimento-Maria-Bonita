window.onload = function() {
    loadProducts('comidas');
    loadProducts('bebidas');
    loadProducts('doces');
    loadProducts('combos');
    updateFinalizeButton(); // Atualiza o botão ao carregar a página
    updateTotal(); // Atualiza o valor total ao carregar a página
};

async function loadProducts(type) {
    const response = await fetch(`produtos/${type}.html`);
    const text = await response.text();
    document.getElementById(`${type}-container`).innerHTML = text;
}

function incrementClick(product) {
    const counter = product.querySelector('.click-counter');
    const count = parseInt(counter.textContent) + 1;
    counter.textContent = count;
    counter.style.display = 'flex';

    const price = product.getAttribute('data-price');
    const name = product.getAttribute('data-name');

    let cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    if (cart[name]) {
        cart[name].quantity += 1; 
    } else {
        cart[name] = { 'price': price, 'quantity': 1 };
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateFinalizeButton(); // Atualiza o botão após adicionar um item
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
