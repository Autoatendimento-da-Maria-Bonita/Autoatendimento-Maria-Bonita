// Dados de exemplo para produtos (remover ao integrar com backend)
const mockProducts = [
    {
      id: 1,
      name: "Hambúrguer Clássico",
      category: "Comidas",
      price: 18.9,
      stock: 50,
      image: "imagem",
    },
    {
      id: 2,
      name: "Batata Frita Grande",
      category: "Comidas",
      price: 12.5,
      stock: 100,
      image: "imagem",
    },
    {
      id: 3,
      name: "Refrigerante Cola",
      category: "Bebidas",
      price: 6.0,
      stock: 200,
      image: "imagem",
    },
    {
      id: 4,
      name: "Sorvete de Chocolate",
      category: "Doces",
      price: 8.5,
      stock: 30,
      image: "imagem",
    },
    {
      id: 5,
      name: "Combo Família",
      category: "Combos",
      price: 49.9,
      stock: 15,
      image: "imagem",
    },
  ]
  
  // Variáveis globais
  let currentProductId = null
  let isUpdateConfirmationNeeded = true
  
  // Inicialização
  document.addEventListener("DOMContentLoaded", () => {
    // Configurar event listeners
    setupEventListeners()
  
    // Não precisamos do spinner de carregamento já que os produtos estão carregados estaticamente
    const loadingSpinner = document.getElementById("loading-spinner")
    if (loadingSpinner) {
      loadingSpinner.style.display = "none"
    }
  })
  
  // Configurar event listeners
  function setupEventListeners() {
    // Botão para adicionar produto - Agora é um link para produtos_service.html
    // Não precisamos adicionar event listener aqui, pois é um link <a>
  
    // Botões de editar produto
    document.querySelectorAll(".product-item__edit-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-id")
        const productName = button.getAttribute("data-name")
        openEditProductModal(productId, productName)
      })
    })
  
    // Botões de excluir produto
    document.querySelectorAll(".product-item__delete-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-id")
        const productName = button.getAttribute("data-name")
        openDeleteConfirmModal(productId, productName)
      })
    })
  
    // Modal de produto
    document.getElementById("close-modal").addEventListener("click", closeProductModal)
    document.getElementById("cancel-button").addEventListener("click", closeProductModal)
    document.getElementById("product-form").addEventListener("submit", handleProductFormSubmit)
  
    // Preview de imagem
    document.getElementById("product-image").addEventListener("input", updateImagePreview)
  
    // Modal de confirmação de exclusão
    document.getElementById("close-confirm-delete-modal").addEventListener("click", closeConfirmDeleteModal)
    document.getElementById("cancel-delete").addEventListener("click", closeConfirmDeleteModal)
    document.getElementById("confirm-delete").addEventListener("click", handleDeleteProduct)
  
    // Modal de confirmação de atualização
    document.getElementById("close-confirm-update-modal").addEventListener("click", closeConfirmUpdateModal)
    document.getElementById("cancel-update").addEventListener("click", closeConfirmUpdateModal)
    document.getElementById("confirm-update").addEventListener("click", handleConfirmUpdate)
  
    // Toast
    document.getElementById("toast-close").addEventListener("click", hideToast)
  
    // Filtros
    document.getElementById("search-input").addEventListener("input", handleSearch)
    document.getElementById("category-filter").addEventListener("change", handleCategoryFilter)
    document.getElementById("sort-filter").addEventListener("change", handleSort)
    document.getElementById("clear-filters").addEventListener("click", clearFilters)
  
    // Paginação
    document.getElementById("prev-page").addEventListener("click", () => changePage(-1))
    document.getElementById("next-page").addEventListener("click", () => changePage(1))
  }
  
  // Abrir modal para editar produto
  function openEditProductModal(productId, productName) {
    // REMOVER ESTE BLOCO AO INTEGRAR COM BACKEND
    // Buscar produto pelo ID nos dados de exemplo
    const product = mockProducts.find((p) => p.id == productId)
    if (!product) return
  
    const modal = document.getElementById("product-modal")
    const modalTitle = document.getElementById("modal-title")
    const form = document.getElementById("product-form")
  
    // Preencher o formulário
    document.getElementById("product-id").value = product.id
    document.getElementById("product-name").value = product.name
    document.getElementById("product-category").value = product.category
    document.getElementById("product-price").value = product.price
    document.getElementById("product-stock").value = product.stock
    document.getElementById("product-image").value = product.image
  
    // Atualizar preview da imagem
    updateImagePreview()
  
    // Configurar o modal
    modalTitle.textContent = `Editar Produto: ${productName}`
    currentProductId = product.id
    isUpdateConfirmationNeeded = true
  
    // Mostrar o modal
    modal.classList.add("active")
  }
  
  // Fechar modal de produto
  function closeProductModal() {
    const modal = document.getElementById("product-modal")
    modal.classList.remove("active")
  }
  
  // Atualizar preview da imagem
  function updateImagePreview() {
    const imageUrl = document.getElementById("product-image").value
    const previewImage = document.getElementById("preview-image")
    const placeholder = document.querySelector(".image-preview__placeholder")
  
    if (imageUrl) {
      previewImage.src = imageUrl
      previewImage.style.display = "block"
      placeholder.style.display = "none"
    } else {
      previewImage.style.display = "none"
      placeholder.style.display = "flex"
    }
  }
  
  // Lidar com envio do formulário de produto
  function handleProductFormSubmit(event) {
    event.preventDefault()
  
    // Obter dados do formulário
    const productId = document.getElementById("product-id").value
    const name = document.getElementById("product-name").value
    const category = document.getElementById("product-category").value
    const price = Number.parseFloat(document.getElementById("product-price").value)
    const stock = Number.parseInt(document.getElementById("product-stock").value)
    const imageUrl = document.getElementById("product-image").value
  
    // Se for uma atualização, mostrar o modal de confirmação
    if (productId && isUpdateConfirmationNeeded) {
      openUpdateConfirmModal({
        name,
        category,
        price,
        stock,
        imageUrl,
      })
      return
    }
  
    // REMOVER ESTE BLOCO AO INTEGRAR COM BACKEND
    // Simular salvamento
    if (productId) {
      showToast(`Produto "${name}" atualizado com sucesso!`)
    } else {
      showToast(`Produto "${name}" adicionado com sucesso!`)
    }
  
    // Fechar o modal
    closeProductModal()
  
    // REMOVER ESTE BLOCO AO INTEGRAR COM BACKEND
    // Recarregar a página para simular atualização
    // Na implementação real, você atualizaria a lista de produtos sem recarregar
    // setTimeout(() => location.reload(), 1500);
  }
  
  // Abrir modal de confirmação para atualizar produto
  function openUpdateConfirmModal(productData) {
    const modal = document.getElementById("confirm-update-modal")
  
    // Preencher os dados do resumo
    document.getElementById("summary-name").textContent = productData.name
    document.getElementById("summary-category").textContent = productData.category
    document.getElementById("summary-price").textContent = `R$ ${productData.price.toFixed(2).replace(".", ",")}`
    document.getElementById("summary-stock").textContent = `${productData.stock} un.`
  
    // Mostrar o modal
    modal.classList.add("active")
  }
  
  // Fechar modal de confirmação de atualização
  function closeConfirmUpdateModal() {
    const modal = document.getElementById("confirm-update-modal")
    modal.classList.remove("active")
  }
  
  // Lidar com confirmação de atualização
  function handleConfirmUpdate() {
    // Obter dados do formulário
    const name = document.getElementById("product-name").value
  
    // Fechar os modais
    closeConfirmUpdateModal()
    closeProductModal()
  
    // Mostrar toast de sucesso
    showToast(`Produto "${name}" atualizado com sucesso!`)
  }
  
  // Abrir modal de confirmação para excluir produto
  function openDeleteConfirmModal(productId, productName) {
    // REMOVER ESTE BLOCO AO INTEGRAR COM BACKEND
    // Buscar produto pelo ID nos dados de exemplo
    const product = mockProducts.find((p) => p.id == productId)
    if (!product) return
  
    const modal = document.getElementById("confirm-delete-modal")
    const confirmMessage = document.getElementById("confirm-delete-message")
  
    confirmMessage.textContent = `Tem certeza que deseja excluir o produto "${productName}"? Esta ação não pode ser desfeita.`
    currentProductId = product.id
  
    modal.classList.add("active")
  }
  
  // Fechar modal de confirmação de exclusão
  function closeConfirmDeleteModal() {
    const modal = document.getElementById("confirm-delete-modal")
    modal.classList.remove("active")
  }
  
  // Lidar com exclusão de produto
  function handleDeleteProduct() {
    if (!currentProductId) return
  
    // REMOVER ESTE BLOCO AO INTEGRAR COM BACKEND
    // Simular exclusão
    const product = mockProducts.find((p) => p.id == currentProductId)
    if (product) {
      showToast(`Produto "${product.name}" excluído com sucesso!`)
    }
  
    // Fechar o modal
    closeConfirmDeleteModal()
  
    // REMOVER ESTE BLOCO AO INTEGRAR COM BACKEND
    // Recarregar a página para simular atualização
    // Na implementação real, você atualizaria a lista de produtos sem recarregar
    // setTimeout(() => location.reload(), 1500);
  }
  
  // Funções de filtro
  function handleSearch() {
    // IMPLEMENTAR AO INTEGRAR COM BACKEND
    console.log("Função de busca será implementada na integração")
  }
  
  function handleCategoryFilter() {
    // IMPLEMENTAR AO INTEGRAR COM BACKEND
    console.log("Função de filtro por categoria será implementada na integração")
  }
  
  function handleSort() {
    // IMPLEMENTAR AO INTEGRAR COM BACKEND
    console.log("Função de ordenação será implementada na integração")
  }
  
  function clearFilters() {
    document.getElementById("search-input").value = ""
    document.getElementById("category-filter").value = ""
    document.getElementById("sort-filter").value = "name-asc"
  
    // IMPLEMENTAR AO INTEGRAR COM BACKEND
    console.log("Função de limpar filtros será implementada na integração")
  }
  
  // Funções de paginação
  function changePage(direction) {
    // IMPLEMENTAR AO INTEGRAR COM BACKEND
    console.log(`Função de mudar página (${direction}) será implementada na integração`)
  }
  
  // Mostrar toast
  function showToast(message, type = "success") {
    const toast = document.getElementById("toast")
    const toastMessage = document.getElementById("toast-message")
  
    toastMessage.textContent = message
    toast.className = "toast show"
  
    if (type === "error") {
      toast.classList.add("error")
    }
  
    // Esconder automaticamente após 5 segundos
    setTimeout(() => {
      hideToast()
    }, 5000)
  }
  
  // Esconder toast
  function hideToast() {
    const toast = document.getElementById("toast")
    toast.classList.remove("show")
    toast.classList.remove("error")
  }