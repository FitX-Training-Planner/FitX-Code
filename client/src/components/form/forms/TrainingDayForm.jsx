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
import { useTranslation } from "react-i18next";

function TrainingDayForm({
    trainingDay,
    setTrainingDay,
    setTrainingDayError,
    handleSubmit,
    handleChangeDayType,
    handleAddTrainingStep,
    handleDuplicateStep,
    handleModifyTrainingStep,
    handleRemoveTrainingStep,
    handleAddCardioSession,
    handleDuplicateCardioSession,
    handleModifyCardioSession,
    handleRemoveCardioSession
}) {
    const { t } = useTranslation();
    
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
                    - t("mandatoryFields")
                </p>
                
                <Stack
                    gap="2em"
                >
                    <CheckBoxInput
                        name="isRestDay"
                        labelText={t("restDay")}
                        isChecked={trainingDay.isRestDay}
                        handleChange={handleChangeDayType}
                        description={t("restDayDescription")}
                    />

                    {!trainingDay.isRestDay &&
                        <>
                            <TextInput
                                name="name"
                                placeholder={t("trainingDayNamePlaceholder")}
                                labelText={`${t("trainingDayName")} *`}
                                value={trainingDay.name}
                                handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isPlanNameValid, trainingDay, setTrainingDay, setTrainingDayError, setErrors)}
                                alertMessage={t("alertTrainingDayName")}
                                error={errors.name}
                                maxLength={50}
                            />

                            <Stack
                                gap="2em"
                            >
                                <Title
                                    headingNumber={3}
                                    text={t("trainingSteps")}
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
                                        name={t("addTrainingStep")}
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
                            text={t("cardioSessions")}
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
                                name={t("addCardioSession")}
                                handleClick={handleAddCardioSession}
                            />
                        </Stack>
                    </Stack>

                    <TextArea
                        name="note"
                        placeholder={t("notePlaceholder")}
                        labelText={t("note")}
                        value={trainingDay.note}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isNoteValid, trainingDay, setTrainingDay, setTrainingDayError, setErrors)}
                        alertMessage={t("alertNote500")}
                        error={errors.note}
                        maxLength={500}
                    />
                </Stack>

                <SubmitFormButton
                    text={t("createTrainingDay")}
                />
            </Stack>
        </form>
    );
}

export default TrainingDayForm;