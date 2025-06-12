import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://tvnuasxggudcegiclpzp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bnVhc3hnZ3VkY2VnaWNscHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4ODYwNjgsImV4cCI6MjA1OTQ2MjA2OH0.0irQipVPIzSnsarcw6MJnmTcwKqnfuG_KkmHimV0poY"
);

let currentProductId = null;
let isUpdateConfirmationNeeded = true;

async function fetchProducts() {
  const { data, error } = await supabase.from("produtos").select("*");
  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return;
  }
  renderProducts(data);
}

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
      <div class="product-item__stock">${product.Quantidade_em_estoque} un.</div>
      <div class="product-item__actions">
        <button class="product-item__edit-btn" data-id="${product.id}" data-name="${product.nome}">Editar</button>
        <button class="product-item__delete-btn" data-id="${product.id}" data-name="${product.nome}">Deletar</button>
      </div>
    `;
    list.appendChild(div);
  });
  setupEventListeners();
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  document.getElementById("product-form").addEventListener("submit", handleProductFormSubmit);
  document.getElementById("confirm-delete").addEventListener("click", handleDeleteProduct);
  document.getElementById("confirm-update").addEventListener("click", handleConfirmUpdate);
});
function openEditProductModal(productId, productName) {
  supabase.from("produtos").select("*").eq("id", productId).single().then(({ data: product }) => {
    if (!product) return;
    document.getElementById("product-id").value = product.id;
    document.getElementById("product-name").value = product.nome;
    document.getElementById("product-category").value = product.categoria;
    document.getElementById("product-price").value = product.preco;
    document.getElementById("product-stock").value = product.Quantidade_em_estoque;
    document.getElementById("product-image").value = product.imagem_url;
    updateImagePreview();
    document.getElementById("modal-title").textContent = `Editar Produto: ${productName}`;
    currentProductId = product.id;
    isUpdateConfirmationNeeded = true;
    document.getElementById("product-modal").classList.add("active");
  });
}

function handleProductFormSubmit(event) {
  event.preventDefault();
  const id = document.getElementById("product-id").value;
  const nome = document.getElementById("product-name").value;
  const categoria = document.getElementById("product-category").value;
  const preco = parseFloat(document.getElementById("product-price").value);
  const estoque = parseInt(document.getElementById("product-stock").value);
  const imagem = document.getElementById("product-image").value;

  if (id && isUpdateConfirmationNeeded) {
    openUpdateConfirmModal({ nome, categoria, preco, estoque });
    return;
  }

  supabase.from("produtos").insert([{ nome, categoria, preco, Quantidade_em_estoque: estoque, imagem_url: imagem }])
    .then(() => {
      showToast("Produto adicionado com sucesso!");
      closeProductModal();
      fetchProducts();
    });
}

function handleConfirmUpdate() {
  const id = document.getElementById("product-id").value;
  const nome = document.getElementById("product-name").value;
  const categoria = document.getElementById("product-category").value;
  const preco = parseFloat(document.getElementById("product-price").value);
  const estoque = parseInt(document.getElementById("product-stock").value);
  const imagem = document.getElementById("product-image").value;

  supabase.from("produtos").update({ nome, categoria, preco, Quantidade_em_estoque: estoque, imagem_url: imagem }).eq("id", id)
    .then(() => {
      closeConfirmUpdateModal();
      closeProductModal();
      showToast("Produto atualizado com sucesso!");
      fetchProducts();
    });
}
function openDeleteConfirmModal(productId, productName) {
  currentProductId = productId;
  document.getElementById("confirm-delete-message").textContent = `Deseja excluir o produto "${productName}"?`;
  document.getElementById("confirm-delete-modal").classList.add("active");
}

function handleDeleteProduct() {
  supabase.from("produtos").delete().eq("id", currentProductId)
    .then(() => {
      closeConfirmDeleteModal();
      showToast("Produto deletado com sucesso!");
      fetchProducts();
    });
}

function closeProductModal() {
  document.getElementById("product-modal").classList.remove("active");
}

function closeConfirmDeleteModal() {
  document.getElementById("confirm-delete-modal").classList.remove("active");
}

function closeConfirmUpdateModal() {
  document.getElementById("confirm-update-modal").classList.remove("active");
}

function updateImagePreview() {
  const url = document.getElementById("product-image").value;
  const img = document.getElementById("preview-image");
  const placeholder = document.querySelector(".image-preview__placeholder");
  if (url) {
    img.src = url;
    img.style.display = "block";
    placeholder.style.display = "none";
  } else {
    img.style.display = "none";
    placeholder.style.display = "flex";
  }
}

function openUpdateConfirmModal(prod) {
  document.getElementById("summary-name").textContent = prod.nome;
  document.getElementById("summary-category").textContent = prod.categoria;
  document.getElementById("summary-price").textContent = `R$ ${prod.preco.toFixed(2).replace(".", ",")}`;
  document.getElementById("summary-stock").textContent = `${prod.estoque} un.`;
  document.getElementById("confirm-update-modal").classList.add("active");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  const msg = document.getElementById("toast-message");
  msg.textContent = message;
  toast.className = "toast show";
  setTimeout(() => toast.classList.remove("show"), 5000);
}
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