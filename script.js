// script.js - Versão Otimizada

// Elementos do Modal de Imagem
const imageElements = {
  preview: document.getElementById('preview'),
  imagePreviewTrigger: document.getElementById('image-preview-trigger'),
  modal: document.getElementById('image-modal'),
  confirmUpload: document.getElementById('confirm-upload'),
  cancelUpload: document.getElementById('cancel-upload'),
  closeModal: document.querySelector('.close'),
  imagemInput: document.getElementById('imagem')
};

// Gerenciamento do Modal de Imagem
function setupImageModal() {
  // Busque os elementos sempre que a função for chamada
  const preview = document.getElementById('preview');
  const imagePreviewTrigger = document.getElementById('image-preview-trigger');
  const modal = document.getElementById('image-modal');
  const confirmUpload = document.getElementById('confirm-upload');
  const cancelUpload = document.getElementById('cancel-upload');
  const closeModal = document.querySelector('.close');
  const imagemInput = document.getElementById('imagem');

  // Só adiciona eventos se todos os elementos existirem
  if (preview && imagePreviewTrigger && modal && confirmUpload && cancelUpload && closeModal && imagemInput) {
    // Abre o modal ao clicar na imagem
    imagePreviewTrigger.addEventListener('click', () => {
      modal.style.display = 'block';
    });

    // Fecha o modal de várias formas
    [closeModal, cancelUpload].forEach(element => {
      element.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    });

    // Confirma o upload
    confirmUpload.addEventListener('click', () => {
      imagemInput.click();
      modal.style.display = 'none';
    });

    // Fecha o modal se clicar fora dele
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });

    // Atualiza o preview quando uma imagem é selecionada
    imagemInput.addEventListener('change', handleImageUpload);
  }
}

