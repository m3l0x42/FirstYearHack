const { contextBridge, ipcRenderer } = require('electron');

// Expose a secure API to the notification.html window
contextBridge.exposeInMainWorld('notificationAPI', {
  /**
   * Sends a message to the main process to close the notification window
   */
  closeNotification: () => {
    ipcRenderer.send('notification:close');
  },

  /**
   * Sends a message to the main process to open the education section
   */
  openEducation: () => {
    ipcRenderer.send('notification:open-education');
  }
});