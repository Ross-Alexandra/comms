import React, { useContext, useState } from "react";
import { AppStateContext } from "../../../app-state/context";
import { DeviceInput } from "./elements";

export default function DeviceSelector({pageIndex}) {

    const {deviceList, selectedDevices, updateSelectedDevice, updateSelectedProgram} = useContext(AppStateContext);
    const [deviceIndex, setDeviceIndex] = useState(selectedDevices?.[pageIndex] ?? 0);

    return (
        <DeviceInput
            value={deviceIndex}
            onChange={event => {
                const newDeviceIndex = event.target.value;
                setDeviceIndex(newDeviceIndex);
                updateSelectedDevice(pageIndex, newDeviceIndex);
                updateSelectedProgram(pageIndex, 0);
            }}
        >
            {deviceList.map((device, index) => 
                <option key={device} value={index}>{device}</option>    
            )}
        </DeviceInput>
    );
}