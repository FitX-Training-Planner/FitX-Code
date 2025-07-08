import { useCallback, useMemo, useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import ClickableIcon from "../buttons/ClickableIcon";
import styles from "./TrainingForm.module.css";
import TextArea from "../fields/TextArea";
import { formattNameAndNote } from "../../../utils/formatters/training/formatOnChange";
import { isNoteValid } from "../../../utils/validators/trainingValidator";
import Select from "../fields/Select";
import SortableItem from "../../sortable/SortableItem";
import Title from "../../text/Title";
import { handleOnChangeSelect, handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import DndContextContainer from "../../sortable/DndContextContainer";
import useWindowSize from "../../../hooks/useWindowSize";
import SetCard from "../../cards/training/SetCard";

function TrainingExerciseForm({ exercise, setExercise, setExerciseError, handleSubmit, handleAddSet, handleDuplicateSet, handleModifySet, handleRemoveSet, exercises, exerciseEquipments, bodyPositions, pulleyHeights, pulleyAttachments, gripTypes, gripWidths, lateralities }) {
    const { width } = useWindowSize();
    
    const arrays = useMemo(() => ({
        "exercises": exercises,
        "exerciseEquipments": exerciseEquipments,
        "bodyPositions": bodyPositions,
        "pulleyHeights": pulleyHeights,
        "pulleyAttachments": pulleyAttachments,
        "gripTypes": gripTypes,
        "gripWidths": gripWidths,
        "lateralities": lateralities
    }), [bodyPositions, exerciseEquipments, exercises, gripTypes, gripWidths, lateralities, pulleyAttachments, pulleyHeights]);
    
    const [errors, setErrors] = useState({
        note: false
    });

    const handleOnChangeExercise = useCallback((e) => {
        handleOnChangeSelect(e, arrays.exercises, "name", exercise, setExercise, setExerciseError);

        if (exercises.find(ex => ex.name === e.target.value)?.isFixed) {
            setExercise(prevExercise => ({
                ...prevExercise,
                exerciseEquipment: null,
                bodyPosition: null,
                pulleyHeight: null,
                pulleyAttachment: null,
                gripType: null,
                gripWidth: null,
                laterality: null
            }));
        }
    }, [arrays.exercises, exercise, exercises, setExercise, setExerciseError]);

    return (
        <form
            onSubmit={handleSubmit}
        >
            <Stack
                gap="3em"
            >
                <p>
                    - Os campos obrigatórios são marcados com "*".
                </p>
                
                <Stack
                    gap="2em"
                >
                    <Stack
                        gap="2em"
                    >
                        <Title
                            headingNumber={3}
                            text="Séries"
                        />

                        <Stack>
                            <DndContextContainer
                                stackDirection={
                                    width <= 640 ? (                                
                                        exercise.sets.length <= 3 
                                        ? "row"
                                        : "column"
                                    ) : (
                                        exercise.sets.length <= 4 
                                        ? "row" 
                                        : "column"
                                    )
                                }
                                itemsClassName={styles.sets}
                                items={exercise.sets}
                                orderPropName="orderInExercise"
                                setObjectWithSortables={setExercise}
                                sortablesPropName="sets"
                            >
                                {exercise.sets
                                    .sort((a, b) => a.orderInExercise - b.orderInExercise)
                                    .map(set => (
                                        <SortableItem
                                            key={set.ID} 
                                            id={String(set.ID)}
                                        >
                                            <SetCard
                                                restSeconds={set.restSeconds}
                                                durationSeconds={set.durationSeconds}
                                                trainingTechniqueName={set.trainingTechnique?.name}
                                                setTypeName={set.setType?.name}
                                                minReps={set.minReps}
                                                maxReps={set.maxReps}
                                                orderInExercise={set.orderInExercise}
                                                headingNumber={4}
                                                handleModifySet={() => handleModifySet(set)}
                                                handleRemoveSet={() => handleRemoveSet(set.orderInExercise)}
                                                handleDuplicateSet={() => handleDuplicateSet(set)}
                                            />
                                        </SortableItem>
                                    ))
                                }
                            </DndContextContainer>

                            <ClickableIcon
                                iconSrc="/images/icons/add.png"
                                name="Adicionar Série"
                                handleClick={handleAddSet}
                            />
                        </Stack>
                    </Stack>

                    <Select
                        name="exercise"
                        placeholder="Selecione o exercício"
                        labelText="Exercício *"
                        value={exercises.find(ex => String(ex.ID) === String(exercise.exercise?.ID))?.name}
                        handleChange={handleOnChangeExercise}
                        options={exercises.map(ex => ex.name)}    
                    />

                    {!exercise.exercise?.isFixed ? (
                        <>
                            <Select
                                name="exerciseEquipment"
                                placeholder="Selecione o equipamento"
                                labelText="Equipamento *"
                                value={exerciseEquipments.find(equipment => String(equipment.ID) === String(exercise.exerciseEquipment?.ID))?.name}
                                handleChange={(e) => {
                                    handleOnChangeSelect(e, arrays.exerciseEquipments, "name", exercise, setExercise, setExerciseError);
                                    setExercise(prevExercise => ({ ...prevExercise, pulleyHeight: {}, pulleyAttachment: {} }));
                                }}
                                options={exerciseEquipments.map(equipment => equipment.name)}    
                            />

                            <Select
                                name="bodyPosition"
                                placeholder="Selecione a posição corporal"
                                labelText="Posição Corporal"
                                value={bodyPositions.find(position => String(position.ID) === String(exercise.bodyPosition?.ID))?.description}
                                handleChange={(e) => handleOnChangeSelect(e, arrays.bodyPositions, "description", exercise, setExercise, setExerciseError)}
                                options={bodyPositions.map(position => position.description)}    
                            />

                            {exercise.exerciseEquipment?.name.toLowerCase() === "polia" && (
                                <>
                                    <Select
                                        name="pulleyHeight"
                                        placeholder="Selecione a altura da polia"
                                        labelText="Altura da Polia"
                                        value={pulleyHeights.find(height => String(height.ID) === String(exercise.pulleyHeight?.ID))?.description}
                                        handleChange={(e) => handleOnChangeSelect(e, arrays.pulleyHeights, "description", exercise, setExercise, setExerciseError)}
                                        options={pulleyHeights.map(height => height.description)}    
                                    />
                                    
                                    <Select
                                        name="pulleyAttachment"
                                        placeholder="Selecione o acessório da polia"
                                        labelText="Acessório da Polia"
                                        value={pulleyAttachments.find(attachment => String(attachment.ID) === String(exercise.pulleyAttachment?.ID))?.name}
                                        handleChange={(e) => handleOnChangeSelect(e, arrays.pulleyAttachments, "name", exercise, setExercise, setExerciseError)}
                                        options={pulleyAttachments.map(attachment => attachment.name)}    
                                    />
                                </>
                            )} 

                            <Select
                                name="gripType"
                                placeholder="Selecione o tipo da pegada"
                                labelText="Tipo da Pegada"
                                value={gripTypes.find(type => String(type.ID) === String(exercise.gripType?.ID))?.name}
                                handleChange={(e) => handleOnChangeSelect(e, arrays.gripTypes, "name", exercise, setExercise, setExerciseError)}
                                options={gripTypes.map(type => type.name)}    
                            />

                            <Select
                                name="gripWidth"
                                placeholder="Selecione o espaçamento da pegada"
                                labelText="Espaçamento da Pegada"
                                value={gripWidths.find(width => String(width.ID) === String(exercise.gripWidth?.ID))?.description}
                                handleChange={(e) => handleOnChangeSelect(e, arrays.gripWidths, "description", exercise, setExercise, setExerciseError)}
                                options={gripWidths.map(width => width.description)}    
                            />

                            <Select
                                name="laterality"
                                placeholder="Selecione a forma de execução"
                                labelText="Forma de execução"
                                value={lateralities.find(laterality => String(laterality.ID) === String(exercise.laterality?.ID))?.type}
                                handleChange={(e) => handleOnChangeSelect(e, arrays.lateralities, "type", exercise, setExercise, setExerciseError)}
                                options={lateralities.map(laterality => laterality.type)}    
                            />
                        </>
                    ) : (
                        <p
                            className={styles.exercise_alert}
                        >
                            Esse exercício não pode ser personalizado!
                        </p>
                    )}

                    <TextArea
                        name="note"
                        placeholder="Insira sua nota ou observação"
                        labelText="Nota"
                        value={exercise.note}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isNoteValid, exercise, setExercise, setExerciseError, setErrors)}
                        alertMessage="A nota não deve ter mais que 500 caracteres."
                        error={errors.note}
                        maxLength={500}
                    />
                </Stack>

                <SubmitFormButton
                    text="Criar ou Modificar Exercício"
                />
            </Stack>
        </form>
    );
}

export default TrainingExerciseForm;