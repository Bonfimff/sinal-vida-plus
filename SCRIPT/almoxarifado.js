// Exibe a div de busca de kits apenas quando selecionado "kits" no filtro geral
document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById('tipo-busca');
  const divKits = document.getElementById('busca-kits');
  if (!select || !divKits) return;
  function mostrarDivKits() {
    if (select.value === 'kits') {
      divKits.style.display = 'block';
    } else {
      divKits.style.display = 'none';
    }
  }
  select.addEventListener('change', mostrarDivKits);
  mostrarDivKits();
});
document.getElementById('btn-baixar-tabela')?.addEventListener('click', function() {
  console.log('[DEBUG] Botão "Baixar Tabela" clicado!');
});
//======================================================================================================
// FUNÇÃO PRINCIPAL: Exportação de Tabela de Produtos
// Exporta a tabela de produtos para um arquivo Excel (.xlsx) usando SheetJS, aplicando estilos e layout.
//======================================================================================================
function exportarTabelaProdutosParaExcel() {
  if (typeof XLSX === 'undefined') {
    alert('A biblioteca de exportação XLSX não foi carregada.');
    return;
  }
  const tabela = document.getElementById('Lista-dos-produtos');
  if (!tabela) {
    alert('Tabela de produtos não encontrada!');
    return;
  }
  // Coleta os cabeçalhos visíveis
  const ths = tabela.querySelectorAll('thead th');
  const headers = Array.from(ths).filter(th => th.offsetParent !== null).map(th => th.textContent.trim());
  // Coleta as linhas visíveis do tbody
  const trs = tabela.querySelectorAll('tbody tr');
  const data = [];
  trs.forEach(tr => {
    if (tr.offsetParent === null) return;
    const row = [];
    Array.from(tr.children).forEach(td => {
      if (td.offsetParent !== null) {
        row.push(td.textContent.trim());
      }
    });
    if (row.length > 0) data.push(row);
  });


  const aoa = [];
  aoa.push([]); // Linha 1 vazia
  aoa.push(['', ...headers]); // Linha 2: cabeçalho começa em B2
  data.forEach(row => aoa.push(['', ...row]));

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Estilização do cabeçalho (linha 2, colunas B em diante)
  const colCount = headers.length;
  // Cabeçalho: linha 2 (índice 1)
  for (let c = 1; c <= colCount; ++c) {
    const cell = ws[XLSX.utils.encode_cell({r:1, c:c})];
    if (cell) {
      cell.s = {
        fill: { patternType: 'solid', fgColor: { rgb: '4D4D4D' } },
        font: { name: 'Calibri', sz: 14, bold: true, color: { rgb: 'FFFF00' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top:    { style: 'thin', color: { rgb: '888888' } },
          bottom: { style: 'thin', color: { rgb: '888888' } },
          left:   { style: 'thin', color: { rgb: '888888' } },
          right:  { style: 'thin', color: { rgb: '888888' } }
        }
      };
    }
  }
  // Conteúdo: linhas 3+ (índice 2 em diante)
  for (let r = 2; r < aoa.length; ++r) {
    for (let c = 1; c <= colCount; ++c) {
      const cell = ws[XLSX.utils.encode_cell({r:r, c:c})];
      if (cell) {
        cell.s = {
          font: { name: 'Calibri', sz: 12, bold: false, color: { rgb: '000000' } },
          alignment: { horizontal: 'left', vertical: 'center' },
          border: {
            top:    { style: 'thin', color: { rgb: 'BBBBBB' } },
            bottom: { style: 'thin', color: { rgb: 'BBBBBB' } },
            left:   { style: 'thin', color: { rgb: 'BBBBBB' } },
            right:  { style: 'thin', color: { rgb: 'BBBBBB' } }
          }
        };
      }
    }
  }

  // Ajuste automático de largura das colunas (simula autoFit)
  ws['!cols'] = [{ wch: 2 }]; // Coluna A vazia
  for (let c = 0; c < colCount; ++c) {
    let maxLen = headers[c].length;
    for (let r = 0; r < data.length; ++r) {
      const val = data[r][c] ? String(data[r][c]) : '';
      if (val.length > maxLen) maxLen = val.length;
    }
    // Ajuste: +2 para espaçamento extra
    ws['!cols'].push({ wch: maxLen + 2 });
  }


  for (let c = 1; c <= colCount; ++c) {
    // Topo do cabeçalho
    const cell = ws[XLSX.utils.encode_cell({r:1, c:c})];
    if (cell && cell.s && cell.s.border) {
      cell.s.border.top = { style: 'medium', color: { rgb: '000000' } };
    }
    // Base da última linha
    const lastCell = ws[XLSX.utils.encode_cell({r:aoa.length-1, c:c})];
    if (lastCell && lastCell.s && lastCell.s.border) {
      lastCell.s.border.bottom = { style: 'medium', color: { rgb: '000000' } };
    }
  }

  // Garante que a tabela comece em B2
  ws['!ref'] = XLSX.utils.encode_range({ s: { r:1, c:1 }, e: { r: aoa.length-1, c: colCount } });

  // Cria e salva o arquivo
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Produtos');
  XLSX.writeFile(wb, 'produtos_almoxarifado.xlsx');
}

// Substitui o evento do botão para exportar a tabela
document.getElementById('btn-baixar-tabela')?.addEventListener('click', function() {
  exportarTabelaProdutosParaExcel();
});
// Exibe ou oculta os elementos da "aba produtos" conforme o tipo de busca selecionado
document.addEventListener('DOMContentLoaded', function() {
  var selectTipoBusca = document.getElementById('tipo-busca');
  var blocoProdutos = document.getElementById('produtos-bloco-busca');
  var tabelaProdutos = document.getElementById('produtos-tabela-bloco');
  function atualizarVisibilidadeProdutos() {
    if (selectTipoBusca && blocoProdutos && tabelaProdutos) {
      if (selectTipoBusca.value === 'produtos') {
        blocoProdutos.style.display = 'flex';
        tabelaProdutos.style.display = '';
      } else {
        blocoProdutos.style.display = 'none';
        tabelaProdutos.style.display = 'none';
      }
    }
  }
  if (selectTipoBusca) {
    selectTipoBusca.addEventListener('change', atualizarVisibilidadeProdutos);
    atualizarVisibilidadeProdutos();
  }
});
document.addEventListener('DOMContentLoaded', function () {
  // Carregar e executar o main.js dinamicamente


  // Código existente do almoxarifado.js
  const sidebarContent = document.getElementById('sidebar-content'); 
  const tbodyItens = document.getElementById('itens-retirada');
  const tabs = document.querySelectorAll('.tab-btn'); 
  const tabContents = document.querySelectorAll('.tab-content'); 

  

  //======================================================================================================
  // FUNÇÃO AUXILIAR: Atualizar Preview no Painel Lateral
  // Atualiza o preview do cupom no painel lateral com os itens de retirada selecionados.
  //======================================================================================================
  function atualizarPreviewCupom() {
    const itensRetirada = document.querySelectorAll('#itens-retirada tr');

    if (!sidebarContent) return;

    // Verifica se está na aba Retiradas
    const abaRetiradasAtiva = document.getElementById('retiradas')?.classList.contains('active');
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
      const campos = {
        id: document.getElementById('retirada-id')?.value || '-',
        data: document.getElementById('retirada-data')?.value || '-',
        requisitante: document.getElementById('retirada-requisitante')?.value || '-',
        responsavel: document.getElementById('retirada-responsavel')?.value || '-',
        local: document.getElementById('retirada-local')?.value === 'Outro'
          ? (document.getElementById('retirada-outro-local')?.value || '-')
          : (document.getElementById('retirada-local')?.value || '-'),
        finalidade: document.getElementById('retirada-finalidade')?.value || '-',
        obs: document.getElementById('retirada-observacoes')?.value || '-'
      };

      const itensHtml = Array.from(itensRetirada).map(tr => {
        const nomeItem = tr.children[0].textContent;
        const quantidadeItem = tr.children[1].textContent;
        const idItem = tr.children[4]?.dataset.id || '-';

        return `
          <div style="margin-bottom: 8px;">
            <b>${nomeItem}</b><br>
            <span style="font-size: 12px; color: #555;">Qtde: ${quantidadeItem} | ID: ${idItem}</span>
          </div>
        `;
      }).join('');

      // Exibe o preview da nota com a linha de assinatura
      sidebarContent.innerHTML = gerarHtmlPreviewCupom(campos, itensHtml);
    } else {
      renderSidebar();
    }
  }

  //======================================================================================================
  // FUNÇÃO AUXILIAR: Gerar HTML do Preview
  // Gera o HTML do preview do cupom a partir dos campos e itens informados.
  //======================================================================================================
  function gerarHtmlPreviewCupom(campos, itensHtml) {
    return `
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
            <b>ID:</b> ${campos.id}<br>
            <b>Data:</b> ${campos.data}<br>
            <b>Requisitante:</b> ${campos.requisitante}<br>
            <b>Responsável:</b> ${campos.responsavel}<br>
            <b>Local:</b> ${campos.local}<br>
            <b>Finalidade:</b> ${campos.finalidade}<br>
            <b>Observações:</b> ${campos.obs || 'Nenhuma'}
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
  }

  //======================================================================================================
  // FUNÇÃO AUXILIAR: Renderizar Conteúdo Padrão na Barra Lateral
  // Renderiza o conteúdo padrão na barra lateral do sistema.
  //======================================================================================================
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
        <td data-id="ID_AQUI">
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

  const formProdutosConsulta = document.getElementById('form-produtos-consulta');

  if (formProdutosConsulta) {
    formProdutosConsulta.addEventListener('submit', async function (event) {
      event.preventDefault(); // Impede o envio padrão do formulário

      // Captura os valores dos campos
      const nomeProduto = document.getElementById("nome-produto-consulta").value.trim();
      const codigoProduto = document.getElementById("codigo-produto-consulta").value.trim();
      const categoriaProduto = document.getElementById("categoria-produto-consulta").value;

      try {
        // Envia a requisição ao backend
        const response = await fetch("https://api.exksvol.website/produtos/consultar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"), // Token de autenticação
          },
          body: JSON.stringify({
            nome_produto_consulta: nomeProduto,
            codigo_produto_consulta: codigoProduto,
            categoria_produto_consulta: categoriaProduto,
          }),
        });

        const data = await response.json();

        if (response.ok && data.status === "ok") {
          const tabelaProdutos = document.querySelector(".tabela-produtos tbody");

          // Limpa a tabela antes de adicionar os novos dados
          tabelaProdutos.innerHTML = "";

          // Adiciona os produtos retornados à tabela
          data.produtos.forEach(produto => {
            const row = document.createElement("tr");

            // Função para verificar se a coluna está visível
            function colunaVisivel(coluna) {
              // Usa o grupo correto de checkboxes conforme a aba ativa
              const grupo = getGrupoColunasAtivo();
              if (!grupo.checkboxes || !grupo.checkboxes.length) return true; // fallback: exibe tudo
              const checkbox = Array.from(grupo.checkboxes).find(cb => cb.value === coluna);
              return checkbox ? checkbox.checked : true;
            }

            // Adiciona as células à linha somente se a coluna correspondente estiver visível
            if (colunaVisivel("id")) row.innerHTML += `<td data-coluna="id">${produto.id}</td>`;
            if (colunaVisivel("nome-produto")) row.innerHTML += `<td data-coluna="nome-produto">${produto.nome_produto}</td>`;
            if (colunaVisivel("codigo")) row.innerHTML += `<td data-coluna="codigo">${produto.codigo || ""}</td>`;
            if (colunaVisivel("marca")) row.innerHTML += `<td data-coluna="marca">${produto.marca || ""}</td>`;
            if (colunaVisivel("categoria")) row.innerHTML += `<td data-coluna="categoria">${produto.categoria || ""}</td>`;
            if (colunaVisivel("unidade-medida")) row.innerHTML += `<td data-coluna="unidade-medida">${produto.unidade_medida || ""}</td>`;
            if (colunaVisivel("numero-serie")) row.innerHTML += `<td data-coluna="numero-serie">${produto.numero_serie || ""}</td>`;
            if (colunaVisivel("patrimonio")) row.innerHTML += `<td data-coluna="patrimonio">${produto.patrimonio || ""}</td>`;
            if (colunaVisivel("local")) row.innerHTML += `<td data-coluna="local">${produto.local || ""}</td>`;
            if (colunaVisivel("estoque")) row.innerHTML += `<td data-coluna="estoque">${produto.estoque || ""}</td>`;
            if (colunaVisivel("quantidade")) row.innerHTML += `<td data-coluna="quantidade">${produto.quantidade || ""}</td>`;
            if (colunaVisivel("estoque-minimo")) row.innerHTML += `<td data-coluna="estoque-minimo">${produto.estoque_minimo || ""}</td>`;
            if (colunaVisivel("custo")) row.innerHTML += `<td data-coluna="custo">${produto.custo || ""}</td>`;
            if (colunaVisivel("data-compra")) row.innerHTML += `<td data-coluna="data-compra">${produto.data_compra || ""}</td>`;
            if (colunaVisivel("numero-nota")) row.innerHTML += `<td data-coluna="numero-nota">${produto.numero_nota || ""}</td>`;
            if (colunaVisivel("fornecedor")) row.innerHTML += `<td data-coluna="fornecedor">${produto.fornecedor || ""}</td>`;
            if (colunaVisivel("data-validade")) row.innerHTML += `<td data-coluna="data-validade">${produto.data_validade || ""}</td>`;
            if (colunaVisivel("termino-garantia")) row.innerHTML += `<td data-coluna="termino-garantia">${produto.termino_garantia || ""}</td>`;
            if (colunaVisivel("outras-informacoes")) row.innerHTML += `<td data-coluna="outras-informacoes">${produto.outras_informacoes || ""}</td>`;

            // Adiciona a linha à tabela
            const tabelaProdutos = document.querySelector("#Lista-dos-produtos tbody");
            tabelaProdutos.appendChild(row);
          });
        } else {
          alert("Erro ao buscar produtos: " + data.mensagem);
        }
      } catch (error) {
        console.error("Erro ao conectar ao servidor:", error);
        alert("Erro ao buscar produtos. Verifique o console para mais detalhes.");
      }
    });
  }
//======================================================================================================
// FUNÇÃO PRINCIPAL: Edição de Produto
// Esta função trata o evento de duplo clique na tabela de produtos, abrindo o modal de edição
// e preenchendo os dados do produto selecionado para edição ou exclusão.
//======================================================================================================
          
const tabelaProdutos = document.getElementById('Lista-dos-produtos');

tabelaProdutos.addEventListener('dblclick', function(event) {
  const row = event.target.closest('tr');
  
  // Verifica se é uma linha do tbody (não do thead)
  if (row && row.parentElement.tagName === 'TBODY') {
    const cells = row.querySelectorAll('td');

    if (cells.length > 0) {
      const dadosProduto = {
        id: cells[0]?.textContent || '',
        nome: cells[1]?.textContent || '',
        codigo: cells[2]?.textContent || ''
      };

      // Chama o modal com as opções
      criarModalEscolhaAcao(dadosProduto, row, cells);
    }
  }
});

//======================================================================================================
// FUNÇÃO AUXILIAR: Criar Modal de Escolha de Ação
// Cria e exibe um modal com as opções de Editar e Excluir para o produto selecionado.
//======================================================================================================
function criarModalEscolhaAcao(dados, row, cells) {
  // Remove modal existente se houver
  const modalExistente = document.getElementById('modal-escolha-acao');
  if (modalExistente) {
    modalExistente.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'modal-escolha-acao';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    font-family: Arial, sans-serif;
  `;

  modal.innerHTML = `
    <div style="
      background: white;
      padding: 30px;
      border-radius: 15px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
      text-align: center;
    ">
      <h3 style="margin-top: 0; color: #333; font-size: 24px; margin-bottom: 20px;">
        🔧 Ações do Produto
      </h3>
      
      <div style="margin-bottom: 25px; padding: 20px; background-color: #f8f9fa; border-radius: 10px; text-align: left;">
        <h4 style="margin: 0 0 15px 0; color: #495057; text-align: center;">📦 Informações do Produto</h4>
        <p style="margin: 8px 0; color: #495057;"><strong>🆔 ID:</strong> ${dados.id}</p>
        <p style="margin: 8px 0; color: #495057;"><strong>📝 Nome:</strong> ${dados.nome}</p>
        <p style="margin: 8px 0; color: #495057;"><strong>🔢 Código:</strong> ${dados.codigo}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <p style="font-size: 16px; color: #666; margin-bottom: 25px;">
          O que você deseja fazer com este produto?
        </p>
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <button id="btn-editar-produto" style="
          background: linear-gradient(45deg, #007bff, #0056b3);
          color: white;
          border: none;
          padding: 15px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: all 0.3s;
          box-shadow: 0 3px 10px rgba(0, 123, 255, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          ✏️ Editar Produto
        </button>
        
        <button id="btn-excluir-produto" style="
          background: linear-gradient(45deg, #dc3545, #bd2130);
          color: white;
          border: none;
          padding: 15px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: all 0.3s;
          box-shadow: 0 3px 10px rgba(220, 53, 69, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          🗑️ Excluir Produto
        </button>
        
        <button id="btn-cancelar-acao" style="
          background: #6c757d;
          color: white;
          border: none;
          padding: 15px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s;
          box-shadow: 0 3px 10px rgba(108, 117, 125, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          ❌ Cancelar
        </button>
      </div>
    </div>
  `;

  // Eventos dos botões
  modal.querySelector('#btn-editar-produto').addEventListener('click', function() {
    modal.remove();
    editarProdutoComBusca(dados.id);
  });

  modal.querySelector('#btn-excluir-produto').addEventListener('click', function() {
    modal.remove();
    excluirProduto(row, cells);
  });

  modal.querySelector('#btn-cancelar-acao').addEventListener('click', function() {
    modal.remove();
  });

  // Fecha o modal ao clicar fora dele
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Fecha o modal com a tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('modal-escolha-acao')) {
      modal.remove();
    }
  });

  // Adiciona efeitos hover aos botões
  const botoes = modal.querySelectorAll('button');
  botoes.forEach(botao => {
    botao.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    });
    
    botao.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
    });
  });

  document.body.appendChild(modal);
}

