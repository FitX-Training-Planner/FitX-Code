export function removeNumbersAndSymbols(text) {
    return text.replace(/[^a-zA-Z]/g, "");
}
