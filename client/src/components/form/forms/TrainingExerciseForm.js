import { useCallback, useMemo, useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import ClickableIcon from "../buttons/ClickableIcon";
import styles from "./TrainingExerciseForm.module.css";
import TextArea from "../fields/TextArea";
import { formattNameAndNote } from "../../../utils/formatters/training/formatOnChange";
import { isNoteValid } from "../../../utils/validators/trainingValidator";
import Select from "../fields/Select";
import Alert from "../../messages/Alert";
import { closestCorners, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "../../sortable/SortableItem";
import Title from "../../text/Title";

function TrainingExerciseForm({ exercise, setExercise, setExerciseError, handleSubmit, handleAddSet, handleModifySet, handleRemoveSet, exercises, exerciseEquipments, bodyPositions, pulleyHeights, pulleyAttachments, gripTypes, gripWidths, lateralities }) {
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
        note: false,
        video: false
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );
    
    const handleOnChangeExerciseData = useCallback((e, formattFunction, dataValidator) => {
        setExerciseError(false);
        
        const name = e.target.name;

        const value = formattFunction(e.target.value);
        
        const newExercise = {
            ...exercise, 
            [name]: value
        };

        setExercise(newExercise);

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: value !== "" && !dataValidator(value)
        }));
    }, [setExerciseError, exercise, setExercise]);

    const handleOnChangeTrainingFKs = useCallback((e, arrayName, valueFieldName) => {
        setExerciseError(false);
        
        const name = e.target.name;

        const value = e.target.value;

        const FK = arrays[arrayName].find(item => item[valueFieldName] === value).ID;

        const newExercise = {
            ...exercise, 
            [name]: FK
        };  

        setExercise(newExercise);

    }, [setExerciseError, arrays, exercise, setExercise]);

    const handleDragEnd = useCallback((e) => {
        const { active, over } = e;

        if (!over || active.id === over.id) return;

        const oldIndex = exercise.sets.findIndex(set => String(set.ID) === String(active.id));
        
        const newIndex = exercise.sets.findIndex(set => String(set.ID) === String(over.id));

        const newSets = arrayMove(exercise.sets, oldIndex, newIndex).map((set, index) => ({
            ...set,
            orderInExercise: index + 1
        }));

        setExercise(prevExercise => ({
            ...prevExercise,
            sets: newSets
        }));
    }, [exercise.sets, setExercise]);

    return (
        <form
            onSubmit={handleSubmit}
        >
            <Stack
                gap="3em"
            >
                <Stack
                    gap="2em"
                >
                    <Stack>
                        <Title
                            headingNumber={2}
                            text="Séries"
                        />

                        <Stack
                            className={styles.sets}
                        >
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCorners}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={exercise.sets.map(set => String(set.ID))}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {exercise.sets
                                        .sort((a, b) => a.orderInExercise - b.orderInExercise)
                                        .map(set => (
                                            <SortableItem
                                                key={set.ID} 
                                                id={String(set.ID)}
                                                className={styles.set}
                                            >
                                                <Stack>
                                                    <Stack
                                                        direction="row"
                                                        gap="0.5em"
                                                    >
                                                        <ClickableIcon
                                                            iconSrc="/images/icons/edit.png"
                                                            name="Editar"
                                                            handleClick={() => handleModifySet(set)}
                                                        />

                                                        <ClickableIcon
                                                            iconSrc="/images/icons/remove.png"
                                                            name="Remover"
                                                            handleClick={() => handleRemoveSet(set.orderInExercise)}
                                                        />
                                                    </Stack>

                                                    <span>
                                                        Série {set.orderInExercise}
                                                    </span>

                                                    <Stack>                                            
                                                        {set.minReps && set.maxReps ? (
                                                            <span>
                                                                Repetições: {`${set.minReps} - ${set.maxReps}`}
                                                            </span>    
                                                        ) : set.durationSeconds && (
                                                            <span>
                                                                Segundos em isometria: {set.durationSeconds}
                                                            </span>  
                                                        )}   

                                                        <span>
                                                            Segundos de descanso: {set.restSeconds}
                                                        </span>                                      
                                                    </Stack>
                                                </Stack>
                                            </SortableItem>
                                        ))
                                    }
                                </SortableContext>
                            </DndContext>
                        </Stack>

                        <ClickableIcon
                            iconSrc="/images/icons/add.png"
                            name="Adicionar Série"
                            handleClick={handleAddSet}
                        />
                    </Stack>

                    <Stack>
                        <p>
                            - Os campos obrigatórios são marcados com "*".
                        </p>

                        <Stack>
                            <Stack>
                                <Stack
                                    direction="row"
                                >
                                    <Select
                                        name="exerciseID"
                                        placeholder="Selecione o exercício"
                                        labelText="Exercício *"
                                        value={exercises.find(ex => String(ex.ID) === String(exercise.exerciseID))?.name}
                                        handleChange={(e) => {
                                            handleOnChangeTrainingFKs(e, "exercises", "name");
                                            setErrors(prevErrors => ({ ...prevErrors, video: false }));
                                            setExercise(prevExercise => ({ 
                                                ...prevExercise, 
                                                name: e.target.value
                                            }))
                                        }}
                                        options={exercises.map(ex => ex.name)}    
                                    />

                                    {exercise.exerciseID &&
                                        <Alert
                                            alertMessage={`
                                                Opção selecionada: 
                                                ${exercises.find(ex => 
                                                    String(ex.ID) === String(exercise.exerciseID))?.description
                                                }
                                            `}
                                        />
                                    }
                                </Stack>

                                {exercise.exerciseId &&
                                    <Stack>
                                        <Stack>
                                            <span>
                                                Músculos Primários:
                                            </span>

                                            <Stack>
                                                {exercises
                                                    .find(ex => String(ex.ID) === String(exercise.exerciseID))?.muscleGroups
                                                    .filter(group => group.isPrimary)
                                                    .map(group => (
                                                        <span>
                                                            {group.name}
                                                        </span>
                                                    ))
                                                }
                                            </Stack>
                                        </Stack>

                                        {exercises
                                            .find(ex => String(ex.ID) === String(exercise.exerciseID))?.muscleGroups
                                            .some(group => !group.isPrimary) && (
                                                <Stack>
                                                    <span>
                                                        Músculos Secundários:
                                                    </span>
                                                    
                                                    <Stack>
                                                        {exercises
                                                            .find(ex => String(ex.ID) === String(exercise.exerciseID))?.muscleGroups
                                                            .filter(group => !group.isPrimary)
                                                            .map(group => (
                                                                <span>
                                                                    {group.name}
                                                                </span>
                                                            ))
                                                        }
                                                    </Stack>
                                                </Stack>
                                            )
                                        }
                                    </Stack>
                                }
                            </Stack>

                            {!errors.video ? (
                                <video
                                    src={
                                        exercises.find(ex => 
                                            String(ex.ID) === String(exercise.exerciseID)
                                        )?.media.url
                                    }
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline
                                    onError={() => setErrors(prevErrors => ({ ...prevErrors, video: true }))}
                                    style={{
                                        height: "10em"
                                    }}
                                />
                            ) : (
                                <span>
                                    Vídeo não disponível
                                </span>
                            )}
                        </Stack>
                        
                        <Stack
                            direction="row"
                        >
                            <Select
                                name="exerciseEquipmentID"
                                placeholder="Selecione o equipamento"
                                labelText="Equipamento *"
                                value={exerciseEquipments.find(equipment => String(equipment.ID) === String(exercise.exerciseEquipmentID))?.name}
                                handleChange={(e) => handleOnChangeTrainingFKs(e, "exerciseEquipments", "name")}
                                options={exerciseEquipments.map(equipment => equipment.name)}    
                            />

                            {exercise.exerciseEquipmentID &&
                                <Alert
                                    alertMessage={`
                                        Opção selecionada: 
                                        ${exerciseEquipments.find(equipment => 
                                            String(equipment.ID) === String(exercise.exerciseEquipmentID))?.description
                                        }
                                    `}
                                />
                            }
                        </Stack>
                        
                        <Stack
                            direction="row"
                        >
                            <Select
                                name="bodyPositionID"
                                placeholder="Selecione a posição corporal"
                                labelText="Posição Corporal"
                                value={bodyPositions.find(position => String(position.ID) === String(exercise.bodyPositionID))?.description}
                                handleChange={(e) => handleOnChangeTrainingFKs(e, "bodyPositions", "description")}
                                options={bodyPositions.map(position => position.description)}    
                            />
                        </Stack>
                        
                        <Stack
                            direction="row"
                        >
                            <Select
                                name="pulleyHeightID"
                                placeholder="Selecione a altura da polia"
                                labelText="Altura da Polia"
                                value={pulleyHeights.find(height => String(height.ID) === String(exercise.pulleyHeightID))?.description}
                                handleChange={(e) => handleOnChangeTrainingFKs(e, "pulleyHeights", "description")}
                                options={pulleyHeights.map(height => height.description)}    
                            />
                        </Stack>
                        
                        <Stack
                            direction="row"
                        >
                            <Select
                                name="pulleyAttachmentID"
                                placeholder="Selecione o acessório da polia"
                                labelText="Acessório da Polia"
                                value={pulleyAttachments.find(attachment => String(attachment.ID) === String(exercise.pulleyAttachmentID))?.name}
                                handleChange={(e) => handleOnChangeTrainingFKs(e, "pulleyAttachments", "name")}
                                options={pulleyAttachments.map(attachment => attachment.name)}    
                            />
                        </Stack>
                        
                        <Stack
                            direction="row"
                        >
                            <Select
                                name="gripTypeID"
                                placeholder="Selecione o tipo da pegada"
                                labelText="Tipo da Pegada"
                                value={gripTypes.find(type => String(type.ID) === String(exercise.gripTypeID))?.name}
                                handleChange={(e) => handleOnChangeTrainingFKs(e, "gripTypes", "name")}
                                options={gripTypes.map(type => type.name)}    
                            />
                        </Stack>
                        
                        <Stack
                            direction="row"
                        >
                            <Select
                                name="gripWidthID"
                                placeholder="Selecione o espaçamento da pegada"
                                labelText="Espaçamento da Pegada"
                                value={gripWidths.find(width => String(width.ID) === String(exercise.gripWidthID))?.description}
                                handleChange={(e) => handleOnChangeTrainingFKs(e, "gripWidths", "description")}
                                options={gripWidths.map(width => width.description)}    
                            />
                        </Stack>
                        
                        <Stack
                            direction="row"
                        >
                            <Select
                                name="lateralityID"
                                placeholder="Selecione a forma de execução"
                                labelText="Forma de execução"
                                value={lateralities.find(laterality => String(laterality.ID) === String(exercise.lateralityID))?.type}
                                handleChange={(e) => handleOnChangeTrainingFKs(e, "lateralities", "type")}
                                options={lateralities.map(laterality => laterality.type)}    
                            />
                        </Stack>

                        <TextArea
                            name="note"
                            placeholder="Insira sua nota ou observação"
                            labelText="Nota"
                            value={exercise.note}
                            handleChange={(e) => handleOnChangeExerciseData(e, formattNameAndNote, isNoteValid)}
                            alertMessage="A nota não deve ter mais que 500 caracteres."
                            error={errors.note}
                            maxLength={500}
                        />
                    </Stack>
                </Stack>

                <SubmitFormButton
                    text="Criar ou Modificar Exercício"
                />
            </Stack>
        </form>
    );
}

export default TrainingExerciseForm;