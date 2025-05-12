import capitalize from "../text/capitalize";
import removeAccents from "../text/RemoveAccents";
import removeMultipleSpaces from "../text/RemoveMultipleSpaces";
import removeNonNumbers from "../text/RemoveNonNumbers";
import removeNumbers from "../text/RemoveNumbers";
import removeSpaces from "../text/RemoveSpaces";
import removeSymbols from "../text/RemoveSymbols";

export function formattEmailAndPassword(nameOrPassword) {
    return removeSpaces(removeAccents(nameOrPassword));
}

export function formattContact(contact) {
    const newContact = removeNonNumbers(contact);
    const length = newContact.length;

    if (length === 0) {
        return "";
    } else if (length <= 2) {
        return `(${newContact}`;
    } else if (length <= 7) {
        return `(${newContact.slice(0, 2)}) ${newContact.slice(2)}`;
    } else if (length <= 11) {
        return `(${newContact.slice(0, 2)}) ${newContact.slice(2, 7)}-${newContact.slice(7)}`;
    } else {
        return `(${newContact.slice(0, 2)}) ${newContact.slice(2, 7)}-${newContact.slice(7, 11)}`;
    }
}

export function formattName(name) {
    return capitalize(removeNumbers(removeSymbols(removeMultipleSpaces(name.trimStart()))));
}