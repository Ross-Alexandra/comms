export const initialState = {
    deviceList: undefined,
    programLists: undefined,
    selectedDevices: undefined,
    selectedPrograms: undefined,
    hotkey: undefined,
    defaultSliderValue: undefined,
    alternateSliderValue: undefined
};

export const StateActions = {
    setDeviceList: 'set_device_list',
    setProgramLists: 'set_program_lists',
    setSelectedDevices: 'set_selected_device',
    setSelectedPrograms: 'set_selected_program',
    updateProgramList: 'update_program_list',
    updateSelectedDevice: 'update_selected_device',
    updateSelectedProgram: 'update_selected_program',
    setHotkey: 'set_hotkey',
    updateDefaultSliderValue: 'update_default_slider_value',
    updateAlternateSliderValue: 'update_alternate_slider_value'
};

export const Reducer = (state, action) => {
    switch (action.type) {
        case StateActions.setDeviceList: {
            return {
                ...state,
                deviceList: action.deviceList
            };
        }
        case StateActions.setProgramLists: {
            return {
                ...state,
                programLists: action.programLists
            };
        }
        case StateActions.setSelectedDevices: {
            return {
                ...state,
                selectedDevices: action.selectedDevices
            };
        }
        case StateActions.setSelectedPrograms: {
            return {
                ...state,
                selectedPrograms: action.selectedPrograms
            };
        }
        case StateActions.updateProgramList: {
            const programListsUpdate = [...state.programLists];
            programListsUpdate[action.index] = action.programList;
            
            return {
                ...state,
                programLists: programListsUpdate,
            };
        }
        case StateActions.updateSelectedDevice: {
            const selectedDevicesUpdate = [...state.selectedDevices];
            selectedDevicesUpdate[action.index] = action.device;

            const programListsUpdate = [...state.programLists];
            programListsUpdate[action.index] = undefined;

            return {
                ...state,
                selectedDevices: selectedDevicesUpdate,
                programLists: programListsUpdate
            };
        }
        case StateActions.updateSelectedProgram: {
            const selectedProgramsUpdate = [...state.selectedPrograms];
            selectedProgramsUpdate[action.index] = action.program;
            
            return {
                ...state,
                selectedPrograms: selectedProgramsUpdate
            };
        }
        case StateActions.setHotkey: {
            return {
                ...state,
                hotkey: action.hotkey
            };
        }
        case StateActions.updateDefaultSliderValue: {
            return {
                ...state,
                defaultSliderValue: action.sliderValue
            };
        }
        case StateActions.updateAlternateSliderValue: {
            return {
                ...state,
                alternateSliderValue: action.sliderValue
            };
        }
        default: 
            console.error(`Unrecognized action: "${action.type}". Not altering state.`);
            return state;
    }
}
