import React, { useContext, useEffect } from 'react';
import { AppDiv } from './elements';

import DevicePage from './components/device-page';
import { AppStateContext } from './app-state/context';

export default function App() {
    const {
        deviceList,
        selectedDevices,
        programLists,
        setDeviceList,
        setProgramLists,
        setSelectedDevices,
        setSelectedPrograms,
        updateSelectedDevice,
        updateSelectedProgram,
        updateProgramList
    } = useContext(AppStateContext);

    // Initial Load to get device list.
    useEffect(() => {
        async function fetchInitialProgramLists(devices, totalPages) {
            for (var page = 0; page < totalPages; page++) {
                const selectedDeviceIndex = 0; // TODO: fetch me :)
                const selectedProgramIndex = 0; // TODO: fetch me :)
                updateSelectedDevice(page, selectedDeviceIndex);
                updateSelectedProgram(page, selectedProgramIndex);

                const {data: programs} = await window.api.getPrograms(devices[selectedDeviceIndex]);
                updateProgramList(page, programs);
            }
        }
        
        async function fetchDevices() {
            const {data: devices} = await window.api.getDevices();
            const totalPages = 1 // TODO: Fetch me :)

            setProgramLists(Array(totalPages).fill(['first-load']));
            setSelectedDevices(Array(totalPages).fill(0));
            setSelectedPrograms(Array(totalPages).fill(0));
            setDeviceList(devices);

            await fetchInitialProgramLists(devices, totalPages);
        }

        // Whenever the event loop gets to it,
        // setup the initial data by first fetching
        // the device list.
        fetchDevices();
    }, [setDeviceList, setProgramLists, setSelectedDevices, setSelectedPrograms, updateProgramList, updateSelectedDevice, updateSelectedProgram]);

    useEffect(() => {
        if (programLists === undefined) return;

        // Don't use exhaustive dependancies here as the only time
        // that programLists can update is when selectedDevices
        // has been updated. 
        // In that situaiton, the programList is set to undefined,
        // triggering this useEffect as a side effect to fetch
        // async data.
        // TODO: Reorganize this code to a cleaner flow that doesn't
        //       require an out-of-file side effect.

        async function fetchPrograms(device, programIndex) {
            const {data: programList} = await window.api.getPrograms(device);
            const foundNames = [];
            const programListSet = programList.reduce((acc, {name, currentVolume}) => {
                // O(N^2) search here doesn't matter as a user isn't going to
                // have *that* many programs running. Even at 1000, O(N^2) would only
                // add on *maybe* a second to a search that already takes 4. This tool
                // would also be unusable as you'd be looking at a dropdown of 1000 items.
                if (foundNames.includes(name)) return acc;

                acc.push({name, currentVolume});
                foundNames.push(name);
                return acc;
            }, []);

            updateProgramList(programIndex, programListSet);
        }

        programLists.forEach((programList, index) => {
            if (programList === undefined) fetchPrograms(deviceList[selectedDevices[index]], index);
        });
    }, [programLists]); //eslint-disable-line react-hooks/exhaustive-deps

    return deviceList !== undefined ? (
        <AppDiv>
            <DevicePage pageIndex={0} />
        </AppDiv>
    ) : (
        <p>Fetching Devices...</p>
    );
}
