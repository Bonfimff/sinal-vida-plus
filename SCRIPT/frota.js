document.addEventListener('DOMContentLoaded', function () {
  const legendaPrincipal = document.getElementById('legenda-principal'); // Legenda principal

  const gerenciamentoTab = document.querySelector('.tab-btn[data-tab="gerenciamento"]');
  const gerenciamentoContent = document.getElementById('gerenciamento');
  if (gerenciamentoTab && gerenciamentoContent && legendaPrincipal) {
    gerenciamentoTab.classList.add('active');
    gerenciamentoContent.classList.add('active');
    legendaPrincipal.textContent = 'Gerenciamento';
  }

  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      const contentToShow = document.getElementById(tabId);
      if (contentToShow) {
        contentToShow.classList.add('active');
      }

      legendaPrincipal.textContent = this.textContent.trim();
    });
  });
});