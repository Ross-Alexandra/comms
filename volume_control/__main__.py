import argparse
import comtypes
import json

from pycaw.pycaw import (
    AudioUtilities,
    IMMDeviceEnumerator,
    EDataFlow,
    DEVICE_STATE,
    STGM,
    CLSID_MMDeviceEnumerator,
    PROPERTYKEY,
    GUID
)
from sys import exit

def set_program_volume(program_name, program_volume):
    sessions = AudioUtilities.GetAllSessions()

    for session in sessions:
        if session.Process is not None and session.SimpleAudioVolume is not None:
            if session.Process.name() == program_name:
                session.SimpleAudioVolume.SetMasterVolume(program_volume, None)
                print(json.dumps({
                    'success': True,
                    'message': f'Updated {session.Process.name()} to {program_volume}'
                }))


def change_program_volume(program_name, volume_offset):
    sessions = AudioUtilities.GetAllSessions()

    for session in sessions:
        if session.Process is not None and session.SimpleAudioVolume is not None:
            if session.Process.name() == program_name:
                volume = session.SimpleAudioVolume.GetMasterVolume()
                print(volume + volume_offset)
                session.SimpleAudioVolume.SetMasterVolume(volume + volume_offset, None)

                print(json.dumps({
                    'success': True,
                    'message': f'Updated {session.Process.name()} to {volume + volume_offset}'
                }))


def get_all_programs():
    program_list = []
    sessions = AudioUtilities.GetAllSessions()

    for session in sessions:
        if session.Process is not None and session.SimpleAudioVolume is not None:
            program_list.append({
                'name': session.Process.name(),
                'currentVolume': session.SimpleAudioVolume.GetMasterVolume()
            })

    print(json.dumps(list(program_list)))

def get_all_devices():
    deviceEnumerator = comtypes.CoCreateInstance(
    CLSID_MMDeviceEnumerator,
    IMMDeviceEnumerator,
    comtypes.CLSCTX_INPROC_SERVER)

    # https://stackoverflow.com/questions/32151133/how-to-get-pkey-device-friendlyname-if-its-not-defined
    deviceFriendlyNameGUID = GUID('{A45C254E-DF1C-4EFD-8020-67D146A850E0}')
    deviceFriendlyNameKey = PROPERTYKEY(fmtid=deviceFriendlyNameGUID, pid=14)
    
    audioEndpoints = deviceEnumerator.EnumAudioEndpoints(EDataFlow.eRender.value, DEVICE_STATE.ACTIVE.value)
    totalEndpoints = audioEndpoints.GetCount()

    audioEndpointNames = []
    for index, audioEndpoint in enumerate(audioEndpoints):
        if (index + 1) >= totalEndpoints: break
        
        propertyStore = audioEndpoint.OpenPropertyStore(STGM.STGM_READ.value)
        endpointName = propertyStore.GetValue(deviceFriendlyNameKey).GetValue()
        audioEndpointNames.append(endpointName)
    print(json.dumps(audioEndpointNames))

def get_device_by_name(device_name):
    deviceEnumerator = comtypes.CoCreateInstance(
    CLSID_MMDeviceEnumerator,
    IMMDeviceEnumerator,
    comtypes.CLSCTX_INPROC_SERVER)

    # https://stackoverflow.com/questions/32151133/how-to-get-pkey-device-friendlyname-if-its-not-defined
    deviceFriendlyNameGUID = GUID('{A45C254E-DF1C-4EFD-8020-67D146A850E0}')
    deviceFriendlyNameKey = PROPERTYKEY(fmtid=deviceFriendlyNameGUID, pid=14)
    
    audioEndpoints = deviceEnumerator.EnumAudioEndpoints(EDataFlow.eRender.value, DEVICE_STATE.ACTIVE.value)
    totalEndpoints = audioEndpoints.GetCount()

    for index, audioEndpoint in enumerate(audioEndpoints):
        if (index + 1) >= totalEndpoints: break
        
        propertyStore = audioEndpoint.OpenPropertyStore(STGM.STGM_READ.value)
        endpointName = propertyStore.GetValue(deviceFriendlyNameKey).GetValue()
        if endpointName == device_name: return audioEndpoint
    
    return None

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Volume Control Application')
    parser.add_argument('-l', '--device-list', action='store_true', help='Get a list of all currently active audio devices')

    parser.add_argument('-d', '--device', help='Sets the audio device to be controlled')
    parser.add_argument('-a', '--all', action='store_true', help='Get a list of all currently active programs ')
    parser.add_argument('-p', '--program', help='The name of the program to change the volume for')
    volume_control = parser.add_mutually_exclusive_group()
    volume_control.add_argument('-o', '--offset', type=float, help='The amount to change the volume of the selected program by')
    volume_control.add_argument('-s', '--set-volume', type=float, help='Value to set the volume of the selected program to')

    args = parser.parse_args()

    if args.device_list:
        get_all_devices()
        exit()

    if args.device is not None:
        device = get_device_by_name(args.device)
        if device is None:
            parser.error(f'Error {args.device} is an invalid device name')

        # Mokey Patch AudioUtilities to match the selected
        AudioUtilities.GetSpeakers = lambda: device

    if (args.all):
        get_all_programs()
        exit()

    if args.program is None:
        parser.error('Cannot update volume when no program is specified.')
    elif args.offset is None and args.set_volume is None:
        parser.error('Cannot update volume when no offset or volume is specified.')

    if (args.offset is not None):
        change_program_volume(args.program, args.offset)
    else:
        set_program_volume(args.program, args.set_volume)
