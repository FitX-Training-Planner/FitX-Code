export default function getStepType(exercises, t = null) {
    if (exercises.length === 1) {
        if (t) {
            return t(`databaseData.exercises.${exercises[0].exercise.ID}.name`) || exercises[0].exercise.name;
        }

        return exercises[0].exercise.name;
    };

    if (exercises.length === 2) return "Bi-set";

    if (exercises.length === 3) return "Tri-set";

    if (exercises.length === 4) return "Quadri-set";
}
