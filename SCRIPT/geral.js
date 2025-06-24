document.addEventListener('DOMContentLoaded', async function () {
  const moduleTabs = document.querySelectorAll('.top-tab');
  const modules = {
    almoxarifado: 'almoxarifado.html',
    frota: 'frota.html',
    ordens: 'ordens.html',
    nobreaks: 'nobreaks.html'
  };

  const userNameElement = document.getElementById('logged-user');
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token não encontrado. Faça login novamente.');
    return;
  }

  const cachedData = localStorage.getItem('userData');
  if (cachedData) {
    const userData = JSON.parse(cachedData);
    const { usuario, modulos } = userData;
    if (userNameElement) userNameElement.textContent = `Bem-vindo, ${usuario}!`;
    Object.keys(modules).forEach(modulo => {
      const tab = document.getElementById(`${modulo}-tab`);
      if (modulos[modulo]) {
        tab.style.display = 'inline-block';
        tab.addEventListener('click', () => window.location.href = modules[modulo]);
      } else {
        tab.style.display = 'none';
      }
    });
  } else {
    try {
      const res = await fetch('https://api.exksvol.website/modulos', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.status === 'ok') {
        const modulos = data.modulos;
        const usuario = data.usuario;
        localStorage.setItem('userData', JSON.stringify({ usuario, modulos }));
        if (userNameElement) userNameElement.textContent = `Bem-vindo, ${usuario}`;
        Object.keys(modules).forEach(modulo => {
          const tab = document.getElementById(`${modulo}-tab`);
          if (modulos[modulo]) {
            tab.style.display = 'inline-block';
            tab.addEventListener('click', () => window.location.href = modules[modulo]);
          } else {
            tab.style.display = 'none';
          }
        });
      } else {
        console.error('Erro ao obter módulos:', data.mensagem);
      }
    } catch (err) {
      console.error('Erro ao conectar com o servidor:', err);
    }
  }

  const logoutButton = document.getElementById('btn-logout');
  logoutButton.addEventListener('click', function () {
    localStorage.clear();
    window.location.href = '../index.html';
  });

  const sidebarLeft = document.querySelector('.menu');
  const sidebarRight = document.querySelector('.sidebar-right');
  const toggleButton = document.createElement('button');
  const optionsContainer = document.createElement('div');

  toggleButton.id = 'toggle-panels';
  toggleButton.textContent = '≡';
  toggleButton.style.position = 'fixed';
  toggleButton.style.bottom = '20px';
  toggleButton.style.right = '20px';
  toggleButton.style.backgroundColor = '#FFCB1F';
  toggleButton.style.color = '#060606';
  toggleButton.style.border = 'none';
  toggleButton.style.borderRadius = '50%';
  toggleButton.style.width = '50px';
  toggleButton.style.height = '50px';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
  toggleButton.style.zIndex = '1200';
  document.body.appendChild(toggleButton);

  optionsContainer.id = 'panel-options';
  optionsContainer.style.position = 'fixed';
  optionsContainer.style.bottom = '80px';
  optionsContainer.style.right = '20px';
  optionsContainer.style.backgroundColor = '#FFFFFF';
  optionsContainer.style.border = '1px solid #ccc';
  optionsContainer.style.borderRadius = '8px';
  optionsContainer.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
  optionsContainer.style.padding = '10px';
  optionsContainer.style.display = 'none'; // Oculta o contêiner inicialmente
  optionsContainer.style.flexDirection = 'column'; // Organiza os botões verticalmente
  optionsContainer.style.zIndex = '1200';

  const openLeftPanelButton = document.createElement('button');
  openLeftPanelButton.textContent = 'Abrir Menu';
  openLeftPanelButton.style.backgroundColor = '#FFCB1F';
  openLeftPanelButton.style.color = '#060606';
  openLeftPanelButton.style.border = 'none';
  openLeftPanelButton.style.borderRadius = '4px';
  openLeftPanelButton.style.padding = '10px';
  openLeftPanelButton.style.cursor = 'pointer';
  openLeftPanelButton.style.marginBottom = '10px'; // Adiciona espaço entre os botões

  const openRightPanelButton = document.createElement('button');
  openRightPanelButton.textContent = 'Abrir Status';
  openRightPanelButton.style.backgroundColor = '#FFCB1F';
  openRightPanelButton.style.color = '#060606';
  openRightPanelButton.style.border = 'none';
  openRightPanelButton.style.borderRadius = '4px';
  openRightPanelButton.style.padding = '10px';
  openRightPanelButton.style.cursor = 'pointer';

  optionsContainer.appendChild(openLeftPanelButton);
  optionsContainer.appendChild(openRightPanelButton);
  document.body.appendChild(optionsContainer);

  toggleButton.addEventListener('click', () => {
    optionsContainer.style.display =
      optionsContainer.style.display === 'none' ? 'flex' : 'none';
  });

  openLeftPanelButton.addEventListener('click', () => {
    sidebarLeft.style.display = sidebarLeft.style.display === 'block' ? 'none' : 'block';
    sidebarRight.style.display = 'none'; 
    optionsContainer.style.display = 'none'; 
  });

  openRightPanelButton.addEventListener('click', () => {
    sidebarRight.style.display = sidebarRight.style.display === 'block' ? 'none' : 'block';
    sidebarLeft.style.display = 'none'; 
    optionsContainer.style.display = 'none'; 
  });

  // ============================
  // BOTÃO E LISTA DE MÓDULOS
  // ============================
  const moduleSelector = document.createElement('button');
  const moduleList = document.createElement('div');

  moduleSelector.id = 'module-selector';
  moduleSelector.textContent = 'Outros';
  moduleSelector.style.backgroundColor = '#FFCB1F';
  moduleSelector.style.color = '#060606';
  moduleSelector.style.border = 'none';
  moduleSelector.style.borderRadius = '4px';
  moduleSelector.style.padding = '10px';
  moduleSelector.style.cursor = 'pointer';
  moduleSelector.style.fontSize = '14px';
  moduleSelector.style.position = 'absolute'; 
  moduleSelector.style.right = '10px'; 
  moduleSelector.style.top = '10px'; 
  moduleSelector.style.zIndex = '1200'; 


  const topBar = document.querySelector('.top-bar');
  topBar.appendChild(moduleSelector);

  moduleList.id = 'module-list';
  moduleList.style.display = 'none';
  moduleList.style.position = 'absolute';
  moduleList.style.top = '60px';
  moduleList.style.left = '20px';
  moduleList.style.backgroundColor = '#FFFFFF';
  moduleList.style.border = '1px solid #ccc';
  moduleList.style.borderRadius = '8px';
  moduleList.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
  moduleList.style.padding = '10px';
  moduleList.style.zIndex = '1200';
  document.body.appendChild(moduleList);

  Object.keys(modules).forEach(modulo => {
    const tab = document.getElementById(`${modulo}-tab`);
    if (tab && tab.style.display !== 'none') {
      const button = document.createElement('button');
      button.textContent = modulo.charAt(0).toUpperCase() + modulo.slice(1);
      button.style.display = 'block';
      button.style.background = 'none';
      button.style.border = 'none';
      button.style.padding = '10px';
      button.style.textAlign = 'left';
      button.style.cursor = 'pointer';
      button.style.fontSize = '14px';
      button.style.color = '#292929';
      button.addEventListener('click', () => {
        window.location.href = modules[modulo];
      });
      moduleList.appendChild(button);
    }
  });

  moduleSelector.addEventListener('click', () => {
    moduleList.style.display = moduleList.style.display === 'none' ? 'block' : 'none';
  });

  document.addEventListener('click', e => {
    if (!moduleList.contains(e.target) && e.target !== moduleSelector) {
      moduleList.style.display = 'none';
    }
  });

  // ============================
  // RESPONSIVIDADE
  // ============================
  function adaptPageStyle() {
    const width = window.innerWidth;

    if (width > 768) {
      sidebarLeft.style.display = 'flex';
      sidebarLeft.style.position = 'sticky';
      sidebarRight.style.display = 'flex';
      sidebarRight.style.position = 'sticky';
      toggleButton.style.display = 'none';
      optionsContainer.style.display = 'none';
      moduleSelector.style.display = 'none'; 
      moduleList.style.display = 'none';
      moduleTabs.forEach(tab => tab.style.display = 'inline-block');
    } else {
      sidebarLeft.style.display = 'none';
      sidebarRight.style.display = 'none';
      toggleButton.style.display = 'block';
      moduleSelector.style.display = toggleButton.style.display === 'block' ? 'inline-block' : 'none'; 
      moduleTabs.forEach(tab => tab.style.display = 'none');
    }
  }

  window.addEventListener('resize', adaptPageStyle);
  adaptPageStyle();
});

