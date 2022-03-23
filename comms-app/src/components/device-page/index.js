import React from "react";
import {
    DevicePageWrapper,
    DeviceProgramSelectors
} from './elements';

import DeviceSelector from "./device-selector";
import ProgramSelector from "./program-selector";

export default function DevicePage({pageIndex}) {
    return (
        <DevicePageWrapper>
            <DeviceProgramSelectors>
                <DeviceSelector pageIndex={pageIndex} />
                <ProgramSelector pageIndex={pageIndex} />
            </DeviceProgramSelectors>
        </DevicePageWrapper>
    );
}
