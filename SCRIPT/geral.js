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
    gestao: 'gestao.html'
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
    // Em modo local/desenvolvimento, não redireciona por token expirado
    // (o ambiente é definido pela detecção automática do config.js)
    if (window.API_EM_DESENVOLVIMENTO) {
      return false;
    }
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
    // Delegado ao config.js para que todas as telas encerrem a sessao do mesmo jeito
    if (typeof window.encerrarSessao === 'function') {
      window.encerrarSessao();
      return;
    }
    localStorage.clear();
    window.location.href = /\/HTML\//i.test(window.location.pathname) ? '../index.html' : 'index.html';
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
               border: 4px solid #475569;
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
        <h3 style="margin: 10px 0; color: #475569;">${username || usuarioCompleto.username || 'Usuário'}</h3>
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
        box-shadow: 0 5px 15px rgba(18, 181, 172, 0.3);
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

      
      const response = await fetch(apiUrl(`/usuario/imagem/${userId}`), {
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
        tab.classList.remove('modulo-oculto');
        tab.addEventListener('click', () => {
          if (typeof window.fecharDrawer === 'function') window.fecharDrawer();
          window.location.href = modules[modulo];
        });
      } else {
        tab.classList.add('modulo-oculto');
      }
    });
  } else {
    try {
      const res = await fetch(apiUrl('/modulos'), {
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
            tab.classList.remove('modulo-oculto');
            tab.addEventListener('click', () => {
              if (typeof window.fecharDrawer === 'function') window.fecharDrawer();
              window.location.href = modules[modulo];
            });
          } else {
            tab.classList.add('modulo-oculto');
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

  // Navegacao mobile agora e feita pelo drawer unificado no final deste arquivo.
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
// MÓDULO: Navegação mobile (drawer) + utilidades de responsividade
// Injeta o botão hambúrguer, controla o menu lateral como drawer em telas pequenas,
// replica as abas de módulo dentro do drawer e garante que tabelas largas rolem
// dentro do próprio container (e não na página inteira).
// Roda em todas as páginas por ser carregado junto do geral.js.
//======================================================================================================
(function () {
  const MOBILE_MAX = 768;

  function iniciarDrawer() {
    const menu = document.querySelector('.menu');
    const topBar = document.querySelector('.top-bar');
    const topBarLeft = document.querySelector('.top-bar-left');
    if (!menu || !topBar) return;

    // --- Botão hambúrguer ---
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'menu-toggle';
    botao.id = 'menu-toggle';
    botao.setAttribute('aria-label', 'Abrir menu');
    botao.setAttribute('aria-controls', 'menu-lateral');
    botao.setAttribute('aria-expanded', 'false');
    botao.innerHTML = '&#9776;';
    (topBarLeft || topBar).insertBefore(botao, (topBarLeft || topBar).firstChild);

    if (!menu.id) menu.id = 'menu-lateral';

    // --- Overlay ---
    const overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    document.body.appendChild(overlay);

    // --- Módulos dentro do drawer (as .top-tab ficam ocultas no mobile) ---
    const abasModulo = Array.from(document.querySelectorAll('.top-bar-right .top-tab'));
    if (abasModulo.length) {
      const secao = document.createElement('div');
      secao.className = 'menu-modulos';

      const titulo = document.createElement('span');
      titulo.className = 'menu-modulos-titulo';
      titulo.textContent = 'Módulos';
      secao.appendChild(titulo);

      abasModulo.forEach(aba => {
        const clone = document.createElement('button');
        clone.type = 'button';
        clone.textContent = aba.textContent.trim();
        clone.dataset.moduloRef = aba.id;
        if (aba.classList.contains('active')) clone.classList.add('active');
        // Espelha a visibilidade definida pelas permissões do usuário
        if (aba.classList.contains('modulo-oculto')) clone.classList.add('modulo-oculto');
        clone.addEventListener('click', () => {
          fechar();
          aba.click();
        });
        secao.appendChild(clone);
      });

      menu.insertBefore(secao, menu.firstChild);

      // Mantém os clones em sincronia quando as permissões escondem uma aba
      const observer = new MutationObserver(() => {
        secao.querySelectorAll('[data-modulo-ref]').forEach(clone => {
          const original = document.getElementById(clone.dataset.moduloRef);
          if (original) clone.classList.toggle('modulo-oculto', original.classList.contains('modulo-oculto'));
        });
      });
      abasModulo.forEach(aba => observer.observe(aba, { attributes: true, attributeFilter: ['style', 'class'] }));
    }

    function estaAberto() {
      return menu.classList.contains('aberto');
    }

    function abrir() {
      menu.classList.add('aberto');
      overlay.classList.add('ativo');
      document.body.classList.add('drawer-aberto');
      botao.setAttribute('aria-expanded', 'true');
      botao.setAttribute('aria-label', 'Fechar menu');
    }

    function fechar() {
      menu.classList.remove('aberto');
      overlay.classList.remove('ativo');
      document.body.classList.remove('drawer-aberto');
      botao.setAttribute('aria-expanded', 'false');
      botao.setAttribute('aria-label', 'Abrir menu');
    }

    botao.addEventListener('click', () => (estaAberto() ? fechar() : abrir()));
    overlay.addEventListener('click', fechar);

    // Fecha ao escolher uma aba (mantém o fluxo de navegação no celular)
    menu.addEventListener('click', e => {
      if (window.innerWidth > MOBILE_MAX) return;
      const alvo = e.target.closest('button');
      if (alvo && !alvo.dataset.moduloRef) setTimeout(fechar, 0);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && estaAberto()) fechar();
    });

    // Ao voltar para desktop o drawer nunca pode ficar "preso" aberto
    window.addEventListener('resize', () => {
      if (window.innerWidth > MOBILE_MAX && estaAberto()) fechar();
    });

    window.fecharDrawer = fechar;
  }

  //====================================================================================================
  // Envolve tabelas largas em um wrapper com rolagem horizontal própria.
  // Evita que a página inteira ganhe scroll lateral em telas pequenas.
  //====================================================================================================
  function tornarTabelasResponsivas(raiz) {
    (raiz || document).querySelectorAll('table').forEach(tabela => {
      const pai = tabela.parentElement;
      if (!pai) return;
      if (pai.classList.contains('tabela-responsiva') || pai.classList.contains('tabela-produtos')) return;
      // Ja existe um container com rolagem propria (ex.: .frota-tabela-wrap)
      const overflowPai = window.getComputedStyle(pai).overflowX;
      if (overflowPai === 'auto' || overflowPai === 'scroll') return;
      const wrapper = document.createElement('div');
      wrapper.className = 'tabela-responsiva';
      pai.insertBefore(wrapper, tabela);
      wrapper.appendChild(tabela);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    iniciarDrawer();
    tornarTabelasResponsivas(document);

    // Tabelas criadas dinamicamente também recebem o wrapper
    const alvo = document.querySelector('.content');
    if (alvo && window.MutationObserver) {
      let agendado = false;
      new MutationObserver(() => {
        if (agendado) return;
        agendado = true;
        requestAnimationFrame(() => {
          agendado = false;
          tornarTabelasResponsivas(alvo);
        });
      }).observe(alvo, { childList: true, subtree: true });
    }
  });

  window.tornarTabelasResponsivas = tornarTabelasResponsivas;
})();
