export default async function getAndSetInitialData(getRequest, setData, navigateState, navigate, destination) {
    const handleOnSuccess = (data) => {
        setData(data);
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