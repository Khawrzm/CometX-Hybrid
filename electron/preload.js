const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('cometx', {
  newTab: (url) => ipcRenderer.invoke('tab:new', url),
  nav: (action, url) => ipcRenderer.invoke('tab:nav', { action, url }),
  runAgent: (action) => ipcRenderer.invoke('agent:run', action),
  on: (ev, cb) => ipcRenderer.on(ev, (e, d) => cb(d))
});
