const { app, BrowserWindow, screen, ipcMain, session } = require('electron'); // <-- 1. ADD 'session'
const path = require('path');

// --- Global variables for timer and notification window ---
let notificationTimer = null;
let notificationWindow = null;
let mainWindow = null; 

// CHANGED: 20 minutes
const NOTIFICATION_INTERVAL_MS = 0.5 * 60 * 1000; // 1,200,000 ms

// Function to create the main application window (Standard app window)
function createWindow() {
  // Store the reference in the global variable
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

// Function to create the notification window (Your code... no changes needed here)
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

// Function to manage and start the recurring timer (Your code... no changes)
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

// IPC Handlers (Your code... no changes)
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


// When Electron is ready, create the main window and start the timer
app.whenReady().then(() => {
  
  // --- 2. ADD THIS PERMISSION HANDLER ---
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    // We are checking for 'media' which includes 'video' (camera) and 'audio'
    if (permission === 'media') {
      // In a production app, you might want to be more specific,
      // e.g., check webContents.getURL() to ensure it's your app.
      // For this project, we'll just grant it.
      callback(true);
      return;
    }
    // Deny any other permissions
    callback(false);
  });
  // --- END OF NEW CODE ---

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