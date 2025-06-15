document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');
  const togglePwd = document.getElementById('toggle-password');
  const pwdInput = document.getElementById('password');

  togglePwd.addEventListener('click', () => {
    const type = pwdInput.type === 'password' ? 'text' : 'password';
    pwdInput.type = type;
    togglePwd.style.color = type === 'text' ? '#FFCB1F' : '#888';
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const username = form.username.value.trim();
    const password = form.password.value;

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await res.json();

      // Log completo da resposta do servidor
      console.log('Resposta do servidor:', result);

      if (res.ok && result.status === 'ok') {
        localStorage.setItem('usuario', JSON.stringify(result.usuario));
        localStorage.setItem('token', result.token);
        window.location.href = 'teste-token.html'; // Redireciona para almoxarifado.html
      } else {
        errorEl.textContent = result.mensagem || 'Usuário ou senha inválidos.';
        errorEl.style.display = 'block';
      }
    } catch (err) {
      console.error('Erro ao conectar:', err);
      errorEl.textContent = 'Erro ao conectar ao servidor.';
      errorEl.style.display = 'block';
    }
  });
});
