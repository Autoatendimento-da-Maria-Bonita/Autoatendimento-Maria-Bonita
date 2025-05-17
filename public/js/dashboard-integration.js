import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://tvnuasxggudcegiclpzp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bnVhc3hnZ3VkY2VnaWNscHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4ODYwNjgsImV4cCI6MjA1OTQ2MjA2OH0.0irQipVPIzSnsarcw6MJnmTcwKqnfuG_KkmHimV0poY",
  {
    auth: {
      persistSession: true,
    },
  }
);

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

async function loadDashboardData() {
  try {
    const { data, error } = await supabase
      .from('vendas')
      .select('*');

    if (error) throw error;

    updateTotalSales(data);
    updateSalesByCategory(data);
    updateTopProducts(data);
    updateRatings(data);

  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
  }
}

function updateTotalSales(data) {
  const totalSales = data.reduce((total, item) => total + Number(item.total_value), 0);
  const totalSalesElement = document.querySelector('.kpi-card__value');
  totalSalesElement.textContent = formatCurrency(totalSales);
}

function updateSalesByCategory(data) {
  const salesByCategory = data.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = 0;
    }
    acc[item.type] += Number(item.total_value);
    return acc;
  }, {});

  const categoriesArray = Object.entries(salesByCategory).map(([category, value]) => ({
    category,
    value
  })).sort((a, b) => b.value - a.value);

  const maxValue = categoriesArray.length > 0 ? categoriesArray[0].value : 0;
  const chartContainer = document.querySelector('.chart-placeholder');

  chartContainer.innerHTML = '';

  categoriesArray.forEach(item => {
    const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
    
    const barElement = document.createElement('div');
    barElement.className = 'chart-bar';
    barElement.style.height = `${percentage}%`;
    barElement.setAttribute('data-label', item.category);
    barElement.setAttribute('data-value', formatCurrency(item.value));
    
    chartContainer.appendChild(barElement);
  });
}

function updateTopProducts(data) {
  const productCounts = data.reduce((acc, item) => {
    if (!acc[item.item]) {
      acc[item.item] = 0;
    }
    acc[item.item] += 1;
    return acc;
  }, {});

  const productsArray = Object.entries(productCounts).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count);

  const topProducts = productsArray.slice(0, 5);
  const maxCount = topProducts.length > 0 ? topProducts[0].count : 0;
  const productList = document.querySelector('.product-list');
  productList.innerHTML = '';

  topProducts.forEach((product, index) => {
    const percentage = maxCount > 0 ? (product.count / maxCount) * 100 : 0;
    
    const listItem = document.createElement('li');
    listItem.className = 'product-item';
    
    listItem.innerHTML = `
      <span class="product-rank">${index + 1}</span>
      <span class="product-name">${product.name}</span>
      <div class="product-bar">
        <div class="product-bar__fill" style="width: ${percentage}%;"></div>
      </div>
      <span class="product-value">${product.count} un.</span>
    `;
    
    productList.appendChild(listItem);
  });
}

function updateRatings(data) {
  const totalRatings = data.length;
  const sumRatings = data.reduce((sum, item) => sum + Number(item.avaliacao || 0), 0);
  const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
  const ratingAverageElement = document.querySelector('.rating-average__value');
  ratingAverageElement.textContent = averageRating.toFixed(1);
  
  updateStars(document.querySelector('.rating-average__stars'), averageRating);
  
  const ratingCounts = data.reduce((acc, item) => {
    const rating = Number(item.avaliacao || 0);
    if (rating >= 1 && rating <= 5) {
      acc[rating] = (acc[rating] || 0) + 1;
    }
    return acc;
  }, {});
  
  const ratingPercentages = {};
  for (let i = 1; i <= 5; i++) {
    ratingPercentages[i] = totalRatings > 0 ? ((ratingCounts[i] || 0) / totalRatings) * 100 : 0;
  }
  
  const ratingBars = document.querySelectorAll('.rating-bar-container');
  ratingBars.forEach((bar, index) => {
    const rating = 5 - index;
    const percentage = ratingPercentages[rating] || 0;
    
    const fillElement = bar.querySelector('.rating-bar__fill');
    fillElement.style.width = `${percentage}%`;
    
    const countElement = bar.querySelector('.rating-count');
    countElement.textContent = `${Math.round(percentage)}%`;
  });

  updateLatestRatings(data);
}

function updateStars(starsContainer, rating) {
  const stars = starsContainer.querySelectorAll('.star');
  
  stars.forEach((star, index) => {
    star.className = 'star';
    
    if (index < Math.floor(rating)) {
      star.classList.add('star--filled');
    } else if (index < Math.ceil(rating) && rating % 1 >= 0.5) {
      star.classList.add('star--half');
    }
  });
}

function updateLatestRatings(data) {
  const sortedData = [...data].sort((a, b) => new Date(b.data) - new Date(a.data));
  const latestRatings = sortedData.slice(0, 3);  
  const ratingsContainer = document.querySelector('.latest-ratings__list');
  ratingsContainer.innerHTML = '';

  latestRatings.forEach(rating => {
    const ratingElement = document.createElement('div');
    ratingElement.className = 'latest-rating-item';
    
    const starsContainer = document.createElement('div');
    starsContainer.className = 'latest-rating-stars';

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = i <= rating.avaliacao ? 'star star--filled' : 'star';
      star.textContent = '★';
      starsContainer.appendChild(star);
    }
    
    ratingElement.innerHTML = `
      <div class="latest-rating-date">${formatDate(rating.data)}</div>
    `;
    
    ratingElement.appendChild(starsContainer);
    ratingsContainer.appendChild(ratingElement);
  });
}

document.addEventListener('DOMContentLoaded', loadDashboardData);

document.addEventListener('DOMContentLoaded', function() {
  const periodSelect = document.querySelector('.chart-card__select');
  if (periodSelect) {
    periodSelect.addEventListener('change', loadDashboardData);
  }
});