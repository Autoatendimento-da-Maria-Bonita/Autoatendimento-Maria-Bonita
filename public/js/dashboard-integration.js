import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabase = createClient(
  "https://tvnuasxggudcegiclpzp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bnVhc3hnZ3VkY2VnaWNscHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4ODYwNjgsImV4cCI6MjA1OTQ2MjA2OH0.0irQipVPIzSnsarcw6MJnmTcwKqnfuG_KkmHimV0poY",
  {
    auth: {
      persistSession: true,
    },
  },
)

async function getTotalSales() {
  try {
    const { data, error } = await supabase.from("vendas").select("valor_total")

    if (error) throw error

    const totalSales = data.reduce((sum, item) => sum + Number.parseFloat(item.valor_total), 0)

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(totalSales)
  } catch (error) {
    console.error("Error fetching total sales:", error)
    return "R$ 0,00"
  }
}

async function getSalesByCategory() {
  try {
    const { data, error } = await supabase.from("vendas_itens").select(`
                quantidade, 
                valor_unitario,
                produtos(categoria)
            `)

    if (error) throw error

    const categorySales = {}

    data.forEach((item) => {
      const categoria = item.produtos?.categoria || "Sem categoria"
      const valorItem = Number.parseFloat(item.quantidade) * Number.parseFloat(item.valor_unitario)

      if (!categorySales[categoria]) {
        categorySales[categoria] = 0
      }

      categorySales[categoria] += valorItem
    })

    return Object.entries(categorySales)
      .map(([categoria, valor]) => ({
        categoria,
        valor,
        valorFormatado: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(valor),
      }))
      .sort((a, b) => b.valor - a.valor)
  } catch (error) {
    console.error("Error fetching sales by category:", error)
    return []
  }
}

async function getTopProducts(limit = 5) {
  try {
    const { data, error } = await supabase.from("vendas_itens").select(`
                quantidade,
                produtos(id, nome)
            `)

    if (error) throw error

    const productSales = {}

    data.forEach((item) => {
      if (!item.produtos) return

      const productId = item.produtos.id
      const productName = item.produtos.nome
      const quantity = Number.parseInt(item.quantidade)

      if (!productSales[productId]) {
        productSales[productId] = {
          id: productId,
          nome: productName,
          quantidade: 0,
        }
      }

      productSales[productId].quantidade += quantity
    })

    return Object.values(productSales)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, limit)
  } catch (error) {
    console.error("Error fetching top products:", error)
    return []
  }
}

function updateTotalSalesDisplay(totalSales) {
  const totalSalesElement = document.querySelector(".kpi-card__value")
  if (totalSalesElement) {
    totalSalesElement.textContent = totalSales
  }
}

function updateSalesByCategoryChart(salesByCategory) {
  const chartContainer = document.querySelector(".chart-placeholder")
  if (!chartContainer) return

  chartContainer.innerHTML = ""

  const highestValue = Math.max(...salesByCategory.map((item) => item.valor))

  salesByCategory.forEach((item) => {
    const heightPercentage = Math.max(10, Math.round((item.valor / highestValue) * 90))

    const barElement = document.createElement("div")
    barElement.className = "chart-bar"
    barElement.style.height = `${heightPercentage}%`
    barElement.setAttribute("data-label", item.categoria)
    barElement.setAttribute("data-value", item.valorFormatado)

    chartContainer.appendChild(barElement)
  })
}

function updateTopProductsList(topProducts) {
  const productList = document.querySelector(".product-list")
  if (!productList) return

  productList.innerHTML = ""

  const highestQuantity = Math.max(...topProducts.map((item) => item.quantidade))

  topProducts.forEach((product, index) => {
    const widthPercentage = Math.max(10, Math.round((product.quantidade / highestQuantity) * 90))

    const listItem = document.createElement("li")
    listItem.className = "product-item"
    listItem.innerHTML = `
            <span class="product-rank">${index + 1}</span>
            <span class="product-name">${product.nome}</span>
            <div class="product-bar">
                <div class="product-bar__fill" style="width: ${widthPercentage}%;"></div>
            </div>
            <span class="product-value">${product.quantidade} un.</span>
        `

    productList.appendChild(listItem)
  })
}

async function updateDashboard() {
  try {
    document.body.classList.add("loading")

    const [totalSales, salesByCategory, topProducts] = await Promise.all([
      getTotalSales(),
      getSalesByCategory(),
      getTopProducts(5),
    ])

    updateTotalSalesDisplay(totalSales)
    updateSalesByCategoryChart(salesByCategory)
    updateTopProductsList(topProducts)

    console.log("Dashboard updated successfully!")
  } catch (error) {
    console.error("Error updating dashboard:", error)
  } finally {
    document.body.classList.remove("loading")
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateDashboard()

  setInterval(updateDashboard, 5 * 60 * 1000)

  const periodSelect = document.querySelector(".chart-card__select")
  if (periodSelect) {
    periodSelect.addEventListener("change", updateDashboard)
  }
})