//======================================================================================================
// FUNÇÃO PRINCIPAL: Edição de Produto (com busca no backend)
// Busca os dados reais do produto no backend e preenche o formulário de edição.
//======================================================================================================
async function editarProdutoComBusca(produtoId) {
  if (!produtoId) {
    alert('ID do produto não encontrado.');
    return;
  }

  try {
    // Mostra loading
    criarModalLoading('Carregando dados do produto...');

    // Busca os dados do produto no backend
    const response = await fetch(`https://api.exksvol.website/produtos/buscar/${produtoId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // Remove modal de loading
    removerModalLoading();

    if (response.ok && data.status === 'ok') {
      const produto = data.produto;
      
      // Preenche os campos do formulário com os dados do backend
      preencherFormularioEdicao(produto);
      
      // Muda para a aba de cadastro
      mudarParaAbaCadastro();
      
     // criarModalSucesso(`Produto "${produto.nome_produto}" carregado para edição!`);
      
    } else {
      alert('Erro ao carregar produto: ' + data.mensagem);
    }

  } catch (error) {
    removerModalLoading();
    console.error('Erro ao buscar produto:', error);
    alert('Erro ao conectar com o servidor. Verifique sua conexão.');
  }
}

//======================================================================================================
// FUNÇÃO PRINCIPAL: Preenchimento do Formulário de Edição
// Preenche o formulário de edição de produto com os dados fornecidos.
//======================================================================================================
function preencherFormularioEdicao(produto) {
  try {
    // Limpa o formulário primeiro
    const formRetirada = document.getElementById('form-retirada');
    if (formRetirada) formRetirada.reset();
    if (form) {
      form.reset();
    }

    // Preenche os campos com os dados do backend
    const campos = [
      { id: 'nome-produto', valor: produto.nome_produto },
      { id: 'codigo', valor: produto.codigo },
      { id: 'marca-cadastro', valor: produto.marca },
      { id: 'categoria', valor: produto.categoria },
      { id: 'quantidade', valor: produto.quantidade },
      { id: 'numero-serie', valor: produto.numero_serie },
      { id: 'unid-medida', valor: produto.unidade_medida },
      { id: 'estoque-minimo', valor: produto.estoque_minimo },
      { id: 'numero-nota', valor: produto.numero_nota },
      { id: 'fornecedor', valor: produto.fornecedor },
      { id: 'patrimonio-cadastro', valor: produto.patrimonio },
      { id: 'local-estoque-cadastro', valor: produto.local },
      { id: 'custo', valor: produto.custo },
      { id: 'observacoes-cadastro', valor: produto.outras_informacoes }
    ];

    campos.forEach(campo => {
      const elemento = document.getElementById(campo.id);
      if (elemento) {
        const valor = campo.valor != null ? String(campo.valor) : '';
        elemento.value = valor;
      }
    });

// Preencher os campos de data corretamente usando a função formatarDataParaInput
const camposDataEspecificos = [
  { id: 'data-compra', valor: produto.data_compra },
  { id: 'data-validade', valor: produto.data_validade },
  { id: 'garantia', valor: produto.termino_garantia }
];

camposDataEspecificos.forEach(campo => {
  const elemento = document.getElementById(campo.id);
  if (elemento) {
    const dataFormatada = formatarDataParaInput(campo.valor);
    elemento.value = dataFormatada;
  }
const valorOriginalCompra = produto.data_compra;
const valorOriginalValidae = produto.data_validade;
const valorOriginalGarantia= produto.termino_garantia;

const dataObj = new Date(valorOriginalCompra);
if (!isNaN(dataObj.getTime())) {
  const ano = dataObj.getFullYear();
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const dia = String(dataObj.getDate()+1 ).padStart(2, '0');

  const dataFormatada = `${ano}-${mes}-${dia}`;
  document.getElementById('data-compra').value = dataFormatada;
}

const dataObj2 = new Date(valorOriginalValidae);
if (!isNaN(dataObj2.getTime())) {
  const ano = dataObj2.getFullYear();
  const mes = String(dataObj2.getMonth() + 1).padStart(2, '0');
  const dia = String(dataObj2.getDate()+1 ).padStart(2, '0');

  const dataFormatada = `${ano}-${mes}-${dia}`;
  document.getElementById('data-validade').value = dataFormatada;
}

const dataObj3 = new Date(valorOriginalGarantia);
if (!isNaN(dataObj3.getTime())) {
  const ano = dataObj3.getFullYear();
  const mes = String(dataObj3.getMonth() + 1).padStart(2, '0');
  const dia = String(dataObj3.getDate()+1 ).padStart(2, '0');

  const dataFormatada = `${ano}-${mes}-${dia}`;
  document.getElementById('garantia').value = dataFormatada;
}

});




    // Adiciona um campo oculto com o ID para identificar que é uma edição
    let idField = document.getElementById('produto-id-edicao');
    if (!idField) {
      idField = document.createElement('input');
      idField.type = 'hidden';
      idField.id = 'produto-id-edicao';
      idField.name = 'produto-id-edicao';
      if (form) {
        form.appendChild(idField);
      }
    }
    idField.value = produto.id || '';

    // Muda o texto do botão para indicar que é uma edição
    const btnSalvar = document.getElementById('btn-novoProduto');
    if (btnSalvar) {
      btnSalvar.textContent = 'Atualizar Produto';
      btnSalvar.style.backgroundColor = '#28a745';
      btnSalvar.style.color = 'white';
    }

    // Resumo final
    setTimeout(() => {
      
      camposDataEspecificos.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        const valorFinal = elemento ? elemento.value : 'ELEMENTO NÃO ENCONTRADO';
        console.log(`${campo.nome}: "${valorFinal}"`);
      });
     
    }, 100);

    console.log('✅ Formulário preenchido com sucesso!');

  } catch (error) {
  }
}




//======================================================================================================
// FUNÇÃO PRINCIPAL: Mudança para Aba de Cadastro
// Alterna a interface para a aba de cadastro de produtos.
//======================================================================================================
function mudarParaAbaCadastro() {
  const abaCadastro = document.getElementById('cadastro-produto');
  const botaoCadastro = document.querySelector('.top-tab2[data-tab="cadastro-produto"]');
  
  if (abaCadastro && botaoCadastro) {
    // Remove active de todas as abas
    document.querySelectorAll('.tab-content').forEach(aba => aba.classList.remove('active'));
    document.querySelectorAll('.top-tab2').forEach(btn => btn.classList.remove('active'));
    
    // Ativa a aba de cadastro
    abaCadastro.classList.add('active');
    botaoCadastro.classList.add('active');
  }
}

//======================================================================================================
// FUNÇÃO PRINCIPAL: Criação de Modal de Loading
// Cria e exibe um modal de carregamento com mensagem personalizada.
//======================================================================================================
function criarModalLoading(mensagem) {
  const modalExistente = document.getElementById('modal-loading');
  if (modalExistente) {
    modalExistente.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'modal-loading';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    font-family: Arial, sans-serif;
  `;

  modal.innerHTML = `
    <div style="
      background: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    ">
      <div style="
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      "></div>
      <p style="margin: 0; color: #333; font-size: 16px;">${mensagem}</p>
    </div>
  `;

  // Adiciona CSS da animação
  if (!document.getElementById('loading-animation-css')) {
    const style = document.createElement('style');
    style.id = 'loading-animation-css';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(modal);
}

//======================================================================================================
// FUNÇÃO PRINCIPAL: Remoção de Modal de Loading
// Remove o modal de carregamento da tela.
//======================================================================================================
function removerModalLoading() {
  const modal = document.getElementById('modal-loading');
  if (modal) {
    modal.remove();
  }
}

//======================================================================================================
// FUNÇÃO AUXILIAR: Formatação de Data para Input
// Converte datas em diferentes formatos para o padrão yyyy-mm-dd aceito por inputs.
//======================================================================================================

// Substitua as linhas 844-849 por esta versão corrigida:
function formatarDataParaInput(data) {

  // Verifica se a data é null, undefined, string vazia ou "N/A"
  if (!data || data === null || data === 'null' || data === 'N/A' || data === 'undefined') {
    return '';
  }

  const dataStr = String(data).trim();

  if (dataStr === '' || dataStr === 'null' || dataStr === 'undefined') {
    return '';
  }

  try {
    // 1. GMT/UTC - CORRIGIDO COM MÉTODOS UTC
    if (dataStr.includes('GMT') || dataStr.includes('UTC')) {

      
      const dataObj = new Date(dataStr);

      
      if (!isNaN(dataObj.getTime())) {
        //  USAR MÉTODOS UTC PARA EVITAR PROBLEMAS DE TIMEZONE
        const ano = dataObj.getUTCFullYear();
        const mes = String(dataObj.getUTCMonth() + 1).padStart(2, '0');
        const dia = String(dataObj.getUTCDate()).padStart(2, '0');
        const resultado = `${ano}-${mes}-${dia}`;
        
        
        return resultado;
      } else {
        console.error('❌ Data GMT inválida');
      }
    }

    // Resto do código permanece igual...
    // 2. datetime.date()
    if (dataStr.includes('datetime.date(')) {
      const match = dataStr.match(/datetime\.date\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})\)/);
      if (match) {
        const [, ano, mes, dia] = match;
        const resultado = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        return resultado;
      }
    }

    // 3. yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
      return dataStr;
    }

    // 4. dd/mm/yyyy
    if (dataStr.includes('/')) {
      const partes = dataStr.split('/');
      if (partes.length === 3) {
        const [dia, mes, ano] = partes;
        if (!isNaN(dia) && !isNaN(mes) && !isNaN(ano)) {
          const resultado = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
          return resultado;
        }
      }
    }

    // 5. ISO (com T)
    if (dataStr.includes('T')) {
      const dataObj = new Date(dataStr);
      if (!isNaN(dataObj.getTime())) {
        const ano = dataObj.getUTCFullYear();
        const mes = String(dataObj.getUTCMonth() + 1).padStart(2, '0');
        const dia = String(dataObj.getUTCDate()).padStart(2, '0');
        const resultado = `${ano}-${mes}-${dia}`;
        return resultado;
      }
    }

    // 6. Fallback para new Date
    const dataObj = new Date(dataStr);
    if (!isNaN(dataObj.getTime())) {
      const ano = dataObj.getUTCFullYear();
      const mes = String(dataObj.getUTCMonth() + 1).padStart(2, '0');
      const dia = String(dataObj.getUTCDate()).padStart(2, '0');
      const resultado = `${ano}-${mes}-${dia}`;
      return resultado;
    }

  } catch (error) {
    console.error(`❌ Erro ao processar data "${dataStr}":`, error);
  }

  console.warn(`⚠️ Formato de data não reconhecido: "${dataStr}"`);
  return '';
}
//======================================================================================================
// FUNÇÃO PRINCIPAL: Exclusão de Produto
// Esta função trata a exclusão de um produto selecionado na tabela, realizando a confirmação,
// chamada à API e remoção da linha correspondente em caso de sucesso.
//======================================================================================================



