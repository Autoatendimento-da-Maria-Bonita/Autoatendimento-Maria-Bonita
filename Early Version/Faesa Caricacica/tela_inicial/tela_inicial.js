document.addEventListener("DOMContentLoaded", () => {
    const accessSpan = document.querySelector(".header-back")
  
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
  
    document.getElementById("confirmButton").addEventListener("click", () => {
      const password = document.getElementById("password").value
      if (!password) {
        showCustomAlert("Por favor, digite uma senha.")
        return
      }
  
      if (password === "123456") {
        closePopup()
        
        //Redirect para pagina que ainda nao existe

        showCustomAlert("Logout realizado com sucesso!")
        window.location.href = "../index" 
      } else {
        showCustomAlert("Senha incorreta. Por favor, tente novamente.")
      }
    })
  
    overlay.addEventListener("click", closePopup)
  })
  
  