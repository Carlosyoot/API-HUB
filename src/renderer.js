// src/renderer.js - VERSÃO ATUALIZADA E COMPLETA

window.addEventListener('DOMContentLoaded', () => {
    // --- 1. Seleção dos Elementos do DOM ---
    // Pegamos todos os elementos que vamos manipular para fácil acesso.
    const sidebarModels = document.querySelectorAll('.model-list li');
    const messagesContainer = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    
    let currentModel = 'voors'; // Guarda o modelo que está ativo no momento.

    // --- 2. Funções de Exibição de Mensagens ---

    /**
     * Função para rolar o chat para a última mensagem.
     * É uma boa prática para garantir que a mensagem mais recente esteja sempre visível.
     */
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Exibe uma mensagem do BOT na tela.
     * @param {string} htmlMessage - A mensagem a ser exibida, pode conter HTML.
     */
    function displayBotMessage(htmlMessage) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('bot-message');
        messageElement.innerHTML = htmlMessage;
        messagesContainer.appendChild(messageElement);
        scrollToBottom(); // Rola para o final após adicionar a mensagem.
    }

    /**
     * Exibe uma mensagem do USUÁRIO na tela.
     * @param {string} textMessage - A mensagem de texto a ser exibida.
     */
    function displayUserMessage(textMessage) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('user-message');
        messageElement.textContent = textMessage; // Usamos textContent para segurança.
        messagesContainer.appendChild(messageElement);
        scrollToBottom(); // Rola para o final.
    }

    // --- 3. Lógica do Chat ---

    /**
     * Carrega a introdução do bot baseada no modelo selecionado.
     * @param {string} modelName - O nome do modelo ('voors' ou 'personalizada').
     */
    async function loadBotIntroduction(modelName) {
        currentModel = modelName; // Atualiza o modelo atual.
        messagesContainer.innerHTML = ''; // Limpa o chat antes de carregar o novo conteúdo.

        try {
            const response = await fetch('./models/models.json');
            if (!response.ok) throw new Error('Falha ao carregar JSON');
            
            const data = await response.json();
            const modelData = data[modelName]; // Acessa os dados do modelo específico.

            const welcomeMessage = `
                Olá! Eu sou o <strong>${modelData.nome}</strong>.<br>
                <strong>Meu objetivo:</strong> ${modelData.objetivo}<br>
                <strong>Total de atualizações:</strong> ${modelData.total_de_atualizacoes}
            `;
            displayBotMessage(welcomeMessage);
        } catch (error) {
            console.error("Não foi possível carregar os dados do bot:", error);
            displayBotMessage("Desculpe, ocorreu um erro. Como posso ajudar?");
        }
    }

    /**
     * Simula uma resposta do bot baseada na mensagem do usuário.
     * @param {string} userInput - O texto enviado pelo usuário.
     */
    function getSimulatedBotResponse(userInput) {
        const lowerCaseInput = userInput.toLowerCase();

        // Adiciona um pequeno "delay" para simular que o bot está "pensando".
        setTimeout(() => {
            if (lowerCaseInput.includes('olá') || lowerCaseInput.includes('oi')) {
                displayBotMessage('Olá! Como posso ajudar você hoje?');
            } else if (lowerCaseInput.includes('ajuda')) {
                displayBotMessage('Claro! Me diga qual é a sua dúvida sobre o modelo ' + currentModel.toUpperCase() + '.');
            } else if (lowerCaseInput.includes('obrigado')) {
                displayBotMessage('De nada! Se precisar de mais alguma coisa, é só perguntar.');
            } else {
                displayBotMessage('Entendido. Eu ainda sou um bot em desenvolvimento, mas anotei sua mensagem: "' + userInput + '".');
            }
        }, 800); // Atraso de 800 milissegundos (0.8 segundos).
    }
    
    /**
     * Função que lida com o envio de uma mensagem pelo usuário.
     */
    function handleSendMessage() {
        const messageText = messageInput.value.trim(); // Pega o texto e remove espaços extras.
        
        if (messageText !== '') {
            displayUserMessage(messageText);    // Mostra a mensagem do usuário na tela.
            messageInput.value = '';            // Limpa o campo de input.
            messageInput.focus();               // Devolve o foco para o campo de input.
            getSimulatedBotResponse(messageText); // Pede uma resposta simulada do bot.
        }
    }

    // --- 4. Configuração dos Event Listeners (Ouvintes de Eventos) ---

    // Adiciona o evento de clique para os botões da barra lateral.
    sidebarModels.forEach(li => {
        li.addEventListener('click', () => {
            // Remove a classe 'active' de todos os itens.
            sidebarModels.forEach(item => item.classList.remove('active'));
            // Adiciona a classe 'active' apenas no item clicado.
            li.classList.add('active');
            // Carrega a introdução do modelo correspondente ao 'data-model'.
            const modelName = li.getAttribute('data-model');
            loadBotIntroduction(modelName);
        });
    });

    // Adiciona o evento de clique para o botão de enviar.
    sendButton.addEventListener('click', handleSendMessage);
    
    // Adiciona o evento de "Enter" no campo de input para enviar a mensagem.
    messageInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });

    // --- 5. Inicialização ---
    // Carrega a introdução do modelo padrão ('voors') quando a aplicação inicia.
    loadBotIntroduction(currentModel);
});