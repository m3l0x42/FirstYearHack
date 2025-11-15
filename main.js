const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

// --- Global variables for timer and notification window ---
let notificationTimer = null;
let notificationWindow = null;
let mainWindow = null; // <-- ADDED: Store reference to main window

// CHANGED: 20 minutes
const NOTIFICATION_INTERVAL_MS = 0.1 * 60 * 1000; // 1,200,000 ms

// Function to create the main application window (Standard app window)
function createWindow() {
  // Store the reference in the global variable
  mainWindow = new BrowserWindow({ // <-- MODIFIED
    width: 800,
    height: 600,
    webPreferences: {
      // ADDED: Preload script for index.html to receive navigation events
      preload: path.join(__dirname, 'preload-main.js'), 
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  // Clear reference on close
  mainWindow.on('closed', () => { // <-- ADDED
    mainWindow = null;
  });
}

// Function to create the notification window in the top-right corner
function createNotificationWindow() {
    // If a notification is already showing, don't create another one
    if (notificationWindow && !notificationWindow.isDestroyed()) {
        notificationWindow.focus();
        return;
    }

    // Calculate position for top-right corner, respecting the working area (excluding taskbar)
    const { width } = screen.getPrimaryDisplay().workAreaSize;
    const NOTIFICATION_WIDTH = 350;
    const NOTIFICATION_HEIGHT = 120; // <-- INCREASED HEIGHT for new buttons
    const PADDING = 20;

    const x = width - NOTIFICATION_WIDTH - PADDING;
    const y = PADDING;

    notificationWindow = new BrowserWindow({
        width: NOTIFICATION_WIDTH,
        height: NOTIFICATION_HEIGHT, // <-- UPDATED
        x: x,
        y: y,
        frame: false, 
        resizable: false,
        alwaysOnTop: true,
        show: false, 
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Link to the secure bridge
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

// Function to manage and start the recurring timer
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

// IPC listener from the renderer process (notification.html) to close the window
ipcMain.on('notification:close', () => {
    if (notificationWindow) {
        notificationWindow.close();
    }
});

// NEW: IPC listener for the "Info" button
ipcMain.on('notification:open-education', () => {
    // 1. Focus the main app window
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.focus();
        // 2. Send a message to the main window to change its iframe source
        mainWindow.webContents.send('main:navigate', 'education.html');
    }
    
    // 3. Close the notification window
    if (notificationWindow && !notificationWindow.isDestroyed()) {
        notificationWindow.close(); // This will also restart the timer
    }
});


// When Electron is ready, create the main window and start the timer
app.whenReady().then(() => {
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