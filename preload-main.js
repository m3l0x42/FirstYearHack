const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mainAPI', {
  onNavigate: (callback) => {
    ipcRenderer.on('main:navigate', (event, page) => {
      callback(page);
    });
  }
});