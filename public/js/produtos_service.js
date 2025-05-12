import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Inicializa o Supabase
const supabase = createClient(
    "https://tvnuasxggudcegiclpzp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bnVhc3hnZ3VkY2VnaWNscHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4ODYwNjgsImV4cCI6MjA1OTQ2MjA2OH0.0irQipVPIzSnsarcw6MJnmTcwKqnfuG_KkmHimV0poY",
    {
        auth: {
            persistSession: true
        }
    }
);

// Verifica se há um usuário autenticado
const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        window.location.href = '/html/login.html';
        return false;
    }
    return true;
};

// Pega o ID da URL (modo edição)
const params = new URLSearchParams(window.location.search);
const produtoId = params.get("id");

const form = document.getElementById("product-form");
const mensagem = document.getElementById("mensagem");

// Verifica autenticação antes de continuar
await checkUser();

// Se tiver ID, busca os dados do produto e preenche o formulário
if (produtoId) {
    const { data, error } = await supabase.from("produtos").select("*").eq("id", produtoId).single();

    if (error) {
        mensagem.textContent = "Erro ao carregar produto.";
        mensagem.style.color = "red";
    } else {
        for (const campo in data) {
            const input = form.querySelector(`[name="${campo}"]`);
            if (input && campo !== "imagem_url") {
                input.value = data[campo];
            }
        }
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("categoria", document.getElementById("categoria").value);
    const imagemFile = formData.get("imagem");
    
    if (!imagemFile || imagemFile.size === 0) {
        mensagem.textContent = "Imagem não selecionada ou inválida.";
        mensagem.style.color = "red";
        return;
    }
    
    if (!imagemFile || imagemFile.size === 0) {
        mensagem.textContent = "Imagem não selecionada ou inválida.";
        mensagem.style.color = "red";
        return;
    }

    const categoriaValor = document.getElementById("categoria").value;

    const uploadData = new FormData();
    uploadData.append("imagem", imagemFile);
    uploadData.append("categoria", categoriaValor);

    let imageUrl;

    try {
        const response = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: uploadData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Erro no upload");
        }

        imageUrl = result.imageUrl;

        if (!imageUrl) {
            throw new Error("URL da imagem não retornada pelo servidor");
        }
    } catch (err) {
        mensagem.textContent = "Erro ao enviar imagem: " + err.message;
        mensagem.style.color = "red";
        return;
    }

    // Prepara os dados
    const dados = {
        nome: formData.get("nome"),
        preco: parseFloat(formData.get("preco")),
        categoria: categoriaValor,
        imagem_url: imageUrl,
        Quantidade_em_estoque: parseInt(formData.get("Quantidade_em_estoque")),
    };

    // Remover 'id' se for um novo produto (não enviar no insert)
    delete dados.id;

    let result;
    try {
        if (produtoId) {
            // Atualizar o produto existente
            result = await supabase.from("produtos").update(dados).eq("id", produtoId);
        } else {
            // Inserir novo produto, sem enviar 'id'
            result = await supabase.from("produtos").insert(dados);
        }

        const { error } = result;

        if (error) {
            throw error;
        }

        mensagem.textContent = produtoId
            ? "Produto atualizado com sucesso!"
            : "Produto cadastrado com sucesso!";
        mensagem.style.color = "green";
        if (!produtoId) form.reset();
    } catch (error) {
        mensagem.textContent = produtoId
            ? "Erro ao atualizar produto: " + error.message
            : "Erro ao cadastrar produto: " + error.message;
        mensagem.style.color = "red";
    }
});