//======================================================================================================
// FUNÇÃO PRINCIPAL: Exclusão de Produto
// Esta função trata a exclusão de um produto selecionado na tabela, realizando a confirmação,
// chamada à API e remoção da linha correspondente em caso de sucesso.
//======================================================================================================
async function excluirProduto(row, cells) {
  // Extrai o ID corretamente da primeira célula
  const produtoId = cells[0]?.textContent?.trim();
  const produtoNome = cells[1]?.textContent?.trim();
  
  console.log('🗑️ Dados para exclusão:', {
    id: produtoId,
    nome: produtoNome,
    row: row
  });

  // Valida se o ID foi extraído corretamente
  if (!produtoId || produtoId === '' || isNaN(produtoId)) {
    alert('❌ Erro: ID do produto não encontrado ou inválido.');
    console.error('ID inválido:', produtoId);
    return;
  }
  
  const dadosProduto = {
    id: produtoId,
    nome: produtoNome || 'Nome não encontrado'
  };
  
  // Confirma a exclusão
  const confirmar = confirm(`⚠️ CONFIRMAÇÃO FINAL!\n\nTem certeza que deseja EXCLUIR o produto?\n\nID: ${dadosProduto.id}\nNome: ${dadosProduto.nome}\n\nEsta ação não pode ser desfeita!`);
  
  if (confirmar) {
    try {
      console.log('🔄 Iniciando exclusão do produto ID:', dadosProduto.id);
      criarModalLoading('Excluindo produto...');

      // Fazer requisição para excluir no backend - USANDO APENAS O ID
      const response = await fetch(`https://api.exksvol.website/produtos/excluir/${dadosProduto.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Resposta da API:', response);
      const data = await response.json();
      console.log('📋 Dados da resposta:', data);
      
      removerModalLoading();

      if (response.ok && data.status === 'ok') {
        console.log('✅ Produto excluído com sucesso');
        
        // Remove a linha da tabela
        row.remove();
        
        // Mostra mensagem de sucesso
       // criarModalSucesso(`Produto "${dadosProduto.nome}" foi excluído com sucesso!`);
        
      } else {
        console.error('❌ Erro na exclusão:', data);
        alert('Erro ao excluir produto: ' + (data.mensagem || 'Erro desconhecido'));
      }

    } catch (error) {
      removerModalLoading();
      console.error('❌ Erro de conexão:', error);
      alert('Erro ao conectar com o servidor. Verifique sua conexão.');
    }
  } else {
    console.log('❌ Exclusão cancelada pelo usuário');
  }
}
//==================================================================================================================================
//======================================================================================================
// FUNÇÃO PRINCIPAL: Envio de Retirada para o Banco de Dados
// Envia todos os itens da tabela de retiradas para o backend, realizando as validações necessárias.
//======================================================================================================
async function enviarRetirada() {
  try {
    // Coletar dados básicos da retirada
    const dadosRetirada = {
      data: document.getElementById('retirada-data').value,
      requisitante: document.getElementById('retirada-requisitante').value,
      responsavel: document.getElementById('retirada-responsavel').value,
      local_destino: document.getElementById('retirada-local').value === 'Outro' 
        ? document.getElementById('retirada-outro-local').value 
        : document.getElementById('retirada-local').value,
      finalidade: document.getElementById('retirada-finalidade').value,
      observacoes: document.getElementById('retirada-observacoes').value,
      itens: []
    };

    // Validar campos obrigatórios
    if (!dadosRetirada.data || !dadosRetirada.requisitante || !dadosRetirada.responsavel || 
        !dadosRetirada.local_destino || !dadosRetirada.finalidade) {
      alert('Preencha todos os campos obrigatórios antes de enviar a retirada.');
      return;
    }

    // Coletar itens da tabela de retirada
    const linhasItens = document.querySelectorAll('#itens-retirada tr');
    
    if (linhasItens.length === 0) {
      alert('Adicione pelo menos um item à retirada.');
      return;
    }

    linhasItens.forEach(linha => {
      const celulas = linha.cells;
      dadosRetirada.itens.push({
        produto: celulas[0].textContent.trim(),
        quantidade: celulas[1].textContent.trim(),
        local_destino: celulas[2].textContent.trim(),
        finalidade: celulas[3].textContent.trim(),
        produto_id: celulas[4].dataset.id || null
      });
    });

    // Enviar para o backend
    criarModalLoading('Enviando retirada...');
    
    const response = await fetch('https://api.exksvol.website/retiradas/salvar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(dadosRetirada)
    });

    const data = await response.json();
    removerModalLoading();

    if (response.ok && data.status === 'ok') {
      alert('Retirada registrada com sucesso! ID: ' + data.id_retirada);
      // Limpar formulário após sucesso
      document.getElementById('form-retirada').reset();
      document.getElementById('itens-retirada').innerHTML = '';
      // Gerar novo ID de retirada e preencher o campo
      setTimeout(() => {
        // Gera novo ID manualmente e preenche o campo
        const campoId = document.getElementById('retirada-id');
        if (campoId && typeof gerarIdRetirada8Digitos === 'function') {
          const novoId = gerarIdRetirada8Digitos();
          campoId.value = novoId;
          // Atualiza variável global se necessário
          if (typeof idRetiradaGerado !== 'undefined') {
            idRetiradaGerado = novoId;
          }
        }
      }, 100);
      atualizarPreviewCupom();
    } else {
      alert('Erro ao registrar retirada: ' + (data.mensagem || 'Erro desconhecido'));
    }

  } catch (error) {
    removerModalLoading();
    console.error('Erro ao enviar retirada:', error);
    alert('Erro ao conectar com o servidor. Verifique sua conexão.');
  }
}


//==================================================================================================================================

  // Função para alternar entre abas
  function alternarAba(event) {
    const todasAbas = document.querySelectorAll('.tab-content');
    const todosBotoes = document.querySelectorAll('.top-tab2');

    // Remove a classe 'active' de todas as abas e botões
    todasAbas.forEach(aba => aba.classList.remove('active'));
    todosBotoes.forEach(botao => botao.classList.remove('active'));

    // Identifica a aba correspondente ao botão clicado
    const abaId = event.target.getAttribute('data-tab');
    const abaSelecionada = document.getElementById(abaId);

    // Adiciona a classe 'active' à aba e ao botão selecionados
    if (abaSelecionada) {
      abaSelecionada.classList.add('active');
    }
    event.target.classList.add('active');
  }

  // Função para inicializar a aba ativa
  function inicializarAbaAtiva() {
    // Remove qualquer aba ou botão marcado como ativo
    const abasAtivas = document.querySelectorAll('.tab-content.active');
    const botoesAtivos = document.querySelectorAll('.top-tab2.active');

    abasAtivas.forEach(aba => aba.classList.remove('active'));
    botoesAtivos.forEach(botao => botao.classList.remove('active'));

    // Ativa a aba "Gerenciamento" por padrão
    const abaGerenciamento = document.getElementById('gerenciamento');
    const botaoGerenciamento = document.querySelector('.tab-btn[data-tab="gerenciamento"]');

    if (abaGerenciamento) {
      abaGerenciamento.classList.add('active');
    }
    if (botaoGerenciamento) {
      botaoGerenciamento.classList.add('active');
    }
  }

  // Adiciona o evento de clique a todos os botões de troca de aba
  document.querySelectorAll('.top-tab2').forEach(button => {
    button.addEventListener('click', alternarAba);
  });

  // Inicializa a aba ativa ao carregar a página
  document.addEventListener('DOMContentLoaded', function () {
    inicializarAbaAtiva();
  });

  // Garante que o botão "Requisitantes" seja selecionado ao abrir a aba "Requisitantes"
  const abaRequisitantes = document.getElementById('requisitantes');
  if (abaRequisitantes) {
    abaRequisitantes.addEventListener('click', function () {
      const botaoRequisitantes = document.querySelector('.top-tab2[data-tab="requisitantes"]');
      if (botaoRequisitantes) {
        botaoRequisitantes.classList.add('active');
      }
    });
  }

  const todasAbas = document.querySelectorAll('.tab-content'); 
  const todosBotoes = document.querySelectorAll('.top-tab2'); 


 
  todosBotoes.forEach(botao => botao.classList.remove('active'));

   // ------------ evento abertura aba Entrada ------------
  const botaoEntrada1 = document.getElementById('btn-entrada1'); 
  const botaoEntrada2 = document.getElementById('btn-entrada2'); 
  const botaoEntrada3 = document.getElementById('btn-entrada3'); 
  const botaoEntrada4 = document.getElementById('btn-entrada4'); 
  const botaoEntrada5 = document.getElementById('btn-entrada5'); 
  const abaMovimentacoes = document.getElementById('movimentacoes'); 
  
  if (botaoEntrada1 || botaoEntrada2 || botaoEntrada3|| botaoEntrada4|| botaoEntrada5) {
    botaoEntrada1.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaMovimentacoes.classList.add('active');
    });
    botaoEntrada2.addEventListener('click', function () { 
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaMovimentacoes.classList.add('active');
    });
    botaoEntrada3.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaMovimentacoes.classList.add('active');
    });
        botaoEntrada4.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaMovimentacoes.classList.add('active');
    });
        botaoEntrada5.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaMovimentacoes.classList.add('active');
    });
  }

   // ------------ evento abertura aba tranferencia ------------
  const botaoTransferencia1 = document.getElementById('btn-transferencia1'); 
  const botaoTransferencia2 = document.getElementById('btn-transferencia2'); 
  const botaoTransferencia3 = document.getElementById('btn-transferencia3'); 
  const botaoTransferencia4 = document.getElementById('btn-transferencia4'); 
  const botaoTransferencia5 = document.getElementById('btn-transferencia5');
  const abaTransferencia = document.getElementById('transferencia'); 

  if (botaoTransferencia1||botaoTransferencia2||botaoTransferencia3||botaoTransferencia4||botaoTransferencia5) {
    botaoTransferencia1.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaTransferencia.classList.add('active');
    });
        botaoTransferencia2.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaTransferencia.classList.add('active');
    });
        botaoTransferencia3.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaTransferencia.classList.add('active');
    });
        botaoTransferencia4.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaTransferencia.classList.add('active');
    });
        botaoTransferencia5.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaTransferencia.classList.add('active');
    });

  }
   
   // ------------ evento abertura aba baixa ------------
  const abaBaixa = document.getElementById('baixa');
  const botaoBaixa1 = document.getElementById('btn-baixa1');
  const botaoBaixa2 = document.getElementById('btn-baixa2');
  const botaoBaixa3 = document.getElementById('btn-baixa3');
  const botaoBaixa4 = document.getElementById('btn-baixa4');
  const botaoBaixa5 = document.getElementById('btn-baixa5');
  if (botaoBaixa1||botaoBaixa2||botaoBaixa3||botaoBaixa4||botaoBaixa5) {
    botaoBaixa1.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaBaixa.classList.add('active');
      });
 
      botaoBaixa2.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaBaixa.classList.add('active');
    }); 
  
    botaoBaixa3.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaBaixa.classList.add('active');
    });
    botaoBaixa4.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaBaixa.classList.add('active');
    });

    botaoBaixa5.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaBaixa.classList.add('active');
    });

  }


   // ------------ evento abertura aba devolução ------------
  const abaDevolucao = document.getElementById('devolucao');
  const botaoDdevolucao1 = document.getElementById('btn-devolucao1');
  const botaoDdevolucao2 = document.getElementById('btn-devolucao2');
  const botaoDdevolucao3 = document.getElementById('btn-devolucao3');
  const botaoDdevolucao4 = document.getElementById('btn-devolucao4');
  const botaoDdevolucao5 = document.getElementById('btn-devolucao5');
  if (botaoDdevolucao1||botaoDdevolucao2||botaoDdevolucao3||botaoDdevolucao4||botaoDdevolucao5) {
    botaoDdevolucao1.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaDevolucao.classList.add('active');
      });
 
      botaoDdevolucao2.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaDevolucao.classList.add('active');
    }); 
  
    botaoDdevolucao3.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaDevolucao.classList.add('active');
    });
    botaoDdevolucao4.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaDevolucao.classList.add('active');
    });

    botaoDdevolucao5.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaDevolucao.classList.add('active');
    });

  }


   // ------------ evento abertura aba Retirada ------------
  const abaRetiradas = document.getElementById('retiradas');
  const botaoRetiradas1 = document.getElementById('btn-retirada1');
  const botaoRetiradas2 = document.getElementById('btn-retirada2');
  const botaoRetiradas3 = document.getElementById('btn-retirada3');
  const botaoRetiradas4 = document.getElementById('btn-retirada4');
  const botaoRetiradas5 = document.getElementById('btn-retirada5');

  function abrirAbaRetiradaComId() {
    todasAbas.forEach(aba => aba.classList.remove('active'));
    abaRetiradas.classList.add('active');
    // Gera e preenche o campo de ID ao abrir a aba
    if (typeof carregarIdRetiradaAoIniciar === 'function') {
      carregarIdRetiradaAoIniciar();
    }
    // Preenche o campo responsável com o nome do usuário (se disponível)
    const campoResponsavel = document.getElementById('retirada-responsavel');
    let nomeUsuario = '';
    try {
      // Tenta pegar o objeto completo do localStorage
      let usuario = localStorage.getItem('usuario');
      if (usuario) {
        // Se for um JSON válido, extrai o username ou nome
        try {
          const obj = JSON.parse(usuario);
          if (obj && obj.username) {
            nomeUsuario = obj.username;
          } else if (obj && obj.nome) {
            nomeUsuario = obj.nome;
          } else {
            nomeUsuario = usuario;
          }
        } catch (e) {
          // Se não for JSON, usa direto
          nomeUsuario = usuario;
        }
      } else {
        // Fallback para outros campos
        nomeUsuario = localStorage.getItem('usuario_nome') || localStorage.getItem('username') || '';
      }
    } catch (e) {
      nomeUsuario = '';
    }
    if (campoResponsavel && nomeUsuario) {
      campoResponsavel.value = nomeUsuario;
    }
    // Preenche a data com a data/hora atual e permite edição
    const campoData = document.getElementById('retirada-data');
    if (campoData) {
      const agora = new Date();
      const ano = agora.getFullYear();
      const mes = String(agora.getMonth() + 1).padStart(2, '0');
      const dia = String(agora.getDate()).padStart(2, '0');
      const horas = String(agora.getHours()).padStart(2, '0');
      const minutos = String(agora.getMinutes()).padStart(2, '0');
      campoData.value = `${ano}-${mes}-${dia}T${horas}:${minutos}`;
      campoData.readOnly = false;
      campoData.removeAttribute('readonly');
      campoData.removeAttribute('disabled');
    }
  }

  if (botaoRetiradas1) botaoRetiradas1.addEventListener('click', abrirAbaRetiradaComId);
  if (botaoRetiradas2) botaoRetiradas2.addEventListener('click', abrirAbaRetiradaComId);
  if (botaoRetiradas3) botaoRetiradas3.addEventListener('click', abrirAbaRetiradaComId);
  if (botaoRetiradas4) botaoRetiradas4.addEventListener('click', abrirAbaRetiradaComId);
  if (botaoRetiradas5) botaoRetiradas5.addEventListener('click', abrirAbaRetiradaComId);


   
  // Evento para carregar a nota de cadastro
  const btnCarregarNota = document.getElementById('btn-carregar-nota-cadastro');
  const inputCarregarNota = document.getElementById('input-carregar-nota-cadastro');

  if (btnCarregarNota && inputCarregarNota) {
    // Evento para abrir o seletor de arquivos
    btnCarregarNota.addEventListener('click', function () {
      inputCarregarNota.click(); // Simula o clique no campo de entrada de arquivo
    });

    // Evento para processar o arquivo XML selecionado
    inputCarregarNota.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) {
        alert('Nenhum arquivo selecionado.');
        return;
      }

      // Verifica se o arquivo é um XML
      if (!file.name.endsWith('.xml')) {
        alert('Por favor, selecione um arquivo XML válido.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const xmlText = e.target.result;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, "application/xml");

          // Verifica se houve erro no parsing do XML
          if (xmlDoc.querySelector('parsererror')) {
            alert('Erro ao processar o arquivo XML. Verifique o formato do arquivo.');
            return;
          }

          const tabelaBody = document.querySelector("#tabelaProdutos tbody");

          // Limpa o conteúdo anterior da tabela
          tabelaBody.innerHTML = "";

          // Detecta o tipo de nota com base na estrutura do XML
          if (xmlDoc.querySelector("NFe")) {
            processarNFe(xmlDoc, tabelaBody);
          } else if (xmlDoc.querySelector("InfNfse")) {
            processarNFSe(xmlDoc, tabelaBody);
          } else {
            alert("Tipo de nota não reconhecido.");
          }
        } catch (error) {
          console.error('Erro ao processar o arquivo:', error);
          alert('Ocorreu um erro ao processar o arquivo. Verifique o console para mais detalhes.');
        }
      };

      reader.readAsText(file);
    });
  } else {
    console.error('Erro: Elementos de botão ou input para carregar nota não encontrados no DOM.');
  }

  // Função para processar NF-e
  function processarNFe(xmlDoc, tabelaBody) {
    const dets = xmlDoc.querySelectorAll("det");
    const dataEmissaoRaw = xmlDoc.querySelector("ide > dhEmi")?.textContent || "N/A";
    const numeroNota = xmlDoc.querySelector("ide > nNF")?.textContent || "N/A";
    const fornecedor = xmlDoc.querySelector("emit > xNome")?.textContent || "N/A";

    const dataEmissao = formatarData(dataEmissaoRaw);

    dets.forEach((det, index) => {
      const prod = det.querySelector("prod");
      const nomeProd = prod?.querySelector("xProd")?.textContent || "N/A";
      let codigo = prod?.querySelector("cProd")?.textContent || "N/A"; 

      // Remove os zeros à esquerda do código
      codigo = codigo.replace(/^0+/, ''); 

      const marca = prod?.querySelector("xMarca")?.textContent || "N/A";
      const unidadeMedida = prod?.querySelector("uCom")?.textContent || "N/A";
      const quantidadeRaw = prod?.querySelector("qCom")?.textContent || "N/A";
      const custoUnitarioRaw = prod?.querySelector("vUnCom")?.textContent || "N/A";

      // Formata os valores
      const quantidade = formatarQuantidade(quantidadeRaw);
      const custoUnitario = formatarValor(custoUnitarioRaw);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${nomeProd}</td>
        <td>${codigo}</td>
        <td>${marca}</td>
        <td>${unidadeMedida}</td>
        <td>${quantidade}</td>
        <td>${custoUnitario}</td>
        <td>${dataEmissao}</td>
        <td>${numeroNota}</td>
        <td>${fornecedor}</td>
        <td>
          <button class="btn-editar" data-index="${index}">⮵</button>
        </td>
      `;
      tabelaBody.appendChild(row);
    });
  }

  // Função para processar NFS-e
  function processarNFSe(xmlDoc, tabelaBody) {
    const numeroNota = xmlDoc.querySelector("InfNfse > Numero")?.textContent || "N/A";
    const dataEmissaoRaw = xmlDoc.querySelector("InfNfse > DataEmissao")?.textContent || "N/A";
    const fornecedor = xmlDoc.querySelector("PrestadorServico > RazaoSocial")?.textContent || "N/A";

    const dataEmissao = formatarData(dataEmissaoRaw);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>1</td>
      <td>Serviço</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>N/A</td>
      <td>${dataEmissao}</td>
      <td>${numeroNota}</td>
      <td>${fornecedor}</td>
      <td>
        <button class="btn-editar" data-index="0">Editar</button>
      </td>
    `;
    tabelaBody.appendChild(row);
  }

  // Função para formatar valores monetários (R$)
  function formatarValor(valor) {
    if (valor === "N/A") return "N/A";
    const numero = parseFloat(valor);
    if (isNaN(numero)) return "N/A";
    return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  // Função para formatar quantidade
  function formatarQuantidade(quantidade) {
    if (quantidade === "N/A") return "N/A";
    const numero = parseFloat(quantidade);
    if (isNaN(numero)) return "N/A";
    return numero.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Função para formatar a data no formato dd/mm/yyyy
  function formatarData(dataISO) {
    if (dataISO === "N/A") return "N/A";
    const data = new Date(dataISO);
    if (isNaN(data)) return "N/A"; // Verifica se a data é inválida
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
// Evento para editar produtos na tabela (botão editar)
document.querySelector("#tabelaProdutos").addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-editar")) {
    const row = event.target.closest("tr");
    const ths = Array.from(document.querySelectorAll("#tabelaProdutos thead th"));
    const getColIndex = (label) => ths.findIndex(th => th.textContent.trim().toLowerCase().includes(label));
    const idxNome = getColIndex("nome");
    // const idxCodigo = getColIndex("código");
    const nomeProduto = idxNome >= 0 ? row.cells[idxNome].textContent.trim() : "";
    if (nomeProduto && nomeProduto !== "N/A") document.getElementById("nome-produto").value = nomeProduto;
    document.getElementById("codigo").value = "";

  }
});

// Evento para seleção simples de produto na tabela (clique simples)
document.querySelector("#Lista-dos-produtos").addEventListener("click", function (event) {
  const row = event.target.closest("tr");
  if (!row || row.parentElement.tagName !== 'TBODY') return;

});

  // Função para converter a data no formato dd/MM/yyyy para yyyy-MM-dd
  function formatarDataParaInput(data) {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  }

 // Substitua o evento do botão (linhas 1185-1230) por esta versão:
document.getElementById("btn-novoProduto").addEventListener("click", async function (event) {
  event.preventDefault();

  // Verifica se é uma edição (campo oculto com ID existe)
  const produtoIdEdicao = document.getElementById('produto-id-edicao')?.value;
  const ehEdicao = produtoIdEdicao && produtoIdEdicao.trim() !== '';

  console.log('🔍 Modo detectado:', ehEdicao ? 'EDIÇÃO' : 'CRIAÇÃO');
  if (ehEdicao) {
    console.log('📝 ID do produto para editar:', produtoIdEdicao);
  }

  // Captura os valores dos campos
  const nomeProduto = document.getElementById("nome-produto").value;
  const codigo = document.getElementById("codigo").value;
  const categoria = document.getElementById("categoria").value;
  const quantidade = document.getElementById("quantidade").value;
  const numeroSerie = document.getElementById("numero-serie").value;
  const unidadeMedida = document.getElementById("unid-medida").value;
  const estoqueMinimo = document.getElementById("estoque-minimo").value;
  const numeroNota = document.getElementById("numero-nota").value;
  const fornecedor = document.getElementById("fornecedor").value;
  const patrimonio = document.getElementById("patrimonio-cadastro").value;
  const local_estoque = document.getElementById("local-estoque-cadastro").value;
  const marca = document.getElementById("marca-cadastro").value;
   
  let custo = document.getElementById("custo").value.trim();
  custo = custo.replace(/[R$\s]/g, "").replace(".", "").replace(",", ".");

  const dataCompra = document.getElementById("data-compra").value;
  const dataValidade = document.getElementById("data-validade").value;
  const terminoGarantia = document.getElementById("garantia").value;
  const outras_informacoes = document.getElementById("observacoes-cadastro").value;

  // Monta o objeto com os dados
  const produto = {
    nome_produto: nomeProduto,
    codigo: codigo,
    marca: marca,
    categoria: categoria,
    quantidade: quantidade,
    numero_serie: numeroSerie,
    unid_medida: unidadeMedida,
    estoque_minimo: estoqueMinimo,
    numero_nota: numeroNota,
    fornecedor: fornecedor,
    patrimonio: patrimonio,
    local_estoque: local_estoque,
    custo: custo,
    data_compra: dataCompra,
    data_validade: dataValidade,
    garantia: terminoGarantia,
    outras_informacoes: outras_informacoes,
  };

  try {
    let response;
    let mensagemSucesso;

    if (ehEdicao) {
      // ===== MODO EDIÇÃO =====
      console.log('🔄 Enviando atualização do produto...');
      
      // Adiciona o ID do produto ao objeto
      produto.id = produtoIdEdicao;
      
      response = await fetch(`https://api.exksvol.website/produtos/atualizar/${produtoIdEdicao}`, {
        method: "PUT", // ✅ PUT para atualizar
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(produto),
      });
      
      mensagemSucesso = "Produto atualizado com sucesso!";
      
    } else {
      // ===== MODO CRIAÇÃO =====
      console.log('🔄 Enviando criação de novo produto...');
      
      response = await fetch("https://api.exksvol.website/produtos/salvar", {
        method: "POST", // ✅ POST para criar
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(produto),
      });
      
      mensagemSucesso = "Produto salvo com sucesso!";
    }

    const data = await response.json();

    if (response.ok && data.status === "ok") {
      alert(mensagemSucesso);
      
      // Limpa os campos do formulário
      document.getElementById("form-produtos").reset();
      
      // Remove o campo de edição e restaura o botão
      const campoEdicao = document.getElementById('produto-id-edicao');
      if (campoEdicao) {
        campoEdicao.remove();
      }
      
      // Restaura o botão para o estado original
      const btnSalvar = document.getElementById('btn-novoProduto');
      if (btnSalvar) {
        btnSalvar.textContent = 'Salvar Produto';
        btnSalvar.style.backgroundColor = '';
        btnSalvar.style.color = '';
      }
      
      console.log('✅ Operação concluída com sucesso!');
      
    } else {
      alert(`Erro ao ${ehEdicao ? 'atualizar' : 'salvar'} produto: ` + data.mensagem);
    }
    
  } catch (error) {
    console.error("Erro ao conectar ao servidor:", error);
    alert(`Erro ao ${ehEdicao ? 'atualizar' : 'salvar'} produto. Verifique o console para mais detalhes.`);
  }
});

  const previewImg = document.getElementById('preview');
  const inputImagem = document.getElementById('input-carregar-img-cadastro'); // ID corrigido

  if (previewImg && inputImagem) {
    // Evento de clique na imagem para abrir o seletor de arquivos
    previewImg.addEventListener('click', function () {
      inputImagem.click(); // Simula o clique no input de arquivo
    });

    // Evento para exibir a imagem selecionada
    inputImagem.addEventListener('change', function (event) {
      const file = event.target.files[0]; 
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImg.src = e.target.result; 
        };
        reader.readAsDataURL(file); 
      }
    });
  } else {
    console.error('Erro: Elementos de imagem ou input não encontrados no DOM.');
  }

  // Referências às abas e botões
