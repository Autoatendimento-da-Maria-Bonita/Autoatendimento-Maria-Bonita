const loginForm = document.getElementById("login-form")
const recuperarForm = document.getElementById("recuperar-form")
const loginTab = document.querySelector('[data-tab="login"]')
const recuperarTab = document.querySelector('[data-tab="recuperar"]')
const loginContent = document.getElementById("login-content")
const recuperarContent = document.getElementById("recuperar-content")
const notification = document.getElementById("notification")
const notificationMessage = document.getElementById("notification-message")
const togglePasswordButton = document.querySelector(".toggle-password")
const passwordInput = document.getElementById("password")

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
	e.preventDefault();

	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	try {
		const response = await fetch("/user/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();

		if (response.ok && data.success) {
			localStorage.setItem("username", username);
			showNotification("Login realizado com sucesso!", "success");

			// Pequeno delay antes de redirecionar (opcional)
			setTimeout(() => {
				window.location.href = "/index";
			}, 1000);
		} else {
			showNotification(data.message || "Falha ao fazer login.");
		}
	} catch (error) {
		console.error("Erro ao fazer login:", error);
		showNotification("Erro de conexão com o servidor.");
	}
});


recuperarForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const username = document.getElementById("username").value;

	try {
		const response = await fetch("/user/recuperar-password", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username })
		});

		const data = await response.json();

		if (response.ok && data.success) {
			showNotification("username de recuperação enviado com sucesso!", "success");
		} else {
			showNotification(data.message || "Falha ao enviar username de recuperação.");
		}
	} catch (error) {
		console.error("Erro ao enviar username de recuperação:", error);
		showNotification("Erro de conexão com o servidor.");
	}
});

document.addEventListener("DOMContentLoaded", () => {
	document.querySelector(".login-container").classList.add("animate")

	document.getElementById("username").focus()
})