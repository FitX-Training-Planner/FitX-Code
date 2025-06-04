import { useCallback, useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import TextArea from "../fields/TextArea";
import { isNoteValid } from "../../../utils/validators/trainingValidator";
import { formattNameAndNote } from "../../../utils/formatters/training/formatOnChange";
import styles from "./TrainingDayForm.module.css";
import ClickableIcon from "../buttons/ClickableIcon";
import CheckBoxInput from "../fields/CheckBoxInput";
import Title from "../../text/Title";
import { closestCorners, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "../../sortable/SortableItem";

function TrainingDayForm({ trainingDay, setTrainingDay, setTrainingDayError, handleSubmit, handleChangeDayType, handleAddTrainingStep, handleModifyTrainingStep, handleRemoveTrainingStep, handleAddCardioSession, handleModifyCardioSession, handleRemoveCardioSession }) {
    const [errors, setErrors] = useState({
        note: false
    });
    
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleOnChangeDayData = useCallback((e, formattFunction, dataValidator) => {
        setTrainingDayError(false);
        
        const name = e.target.name;

        const value = formattFunction(e.target.value);
        
        const newDay = {
            ...trainingDay, 
            [name]: value
        };

        setTrainingDay(newDay);

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: value !== "" && !dataValidator(value)
        }));
    }, [setTrainingDay, setTrainingDayError, trainingDay]);

    const handleDragEnd = useCallback((e) => {
        const { active, over } = e;

        if (!over || active.id === over.id) return;

        const oldIndex = trainingDay.trainingSteps.findIndex(step => String(step.ID) === String(active.id));
        
        const newIndex = trainingDay.trainingSteps.findIndex(step => String(step.ID) === String(over.id));

        const newTrainingSteps = arrayMove(trainingDay.trainingSteps, oldIndex, newIndex).map((step, index) => ({
            ...step,
            orderInDay: index + 1
        }));

        setTrainingDay(prevTrainingDay => ({
            ...prevTrainingDay,
            trainingSteps: newTrainingSteps
        }));
    }, [trainingDay.trainingSteps, setTrainingDay]);
    
    return (
        <form
            onSubmit={handleSubmit}
        >
            <Stack
                gap="3em"
            >
                <CheckBoxInput
                    name="isRestDay"
                    labelText="Dia de descanso"
                    isChecked={trainingDay.isRestDay}
                    handleChange={handleChangeDayType}
                    description="Ative para que esse dia seja para descansar."
                />

                <Stack
                    gap="2em"
                >
                    <Stack>
                        {!trainingDay.isRestDay &&
                            <Stack>
                                <Title
                                    headingNumber={2}
                                    text="Treino"
                                />

                                <Stack
                                    className={styles.training_steps}
                                >
                                    <DndContext 
                                        sensors={sensors}
                                        collisionDetection={closestCorners}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={trainingDay.trainingSteps.map(step => String(step.ID))}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {trainingDay.trainingSteps
                                                .sort((a, b) => a.orderInDay - b.orderInDay)
                                                .map(step => (
                                                    <SortableItem
                                                        key={step.ID} 
                                                        id={String(step.ID)}
                                                        className={styles.training_step}
                                                    >
                                                        <Stack>
                                                            <Stack
                                                                direction="row"
                                                                gap="0.5em"
                                                            >
                                                                <ClickableIcon
                                                                    iconSrc="/images/icons/edit.png"
                                                                    name="Editar"
                                                                    handleClick={() => handleModifyTrainingStep(step)}
                                                                />

                                                                <ClickableIcon
                                                                    iconSrc="/images/icons/remove.png"
                                                                    name="Remover"
                                                                    handleClick={() => handleRemoveTrainingStep(step.orderInDay)}
                                                                />
                                                            </Stack>

                                                            <span>
                                                                {step.exercises.length > 1 ? (
                                                                    `Sequência ${step.orderInDay}`
                                                                ) : (
                                                                    `Exercício ${step.orderInDay}`
                                                                )}
                                                            </span>

                                                            <Stack>
                                                                {step.exercises.length > 1 ? (
                                                                    <span>
                                                                        N° Exercícios: {step.exercises.length}
                                                                    </span>
                                                                ) : (
                                                                    <span>
                                                                        N° Séries: {step.exercises[0] ? step.exercises[0].sets.length : "0"}
                                                                    </span>                                               
                                                                )}
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
                                    handleClick={handleAddTrainingStep}
                                />
                            </Stack>
                        }

                        <Stack>
                            <Title
                                headingNumber={2}
                                text="Cardio"
                            />

                            <ul
                                gap="0"
                                className={styles.training_steps}
                            >
                                {trainingDay.cardioSessions.map(session => (
                                    <li
                                        key={session.ID}
                                    >
                                        <Stack>
                                            <Stack
                                                direction="row"
                                                gap="0.5em"
                                            >
                                                <ClickableIcon
                                                    iconSrc="/images/icons/edit.png"
                                                    name="Editar"
                                                    handleClick={() => handleModifyCardioSession(session)}
                                                />

                                                <ClickableIcon
                                                    iconSrc="/images/icons/remove.png"
                                                    name="Remover"
                                                    handleClick={() => handleRemoveCardioSession(session.ID)}
                                                />
                                            </Stack>

                                            <span>
                                                Cardio {session.ID}
                                            </span>

                                            <Stack
                                                gap="0.5em"
                                            >
                                                <span>
                                                    Duração: {session.durationMinutes}
                                                </span>

                                                {session.sessionTime &&
                                                    <span>
                                                        Horário: {session.sessionTime}
                                                    </span>
                                                }
                                            </Stack>
                                        </Stack>
                                    </li>
                                ))}
                            </ul>

                            <ClickableIcon
                                iconSrc="/images/icons/add.png"
                                name="Adicionar Cardio"
                                handleClick={handleAddCardioSession}
                            />
                        </Stack>
                    </Stack>

                    <TextArea
                        name="note"
                        placeholder="Insira sua nota ou observação"
                        labelText="Nota"
                        value={trainingDay.note}
                        handleChange={(e) => handleOnChangeDayData(e, formattNameAndNote, isNoteValid)}
                        alertMessage="A nota não deve ter mais que 500 caracteres."
                        error={errors.note}
                        maxLength={500}
                    />
                </Stack>

                <SubmitFormButton
                    text="Criar ou Modificar Dia"
                />
            </Stack>
        </form>
    );
}

export default TrainingDayForm;