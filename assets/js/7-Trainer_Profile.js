/* 
   CONFIGURAÇÃO DO TAILWIND (PERFIL)
   Simplificamos as cores para usar os padrões do sistema.
*/
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#b22200",
                "secondary": "#785a00",
                "background": "#fcf9f8",
                "surface": "#fcf9f8",
                "on-surface": "#1b1c1c",
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

    const totalCaughtCount = document.getElementById('total-caught-count');
    const totalCaughtBar = document.getElementById('total-caught-bar');
    const badgesMetricCount = document.getElementById('badges-metric-count');
    const badgesMetricBar = document.getElementById('badges-metric-bar');
    const badgesContainer = document.getElementById('badges-container');
    const badgesEarnedCount = document.getElementById('badges-earned-count');
    const manageBadgesBtn = document.getElementById('manage-badges-btn');

    const renderProfile = () => {
        // ... (resto da lógica de Total Caught)
        // 1. Render Total Caught (based on Box inventory size)
        const inventory = DB.getInventory();
        const capacity = DB.getCapacity();
        if (totalCaughtCount) totalCaughtCount.innerText = inventory.length;
        if (totalCaughtBar) {
            const percent = Math.min((inventory.length / capacity) * 100, 100);
            totalCaughtBar.style.width = `${percent}%`;
        }

        // 2. Render Badges
        if (badgesContainer) {
            const badges = DB.getBadges();
            
            // Sync Metro Count
            if (badgesMetricCount) badgesMetricCount.innerText = badges.length;
            if (badgesMetricBar) {
                const percent = Math.min((badges.length / 8) * 100, 100);
                badgesMetricBar.style.width = `${percent}%`;
            }

            badgesContainer.innerHTML = '';
            
            badges.forEach(badge => {
                const badgeEl = document.createElement('div');
                badgeEl.className = "flex flex-col items-center group relative";
                
                let iconContent = '';
                if (badge.img) {
                    iconContent = `<img src="${badge.img}" alt="${badge.name}" class="h-16 w-16 object-contain">`;
                } else {
                    iconContent = `<span class="material-symbols-outlined text-4xl text-primary" translate="no">${badge.icon || 'military_tech'}</span>`;
                }

                badgeEl.innerHTML = `
                    <div class="h-24 w-24 rounded-full bg-surface-container-low flex items-center justify-center mb-3 group-hover:bg-primary-fixed transition-colors overflow-hidden">
                        ${iconContent}
                    </div>
                    <p class="text-xs font-black tracking-tight text-on-surface uppercase">${badge.name}</p>
                    <p class="text-[10px] font-bold text-on-surface-variant">${badge.city}</p>
                    <button class="remove-badge absolute -top-2 -right-2 bg-error text-white h-6 w-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" data-id="${badge.id}">
                        <span class="material-symbols-outlined text-xs" translate="no">close</span>
                    </button>
                `;

                badgeEl.querySelector('.remove-badge').addEventListener('click', () => {
                   if(confirm(`Remover emblema ${badge.name}?`)) {
                       DB.removeBadge(badge.id);
                       renderProfile();
                   }
                });

                badgesContainer.appendChild(badgeEl);
            });

            if (badgesEarnedCount) badgesEarnedCount.innerText = `${badges.length}/8 EARNED`;
        }
    };

    if (manageBadgesBtn) {
        manageBadgesBtn.addEventListener('click', () => {
            const name = prompt("Nome do Emblema:");
            if (!name) return;
            const city = prompt("Cidade/Local:");
            const choice = confirm("Deseja usar uma imagem? (OK para Imagem, Cancelar para Ícone)");
            
            let badgeData = { name, city };
            if (choice) {
                const img = prompt("URL da Imagem:");
                if (img) badgeData.img = img;
            } else {
                const icon = prompt("Nome do Ícone Material (ex: bolt, water_drop, eco):", "military_tech");
                if (icon) badgeData.icon = icon;
            }

            DB.addBadge(badgeData);
            renderProfile();
        });
    }

    renderProfile();
});