function handleImageUpload() {
  const file = imageElements.imagemInput.files[0];
  if (!file) return;

  // Validação do arquivo
  if (!file.type.match('image.*')) {
    alert('Por favor, selecione um arquivo de imagem válido (JPEG, PNG, etc.).');
    return;
  }
  
  if (file.size > 2 * 1024 * 1024) {
    alert('A imagem deve ter no máximo 2MB de tamanho.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    imageElements.preview.src = e.target.result;
    imageElements.preview.style.display = 'block';
    imageElements.preview.style.maxWidth = '110%';
    imageElements.preview.style.height = 'auto';
    imageElements.preview.style.maxHeight = '200px';
    document.querySelector('.no-image').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// Notificações
function adicionarNotificacao(texto) {
  const lista = document.getElementById('notificacoes');
  if (!lista) return; // Não faz nada se não existir a lista de notificações
  const novaNotificacao = document.createElement('li');
  novaNotificacao.textContent = texto;
  lista.prepend(novaNotificacao);
}

// Layout Responsivo
function setupResponsiveLayout() {
  // Criar botões de toggle se não existirem
  if (!document.querySelector('.toggle-menu')) {
    createToggleButton('toggle-menu', '☰ Menu', '.menu');
  }
  
  if (!document.querySelector('.toggle-sidebar')) {
    createToggleButton('toggle-sidebar', '☰ Sidebar', '.sidebar-right');
  }
  
  // Mostrar/ocultar botões com base no tamanho da tela
  const toggleMenu = document.querySelector('.toggle-menu');
  const toggleSidebar = document.querySelector('.toggle-sidebar');
  
  toggleSidebar.style.display = window.innerWidth <= 992 ? 'block' : 'none';
  toggleMenu.style.display = window.innerWidth <= 576 ? 'block' : 'none';
  
  // Fechar menu/sidebar ao clicar fora (para mobile)
  document.addEventListener('click', handleOutsideClick);
}

function createToggleButton(className, text, targetSelector) {
  const button = document.createElement('button');
  button.className = className;
  button.textContent = text;
  button.style.display = 'none';
  document.body.appendChild(button);
  
  button.addEventListener('click', () => {
    document.querySelector(targetSelector).classList.toggle('active');
  });
}

function handleOutsideClick(e) {
  const menu = document.querySelector('.menu');
  const sidebar = document.querySelector('.sidebar-right');
  
  if (window.innerWidth <= 576 && menu.classList.contains('active') && 
      !e.target.closest('.menu') && !e.target.closest('.toggle-menu')) {
    menu.classList.remove('active');
  }
  
  if (window.innerWidth <= 992 && sidebar.classList.contains('active') && 
      !e.target.closest('.sidebar-right') && !e.target.closest('.toggle-sidebar')) {
    sidebar.classList.remove('active');
  }
}

// Gerenciamento de Abas
function setupTabManagement() {
  // Abas superiores
  document.getElementById('almoxarifado-tab').addEventListener('click', () => setActiveTab('almoxarifado-tab'));
  document.getElementById('frota-tab').addEventListener('click', () => setActiveTab('frota-tab'));
  document.getElementById('ordens-tab').addEventListener('click', () => setActiveTab('ordens-tab'));
  
  // Inicializa com a aba Almoxarifado ativa
  setActiveTab('almoxarifado-tab');
}

function setActiveTab(activeTabId) {
  // Remove a classe active de todas as abas
  document.querySelectorAll('.top-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Adiciona a classe active apenas na aba clicada
  document.getElementById(activeTabId).classList.add('active');
}

// Formatação de Custo
function setupCostInput() {
  const custoInput = document.getElementById('custo');
  
  custoInput.addEventListener('input', function(e) {
    let value = this.value.replace(/[^\d,]/g, '');
    
    // Remove vírgulas extras
    const commaCount = value.split(',').length - 1;
    if (commaCount > 1) {
      const parts = value.split(',');
      value = parts.slice(0, -1).join('') + ',' + parts[parts.length - 1];
    }
    
    // Formata como moeda
    if (value.length > 0) {
      let [integerPart, decimalPart = ''] = value.split(',');
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      decimalPart = decimalPart.substring(0, 2);
      value = integerPart + (decimalPart.length > 0 ? ',' + decimalPart : '');
    }
    
    this.value = value;
  });
  
  // Validação do formulário
  document.getElementById('form-produtos').addEventListener('submit', function(e) {
    const custoValue = custoInput.value;
    const numericValue = parseFloat(custoValue.replace(/\./g, '').replace(',', '.'));
    
    if (isNaN(numericValue) || numericValue <= 0) {
      alert('Por favor, insira um valor válido para o custo.');
      e.preventDefault();
      custoInput.focus();
      return false;
    }
    
    custoInput.value = numericValue.toFixed(2).replace('.', ',');
  });
}

// Gerenciamento de Usuário
function setupUserManagement() {
  const spanUsuario = document.getElementById('logged-user');
  
  // Verifica se há usuário logado
  if (spanUsuario && spanUsuario.textContent === "Usuário Logado") {
    window.location.href = "login.html";
  } else {
    const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));
    if (usuarioSalvo?.nome) {
      spanUsuario.textContent = usuarioSalvo.nome;
    }
  }
  
  // Configura botões do menu
  document.getElementById("btn-config").addEventListener("click", () => alert("Abrindo configurações..."));
  document.getElementById("btn-info").addEventListener("click", () => alert("Informações do sistema."));
  
  // Logout
  document.getElementById("btn-logout").addEventListener("click", function(e) {
    e.preventDefault();
    if (confirm('Deseja realmente sair do sistema?')) {
      localStorage.removeItem("usuario");
      window.location.href = "login.html";
    }
  });
}

// Botão de Busca
function setupSearchButton() {
  document.querySelector('.tab-btn[data-tab="busca"]').addEventListener('click', () => {
    console.log('Botão de Busca foi clicado!');
  });
}

// Atualiza a pré-visualização da nota
function atualizarNotaPreview() {
  const id = document.getElementById('retirada-id')?.value || '-';
  const data = document.getElementById('retirada-data')?.value || '-';
  const requisitante = document.getElementById('retirada-requisitante')?.value || '-';
  const responsavel = document.getElementById('retirada-responsavel')?.value || '-';
  const local = document.getElementById('retirada-local')?.value === 'Outro'
    ? (document.getElementById('retirada-outro-local')?.value || '-')
    : (document.getElementById('retirada-local')?.value || '-');
  const finalidade = document.getElementById('retirada-finalidade')?.value || '-';
  const obs = document.getElementById('retirada-observacoes')?.value || '-';
  const itensRetirada = document.querySelectorAll('#itens-retirada tr');

  let itensHtml = '';
  if (itensRetirada.length > 0) {
    itensHtml = Array.from(itensRetirada).map(tr =>
      `<div>${tr.children[0].textContent} - Qtde: ${tr.children[1].textContent}</div>`
    ).join('');
  } else {
    itensHtml = `<div style="color:#888;">Nenhum item adicionado ainda.</div>`;
  }

  const notaPreview = document.getElementById('nota-preview');
  if (notaPreview) {
    notaPreview.innerHTML = `
      <div style="text-align:center; font-weight:bold; margin-bottom:8px; font-size:15px;">
        *** SINAL VIDA PLUS ***
      </div>
      <div style="font-size:12px; margin-bottom:8px; line-height:1.4;">
        <b>ID:</b> ${id}<br>
        <b>Data:</b> ${data}<br>
        <b>Requisitante:</b> ${requisitante}<br>
        <b>Responsável:</b> ${responsavel}<br>
        <b>Local de Destino:</b> ${local}<br>
        <b>Finalidade:</b> ${finalidade}<br>
        <b>Observações:</b> ${obs}
      </div>
      <div style="border-bottom:1px dashed #bbb; margin-bottom:8px;"></div>
      <div id="nota-preview-content">
        ${itensHtml}
      </div>
      <div style="border-top:1px dashed #bbb; margin-top:8px; font-size:11px; text-align:center;">
        <br>Retirada registrada
      </div>
    `;
  }
}

// Função para impressão do cupom fiscal
function imprimirCupomFiscal() {
  const cupom = document.getElementById('nota-preview').innerHTML;
  const win = window.open('', '', 'width=300,height=600');
  win.document.write(`
    <html>
      <head>
        <title>Cupom Fiscal</title>
        <style>
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 13px;
            margin: 0;
            padding: 0;
            background: #fff;
          }
          .cupom {
            width: 58mm;
            max-width: 58mm;
            min-width: 48mm;
            margin: 0 auto;
            padding: 0;
            border: none;
          }
          .cupom-content {
            padding: 0 2mm;
          }
        </style>
      </head>
      <body onload="window.print();window.close();">
        <div class="cupom">
          <div class="cupom-content">
            ${cupom}
          </div>
        </div>
      </body>
    </html>
  `);
  win.document.close();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  setupImageModal();
  setupResponsiveLayout();
  setupTabManagement();
  setupCostInput();
  setupUserManagement();
  setupSearchButton();
  
  // Exemplo de notificação
  adicionarNotificacao("Novo produto salvo com sucesso!");
  
  // Configura eventos de redimensionamento
  window.addEventListener('resize', setupResponsiveLayout);
});

// --- Verificação de login ao carregar ---
document.addEventListener('DOMContentLoaded', function() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  if (!usuario?.nome) window.location.href = "login.html";
  // Atualiza nome do usuário logado
  if (usuario?.nome) {
    const loggedUser = document.getElementById("logged-user");
    if (loggedUser) loggedUser.textContent = usuario.nome;
  }

  // Esconde botão "Ordens de Serviço" se não for admin
  const ordensBtn = document.getElementById('ordens-tab');
  if (ordensBtn && (!usuario || !usuario.tipo || usuario.tipo.toLowerCase() !== 'admin')) {
    ordensBtn.style.display = 'none';
  } else if (ordensBtn) {
    ordensBtn.style.display = '';
  }
});

