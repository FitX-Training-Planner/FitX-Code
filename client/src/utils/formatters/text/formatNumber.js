export function formatNumberShort(number) {
    const formattedNumber = Number(number);

    if (formattedNumber >= 1000000) {
        return (formattedNumber / 1000000)
            .toFixed(1)
            .replace(".0", "") + " M";
    }

    if (formattedNumber >= 1000) {
        return (formattedNumber / 1000)
            .toFixed(1)
            .replace(".0", "") + " K";
    }

    return String(formattedNumber);
}
