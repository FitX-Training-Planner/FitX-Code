import { useState } from "react";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import TextArea from "../fields/TextArea";
import { isNoteValid, isPlanNameValid } from "../../../utils/validators/trainingValidator";
import { formattNameAndNote } from "../../../utils/formatters/training/formatOnChange";
import styles from "./TrainingForm.module.css";
import ClickableIcon from "../buttons/ClickableIcon";
import CheckBoxInput from "../fields/CheckBoxInput";
import Title from "../../text/Title";
import SortableItem from "../../sortable/SortableItem";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import DndContextContainer from "../../sortable/DndContextContainer";
import TextInput from "../fields/TextInput";
import StepCard from "../../cards/training/StepCard";
import useWindowSize from "../../../hooks/useWindowSize";
import CardioSessionCard from "../../cards/training/CardioSessionCard";

function TrainingDayForm({ trainingDay, setTrainingDay, setTrainingDayError, handleSubmit, handleChangeDayType, handleAddTrainingStep, handleDuplicateStep, handleModifyTrainingStep, handleRemoveTrainingStep, handleAddCardioSession, handleDuplicateCardioSession, handleModifyCardioSession, handleRemoveCardioSession }) {
    const { width } = useWindowSize();
    
    const [errors, setErrors] = useState({
        note: false,
        name: false
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
                    <CheckBoxInput
                        name="isRestDay"
                        labelText="Dia de descanso"
                        isChecked={trainingDay.isRestDay}
                        handleChange={handleChangeDayType}
                        description="Ative para que esse dia seja para descansar."
                    />

                    {!trainingDay.isRestDay &&
                        <>
                            <TextInput
                                name="name"
                                placeholder="Insira o nome do treino"
                                labelText="Nome do Treino *"
                                value={trainingDay.name}
                                handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isPlanNameValid, trainingDay, setTrainingDay, setTrainingDayError, setErrors)}
                                alertMessage="O nome deve ter entre 1 e 50 caracteres."
                                error={errors.name}
                                maxLength={50}
                            />

                            <Stack
                                gap="2em"
                            >
                                <Title
                                    headingNumber={3}
                                    text="Sequências/Exercícios do Dia"
                                />

                                <Stack>
                                    <DndContextContainer
                                        stackDirection={
                                            width <= 640 ? (                                
                                                trainingDay.trainingSteps.length <= 2
                                                ? "row"
                                                : "column"
                                            ) : (
                                                trainingDay.trainingSteps.length <= 3
                                                ? "row" 
                                                : "column"
                                            )
                                        }
                                        itemsClassName={styles.training_steps}
                                        items={trainingDay.trainingSteps}
                                        orderPropName="orderInDay"
                                        setObjectWithSortables={setTrainingDay}
                                        sortablesPropName="trainingSteps"
                                    >
                                        {trainingDay.trainingSteps
                                            .sort((a, b) => a.orderInDay - b.orderInDay)
                                            .map(step => (
                                                <SortableItem
                                                    key={step.ID} 
                                                    id={String(step.ID)}
                                                >
                                                    <StepCard
                                                        exercises={step.exercises}
                                                        orderInDay={step.orderInDay}
                                                        handleModifyStep={() => handleModifyTrainingStep(step)}
                                                        handleRemoveStep={() => handleRemoveTrainingStep(step.orderInDay)}
                                                        handleDuplicateStep={() => handleDuplicateStep(step)}
                                                        headingNumber={4}
                                                    />
                                                </SortableItem>
                                            ))
                                        }
                                    </DndContextContainer>

                                    <ClickableIcon
                                        iconSrc="/images/icons/add.png"
                                        name="Adicionar Sequência/Exercício"
                                        handleClick={handleAddTrainingStep}
                                    />
                                </Stack>
                            </Stack>
                        </>
                    }
                    
                    <Stack
                        gap="2em"
                    >
                        <Title
                            headingNumber={3}
                            text="Sessões de Cardio do Dia"
                        />

                        <Stack>
                            <Stack
                                gap="1em"
                                direction={
                                    width <= 640 ? ( 
                                        width <= 440 
                                        ? "column"
                                        : (
                                            trainingDay.cardioSessions.length <= 3
                                            ? "row"
                                            : "column"
                                        )  
                                    ) : (
                                        trainingDay.cardioSessions.length <= 4
                                        ? "row" 
                                        : "column"
                                    )
                                }
                                justifyContent="center"
                            >
                                {trainingDay.cardioSessions.map((session, index) => (
                                    <div
                                        key={index}
                                        className={styles.cardio_session}
                                        style={width <= 440 ? { maxWidth: "unset" } : undefined}
                                    >
                                        <CardioSessionCard
                                            usedID={session.usedID}
                                            note={session.note}
                                            cardioOptionName={session.cardioOption?.name}
                                            cardioIntensityType={session.cardioIntensity?.type}
                                            durationMinutes={session.durationMinutes}
                                            sessionTime={session.sessionTime}
                                            headingNumber={4}
                                            handleModifyCardioSession={() => handleModifyCardioSession(session)}
                                            handleRemoveCardioSession={() => handleRemoveCardioSession(session.usedID)}
                                            handleDuplicateCardioSession={() => handleDuplicateCardioSession(session)}
                                        />
                                    </div>
                                ))}
                            </Stack>

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
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isNoteValid, trainingDay, setTrainingDay, setTrainingDayError, setErrors)}
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