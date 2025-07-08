export default function getStepType(exercises) {
    if (exercises.length === 1) return exercises[0].exercise.name;

    if (exercises.length === 2) return "Bi-set";

    if (exercises.length === 3) return "Tri-set";

    if (exercises.length === 4) return "Quadri-set";
}