/**
 * iPokeCenter - Hub de Inteligência Artificial (Gemini API)
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

    const chatHistory = document.getElementById('chat-history');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const configBtn = document.getElementById('config-api-btn');
    const apiModal = document.getElementById('api-modal');
    const closeApiModal = document.getElementById('close-api-modal');
    const saveApiKeyBtn = document.getElementById('save-api-key');
    const apiKeyInput = document.getElementById('api-key-input');

    // Funções de Modal
    const openModal = () => {
        apiKeyInput.value = DB.getGeminiApiKey() || '';
        apiModal.classList.remove('hidden');
    };

    if (configBtn) configBtn.addEventListener('click', openModal);
    const configBtnTop = document.getElementById('config-api-btn-top');
    if (configBtnTop) configBtnTop.addEventListener('click', openModal);

    if (closeApiModal) closeApiModal.addEventListener('click', () => {
        apiModal.classList.add('hidden');
    });

    if (saveApiKeyBtn) saveApiKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            DB.setGeminiApiKey(key);
            alert('Configuração salva com sucesso!');
            apiModal.classList.add('hidden');
        }
    });

    // Funções de Chat
    const appendMessage = (role, text) => {
        const msgDiv = document.createElement('div');
        const isUser = role === 'user';
        
        msgDiv.className = `flex gap-4 items-start ${isUser ? 'flex-row-reverse animate-in slide-in-from-right' : 'animate-in slide-in-from-left'} duration-500`;
        
        const avatar = isUser ? 
            `<div class="h-10 w-10 shrink-0 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 overflow-hidden shadow-sm">
                <img class="w-full h-full object-cover" src="assets/images/Nakano.jpg">
            </div>` :
            `<div class="h-12 w-12 shrink-0 rounded-2xl overflow-hidden shadow-lg border-2 border-primary/20">
                <img src="assets/images/professor_oak.jpg" class="w-full h-full object-cover">
            </div>`;

        const contentClass = isUser ? 
            'bg-zinc-900 text-white p-4 px-6 rounded-[2rem] rounded-tr-none shadow-xl max-w-[85%] font-bold text-sm' : 
            'p-6 bg-white dark:bg-zinc-800 rounded-[2rem] rounded-tl-none border border-zinc-100 dark:border-zinc-700 shadow-sm leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-[90%] font-medium text-sm';

        msgDiv.innerHTML = `
            ${avatar}
            <div class="flex-1 ${isUser ? 'flex justify-end' : ''}">
                <div class="${contentClass}">
                    <p class="whitespace-pre-wrap">${text}</p>
                </div>
            </div>
        `;
        
        chatHistory.appendChild(msgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    const askGemini = async (prompt) => {
        const key = DB.getGeminiApiKey();
        const lowerPrompt = prompt.toLowerCase();
        
        // Add Loading bubble
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.className = "flex gap-4 items-start animate-pulse";
        loadingDiv.innerHTML = `
            <div class="h-10 w-10 shrink-0 rounded-full bg-primary-container/20 flex items-center justify-center text-primary/40">
                <span class="material-symbols-outlined animate-spin" translate="no">sync</span>
            </div>
            <div class="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-none italic text-zinc-400 text-sm">
                Professor está analisando sua pergunta...
            </div>
        `;
        chatHistory.appendChild(loadingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // SE NÃO TIVER KEY, USA O PROFESSOR ONLINE (POLLINATIONS AI - 100% GRÁTIS)
        if (!key) {
            try {
                const systemPrompt = "Aja como o Professor Pokémon do iPokeCenter. Responda em Português do Brasil. Seja extremamente CURTO, DIRETO AO PONTO e sem enrolação. ";
                const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(systemPrompt + prompt)}`);
                const text = await response.text();
                
                const loadingEl = document.getElementById(loadingId);
                if (loadingEl) loadingEl.remove();
                
                appendMessage('ai', `💡 **[Professor Online]**\n\n${text}`);
                return;
            } catch (error) {
                console.error("Pollinations AI error:", error);
                const loadingEl = document.getElementById(loadingId);
                if (loadingEl) loadingEl.remove();
                appendMessage('ai', "💡 **[Professor Offline]**\n\nDesculpe, Treinador. Estou com problemas de conexão. Tente novamente ou adicione uma Gemini Key.");
                return;
            }
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `Aja como o Professor do iPokeCenter. Responda sempre em Português do Brasil. Seja extremamente CURTO, DIRETO AO PONTO e sem enrolação. Pergunta do Treinador: ${prompt}` }]
                    }]
                })
            });

            const data = await response.json();
            const loadingEl = document.getElementById(loadingId);
            if (loadingEl) loadingEl.remove();

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                appendMessage('ai', aiResponse);
            } else {
                throw new Error('Resposta inválida da API');
            }

        } catch (error) {
            console.error(error);
            const loadingEl = document.getElementById(loadingId);
            if (loadingEl) loadingEl.remove();
            appendMessage('ai', 'Desculpe, Treinador. Tive um problema técnico ao acessar a Pokédex Global (Gemini). Verifique sua API Key ou tente novamente em instantes.');
        }
    };

    const handleSend = () => {
        const text = chatInput.value.trim();
        if (!text) return;
        
        appendMessage('user', text);
        chatInput.value = '';
        askGemini(text);
    };

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (chatInput) chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Sidebar Suggestions
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.innerText.replace(/"/g, '').trim();
            chatInput.value = text;
            handleSend();
        });
    });
});
