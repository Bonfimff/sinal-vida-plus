document.addEventListener('DOMContentLoaded', function () {
  // Carregar e executar o main.js dinamicamente
  const script = document.createElement('script');
  script.src = 'geral.js';
  script.onload = () => {
    console.log('✅ .js foi executado com sucesso.');
    const body = document.querySelector('body');
    const message = document.createElement('div');
    message.textContent = '.js foi executado com sucesso.';
    message.style.position = 'fixed';
    message.style.bottom = '10px';
    message.style.right = '10px';
    message.style.backgroundColor = '#4CAF50';
    message.style.color = '#fff';
    message.style.padding = '10px';
    message.style.borderRadius = '5px';
    message.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    body.appendChild(message);

    setTimeout(() => {
      message.remove(); 
    }, 5000);
  };
  document.head.appendChild(script);

  // Código existente do almoxarifado.js
  const sidebarContent = document.getElementById('sidebar-content'); 
  const tbodyItens = document.getElementById('itens-retirada');
  const tabs = document.querySelectorAll('.tab-btn'); 
  const tabContents = document.querySelectorAll('.tab-content'); 

  // Função para atualizar o preview no painel lateral
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

  // Função para gerar o HTML do preview
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
              const checkbox = document.querySelector(`#colunas-visiveis input[type="checkbox"][value="${coluna}"]`);
              return checkbox && checkbox.checked;
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
  if (botaoRetiradas1||botaoRetiradas2||botaoRetiradas3||botaoRetiradas4||botaoRetiradas5) {

    botaoRetiradas1.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaRetiradas.classList.add('active');
      });
 
      botaoRetiradas2.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaRetiradas.classList.add('active');
    }); 
  
    botaoRetiradas3.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaRetiradas.classList.add('active');
    });

    botaoRetiradas4.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
      abaRetiradas.classList.add('active');
    });

    botaoRetiradas5.addEventListener('click', function () {
      todasAbas.forEach(aba => aba.classList.remove('active'));
     abaRetiradas.classList.add('active');
    });

  }


   
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
  // Evento para editar produtos na tabela
  document.querySelector("#tabelaProdutos").addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-editar")) {
      const row = event.target.closest("tr"); // Obtém a linha correspondente

      // Captura os valores das células da linha
      const nomeProduto = row.cells[1].textContent.trim();
      let codigo = row.cells[2].textContent.trim(); // Captura o código

      // Remove os zeros à esquerda do código
      codigo = codigo.replace(/^0+/, ''); 

      const unidMedida = row.cells[4]?.textContent.trim() || "N/A"; 
      const quantidadeRaw = row.cells[5]?.textContent.trim() || "N/A"; 
      const custo = row.cells[6]?.textContent.trim() || "N/A";
      const dataCompra = row.cells[7]?.textContent.trim() || "N/A";
      const numeroNota = row.cells[8]?.textContent.trim() || "N/A";
      const fornecedor = row.cells[9]?.textContent.trim() || "N/A";

      // Remove formatações da quantidade, se necessário
      const quantidade = quantidadeRaw.replace(/\./g, '').replace(',', '.'); // Converte para formato numérico

      // Preenche os campos do formulário, ignorando valores "N/A"
      if (nomeProduto !== "N/A") document.getElementById("nome-produto").value = nomeProduto;
      if (codigo !== "N/A") document.getElementById("codigo").value = codigo;
      if (quantidade !== "N/A") document.getElementById("quantidade").value = quantidade;
      if (custo !== "N/A") document.getElementById("custo").value = custo;

      // Preenche o campo de data (DATA DA COMPRA)
      if (dataCompra !== "N/A") {
        const dataFormatada = formatarDataParaInput(dataCompra); // Converte para o formato yyyy-MM-dd
        document.getElementById("data-compra").value = dataFormatada;
      }

      // Seleciona o fornecedor no campo de seleção
      const fornecedorSelect = document.getElementById("fornecedor");
      if (fornecedor !== "N/A") {
        const option = Array.from(fornecedorSelect.options).find(opt => opt.textContent.trim() === fornecedor);
        if (option) fornecedorSelect.value = option.value;
      }

      if (numeroNota !== "N/A") document.getElementById("numero-nota").value = numeroNota;

      // Seleciona a unidade de medida no campo <select>
      const selectUnidadeMedida = document.getElementById("unid-medida");
      if (selectUnidadeMedida && unidMedida !== "N/A") {
        const option = Array.from(selectUnidadeMedida.options).find(opt => opt.textContent.trim() === unidMedida);
        if (option) selectUnidadeMedida.value = option.value;
      }
    }
  });

  // Função para converter a data no formato dd/MM/yyyy para yyyy-MM-dd
  function formatarDataParaInput(data) {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  }

  document.getElementById("btn-novoProduto").addEventListener("click", async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

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

    // Remove "R$", pontos e espaços, e troca vírgula por ponto
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
      // Envia os dados para o backend
      const response = await fetch("https://api.exksvol.website/produtos/salvar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"), // Token de autenticação
        },
        body: JSON.stringify(produto),
      });

      const data = await response.json();

      if (response.ok && data.status === "ok") {
        alert("Produto salvo com sucesso!");
        // Limpa os campos do formulário
        document.getElementById("form-produtos").reset();
      } else {
        alert("Erro ao salvar produto: " + data.mensagem);
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
      alert("Erro ao salvar produto. Verifique o console para mais detalhes.");
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

  const toggleColunasBtn = document.getElementById("toggle-colunas");
  const colunasVisiveisDiv = document.getElementById("colunas-visiveis");
  const checkboxes = document.querySelectorAll("#colunas-visiveis input[type='checkbox']");
  const tabela = document.getElementById("Lista-dos-produtos");

  // Alternar visibilidade da lista de checkboxes
  toggleColunasBtn.addEventListener("click", function () {
    if (colunasVisiveisDiv.style.display === "none") {
      colunasVisiveisDiv.style.display = "block";
      toggleColunasBtn.textContent = "▲ Recolher opções";
    } else {
      colunasVisiveisDiv.style.display = "none";
      toggleColunasBtn.textContent = "▼ Escolha as colunas a serem exibidas";
    }
  });

  // Atualizar visibilidade das colunas
  function atualizarColunas() {
    checkboxes.forEach(checkbox => {
      const th = tabela.querySelector(`thead th[data-coluna="${checkbox.value}"]`);
      const tds = tabela.querySelectorAll(`tbody td[data-coluna="${checkbox.value}"]`);

      if (checkbox.checked) {
        if (th) th.style.display = ""; 
        tds.forEach(td => td.style.display = ""); 
      } else {
        if (th) th.style.display = "none"; 
        tds.forEach(td => td.style.display = "none"); 
      }
    });
  }

  // Adicionar evento aos checkboxes
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", atualizarColunas);
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

  
});