// --- Alternância de abas ---
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    const tabId = this.getAttribute('data-tab');
    const tabContent = document.getElementById(tabId);
    if (tabContent) tabContent.classList.add('active');
    renderSidebar();
  });
});

// --- Renderização da sidebar dinâmica ---
function renderSidebar() {
  const tabRetiradas = document.getElementById('retiradas');
  const sidebar = document.getElementById('sidebar-content');
  const itensRetirada = document.querySelectorAll('#itens-retirada tr');
  const retiradasTabAtiva = tabRetiradas.classList.contains('active');
  const temItens = itensRetirada.length > 0;

  if (retiradasTabAtiva && temItens) {
    // Pegando os valores do formulário de retirada
    const id = document.getElementById('retirada-id')?.value || '-';
    const data = document.getElementById('retirada-data')?.value || '-';
    const requisitante = document.getElementById('retirada-requisitante')?.value || '-';
    const responsavel = document.getElementById('retirada-responsavel')?.value || '-';
    const local = document.getElementById('retirada-local')?.value === 'Outro'
      ? (document.getElementById('retirada-outro-local')?.value || '-')
      : (document.getElementById('retirada-local')?.value || '-');
    const finalidade = document.getElementById('retirada-finalidade')?.value || '-';
    const obs = document.getElementById('retirada-observacoes')?.value || '-';

    sidebar.innerHTML = `
      <h4>Nota de Retirada (Preview)</h4>
      <div id="nota-preview" style="
        background: #fff;
        border: 1px dashed #888;
        border-radius: 8px;
        padding: 18px 12px 18px 12px;
        margin: 16px 0 12px 0;
        font-family: 'Courier New', Courier, monospace;
        font-size: 13px;
        color: #222;
        box-shadow: 0 2px 8px #0001;
        max-width: 260px;
        min-width: 180px;
        text-align: left;
        letter-spacing: 0.5px;
      ">
        <div style="text-align:center; font-weight:bold; margin-bottom:8px; font-size:15px;">
          *** SINAL VIDA PLUS ***
        </div>
        <div style="font-size:12px; margin-bottom:8px; line-height:1.4;">
          <b>ID:</b> ${id}<br>
          <b>Data:</b> ${data}<br>
          <b>Requisitante:</b> ${requisitante}<br>
          <b>Responsável:</b> ${responsavel}<br>
          <b>Local de Destino:</b> ${local}<br>
          <b>Finalidade:</b> ${finalidade}<br>
          <b>Observações:</b> ${obs}
        </div>
        <div style="border-bottom:1px dashed #bbb; margin-bottom:8px;"></div>
        <div id="nota-preview-content">
          ${Array.from(itensRetirada).map(tr => `<div>${tr.children[0].textContent} - Qtde: ${tr.children[1].textContent}</div>`).join('')}
        </div>
        <div style="border-top:1px dashed #bbb; margin-top:8px; font-size:11px; text-align:center;">
          <br>Retirada registrada
        </div>
      </div>
    `;
  } else {
    sidebar.innerHTML = `
      <div style="padding: 18px 12px 18px 12px;">
        <h4 style="color:#292929; margin-bottom:10px;">Status do Sistema</h4>
        <div style="margin-bottom: 14px;">
          <b>Notificações</b>
          <ul style="list-style: disc; padding-left: 18px; color: #2d6a4f; margin: 6px 0 0 0;">
            <li>Novo produto salvo com sucesso!</li>
            <li>Produto "Sensor" salvo com sucesso</li>
          </ul>
        </div>
        <div style="margin-bottom: 14px;">
          <b style="color:#950a0a;">Estoque Crítico</b>
          <ul style="list-style: disc; padding-left: 18px; color: #950a0a; margin: 6px 0 0 0;">
            <li>Parafuso M10 - Qtde: 2</li>
          </ul>
        </div>
        <div style="margin-bottom: 14px;">
          <b>Atividades Recentes</b>
          <ul style="list-style: disc; padding-left: 18px; color: #555; margin: 6px 0 0 0;">
            <li>Entrada: Fita Isolante - Hoje, 14:20</li>
          </ul>
        </div>
        <div style="margin-bottom: 14px;">
          <b>Processos</b>
          <ul style="list-style: disc; padding-left: 18px; color: #f9a825; margin: 6px 0 0 0;">
            <li>Enviando imagem de produto...</li>
          </ul>
        </div>
        <div>
          <b>Resumo</b>
          <ul style="list-style: disc; padding-left: 18px; color: #292929; margin: 6px 0 0 0;">
            <li>Total Produtos: 245</li>
            <li>Vencendo em 30 dias: 12</li>
            <li>Média Estoque: 38 unid</li>
          </ul>
        </div>
      </div>
    `;
  }
}

