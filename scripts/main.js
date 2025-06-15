document.addEventListener('DOMContentLoaded', function () {
  const moduleTabs = document.querySelectorAll('.top-tab'); // Seleciona os botões dos módulos
  const modules = {
    almoxarifado: '../htmls/almoxarifado.html',
    frota: '../htmls/frota.html',
    ordens: '../htmls/ordens.html',
    nobreaks: '../htmls/nobreaks.html'
  };

  moduleTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const moduleId = this.id.replace('-tab', ''); // Extrai o ID do módulo
      if (modules[moduleId]) {
        window.location.href = modules[moduleId]; // Redireciona para o módulo correspondente
      }
    });
  });
});