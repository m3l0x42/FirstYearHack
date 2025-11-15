const { app, BrowserWindow, screen, ipcMain, session } = require('electron'); // <-- 1. ADD 'session'
const path = require('path');

let notificationTimer = null;
let notificationWindow = null;
let mainWindow = null; 

const NOTIFICATION_INTERVAL_MS = 0.5 * 60 * 1000;


function createWindow() {
  mainWindow = new BrowserWindow({ 
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload-main.js'), 
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  mainWindow.on('closed', () => { 
    mainWindow = null;
  });
}

function createNotificationWindow() {
    if (notificationWindow && !notificationWindow.isDestroyed()) {
        notificationWindow.focus();
        return;
    }
    const { width } = screen.getPrimaryDisplay().workAreaSize;
    const NOTIFICATION_WIDTH = 400;
    const NOTIFICATION_HEIGHT = 330; 
    const PADDING = 20;
    const x = width - NOTIFICATION_WIDTH - PADDING;
    const y = PADDING;
    notificationWindow = new BrowserWindow({
        width: NOTIFICATION_WIDTH,
        height: NOTIFICATION_HEIGHT, 
        x: x,
        y: y,
        frame: false, 
        resizable: false,
        alwaysOnTop: true,
        show: false, 
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });
    notificationWindow.loadFile(path.join(__dirname, 'notification.html'));
    notificationWindow.once('ready-to-show', () => {
        notificationWindow.show();
    });
    notificationWindow.on('closed', () => {
        notificationWindow = null;
        startNotificationTimer(); 
    });
}

function startNotificationTimer() {
    if (notificationTimer) {
        clearInterval(notificationTimer);
        notificationTimer = null;
    }
    notificationTimer = setInterval(() => {
        createNotificationWindow();
        clearInterval(notificationTimer);
    }, NOTIFICATION_INTERVAL_MS);
    console.log(`Notification timer started (resets in ${NOTIFICATION_INTERVAL_MS / 1000 / 60} min)`);
}

ipcMain.on('notification:close', () => {
    if (notificationWindow) {
        notificationWindow.close();
    }
});
ipcMain.on('notification:open-education', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.focus();
        mainWindow.webContents.send('main:navigate', 'education.html');
    }
    if (notificationWindow && !notificationWindow.isDestroyed()) {
        notificationWindow.close();
    }
});


app.whenReady().then(() => {
  
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true);
      return;
    }
    callback(false);
  });

  createWindow();
  startNotificationTimer(); 

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});