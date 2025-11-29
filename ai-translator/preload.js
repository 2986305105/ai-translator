const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  translate: (data) => ipcRenderer.invoke('translate', data),
  translateBatch: (data) => ipcRenderer.invoke('translate-batch', data),
  checkConnection: () => ipcRenderer.invoke('check-connection'),
});

