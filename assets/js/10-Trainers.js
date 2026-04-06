/**
 * LÓGICA DA PÁGINA DE TREINADORES (10-Trainers.js)
 * Gerencia a lista de perfis, estatísticas e parties de outros treinadores.
 */

tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#b22200",
                "surface": "#fcf9f8",
                "on-surface": "#1b1c1c",
                "surface-container-low": "#f6f3f2",
                "surface-container": "#f0eded",
                "surface-container-high": "#eae7e7",
                "surface-container-highest": "#e5e2e1",
                "surface-container-lowest": "#ffffff",
                "outline-variant": "#e6bdb5"
            }
        },
    },
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialização do Tema (Padrão)
    const enableDark = () => { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); };
    const disableDark = () => { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); };
    
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        enableDark();
    }

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

    // 2. Carregar Dados dos Treinadores
    if (typeof DB === 'undefined') {
        console.error('Banco de Dados (db.js) não encontrado!');
        return;
    }

    let trainers = DB.getOtherTrainers();
    let selectedTrainerId = null;
    const trainerList = document.getElementById('trainer-list');
    const profileView = document.getElementById('profile-view');

    /* --- LÓGICA DE SELEÇÃO INICIAL (PARA ITENS ESTÁTICOS) --- */
    const attachStaticListeners = () => {
        document.querySelectorAll('.trainer-static-item').forEach(item => {
            item.onclick = () => selectTrainer(item.dataset.id);
        });
    };

    /* --- LOGICA DE MODAL E BUSCA (POKEAPI) --- */
    const modal = document.getElementById('add-trainer-pokemon-modal');
    // ... resto dos seletores de modal ...
    const closeModalBtn = document.getElementById('close-trainer-modal');
    const fetchBtn = document.getElementById('fetch-trainer-pokemon');
    const saveBtn = document.getElementById('save-trainer-pokemon');
    const nameInput = document.getElementById('trainer-poke-name');
    const previewImg = document.getElementById('trainer-preview-img');
    const previewPlaceholder = document.getElementById('trainer-preview-placeholder');

    const typeTranslations = {
        fire: 'Fogo', water: 'Água', grass: 'Grama', electric: 'Elétrico', 
        psychic: 'Psíquico', ice: 'Gelo', dragon: 'Dragão', dark: 'Sombrio',
        fairy: 'Fada', normal: 'Normal', fighting: 'Lutador', flying: 'Voador',
        poison: 'Veneno', ground: 'Terra', rock: 'Pedra', bug: 'Inseto',
        ghost: 'Fantasma', steel: 'Aço'
    };

    const fetchPokemon = async () => {
        const name = nameInput.value.trim().toLowerCase();
        if (!name) return;

        fetchBtn.classList.add('animate-spin');
        previewPlaceholder.innerHTML = '<span class="material-symbols-outlined animate-spin" translate="no">sync</span>';

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            if (!response.ok) throw new Error('Not found');
            
            const data = await response.json();
            const officialImg = data.sprites.other['official-artwork'].front_default;
            const types = data.types.map(t => typeTranslations[t.type.name] || t.type.name).join(' / ');

            document.getElementById('trainer-poke-type').value = types;
            document.getElementById('trainer-poke-img').value = officialImg;
            
            previewImg.src = officialImg;
            previewImg.classList.remove('hidden');
            previewPlaceholder.classList.add('hidden');
        } catch (err) {
            alert('Pokémon não encontrado!');
            previewPlaceholder.innerHTML = '<span class="material-symbols-outlined text-red-500" translate="no">error</span>';
        } finally {
            fetchBtn.classList.remove('animate-spin');
        }
    };

    if (fetchBtn) fetchBtn.addEventListener('click', fetchPokemon);
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const type = document.getElementById('trainer-poke-type').value;
            const img = document.getElementById('trainer-poke-img').value;

            if (!name || !img || !selectedTrainerId) return;

            // Gera um nível aleatório entre 60 e 100 para dar variedade
            const randomLevel = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
            const newPoke = { name, level: randomLevel, type, img };
            
            if (DB.updateTrainerParty(selectedTrainerId, newPoke, 'add')) {
                trainers = DB.getOtherTrainers(); // Recarrega
                modal.classList.add('hidden');
                selectTrainer(selectedTrainerId, false); // Atualiza view sem animação
            } else {
                alert('A equipe do treinador está cheia (máx 6)!');
            }
        });
    }

    const renderTrainerList = () => {
        // Limpa apenas o que não for estático
        const dynamicItems = trainerList.querySelectorAll('.trainer-dynamic-item');
        dynamicItems.forEach(item => item.remove());

        trainers.forEach(trainer => {
            // Pula se já existir no HTML como estático
            if (document.querySelector(`.trainer-static-item[data-id="${trainer.id}"]`)) return;

            const item = document.createElement('div');
            item.className = "trainer-dynamic-item p-4 flex items-center gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all border-l-4 border-transparent";
            item.dataset.id = trainer.id;
            
            item.innerHTML = `
                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 shadow-sm">
                    <img src="${trainer.avatar}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 overflow-hidden">
                    <h4 class="text-sm font-bold truncate dark:text-white">${trainer.name}</h4>
                    <p class="text-[9px] font-black tracking-widest text-zinc-400 uppercase">${trainer.title}</p>
                </div>
                <div class="text-right">
                    <span class="text-[9px] font-bold text-emerald-600 block">${trainer.stats.wins}V</span>
                </div>
            `;

            item.onclick = () => selectTrainer(trainer.id);
            trainerList.appendChild(item);
        });
    };

    const selectTrainer = (id, animate = true) => {
        const trainer = trainers.find(t => t.id === id);
        if (!trainer) return;
        selectedTrainerId = id;

        // Atualizar estilos na lista
        document.querySelectorAll('#trainer-list > div').forEach(el => {
            if (el.dataset.id === id) {
                el.classList.add('bg-zinc-50', 'dark:bg-zinc-800', 'border-primary');
            } else {
                el.classList.remove('bg-zinc-50', 'dark:bg-zinc-800', 'border-primary');
            }
        });

        const updateUI = () => {
            // --- PEGAR FOTO DO HTML SE FOR ESTÁTICO ---
            const staticItem = document.querySelector(`.trainer-static-item[data-id="${id}"]`);
            const avatarToUse = staticItem ? staticItem.querySelector('img').src : trainer.avatar;

            // Atualizar Perfil
            document.getElementById('profile-avatar').src = avatarToUse;
            document.getElementById('profile-name').innerText = trainer.name;
            document.getElementById('profile-title').innerText = trainer.title;
            document.getElementById('profile-bio').innerText = trainer.bio;
            
            // Atualizar Stats
            document.getElementById('stat-wins').innerText = trainer.stats.wins;
            document.getElementById('stat-losses').innerText = trainer.stats.losses;
            const total = trainer.stats.wins + trainer.stats.losses;
            const rate = total > 0 ? Math.round((trainer.stats.wins / total) * 100) : 0;
            document.getElementById('stat-rate').innerText = `${rate}%`;

            // Atualizar Party
            const partyGrid = document.getElementById('trainer-party-grid');
            partyGrid.innerHTML = '';
            
            trainer.party.forEach(poke => {
                const card = document.createElement('div');
                card.className = "bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center gap-2 group relative hover:-translate-y-1 transition-all";
                card.innerHTML = `
                    <button class="remove-btn absolute top-2 right-2 p-1 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                        <span class="material-symbols-outlined text-[14px]" translate="no">close</span>
                    </button>
                    <div class="w-20 h-20 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center p-3 group-hover:scale-105 transition-transform">
                        <img src="${poke.img}" class="w-full h-full object-contain drop-shadow-md" alt="${poke.name}">
                    </div>
                    <div class="text-center">
                        <p class="text-[10px] font-black uppercase tracking-tighter dark:text-white">${poke.name}</p>
                        <p class="text-[8px] font-bold text-zinc-400">Nív ${poke.level}</p>
                    </div>
                `;
                
                card.querySelector('.remove-btn').onclick = (e) => {
                    e.stopPropagation();
                    if(confirm(`Remover ${poke.name} do time de ${trainer.name}?`)) {
                        DB.updateTrainerParty(id, poke, 'remove');
                        trainers = DB.getOtherTrainers();
                        selectTrainer(id, false);
                    }
                };

                partyGrid.appendChild(card);
            });

            if (trainer.party.length < 6) {
                const addBtn = document.createElement('button');
                addBtn.className = "bg-zinc-100 dark:bg-zinc-800/30 border-2 border-dashed border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-zinc-50 transition-all group min-h-[160px]";
                addBtn.innerHTML = `
                    <div class="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <span class="material-symbols-outlined text-sm" translate="no">add</span>
                    </div>
                    <span class="text-[9px] font-black uppercase text-zinc-400">Adicionar</span>
                `;
                addBtn.onclick = () => {
                    nameInput.value = '';
                    previewImg.classList.add('hidden');
                    previewPlaceholder.classList.remove('hidden');
                    modal.classList.remove('hidden');
                };
                partyGrid.appendChild(addBtn);
            }

            const historyBody = document.getElementById('match-history-rows');
            historyBody.innerHTML = '';
            trainer.matches.forEach(match => {
                const row = document.createElement('tr');
                row.className = "hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors";
                const resultColor = match.result === 'Vitória' ? 'text-emerald-600' : match.result === 'Derrota' ? 'text-red-600' : 'text-blue-600';
                row.innerHTML = `
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <span class="material-symbols-outlined text-sm text-zinc-400" translate="no">person</span>
                            </div>
                            <span class="text-xs font-bold dark:text-zinc-300">${match.opponent}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="text-xs font-black uppercase tracking-widest ${resultColor}">${match.result}</span>
                    </td>
                    <td class="px-6 py-4 text-xs font-mono font-bold dark:text-zinc-500">${match.score}</td>
                    <td class="px-6 py-4 text-xs font-medium text-zinc-400">${match.date}</td>
                `;
                historyBody.appendChild(row);
            });
        };

        if (animate) {
            profileView.classList.add('opacity-0', 'translate-y-4');
            setTimeout(() => {
                updateUI();
                profileView.classList.remove('opacity-0', 'translate-y-4');
            }, 300);
        } else {
            updateUI();
        }
    };

    /* --- LOGICA DE NOVO TREINADOR --- */
    const newTrainerModal = document.getElementById('new-trainer-modal');
    const btnAddTrainer = document.getElementById('btn-add-trainer');
    const btnCloseNewTrainer = document.getElementById('close-new-trainer-modal');
    const btnSaveNewTrainer = document.getElementById('save-new-trainer');
    const newTrainerAvatarInput = document.getElementById('new-trainer-avatar');
    const newTrainerPreview = document.getElementById('new-trainer-preview');

    if (btnAddTrainer) {
        btnAddTrainer.onclick = () => {
            newTrainerModal.classList.remove('hidden');
            document.getElementById('new-trainer-name').value = '';
            document.getElementById('new-trainer-title').value = '';
            document.getElementById('new-trainer-avatar').value = '';
            document.getElementById('new-trainer-bio').value = '';
            newTrainerPreview.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
        };
    }

    if (btnCloseNewTrainer) btnCloseNewTrainer.onclick = () => newTrainerModal.classList.add('hidden');

    if (newTrainerAvatarInput) {
        newTrainerAvatarInput.oninput = (e) => {
            const url = e.target.value.trim();
            newTrainerPreview.src = url || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
        };
    }

    if (btnSaveNewTrainer) {
        btnSaveNewTrainer.onclick = () => {
            const trainerData = {
                name: document.getElementById('new-trainer-name').value.trim(),
                title: document.getElementById('new-trainer-title').value.trim(),
                avatar: document.getElementById('new-trainer-avatar').value.trim(),
                bio: document.getElementById('new-trainer-bio').value.trim()
            };

            if (!trainerData.name) {
                alert('O nome do jogador é obrigatório!');
                return;
            }

            const newTrainer = DB.addOtherTrainer(trainerData);
            if (newTrainer) {
                trainers = DB.getOtherTrainers();
                renderTrainerList();
                newTrainerModal.classList.add('hidden');
                selectTrainer(newTrainer.id);
            }
        };
    }

    /* --- LOGICA DE ESTATÍSTICAS EDITÁVEIS --- */
    const statWins = document.getElementById('stat-wins');
    const statLosses = document.getElementById('stat-losses');

    const handleStatEdit = () => {
        if (!selectedTrainerId) return;

        const wins = parseInt(statWins.innerText) || 0;
        const losses = parseInt(statLosses.innerText) || 0;

        // Salvar no DB
        if (DB.updateOtherTrainerStats(selectedTrainerId, wins, losses)) {
            trainers = DB.getOtherTrainers(); // Recarrega
            
            // Recalcula Win Rate na tela
            const total = wins + losses;
            const rate = total > 0 ? Math.round((wins / total) * 100) : 0;
            document.getElementById('stat-rate').innerText = `${rate}%`;

            // Atualiza o contador na lista lateral
            const listCard = document.querySelector(`.trainer-static-item[data-id="${selectedTrainerId}"], .trainer-dynamic-item[data-id="${selectedTrainerId}"]`);
            if (listCard) {
                const winCounter = listCard.querySelector('.text-emerald-600');
                if (winCounter) winCounter.innerText = `${wins}V`;
            }
        }
    };

    if (statWins && statLosses) {
        [statWins, statLosses].forEach(el => {
            el.addEventListener('blur', handleStatEdit);
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    el.blur();
                }
            });
        });
    }

    // Inicialização
    attachStaticListeners();
    renderTrainerList();
    if (trainers.length > 0) selectTrainer(trainers[0].id);
});
