import { getCacheData, setCacheData } from "../cache/operations";

export default async function getAndSetInitialData(getRequest, setData, navigateState, navigate, destination, key) {
    const cachedData = getCacheData(key);

    if (cachedData) {
        setData(cachedData);

        return true;
    }

    const handleOnSuccess = (data) => {
        setData(data);

        setCacheData(key, data);
    };

    const handleOnError = () => {
        navigate(destination, { state: navigateState });
    };
    
    const success = await new Promise((resolve) => {
        getRequest(data => {
            handleOnSuccess(data);

            resolve(true);
        },
        () => {
            handleOnError();

            resolve(false);
        });
    });

    return success;
}
