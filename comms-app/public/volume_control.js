
const path = require('path');
const child = require('child_process').execFile;
const changeVolumeExeLoc = path.join(__dirname, 'volume_control.exe');
const {
    getDevices: getDeviceString,
    getPrograms: getProgramsString
} = require('./commandStrings');

async function getDevices() {
    const getDeviceParameters = ['-l']

    return new Promise((resolve, reject) => {
        child(changeVolumeExeLoc, getDeviceParameters, (err, data) => {
            if (err) reject(err);

            resolve(JSON.parse(data.toString()));
        });
    });
}
getDevices.commandString = getDeviceString;

async function getPrograms(device) {
    const getProgramsParameters = ['-a', ...(device ? ['-d', device] : [])];

    return new Promise((resolve, reject) => {
        child(changeVolumeExeLoc, getProgramsParameters, (err, data) => {
            if (err) reject(err);

            resolve(JSON.parse(data.toString()));
        });
    });
}
getPrograms.commandString = getProgramsString;

module.exports = {
    getDevices,
    getPrograms
};