// Gerenciar abas laterais
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Remove 'active' de todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    // Adiciona 'active' apenas na aba correspondente ao botão clicado
    const tabId = btn.getAttribute('data-tab');
    const tabContent = document.getElementById(tabId);
    if (tabContent) tabContent.classList.add('active');
    setTimeout(renderSidebar, 100);
  });
});



// Retiradas
function setupRetiradasForm() {
  const formRetiradas = document.getElementById('form-retiradas');
  const localDestino = document.getElementById('retirada-local');
  const outroLocalContainer = document.getElementById('outro-local-container');
  const btnAcrescentar = document.getElementById('btn-acrescentar-item');
  const btnCancelar = document.getElementById('btn-cancelar');
  const tbodyItens = document.getElementById('itens-retirada'); // Use só esta declaração!

  if (formRetiradas) {
    // Preenche a data atual automaticamente
    const dataRetirada = document.getElementById('retirada-data');
    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16);
    dataRetirada.value = formattedDateTime;
    
    // Gerar ID automático (simulação)
    const retiradaId = document.getElementById('retirada-id');
    retiradaId.value = Math.floor(1000 + Math.random() * 9000);
    
    // Mostrar/ocultar campo "Outro Local"
    localDestino.addEventListener('change', function() {
      outroLocalContainer.style.display = this.value === 'Outro' ? 'block' : 'none';
      if (this.value !== 'Outro') {
        document.getElementById('retirada-outro-local').value = '';
      }
    });

    // Adicionar item à tabela
    btnAcrescentar.addEventListener('click', function() {
      const produto = document.getElementById('retirada-produto').value;
      const quantidade = document.getElementById('retirada-quantidade').value;
      const local = document.getElementById('retirada-local').value === 'Outro' 
        ? document.getElementById('retirada-outro-local').value 
        : document.getElementById('retirada-local').value;
      const finalidade = document.getElementById('retirada-finalidade').value;

      if (!produto || !quantidade || !local || !finalidade) {
        alert('Preencha todos os campos obrigatórios antes de adicionar o item.');
        return;
      }

      // Adiciona item à tabela
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${produto}</td>
        <td>${quantidade}</td>
        <td>${local}</td>
        <td>${finalidade}</td>
        <td>
        <button class="acao-btn editar-item" style="background:#FFCB1F; color:#222; border:none; border-radius:4px; padding:2px 8px; margin-right:4px; cursor:pointer;">Editar</button>
        <button class="acao-btn remover-item" style="background:#A30000; color:#fff; border:none; border-radius:4px; padding:2px 8px; cursor:pointer;">Remover</button>
        </td>
      `;
      tbodyItens.appendChild(newRow);

      // Limpa os campos do produto
      document.getElementById('retirada-produto').value = '';
      document.getElementById('retirada-quantidade').value = '';

      // Exibe e atualiza a Nota de Retirada (Preview)
      atualizarNotaPreview();
      const notaPreview = document.getElementById('nota-preview');
      if (notaPreview) {
        notaPreview.style.display = 'block';
      }

      // Oculta o bloco de informações do sistema (sidebar) ao adicionar o primeiro item
      const sidebarExemplo = document.querySelector('.sidebar-exemplo');
      if (sidebarExemplo) {
        sidebarExemplo.style.display = 'none';
      }

      // Chama a renderização da sidebar para garantir que o preview apareça
      if (typeof renderSidebar === 'function') {
        renderSidebar();
      }
    });

    // Remover ou editar item da tabela
    tbodyItens.addEventListener('click', function(e) {
      if (e.target.classList.contains('remover-item')) {
        e.target.closest('tr').remove();
        atualizarNotaPreview();
      }
      if (e.target.classList.contains('editar-item')) {
        const row = e.target.closest('tr');
        // Carrega os dados do item nos campos para edição
        document.getElementById('retirada-produto').value = row.cells[0].textContent;
        document.getElementById('retirada-quantidade').value = row.cells[1].textContent;
        // Remove o item da lista para ser editado
        row.remove();
        atualizarNotaPreview();
      }
    });

    // Cancelar retirada
    btnCancelar.addEventListener('click', function() {
      if (confirm('Deseja realmente cancelar esta retirada? Todos os itens serão perdidos.')) {
        formRetiradas.reset();
        tbodyItens.innerHTML = '';
        outroLocalContainer.style.display = 'none';
      }
    });

    // Manipulação do envio do formulário
    formRetiradas.addEventListener('submit', function(e) {
      e.preventDefault();
      if (tbodyItens.rows.length === 0) {
        alert('Adicione pelo menos um item antes de finalizar a retirada.');
        return;
      }

      // Simulação de sucesso
      adicionarNotificacao(`Retirada #${retiradaId.value} finalizada com sucesso!`);
      
      // Aqui você adicionaria a lógica para enviar os dados para o servidor
      const itens = [];
      Array.from(tbodyItens.rows).forEach(row => {
        itens.push({
          produto: row.cells[0].textContent,
          quantidade: row.cells[1].textContent,
          destino: row.cells[2].textContent,
          finalidade: row.cells[3].textContent
        });
      });
      
      console.log('Dados da retirada:', {
        id: retiradaId.value,
        data: dataRetirada.value,
        requisitante: document.getElementById('retirada-requisitante').value,
        responsavel: document.getElementById('retirada-responsavel').value,
        observacoes: document.getElementById('retirada-observacoes').value,
        itens: itens
      });
      
      imprimirCupomFiscal();

      // Limpar o formulário após envio
      formRetiradas.reset();
      tbodyItens.innerHTML = '';
      outroLocalContainer.style.display = 'none';
      retiradaId.value = Math.floor(1000 + Math.random() * 9000);
      dataRetirada.value = new Date().toISOString().slice(0, 16);
      atualizarNotaPreview();
    });

    // Atualiza a prévia ao carregar a aba
    atualizarNotaPreview();

    // Atualiza a prévia ao modificar qualquer campo do formulário
    const camposRetirada = [
      'retirada-id',
      'retirada-data',
      'retirada-requisitante',
      'retirada-responsavel',
      'retirada-local',
      'retirada-outro-local',
      'retirada-finalidade',
      'retirada-observacoes'
    ];

    camposRetirada.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', atualizarNotaPreview);
        el.addEventListener('change', atualizarNotaPreview);
      }
    });

    // Atualiza a prévia ao adicionar/remover item
    if (tbodyItens) {
      tbodyItens.addEventListener('DOMSubtreeModified', atualizarNotaPreview);
    }
  }
}

