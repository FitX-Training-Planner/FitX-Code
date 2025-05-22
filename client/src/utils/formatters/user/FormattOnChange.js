import capitalize from "../text/capitalize";
import removeAccents from "../text/removeAccents";
import removeMultipleSpaces from "../text/removeMultipleSpaces";
import removeNumbers from "../text/removeNumbers";
import removeSpaces from "../text/removeSpaces";
import removeSymbols from "../text/removeSymbols";

export function formattEmailAndPassword(nameOrPassword) {
    return removeSpaces(removeAccents(nameOrPassword));
}

export function formattName(name) {
    return capitalize(removeNumbers(removeSymbols(removeMultipleSpaces(name.trimStart()))));
}