/* 
   CONFIGURAÇÃO DO TAILWIND (MENSAGENS)
   Simplificado para focar nas cores principais do sistema.
*/
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#b22200",
                "primary-container": "#dd3107",
                "on-primary": "#ffffff",
                "surface": "#fcf9f8",
                "on-surface": "#1b1c1c",
                "surface-container-low": "#f6f3f2",
                "surface-container": "#f0eded",
                "surface-container-high": "#eae7e7",
                "surface-container-highest": "#e5e2e1",
                "surface-container-lowest": "#ffffff",
                "outline": "#916f68",
                "outline-variant": "#e6bdb5"
            }
        },
    },
}

const enableDark = () => { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); };
const disableDark = () => { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); };

if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  enableDark();
}

document.addEventListener('DOMContentLoaded', () => {
    /* --- CONTROLE DE TEMA --- */
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

    // Nota: Lógica de chat em tempo real seria implementada aqui.
});