const camposRetirada = [
  'retirada-id',
  'retirada-data',
  'retirada-requisitante',
  'retirada-responsavel',
  'retirada-local',
  'retirada-outro-local',
  'retirada-finalidade',
  'retirada-observacoes'
];

camposRetirada.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', atualizarNotaPreview);
    el.addEventListener('change', atualizarNotaPreview);
  }
});

// Também garanta que atualizarNotaPreview é chamada ao adicionar/remover item
const tbodyItens = document.getElementById('itens-retirada');
if (tbodyItens) {
  // Ao adicionar item já está sendo chamada, mas garanta ao remover também:
  tbodyItens.addEventListener('DOMSubtreeModified', atualizarNotaPreview);
}

function atualizarCamposFixosNosItens() {
  const local = document.getElementById('retirada-local').value === 'Outro'
    ? document.getElementById('retirada-outro-local').value
    : document.getElementById('retirada-local').value;
  const finalidade = document.getElementById('retirada-finalidade').value;

  const tbodyItens = document.getElementById('itens-retirada');
  Array.from(tbodyItens.rows).forEach(row => {
    // Atualiza Local (coluna 2) e Finalidade (coluna 3)
    row.cells[2].textContent = local;
    row.cells[3].textContent = finalidade;
  });
  atualizarNotaPreview();
}

