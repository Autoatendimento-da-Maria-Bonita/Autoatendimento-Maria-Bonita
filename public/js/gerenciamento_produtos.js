let currentProductId = null;

// Comportamento dos botões de cada modal
document.addEventListener("DOMContentLoaded", () => {
	fetchProducts();

	document.getElementById("product-form").addEventListener("submit", handleProductFormSubmit);

	document.getElementById("close-modal").addEventListener("click", () => { closeModal("product-modal"); });
	document.getElementById("cancel-button").addEventListener("click", () => { closeModal("product-modal"); });

	document.getElementById("close-confirm-delete-modal").addEventListener("click", () => { closeModal("confirm-delete-modal"); });
	document.getElementById("close-confirm-update-modal").addEventListener("click", () => { closeModal("confirm-update-modal"); });

	document.getElementById("cancel-delete").addEventListener("click", () => { closeModal("confirm-delete-modal"); });
	document.getElementById("cancel-update").addEventListener("click", () => { closeModal("confirm-update-modal"); });

	document.getElementById("confirm-delete").addEventListener("click", handleDeleteProduct);
	document.getElementById("confirm-update").addEventListener("click", handleConfirmUpdate);
});

// API que trás os produtos do banco de dados
async function fetchProducts() {
	try {
		const result = await fetch("/api/produtos");
		if (!result.ok) throw new Error("Erro ao buscar produtos");
		const data = await result.json();
		renderProducts(data);
	} 
	catch (err) {
		console.error(err);
		showToast("Erro ao carregar produtos");
	}
}

// Renderiza os produtos na tela
function renderProducts(products) {
	const list = document.getElementById("products-list");
	list.innerHTML = "";
	products.forEach((product) => {
		const div = document.createElement("div");
		div.className = "product-item";
		div.innerHTML = `
			<div class="product-item__image-container">
				<img src="${product.imagem_url}" alt="${product.nome}" class="product-item__image">
			</div>
			<div class="product-item__name">${product.nome}</div>
			<div class="product-item__category">${product.categoria}</div>
			<div class="product-item__price">R$ ${parseFloat(product.preco).toFixed(2).replace(".", ",")}</div>
			<div class="product-item__stock">${product.quantidade_estoque} un.</div>
			<div class="product-item__actions">
				<button class="product-item__edit-btn" data-id="${product.id}" data-name="${product.nome}">Editar</button>
				<button class="product-item__delete-btn" data-id="${product.id}" data-name="${product.nome}">Deletar</button>
			</div>
		`;
		list.appendChild(div);
	});

	setupEventListeners();
}

// Abre o modal de editar ou deletra o produto selecionado
function setupEventListeners() {
	document.querySelectorAll(".product-item__edit-btn").forEach((button) => {
		button.addEventListener("click", () => {
			const productId = button.getAttribute("data-id");
			const productName = button.getAttribute("data-name");
			openEditProductModal(productId, productName);
		});
	});

	document.querySelectorAll(".product-item__delete-btn").forEach((button) => {
		button.addEventListener("click", () => {
			const productId = button.getAttribute("data-id");
			const productName = button.getAttribute("data-name");
			openDeleteConfirmModal(productId, productName);
		});
	});
}

// Abre o modal de confirmação de exclusão do produto
function openDeleteConfirmModal(productId, productName) {
	currentProductId = productId;
	document.getElementById("confirm-delete-message").textContent = `Deseja excluir o produto "${productName}"?`;
	document.getElementById("confirm-delete-modal").classList.add("active");
}

// Deleta o produto selecionado
async function handleDeleteProduct() {
	const response = await fetch(`/api/produtos/${currentProductId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (response.ok) {
		closeModal("confirm-delete-modal");
		showToast("Produto deletado com sucesso!");
		fetchProducts();
	} else {
		const error = await response.json();
		console.error("Erro ao deletar produto:", error);
		showToast("Erro ao deletar produto");
	}
}


// Abre o modal de edição do produto
function openEditProductModal(productId, productName) {
	fetch(`/api/produtos/id/${productId}`)
		.then(res => res.json())
		.then(products => {
			const product = products[0]; 
			if (!product) return;

			document.getElementById("product-id").value    	  = product.id;
			document.getElementById("product-name").value 	  = product.nome;
			document.getElementById("product-category").value = product.categoria;
			document.getElementById("product-price").value    = product.preco;
			document.getElementById("product-stock").value    = product.quantidade_estoque;
			document.getElementById("product-image").value    = product.imagem_url;

			updateImagePreview();
			document.getElementById("modal-title").textContent = `Editar Produto: ${productName}`;
			currentProductId = product.id;
			document.getElementById("product-modal").classList.add("active");
		});
}

// Dados do produto para Update
function getProductFormData() {
	return {
		id: document.getElementById("product-id").value,
		nome: document.getElementById("product-name").value,
		imagem_url: document.getElementById("product-image").value,
		categoria: document.getElementById("product-category").value,
		preco: parseFloat(document.getElementById("product-price").value),
		quantidade_estoque: parseInt(document.getElementById("product-stock").value)
	};
}

function handleProductFormSubmit(event) {
	event.preventDefault();
	
	const formData = getProductFormData();
	openUpdateConfirmModal(formData);
}


async function handleConfirmUpdate() {
	const { id, nome, categoria, preco, quantidade_estoque, imagem_url } = getProductFormData();

	const update = await fetch(`/api/produtos/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			nome,
			categoria,
			preco,
			quantidade_estoque,
			imagem_url
		})
	});

	if (update.ok) {
		showToast("Produto atualizado com sucesso!");
		closeModal("product-modal");
		fetchProducts();
	} else {
		const error = await update.json();
		console.error("Erro ao atualizar produto:", error);
		showToast("Erro ao atualizar produto");
	}
}

function updateImagePreview() {
	const url = document.getElementById("product-image").value;
	const img = document.getElementById("preview-image");
	const placeholder = document.querySelector(".image-preview__placeholder");
	if (url) {
		img.src = url;
		img.style.display = "block";
		placeholder.style.display = "none";
	} 
	else {
		img.style.display = "none";
		placeholder.style.display = "flex";
	}
}

function openUpdateConfirmModal(prod) {
	document.getElementById("summary-name").textContent = prod.nome;
	document.getElementById("summary-category").textContent = prod.categoria;
	document.getElementById("summary-price").textContent = `R$ ${prod.preco.toFixed(2).replace(".", ",")}`;
	document.getElementById("summary-stock").textContent = `${prod.quantidade_estoque} un.`;
	document.getElementById("confirm-update-modal").classList.add("active");
}

function showToast(message) {
	const toast = document.getElementById("toast");
	const msg = document.getElementById("toast-message");
	msg.textContent = message;
	toast.className = "toast show";
	setTimeout(() => toast.classList.remove("show"), 5000);
}

function closeModal(id) {
	document.getElementById(id).classList.remove("active");
}