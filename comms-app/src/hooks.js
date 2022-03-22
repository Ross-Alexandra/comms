import { useEffect, useState } from "react";

const stateLoading = 'loading';
const stateReady = 'ready';
const stateError = 'error';
export function useAsyncData(asyncCallback) {
    const [response, setResponse] = useState({data: undefined, state: stateLoading, error: undefined});

    useEffect(() => {
        // Reset the data when the callback changes,
        // don't attempt to preserve as this will
        // confuse the user into thinking their
        // action hasn't started a process.
        setResponse({data: undefined, state: stateLoading, error: undefined});

        asyncCallback()
            .then(data => {
                setResponse({
                    data: data,
                    state: stateReady,
                    error: undefined
                })})
            .catch(error => {
                setResponse({
                    data: undefined,
                    state: stateError,
                    error: error
                });
            });
    }, [asyncCallback]);

    return response;
}
useAsyncData.loadingState = stateLoading;
useAsyncData.readyState = stateReady;
useAsyncData.errorState = stateError;