// Não se esqueça de chamar a função no DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // ... outras inicializações
  setupRetiradasForm();
  document.getElementById('retirada-local').addEventListener('change', atualizarCamposFixosNosItens);
  document.getElementById('retirada-outro-local').addEventListener('input', atualizarCamposFixosNosItens);
  document.getElementById('retirada-finalidade').addEventListener('change', atualizarCamposFixosNosItens);
});

// Controle de ID de devolução (simples, pode ser melhorado)
let devolucaoId = 1;

document.addEventListener('DOMContentLoaded', function () {
  const formDevolucao = document.getElementById('form-devolucao');
  const itensDevolucao = document.getElementById('itens-devolucao');
  const inputId = document.getElementById('devolucao-id');

  if (formDevolucao) {
    formDevolucao.addEventListener('submit', function (e) {
      e.preventDefault();

      const idRetirada = document.getElementById('devolucao-id').value;
      const produto = document.getElementById('devolucao-produto').value;
      const quantidade = document.getElementById('devolucao-quantidade').value;
      const requisitante = document.getElementById('devolucao-requisitante').value;
      const responsavel = document.getElementById('devolucao-responsavel').value;
      const observacao = document.getElementById('devolucao-observacao').value;
      const data = document.getElementById('devolucao-data').value;

      // Adiciona na tabela
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idRetirada}</td>
        <td>${produto}</td>
        <td>${quantidade}</td>
        <td>${requisitante}</td>
        <td>${responsavel}</td>
        <td>${observacao}</td>
        <td>${data}</td>
      `;
      itensDevolucao.appendChild(tr);

      formDevolucao.reset();
    });
  }
});

function preencherDatalistIdsRetirada() {
  const datalist = document.getElementById('lista-ids-retirada');
  if (!datalist) return;

  // Exemplo: recuperando retiradas do localStorage
  const retiradas = JSON.parse(localStorage.getItem('retiradas')) || [];
  datalist.innerHTML = '';
  retiradas.forEach(retirada => {
    if (retirada.id) {
      const option = document.createElement('option');
      option.value = retirada.id;
      datalist.appendChild(option);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // ...outros códigos...
  preencherDatalistIdsRetirada();
});

// Se você adicionar/remover retiradas dinamicamente, chame preencherDatalistIdsRetirada() novamente após cada alteração.

// Busca geral
const formBusca = document.getElementById('form-busca');
const resultadoBusca = document.getElementById('resultado-busca');

if (formBusca && resultadoBusca) {
  formBusca.addEventListener('submit', function (e) {
    e.preventDefault();
    const tipo = document.getElementById('tipo-busca').value;
    // const termo = document.getElementById('termo-busca').value.trim().toLowerCase();
    const inicio = document.getElementById('busca-inicio').value;
    const fim = document.getElementById('busca-fim').value;

    let dados = [];
    if (tipo === 'produtos') {
      dados = JSON.parse(localStorage.getItem('produtos')) || [];
    } else if (tipo === 'retiradas') {
      dados = JSON.parse(localStorage.getItem('retiradas')) || [];
    } else if (tipo === 'devolucoes') {
      dados = JSON.parse(localStorage.getItem('retiradas')) || [];
    } else if (tipo === 'devolucoes') {
      dados = JSON.parse(localStorage.getItem('devolucoes')) || [];
    } else if (tipo === 'fornecedores') {
      dados = JSON.parse(localStorage.getItem('fornecedores')) || [];
    } else if (tipo === 'requisitantes') {
      dados = JSON.parse(localStorage.getItem('requisitantes')) || [];
    }

    // Filtra resultados por termo
    let filtrados = dados.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(termo)
      )
    );

    // Filtra por período se houver datas e o item possuir campo de data
    if (inicio || fim) {
      filtrados = filtrados.filter(item => {
        // Tenta encontrar o campo de data mais provável
        let dataItem = item.data || item.dataRetirada || item.dataCadastro || item.dataEntrada || "";
        if (!dataItem) return false;
        dataItem = dataItem.slice(0, 10);
        if (inicio && dataItem < inicio) return false;
        if (fim && dataItem > fim) return false;
        return true;
      });
    }

    // Monta tabela de resultados
    let cabecalho = [];
    if (filtrados.length > 0) {
      cabecalho = Object.keys(filtrados[0]);
    } else if (filtrosPorTipo[tipo] && filtrosPorTipo[tipo].length > 0) {
      // Usa os campos do filtro para montar o cabeçalho se não houver dados
      cabecalho = filtrosPorTipo[tipo].map(f => f.label);
    }

    let html = '';
    if (cabecalho.length > 0) {
      html = '<table><thead><tr>';
      cabecalho.forEach(c => html += `<th>${c.toUpperCase()}</th>`);
      html += '</tr></thead><tbody>';
      if (filtrados.length > 0) {
        filtrados.forEach(obj => {
          html += '<tr>';
          Object.keys(obj).forEach(c => html += `<td>${obj[c]}</td>`);
          html += '</tr>';
        });
      } else {
        html += '<tr>' + cabecalho.map(() => '<td>&nbsp;</td>').join('') + '</tr>';
      }
      html += '</tbody></table>';
      resultadoBusca.innerHTML = html;
    } else {
      resultadoBusca.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    }
  });
}

// Filtros dinâmicos por tipo
const filtrosPorTipo = {
  retiradas: [
    { id: 'id-retirada', label: 'ID DA RETIRADA', type: 'text' },
    { id: 'local-destino', label: 'LOCAL DE DESTINO', type: 'text' },
    { id: 'finalidade', label: 'FINALIDADE', type: 'text' },
    { id: 'requisitante', label: 'REQUISITANTE', type: 'text' },
    { id: 'responsavel', label: 'RESPONSÁVEL', type: 'text' },
    { id: 'produto', label: 'PRODUTO', type: 'text' }
  ],
  devolucoes: [
    { id: 'id-retirada', label: 'ID DA RETIRADA', type: 'text' },
    { id: 'requisitante', label: 'REQUISITANTE', type: 'text' },
    { id: 'responsavel', label: 'RESPONSÁVEL', type: 'text' },
    { id: 'produto', label: 'PRODUTO', type: 'text' }
  ],
  fornecedores: [
    { id: 'razao-social', label: 'Razão social', type: 'text' },
    { id: 'cnpj-cpf', label: 'CNPJ/CPF', type: 'text' },
    { id: 'cidade', label: 'CIDADE', type: 'text' },
    { id: 'urf', label: 'URF', type: 'text' }
  ],
  produtos: [
    { id: 'id', label: 'ID', type: 'text' },
    { id: 'codigo', label: 'CÓDIGO', type: 'text' },
    { id: 'nome-produto', label: 'NOME DO PRODUTO', type: 'text' },
    { id: 'marca', label: 'MARCA', type: 'text' }
  ],
  requisitantes: [
    { id: 'nome', label: 'NOME', type: 'text' },
    { id: 'setor', label: 'SETOR', type: 'text' }
  ],
  kits: [
    { id: 'id', label: 'ID DO KIT', type: 'text' },
    { id: 'nome', label: 'NOME DO KIT', type: 'text' },
    { id: 'categoria', label: 'CATEGORIA', type: 'text' } // alterado de DESCRIÇÃO para CATEGORIA
  ]
};

function renderFiltros(tipo) {
  const filtrosDiv = document.getElementById('filtros-dinamicos');
  filtrosDiv.innerHTML = '';
  filtrosPorTipo[tipo].forEach(filtro => {
    // Cria datalist único para cada campo
    const datalistId = `datalist-${tipo}-${filtro.id}`;
    const div = document.createElement('div');
    div.innerHTML = `
      <label for="filtro-${filtro.id}">${filtro.label}</label>
      <input type="text" id="filtro-${filtro.id}" name="filtro-${filtro.id}" style="width: 140px;" list="${datalistId}" autocomplete="off" value="Todos">
      <datalist id="${datalistId}">
        <option value="Todos"></option>
      </datalist>
    `;
    filtrosDiv.appendChild(div);

    // Sugestões de exemplo para cada campo
    const exemplos = {
      'id-retirada': ['1234', '5678', '9999'],
      'local-destino': ['Almoxarifado', 'Oficina', 'Setor TI'],
      'finalidade': ['Manutenção', 'Consumo', 'Reposição'],
      'requisitante': ['João Silva', 'Maria Souza', 'Carlos Lima'],
      'responsavel': ['Ana Paula', 'Roberto Dias', 'Fernanda Luz'],
      'produto': ['Parafuso', 'Óleo', 'Filtro'],
      'razao-social': ['Empresa X', 'Fornecedor Y', 'Distribuidora Z'],
      'cnpj-cpf': ['12.345.678/0001-90', '123.456.789-00', '98.765.432/0001-12'],
      'cidade': ['São Paulo', 'Rio de Janeiro', 'Curitiba'],
      'urf': ['URF01', 'URF02', 'URF03'],
      'id': ['1', '2', '3'],
      'codigo': ['A001', 'B002', 'C003'],
      'nome-produto': ['Teclado', 'Mouse', 'Monitor'],
      'marca': ['Dell', 'HP', 'Logitech'],
      'nome': ['Setor Compras', 'Setor RH', 'Setor TI'],
      'setor': ['Compras', 'RH', 'TI'],
      'categoria': ['Informática', 'Ferramentas', 'Limpeza'],
      'descricao': ['Kit básico', 'Kit avançado', 'Kit manutenção']
    };

    // Preenche o datalist com opções únicas do localStorage (se houver)
    let dados = JSON.parse(localStorage.getItem(tipo)) || [];
    let campo = filtro.id.replace(/-/g, '');
    if (tipo === 'produtos' && campo === 'nomeproduto') campo = 'nome-produto';
    if (tipo === 'kits' && campo === 'descricao') campo = 'categoria';
    if (campo === 'idretirada') campo = 'idRetirada';
    if (campo === 'razaosocial') campo = 'razaoSocial';
    if (campo === 'cnpjcpf') campo = 'cnpjCpf';

    // Adiciona opções únicas do localStorage
    const valoresUnicos = [...new Set(dados.map(item => item[campo]).filter(Boolean))];
    const datalist = div.querySelector('datalist');
    valoresUnicos.forEach(valor => {
      if (valor !== "Todos") {
        const option = document.createElement('option');
        option.value = valor;
        datalist.appendChild(option);
      }
    });

    // Adiciona exemplos se não houver dados ou sempre
    if (valoresUnicos.length === 0 && exemplos[filtro.id]) {
      exemplos[filtro.id].forEach(exemplo => {
        if (exemplo !== "Todos") {
          const option = document.createElement('option');
          option.value = exemplo;
          datalist.appendChild(option);
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // ...existing code...

  const tipoBusca = document.getElementById('tipo-busca');
  if (tipoBusca) {
    renderFiltros(tipoBusca.value);
    tipoBusca.addEventListener('change', function () {
      renderFiltros(this.value);
    });
  }

  const formBusca = document.getElementById('form-busca');
  const resultadoBusca = document.getElementById('resultado-busca');

  if (formBusca && resultadoBusca) {
    formBusca.addEventListener('submit', function (e) {
      e.preventDefault();
      const tipo = tipoBusca.value;
      let dados = [];
      if (tipo === 'retiradas') {
        dados = JSON.parse(localStorage.getItem('retiradas')) || [];
      } else if (tipo === 'devolucoes') {
        dados = JSON.parse(localStorage.getItem('devolucoes')) || [];
      } else if (tipo === 'fornecedores') {
        dados = JSON.parse(localStorage.getItem('fornecedores')) || [];
      }

      // Coleta filtros preenchidos
      const filtros = {};
      filtrosPorTipo[tipo].forEach(filtro => {
        const val = document.getElementById('filtro-' + filtro.id).value.trim().toLowerCase();
        if (val) filtros[filtro.id] = val;
      });

      // Filtra resultados
      const filtrados = dados.filter(item => {
        return Object.entries(filtros).every(([key, val]) => {
          // Mapeia nomes dos campos do filtro para os nomes reais do objeto, se necessário
          let campo = key.replace(/-/g, '');
          // Adapta para nomes reais dos campos no objeto, se necessário
          if (campo === 'idretirada') campo = 'idRetirada';
          if (campo === 'razaosocial') campo = 'razaoSocial';
          if (campo === 'cnpjcpf') campo = 'cnpjCpf';
          return (item[campo] || '').toString().toLowerCase().includes(val);
        });
      });

      // Monta tabela de resultados
      let cabecalho = [];
      if (filtrados.length > 0) {
        cabecalho = Object.keys(filtrados[0]);
      } else if (filtrosPorTipo[tipo] && filtrosPorTipo[tipo].length > 0) {
        // Usa os campos do filtro para montar o cabeçalho se não houver dados
        cabecalho = filtrosPorTipo[tipo].map(f => f.label);
      }

      let html = '';
      if (cabecalho.length > 0) {
        html = '<table><thead><tr>';
        cabecalho.forEach(c => html += `<th>${c.toUpperCase()}</th>`);
        html += '</tr></thead><tbody>';
        if (filtrados.length > 0) {
          filtrados.forEach(obj => {
            html += '<tr>';
            Object.keys(obj).forEach(c => html += `<td>${obj[c]}</td>`);
            html += '</tr>';
          });
        } else {
          html += '<tr>' + cabecalho.map(() => '<td>&nbsp;</td>').join('') + '</tr>';
        }
        html += '</tbody></table>';
        resultadoBusca.innerHTML = html;
      } else {
        resultadoBusca.innerHTML = '<p>Nenhum resultado encontrado.</p>';
      }
    });
  }

  // Seleciona o botão e a aba de Gerenciamento ao iniciar a página
  const btnGerenciamento = document.querySelector('.tab-btn[data-tab="gerenciamento"]');
  const tabGerenciamento = document.getElementById('gerenciamento');
  if (btnGerenciamento && tabGerenciamento) {
    // Remove 'active' de todos os botões e abas
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    // Adiciona 'active' ao botão e à aba de Gerenciamento
    btnGerenciamento.classList.add('active');
    tabGerenciamento.classList.add('active');
  }
});

// --- Mostrar detalhes dos itens na tabela de confirmações ---
function mostrarDetalhesItens(btn) {
  const detalhes = btn.parentElement.querySelector('.detalhes-itens');
  if (detalhes) {
    detalhes.style.display = detalhes.style.display === 'none' ? 'block' : 'none';
  }
}

// --- Outras funções JS do sistema ---
// (Coloque aqui as demais funções JS do seu sistema, como manipulação de formulários, modais, etc.)

