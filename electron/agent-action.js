const { ipcMain } = require('electron');

function registerAgentHandlers(win) {
  ipcMain.handle('agent:run', async (event, action) => {
    // action: { type: 'click'|'fill'|'nav', selector: string, value: string }
    const view = win.getBrowserView();
    if (!view) return { error: 'No active tab' };

    try {
      if (action.type === 'nav') {
        await view.webContents.loadURL(action.url);
      } else {
        const code = action.type === 'click' 
          ? `document.querySelector('${action.selector}').click()`
          : `const el = document.querySelector('${action.selector}'); el.value = '${action.value}'; el.dispatchEvent(new Event('input'))`;
        await view.webContents.executeJavaScript(code);
      }
      return { success: true };
    } catch (e) {
      return { error: e.message };
    }
  });
}
module.exports = { registerAgentHandlers };
