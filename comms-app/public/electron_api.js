const { ipcRenderer, contextBridge } = require('electron');
const { 
    getDevices,
    getPrograms,
    getSelectedPrograms,
    setSelectedPrograms,
    getSelectedDevices,
    setSelectedDevices,
    setHotkey,
    getHotkey,
    getDefaultSlider,
    setDefaultSlider,
    getAlternateSlider,
    setAlternateSlider
} = require('./electron_command_strings');


// Adds an object 'api' to the global window object:
contextBridge.exposeInMainWorld('api', {
    getDevices: async () => {
        return await ipcRenderer.invoke('runCommand', {commandString: getDevices});
    },
    getPrograms: async (device, deviceIndex) => {
        return await ipcRenderer.invoke('runCommand', {commandString: getPrograms, device, deviceIndex});
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
    },
    getHotkey: async () => {
        return await ipcRenderer.invoke('runCommand', {commandString: getHotkey});
    },
    getDefaultSlider: async () => {
        return await ipcRenderer.invoke('runCommand', {commandString: getDefaultSlider});
    },
    setDefaultSlider: async (sliderValue) => {
        return await ipcRenderer.invoke('runCommand', {commandString: setDefaultSlider, sliderValue});
    },
    getAlternateSlider: async () => {
        return await ipcRenderer.invoke('runCommand', {commandString: getAlternateSlider});
    },
    setAlternateSlider: async (sliderValue) => {
        return await ipcRenderer.invoke('runCommand', {commandString: setAlternateSlider, sliderValue});
    },
});
