document.addEventListener("DOMContentLoaded", () => {
	fetchPedidos();
});

// API que traz os pedidos do banco de dados
async function fetchPedidos() {
	try {
		const result = await fetch("/pedidos");
		if (!result.ok) throw new Error("Erro ao buscar pedidos");
		const data = await result.json();
		renderPedidos(data);
	} catch (err) {
		console.error(err);
		showToast("Erro ao carregar pedidos");
	}
}

// Renderiza os pedidos na tela
function renderPedidos(pedidos) {
	const list = document.getElementById("products-list");
	list.innerHTML = "";

	pedidos.forEach((pedido) => {
		const div = document.createElement("div");
		div.className = "products__row";

		div.innerHTML = `
			<div class="products__column">${pedido.cliente}</div>
			<div class="products__column">${pedido.produtos.replace(/\n/g, "<br>")}</div>
			<div class="products__column">R$ ${parseFloat(pedido.valor).toFixed(2).replace(".", ",")}</div>
			<div class="products__column">${pedido.pago ? "Sim" : "Não"}</div>
			<div class="products__column">
				<button class="btn-finalizar" data-id="${pedido.id}">Finalizar</button>
			</div>
		`;

		list.appendChild(div);

		const btn = div.querySelector(".btn-finalizar");
		btn.addEventListener("click", async (e) => {
			const id = e.target.getAttribute("data-id");
			const row = e.target.closest(".products__row");

			const confirmDelete = confirm("Tem certeza de que deseja finalizar este pedido?");
			if (!confirmDelete) return;

			try {
				const response = await fetch(`/pedidos/${id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					}
				});
				if (!response.ok) throw new Error("Erro ao finalizar o pedido");
				window.location.reload();
			} 
			catch (error) {
				console.error("Erro na requisição:", error);
				showToast("Erro ao finalizar o pedido.");
			}
			
		});
	});
}

