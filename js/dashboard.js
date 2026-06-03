// Lógica do Dashboard do Colaborador

// Substitua pela URL do seu n8n que lista os arquivos do Google Drive da pasta do colaborador
const WEBHOOK_URL_HOLERITES = "COLE_AQUI_A_URL_DO_N8N_HOLERITES";

document.addEventListener('DOMContentLoaded', () => {
  // 1. Verificação de Segurança (Bloqueio de Rota)
  const isAuthenticated = localStorage.getItem('vaz_colaborador_auth');
  
  if (isAuthenticated !== 'true') {
    // Usuário não está logado, manda pro login
    window.location.href = 'colaborador.html';
    return; // Para a execução do script
  }

  // 2. Preencher Dados do Usuário na Interface
  const nome = localStorage.getItem('vaz_colaborador_nome') || 'Colaborador';
  const cpf = localStorage.getItem('vaz_colaborador_cpf') || '';
  
  document.getElementById('userNameDisplay').textContent = nome;
  
  // Formatar CPF para exibição na tela (XXX.XXX.XXX-XX)
  let cpfFormatado = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  document.getElementById('userCpfDisplay').textContent = cpfFormatado;

  // 3. Lógica de Logout
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      // Limpa a sessão
      localStorage.removeItem('vaz_colaborador_auth');
      localStorage.removeItem('vaz_colaborador_nome');
      localStorage.removeItem('vaz_colaborador_cpf');
      
      // Redireciona
      window.location.href = 'colaborador.html';
    });
  }

  // 4. Buscar Holerites
  buscarHolerites(cpf);

  // Botão de atualizar
  const btnRefresh = document.getElementById('btnRefresh');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      buscarHolerites(cpf);
    });
  }
});

// Função para buscar os holerites no n8n (que consulta o Google Drive)
async function buscarHolerites(cpfUsuario) {
  const loading = document.getElementById('dashLoading');
  const grid = document.getElementById('holeritesGrid');
  const empty = document.getElementById('dashEmpty');

  // Reseta a view
  grid.style.display = 'none';
  empty.style.display = 'none';
  loading.style.display = 'flex';
  grid.innerHTML = ''; // Limpa os cards antigos

  try {
    // Faz a requisição pro n8n mandando o CPF para ele procurar a pasta correta
    const response = await fetch(WEBHOOK_URL_HOLERITES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cpf: cpfUsuario
      })
    });

    if (!response.ok) {
      throw new Error('Erro na comunicação com o servidor ao buscar documentos.');
    }

    const data = await response.json();
    
    // Esperamos que o n8n retorne um JSON assim:
    // { "sucesso": true, "arquivos": [ { "nome": "maio_2026.pdf", "link_download": "https://..." }, ... ] }

    loading.style.display = 'none';

    if (data.sucesso && data.arquivos && data.arquivos.length > 0) {
      // Renderiza os cards
      data.arquivos.forEach(arquivo => {
        const card = document.createElement('div');
        card.className = 'holerite-card';
        card.innerHTML = `
          <div class="holerite-icon"><i class="fas fa-file-pdf"></i></div>
          <div class="holerite-info">
            <h3>${arquivo.nome}</h3>
            <span>Documento PDF</span>
          </div>
          <a href="${arquivo.link_download}" target="_blank" class="btn-download"><i class="fas fa-download"></i> Baixar</a>
        `;
        grid.appendChild(card);
      });
      grid.style.display = 'grid';
    } else {
      // Mostra empty state
      empty.style.display = 'flex';
    }

  } catch (error) {
    console.error('Erro ao buscar holerites:', error);
    loading.style.display = 'none';
    
    // Mostra erro genérico se falhar
    empty.innerHTML = `<i class="fas fa-exclamation-triangle" style="color:#ef4444;"></i><p>Não foi possível carregar os documentos. Tente novamente mais tarde.</p>`;
    empty.style.display = 'flex';
  }
}
