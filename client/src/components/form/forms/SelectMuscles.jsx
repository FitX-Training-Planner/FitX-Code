import Stack from "../../containers/Stack";
import SelectBoxes from "../fields/SelectBoxes";
import BodyMuscles from "../../layout/BodyMuscles";

function SelectMuscles({
    muscleGroups,
    setMuscleGroups,
    isMale,
    figuresDirection = "row"
}) {
    return (
        <Stack
            direction="row"
            justifyContent="center"
        >
            <SelectBoxes
                options={muscleGroups}
                setOptions={setMuscleGroups}
                isMultipleSelects
            />
            
            <BodyMuscles
                muscleGroups={muscleGroups}
                isMale={isMale}
                figuresDirection={figuresDirection}
            />
        </Stack>
    );
}

export default SelectMuscles;