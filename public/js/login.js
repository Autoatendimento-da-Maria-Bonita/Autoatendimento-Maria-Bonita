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

const form = document.getElementById("login-form");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = form.email.value;
    const senha = form.senha.value;
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: senha
        });

        if (error) throw error;

        // Se o login for bem-sucedido, redireciona para a página inicial
        window.location.href = 'index.html';
    } catch (error) {
        mensagem.textContent = "Erro ao fazer login: " + error.message;
        console.error('Erro de login:', error);
    }
}); 