document.addEventListener('DOMContentLoaded', async function () {
  const moduleTabs = document.querySelectorAll('.top-tab'); // Seleciona os botões dos módulos
  const modules = {
    almoxarifado: 'almoxarifado.html',
    frota: 'frota.html',
    ordens: 'ordens.html',
    nobreaks: 'nobreaks.html'
  };

  // Solicitar os valores dos módulos do servidor
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token não encontrado. Faça login novamente.');
    return;
  }

  try {
    const res = await fetch('https://api.exksvol.website/modulos', { // Alterado para usar o túnel
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (data.status === 'ok') {
      const modulos = data.modulos;

      // Tornar os botões invisíveis ou visíveis com base nos valores dos módulos
      Object.keys(modules).forEach(modulo => {
        const tab = document.getElementById(`${modulo}-tab`);
        if (modulos[modulo]) {
          tab.style.display = 'inline-block'; // Torna o botão visível
        } else {
          tab.style.display = 'none'; // Torna o botão invisível
        }
      });
    } else {
      console.error('Erro ao obter módulos:', data.mensagem);
    }
  } catch (err) {
    console.error('Erro ao conectar com o servidor:', err);
  }

  //  funcionalidade de redirecionamento ao clicar nos botões visíveis
  moduleTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const moduleId = this.id.replace('-tab', ''); // Extrai o ID do módulo
      if (modules[moduleId]) {
        window.location.href = modules[moduleId]; // Redireciona para o módulo correspondente
      }
    });
  });

  //  funcionalidade de logout
  const logoutButton = document.getElementById('btn-logout');
  logoutButton.addEventListener('click', function () {
    localStorage.clear(); // Exclui todo o conteúdo do localStorage
    window.location.href = 'index.html'; // Redireciona para index.html
  });
});