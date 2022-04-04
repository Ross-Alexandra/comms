const path = require('path');
const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const isDev = require('electron-is-dev');
const Store = require('electron-store');
const store = new Store();

const {
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
const {getDevices, getPrograms, setVolume} = require('./volume_control');

function setProgramVolume(isDefault) {
    const volumeKey = isDefault ? 'defaultSlider' : 'alternateSlider';
    const volume = store.get(volumeKey, 50) / 100;

    const selectedDevices = store.get('selectedDevices');
    const selectedPrograms = store.get('selectedPrograms');
    const zippedDeviceProgram = selectedDevices.map((device, index) => [device, selectedPrograms[index]]);

    zippedDeviceProgram.forEach(([deviceIndex, programIndex]) => {
        const deviceName = store.get('deviceList', [])?.[deviceIndex];
        const program = store.get(`programLists."${deviceName}"`, [])?.[programIndex];
    
        console.log(`Setting ${program.name} on ${deviceName} to ${Math.round(volume * 100)}%`);
        setVolume(deviceName, program.name, volume);
    });
}

function hotkeyCallback() {
    const isDefault = store.get('isDefaultVolume'); 
    store.set('isDefaultVolume', !isDefault);

    setProgramVolume(!isDefault);
}

ipcMain.handle('runCommand', async (event, args) => {
    switch (args.commandString) {
        // volume_control API comands
        case getDevices.commandString:
            const deviceList = await getDevices();
            store.set('deviceList', deviceList);

            return {data: deviceList};
        case getPrograms.commandString:
            const programList = await getPrograms(args.device);
            store.set(`programLists."${args.device}"`, programList);

            return {data: programList};

        // Data storage and retrieval commands
        case getSelectedPrograms:
            return {data: store.get('selectedPrograms', [0])};
        case setSelectedPrograms:
            return {data: store.set('selectedPrograms', args.selectedPrograms)};
        case getSelectedDevices: 
            return {data: store.get('selectedDevices', [0])};
        case setSelectedDevices:
            return {data: store.set('selectedDevices', args.selectedDevices)};
        case getHotkey: 
            return {data: store.get('hotkey', 'M')};
        case getDefaultSlider:
            return {data: store.get('defaultSlider', 50)};
        case setDefaultSlider:
            return {data: store.set('defaultSlider', args.sliderValue)};
        case getAlternateSlider:
            return {data: store.get('alternateSlider', 50)};
        case setAlternateSlider:
            return {data: store.set('alternateSlider', args.sliderValue)};

        // React => Electron commands.
        case setHotkey:
            globalShortcut.unregisterAll();

            store.set('hotkey', args.hotkey);
            globalShortcut.register(args.hotkey, hotkeyCallback);
        default:
            return {data: null};
    }
});

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron_api.js')
    },
  });

  if (!isDev) win.removeMenu();

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  store.set('isDefaultVolume', true);
  globalShortcut.register(store.get('hotkey', 'M'), hotkeyCallback);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
