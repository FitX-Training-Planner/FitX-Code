import { useCallback } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import ClickableIcon from "../buttons/ClickableIcon";
import styles from "./TrainingStepForm.module.css";
import { closestCenter, DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "../../sortable/SortableItem";

function TrainingStepForm({ trainingStep, setTrainingStep, handleSubmit, handleAddExercise, handleModifyExercise, handleRemoveExercise }) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 150, 
                tolerance: 5,
            },
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
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={trainingStep.exercises.map(exercise => String(exercise.ID))}
                                strategy={horizontalListSortingStrategy}
                            >
                                <ul 
                                    className={styles.exercises}
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

                                                    <Stack>                                            
                                                        <span>
                                                            N° Séries: {exercise.sets.length}
                                                        </span>                                               
                                                    </Stack>
                                                </Stack>
                                            </SortableItem>
                                        ))
                                    }
                                </ul>
                            </SortableContext>
                        </DndContext>

                        <ClickableIcon
                            iconSrc="/images/icons/add.png"
                            name="Adicionar Exercício"
                            handleClick={handleAddExercise}
                        />
                    </Stack>
                </Stack>

                <SubmitFormButton
                    text={`
                        Criar ou Modificar 
                        ${trainingStep.exercises.length > 1 ? "sequência" : "Exercício"}
                    `}
                />
            </Stack>
        </form>
    );
}

export default TrainingStepForm;