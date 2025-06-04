import capitalize from "../text/capitalize";
import removeMultipleSpaces from "../text/removeMultipleSpaces";
import removeNonNumbers from "../text/removeNonNumbers";

export function formattNameAndNote(nameOrNote) {
    return capitalize(removeMultipleSpaces(nameOrNote.trimStart()));
}

export function formattSecondsMinutesAndReps(secondsOrMinutes) {
    return removeNonNumbers(secondsOrMinutes).replace(/^0+/, "");
}
