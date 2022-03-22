import React, { useCallback, useState } from "react";
import {
    DevicePageWrapper,
    DeviceProgramSelectors
} from './elements';

import { useAsyncData } from "../hooks";

export default function DevicePage({deviceList}) {
    const [selectedDevice, setSelectedDevice] = useState(0);
    const {data: programList, state: programListState} = useAsyncData(useCallback(async () => {
        return await window.api.getPrograms(deviceList[selectedDevice]);
    }, [deviceList, selectedDevice]));

    const [selectedProgram, setSelectedProgram] = useState(0);
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
