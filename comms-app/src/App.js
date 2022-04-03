import React, { useContext, useEffect, useState } from 'react';
import { AppDiv } from './elements';

import DevicePage from './components/device-page';
import { AppStateContext } from './app-state/context';

export default function App() {
    const {
        deviceList,
        selectedDevices,
        selectedPrograms,
        programLists,
        setDeviceList,
        setProgramLists,
        setSelectedDevices,
        setSelectedPrograms,
        updateSelectedDevice,
        updateSelectedProgram,
        updateProgramList
    } = useContext(AppStateContext);
    
    const [initialLoad, setInitialLoad] = useState(true);

    // Initial Load to get device list.
    useEffect(() => {
        async function fetchDevices() {
            const {data: devices} = await window.api.getDevices();
            const {data: storedSelectedDevices} = await window.api.getSelectedDevices();
            const {data: storedSelectedPrograms} = await window.api.getSelectedPrograms();

            setSelectedDevices(storedSelectedDevices);
            setSelectedPrograms(storedSelectedPrograms);
            setDeviceList(devices);

            // set program lists as an empty [undefined, ...]
            // array so that the refresher useEffect can pull this data down.
            setProgramLists(Array(storedSelectedDevices.length).fill(undefined));
        }

        // Whenever the event loop gets to it,
        // setup the initial data by first fetching
        // the device list.
        fetchDevices();
    }, [setDeviceList, setProgramLists, setSelectedDevices, setSelectedPrograms, updateProgramList, updateSelectedDevice, updateSelectedProgram]);

    useEffect(() => {
        // Don't use exhaustive dependancies here as the only time
        // that programLists can update is when selectedDevices
        // has been updated. 
        // In that situaiton, the programList is set to undefined,
        // triggering this useEffect as a side effect to fetch
        // async data.
        // TODO: Reorganize this code to a cleaner flow that doesn't
        //       require an out-of-file side effect.

        if (programLists === undefined) return;

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

    useEffect(() => {
        if (selectedDevices && !initialLoad) window.api.setSelectedDevices(selectedDevices);
    }, [selectedDevices, initialLoad]);

    useEffect(() => {
        if (selectedPrograms && !initialLoad) window.api.setSelectedPrograms(selectedPrograms);
    }, [selectedPrograms, initialLoad]);

    // When all program lists are not undefined, then'
    // the app has finished it's initial load.
    useEffect(() => {
        if (initialLoad && deviceList !== undefined && programLists?.every(programList => programList !== undefined)) setInitialLoad(false); 
    }, [programLists, initialLoad, deviceList]);

    return initialLoad ? (
        <p>Fetching necessary data, please wait</p>
    ) : (
        <AppDiv>
            <DevicePage pageIndex={0} />
        </AppDiv>
    );
}
