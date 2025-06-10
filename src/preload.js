const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    sendMessage: (message) => ipcRenderer.send('chat-message', message),
    receiveMessage: (callback) => ipcRenderer.on('bot-message', callback),
    getModels: () => ipcRenderer.invoke('get-models')
});
