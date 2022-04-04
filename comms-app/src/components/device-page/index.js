import React, { useContext, useState } from "react";
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
import { AppStateContext } from "../../app-state/context";

export default function DevicePage({pageIndex}) {
    const {
        hotkey,
        setHotkey,
        defaultSliderValue,
        alternateSliderValue,
        updateDefaultSliderValue,
        updateAlternateSliderValue
    } = useContext(AppStateContext);
    const [settingHotkey, setSettingHotkey] = useState(false);

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
                    <LevelSelector
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={defaultSliderValue}
                        onChange={event => {
                            updateDefaultSliderValue(event.target.value)
                        }}
                    ></LevelSelector>
                </LevelSelectorBox>
                <LevelSelectorBox>
                    <label>When Toggled</label>
                    <LevelSelector
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={alternateSliderValue}
                        onChange={event => {
                            updateAlternateSliderValue(event.target.value);
                        }}
                    ></LevelSelector>
                </LevelSelectorBox>
            </Tools>
        </DevicePageWrapper>
    );
}
