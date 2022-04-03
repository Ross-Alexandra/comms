import React, { useEffect, useState } from "react";
import {
    DevicePageWrapper,
    DeviceProgramSelectors,
    Tools,
    HotKeySelector,
    LevelSelectorBox,
    LevelSelector,
} from './elements';

import DeviceSelector from "./device-selector";
import ProgramSelector from "./program-selector";

export default function DevicePage({pageIndex}) {
    const [settingHotkey, setSettingHotkey] = useState(false);
    const [hotkey, setHotkey] = useState();

    useEffect(() => {
        if (hotkey) window.api.setHotkey(hotkey);
    }, [hotkey]);

    return (
        <DevicePageWrapper>
            <DeviceProgramSelectors>
                <DeviceSelector pageIndex={pageIndex} />
                <ProgramSelector pageIndex={pageIndex} />
            </DeviceProgramSelectors>
            <Tools>
                <HotKeySelector
                    tabIndex="0"
                    onClick={() => setSettingHotkey(true)}
                    onKeyUp={event => {
                        if (settingHotkey) {
                            setSettingHotkey(false);
                            setHotkey(event.key);
                        }
                    }}
                >[{hotkey ?? 'click & press to set hotkey'}]</HotKeySelector>
                <LevelSelectorBox>
                    <label>Default</label>
                    <LevelSelector type="range"></LevelSelector>
                </LevelSelectorBox>
                <LevelSelectorBox>
                    <label>When Toggled</label>
                    <LevelSelector type="range"></LevelSelector>
                </LevelSelectorBox>            </Tools>
        </DevicePageWrapper>
    );
}