const todasAbasMovimentacoes = document.querySelectorAll('.tab-content');

const botaoDevolucao1 = document.getElementById('btn-devolucao1');
const botaoRetirada1 = document.getElementById('btn-retirada1');
//const conteudoMovimentacoes = document.getElementById('conteudo-movimentacoes');


// Referências específicas para a aba "Entrada de Produtos"
const previewImgEntrada = document.querySelector('#entrada-produtos #preview'); // ID específico para a aba
const inputImagemEntrada = document.querySelector('#entrada-produtos #input-carregar-nota-cadastro'); // ID específico para a aba

if (previewImgEntrada && inputImagemEntrada) {
  // Evento de clique na imagem para abrir o seletor de arquivos
  previewImgEntrada.addEventListener('click', function () {
    inputImagemEntrada.click(); 
  });

  // Evento para exibir a imagem selecionada
  inputImagemEntrada.addEventListener('change', function (event) {
    const file = event.target.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImgEntrada.src = e.target.result; 
      };
      reader.readAsDataURL(file); 
    }
  });
}

// Novos códigos para a funcionalidade de parâmetros
const parametroSelect = document.getElementById("parametro-outros");
const camposDinamicos = document.getElementById("campos-dinamicos");
const tabelaParametros = document.getElementById("tabela-parametros");
const formOutros = document.getElementById("form-outros");

