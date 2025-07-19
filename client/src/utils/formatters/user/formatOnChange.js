import capitalize from "../text/capitalize";
import removeAccents from "../text/removeAccents";
import removeMultipleSpaces from "../text/removeMultipleSpaces";
import removeNonLettersAZ from "../text/removeNonLetters";
import removeNonNumbers from "../text/removeNonNumbers";
import removeNumbers from "../text/removeNumbers";
import removeSpaces from "../text/removeSpaces";
import removeSymbols from "../text/removeSymbols";

export function formattEmailAndPassword(nameOrPassword) {
    return removeSpaces(removeAccents(nameOrPassword));
}

export function formattName(name) {
    return capitalize(removeNumbers(removeSymbols(removeMultipleSpaces(name.trimStart()))));
}

export function formattCref(cref) {
    const digits = removeNonNumbers(cref.slice(0, 6));
    const letter = removeNonLettersAZ(cref.charAt(7)).toUpperCase();

    if (cref.length >= 7) {
        return `${digits}-${letter}`;
    }

    return digits;
}

export function formattTrainerDescription(description) {
    const formattedDescription = description
        .trimStart()
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")    
        .replace(/(\n)[ \t]+/g, "$1")

    return formattedDescription;
}