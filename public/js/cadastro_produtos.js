const checkUser = async () => {
    const username = localStorage.getItem("username");
    const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ username }),
    });
    const data = await response.json();
};

// Pega o ID da URL (modo edição)
const params = new URLSearchParams(window.location.search);
const produtoId = params.get("id");

const form = document.getElementById("product-form");
const mensagem = document.getElementById("mensagem");


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

    const categoriaValor = document.getElementById("categoria").value;

    const uploadData = new FormData();
    uploadData.append("imagem", imagemFile);
    uploadData.append("categoria", categoriaValor);

    let imageUrl;

    try {
        const response = await fetch("/upload", {
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
        quantidade_estoque: parseInt(formData.get("quantidade_estoque")),
    };

    // Remover 'id' se for um novo produto (não enviar no insert)
    delete dados.id;

    let result;
    try {
        if (produtoId) {
            // Atualizar o produto existente
            result = await fetch(`/api/produtos:${produtoID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            });
        }
        else {
            // Inserir novo produto, sem enviar 'id'
            result = await fetch("/api/produtos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            });
        }

        const { error } = result;

        if (error) {
            throw error;
        }

        mensagem.textContent = produtoId ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!";
        mensagem.style.color = "green";
        if (!produtoId) form.reset();
    } 
    catch (error) {
        mensagem.textContent = produtoId ? "Erro ao atualizar produto: " + error.message : "Erro ao cadastrar produto: " + error.message;
        mensagem.style.color = "red";
    }
});