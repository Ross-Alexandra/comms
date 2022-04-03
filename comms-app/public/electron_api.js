const { ipcRenderer, contextBridge } = require('electron');
const { 
    getDevices,
    getPrograms,
    getSelectedPrograms,
    setSelectedPrograms,
    getSelectedDevices,
    setSelectedDevices,
    setHotkey
} = require('./electron_command_strings');


// Adds an object 'api' to the global window object:
contextBridge.exposeInMainWorld('api', {
    getDevices: async () => {
        return await ipcRenderer.invoke('runCommand', {commandString: getDevices});
    },
    getPrograms: async (device) => {
        return await ipcRenderer.invoke('runCommand', {commandString: getPrograms, device});
    },
    getSelectedPrograms: async () => {
        return await ipcRenderer.invoke('runCommand', {commandString: getSelectedPrograms});
    },
    setSelectedPrograms: async (selectedPrograms) => {
        return await ipcRenderer.invoke('runCommand', {commandString: setSelectedPrograms, selectedPrograms});
    },
    getSelectedDevices: async () => {
        return await ipcRenderer.invoke('runCommand', {commandString: getSelectedDevices});
    },
    setSelectedDevices: async (selectedDevices) => {
        return await ipcRenderer.invoke('runCommand', {commandString: setSelectedDevices, selectedDevices})
    },
    setHotkey: async (hotkey) => {
        return await ipcRenderer.invoke('runCommand', {commandString: setHotkey, hotkey});
    }
});