document.addEventListener('DOMContentLoaded', function () {
  const menu = document.querySelector('.menu');
  const moduleSelector = document.createElement('button');
  const moduleList = document.createElement('div');

  // Configuração da lista de módulos
  moduleList.id = 'module-list';
  moduleList.style.display = 'none'; 
  moduleList.style.backgroundColor = '#FFFFFF';
  moduleList.style.border = '1px solid #ccc';
  moduleList.style.borderRadius = '8px';
  moduleList.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.93)';
  moduleList.style.padding = '10px';
  moduleList.style.marginTop = '10px';
  menu.appendChild(moduleList);

  // Adicionar módulos à lista
  const modules = ['Almoxarifado', 'Frota', 'Ordens de Serviço', 'Nobreaks'];
  modules.forEach(modulo => {
    const moduleButton = document.createElement('button');
    moduleButton.textContent = modulo;
    moduleButton.className = 'module-button'; // Aplica a classe CSS
    moduleButton.addEventListener('click', function () {
      alert(`Você selecionou: ${modulo}`);
    });

    moduleList.appendChild(moduleButton);
  });

  // Exibir ou ocultar a lista ao clicar no botão
  moduleSelector.addEventListener('click', function () {
    moduleList.style.display =
      moduleList.style.display === 'none' ? 'block' : 'none';
  });

  // Fechar lista se clicar fora
  document.addEventListener('click', function (e) {
    if (!moduleList.contains(e.target) && e.target !== moduleSelector) {
      moduleList.style.display = 'none';
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const infoButton = document.getElementById('btn-info'); // Botão "Info"
  const modal = document.getElementById('info-modal'); // Painel flutuante
  const modalOkButton = document.getElementById('modal-ok-btn'); // Botão "OK" no modal

  // Exibir o modal ao clicar no botão "Info"
  infoButton.addEventListener('click', function () {
    modal.style.display = 'flex'; // Exibe o modal
  });

  // Fechar o modal ao clicar no botão "OK"
  modalOkButton.addEventListener('click', function () {
    modal.style.display = 'none'; // Oculta o modal
  });

  // Fechar o modal ao clicar fora do conteúdo
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none'; // Oculta o modal
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  function ajustarZoom() {
    const larguraTela = window.innerWidth;

    if (larguraTela <= 768) {
      document.body.style.zoom = '90%'; 
    } else {
      document.body.style.zoom = '100%';
    }
  }

  // Ajusta o zoom ao carregar a página
  ajustarZoom();

  // Ajusta o zoom ao redimensionar a janela
  window.addEventListener('resize', ajustarZoom);
});
