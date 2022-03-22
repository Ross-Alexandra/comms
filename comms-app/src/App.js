import React, { useCallback } from 'react';
import { AppDiv } from './elements';

import {getDevices} from '../public/commandStrings';
import DevicePage from './device-page';
import { useAsyncData } from './hooks';
const { ipcRenderer } = window.require('electron');

export default function App() {

  const getDevicesCallback = useCallback(async () => {
    return await ipcRenderer.invoke('runCommand', {
      commandString: getDevices
    });  
  }, []);
  const {data: deviceData, state: deviceDataState} = useAsyncData(getDevicesCallback);

  return (
    <AppDiv>
      { deviceDataState === useAsyncData.readyState ? (
        <DevicePage deviceList={deviceData.data} />
      ) : (
        <p>Fetching device list...</p>
      )}
    </AppDiv>
  );
}
