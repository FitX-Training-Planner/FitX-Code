export default function removeNonLettersAZ(text) {
    return text.replace(/[^a-zA-Z]/g, "");
}
