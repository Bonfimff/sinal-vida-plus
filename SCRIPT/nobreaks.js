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

  // Gerenciamento de abas do módulo Nobreaks
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