export default function removeSymbols(text) {
    return text.replace(/[^\p{L}\p{N}\s]/gu, "");
}