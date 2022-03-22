import React, { useCallback } from 'react';
import { AppDiv } from './elements';

import DevicePage from './device-page';
import { useAsyncData } from './hooks';

export default function App() {
    const {data: deviceData, state: deviceDataState} = useAsyncData(useCallback(async () => {
        return await window.api.getDevices();
    }, []));

    return (
        <AppDiv>
            {deviceDataState === useAsyncData.readyState ? (
                <DevicePage deviceList={deviceData.data} />
            ) : (
                <p>Fetching device list...</p>
            )}
        </AppDiv>
    );
}
