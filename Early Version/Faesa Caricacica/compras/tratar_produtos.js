
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabase = createClient(
  "https://tvnuasxggudcegiclpzp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bnVhc3hnZ3VkY2VnaWNscHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4ODYwNjgsImV4cCI6MjA1OTQ2MjA2OH0.0irQipVPIzSnsarcw6MJnmTcwKqnfuG_KkmHimV0poY"
);

window.onload = function () {
  fetchProductsFromSupabase("comidas");
  fetchProductsFromSupabase("bebidas");
  fetchProductsFromSupabase("doces");
  fetchProductsFromSupabase("combos");
  updateFinalizeButton();
  await updateStock(product.getAttribute('data-name'), -1);
  await updateStock(product.getAttribute('data-name'), 1);
  updateTotal();
};

async function fetchProductsFromSupabase(type) {
  const { data, error } = await supabase.from("produtos").select("*").eq("category", type);
  if (error) {
    console.error("Erro ao buscar produtos:", error.message);
    return;
  }

  const container = document.getElementById(`${type}-container`);
  container.innerHTML = "";

  data.forEach((product) => {
    const div = document.createElement("div");
    div.className = "product";
    div.setAttribute("data-price", product.price);
    div.setAttribute("data-name", product.name);

    div.innerHTML = `
      <p class="product-name">${product.name}</p>
      <div class="controls">
        <button onclick="decrementClick(this.parentElement.parentElement)">-</button>
        <span class="click-counter" style="display:none">0</span>
        <button onclick="incrementClick(this.parentElement.parentElement)">+</button>
      </div>
      <p>Estoque: <strong>${product.stock}</strong></p>
    `;

    container.appendChild(div);
  });
}


async function incrementClick(product) {

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
  updateFinalizeButton();
  await updateStock(product.getAttribute('data-name'), 1);
}


async function decrementClick(product) {

  const counter = product.querySelector('.click-counter');
  const count = Math.max(0, parseInt(counter.textContent) - 1);
  counter.textContent = count;
  if (count === 0) counter.style.display = 'none';

  const name = product.getAttribute('data-name');
  let cart = JSON.parse(sessionStorage.getItem('cart')) || {};
  if (cart[name]) {
    cart[name].quantity = Math.max(0, cart[name].quantity - 1);
    if (cart[name].quantity === 0) delete cart[name];
  }

  sessionStorage.setItem('cart', JSON.stringify(cart));
  updateFinalizeButton();
  await updateStock(product.getAttribute('data-name'), 1);
}

function updateFinalizeButton() {
  const cart = JSON.parse(sessionStorage.getItem('cart')) || {};
  const hasItems = Object.keys(cart).length > 0;
  const finalizeButton = document.querySelector('.finalizar-pedido');

  if (finalizeButton) {
    finalizeButton.style.backgroundColor = hasItems ? '#60ff60' : '';
    finalizeButton.disabled = !hasItems;
  }
}

function updateTotal() {
  // Esta função pode ser implementada conforme necessidade para somar valores do carrinho
}

async function updateStock(productName, delta) {
  const { data, error } = await supabase
    .from("produtos")
    .select("id, stock")
    .eq("name", productName)
    .maybeSingle();

  if (error || !data) {
    console.error("Erro ao buscar produto para atualizar estoque:", error);
    return;
  }

  const newStock = Math.max(0, data.stock + delta);

  const { error: updateError } = await supabase
    .from("produtos")
    .update({ stock: newStock })
    .eq("id", data.id);

  if (updateError) {
    console.error("Erro ao atualizar estoque no Supabase:", updateError.message);
  }
}