// Campos dinâmicos para cada parâmetro
const camposPorParametro = {
  categoria: `
    <div>
      <label for="nome-categoria">Nome da Categoria:</label>
      <input type="text" id="nome-categoria" name="nome-categoria" required />
    </div>
  `,
  "unidade-medida": `
    <div>
      <label for="valor-unidade">Valor da Unidade de Medida:</label>
      <input type="text" id="valor-unidade" name="valor-unidade" required />
    </div>
  `,
  patrimonio: `
    <div>
      <label for="nome-patrimonio">Nome:</label>
      <input type="text" id="nome-patrimonio" name="nome-patrimonio" required />
    </div>
    <div>
      <label for="endereco-patrimonio">Endereço:</label>
      <input type="text" id="endereco-patrimonio" name="endereco-patrimonio" required />
    </div>
    <div>
      <label for="obs-patrimonio">Observações:</label>
      <textarea id="obs-patrimonio" name="obs-patrimonio"></textarea>
    </div>
  `,
  "local-estoque": `
    <div>
      <label for="nome-local-estoque">Nome:</label>
      <input type="text" id="nome-local-estoque" name="nome-local-estoque" required />
    </div>
    <div>
      <label for="endereco-local-estoque">Endereço:</label>
      <input type="text" id="endereco-local-estoque" name="endereco-local-estoque" required />
    </div>
    <div>
      <label for="obs-local-estoque">Observações:</label>
      <textarea id="obs-local-estoque" name="obs-local-estoque"></textarea>
    </div>
  `,
  "local-destino": `
    <div>
      <label for="nome-local-destino">Nome:</label>
      <input type="text" id="nome-local-destino" name="nome-local-destino" required />
    </div>
    <div>
      <label for="endereco-local-destino">Endereço:</label>
      <input type="text" id="endereco-local-destino" name="endereco-local-destino" required />
    </div>
    <div>
      <label for="obs-local-destino">Observações:</label>
      <textarea id="obs-local-destino" name="obs-local-destino"></textarea>
    </div>
  `,
  finalidade: `
    <div>
      <label for="nome-finalidade">Nome da Finalidade:</label>
      <input type="text" id="nome-finalidade" name="nome-finalidade" required />
    </div>
  `,
};

