export function getCacheData(key) {
    const cachedData = sessionStorage.getItem(key);
    
    if (!cachedData) return null;

    try {
        const data = JSON.parse(cachedData);

        const maxAge = 15 * 60 * 1000;
        const isValid = Date.now() - data.timestamp < maxAge;

        return isValid ? data.data : null;
    } catch {
        return null;
    }
}

export function setCacheData(key, data) {
    const cachedData = {
        timestamp: Date.now(),
        data
    };
    
    sessionStorage.setItem(key, JSON.stringify(cachedData));
}

export function cleanCacheData(key) {
    sessionStorage.removeItem(key);
}

export function removeItemFromCacheList(key, itemID) {
    const cachedData = getCacheData(key);
    
    if (!cachedData) return;

    try {
        const newList = cachedData.filter(item => String(item.ID) !== String(itemID));

        setCacheData(key, newList);
    } catch {
        return;
    }
}
