//================================================ main =======================================================
document.addEventListener('DOMContentLoaded', async function () {
  const moduleTabs = document.querySelectorAll('.top-tab'); // Seleciona os botões dos módulos
  const modules = {
    almoxarifado: 'almoxarifado.html',
    frota: 'frota.html',
    ordens: 'ordens.html',
    nobreaks: 'nobreaks.html'
  };

  // Solicitar os valores dos módulos do servidor
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token não encontrado. Faça login novamente.');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/modulos', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (data.status === 'ok') {
      const modulos = data.modulos;

      // Tornar os botões invisíveis ou visíveis com base nos valores dos módulos
      Object.keys(modules).forEach(modulo => {
        const tab = document.getElementById(`${modulo}-tab`);
        if (modulos[modulo]) {
          tab.style.display = 'inline-block'; // Torna o botão visível
        } else {
          tab.style.display = 'none'; // Torna o botão invisível
        }
      });
    } else {
      console.error('Erro ao obter módulos:', data.mensagem);
    }
  } catch (err) {
    console.error('Erro ao conectar com o servidor:', err);
  }

  //  funcionalidade de redirecionamento ao clicar nos botões visíveis
  moduleTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const moduleId = this.id.replace('-tab', ''); // Extrai o ID do módulo
      if (modules[moduleId]) {
        window.location.href = modules[moduleId]; // Redireciona para o módulo correspondente
      }
    });
  });

  //  funcionalidade de logout
  const logoutButton = document.getElementById('btn-logout');
  logoutButton.addEventListener('click', function () {
    localStorage.clear(); // Exclui todo o conteúdo do localStorage
    window.location.href = 'index.html'; // Redireciona para index.html
  });
});



//===============================================fim do main===========================================================


document.addEventListener('DOMContentLoaded', function () {
  const legendaPrincipal = document.getElementById('legenda-principal'); // Elemento para exibir a legenda

  // Define a aba Gerenciamento como ativa ao carregar a página
  const gerenciamentoTab = document.querySelector('.tab-btn[data-tab="gerenciamento"]');
  const gerenciamentoContent = document.getElementById('gerenciamento');
  if (gerenciamentoTab && gerenciamentoContent && legendaPrincipal) {
    gerenciamentoTab.classList.add('active'); // Define o botão como ativo
    gerenciamentoContent.classList.add('active'); // Define o conteúdo como ativo
    legendaPrincipal.textContent = 'Gerenciamento'; // Define a legenda inicial
  }

  // Gerenciamento de abas do módulo Ordens de Serviço
  const tabs = document.querySelectorAll('.tab-btn'); // Seleciona os botões das abas
  const tabContents = document.querySelectorAll('.tab-content'); // Seleciona os conteúdos das abas

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      // Remove a classe "active" de todas as abas e conteúdos
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Adiciona a classe "active" à aba clicada e ao conteúdo correspondente
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab'); // Obtém o ID da aba
      const contentToShow = document.getElementById(tabId);
      if (contentToShow) {
        contentToShow.classList.add('active');
      }

      // Atualiza a legenda no painel principal com o texto do botão clicado
      legendaPrincipal.textContent = this.textContent.trim(); // Atualiza a legenda
    });
  });
});