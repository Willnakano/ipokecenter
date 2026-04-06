/* 
   CONFIGURAÇÃO DO TAILWIND (BOX POKÉMON)
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
                
                // Outras cores do sistema
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
    /* --- LÓGICA DO TEMA --- */
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

    /* --- LÓGICA DA BOX (INVENTÁRIO) --- */
    const pokemonContainer = document.getElementById('pokemon-container');
    const addBtn = document.getElementById('add-pokemon-btn');
    const modal = document.getElementById('add-pokemon-modal');
    const closeModalX = document.getElementById('close-modal-x');
    const saveBtn = document.getElementById('save-pokemon');
    const fetchBtn = document.getElementById('fetch-pokemon');
    const pokeNameInput = document.getElementById('poke-name');
    const previewImg = document.getElementById('preview-img');
    const previewPlaceholder = document.getElementById('preview-placeholder');

    // Traduções para exibição amigável dos tipos
    const typeTranslations = {
        fire: 'Fogo', water: 'Água', grass: 'Grama', electric: 'Elétrico', 
        psychic: 'Psíquico', ice: 'Gelo', dragon: 'Dragão', dark: 'Sombrio',
        fairy: 'Fada', normal: 'Normal', fighting: 'Lutador', flying: 'Voador',
        poison: 'Veneno', ground: 'Terra', rock: 'Pedra', bug: 'Inseto',
        ghost: 'Fantasma', steel: 'Aço'
    };

    // Função para buscar dados da PokeAPI (Inglês para API -> Português para UI)
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
    if (pokeNameInput) pokeNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') fetchPokemon();
    });

    // Renderiza todos os cartões de Pokémon na tela
    const renderBox = () => {
        if (!pokemonContainer) return;
        const pokes = DB.getInventory();
        const capacity = DB.getCapacity();
        const count = pokes.length;
        
        const countText = document.getElementById('box-count-text');
        const percentText = document.getElementById('box-percent');
        if (countText) countText.innerText = `${count}/${capacity}`;
        if (percentText) {
            const remaining = Math.max(0, capacity - count);
            const percent = Math.floor((remaining / capacity) * 100);
            percentText.innerText = `${percent}% restantes`;
        }

        pokemonContainer.innerHTML = '';
        
        pokes.forEach(poke => {
            const card = document.createElement('div');
            // Estilo do Card individual
            card.className = "group relative bg-surface-container-low dark:bg-zinc-800/50 hover:bg-surface-container-lowest dark:hover:bg-zinc-800 transition-all duration-300 rounded-xl overflow-hidden shadow-none hover:shadow-xl hover:shadow-black/[0.03] cursor-grab active:cursor-grabbing";
            card.innerHTML = `
                <div class="p-4 space-y-4">
                    <div class="flex justify-between items-start">
                        <div class="flex items-center gap-3">
                            <div class="w-5 h-5 rounded-full border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 group-hover:border-primary dark:group-hover:border-red-500 transition-all cursor-pointer shadow-inner"></div>
                            <span class="text-[10px] font-black tracking-tighter text-on-surface-variant/40 dark:text-zinc-500">#${poke.id.toString().slice(-3)}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button class="delete-poke p-1 text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100" data-id="${poke.id}">
                                <span class="material-symbols-outlined text-sm" translate="no">delete</span>
                            </button>
                            <span class="px-2 py-0.5 bg-primary/10 text-primary dark:bg-primary/20 dark:text-red-400 text-[10px] font-bold rounded-full">Lv. ${poke.level}</span>
                        </div>
                    </div>
                    <div class="flex flex-col items-center py-2 transition-transform duration-300 group-hover:-translate-y-2">
                        <img src="${poke.img}" alt="${poke.name}" class="w-24 h-24 object-contain drop-shadow-2xl">
                        <h3 class="mt-4 text-lg font-bold tracking-tight text-on-surface dark:text-white">${poke.name}</h3>
                        <div class="flex gap-2 mt-1">
                            <span class="px-2.5 py-1 rounded-full bg-primary/10 text-primary dark:bg-red-900/40 dark:text-red-300 text-[10px] font-bold uppercase tracking-wider">${poke.type}</span>
                        </div>
                    </div>
                </div>
            `;
            
            card.querySelector('.delete-poke').addEventListener('click', (e) => {
                e.stopPropagation();
                if(confirm(`Excluir ${poke.name}?`)) {
                    DB.deletePokemon(poke.id);
                    renderBox();
                }
            });

            pokemonContainer.appendChild(card);
        });

        /* --- ARRASTAR E SOLTAR (Sortable) --- */
        if (typeof Sortable !== 'undefined') {
            new Sortable(pokemonContainer, {
                animation: 250,
                ghostClass: 'opacity-40',
                chosenClass: 'shadow-2xl',
                dragClass: 'scale-105',
                filter: '.add-slot, .expand-slot',
                onMove: (evt) => {
                    return !evt.related.className.includes('add-slot') && !evt.related.className.includes('expand-slot');
                }
            });
        }

        /* --- SLOTS DE ADICIONAR E EXPANDIR --- */
        if (count < capacity) {
            const addSlot = document.createElement('div');
            addSlot.className = "add-slot group relative bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-primary dark:hover:border-red-500 transition-all duration-300 rounded-xl flex items-center justify-center p-8 cursor-pointer min-h-[200px]";
            addSlot.innerHTML = `
                <div class="text-center">
                    <div class="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all mx-auto shadow-inner">
                        <span class="material-symbols-outlined text-2xl" translate="no">add</span>
                    </div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-primary transition-colors">Nova Captura</p>
                </div>
            `;
            addSlot.addEventListener('click', () => {
                pokeNameInput.value = '';
                document.getElementById('poke-type').value = '';
                document.getElementById('poke-img').value = '';
                previewImg.classList.add('hidden');
                previewPlaceholder.classList.remove('hidden');
                previewPlaceholder.innerHTML = '<span class="material-symbols-outlined text-3xl" translate="no">image_search</span><p class="text-[10px] font-bold uppercase mt-1">Aguardando Nome...</p>';
                modal.classList.remove('hidden');
            });
            pokemonContainer.appendChild(addSlot);
        } else {
            const expandSlot = document.createElement('div');
            expandSlot.className = "expand-slot group relative bg-primary/10 border-2 border-dashed border-primary/30 hover:border-primary transition-all duration-300 rounded-xl flex items-center justify-center p-8 cursor-pointer min-h-[200px]";
            expandSlot.innerHTML = `
                <div class="text-center">
                    <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-all mx-auto shadow-lg">
                        <span class="material-symbols-outlined text-2xl" translate="no">add_box</span>
                    </div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-primary">Liberar +40 Slots</p>
                </div>
            `;
            expandSlot.addEventListener('click', () => {
                DB.expandBox();
                renderBox();
            });
            pokemonContainer.appendChild(expandSlot);
        }
    };

    if (addBtn) addBtn.addEventListener('click', () => {
         pokeNameInput.value = '';
         modal.classList.remove('hidden');
    });
    if (closeModalX) closeModalX.addEventListener('click', () => modal.classList.add('hidden'));

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const name = pokeNameInput.value.trim();
            const level = document.getElementById('poke-level').value || 100;
            const type = document.getElementById('poke-type').value;
            const img = document.getElementById('poke-img').value;

            if (!name || !img) {
                alert('Por favor, busque um Pokémon oficial pelo nome primeiro!');
                return;
            }

            DB.addPokemon({ name, level, type, img });
            DB.addActivity({
                type: 'capture',
                pokemon: name,
                level: level,
                location: 'Capture via PokeCenter'
            });
            
            modal.classList.add('hidden');
            renderBox();
        });
    }

    renderBox();
});
