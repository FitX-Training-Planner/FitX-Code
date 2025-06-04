import { useCallback, useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import TextArea from "../fields/TextArea";
import TextInput from "../fields/TextInput";
import { isNoteValid, isPlanNameValid } from "../../../utils/validators/trainingValidator";
import { formattNameAndNote } from "../../../utils/formatters/training/formatOnChange";
import styles from "./TrainingPlanForm.module.css";
import ClickableIcon from "../buttons/ClickableIcon";
import SortableItem from "../../sortable/SortableItem";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { closestCenter, DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";

function TrainingPlanForm({ trainingPlan, setTrainingPlan, setTrainingPlanError, handleSubmit, handleAddTrainingDay, handleModifyTrainingDay, handleRemoveTrainingDay }) {
    const [errors, setErrors] = useState({
        name: false,
        note: false
    });

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
    
    const handleOnChangePlanData = useCallback((e, formattFunction, dataValidator) => {
        setTrainingPlanError(false);
        
        const name = e.target.name;

        const value = formattFunction(e.target.value);
        
        const newPlan = {
            ...trainingPlan, 
            [name]: value
        };

        setTrainingPlan(newPlan);

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: value !== "" && !dataValidator(value)
        }));
    }, [setTrainingPlan, setTrainingPlanError, trainingPlan]);

    const handleDragEnd = useCallback((e) => {
        const { active, over } = e;

        if (!over || active.id === over.id) return;

        const oldIndex = trainingPlan.trainingDays.findIndex(day => String(day.ID) === String(active.id));
        
        const newIndex = trainingPlan.trainingDays.findIndex(day => String(day.ID) === String(over.id));

        const newTrainingDays = arrayMove(trainingPlan.trainingDays, oldIndex, newIndex).map((day, index) => ({
            ...day,
            orderInPlan: index + 1
        }));

        setTrainingPlan(prevTrainingPlan => ({
            ...prevTrainingPlan,
            trainingDays: newTrainingDays
        }));
    }, [trainingPlan.trainingDays, setTrainingPlan]);
    
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
                    <p>
                        - Os campos obrigatórios são marcados com "*".
                    </p>
                    
                    <TextInput
                        name="name"
                        placeholder="Insira o nome do plano"
                        labelText="Nome do Plano de Treino *"
                        value={trainingPlan.name}
                        handleChange={(e) => handleOnChangePlanData(e, formattNameAndNote, isPlanNameValid)}
                        alertMessage="O nome deve ter entre 1 e 50 caracteres."
                        error={errors.name}
                        maxLength={50}
                    />

                    <Stack>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={trainingPlan.trainingDays.map(day => String(day.ID))}
                                strategy={horizontalListSortingStrategy}
                            >
                                <ul 
                                    className={styles.training_days}
                                >
                                    {trainingPlan.trainingDays
                                        .sort((a, b) => a.orderInPlan - b.orderInPlan)
                                        .map(day => (
                                            <SortableItem 
                                                key={day.ID} 
                                                id={String(day.ID)}
                                                className={styles.training_day}
                                            >
                                                <Stack>
                                                    <Stack
                                                        direction="row"
                                                        gap="0.5em"
                                                    >
                                                        <ClickableIcon
                                                            iconSrc="/images/icons/edit.png"
                                                            name="Editar"
                                                            handleClick={() => handleModifyTrainingDay(day)}
                                                        />

                                                        <ClickableIcon
                                                            iconSrc="/images/icons/remove.png"
                                                            name="Remover"
                                                            handleClick={() => handleRemoveTrainingDay(day.orderInPlan)}
                                                        />
                                                    </Stack>

                                                    <span>
                                                        Dia {day.orderInPlan}
                                                    </span>

                                                    {day.isRestDay ? (
                                                        <p>
                                                            Dia de descanso
                                                        </p>
                                                    ) : (
                                                        <Stack>
                                                            <span>
                                                                N° Exercícios: {day.trainingSteps.length}
                                                            </span>

                                                            <span>
                                                                N° Cardios: {day.cardioSessions.length}
                                                            </span>
                                                        </Stack>
                                                    )}

                                                    <p>
                                                        {day.note}
                                                    </p>
                                                </Stack>
                                            </SortableItem>
                                        ))
                                    }
                                </ul>
                            </SortableContext>
                        </DndContext>

                        <ClickableIcon
                            iconSrc="/images/icons/add.png"
                            name="Adicionar Dia"
                            handleClick={handleAddTrainingDay}
                        />
                    </Stack>

                    <TextArea
                        name="note"
                        placeholder="Insira sua nota ou observação"
                        labelText="Nota"
                        value={trainingPlan.note}
                        handleChange={(e) => handleOnChangePlanData(e, formattNameAndNote, isNoteValid)}
                        alertMessage="A nota não deve ter mais que 500 caracteres."
                        error={errors.note}
                        maxLength={500}
                    />
                </Stack>

                <SubmitFormButton
                    text="Criar Plano de Treino"
                />
            </Stack>
        </form>
    );
}

export default TrainingPlanForm;