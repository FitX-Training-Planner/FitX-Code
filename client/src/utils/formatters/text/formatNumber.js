export function formatNumberShort(number) {
    const formattedNumber = Number(number);

    if (formattedNumber >= 1000000) {
        return (formattedNumber / 1000000)
            .toFixed(1)
            .replace(".0", "") + " Mi";
    }

    if (formattedNumber >= 1000) {
        return (formattedNumber / 1000)
            .toFixed(1)
            .replace(".0", "") + " Mil";
    }

    return String(formattedNumber);
}
