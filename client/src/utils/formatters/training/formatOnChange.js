import removeMultipleSpaces from "../text/removeMultipleSpaces";
import removeNonNumbers from "../text/removeNonNumbers";

export function formattNameAndNote(nameOrNote) {
    return removeMultipleSpaces(nameOrNote.trimStart());
}

export function formattSecondsMinutesAndReps(secondsOrMinutes) {
    return removeNonNumbers(secondsOrMinutes).replace(/^0+/, "");
}