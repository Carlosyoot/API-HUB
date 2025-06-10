// src/renderer.js - VERSÃO ATUALIZADA E COMPLETA

window.addEventListener('DOMContentLoaded', () => {
    // --- 1. Seleção dos Elementos do DOM ---
    const appContainer = document.getElementById('app-container');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const newChatButton = document.getElementById('new-chat-btn');
    const sidebarModels = document.querySelectorAll('.model-list li');
    const messagesContainer = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    
    // ALTERADO: Carrega o último modelo ativo do localStorage, ou usa 'voors' como padrão.
    let currentModel = localStorage.getItem('activeModel') || 'voors';

    // --- 2. Funções de Exibição de Mensagens ---

    /**
     * Função para rolar o chat para a última mensagem.
     */
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Exibe uma mensagem do BOT na tela.
     * @param {string} htmlMessage - A mensagem a ser exibida, pode conter HTML.
     */
    function displayBotMessage(htmlMessage) {
        // A lógica original desta função está perfeita, sem alterações.
        const messageElement = document.createElement('div');
        messageElement.classList.add('bot-message');
        messageElement.innerHTML = htmlMessage;
        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }

    /**
     * Exibe uma mensagem do USUÁRIO na tela.
     * @param {string} textMessage - A mensagem de texto a ser exibida.
     */
    function displayUserMessage(textMessage) {
        // A lógica original desta função está perfeita, sem alterações.
        const messageElement = document.createElement('div');
        messageElement.classList.add('user-message');
        messageElement.textContent = textMessage;
        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }

    // --- 3. Lógica do Chat ---

    /**
     * Carrega a introdução do bot baseada no modelo selecionado.
     * @param {string} modelName - O nome do modelo ('voors' ou 'personalizada').
     */
    async function loadBotIntroduction(modelName) {
        currentModel = modelName;
        
        // ALTERADO: Lógica para limpar apenas as mensagens, preservando outros elementos.
        const messagesToRemove = messagesContainer.querySelectorAll('.bot-message, .user-message');
        messagesToRemove.forEach(message => message.remove());

        try {
            const response = await fetch('./models/models.json');
            if (!response.ok) throw new Error('Falha ao carregar JSON');
            
            const data = await response.json();
            const modelData = data[modelName];

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
        // A lógica original desta função está perfeita, sem alterações.
        const lowerCaseInput = userInput.toLowerCase();
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
        }, 800);
    }
    
    /**
     * Função que lida com o envio de uma mensagem pelo usuário.
     */
    function handleSendMessage() {
        // A lógica original desta função está perfeita, sem alterações.
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            displayUserMessage(messageText);
            messageInput.value = '';
            messageInput.focus();
            getSimulatedBotResponse(messageText);
        }
    }

    // --- 4. Configuração dos Event Listeners (Ouvintes de Eventos) ---

    // NOVO: Evento para o botão que abre/fecha a sidebar.
    sidebarToggle.addEventListener('click', () => {
        appContainer.classList.toggle('sidebar-collapsed');
    });

    // NOVO: Evento para o botão de "Novo Chat".
    newChatButton.addEventListener('click', () => {
        // Apenas recarrega a introdução do modelo que já está ativo.
        loadBotIntroduction(currentModel);
    });

    // Evento de clique para os botões da barra lateral.
    sidebarModels.forEach(li => {
        li.addEventListener('click', () => {
            sidebarModels.forEach(item => item.classList.remove('active'));
            li.classList.add('active');

            const modelName = li.getAttribute('data-model');
            // NOVO: Salva a escolha do modelo no localStorage para persistência.
            localStorage.setItem('activeModel', modelName);
            
            loadBotIntroduction(modelName);
        });
    });

    // Evento de clique para o botão de enviar.
    sendButton.addEventListener('click', handleSendMessage);
    
    // Evento de "Enter" no campo de input para enviar a mensagem.
    messageInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });

    // --- 5. Inicialização ---

    // NOVO: Garante que o item correto da sidebar esteja marcado como 'active' ao iniciar.
    const activeModelLi = document.querySelector(`.model-list li[data-model="${currentModel}"]`);
    if (activeModelLi) {
        sidebarModels.forEach(item => item.classList.remove('active'));
        activeModelLi.classList.add('active');
    }

    // Carrega a introdução do modelo (seja o padrão ou o salvo).
    loadBotIntroduction(currentModel);
});