const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('notificationAPI', {

  closeNotification: () => {
    ipcRenderer.send('notification:close');
  },

  openEducation: () => {
    ipcRenderer.send('notification:open-education');
  }
});