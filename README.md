# 🧾 Sistema de Autoatendimento — Lanchonete Maria Bonita

Este projeto é um sistema de autoatendimento desenvolvido para a lanchonete **Maria Bonita**, com o objetivo de agilizar pedidos e otimizar o atendimento ao cliente.  

A proposta principal é acelerar o processo de pedidos e pagamentos, prevenindo filas longas e permitindo que vários clientes façam seus pedidos simultaneamente em totens independentes.

## 📌 Objetivo

Melhorar a experiência do cliente em lanchonetes de alta movimentação, reduzindo o tempo de espera e otimizando o fluxo de pedidos por meio de um sistema intuitivo.


## 🧩 Funcionalidades

- **Tela inicial**: Interface simples onde o cliente insere seu nome para identificar o pedido.
- **Tela de compras**: Permite seleção de produtos com contador de quantidade para cada item.
- **Tela de pagamento**:
  - Exibe um resumo do pedido com valores individuais e o total.
  - Integração com **Mercado Pago** para pagamento via cartão, pix ou boleto.
- **Criação e envio de pedidos** para o banco de dados.
- **Consulta de status do pedido**.
- **Painel administrativo**: Visualização de vendas e gerenciamento de produtos.
- **Popup de avaliação** após o pagamento para coletar feedback do cliente.


## 🛠️ Tecnologias Utilizadas

### 🔹 Frontend
- **HTML**, **CSS**, **JavaScript** — Interface do cliente (totem), incluindo armazenamento local dos produtos selecionados e navegação entre telas.

### 🔹 Backend
- **Node.js** + **Express** — API REST para comunicação entre frontend e banco de dados.
- **Supabase** — Backend as a Service com banco de dados **PostgreSQL**.
- **Mercado Pago SDK** — Para criação de preferências de pagamento e redirecionamento seguro ao checkout.


## 📧 Contato

Desenvolvido por: 
[Adrian J. Quindeler](https://github.com/Adrian-Quindeler),  
[Matheus Oliveira](https://github.com/Matheus-Oli),  
[Oswaldo T. F. Júnior](https://github.com/raijnn),  
[George Belo R. Santos](https://github.com/ManoGeWP),  