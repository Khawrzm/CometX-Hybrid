const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('cometx', {
  newTab: (url) => ipcRenderer.invoke('tab:new', url),
  nav: (action, url) => ipcRenderer.invoke('tab:nav', { action, url }),
  on: (ev, cb) => ipcRenderer.on(ev, (e, d) => cb(d))
});
