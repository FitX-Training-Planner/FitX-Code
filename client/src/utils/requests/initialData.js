import { getCacheData, setCacheData } from "../cache/operations";

export default async function getAndSetInitialData(getRequest, setData, navigateStateError, navigate, errorDestination, key) {
    const cachedData = getCacheData(key);

    if (cachedData) {
        setData(cachedData);

        return true;
    }

    const setOnSuccess = (data) => {
        setData(data);

        setCacheData(key, data);
    };

    const handleOnError = () => {
        navigate(errorDestination, { state: navigateStateError });
    };
    
    const success = await new Promise((resolve) => {
        getRequest(
            () => resolve(true),
            () => {
                handleOnError();

                resolve(false);
            },
            key,
            setOnSuccess
        );
    });

    return success;
}
