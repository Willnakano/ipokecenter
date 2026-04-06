/* 
   CONFIGURAÇÃO DO TAILWIND (DASHBOARD)
   Aqui você define os "apelidos" para as cores. 
   Por exemplo, mudar 'primary' aqui mudará a cor de todos os elementos que usam a classe 'bg-primary'.
*/
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Cores de Identidade
                "primary": "#b22200",      /* Vermelho Principal */
                "secondary": "#785a00",    /* Amarelo de Destaque */
                
                // Cores de Superfície (Backgrounds)
                "background": "#fcf9f8",
                "surface": "#fcf9f8",
                "surface-container": "#f0eded",
                "surface-container-low": "#f6f3f2",
                "surface-container-high": "#eae7e7",
                "surface-container-highest": "#e5e2e1",
                "surface-container-lowest": "#ffffff",
                
                // Outras cores do sistema (IA, Erros, etc)
                "on-primary": "#ffffff",
                "error": "#ba1a1a",
                "tertiary": "#5c5c5c",
                "outline": "#916f68",
                "outline-variant": "#e6bdb5"
            },
            fontFamily: {
                "headline": ["Inter"],
                "body": ["Inter"],
                "label": ["Inter"]
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
        },
    },
}

const enableDark = () => { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); };
const disableDark = () => { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); };

if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    enableDark();
}

document.addEventListener('DOMContentLoaded', () => {
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

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return `há ${interval} anos`;
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return `há ${interval} meses`;
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return `há ${interval} dias`;
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return `há ${interval} horas`;
        interval = Math.floor(seconds / 60);
        if (interval > 1) return `há ${interval} min`;
        return `agora`;
    };

    const renderDashboard = () => {
        if (typeof DB === 'undefined') return;

        // 0. Listeners
        const clearBtn = document.getElementById('clear-activity-btn');
        if (clearBtn && !clearBtn.dataset.listener) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Deseja realmente excluir todas as atividades recentes?')) {
                    DB.clearActivityLog();
                    renderDashboard();
                }
            });
            clearBtn.dataset.listener = 'true';
        }

        // 1. Stats
        const inventory = DB.getInventory();
        const party = DB.getParty();

        const totalPokesEl = document.getElementById('total-pokes-count');
        const partySizeEl = document.getElementById('party-size-val');

        if (totalPokesEl) totalPokesEl.innerText = inventory.length;
        if (partySizeEl) partySizeEl.innerText = party.length;

        // 2. Renderizar Slots do Time (Party)
        const partyContainer = document.getElementById('party-slots-container');
        if (partyContainer) {
            partyContainer.innerHTML = '';
            for (let i = 0; i < 6; i++) {
                const poke = party[i];
                const slot = document.createElement('div');
                slot.className = "bg-surface-container p-3 rounded-xl flex flex-col items-center gap-2 group transition-all cursor-pointer hover:bg-surface-container-high";

                if (poke) {
                    const hpPercent = Math.round((poke.hp / poke.maxHp) * 100);
                    const hpColor = hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-500' : 'bg-primary';

                    slot.innerHTML = `
                        <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <img class="w-10 h-10 object-contain" src="${poke.img}" alt="${poke.name}" />
                        </div>
                        <div class="text-center">
                            <p class="text-[10px] font-bold uppercase tracking-tighter text-zinc-900">${poke.name}</p>
                            <p class="text-[9px] font-medium text-zinc-500">Lv. ${poke.level}</p>
                        </div>
                        <div class="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                            <div class="h-full ${hpColor}" style="width: ${hpPercent}%"></div>
                        </div>
                    `;
                } else {
                    slot.innerHTML = `
                        <div class="w-14 h-14 rounded-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition-colors group-hover:border-zinc-400">
                            <span class="material-symbols-outlined text-zinc-300 dark:text-zinc-500" translate="no">add</span>
                        </div>
                        <div class="text-center">
                            <p class="text-[10px] font-bold uppercase tracking-tighter text-zinc-400 dark:text-zinc-500">Vazio</p>
                        </div>
                    `;
                    slot.onclick = () => window.location.href = '11-Party_Management.html';
                }
                partyContainer.appendChild(slot);
            }
        }

        // 3. Renderizar Log de Atividades
        const activityContainer = document.getElementById('recent-activity-container');
        if (activityContainer) {
            const activities = DB.getActivityLog();
            activityContainer.innerHTML = '';

            activities.forEach(act => {
                const item = document.createElement('div');
                item.className = "p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-default";

                let iconHtml = '';
                let contentHtml = '';

                if (act.type === 'capture') {
                    iconHtml = `
                        <div class="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-2 shadow-inner group-hover:scale-110 transition-transform">
                            <img src="assets/images/pokeball.svg" class="w-full h-full object-contain" alt="Pokeball">
                        </div>`;
                    contentHtml = `
                        <h4 class="text-sm font-bold">Nova Captura: ${act.pokemon}</h4>
                        <p class="text-xs text-on-surface-variant">${act.location} • Nível ${act.level}</p>`;
                } else if (act.type === 'message') {
                    iconHtml = `
                        <div class="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span class="material-symbols-outlined text-zinc-500 dark:text-zinc-400" translate="no">mail</span>
                        </div>`;
                    contentHtml = `
                        <h4 class="text-sm font-bold">Mensagem de ${act.from}</h4>
                        <p class="text-xs text-on-surface-variant">${act.text}</p>`;
                }

                item.innerHTML = `
                    <div class="flex items-center gap-4">
                        ${iconHtml}
                        <div>${contentHtml}</div>
                    </div>
                    <span class="text-[10px] font-bold text-zinc-400 uppercase">${timeAgo(act.timestamp)}</span>
                `;
                activityContainer.appendChild(item);
            });
        }
    };

    renderDashboard();
});
