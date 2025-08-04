document.addEventListener("DOMContentLoaded", () => {
	const accessSpan = document.querySelector(".header-back")
	const nameInput = document.getElementById("name")
	const continueLink = document.getElementById("continueLink")
	const nameForm = document.getElementById("nameForm")
	const savedName = sessionStorage.getItem("cliente") || localStorage.getItem("cliente")

	if (savedName) {
		nameInput.value = savedName
	}

	continueLink.addEventListener("click", function (e) {
		const name = nameInput.value.trim()
		if (!name) {
			e.preventDefault()
			nameInput.classList.add("form__input--error")
			document.querySelector(".form__error").style.display = "block"
			nameInput.focus()
		} else {
			sessionStorage.setItem("cliente", name)
			localStorage.setItem("cliente", name)
		}
	})

	nameInput.addEventListener("input", function () {
		if (nameInput.value.trim()) {
			nameInput.classList.remove("form__input--error")
			document.querySelector(".form__error").style.display = "none"
		}
	})

	nameForm.addEventListener("submit", function (e) {
		e.preventDefault()
		if (!nameInput.value.trim()) {
			nameInput.classList.add("form__input--error")
			document.querySelector(".form__error").style.display = "block"
		} else {
			sessionStorage.setItem("cliente", nameInput.value.trim())
			localStorage.setItem("cliente", nameInput.value.trim())
			window.location.href = "/tela_compras"
		}
	})

	const overlay = document.createElement("div")
	overlay.className = "overlay"
	overlay.style.display = "none"

	const popup = document.createElement("div")
	popup.className = "popup"
	popup.style.display = "none"

	popup.innerHTML = `
        <div class="popup-header">
            <h2>Logout</h2>
            <button id="closeButton" class="close-button" aria-label="Fechar">&times;</button>
        </div>
        <div class="popup-content">
            <p class="popup-message">Tem certeza que deseja sair da tela de seleção de produtos?</p>
            <p class="popup-instruction">Digite a senha de acesso para voltar:</p>
            <input type="password" id="password" placeholder="Senha" aria-label="Senha de acesso">
            <button id="confirmButton">Sair</button>
        </div>
    `

	document.body.appendChild(overlay)
	document.body.appendChild(popup)

	const customAlert = document.createElement("div")
	customAlert.className = "custom-alert"
	customAlert.style.display = "none"
	customAlert.innerHTML = `
        <div class="custom-alert-content">
            <p id="alertMessage"></p>
            <button id="alertCloseButton">OK</button>
        </div>
    `
	document.body.appendChild(customAlert)

	function showCustomAlert(message) {
		document.getElementById("alertMessage").textContent = message
		customAlert.style.display = "flex"
		setTimeout(() => customAlert.classList.add("show"), 10)
	}

	document.getElementById("alertCloseButton").addEventListener("click", () => {
		customAlert.classList.remove("show")
		setTimeout(() => (customAlert.style.display = "none"), 300)
	})

	accessSpan.addEventListener("click", () => {
		overlay.style.display = "block"
		popup.style.display = "block"
		setTimeout(() => {
			popup.classList.add("show")
			overlay.classList.add("show")
		}, 10)
	})

	function closePopup() {
		popup.classList.remove("show")
		overlay.classList.remove("show")
		setTimeout(() => {
			overlay.style.display = "none"
			popup.style.display = "none"
			document.getElementById("password").value = ""
		}, 300)
	}

	document.getElementById("closeButton").addEventListener("click", closePopup)

	document.getElementById("confirmButton").addEventListener("click", async () => {
		const password = document.getElementById("password").value
		if (!password) {
			showCustomAlert("Por favor, digite uma senha.")
			return
		}

		const username = localStorage.getItem("username")
		if (!username) {
			showCustomAlert("Erro: nome de usuário não encontrado.")
			return
		}

		try {
			const response = await fetch("/user/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: username,
					password: password,
				}),
			})

			const result = await response.json()

			if (!response.ok || !result.success) {
				showCustomAlert("Senha incorreta. Por favor, tente novamente.")
				return
			}

			closePopup()
			showCustomAlert("Logout realizado com sucesso!")
			window.location.href = "../index"
		} catch (err) {
			console.error("Erro ao verificar senha:", err)
			showCustomAlert("Erro interno. Tente novamente.")
		}
	})

	overlay.addEventListener("click", closePopup)
})