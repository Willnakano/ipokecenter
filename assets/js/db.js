/* 
   ==========================================================================
   BANCO DE DADOS LOCAL (LocalStorage)
   ==========================================================================
   Este arquivo gerencia todos os dados salvos no seu navegador:
   - Seu Perfil de Treinador
   - Seu Time (Party)
   - Suas Boxes de Pokémon
   - Histórico de Atividades
*/

const DB = {
    _defaultInventory: [
        { id: 1, name: 'Charizard', level: 88, type: 'Fogo', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' },
        { id: 150, name: 'Mewtwo', level: 100, type: 'Psíquico', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png' },
        { id: 2, name: 'Pikachu', level: 100, type: 'Elétrico', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
        { id: 3, name: 'Gengar', level: 74, type: 'Fantasma', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png' },
        { id: 4, name: 'Lapras', level: 52, type: 'Água', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png' },
        { id: 5, name: 'Dragonite', level: 91, type: 'Dragão', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png' },
        { id: 6, name: 'Snorlax', level: 82, type: 'Normal', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png' }
    ],

    /**
     * BUSCAR INVENTÁRIO (PC)
     * Obtém a lista de Pokémon armazenados nas boxes do jogador.
     */
    getInventory() {
        const stored = localStorage.getItem('pokesystem_inventory');
        if (stored) return JSON.parse(stored);
        return this._defaultInventory;
    },

    /**
     * SALVAR INVENTÁRIO (PC)
     * Persiste a lista completa de Pokémon das boxes no LocalStorage.
     */
    saveInventory(pokes) {
        localStorage.setItem('pokesystem_inventory', JSON.stringify(pokes));
    },

    /**
     * ADICIONAR NOVO POKÉMON AO PC
     * Insere um novo Pokémon no inventário com um ID único baseado no timestamp.
     */
    addPokemon(pokemon) {
        const pokes = this.getInventory();
        pokes.push({ ...pokemon, id: Date.now() });
        this.saveInventory(pokes);
    },

    /**
     * EXCLUIR POKÉMON DO PC
     * Remove um Pokémon das boxes através do seu ID.
     */
    deletePokemon(id) {
        const pokes = this.getInventory().filter(p => p.id !== id);
        this.saveInventory(pokes);
    },

    /**
     * OBTER CAPACIDADE DO PC
     * Retorna o limite máximo de Pokémon que as boxes podem armazenar.
     */
    getCapacity() {
        return parseInt(localStorage.getItem('pokesystem_capacity')) || 40;
    },

    /**
     * EXPANDIR CAPACIDADE DO PC
     * Aumenta o limite de armazenamento das boxes em +40 slots.
     */
    expandBox() {
        const newCap = this.getCapacity() + 40;
        localStorage.setItem('pokesystem_capacity', newCap);
    },

    /**
     * OBTER TIME ATUAL (PARTY)
     * Recupera os até 6 Pokémon que estão na equipe atual do treinador.
     */
    /**
     * Retorna a lista de pokémons na equipe (party) do usuário.
     */
    getParty: function () {
        const stored = localStorage.getItem('pokesystem_party');
        if (stored) return JSON.parse(stored);
        // Default party
        return [
            { id: 101, name: 'Charizard', level: 88, type: 'Fogo', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', hp: 354, maxHp: 354 },
            { id: 102, name: 'Blastoise', level: 68, type: 'Água', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png', hp: 380, maxHp: 402 },
            { id: 103, name: 'Venusaur', level: 70, type: 'Planta', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png', hp: 410, maxHp: 410 }
        ];
    },

    /**
     * SALVAR TIME (PARTY)
     * Salva a configuração atual da equipe de 6 Pokémon.
     */
    saveParty(party) {
        localStorage.setItem('pokesystem_party', JSON.stringify(party));
    },

    /**
     * ADICIONAR AO TIME
     * Tenta adicionar um Pokémon à equipe (máximo 6). Retorna true se houver sucesso.
     */
    addToParty(pokemon) {
        const party = this.getParty();
        if (party.length >= 6) return false;
        party.push({ ...pokemon, id: Date.now(), hp: pokemon.hp || 100, maxHp: pokemon.maxHp || 100 });
        this.saveParty(party);
        return true;
    },

    /**
     * REMOVER DO TIME
     * Retira um Pokémon da equipe ativa através do ID.
     */
    removeFromParty(id) {
        const party = this.getParty().filter(p => p.id !== id);
        this.saveParty(party);
    },

    /**
     * OBTER INSÍGNIAS
     * Recupera a lista de insígnias conquistadas pelo treinador.
     */
    getBadges() {
        const stored = localStorage.getItem('pokesystem_badges');
        if (stored) return JSON.parse(stored);
        // Default badges
        return [
            { id: 1, name: 'Boulder', city: 'Pewter City', icon: 'mountain_flag' },
            { id: 2, name: 'Cascade', city: 'Cerulean City', icon: 'water_drop' },
            { id: 3, name: 'Thunder', city: 'Vermilion City', icon: 'bolt' },
            { id: 4, name: 'Rainbow', city: 'Celadon City', icon: 'eco' },
            { id: 5, name: 'Soul', city: 'Fuchsia City', icon: 'skull' },
            { id: 6, name: 'Marsh', city: 'Saffron City', icon: 'psychology' },
            { id: 7, name: 'Volcano', city: 'Cinnabar Island', icon: 'local_fire_department' },
            { id: 8, name: 'Earth', city: 'Viridian City', icon: 'pentagon' }
        ];
    },

    /**
     * SALVAR INSÍGNIAS
     * Atualiza o estado das insígnias no LocalStorage.
     */
    saveBadges(badges) {
        localStorage.setItem('pokesystem_badges', JSON.stringify(badges));
    },

    /**
     * ADICIONAR INSÍGNIA
     * Registra a conquista de uma nova insígnia.
     */
    addBadge(badge) {
        const badges = this.getBadges();
        badges.push({ ...badge, id: Date.now() });
        this.saveBadges(badges);
    },

    /**
     * REMOVER INSÍGNIA
     * Remove uma insígnia da coleção (útil para resets ou depuração).
     */
    removeBadge(id) {
        const badges = this.getBadges().filter(b => b.id !== id);
        this.saveBadges(badges);
    },

    /**
     * BUSCAR CHAVE GEMINI
     * Obtém a chave de API do Google Gemini salva pelo usuário.
     */
    getGeminiApiKey() {
        return localStorage.getItem('pokesystem_gemini_key') || '';
    },

    /**
     * DEFINIR CHAVE GEMINI
     * Salva a chave de API do Google Gemini para uso no Professor AI.
     */
    setGeminiApiKey(key) {
        localStorage.setItem('pokesystem_gemini_key', key);
    },

    /**
     * ADICIONAR ATIVIDADE AO LOG
     * Registra uma nova ação no histórico de atividades (ex: capturas, mensagens).
     * Mantém apenas as 10 atividades mais recentes.
     */
    addActivity(activity) {
        const log = this.getActivityLog();
        const newActivity = {
            id: Date.now(),
            timestamp: new Date(),
            ...activity
        };
        log.unshift(newActivity);
        // Limita a 10 atividades
        localStorage.setItem('pokesystem_activity', JSON.stringify(log.slice(0, 10)));
    },

    /**
     * LIMPAR LOG DE ATIVIDADES
     * Remove todo o histórico de atividades registradas.
     */
    clearActivityLog() {
        localStorage.setItem('pokesystem_activity', '[]');
    },

    /**
     * OBTER LOG DE ATIVIDADES
     * Retorna o histórico de ações recentes ou dados de exemplo se estiver vazio.
     */
    getActivityLog() {
        const stored = localStorage.getItem('pokesystem_activity');
        if (stored) return JSON.parse(stored);

        // Atividades iniciais de exemplo
        const defaultLog = [
            { id: 1, type: 'capture', pokemon: 'Bulbasaur', level: 5, location: 'Viridian Forest', timestamp: new Date(Date.now() - 7200000) },
            { id: 2, type: 'message', from: 'Professor Carvalho', text: '"Venha ao laboratório, tenho uma nova atualização na Pokédex..."', timestamp: new Date(Date.now() - 18000000) },
            { id: 3, type: 'capture', pokemon: 'Magikarp', level: 12, location: 'Rota 4', timestamp: new Date(Date.now() - 43200000) }
        ];
        return defaultLog;
    },

    // --- MÉTODOS DE AUTENTICAÇÃO (MOCK) ---
    // AQUI É ONDE AS CREDENCIAIS SÃO GERENCIADAS
    /**
     * REGISTRAR NOVO TREINADOR
     * Cria uma nova conta no banco de dados local.
     */
    register(name, email, password) {
        // As contas criadas ficam salvas no seu navegador sob a chave 'pokesystem_users'
        const users = JSON.parse(localStorage.getItem('pokesystem_users') || '[]');

        // Verifica se o e-mail já existe na lista
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Este e-mail já está em uso.' };
        }

        // Adiciona o novo usuário na lista e salva no LocalStorage (Banco de dados do navegador)
        users.push({ name, email, password });
        localStorage.setItem('pokesystem_users', JSON.stringify(users));
        return { success: true };
    },

    /**
     * EFETUAR LOGIN
     * Autentica o treinador usando e-mail e senha, ou via credenciais padrão do sistema.
     */
    login(email, password) {
        // Busca a lista de usuários que você cadastrou no 'pokesystem_users'
        const users = JSON.parse(localStorage.getItem('pokesystem_users') || '[]');

        // Tenta encontrar um usuário que coincida com e-mail E senha
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Se encontrar, salva quem está logado no momento para as outras telas saberem
            localStorage.setItem('pokesystem_logged_user', JSON.stringify(user));
            return { success: true };
        }

        // --- CREDENCIAIS PADRÃO (ACESSÍVEIS SEM REGISTRO) ---
        // Estes e-mails abaixo sempre funcionam com qualquer senha:
        if (email === 'admin@pokesystem.com' || email === 'nakano@elitefour.com') {
            const defaultUser = { name: 'Nakano', email: email, role: 'ELITE FOUR' };
            localStorage.setItem('pokesystem_logged_user', JSON.stringify(defaultUser));
            return { success: true };
        }

        return { success: false, message: 'E-mail ou senha incorretos.' };
    },

    /**
     * EFETUAR LOGOUT
     * Encerra a sessão atual e redireciona para a tela de login.
     */
    logout() {
        localStorage.removeItem('pokesystem_logged_user');
        window.location.href = '3-Login.html';
    },

    /**
     * BUSCAR TREINADOR LOGADO
     * Obtém os dados do usuário atualmente autenticado.
     */
    getCurrentUser() {
        const stored = localStorage.getItem('pokesystem_logged_user');
        if (stored) return JSON.parse(stored);
        return { name: 'Nakano', role: 'ELITE FOUR' };
    },

    /**
     * BUSCAR OUTROS TREINADORES (LIGA)
     * Retorna u    /**
     * Retorna a lista de outros treinadores do LocalStorage.
     * Se não houver, retorna a lista padrão.
     */
    /**
     * Retorna a lista de outros treinadores do LocalStorage.
     * Se não houver, retorna a lista padrão.
     */
    getOtherTrainers: function() {
        // --- CONFIGURAÇÃO MANUAL DE TREINADORES PADRÃO ---
        // Você pode editar os links abaixo (avatar) para usar suas fotos locais (Ex: 'assets/images/red.jpg')
        const defaultTrainers = [
            {
                id: 'trainer-red',
                name: 'Red',
                title: 'CAMPEÃO LENDÁRIO',
                /* [FOTO LOCAL] Edite aqui -> */ avatar: 'https://images.unsplash.com/photo-1623910359263-d308d13bb222?q=80&w=200&h=200&auto=format&fit=crop',
                bio: 'O treinador que derrotou a Equipe Rocket e se tornou o Campeão de Kanto. Fala pouco, batalhas muito.',
                stats: { wins: 450, losses: 12, draws: 5 },
                party: [
                    { name: 'Pikachu', level: 100, type: 'Elétrico', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
                    { name: 'Charizard', level: 95, type: 'Fogo', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' },
                    { name: 'Blastoise', level: 92, type: 'Água', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png' },
                    { name: 'Venusaur', level: 92, type: 'Planta', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png' }
                ],
                matches: [
                    { opponent: 'Blue', result: 'Vitória', score: '3-0', date: '20/10/2026' },
                    { opponent: 'Lance', result: 'Vitória', score: '6-5', date: '15/10/2026' }
                ]
            },
            {
                id: 'trainer-cynthia',
                name: 'Cynthia',
                title: 'CAMPEÃ DE SINNOH',
                /* [FOTO LOCAL] Edite aqui -> */ avatar: 'https://images.unsplash.com/photo-1632360589886-f13961f67f66?q=80&w=200&h=200&auto=format&fit=crop',
                bio: 'Interessada em história e mitologia Pokémon. É conhecida por ser uma das treinadoras mais desafiadoras da Liga.',
                stats: { wins: 380, losses: 45, draws: 12 },
                party: [
                    { name: 'Garchomp', level: 98, type: 'Dragão/Terra', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png' },
                    { name: 'Lucario', level: 94, type: 'Lutador/Aço', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png' }
                ],
                matches: [
                    { opponent: 'Diantha', result: 'Vitória', score: '6-4', date: '25/09/2026' },
                    { opponent: 'Red', result: 'Derrota', score: '1-3', date: '10/09/2026' }
                ]
            }
        ];

        const stored = localStorage.getItem('pokesystem_other_trainers');
        if (stored) {
            let trainers = JSON.parse(stored);
            
            // --- SINCRONIZAÇÃO AUTOMÁTICA ---
            // Se você mudar a foto no código acima, ele atualiza o LocalStorage aqui
            let modified = false;
            defaultTrainers.forEach(def => {
                const index = trainers.findIndex(t => t.id === def.id);
                if (index !== -1 && trainers[index].avatar !== def.avatar) {
                    trainers[index].avatar = def.avatar;
                    modified = true;
                }
            });
            
            if (modified) {
                this.saveOtherTrainers(trainers);
            }
            return trainers;
        }
        
        this.saveOtherTrainers(defaultTrainers);
        return defaultTrainers;
    },

    /**
     * SALVAR LISTA DE TREINADORES
     */
    saveOtherTrainers: function(trainers) {
        localStorage.setItem('pokesystem_other_trainers', JSON.stringify(trainers));
    },

    /**
     * ATUALIZAR EQUIPE DE UM TREINADOR ESPECÍFICO
     */
    updateTrainerParty: function(trainerId, pokemon, mode = 'add') {
        let trainers = this.getOtherTrainers();
        const trainerIndex = trainers.findIndex(t => t.id === trainerId);
        
        if (trainerIndex === -1) return false;

        if (mode === 'add') {
            if (trainers[trainerIndex].party.length >= 6) return false;
            trainers[trainerIndex].party.push(pokemon);
        } else {
            trainers[trainerIndex].party = trainers[trainerIndex].party.filter(p => p.name !== pokemon.name);
        }

        this.saveOtherTrainers(trainers);
        return true;
    },

    /**
     * ADICIONAR NOVO TREINADOR À LIGA
     */
    addOtherTrainer: function(trainerData) {
        let trainers = this.getOtherTrainers();
        const newTrainer = {
            id: 'trainer-' + Date.now(),
            name: trainerData.name || 'Treinador Misterioso',
            title: trainerData.title || 'DESAFIANTE',
            avatar: trainerData.avatar || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
            bio: trainerData.bio || 'Um novo treinador em busca de glória na Liga iPokeCenter.',
            stats: { wins: 0, losses: 0, draws: 0 },
            party: [],
            matches: []
        };
        
        trainers.push(newTrainer);
        this.saveOtherTrainers(trainers);
        return newTrainer;
    },

    /**
     * ATUALIZAR ESTATÍSTICAS DE UM TREINADOR
     */
    updateOtherTrainerStats: function(trainerId, wins, losses) {
        let trainers = this.getOtherTrainers();
        const index = trainers.findIndex(t => t.id === trainerId);
        if (index === -1) return false;

        trainers[index].stats.wins = parseInt(wins) || 0;
        trainers[index].stats.losses = parseInt(losses) || 0;

        this.saveOtherTrainers(trainers);
        return true;
    },

    // Função para garantir que os dados iniciais existam no LocalStorage
    /**
     * INICIALIZAR BANCO DE DADOS
     * Garante que todas as tabelas (chaves do LocalStorage) existam com dados iniciais ou padrões.
     */
    init() {
        if (!localStorage.getItem('pokesystem_inventory')) this.saveInventory(this._defaultInventory);
        if (!localStorage.getItem('pokesystem_party')) this.saveParty(this.getParty());
        if (!localStorage.getItem('pokesystem_badges')) this.saveBadges(this.getBadges());
        if (!localStorage.getItem('pokesystem_capacity')) localStorage.setItem('pokesystem_capacity', '40');
        if (!localStorage.getItem('pokesystem_activity')) localStorage.setItem('pokesystem_activity', JSON.stringify(this.getActivityLog()));
        if (!localStorage.getItem('pokesystem_other_trainers')) this.getOtherTrainers(); 
        console.log('iPokeCenter DB Initialized: Persistência Ativa.');
    }
};

// Auto-inicializar ao carregar o script
DB.init();

