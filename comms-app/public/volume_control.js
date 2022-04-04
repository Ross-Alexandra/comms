
const path = require('path');
const child = require('child_process').execFile;
const {
    getDevices: getDevicesCommandString,
    getPrograms: getProgramsCommandString
} = require('./electron_command_strings.js');

const changeVolumeExeLoc = path.join(__dirname, 'volume_control.exe');

async function runParameters(params) {
    return new Promise((resolve, reject) => {
        child(changeVolumeExeLoc, params, (err, data) => {
            if (err) reject(err);

            resolve(JSON.parse(data.toString()));
        });
    });
}

async function getDevices() {
    const getDeviceParameters = ['-l']

    return runParameters(getDeviceParameters);
}
getDevices.commandString = getDevicesCommandString;

async function getPrograms(device) {
    const getProgramsParameters = ['-a', ...(device ? ['-d', device] : [])];

    return runParameters(getProgramsParameters);
}
getPrograms.commandString = getProgramsCommandString;

async function setVolume(device, program, volume) {
    const setVolumeParameters = ['-d', device, '-p', program, '-s', volume];

    return runParameters(setVolumeParameters);
}

module.exports = {
    getDevices,
    getPrograms,
    setVolume
};
