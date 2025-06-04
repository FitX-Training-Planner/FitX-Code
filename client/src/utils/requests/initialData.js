export default async function getAndSetInitialData(getRequest, setData, navigateState, navigate, destination, key) {
    const cachedData = sessionStorage.getItem(key);

    if (cachedData) {
        setData(JSON.parse(cachedData));

        return true;
    }

    const handleOnSuccess = (data) => {
        setData(data);

        sessionStorage.setItem(key, JSON.stringify(data));
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