// Atualiza os campos dinâmicos com base no parâmetro selecionado
parametroSelect.addEventListener("change", function () {
  const parametro = parametroSelect.value;
  camposDinamicos.innerHTML = camposPorParametro[parametro] || "";
});

// Adiciona os dados na tabela ao salvar
formOutros.addEventListener("submit", function (event) {
  event.preventDefault();

  const parametro = parametroSelect.value;
  if (!parametro) {
    alert("Selecione um parâmetro para cadastrar.");
    return;
  }

  const nome = document.querySelector(`#nome-${parametro.replace("-", "-")}`)?.value || "";
  const endereco = document.querySelector(`#endereco-${parametro.replace("-", "-")}`)?.value || "";
  const observacoes = document.querySelector(`#obs-${parametro.replace("-", "-")}`)?.value || "";

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${nome}</td>
    <td>${endereco}</td>
    <td>${observacoes}</td>
    <td>
      <button type="button" class="btn-editar">Editar</button>
      <button type="button" class="btn-excluir">Excluir</button>
    </td>
  `;
  tabelaParametros.appendChild(newRow);

  // Limpa o formulário
  formOutros.reset();
  camposDinamicos.innerHTML = "";
});

  // Função utilitária para obter o grupo correto de checkboxes conforme a aba ativa
  function getGrupoColunasAtivo() {
    // Verifica se a aba Busca está ativa
    const buscaAba = document.getElementById('busca');
    const produtosAba = document.getElementById('consultas-produtos');
    if (buscaAba && buscaAba.classList.contains('active')) {
      return {
        toggleBtn: document.querySelector('#busca #toggle-colunas'),
        colunasDiv: document.getElementById('colunas-visiveis-busca'),
        checkboxes: document.querySelectorAll('#colunas-visiveis-busca input[type="checkbox"]')
      };
    } else if (produtosAba && produtosAba.classList.contains('active')) {
      return {
        toggleBtn: document.querySelector('#consultas-produtos #toggle-colunas'),
        colunasDiv: document.getElementById('colunas-visiveis-produtos'),
        checkboxes: document.querySelectorAll('#colunas-visiveis-produtos input[type="checkbox"]')
      };
    }
    // fallback: retorna nulls
    return { toggleBtn: null, colunasDiv: null, checkboxes: [] };
  }

  // Inicialização dinâmica conforme a aba ativa
  function inicializarColunasVisiveis() {
    const grupo = getGrupoColunasAtivo();
    if (!grupo.toggleBtn || !grupo.colunasDiv) return;
    grupo.colunasDiv.style.display = "none";
    grupo.toggleBtn.textContent = "▼ Escolha as colunas a serem exibidas";

    grupo.toggleBtn.addEventListener("click", function () {
      const displayAtual = window.getComputedStyle(grupo.colunasDiv).display;
      if (displayAtual === "none") {
        grupo.colunasDiv.style.display = "block";
        grupo.toggleBtn.textContent = "▲ Recolher opções";
      } else {
        grupo.colunasDiv.style.display = "none";
        grupo.toggleBtn.textContent = "▼ Escolha as colunas a serem exibidas";
      }
    });
  }

  // Chama ao carregar a página e ao trocar de aba
  inicializarColunasVisiveis();
  // Se você já tem um listener de troca de abas, chame inicializarColunasVisiveis() dentro dele também

  // (Removido: código antigo que causava erro ao acessar colunasVisiveisDiv/toggleColunasBtn)

  // Atualizar visibilidade das colunas
  function atualizarColunas() {
    const tabela = document.getElementById('Lista-dos-produtos');
    const thead = tabela ? tabela.querySelector('thead') : null;
    const tbody = tabela ? tabela.querySelector('tbody') : null;
    const grupo = getGrupoColunasAtivo();
    const checkboxes = grupo.checkboxes;
    if (!tabela || !thead || !tbody || !checkboxes.length) return;


    // Mapeia quais colunas devem estar visíveis (case-insensitive e trim)
    const colunasVisiveis = {};
    checkboxes.forEach(checkbox => {
      const valor = (checkbox.value || '').trim().toLowerCase();
      colunasVisiveis[valor] = checkbox.checked;
    });

    // Atualiza visibilidade dos <th> e <td> de cada coluna
    let algumaColunaVisivel = false;
    // Garante que todos os <th> de qualquer <tr> do thead sejam alterados corretamente
    const ths = thead.querySelectorAll('th[data-coluna]');
    ths.forEach((th) => {
      const coluna = (th.getAttribute('data-coluna') || '').trim().toLowerCase();
      const visivel = !!colunasVisiveis[coluna];
      th.style.display = visivel ? '' : 'none';
      if (visivel) algumaColunaVisivel = true;
      // Todas as células dessa coluna
      tbody.querySelectorAll('td[data-coluna]').forEach(td => {
        const tdCol = (td.getAttribute('data-coluna') || '').trim().toLowerCase();
        if (tdCol === coluna) {
          td.style.display = visivel ? '' : 'none';
        }
      });
    });

    // Exibe ou oculta o thead e tbody (estrutura da tabela) junto com as colunas
    thead.style.display = algumaColunaVisivel ? '' : 'none';
    tbody.style.display = algumaColunaVisivel ? '' : 'none';
    tabela.style.display = algumaColunaVisivel ? '' : 'none';

    // Exibe ou oculta a aba da tabela se existir
    const abaTabela = document.getElementById('aba-tabela-produtos') || document.querySelector('.tab-content.tabela-produtos');
    if (abaTabela) abaTabela.style.display = algumaColunaVisivel ? '' : 'none';
  }

  // Função para adicionar listeners aos checkboxes do grupo ativo
  function adicionarListenersCheckboxes() {
    const grupo = getGrupoColunasAtivo();
    const tabela = document.getElementById('Lista-dos-produtos');
    grupo.checkboxes.forEach(checkbox => {
      checkbox.addEventListener("change", function() {
        atualizarColunas();
        if (tabela && tabela.style.display === "none") {
          const abaTabela = document.getElementById('aba-tabela-produtos') || document.querySelector('.tab-content.tabela-produtos');
          if (abaTabela) abaTabela.style.display = 'none';
        } else {
          const abaTabela = document.getElementById('aba-tabela-produtos') || document.querySelector('.tab-content.tabela-produtos');
          if (abaTabela) abaTabela.style.display = '';
        }
      });
    });
  }

  // Adiciona listeners ao carregar a página
  adicionarListenersCheckboxes();

  // Adiciona listeners ao trocar de aba (reexecuta para o grupo correto)
  document.querySelectorAll('.tab-btn, .top-tab, .top-tab2').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        inicializarColunasVisiveis();
        adicionarListenersCheckboxes();
        atualizarColunas();
      }, 100);
    });
  });

  // Atualizar colunas ao carregar a página
  atualizarColunas();

  function adicionarLinhaTabela(dados) {
    const tabelaBody = document.querySelector("#Lista-dos-produtos tbody");
    const novaLinha = document.createElement("tr");

    // Itera sobre os dados e verifica se a coluna correspondente está visível
    Object.keys(dados).forEach(coluna => {
      const th = document.querySelector(`thead th[data-coluna="${coluna}"]`);
      if (th && th.style.display !== "none") {
        const novaCelula = document.createElement("td");
        novaCelula.setAttribute("data-coluna", coluna);
        novaCelula.textContent = dados[coluna];
        novaLinha.appendChild(novaCelula);
      }
    });

    tabelaBody.appendChild(novaLinha);
  }
  //=========================================================  =============================================

  // CONFIGURAÇÃO DOS CAMPOS
  const camposRetirada = [
    'retirada-data',
    'retirada-requisitante', 
    'retirada-responsavel',
    'retirada-local',
    'retirada-finalidade',
    'retirada-observacoes'
  ];

  // REFERÊNCIAS AOS ELEMENTOS
  let btnFinalizarRetirada = null;
  let tabelaItensRetirada = null;
  let btnAcrescentarItemRetirada = null;
  let campoIdRetirada = null;
  let idRetiradaGerado = null;
  let abaRetirada = null;

  // FUNÇÃO PARA ENCONTRAR ELEMENTOS
  function encontrarElementosRetirada() {
    btnFinalizarRetirada = document.getElementById('btn-enviar-retirada');
    btnAcrescentarItemRetirada = document.getElementById('btn-acrescentar-item');
    campoIdRetirada = document.getElementById('retirada-id');
    abaRetirada = document.getElementById('retiradas') || document.querySelector('[id*="retirada"]');
    
    tabelaItensRetirada = document.getElementById('itens-retirada') || 
                         document.querySelector('#tabela-retiradas tbody') ||
                         document.querySelector('.tabela-produtos tbody');

    return !!btnFinalizarRetirada;
  }

  // FUNÇÃO PARA GERAR ID ÚNICO DA RETIRADA (8 DÍGITOS)
  function gerarIdRetirada8Digitos() {
    try {
      const agora = new Date();
      const timestamp = agora.getTime().toString(36).slice(-4);
      const random = Math.random().toString(36).substr(2, 4);
      return `${timestamp}${random}`.substr(0, 8).toUpperCase();
    } catch (error) {
      console.error('Erro ao gerar ID:', error);
      return `RET${Date.now().toString().slice(-8)}`;
    }
  }

  // FUNÇÃO PARA OBTER DATA ATUAL
  function obterDataAtualRetirada() {
    return new Date().toISOString().slice(0, 16);
  }

  // FUNÇÃO PARA PREENCHER APENAS A DATA
  function preencherDataRetirada() {
    try {
      const campoData = document.getElementById('retirada-data');
      if (campoData && !campoData.value) {
        campoData.value = obterDataAtualRetirada();
      }
    } catch (error) {
      console.error('Erro ao preencher data:', error);
    }
  }

  // FUNÇÃO PARA VALIDAR CAMPOS OBRIGATÓRIOS
  function validarCamposRetirada() {
    const camposObrigatorios = [
      { id: 'retirada-requisitante', nome: 'Requisitante' },
      { id: 'retirada-responsavel', nome: 'Responsável' },
      { id: 'retirada-local', nome: 'Local de Destino' },
      { id: 'retirada-finalidade', nome: 'Finalidade' }
    ];

    const camposVazios = [];
    
    camposObrigatorios.forEach(campo => {
      const elemento = document.getElementById(campo.id);
      if (!elemento || !elemento.value.trim()) {
        camposVazios.push(campo.nome);
        if (elemento) elemento.style.borderColor = '#dc3545';
      } else {
        elemento.style.borderColor = '#28a745';
      }
    });

    setTimeout(() => {
      camposObrigatorios.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        if (elemento) elemento.style.borderColor = '';
      });
    }, 3000);

    return camposVazios;
  }

  // FUNÇÃO PARA COLETAR DADOS DA RETIRADA
  function coletarDadosRetirada() {
    const dados = {};
    
    camposRetirada.forEach(campoId => {
      const elemento = document.getElementById(campoId);
      if (elemento) {
        let valor = elemento.value.trim();
        
        if (campoId === 'retirada-local') {
          if (valor === 'Outro' || valor === 'outro') {
            const outroLocal = document.getElementById('retirada-outro-local');
            if (outroLocal && outroLocal.value.trim()) {
              valor = outroLocal.value.trim();
            } else {
              valor = 'Outro (não especificado)';
            }
          }
        }
        
        const nomeCampo = campoId.replace('retirada-', '');
        dados[nomeCampo] = valor || '';
      }
    });

    return dados;
  }

  // FUNÇÃO PARA COLETAR ITENS DA TABELA DE RETIRADA
  function coletarItensRetirada() {
    const dadosFormulario = coletarDadosRetirada();
    const destinoFormulario = dadosFormulario.local || '';
    
    if (!tabelaItensRetirada) {
      console.warn('Tabela de itens não encontrada');
      return [];
    }

    const linhas = tabelaItensRetirada.querySelectorAll('tr');
    const itens = [];

    linhas.forEach((linha, index) => {
      const celulas = linha.querySelectorAll('td');
      if (celulas.length >= 5) {
        const produto = celulas[0]?.textContent?.trim() || '';
        const quantidade = celulas[1]?.textContent?.trim() || '1';
        const destinoTabela = celulas[2]?.textContent?.trim() || '';
        const finalidadeTabela = celulas[3]?.textContent?.trim() || '';

        if (produto && produto !== '' && produto !== '-' && produto !== 'N/A') {
          const destinoFinal = destinoTabela && destinoTabela !== '' ? destinoTabela : destinoFormulario;
          
          itens.push({
            produto: produto,
            quantidade: quantidade,
            destino: destinoFinal || 'Não especificado',
            finalidade: finalidadeTabela || dadosFormulario.finalidade || 'Não especificada'
          });
        }
      }
    });

    return itens;
  }

  // FUNÇÃO PARA CONSULTAR ESTOQUE
  async function consultarEstoqueProduto(nomeProduto) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.exksvol.website/produtos/estoque', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ produto: nomeProduto })
      });
      if (response.ok) {
        const resultado = await response.json();
        return resultado.quantidade !== undefined ? parseInt(resultado.quantidade, 10) : null;
      }
      return null;
    } catch (error) {
      console.error('Erro ao consultar estoque:', error);
      return null;
    }
  }

  // FUNÇÃO PRINCIPAL PARA FINALIZAR RETIRADA
  async function finalizarRetiradaAdaptada(event) {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (btnFinalizarRetirada) {
        btnFinalizarRetirada.disabled = true;
        btnFinalizarRetirada.innerHTML = '⏳ Processando...';
      }

      preencherDataRetirada();
      await new Promise(resolve => setTimeout(resolve, 300));

      const camposVazios = validarCamposRetirada();
      if (camposVazios.length > 0) {
        alert(`Preencha os campos obrigatórios:\n\n${camposVazios.map(c => `• ${c}`).join('\n')}`);
        reabilitarBotaoRetirada();
        return false;
      }

      const itens = coletarItensRetirada();
      if (itens.length === 0) {
        alert('Adicione pelo menos um item antes de finalizar.');
        reabilitarBotaoRetirada();
        return false;
      }

      // Verifica estoque de cada item
      for (let i = 0; i < itens.length; i++) {
        const item = itens[i];
        const estoqueAtual = await consultarEstoqueProduto(item.produto);
        const quantidadeSolicitada = parseInt(item.quantidade, 10) || 0;
        if (estoqueAtual !== null && estoqueAtual < quantidadeSolicitada) {
          alert(`O item "${item.produto}" só tem ${estoqueAtual} em estoque. Não é possível retirar ${quantidadeSolicitada}.`);
          reabilitarBotaoRetirada();
          return false;
        }
      }

      const dadosBase = coletarDadosRetirada();
      const idRetiradaUnico = obterIdRetiradaAdaptada();
      mostrarLoadingRetirada();

      const resultados = [];
      for (let i = 0; i < itens.length; i++) {
        const item = itens[i];
        const dadosItem = {
          id_retirada: idRetiradaUnico,
          ...dadosBase,
          produto: item.produto,
          quantidade: item.quantidade,
          local: item.destino || dadosBase.local,
          finalidade: item.finalidade || dadosBase.finalidade
        };
        
        const sucesso = await salvarItemAPIRetirada(dadosItem, i + 1, itens.length);
        resultados.push({
          produto: item.produto,
          quantidade: item.quantidade,
          id_retirada: idRetiradaUnico,
          sucesso: sucesso
          
        });
        await new Promise(resolve => setTimeout(resolve, 300));
              esconderLoadingRetirada();
      reabilitarBotaoRetirada();
      }

      processarResultadosRetirada(resultados, idRetiradaUnico);
      return false;

    } catch (error) {
      console.error('Erro:', error);

     // alert('Erro ao processar. Tente novamente.');
      return false;
    }
  }

  // FUNÇÕES AUXILIARES PARA RETIRADA
  function mostrarLoadingRetirada() {
    // Implementação do loading
  }

  function esconderLoadingRetirada() {
    // Implementação para esconder loading
  }

  function reabilitarBotaoRetirada() {
    if (btnFinalizarRetirada) {
      btnFinalizarRetirada.disabled = false;
      btnFinalizarRetirada.innerHTML = 'Finalizar Retirada';
    }
  }

  async function salvarItemAPIRetirada(dadosItem, itemAtual, totalItens) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Token não encontrado');
        return false;
      }

      const response = await fetch('https://api.exksvol.website/retiradas/salvar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(dadosItem)
      });

      if (response.ok) {
        const resultado = await response.json();
        if (resultado.status === 'ok') {
          return {
            sucesso: true,
            id: resultado.retirada?.id_retirada || dadosItem.id_retirada,
            dados: resultado
          };
        }
      }
      return false;
    } catch (error) {
      console.error('Erro na API:', error);
      return false;
    }
  }

  function processarResultadosRetirada(resultados, idRetiradaUnico) {
    const sucessos = resultados.filter(r => r.sucesso);
    const falhas = resultados.filter(r => !r.sucesso);
    
    esconderLoadingRetirada();
    
    if (falhas.length === 0) {
      alert(
        `Retirada processada com sucesso!\n\n` +
        `ID da Retirada: ${idRetiradaUnico}\n` +
        `Total de itens: ${sucessos.length}`
      );
      // Limpa o formulário após sucesso
      //document.getElementById('form-retirada').reset();
      document.getElementById('itens-retirada').innerHTML = '';
      // Limpa também o campo requisitante
      const campoRequisitante = document.getElementById('retirada-requisitante');
      if (campoRequisitante) campoRequisitante.value = '';
      atualizarPreviewCupom();
      // Gera novo ID de retirada e preenche o campo
      setTimeout(() => {
        const campoId = document.getElementById('retirada-id');
        if (campoId && typeof gerarIdRetirada8Digitos === 'function') {
          const novoId = gerarIdRetirada8Digitos();
          campoId.value = novoId;
          if (typeof idRetiradaGerado !== 'undefined') {
            idRetiradaGerado = novoId;
          }
        }
      }, 100);
    } else {
      alert(
        `Processamento parcial!\n\n` +
        `Itens processados: ${sucessos.length}\n` +
        `Itens com erro: ${falhas.length}\n\n` +
        `Os itens com erro serão sincronizados quando houver conexão.`
      );
    }
  }

  //  FUNÇÃO PARA OBTER ID DA RETIRADA
  function obterIdRetiradaAdaptada() {
    if (idRetiradaGerado) {
      return idRetiradaGerado;
    }
    return carregarIdRetiradaAoIniciar();
  }

  //  FUNÇÃO PARA CARREGAR ID NA INICIALIZAÇÃO
  function carregarIdRetiradaAoIniciar() {
    if (campoIdRetirada && campoIdRetirada.value.trim()) {
      idRetiradaGerado = campoIdRetirada.value.trim();
      return idRetiradaGerado;
    }
    
    idRetiradaGerado = gerarIdRetirada8Digitos();
    
    if (campoIdRetirada) {
      campoIdRetirada.value = idRetiradaGerado;
      campoIdRetirada.style.backgroundColor = '#e8f5e8';
      campoIdRetirada.style.fontWeight = 'bold';
      campoIdRetirada.readOnly = true;
    }
    
    return idRetiradaGerado;
  }

  //  INICIALIZAÇÃO DA RETIRADA
  function inicializarRetirada() {
    if (!encontrarElementosRetirada()) {
      console.warn('Elementos essenciais não encontrados');
      return;
    }

    if (btnFinalizarRetirada) {
      btnFinalizarRetirada.addEventListener('click', finalizarRetiradaAdaptada);
    }
    
    // Carrega ID imediatamente se a aba estiver visível
    setTimeout(() => {
      if (campoIdRetirada && campoIdRetirada.offsetParent !== null) {
        carregarIdRetiradaAoIniciar();
      }
    }, 500);
    
    // Preenche data inicial
    setTimeout(preencherDataRetirada, 1000);
  }

  // Inicializa o sistema de retirada
  inicializarRetirada();

  // Tenta novamente após 3 segundos se não encontrou elementos
  setTimeout(() => {
    if (!btnFinalizarRetirada) {
      inicializarRetirada();
    }
  }, 3000);

  
  //======================================================================================================


async function buscarDevolucoesPorId() {
  const idInput = document.getElementById('devolucao-id'); // usa o id correto!
  const tabela = document.getElementById('tabela-devolucoes');
  if (!idInput || !tabela) return;

  const idRetirada = idInput.value.trim();
  if (!idRetirada) {
    alert('Digite o código da retirada para buscar.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://api.exksvol.website/retiradas/por-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ id_retirada: idRetirada })
    });

    if (!response.ok) {
      alert('Erro ao buscar devoluções.');
      return;
    }

    const data = await response.json();
    // Ajuste aqui conforme o retorno real do backend:
    const devolucoes = Array.isArray(data.devolucoes) ? data.devolucoes : [];

    // Limpa a tabela (mantendo apenas o cabeçalho)
    const tbody = tabela.tBodies[0] || tabela.createTBody();
    tbody.innerHTML = '';

    if (devolucoes.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 7; // número de colunas da sua tabela
      td.textContent = 'Nenhum registro encontrado para este código de retirada.';
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    devolucoes.forEach(item => {
      const tr = document.createElement('tr');
      // Adapte os campos conforme o retorno do backend
      const tdId = document.createElement('td');
      const tdProduto = document.createElement('td');
      const tdQuantidade = document.createElement('td');
      const tdRequisitante = document.createElement('td');
      const tdResponsavel = document.createElement('td');
      const tdObservacao = document.createElement('td');
      const tdData = document.createElement('td');
      tdId.textContent = item.id_retirada || idRetirada;
      tdProduto.textContent = item.produto || '';
      tdQuantidade.textContent = item.quantidade || '';
      tdRequisitante.textContent = item.requisitante || '';
      tdResponsavel.textContent = item.responsavel || '';
      tdObservacao.textContent = item.observacao || '';
      tdData.textContent = item.data ? formatarDataCurta(item.data) : '';
      tr.appendChild(tdId);
      tr.appendChild(tdProduto);
      tr.appendChild(tdQuantidade);
      tr.appendChild(tdRequisitante);
      tr.appendChild(tdResponsavel);
      tr.appendChild(tdObservacao);
      tr.appendChild(tdData);
      tbody.appendChild(tr);
    });
  } catch (error) {
    alert('Erro ao buscar devoluções.');
  }
}

// 1. Adicionar item na tabela localmente, validando se o produto pertence à retirada
document.getElementById('btn-adicionar-item-devolucao')?.addEventListener('click', async function () {
  const idRetirada = document.getElementById('devolucao-id')?.value.trim();
  const produto = document.getElementById('devolucao-produto')?.value.trim();
  const quantidade = document.getElementById('devolucao-quantidade')?.value.trim();
  const requisitante = document.getElementById('devolucao-requisitante')?.value.trim();
  const responsavel = document.getElementById('devolucao-responsavel')?.value.trim();
  const observacao = document.getElementById('devolucao-observacao')?.value.trim();
  const data = new Date().toISOString();

  if (!idRetirada || !produto || !quantidade) {
    alert('Preencha o ID da retirada, produto e quantidade.');
    return;
  }

  // Busca os itens da retirada no backend para validar o produto
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://api.exksvol.website/retiradas/por-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ id_retirada: idRetirada })
    });
    if (!response.ok) {
      alert('Erro ao validar retirada.');
      return;
    }
    const dataRetorno = await response.json();
    const itensRetirada = Array.isArray(dataRetorno.devolucoes) ? dataRetorno.devolucoes : [];
    const itemRetirada = itensRetirada.find(item => item.produto === produto);
    if (!itemRetirada) {
      alert(`O item "${produto}" não existe na retirada ${idRetirada}.`);
      return;
    }
  } catch (error) {
    alert('Erro ao validar retirada.');
    return;
  }

  const tabela = document.getElementById('tabela-devolucoes');
  const tbody = tabela.tBodies[0] || tabela.createTBody();
  // Verifica se já existe uma linha com o mesmo produto
  let linhaExistente = null;
  for (let linha of tbody.rows) {
    if (linha.cells[1] && linha.cells[1].textContent === produto) {
      linhaExistente = linha;
      break;
    }
  }
  if (linhaExistente) {
    // Soma a quantidade
    const quantidadeAtual = parseInt(linhaExistente.cells[2].textContent, 10) || 0;
    const novaQuantidade = quantidadeAtual + (parseInt(quantidade, 10) || 0);
    linhaExistente.cells[2].textContent = novaQuantidade;
    // Atualiza outros campos se desejar (opcional)
    linhaExistente.cells[3].textContent = requisitante;
    linhaExistente.cells[4].textContent = responsavel;
    linhaExistente.cells[5].textContent = observacao;
    linhaExistente.cells[6].textContent = formatarDataCurta(data);
  } else {
    // Cria nova linha normalmente
    const tr = document.createElement('tr');
    [idRetirada, produto, quantidade, requisitante, responsavel, observacao, formatarDataCurta(data)].forEach(valor => {
      const td = document.createElement('td');
      td.textContent = valor;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }
});

// 2. Registrar devolução com validação
document.getElementById('btn-registro-devolucao')?.addEventListener('click', async function (e) {
  e.preventDefault();

  const idRetirada = document.getElementById('devolucao-id')?.value.trim();
  if (!idRetirada) {
    alert('Informe o ID da retirada.');
    return;
  }

  // Coleta os itens da tabela de devoluções
  const tabela = document.getElementById('tabela-devolucoes');
  const linhas = tabela.tBodies[0]?.rows || [];
  if (linhas.length === 0) {
    alert('Adicione pelo menos um item para devolução.');
    return;
  }

  // Busca os itens da retirada no backend
  const token = localStorage.getItem('token');
  const response = await fetch('https://api.exksvol.website/retiradas/por-id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ id_retirada: idRetirada })
  });

  if (!response.ok) {
    alert('Erro ao validar retirada.');
    return;
  }

  const dataRetorno = await response.json();
  const itensRetirada = Array.isArray(dataRetorno.devolucoes) ? dataRetorno.devolucoes : [];

  // Validação dos itens
  for (let linha of linhas) {
    const produto = linha.cells[1].textContent;
    const quantidadeDevolucao = parseInt(linha.cells[2].textContent, 10);

    const itemRetirada = itensRetirada.find(item => item.produto === produto);
    if (!itemRetirada) {
      alert(`O item "${produto}" não existe na retirada ${idRetirada}.`);
      return;
    }
    const quantidadeRetirada = parseInt(itemRetirada.quantidade, 10);
    if (quantidadeDevolucao > quantidadeRetirada) {
      alert(`A quantidade devolvida do item "${produto}" (${quantidadeDevolucao}) é maior que a retirada (${quantidadeRetirada}).`);
      return;
    }
  }

  // Se passou por todas as validações, pode registrar a devolução no backend
  // Monta os dados para envio
  const itens = [];
  for (let linha of linhas) {
    itens.push({
      produto: linha.cells[1].textContent,
      quantidade: parseInt(linha.cells[2].textContent, 10),
      requisitante: linha.cells[3].textContent,
      responsavel: linha.cells[4].textContent,
      observacao: linha.cells[5].textContent,
      data: linha.cells[6].textContent // já formatada
    });
  }
  const responsavel = document.getElementById('devolucao-responsavel')?.value.trim() || '';
  const observacao = document.getElementById('devolucao-observacao')?.value.trim() || '';
  const requisitante = document.getElementById('devolucao-requisitante')?.value.trim() || '';
  const data = new Date().toISOString();
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://api.exksvol.website/devolucao/salvar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        id_retirada: idRetirada,
        itens,
        responsavel,
        observacao,
        requisitante,
        data
      })
    });
    if (response.ok) {
      alert('Devolução registrada com sucesso!');
      // Limpa a tabela e campos, se desejar
      if (tabela.tBodies[0]) tabela.tBodies[0].innerHTML = '';
    } else {
      alert('Erro ao registrar devolução.');
    }
  } catch (error) {
    alert('Erro ao registrar devolução.');
  }
});

// Função auxiliar para formatar a data (ex: 2025-07-02 para 02/07/2025)
function formatarDataCurta(dataISO) {
  if (!dataISO) return '';
  const d = new Date(dataISO);
  if (isNaN(d.getTime())) return dataISO;
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Adicione o evento ao botão de busca
document.getElementById('btn-buscar-devolucao')?.addEventListener('click', buscarDevolucoesPorId);

// Verificação ao perder o foco do campo de código de retirada
document.getElementById('devolucao-id')?.addEventListener('blur', async function () {
  const idInput = document.getElementById('devolucao-id');
  const campoRequisitante = document.getElementById('devolucao-requisitante');
  if (!idInput || !campoRequisitante) return;
  const idRetirada = idInput.value.trim();
  if (!idRetirada) return;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://api.exksvol.website/retiradas/por-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ id_retirada: idRetirada })
    });
    if (!response.ok) {
      campoRequisitante.value = '';
      return;
    }
    const data = await response.json();
    const devolucoes = Array.isArray(data.devolucoes) ? data.devolucoes : [];
    if (devolucoes.length > 0 && devolucoes[0].requisitante) {
      campoRequisitante.value = devolucoes[0].requisitante;
    } else {
      campoRequisitante.value = '';
    }
  } catch (error) {
    campoRequisitante.value = '';
  }
});


//======================================================================================================
// FUNÇÃO PRINCIPAL: Inicialização dos Eventos de Kit
// Adiciona item do formulário de kit na tabela de kits e salva todos os itens no backend.
//======================================================================================================
document.addEventListener('DOMContentLoaded', function () {
  // Evento para salvar todos os itens do kit na tabela do backend
  const btnSalvarKit = document.getElementById('btn-salvar-kit');
  if (btnSalvarKit) {
    btnSalvarKit.addEventListener('click', async function (e) {
      e.preventDefault();
      try {
        const tabelaKit = document.getElementById('tabela-kit');
        if (!tabelaKit) {
          alert('Tabela de kits não encontrada!');
          return;
        }
        const tbody = tabelaKit.tBodies[0];
        if (!tbody || tbody.rows.length === 0) {
          alert('Adicione pelo menos um item ao kit antes de salvar!');
          return;
        }
        // Monta array de objetos
        const kits = [];
        for (let i = 0; i < tbody.rows.length; i++) {
          const row = tbody.rows[i];
          const cells = row.cells;
          kits.push({
            nome_do_kit: cells[0].textContent.trim(),
            produto: cells[1].textContent.trim(),
            quantidade: cells[2].textContent.trim(),
            categoria: cells[3].textContent.trim(),
            observacao: cells[4].textContent.trim()
          });
        }
        // Envia para o backend
        const token = localStorage.getItem('token');
        const response = await fetch('https://api.exksvol.website/kits/salvar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ kits })
        });
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'ok') {
            alert('Kits salvos com sucesso!');
            // Limpa a tabela após salvar
            tbody.innerHTML = '';
            // Limpa todos os campos do formulário do kit
            const nomeKitInput = document.getElementById('nome-do-kit');
            const produtoInput = document.getElementById('nome-produto-kit');
            const quantidadeInput = document.getElementById('quantidade-kit');
            const categoriaInput = document.getElementById('categoria-kit');
            const observacaoInput = document.getElementById('observacao-kit');
            if (nomeKitInput) nomeKitInput.value = '';
            if (produtoInput) produtoInput.value = '';
            if (quantidadeInput) quantidadeInput.value = '';
            if (categoriaInput) categoriaInput.value = '';
            if (observacaoInput) observacaoInput.value = '';
            // Volta a imagem para o padrão
            const imgKit = document.getElementById('preview-produto-kit') || document.getElementById('preview-kit') || document.getElementById('imagem-kit');
            if (imgKit) {
              imgKit.src = '../IMG/Sem imagem.png';
              imgKit.alt = 'Imagem do Produto';
              imgKit.style.cursor = 'default';
              imgKit.title = 'Clique para selecionar uma imagem';
              imgKit.onclick = null;
            }
          } else {
            alert('Erro ao salvar kits: ' + (data.mensagem || 'Erro desconhecido.'));
          }
        } else {
          alert('Erro ao salvar kits: ' + response.status + ' ' + response.statusText);
        }
      } catch (err) {
        alert('Erro ao salvar kits: ' + err.message);
        console.error(err);
      }
    });
  }
  // ...imagem do produto não será mais carregada automaticamente...
  const btnAdicionar = document.getElementById('btn-adicionar-item-kit');
  if (!btnAdicionar) return;
  btnAdicionar.addEventListener('click', function (e) {
    e.preventDefault();
    try {
      // Captura os campos
      const nomeKitInput = document.getElementById('nome-do-kit');
      const produtoInput = document.getElementById('nome-produto-kit');
      const quantidadeInput = document.getElementById('quantidade-kit');
      const categoriaInput = document.getElementById('categoria-kit');
      const observacaoInput = document.getElementById('observacao-kit');

      if (!nomeKitInput || !produtoInput || !quantidadeInput || !categoriaInput || !observacaoInput) {
        alert('Erro interno: campo não encontrado no formulário.');
        return;
      }

      const nomeKit = nomeKitInput.value.trim();
      const produto = produtoInput.value.trim();
      const quantidade = quantidadeInput.value.trim();
      const categoria = categoriaInput.value.trim();
      const observacao = observacaoInput.value.trim();

      // Validação simples
      if (!nomeKit || !produto || !quantidade || !categoria) {
        alert('Preencha todos os campos obrigatórios do kit!');
        return;
      }

      // Monta a linha
      const tabelaKit = document.getElementById('tabela-kit');
      if (!tabelaKit) {
        alert('Tabela de kits não encontrada!');
        return;
      }
      const tbody = tabelaKit.tBodies[0] || tabelaKit.createTBody();
      const novaLinha = tbody.insertRow();
      novaLinha.insertCell().textContent = nomeKit;
      novaLinha.insertCell().textContent = produto;
      novaLinha.insertCell().textContent = quantidade;
      novaLinha.insertCell().textContent = categoria;
      novaLinha.insertCell().textContent = observacao;

      // Limpa os campos Produto e Quantidade
      produtoInput.value = '';
      quantidadeInput.value = '';
      // Volta a imagem para o padrão
      const imgKit = document.getElementById('preview-produto-kit') || document.getElementById('preview-kit') || document.getElementById('imagem-kit');
      if (imgKit) {
        imgKit.src = '../IMG/Sem imagem.png';
        imgKit.alt = 'Imagem do Produto';
        imgKit.style.cursor = 'default';
        imgKit.title = 'Clique para selecionar uma imagem';
        imgKit.onclick = null;
      }
    } catch (err) {
      alert('Erro ao adicionar item: ' + err.message);
      console.error(err);
    }
  });
});


// =================================== FINAL DO SCRIPT =====================================


});