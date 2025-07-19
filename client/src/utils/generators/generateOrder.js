export function getNextOrder(array, key) {
    if (!array.length) return 1;

    return Math.max(...array.map(item => item[key])) + 1;
}

export function removeAndReorder(array, key, valueToRemove) {
    return array
        .filter(item => item[key] !== valueToRemove)
        .map(item => ({
            ...item,
            [key]: item[key] > valueToRemove ? item[key] - 1 : item[key]
        }));
}