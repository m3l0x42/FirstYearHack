const { contextBridge, ipcRenderer } = require('electron');

// Expose a secure API to the index.html window
contextBridge.exposeInMainWorld('mainAPI', {
  /**
   * Listens for a navigation event from the main process
   * @param {function} callback - The function to call with the page (e.g., 'education.html')
   */
  onNavigate: (callback) => {
    // Listen for the 'main:navigate' event
    ipcRenderer.on('main:navigate', (event, page) => {
      callback(page);
    });
  }
});