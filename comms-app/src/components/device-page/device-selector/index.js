import React, { useContext, useState } from "react";
import { AppStateContext } from "../../../app-state/context";

export default function DeviceSelector({pageIndex}) {

    const {deviceList, selectedDevices, updateSelectedDevice} = useContext(AppStateContext);
    const [deviceIndex, setDeviceIndex] = useState(selectedDevices?.[pageIndex] ?? 0);

    return (
        <select
            value={deviceIndex}
            onChange={event => {
                const newDeviceIndex = event.target.value;
                setDeviceIndex(newDeviceIndex);
                updateSelectedDevice(pageIndex, newDeviceIndex);
            }}
        >
            {deviceList.map((device, index) => 
                <option key={device} value={index}>{device}</option>    
            )}
        </select>
    );
}