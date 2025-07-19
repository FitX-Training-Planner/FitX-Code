import { useState } from "react";
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
import { useTranslation } from "react-i18next";

function TrainingPlanForm({
    trainingPlan,
    setTrainingPlan,
    setTrainingPlanError,
    handleSubmit,
    handleAddTrainingDay,
    handleDuplicateTrainingDay,
    handleModifyTrainingDay,
    handleRemoveTrainingDay
}) {
    const { t } = useTranslation();

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
                    - {t("mandatoryFields")}
                </p>
                
                <Stack
                    gap="2em"
                >    
                    <TextInput
                        name="name"
                        placeholder={t("trainingPlanNamePlaceholder")}
                        labelText={`${t("trainingPlanName")} *`}
                        value={trainingPlan.name}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isPlanNameValid, trainingPlan, setTrainingPlan, setTrainingPlanError, setErrors)}
                        alertMessage={t("alertTrainingPlanName")}
                        error={errors.name}
                        maxLength={50}
                    />

                    <Stack
                        gap="2em"
                    >
                        <Title
                            headingNumber={3}
                            text={t("trainingPlanDays")}
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
                                name={t("addTrainingDay")}
                                handleClick={handleAddTrainingDay}
                            />
                        </Stack>
                    </Stack>

                    <TextArea
                        name="note"
                        placeholder={t("notePlaceholder")}
                        labelText={t("note")}
                        value={trainingPlan.note}
                        handleChange={(e) => handleOnChangeTextField(e, formattNameAndNote, isNoteValid, trainingPlan, setTrainingPlan, setTrainingPlanError, setErrors)}
                        alertMessage={t("alertNote500")}
                        error={errors.note}
                        maxLength={500}
                    />
                </Stack>

                <SubmitFormButton
                    text={`${trainingPlan.ID ? t("modify") : t("create")} ${t("trainingPlan")}`}
                />
            </Stack>
        </form>
    );
}

export default TrainingPlanForm;