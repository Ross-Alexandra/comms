import React, { useCallback, useState } from "react";
import {
    DevicePageWrapper,
    DeviceProgramSelectors
} from './elements';

import { getPrograms } from "../../public/commandStrings";
import { useAsyncData } from "../hooks";
const { ipcRenderer } = window.require('electron');

export default function DevicePage({deviceList}) {
    const [selectedDevice, setSelectedDevice] = useState(0);
    
    const getProgramsCallback = useCallback(async () => {
        return await ipcRenderer.invoke('runCommand', {
            commandString: getPrograms,
            device: deviceList[selectedDevice]
        });
    }, [deviceList, selectedDevice]);

    const {data: programList, state: programListState} = useAsyncData(getProgramsCallback);
    const [selectedProgram, setSelectedProgram] = useState(0);
    console.log('render');
    return (
        <DevicePageWrapper>
            <DeviceProgramSelectors>
                <select
                    value={selectedDevice}
                    onChange={event => setSelectedDevice(event.target.value)}
                >
                    {deviceList.map((device, index) => 
                        <option key={device} value={index}>{device}</option>    
                    )}
                </select>
                {programListState === useAsyncData.readyState ? (
                    <select
                        value={selectedProgram}
                        onChange={event => setSelectedProgram(event.target.value)}
                    >
                        {programList.data.map((program, index) => 
                            <option key={`${program.name}-${index}`} value={index}>{program.name}</option>
                        )}
                    </select>
                ) : (
                    <p>Fetching device programs...</p>
                )
                }
            </DeviceProgramSelectors>
        </DevicePageWrapper>
    );
}
