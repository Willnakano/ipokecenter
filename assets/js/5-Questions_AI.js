/**
 * iPokeCenter - Script de Perguntas IA 
 */

const enableDark = () => { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); };
const disableDark = () => { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); };

if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    enableDark();
}

document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE TEMA ---
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                disableDark();
            } else {
                enableDark();
            }
        });
    }

    // Funcionalidade de Chat (exemplo básico se necessário)
    const chatInput = document.querySelector('input[placeholder="Digite sua pergunta..."]');
    const sendBtn = document.querySelector('button:has(.material-symbols-outlined:contains("send"))') || document.querySelector('button.bg-gradient-to-br');

    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', () => {
            const text = chatInput.value.trim();
            if (text) {
                alert('O Professor está analisando: ' + text);
                chatInput.value = '';
            }
        });
    }
});
