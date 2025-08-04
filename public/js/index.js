document.addEventListener("DOMContentLoaded", () => {
	const total_vendas_dashboard = document.getElementById("kpi-card-value-sales");
	const valor_liquido_dashboard = document.getElementById("kpi-card-value-revenue");

	// Debug: verificar se os elementos foram encontrados
	console.log('Elemento vendas:', total_vendas_dashboard);
	console.log('Elemento receita:', valor_liquido_dashboard);

	// Buscar dados do total de pedidos
	fetch("/pedidos/total", {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Erro na requisição');
		}
		return response.json();
	})
	.then(data => {
		console.log('Dados recebidos da API:', data); // Debug
		
		// A API retorna um array, então pegamos o primeiro elemento
		const resultado = data[0];
		console.log('Resultado extraído:', resultado); // Debug
		
		if (total_vendas_dashboard && valor_liquido_dashboard) {
			// Atualizar número total de vendas (sem R$ pois é quantidade)
			total_vendas_dashboard.innerHTML = `${resultado.total_pedidos || 0}`;
			
			// Atualizar valor líquido total (com R$ pois é valor monetário)
			const valorTotal = parseFloat(resultado.valor_total) || 0;
			valor_liquido_dashboard.innerHTML = `R$ ${valorTotal.toFixed(2)}`;
			
			console.log('Valores atualizados - Vendas:', resultado.total_pedidos, 'Receita:', valorTotal);
		} else {
			console.error('Elementos não encontrados no DOM');
		}
	})
	.catch(error => {
		console.error('Erro ao carregar dados:', error);
		total_vendas_dashboard.innerHTML = '0';
		valor_liquido_dashboard.innerHTML = 'R$ 0,00';
	});
});