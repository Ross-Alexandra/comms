const { ipcRenderer, contextBridge } = require('electron');
const { getDevices, getPrograms } = require('./volume_control');


// Adds an object 'api' to the global window object:
contextBridge.exposeInMainWorld('api', {
    getDevices: async () => {
        return await ipcRenderer.invoke('runCommand', {commandString: getDevices.commandString});
    },
    getPrograms: async (device) => {
        return await ipcRenderer.invoke('runCommand', {commandString: getPrograms.commandString, device});
    }
});