const { app, BrowserWindow, BrowserView, ipcMain, session, Menu } = require('electron');
const path = require('path');
const Store = require('electron-store').default;
const store = new Store();

let win;
const tabs = new Map();
let activeTabId = null;
const SIDECAR_WIDTH = 380;

function createWindow() {
  win = new BrowserWindow({ width: 1400, height: 900, title: 'CometX', backgroundColor: '#0b0b0f', webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true } });
  win.loadFile(path.join(__dirname, '..', 'ui', 'shell.html'));
  win.on('resize', layout);
  Menu.setApplicationMenu(null);
}

function layout() {
  if (!win) return;
  const [w, h] = win.getContentSize();
  const view = tabs.get(activeTabId);
  if (view) view.setBounds({ x: 0, y: 88, width: w - SIDECAR_WIDTH, height: h - 88 });
}

function newTab(url = 'https://www.google.com') {
  const id = Date.now().toString(36);
  const view = new BrowserView({ webPreferences: { contextIsolation: true, sandbox: true, partition: 'persist:cometx' } });
  win.addBrowserView(view);
  tabs.set(id, view);
  view.webContents.loadURL(url);
  activeTabId = id;
  layout();
  return id;
}

ipcMain.handle('tab:new', (e, url) => newTab(url));
ipcMain.handle('tab:nav', (e, { action, url }) => {
  const v = tabs.get(activeTabId);
  if (v) action === 'load' ? v.webContents.loadURL(url) : v.webContents[action]();
});

app.whenReady().then(createWindow);
