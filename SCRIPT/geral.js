//======================================================================================================
// FUNÇÃO PRINCIPAL: Inicialização do Sistema
// Inicializa o sistema ao carregar a página, configurando módulos, autenticação, eventos de interface e responsividade.
//======================================================================================================
document.addEventListener('DOMContentLoaded', async function () {
  const moduleTabs = document.querySelectorAll('.top-tab');
  const modules = {
    almoxarifado: 'almoxarifado.html',
    frota: 'frota.html',
    ordens: 'ordens.html',
    nobreaks: 'nobreaks.html'
  };

  const userNameElement = document.getElementById('logged-user');
  const userIconElement = document.querySelector('.user-icon'); // Elemento da imagem do usuário
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('Token não encontrado. Faça login novamente.');
    return;
  }

  //  PEGA OS DADOS DO USUÁRIO DO LOCALSTORAGE COM A CHAVE CORRETA
  const usuarioData = localStorage.getItem('usuario');
  let userId = null;
  let username = null;
  
  if (usuarioData) {
    try {
      const parsedUsuarioData = JSON.parse(usuarioData);
      userId = parsedUsuarioData.id;
      username = parsedUsuarioData.username;
    } catch (error) {
      console.error('❌ Erro ao parsear usuarioData do localStorage:', error);
    }
  }

  //======================================================================================================
  // FUNÇÃO PRINCIPAL: Calcular Tempo Restante do Token
  // Calcula o tempo restante até a expiração do token JWT do usuário.
  //======================================================================================================
  function calcularTempoRestanteToken() {
    try {
      if (!token) return 'Token não encontrado';
      
      // Decodifica o token JWT (apenas o payload, sem verificar assinatura)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      const exp = payload.exp; // Timestamp de expiração
      
      if (!exp) return 'Token sem expiração definida';
      
      const agora = Math.floor(Date.now() / 1000); // Timestamp atual em segundos
      const tempoRestante = exp - agora;
      
      if (tempoRestante <= 0) {
        return 'Token expirado';
      }
      
      // Converte segundos para horas, minutos e segundos
      const horas = Math.floor(tempoRestante / 3600);
      const minutos = Math.floor((tempoRestante % 3600) / 60);
      const segundos = tempoRestante % 60;
      
      return `${horas}h ${minutos}m ${segundos}s`;
      
    } catch (error) {
      console.error('Erro ao calcular tempo do token:', error);
      return 'Erro ao calcular tempo';
    }
  }


  //======================================================================================================
  // FUNÇÃO PRINCIPAL: Verificar Token Expirado
  // Verifica se o token JWT está expirado e executa ações de segurança caso necessário.
  //======================================================================================================
  function verificarTokenExpirado() {
    try {
      if (!token) {
        console.log('🔒 Token não encontrado, redirecionando para login...');
        limparStorageERedirecionarLogin();
        return true;
      }
      
      // Decodifica o token JWT
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      const exp = payload.exp; // Timestamp de expiração
      
      if (!exp) {
        console.warn('⚠️ Token sem expiração definida');
        return false;
      }
      
      const agora = Math.floor(Date.now() / 1000); // Timestamp atual em segundos
      const tempoRestante = exp - agora;
      
      if (tempoRestante <= 0) {
        console.log('🔒 Token expirado, redirecionando para login...');
        limparStorageERedirecionarLogin();
        return true;
      }
      
      //  AVISO QUANDO FALTAM MENOS DE 5 MINUTOS
      if (tempoRestante <= 300) { // 5 minutos = 300 segundos
        console.warn(`⏰ Token expira em ${Math.floor(tempoRestante / 60)} minutos!`);
        mostrarAvisoTokenProximoVencimento(tempoRestante);
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Erro ao verificar token:', error);
      limparStorageERedirecionarLogin();
      return true;
    }
  }

  //======================================================================================================
  // FUNÇÃO PRINCIPAL: Limpar Storage e Redirecionar para Login
  // Limpa o localStorage e redireciona o usuário para a tela de login.
  //======================================================================================================
  function limparStorageERedirecionarLogin() {
    
    
    // Lista todas as chaves antes de limpar (para debug)
    const chaves = Object.keys(localStorage);
    
    
    // Limpa completamente o localStorage
    localStorage.clear();
    
    // Verifica se realmente limpou
    
    
    // Redireciona para login
    console.log(' Redirecionando para login...');
    window.location.href = '../index.html';
  }

  //======================================================================================================
  // FUNÇÃO PRINCIPAL: Mostrar Aviso de Token Próximo ao Vencimento
  // Exibe um banner de aviso quando o token está próximo do vencimento.
  // @param {number} tempoRestante - Tempo restante em segundos para expiração do token.
  //======================================================================================================
  function mostrarAvisoTokenProximoVencimento(tempoRestante) {
    // Remove aviso existente se houver
    const avisoExistente = document.getElementById('token-warning-banner');
    if (avisoExistente) {
      avisoExistente.remove();
    }
    
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    
    // Cria banner de aviso
    const banner = document.createElement('div');
    banner.id = 'token-warning-banner';
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #ff6b35;
      color: white;
      text-align: center;
      padding: 10px;
      z-index: 9999;
      font-weight: bold;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    `;
    
    banner.innerHTML = `
      ⏰ ATENÇÃO: Sua sessão expira em ${minutos}m ${segundos}s! 
      <button onclick="renovarSessao()" style="
        background: white;
        color: #ff6b35;
        border: none;
        padding: 5px 10px;
        margin-left: 10px;
        border-radius: 3px;
        cursor: pointer;
        font-weight: bold;
      ">Renovar Sessão</button>
      <button onclick="fecharAviso()" style="
        background: transparent;
        color: white;
        border: 1px solid white;
        padding: 5px 10px;
        margin-left: 5px;
        border-radius: 3px;
        cursor: pointer;
      ">Fechar</button>
    `;
    
    document.body.insertBefore(banner, document.body.firstChild);
    
    //  FUNÇÕES GLOBAIS PARA OS BOTÕES
    window.renovarSessao = function() {
      alert('Você será redirecionado para fazer login novamente.');
      limparStorageERedirecionarLogin();
    };
    
    window.fecharAviso = function() {
      banner.remove();
    };
  }

  //  VERIFICAÇÃO INICIAL DO TOKEN
  if (verificarTokenExpirado()) {
    return; // Para a execução se o token estiver expirado
  }

  //  MONITORAMENTO CONTÍNUO DO TOKEN (verifica a cada 30 segundos)
  window.tokenMonitorInterval = setInterval(() => {
    console.log('🔍 Verificando status do token...');
    verificarTokenExpirado();
  }, 30000); // 30 segundos

  //  VERIFICA TOKEN ANTES DE FAZER REQUISIÇÕES IMPORTANTES
  window.addEventListener('beforeunload', () => {
    clearInterval(window.tokenMonitorInterval);
    clearInterval(window.tokenCountdownInterval);
  });

  //  INTERCEPTA ERROS 401 (Unauthorized) EM FETCH REQUESTS
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args)
      .then(response => {
        if (response.status === 401) {
          console.log(' Resposta 401 recebida - Token inválido ou expirado');
          limparStorageERedirecionarLogin();
        }
        return response;
      })
      .catch(error => {
        console.error('❌ Erro na requisição:', error);
        throw error;
      });
  };

  //======================================================================================================
  // FUNÇÃO PRINCIPAL: Criar Modal de Perfil do Usuário
  // Cria e exibe o modal de perfil do usuário com informações e opções de sessão.
  // @returns {HTMLElement} Elemento do modal criado.
  //======================================================================================================
  function criarModalPerfil() {
    // Verifica token antes de mostrar modal
    if (verificarTokenExpirado()) {
      return;
    }
    
    // Remove modal existente se houver
    const modalExistente = document.getElementById('user-profile-modal');
    if (modalExistente) {
      modalExistente.remove();
    }
    
    // Cria o modal
    const modal = document.createElement('div');
    modal.id = 'user-profile-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      animation: fadeIn 0.3s ease;
    `;
    
    // Conteúdo do modal
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 90%;
      text-align: center;
      position: relative;
      animation: slideIn 0.3s ease;
    `;
    
    // Obtém dados do usuário
    const usuarioCompleto = JSON.parse(localStorage.getItem('usuario') || '{}');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const imagemUsuario = localStorage.getItem(`imagem_usuario_${userId}`);
    
    // HTML do modal
    modalContent.innerHTML = `
      <div style="position: absolute; top: 10px; right: 15px;">
        <button id="close-profile-modal" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">×</button>
      </div>
      
      <div style="margin-bottom: 20px;">
        <img id="profile-photo" src="${imagemUsuario || '../IMG/default-user.png'}" 
             style="
               width: 100px;
               height: 100px;
               border-radius: 50%;
               object-fit: cover;
               border: 4px solid #FFCB1F;
               margin-bottom: 15px;
               cursor: pointer;
               transition: transform 0.2s ease, box-shadow 0.2s ease;
             "
             title="Clique para expandir a foto">
        <h3 style="margin: 0; color: #333; font-size: 24px;">${username || usuarioCompleto.username || 'Usuário'}</h3>
      </div>
      
      <div style="text-align: left; margin: 20px 0;">
        <div style="margin-bottom: 12px;">
          <strong style="color: #666;">ID:</strong> 
          <span style="color: #333;">${userId || 'N/A'}</span>
        </div>
        
        <div style="margin-bottom: 12px;">
          <strong style="color: #666;">Email:</strong> 
          <span style="color: #333;">${usuarioCompleto.email || 'N/A'}</span>
        </div>
        
        <div style="margin-bottom: 12px;">
          <strong style="color: #666;">Tipo:</strong> 
          <span style="color: #333;">${usuarioCompleto.tipo || 'N/A'}</span>
        </div>
        
        <div style="margin-bottom: 12px;">
          <strong style="color: #666;">Status:</strong> 
          <span style="color: #28a745;">●</span> 
          <span style="color: #333;">Online</span>
        </div>
        
        <div style="margin-bottom: 12px;">
          <strong style="color: #666;">Token expira em:</strong> 
          <span id="token-countdown" style="color: #007bff; font-weight: bold;">${calcularTempoRestanteToken()}</span>
        </div>
      </div>
      
      <div style="margin-top: 25px; display: flex; gap: 10px; justify-content: center;">
        <button id="refresh-token-btn" style="
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        ">Renovar Token</button>
        
        <button id="logout-from-modal" style="
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        ">Sair</button>
      </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    //  FUNÇÃO PARA CRIAR MODAL DE FOTO EXPANDIDA
    function criarModalFotoExpandida() {
      // Remove modal de foto existente se houver
      const modalFotoExistente = document.getElementById('expanded-photo-modal');
      if (modalFotoExistente) {
        modalFotoExistente.remove();
      }
      
      // Cria o modal de foto expandida
      const modalFoto = document.createElement('div');
      modalFoto.id = 'expanded-photo-modal';
      modalFoto.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3000;
        animation: fadeIn 0.3s ease;
      `;
      
      // Container da foto expandida
      const fotoContainer = document.createElement('div');
      fotoContainer.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
      `;
      
      // Foto expandida
      const fotoExpandida = document.createElement('img');
      fotoExpandida.src = imagemUsuario || '../IMG/default-user.png';
      fotoExpandida.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        animation: zoomIn 0.3s ease;
      `;
      
      // Botão fechar foto expandida
      const btnFecharFoto = document.createElement('button');
      btnFecharFoto.innerHTML = '×';
      btnFecharFoto.style.cssText = `
        position: absolute;
        top: -10px;
        right: -10px;
        background: #fff;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 24px;
        cursor: pointer;
        color: #333;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      // Informações da foto
      const infoFoto = document.createElement('div');
      infoFoto.style.cssText = `
        margin-top: 20px;
        color: white;
        text-align: center;
      `;
      infoFoto.innerHTML = `
        <h3 style="margin: 10px 0; color: #FFCB1F;">${username || usuarioCompleto.username || 'Usuário'}</h3>
        <p style="margin: 5px 0; opacity: 0.8;">ID: ${userId || 'N/A'}</p>
        <p style="margin: 5px 0; opacity: 0.6; font-size: 14px;">Clique fora da imagem ou no X para fechar</p>
      `;
      
      // Monta o modal de foto
      fotoContainer.appendChild(fotoExpandida);
      fotoContainer.appendChild(btnFecharFoto);
      fotoContainer.appendChild(infoFoto);
      modalFoto.appendChild(fotoContainer);
      document.body.appendChild(modalFoto);
      
      // Event listeners para fechar foto expandida
      btnFecharFoto.addEventListener('click', () => {
        modalFoto.remove();
      });
      
      modalFoto.addEventListener('click', (e) => {
        if (e.target === modalFoto) {
          modalFoto.remove();
        }
      });
      
      // Fechar com ESC
      const handleEscKey = (e) => {
        if (e.key === 'Escape') {
          modalFoto.remove();
          document.removeEventListener('keydown', handleEscKey);
        }
      };
      document.addEventListener('keydown', handleEscKey);
      
      return modalFoto;
    }
    
    //  ADICIONA ESTILOS DE ANIMAÇÃO (incluindo nova animação zoomIn)
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes zoomIn {
        from { transform: scale(0.5); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      #close-profile-modal:hover {
        background-color: #f5f5f5;
        border-radius: 50%;
      }
      
      #refresh-token-btn:hover {
        background-color: #0056b3;
      }
      
      #logout-from-modal:hover {
        background-color: #c82333;
      }
      
      #profile-photo:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(255, 203, 31, 0.3);
      }
    `;
    document.head.appendChild(style);
    
    //  EVENT LISTENERS
    
    // Event listener para expandir foto
    const profilePhoto = document.getElementById('profile-photo');
    profilePhoto.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita fechar o modal de perfil
      criarModalFotoExpandida();
    });
    
    // Fechar modal
    document.getElementById('close-profile-modal').addEventListener('click', () => {
      modal.style.display = 'none';
      clearInterval(window.tokenCountdownInterval); // Para o contador
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        clearInterval(window.tokenCountdownInterval);
      }
    });
    
    // Renovar token (redireciona para login)
    document.getElementById('refresh-token-btn').addEventListener('click', () => {
      alert('Você será redirecionado para fazer login novamente.');
      limparStorageERedirecionarLogin(); //  USA NOVA FUNÇÃO
    });
    
    // Logout
    document.getElementById('logout-from-modal').addEventListener('click', () => {
      if (confirm('Tem certeza que deseja sair?')) {
        limparStorageERedirecionarLogin(); //  USA NOVA FUNÇÃO
      }
    });
    
    return modal;
  }

  //======================================================================================================
  // FUNÇÃO PRINCIPAL: Mostrar Modal de Perfil
  // Exibe o modal de perfil do usuário e inicia o contador regressivo do token.
  //======================================================================================================
  function mostrarModalPerfil() {
    // Verifica token antes de mostrar modal
    if (verificarTokenExpirado()) {
      return;
    }
    
    const modal = criarModalPerfil();
    modal.style.display = 'flex';
    
    //  INICIA CONTADOR REGRESSIVO DO TOKEN
    const tokenCountdown = document.getElementById('token-countdown');
    if (tokenCountdown) {
      window.tokenCountdownInterval = setInterval(() => {
        const tempoRestante = calcularTempoRestanteToken();
        tokenCountdown.textContent = tempoRestante;
        
        //  MODIFICADO: USA NOVA FUNÇÃO DE LIMPEZA
        if (tempoRestante === 'Token expirado') {
          tokenCountdown.style.color = '#dc3545';
          clearInterval(window.tokenCountdownInterval);
          
          setTimeout(() => {
            alert('Seu token expirou. Você será redirecionado para fazer login novamente.');
            limparStorageERedirecionarLogin(); 
          }, 2000);
        }
      }, 1000); // Atualiza a cada segundo
    }
  }

  //======================================================================================================
  // FUNÇÃO PRINCIPAL: Carregar Imagem do Usuário
  // Carrega a imagem do usuário do localStorage ou do servidor e aplica no ícone do usuário.
  //======================================================================================================
  async function carregarImagemUsuario(userId) {
    try {
      //  PRIMEIRO: Verifica se já tem a imagem no localStorage
      const imagemSalva = localStorage.getItem(`imagem_usuario_${userId}`);
      
      if (imagemSalva) {
        // Aplica a imagem salva
        if (userIconElement) {
          userIconElement.src = imagemSalva;
          userIconElement.style.borderRadius = '50%';
          userIconElement.style.objectFit = 'cover';
          userIconElement.style.width = '40px';
          userIconElement.style.height = '40px';
          userIconElement.style.cursor = 'pointer'; //  INDICA QUE É CLICÁVEL
          userIconElement.title = 'Clique para ver perfil'; //  TOOLTIP
        }
        return; //  SAIR DA FUNÇÃO - NÃO PRECISA BUSCAR NO SERVIDOR
      }

      
      const response = await fetch(`https://api.exksvol.website/usuario/imagem/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok' && data.imagem) {
          // Converte base64 para imagem
          const imagemBase64 = data.imagem;
          const imagemSrc = `data:image/jpeg;base64,${imagemBase64}`;
          
          //  SALVA A IMAGEM NO LOCALSTORAGE
          localStorage.setItem(`imagem_usuario_${userId}`, imagemSrc);
          
          if (userIconElement) {
            userIconElement.src = imagemSrc;
            userIconElement.style.borderRadius = '50%';
            userIconElement.style.objectFit = 'cover';
            userIconElement.style.width = '40px';
            userIconElement.style.height = '40px';
            userIconElement.style.cursor = 'pointer'; 
            userIconElement.title = 'Clique para ver perfil';
          }
        } else {
          
          if (userIconElement) {
            userIconElement.style.cursor = 'pointer'; 
            userIconElement.title = 'Clique para ver perfil'; 
          }
        }
      } else {
        console.warn('⚠️ Erro ao carregar imagem do usuário:', response.status);
      }
    } catch (error) {
      console.error('❌ Erro ao conectar com servidor para carregar imagem:', error);
    }
  }

  
  if (userId && userIconElement) {
    await carregarImagemUsuario(userId);
    
    
    userIconElement.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      mostrarModalPerfil();
    });
  }

  // ATUALIZA O NOME DO USUÁRIO COM O USERNAME DO LOCALSTORAGE
  if (userNameElement && username) {
    userNameElement.textContent = `Bem-vindo, ${username}!`;
  }

  const cachedData = localStorage.getItem('userData');
  if (cachedData) {
    const userData = JSON.parse(cachedData);
    const { usuario, modulos } = userData;
    
    if (userNameElement && !username && usuario) {
      userNameElement.textContent = `Bem-vindo, ${usuario}!`;
    }
    
    Object.keys(modules).forEach(modulo => {
      const tab = document.getElementById(`${modulo}-tab`);
      if (modulos && modulos[modulo]) {
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
        const modulos = data.modulos; //  PEGA OS MÓDULOS DO SERVIDOR
        const usuario = data.usuario;
        
        // Salva dados SEM incluir o userId (já está no localStorage)
        localStorage.setItem('userData', JSON.stringify({ usuario, modulos }));
        
        //  SÓ ATUALIZA O NOME SE NÃO CONSEGUIU PEGAR DO USUARIO DO LOCALSTORAGE
        if (userNameElement && !username && usuario) {
          userNameElement.textContent = `Bem-vindo, ${usuario}!`;
        }
        
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

  // MODIFICA O LOGOUT BUTTON PARA USAR A NOVA FUNÇÃO
  const logoutButton = document.getElementById('btn-logout');
  logoutButton.addEventListener('click', function () {
    limparStorageERedirecionarLogin(); //  USA NOVA FUNÇÃO
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
  optionsContainer.style.display = 'none'; 
  optionsContainer.style.flexDirection = 'column'; 
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

  // Fecha painéis laterais ao clicar fora deles
  document.addEventListener('mousedown', function (e) {
    // Se o painel esquerdo estiver aberto e o clique for fora dele e fora do botão toggle
    if (sidebarLeft.style.display === 'block' && !sidebarLeft.contains(e.target) && e.target !== toggleButton && !optionsContainer.contains(e.target)) {
      sidebarLeft.style.display = 'none';
    }
    // Se o painel direito estiver aberto e o clique for fora dele e fora do botão toggle
    if (sidebarRight && sidebarRight.style.display === 'block' && !sidebarRight.contains(e.target) && e.target !== toggleButton && !optionsContainer.contains(e.target)) {
      sidebarRight.style.display = 'none';
    }
    // Fecha o menu de opções se clicar fora dele e do botão toggle
    if (optionsContainer.style.display === 'flex' && !optionsContainer.contains(e.target) && e.target !== toggleButton) {
      optionsContainer.style.display = 'none';
    }
  });

  //======================================================================================================
  // FUNÇÃO PRINCIPAL: Botão e Lista de Módulos
  // Cria o botão "Outros" e a lista de módulos disponíveis para navegação rápida.
  //======================================================================================================
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

  //======================================================================================================
  // FUNÇÃO PRINCIPAL: Adaptar Layout para Responsividade
  // Ajusta o layout da página para responsividade conforme a largura da tela.
  //======================================================================================================
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

//======================================================================================================
// FUNÇÃO PRINCIPAL: Inicializar Lista de Módulos no Menu Lateral
// Inicializa a lista de módulos no menu lateral ao carregar a página.
//======================================================================================================
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

//======================================================================================================
// FUNÇÃO PRINCIPAL: Configurar Modal de Informações
// Configura o modal de informações (Info) e seus eventos ao carregar a página.
//======================================================================================================
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

//======================================================================================================
// FUNÇÃO PRINCIPAL: Ajustar Zoom da Página
// Ajusta o zoom da página conforme a largura da tela para melhor visualização em dispositivos móveis.
//======================================================================================================
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
