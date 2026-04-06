/* 
   CONFIGURAÇÃO DO TAILWIND (GERENCIAMENTO DE TIME)
   Simplificado para focar nas cores principais do sistema.
*/
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#b22200",
                "on-background": "#1b1c1c",
                "surface-container-low": "#f6f3f2",
                "surface-container-high": "#eae7e7",
                "surface-container-highest": "#e5e2e1",
                "surface-container-lowest": "#ffffff",
                "outline-variant": "#e6bdb5",
                "error": "#ba1a1a",
                "error-container": "#ffdad6",
                "on-error-container": "#93000a"
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

    const boxContainer = document.getElementById('box-container');
    const partyContainer = document.getElementById('party-container');
    const toast = document.getElementById('party-full-toast');

    // Exibe aviso quando o time está cheio
    const showToast = (message) => {
        if (!toast) return;
        toast.querySelector('p').innerText = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    };

    /* --- RENDERIZAÇÃO DA BOX (INVENTÁRIO) --- */
    const renderBox = () => {
        if (!boxContainer) return;
        const boxPokes = DB.getInventory();
        boxContainer.innerHTML = '';

        boxPokes.forEach(poke => {
            const item = document.createElement('div');
            item.className = "bg-surface-container-lowest p-3 rounded-xl flex items-center justify-between group hover:shadow-md transition-shadow";
            item.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-surface-container rounded-lg overflow-hidden border border-outline-variant/5">
                        <img class="w-full h-full object-cover" src="${poke.img}" alt="${poke.name}"/>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold">${poke.name}</h4>
                        <div class="flex gap-1 mt-1">
                            <span class="text-[9px] font-black uppercase text-white bg-primary px-1.5 rounded-full">${poke.type}</span>
                        </div>
                    </div>
                </div>
                <button class="add-to-party w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors active:scale-90" data-id="${poke.id}">
                    <span class="material-symbols-outlined text-sm" translate="no">add</span>
                </button>
            `;

            item.querySelector('.add-to-party').addEventListener('click', () => {
                if (DB.addToParty(poke)) {
                    renderParty();
                } else {
                    showToast("Sua equipe está cheia! Apenas 6 Pokémon permitidos.");
                }
            });

            boxContainer.appendChild(item);
        });
    };

    /* --- RENDERIZAÇÃO DO TIME ATIVO (MÁX 6) --- */
    const renderParty = () => {
        if (!partyContainer) return;
        const party = DB.getParty();
        partyContainer.innerHTML = '';

        // Preenche sempre 6 slots, mesmo que vazios
        for (let i = 0; i < 6; i++) {
            const poke = party[i];
            const slot = document.createElement('div');
            
            if (poke) {
                // Slot com Pokémon
                slot.className = "bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm relative group transition-all hover:border-primary/30";
                const hpPercent = (poke.hp / poke.maxHp) * 100;
                slot.innerHTML = `
                    <div class="h-40 bg-zinc-50 dark:bg-zinc-800/20 flex items-center justify-center p-4 relative overflow-hidden group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/40 transition-colors">
                        <img class="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" src="${poke.img}" alt="${poke.name}"/>
                    </div>
                    <div class="p-5">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SLOT 0${i + 1}</span>
                                <h3 class="text-xl font-black text-on-background leading-tight">${poke.name}</h3>
                            </div>
                            <button class="remove-from-party p-2 text-zinc-400 hover:text-primary transition-colors" data-id="${poke.id}">
                                <span class="material-symbols-outlined" translate="no">remove_circle</span>
                            </button>
                        </div>
                        <div class="space-y-3">
                            <div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                                <div class="h-full bg-primary" style="width: ${hpPercent}%"></div>
                            </div>
                            <div class="flex justify-between text-[10px] font-bold text-on-surface-variant">
                                <span>HP: ${poke.hp}/${poke.maxHp}</span>
                                <span class="text-primary">LVL ${poke.level}</span>
                            </div>
                        </div>
                    </div>
                `;
                slot.querySelector('.remove-from-party').addEventListener('click', () => {
                    DB.removeFromParty(poke.id);
                    renderParty();
                });
            } else {
                // Slot Vazio
                slot.className = "bg-surface-container-low/50 border-2 border-dashed border-outline-variant/20 rounded-2xl flex flex-col items-center justify-center p-8 min-h-[250px] transition-all hover:bg-surface-container-low";
                slot.innerHTML = `
                    <div class="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-4 text-zinc-300">
                        <span class="material-symbols-outlined text-2xl" translate="no">add_circle</span>
                    </div>
                    <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SLOT 0${i + 1} VAZIO</span>
                    <p class="text-[10px] text-zinc-400 mt-1">Adicione da Box</p>
                `;
            }
            partyContainer.appendChild(slot);
        }
    };

    /* --- FUNCIONALIDADE DE CAPTURA (POKEAPI) --- */
    const modal = document.getElementById('add-pokemon-modal');
    const addBtnSidebar = document.querySelector('aside button.bg-primary'); // O botão "Nova Captura" na sidebar
    const closeModalX = document.getElementById('close-modal-x');
    const saveBtn = document.getElementById('save-pokemon');
    const fetchBtn = document.getElementById('fetch-pokemon');
    const pokeNameInput = document.getElementById('poke-name');
    const previewImg = document.getElementById('preview-img');
    const previewPlaceholder = document.getElementById('preview-placeholder');

    const typeTranslations = {
        fire: 'Fogo', water: 'Água', grass: 'Grama', electric: 'Elétrico', 
        psychic: 'Psíquico', ice: 'Gelo', dragon: 'Dragão', dark: 'Sombrio',
        fairy: 'Fada', normal: 'Normal', fighting: 'Lutador', flying: 'Voador',
        poison: 'Veneno', ground: 'Terra', rock: 'Pedra', bug: 'Inseto',
        ghost: 'Fantasma', steel: 'Aço'
    };

    const fetchPokemon = async () => {
        const name = pokeNameInput.value.trim().toLowerCase();
        if (!name) return;

        fetchBtn.classList.add('animate-spin');
        previewPlaceholder.innerHTML = '<span class="material-symbols-outlined animate-spin" translate="no">sync</span>';

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            if (!response.ok) throw new Error('Not found');
            
            const data = await response.json();
            const officialName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            const officialImg = data.sprites.other['official-artwork'].front_default;
            const types = data.types.map(t => typeTranslations[t.type.name] || t.type.name).join(' / ');

            document.getElementById('poke-type').value = types;
            document.getElementById('poke-img').value = officialImg;
            
            previewImg.src = officialImg;
            previewImg.classList.remove('hidden');
            previewPlaceholder.classList.add('hidden');
        } catch (err) {
            alert('Pokémon não encontrado! Verifique o nome oficial em inglês.');
            previewPlaceholder.innerHTML = '<span class="material-symbols-outlined text-red-500" translate="no">error</span><p class="text-[10px] font-bold uppercase mt-1">Erro</p>';
        } finally {
            fetchBtn.classList.remove('animate-spin');
        }
    };

    if (fetchBtn) fetchBtn.addEventListener('click', fetchPokemon);
    if (addBtnSidebar) addBtnSidebar.addEventListener('click', () => modal.classList.remove('hidden'));
    if (closeModalX) closeModalX.addEventListener('click', () => modal.classList.add('hidden'));

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const name = pokeNameInput.value.trim();
            const level = parseInt(document.getElementById('poke-level').value) || 100;
            const type = document.getElementById('poke-type').value;
            const img = document.getElementById('poke-img').value;

            if (!name || !img) {
                alert('Por favor, busque um Pokémon oficial pelo nome primeiro!');
                return;
            }

            const newPoke = { name, level, type, img, hp: 100, maxHp: 100 };
            
            // Tenta adicionar à Party primeiro
            if (DB.addToParty(newPoke)) {
                DB.addActivity({ type: 'capture', pokemon: name, level: level, location: 'Captura Direta (Party)' });
                modal.classList.add('hidden');
                renderParty();
            } else {
                // Se o time estiver cheio, oferece salvar na Box
                if (confirm('Sua equipe está cheia (6/6)! Deseja enviar este Pokémon para o PC (Box)?')) {
                    DB.addPokemon(newPoke);
                    DB.addActivity({ type: 'capture', pokemon: name, level: level, location: 'Enviado para o PC (Box)' });
                    modal.classList.add('hidden');
                    renderBox();
                }
            }
        });
    }

    renderBox();
    renderParty();
});
