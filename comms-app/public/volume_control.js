
const path = require('path');
const child = require('child_process').execFile;
const changeVolumeExeLoc = path.join(__dirname, 'volume_control.exe');

async function getDevices() {
    const getDeviceParameters = ['-l']

    return new Promise((resolve, reject) => {
        child(changeVolumeExeLoc, getDeviceParameters, (err, data) => {
            if (err) reject(err);

            resolve(JSON.parse(data.toString()));
        });
    });
}
getDevices.commandString = 'getDevices';

async function getPrograms(device) {
    const getProgramsParameters = ['-a', ...(device ? ['-d', device] : [])];

    return new Promise((resolve, reject) => {
        child(changeVolumeExeLoc, getProgramsParameters, (err, data) => {
            if (err) reject(err);

            resolve(JSON.parse(data.toString()));
        });
    });
}
getPrograms.commandString = 'getPrograms';

module.exports = {
    getDevices,
    getPrograms
};
