document.addEventListener('DOMContentLoaded', function () {
  const sidebarContent = document.getElementById('sidebar-content'); // Painel lateral direito
  const tbodyItens = document.getElementById('itens-retirada'); // Tabela de itens para retirada
  const tabs = document.querySelectorAll('.tab-btn'); // Botões das abas
  const tabContents = document.querySelectorAll('.tab-content'); // Conteúdo das abas

  // Função para atualizar o preview no painel lateral
  function atualizarPreviewCupom() {
    const itensRetirada = document.querySelectorAll('#itens-retirada tr');

    if (!sidebarContent) return;

    // Verifica se está na aba Retiradas
    const abaRetiradasAtiva = document.getElementById('retiradas').classList.contains('active');
    if (abaRetiradasAtiva) {
      if (itensRetirada.length === 0) {
        // Exibe mensagem padrão se não houver itens na lista
        sidebarContent.innerHTML = `
          <h4>Status do Sistema</h4>
          <p>Notificação: Nenhum item adicionado para retirada.</p>
        `;
        return;
      }

      // Coleta os dados para exibir o preview
      const id = document.getElementById('retirada-id')?.value || '-';
      const data = document.getElementById('retirada-data')?.value || '-';
      const requisitante = document.getElementById('retirada-requisitante')?.value || '-';
      const responsavel = document.getElementById('retirada-responsavel')?.value || '-';
      const local = document.getElementById('retirada-local').value === 'Outro'
        ? (document.getElementById('retirada-outro-local')?.value || '-')
        : (document.getElementById('retirada-local')?.value || '-');
      const finalidade = document.getElementById('retirada-finalidade')?.value || '-';
      const obs = document.getElementById('retirada-observacoes')?.value || '-';

      let itensHtml = Array.from(itensRetirada).map(tr => {
        const nomeItem = tr.children[0].textContent;
        const quantidadeItem = tr.children[1].textContent;
        const idItem = tr.children[4]?.dataset.id || '-'; // Supondo que o ID do item esteja armazenado no atributo `data-id` da célula

        return `
          <div style="margin-bottom: 8px;">
            <b>${nomeItem}</b><br>
            <span style="font-size: 12px; color: #555;">Qtde: ${quantidadeItem} | ID: ${idItem}</span>
          </div>
        `;
      }).join('');

      // Exibe o preview da nota com a linha de assinatura
      sidebarContent.innerHTML = `
        <div style="margin-bottom: 16px;">
          <h4 style="margin-bottom: 8px;">Nota de Retirada</h4>
          <div style="
            background: #fff;
            border: 1px dashed #888;
            border-radius: 8px;
            padding: 16px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 13px;
            color: #222;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            max-width: 260px;
            text-align: left;
          ">
            <div style="text-align:center; font-weight:bold; margin-bottom:8px; font-size:15px;">
              *** SINAL VIDA PLUS ***
            </div>
            <div style="font-size:12px; margin-bottom:8px; line-height:1.4;">
              <b>ID:</b> ${id}<br>
              <b>Data:</b> ${data}<br>
              <b>Requisitante:</b> ${requisitante}<br>
              <b>Responsável:</b> ${responsavel}<br>
              <b>Local:</b> ${local}<br>
              <b>Finalidade:</b> ${finalidade}<br>
              <b>Observações:</b> ${obs || 'Nenhuma'}
            </div>
            <div style="border-bottom:1px dashed #bbb; margin-bottom:8px;"></div>
            <div style="margin-bottom: 8px;"><b>Itens:</b></div>
            ${itensHtml}
            <div style="border-top:1px dashed #bbb; margin-top:8px; font-size:11px; text-align:center;">
            </div>
            <div style="margin-top: 16px; text-align: center;">
              <hr style="border: none; border-top: 1.4px solid #888; margin: 16px 0;margin-top: 40px; width: 100%;">
              <span style="font-size: 12px; color: #888;">Assinatura do Requisitante</span>
              <div style="border-top:1px dashed #bbb; margin-top:8px; font-size:11px; text-align:center;">
              <br>Retirada registrada
            </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Exibe o conteúdo padrão nas demais abas
      renderSidebar();
    }
  }

  // Função para renderizar o conteúdo padrão na barra lateral
  function renderSidebar() {
    if (sidebarContent) {
      sidebarContent.innerHTML = `
        <div class="sidebar-section">
          <h3>Status do Sistema</h3>
          <ul>
            <li>Notificação: Novo produto salvo com sucesso!</li>
            <li>Estoque crítico: Parafuso M10 - Qtde: 2</li>
          </ul>
        </div>
        <div class="sidebar-section">
          <h3>Resumo</h3>
          <ul>
            <li>Total Produtos: 245</li>
            <li>Vencendo em 30 dias: 12</li>
            <li>Média Estoque: 38 unid</li>
          </ul>
        </div>
      `;
    }
  }

  // Adiciona eventos para atualizar o preview ao alterar os campos
  const camposParaMonitorar = [
    'retirada-data',
    'retirada-requisitante',
    'retirada-responsavel',
    'retirada-observacoes',
    'retirada-finalidade',
    'retirada-local',
    'retirada-outro-local'
  ];

  camposParaMonitorar.forEach(campoId => {
    const campo = document.getElementById(campoId);
    if (campo) {
      campo.addEventListener('input', atualizarPreviewCupom);
      campo.addEventListener('change', atualizarPreviewCupom);
    }
  });

  // Adiciona item à tabela ao clicar no botão "Acrescentar Item"
  const btnAcrescentarItem = document.getElementById('btn-acrescentar-item');
  if (btnAcrescentarItem) {
    btnAcrescentarItem.addEventListener('click', function () {
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
          <button class="acao-btn editar-item">Editar</button>
          <button class="acao-btn remover-item">Remover</button>
        </td>
      `;
      tbodyItens.appendChild(newRow);

      // Limpa os campos do produto
      document.getElementById('retirada-produto').value = '';
      document.getElementById('retirada-quantidade').value = '';

      // Atualiza o preview no painel lateral
      atualizarPreviewCupom();
    });
  }

  // Remover ou editar item da tabela
  tbodyItens.addEventListener('click', function (e) {
    if (e.target.classList.contains('remover-item')) {
      e.target.closest('tr').remove();
      atualizarPreviewCupom();
    }
    if (e.target.classList.contains('editar-item')) {
      const row = e.target.closest('tr');
      document.getElementById('retirada-produto').value = row.cells[0].textContent;
      document.getElementById('retirada-quantidade').value = row.cells[1].textContent;
      row.remove();
      atualizarPreviewCupom();
    }
  });

  // Atualiza o preview ao acessar a aba Retiradas
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab'); // Obtém o ID da aba
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(tabId)?.classList.add('active');

      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      atualizarPreviewCupom();
    });
  });

  // Atualiza o preview ao carregar a página
  atualizarPreviewCupom();
});