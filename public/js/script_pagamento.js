document.addEventListener('DOMContentLoaded', () => {
    const productList = document.querySelector('.product__list');
    const cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    let total = 0;

    if (Object.keys(cart).length === 0) {
        productList.innerHTML += "<p style='color: gray'>Nenhum item no carrinho.</p>";
        return;
    }

    for (const [productName, details] of Object.entries(cart)) {
        const row = document.createElement('div');
        row.className = 'table__row';

        const price = parseFloat(details.price);
        const quantity = details.quantity;
        const subtotal = price * quantity;
        total += subtotal;

        row.innerHTML = `
            <span class="table__cell">${productName}</span>
            <span class="table__cell quantidade">${quantity}</span>
            <span class="table__cell">R$ ${price.toFixed(2).replace('.', ',')}</span>
            <span class="table__cell">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
        `;

        productList.appendChild(row);
    }

    // Linha de total
    const totalRow = document.createElement('div');
    totalRow.className = 'table__row';
    totalRow.innerHTML = `
        <span class="table__cell" style="grid-column: 1 / span 3; text-align: right;"><strong>Total:</strong></span>
        <span class="table__cell"><strong>R$ ${total.toFixed(2).replace('.', ',')}</strong></span>
    `;
    productList.appendChild(totalRow);

    // Habilita/desabilita botão de pagamento
    const payBtn = document.querySelector('.cart__checkout');
    if (payBtn) {
        if (total === 0) {
            payBtn.setAttribute('disabled', 'true');
        } else {
            payBtn.removeAttribute('disabled');
            payBtn.classList.add('enabled');
        }

        payBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            await processarPagamento(cart);
        });
    }
});


async function processarPagamento(cart) {
    if (!cart || Object.keys(cart).length === 0) {
        alert("Carrinho vazio ou inválido.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/pagamento/criar-preferencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cart }),
        });

        const data = await response.json();

        if (data.id) {
            // Configuração do Mercado Pago com a chave pública
            const mp = new MercadoPago('TEST-a8f02ffe-cfad-4293-ae54-18adfc1c0159');

            // Realiza o checkout com a preferência criada
            mp.checkout({
                preference: {
                    id: data.id,
                },
                autoOpen: true,
            });
        } else {
            alert('Erro ao criar preferência de pagamento');
        }
    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        alert('Erro ao processar pagamento. Tente novamente.');
    }
}


function mostrarPopupAvaliacao() {
    const popup = document.getElementById("avaliacao-popup");
    popup.classList.remove("hidden");

    const starsContainer = document.getElementById("stars-container");
    starsContainer.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.innerHTML = "&#9733;";
        star.classList.add("star");
        star.dataset.value = i;

        star.addEventListener("click", () => selecionarEstrelas(i));
        starsContainer.appendChild(star);
    }

    document.getElementById("enviar-avaliacao").addEventListener("click", () => {
        const estrelasSelecionadas = document.querySelectorAll(".star.selected").length;
        alert(`Obrigado pela sua avaliação de ${estrelasSelecionadas} estrela(s)!`);
        popup.classList.add("hidden");

        // Aqui você poderia enviar os dados ao backend
    });
}

function selecionarEstrelas(n) {
    const estrelas = document.querySelectorAll(".star");
    estrelas.forEach((star, i) => {
        if (i < n) {
            star.classList.add("selected");
        } else {
            star.classList.remove("selected");
        }
    });
}

function cancelarPedido() {
    sessionStorage.removeItem('cart');
    window.location.href = './tela_inicial';
}