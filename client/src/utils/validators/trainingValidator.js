import { hasEmptyFieldsInObject } from "./formValidator";

export function isNoteValid(note) {
    return note.length <= 500;
}

export function isCardioDurationValid(duration) {
    return Number(duration) >= 10 && Number(duration) <= 600;
}

export function isPlanNameValid(name) {
    return name.length >= 1 && name.length <= 50;
}

export function isRepsValid(minReps, maxReps) {
    const newMinReps = Number(minReps);
    
    const newMaxReps = Number(maxReps);

    return (
        !hasEmptyFieldsInObject({ minReps, maxReps }) &&
        newMinReps >= 1 && newMinReps <= 100 && 
        newMaxReps >= 1 && newMaxReps <= 100 && 
        newMinReps <= newMaxReps
    )
}

export function isRestValid(restSeconds) {
    return Number(restSeconds) >= 15 && Number(restSeconds) <= 600;
}

export function isDurationSetValid(durationSeconds) {
    return Number(durationSeconds) >= 5 && Number(durationSeconds) <= 600;
}
