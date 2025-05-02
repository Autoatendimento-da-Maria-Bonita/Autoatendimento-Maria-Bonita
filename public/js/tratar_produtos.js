window.onload = function() {
    loadProducts('Comidas');
    loadProducts('Bebidas');
    loadProducts('Doces');
    loadProducts('Combos');
    updateFinalizeButton();
    updateTotal();
    displayUserName();
};

function displayUserName() {
    const userName = sessionStorage.getItem('userName') || localStorage.getItem('userName');
    if (userName) {
        document.getElementById('user-name').textContent = userName;
    }
}

async function loadProducts(type) {
    try {
        const response = await fetch(`/api/produtos/${type}`);
        const produtos = await response.json();

        const container = document.getElementById(`${type}-container`);
        container.innerHTML = '';

        produtos.forEach(produto => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.setAttribute('data-name', produto.nome);
            productDiv.setAttribute('data-price', produto.preco);
            productDiv.onclick = function(e) {
            
                if (!e.target.closest('.product__action')) {
                    incrementProduct(this);
                }
            };

            productDiv.innerHTML = `
                <div class="product__image-container">
                    <img class="product__image" src="${produto.imagem_url}" alt="${produto.nome}">
                    <div class="product__quantity">
                        <span class="product__quantity-count">0</span>
                    </div>
                </div>
                <h3 class="product__name">${produto.nome}</h3>
                <p class="product__price">R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}</p>
                <div class="product__actions">
                    <button class="product__action product__action--remove" onclick="event.stopPropagation(); decrementProduct(this.closest('.product'))">
                        <span>-</span>
                    </button>
                    <button class="product__action product__action--add" onclick="event.stopPropagation(); incrementProduct(this.closest('.product'))">
                        <span>+</span>
                    </button>
                </div>
            `;
            container.appendChild(productDiv);
        });
    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        
    
        const container = document.getElementById(`${type}-container`);
        container.innerHTML = `<div class="product__error">Erro ao carregar produtos. Verifique a conexão.</div>`;
    }
}

function incrementProduct(product) {
    const counter = product.querySelector('.product__quantity-count');
    const quantityContainer = product.querySelector('.product__quantity');
    let count = parseInt(counter.textContent) + 1;
    counter.textContent = count;
    
    if (count > 0) {
        quantityContainer.classList.add('product__quantity--visible');
        product.classList.add('product--selected');
    }

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
    updateTotal();
}

function decrementProduct(product) {
    const counter = product.querySelector('.product__quantity-count');
    const quantityContainer = product.querySelector('.product__quantity');
    let count = parseInt(counter.textContent);
    
    if (count > 0) {
        count -= 1;
        counter.textContent = count;
        
        const name = product.getAttribute('data-name');
        let cart = JSON.parse(sessionStorage.getItem('cart')) || {};
        
        if (cart[name]) {
            cart[name].quantity -= 1;
            
            if (cart[name].quantity <= 0) {
                delete cart[name];
            }
            
            sessionStorage.setItem('cart', JSON.stringify(cart));
        }
        
        if (count === 0) {
            quantityContainer.classList.remove('product__quantity--visible');
            product.classList.remove('product--selected');
        }
        
        updateFinalizeButton();
        updateTotal();
    }
}

function updateFinalizeButton() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    const hasItems = Object.keys(cart).length > 0;
    const finalizeButton = document.querySelector('.cart__checkout');

    if (hasItems) {
        finalizeButton.classList.remove('cart__checkout--disabled');
        finalizeButton.disabled = false;
    } else {
        finalizeButton.classList.add('cart__checkout--disabled');
        finalizeButton.disabled = true;
    }
}

function updateTotal() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    let totalItems = 0;
    let totalPrice = 0;
    
    for (const item in cart) {
        totalItems += cart[item].quantity;
        totalPrice += cart[item].quantity * parseFloat(cart[item].price);
    }
    
    document.querySelector('.cart__count').textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
    document.querySelector('.cart__total').textContent = `Total: R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
}

function cancelarPedido() {
    sessionStorage.removeItem('cart');
    
    const quantityCounters = document.querySelectorAll('.product__quantity-count');
    quantityCounters.forEach(counter => {
        counter.textContent = '0';
        const product = counter.closest('.product');
        product.querySelector('.product__quantity').classList.remove('product__quantity--visible');
        product.classList.remove('product--selected');
    });

    updateFinalizeButton();
    updateTotal();
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.shop__search-input').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const products = document.querySelectorAll('.product');
        
        products.forEach(product => {
            const productName = product.querySelector('.product__name').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                product.style.display = 'flex';
            } else {
                product.style.display = 'none';
            }
        });
    });
});