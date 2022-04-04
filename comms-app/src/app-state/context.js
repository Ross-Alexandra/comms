import React, { createContext, useMemo, useReducer } from "react";

import {
    initialState,
    StateActions,
    Reducer
} from './reducer';

export const AppStateContext = createContext();

export function AppStateProvider({children}) {
    const [state, dispatch] = useReducer(Reducer, initialState);

    const callbacks = useMemo(() => ({
        setDeviceList: deviceList => dispatch({type: StateActions.setDeviceList, deviceList}),
        setProgramLists: programLists => dispatch({type: StateActions.setProgramLists, programLists}),
        setSelectedDevices: (selectedDevices) => dispatch({type: StateActions.setSelectedDevices, selectedDevices}),
        setSelectedPrograms: (selectedPrograms) => dispatch({type: StateActions.setSelectedPrograms, selectedPrograms}),
        updateProgramList: (index, programList) => dispatch({type: StateActions.updateProgramList, index, programList}),
        updateSelectedDevice: (index, device) => dispatch({type: StateActions.updateSelectedDevice, index, device}),
        updateSelectedProgram: (index, program) => dispatch({type: StateActions.updateSelectedProgram, index, program}),
        updateDefaultSliderValue: (sliderValue) => dispatch({type: StateActions.updateDefaultSliderValue, sliderValue}),
        updateAlternateSliderValue: (sliderValue) => dispatch({type: StateActions.updateAlternateSliderValue, sliderValue}),
        setHotkey: (hotkey) => dispatch({type: StateActions.setHotkey, hotkey}),
    }), [dispatch]);

    const value = useMemo(() => {
        return {
            ...state,
            ...callbacks
        }
    }, [
        state,
        callbacks
    ]);

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
}