import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Inicializa o Supabase
const supabase = createClient(
  "https://tvnuasxggudcegiclpzp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bnVhc3hnZ3VkY2VnaWNscHpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4ODYwNjgsImV4cCI6MjA1OTQ2MjA2OH0.0irQipVPIzSnsarcw6MJnmTcwKqnfuG_KkmHimV0poY",
  {
    auth: {
      persistSession: true,
    },
  },
)

const loginForm = document.getElementById("login-form")
const recuperarForm = document.getElementById("recuperar-form")
const loginTab = document.querySelector('[data-tab="login"]')
const recuperarTab = document.querySelector('[data-tab="recuperar"]')
const loginContent = document.getElementById("login-content")
const recuperarContent = document.getElementById("recuperar-content")
const notification = document.getElementById("notification")
const notificationMessage = document.getElementById("notification-message")
const togglePasswordButton = document.querySelector(".toggle-password")
const passwordInput = document.getElementById("senha")

loginTab.addEventListener("click", () => {
  setActiveTab("login")
})

recuperarTab.addEventListener("click", () => {
  setActiveTab("recuperar")
})

function setActiveTab(tab) {
  loginTab.classList.toggle("login-tab--active", tab === "login")
  recuperarTab.classList.toggle("login-tab--active", tab === "recuperar")

  loginContent.classList.toggle("hidden", tab !== "login")
  recuperarContent.classList.toggle("hidden", tab !== "recuperar")
}

togglePasswordButton.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
  passwordInput.setAttribute("type", type)

  const eyeIcon = togglePasswordButton.querySelector(".eye-icon")
  if (type === "text") {
    eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `
  } else {
    eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `
  }
})

function showNotification(message, type = "error") {
  notificationMessage.textContent = message
  notification.classList.add("show")
  notification.classList.remove("success", "error")
  notification.classList.add(type)

  setTimeout(() => {
    notification.classList.remove("show")
  }, 5000)
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const senha = loginForm.senha.value

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    })

    if (error) throw error

    showNotification("Login realizado com sucesso! Redirecionando...", "success")

    setTimeout(() => {
      window.location.href = "index"
    }, 1500)
  } catch (error) {
    showNotification("Erro ao fazer login: ")
    console.error("Erro de login:")
  }
})

recuperarForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const email = recuperarForm["recuperar-email"].value

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    })

    if (error) throw error

    showNotification("Instruções de recuperação enviadas para seu e-mail!", "success")

    setTimeout(() => {
      setActiveTab("login")
    }, 2000)
  } catch (error) {
    showNotification("Erro ao solicitar recuperação: ")
    console.error("Erro de recuperação:")
  }
})

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".login-container").classList.add("animate")

  document.getElementById("email").focus()
})