/* 
   CONFIGURAÇÃO DO TAILWIND
   Aqui definimos como as classes do Tailwind se comportam. 
   Por exemplo, a cor 'primary' aponta para o vermelho do projeto.
*/
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#b22200", // Cor principal usada em botões e links
      }
    }
  }
};

const enableDark = () => {
  document.documentElement.classList.add('dark');
  localStorage.setItem('theme', 'dark');
};

const disableDark = () => {
  document.documentElement.classList.remove('dark');
  localStorage.setItem('theme', 'light');
};

// Check for saved theme right away to avoid flashing
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  enableDark();
}

document.addEventListener('DOMContentLoaded', () => {
  // --- THEME TOGGLE ---
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      if (document.documentElement.classList.contains('dark')) {
        disableDark();
      } else {
        enableDark();
      }
    });
  }

  // --- AUTH LOGIC ---
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const nameInput = document.getElementById('register-name');
  const nameField = document.getElementById('name-field');
  const authBtn = document.getElementById('login-btn');
  const toggleAuthLink = document.getElementById('toggle-auth');
  const authToggleContainer = document.getElementById('auth-toggle-container');
  const formTitle = document.querySelector('h1.text-4xl');

  let isRegister = false;

  const handleToggle = (e) => {
    if (e) e.preventDefault();
    isRegister = !isRegister;
    
    if (isRegister) {
      nameField.classList.remove('hidden');
      authBtn.textContent = 'Criar Conta e Entrar';
      formTitle.textContent = 'Crie sua Conta';
      authToggleContainer.innerHTML = 'Já tem conta? <a href="#" id="toggle-auth" class="text-primary font-bold hover:underline">Fazer Login</a>';
    } else {
      nameField.classList.add('hidden');
      authBtn.textContent = 'Iniciar Jornada →';
      formTitle.textContent = 'Bem-vindo, Treinador';
      authToggleContainer.innerHTML = 'Novo treinador? <a href="#" id="toggle-auth" class="text-primary font-bold hover:underline">Solicitar acesso</a>';
    }
    
    // Re-attach event because innerHTML clears it
    document.getElementById('toggle-auth').addEventListener('click', handleToggle);
  };

  if (toggleAuthLink) toggleAuthLink.addEventListener('click', handleToggle);

  if (authBtn) {
    authBtn.addEventListener('click', () => {
      // Redirecionamento direto para o Dashboard (ignora verificação de e-mail/senha temporariamente)
      window.location.href = '9-Dashboard.html';
    });
  }

});
