import styled from "@emotion/styled";

export const DevicePageWrapper = styled.div`
    height: 300px;
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;

    border: 1px solid;
`;

export const DeviceProgramSelectors = styled.div`
    position: relative;
    width: 30%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    :after {
        position: absolute;
        content: ' ';
        background-color: rgba(0, 0, 0, .1);

        top: 10%;
        right: 0px;
        bottom: 10%;
        width: 1px;
        height: 80%;
    }
`;

export const Tools = styled.div`
    width: 70%;
    height: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const LevelSelectorBox = styled.div`
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;
`;

export const HotKeySelector = styled.div`
    padding: 20px 10px;
    width: 50%;

    display: grid;
    place-items: center;

    border: 1px dotted black;
    cursor: pointer;
`;

export const LevelSelector = styled.input`
    height: 50%;

    -webkit-appearance: slider-vertical;
`;