import { useCallback } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import ClickableIcon from "../buttons/ClickableIcon";
import styles from "./TrainingStepForm.module.css";
import { closestCorners, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import SortableItem from "../../sortable/SortableItem";
import Title from "../../text/Title";

function TrainingStepForm({ trainingStep, setTrainingStep, handleSubmit, handleAddExercise, handleModifyExercise, handleRemoveExercise }) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = useCallback((e) => {
        const { active, over } = e;

        if (!over || active.id === over.id) return;

        const oldIndex = trainingStep.exercises.findIndex(exercise => String(exercise.ID) === String(active.id));
        
        const newIndex = trainingStep.exercises.findIndex(exercise => String(exercise.ID) === String(over.id));

        const newExercises = arrayMove(trainingStep.exercises, oldIndex, newIndex).map((exercise, index) => ({
            ...exercise,
            orderInStep: index + 1
        }));

        setTrainingStep(prevTrainingStep => ({
            ...prevTrainingStep,
            exercises: newExercises
        }));
    }, [trainingStep.exercises, setTrainingStep]);

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
                            text="Exercícios da Sequência"
                            textAlign="center"
                        />

                        <Stack
                            direction="row"
                            className={styles.exercises}
                        >    
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCorners}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={trainingStep.exercises.map(exercise => String(exercise.ID))}
                                    strategy={horizontalListSortingStrategy}
                                >
                                    {trainingStep.exercises
                                        .sort((a, b) => a.orderInStep - b.orderInStep)
                                        .map(exercise => (
                                            <SortableItem
                                                key={exercise.ID} 
                                                id={String(exercise.ID)}
                                                className={styles.exercise}
                                            >
                                                <Stack>
                                                    <Stack
                                                        direction="row"
                                                        gap="0.5em"
                                                    >
                                                        <ClickableIcon
                                                            iconSrc="/images/icons/edit.png"
                                                            name="Editar"
                                                            handleClick={() => handleModifyExercise(exercise)}
                                                        />

                                                        <ClickableIcon
                                                            iconSrc="/images/icons/remove.png"
                                                            name="Remover"
                                                            handleClick={() => handleRemoveExercise(exercise.orderInStep)}
                                                        />
                                                    </Stack>

                                                    <span>
                                                        {trainingStep.exercises.length > 1 ? (
                                                            `Exercício ${exercise.orderInStep} da sequência ${trainingStep.orderInDay}`
                                                        ) : (
                                                            `Exercício ${trainingStep.orderInDay}`
                                                        )}
                                                    </span>

                                                    <span>
                                                        {exercise.name}
                                                    </span>

                                                    <Stack>                                            
                                                        <span>
                                                            N° Séries: {exercise.sets.length}
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
                            name="Adicionar Exercício"
                            handleClick={handleAddExercise}
                        />
                    </Stack>
                </Stack>

                <SubmitFormButton
                    text="Criar ou Modificar sequência"
                />
            </Stack>
        </form>
    );
}

export default TrainingStepForm;