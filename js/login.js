// Lógica de Login do Portal do Colaborador
// Este script deve ser carregado na página colaborador.html

// Substitua pela URL do seu n8n que verifica o login (lê do Google Sheets)
const WEBHOOK_URL_LOGIN = "COLE_AQUI_A_URL_DO_N8N_LOGIN";

document.addEventListener('DOMContentLoaded', () => {
  const cpfInput = document.getElementById('cpf');
  const loginForm = document.getElementById('colaboradorForm');

  // Máscara de CPF
  if (cpfInput) {
    cpfInput.addEventListener('input', function(e) {
      let value = e.target.value;
      value = value.replace(/\D/g, ""); // Remove tudo que não é dígito
      if (value.length > 11) value = value.substring(0, 11);
      
      // Formata
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      
      e.target.value = value;
    });
  }

  // Submissão do Formulário de Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const cpf = document.getElementById('cpf').value;
      const senha = document.getElementById('senha').value;
      const btnSubmit = loginForm.querySelector('button[type="submit"]');
      const originalBtnText = btnSubmit.innerHTML;

      // Estado de Carregamento
      btnSubmit.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Autenticando...';
      btnSubmit.disabled = true;

      try {
        // Envia para o Webhook do n8n
        const response = await fetch(WEBHOOK_URL_LOGIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cpf: cpf.replace(/\D/g, ""), // Manda só os números
            senha: senha
          })
        });

        if (!response.ok) {
          throw new Error('Erro na comunicação com o servidor.');
        }

        const data = await response.json();

        // Espera-se que o n8n retorne um JSON assim:
        // { "sucesso": true, "nome": "Gabriel", "cpf": "12345678900" }
        // ou { "sucesso": false, "mensagem": "CPF ou senha inválidos" }

        if (data.sucesso) {
          // Salva os dados da sessão (localStorage)
          localStorage.setItem('vaz_colaborador_auth', 'true');
          localStorage.setItem('vaz_colaborador_nome', data.nome);
          localStorage.setItem('vaz_colaborador_cpf', data.cpf); // CPF limpo para buscar a pasta

          // Redireciona para o Dashboard
          window.location.href = 'dashboard-colaborador.html';
        } else {
          // Exibe erro
          alert(data.mensagem || 'Credenciais inválidas. Tente novamente.');
          btnSubmit.innerHTML = originalBtnText;
          btnSubmit.disabled = false;
        }

      } catch (error) {
        console.error('Erro de login:', error);
        alert('Erro ao tentar fazer login. Verifique sua conexão e tente novamente.');
        btnSubmit.innerHTML = originalBtnText;
        btnSubmit.disabled = false;
      }
    });
  }
});
