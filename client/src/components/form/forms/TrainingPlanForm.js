import React, { useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import TextArea from "../fields/TextArea";
import TextInput from "../fields/TextInput";
import { isNoteValid, isPlanNameValid } from "../../../utils/validators/trainingValidator";
import { formattNameAndNote } from "../../../utils/formatters/training/formatOnChange";
import styles from "./TrainingForm.module.css";
import ClickableIcon from "../buttons/ClickableIcon";
import SortableItem from "../../sortable/SortableItem";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import DndContextContainer from "../../sortable/DndContextContainer";
import Title from "../../text/Title";
import useWindowSize from "../../../hooks/useWindowSize";
import TrainingDayCard from "../../cards/training/TrainingDayCard";

function TrainingPlanForm({ trainingPlan, setTrainingPlan, setTrainingPlanError, handleSubmit, handleAddTrainingDay, handleDuplicateTrainingDay, handleModifyTrainingDay, handleRemoveTrainingDay }) {
    const { width } = useWindowSize();
    
    const [errors, setErrors] = useState({
        name: false,
        note: false
    });

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
                    <TextInput
                        name="name"
                        placeholder="Insira o nome do plano"
                        labelText="Nome do Plano de Treino *"
                        value={trainingPlan.name}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isPlanNameValid, trainingPlan, setTrainingPlan, setTrainingPlanError, setErrors)}
                        alertMessage="O nome deve ter entre 1 e 50 caracteres."
                        error={errors.name}
                        maxLength={50}
                    />

                    <Stack
                        gap="2em"
                    >
                        <Title
                            headingNumber={3}
                            text="Dias do Plano"
                        />

                        <Stack>
                            <DndContextContainer
                                stackDirection={
                                    width <= 640 ? (                                
                                        "column"
                                    ) : (
                                        trainingPlan.trainingDays.length <= 2
                                        ? "row" 
                                        : "column"
                                    )
                                }
                                itemsClassName={styles.training_days}
                                items={trainingPlan.trainingDays}
                                orderPropName="orderInPlan"
                                setObjectWithSortables={setTrainingPlan}
                                sortablesPropName="trainingDays"
                            >
                                {trainingPlan.trainingDays
                                    .sort((a, b) => a.orderInPlan - b.orderInPlan)
                                    .map(day => (
                                        <SortableItem 
                                            key={day.ID} 
                                            id={String(day.ID)}
                                            extraStyles={
                                                width <= 640 ? (                                
                                                    { maxWidth: "unset", minWidth: "100%" }
                                                ) : (
                                                    undefined
                                                )
                                            }
                                        >
                                            <TrainingDayCard
                                                name={day.name}
                                                isRestDay={day.isRestDay}
                                                orderInPlan={day.orderInPlan}
                                                note={day.note}
                                                trainingSteps={day.trainingSteps}
                                                cardioSessions={day.cardioSessions}
                                                headingNumber={4}
                                                handleModifyTrainingDay={() => handleModifyTrainingDay(day)}
                                                handleRemoveTrainingDay={() => handleRemoveTrainingDay(day.orderInPlan)}
                                                handleDuplicateTrainingDay={() => handleDuplicateTrainingDay(day)}
                                                viewWidth={width}
                                            />
                                        </SortableItem>
                                    ))
                                }
                            </DndContextContainer>

                            <ClickableIcon
                                iconSrc="/images/icons/add.png"
                                name="Adicionar Dia"
                                handleClick={handleAddTrainingDay}
                            />
                        </Stack>
                    </Stack>

                    <TextArea
                        name="note"
                        placeholder="Insira sua nota ou observação"
                        labelText="Nota"
                        value={trainingPlan.note}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isNoteValid, trainingPlan, setTrainingPlan, setTrainingPlanError, setErrors)}
                        alertMessage="A nota não deve ter mais que 500 caracteres."
                        error={errors.note}
                        maxLength={500}
                    />
                </Stack>

                <SubmitFormButton
                    text={`${trainingPlan.ID ? "Modificar" : "Criar"} Plano de Treino`}
                />
            </Stack>
        </form>
    );
}

export default TrainingPlanForm;