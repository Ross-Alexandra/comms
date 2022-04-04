import React, { useContext, useEffect, useState } from 'react';
import { AppDiv } from './elements';

import DevicePage from './components/device-page';
import { AppStateContext } from './app-state/context';

export default function App() {
    const {
        // Data
        deviceList,
        selectedDevices,
        selectedPrograms,
        programLists,
        hotkey,
        defaultSliderValue,
        alternateSliderValue,

        // Setters
        setDeviceList,
        setProgramLists,
        setSelectedDevices,
        setSelectedPrograms,
        updateSelectedDevice,
        updateSelectedProgram,
        updateProgramList,
        setHotkey,
        updateDefaultSliderValue,
        updateAlternateSliderValue
    } = useContext(AppStateContext);
    
    const [initialLoad, setInitialLoad] = useState(true);

    // Fetch all the data from the electron store.
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

        async function loadHotkey() {
            const {data: hotkey} = await window.api.getHotkey();
            setHotkey(hotkey);
        }

        async function loadSliderValues() {
            const {data: defaultSliderValue} = await window.api.getDefaultSlider();
            const {data: alternateSliderValue} = await window.api.getAlternateSlider();
            updateDefaultSliderValue(defaultSliderValue);
            updateAlternateSliderValue(alternateSliderValue);
        }

        // Whenever the event loop gets to it,
        // setup the initial data by first fetching
        // the device list.
        fetchDevices();
        loadHotkey();
        loadSliderValues();
    }, [setDeviceList, setProgramLists, setSelectedDevices, setSelectedPrograms, updateProgramList, updateSelectedDevice, updateSelectedProgram, setHotkey, updateDefaultSliderValue, updateAlternateSliderValue]);

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
            const {data: programList} = await window.api.getPrograms(device, programIndex);
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

    useEffect(() => {
        if (hotkey) window.api.setHotkey(hotkey);
    }, [hotkey]);

    useEffect(() => {
        if (defaultSliderValue) window.api.setDefaultSlider(defaultSliderValue);
    }, [defaultSliderValue]);

    useEffect(() => {
        if (alternateSliderValue) window.api.setAlternateSlider(alternateSliderValue);
    }, [alternateSliderValue]);

    // When all the day is done loading in, the
    // program is no longer loading.
    useEffect(() => {
        if (
            initialLoad &&
            hotkey !== undefined && 
            deviceList !== undefined &&
            defaultSliderValue !== undefined &&
            alternateSliderValue !== undefined &&
            programLists?.every(programList => programList !== undefined)
        ) setInitialLoad(false); 
    }, [programLists, initialLoad, deviceList, defaultSliderValue, alternateSliderValue, hotkey]);

    return initialLoad ? (
        <p>Fetching necessary data, please wait</p>
    ) : (
        <AppDiv>
            <DevicePage pageIndex={0} />
        </AppDiv>
    );
}
