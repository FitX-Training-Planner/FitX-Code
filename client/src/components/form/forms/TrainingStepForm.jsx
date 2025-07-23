import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import ClickableIcon from "../buttons/ClickableIcon";
import styles from "./TrainingForm.module.css";
import SortableItem from "../../sortable/SortableItem";
import Title from "../../text/Title";
import DndContextContainer from "../../sortable/DndContextContainer";
import useWindowSize from "../../../hooks/useWindowSize";
import ExerciseCard from "../../cards/training/ExerciseCard";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function TrainingStepForm({
    trainingStep,
    setTrainingStep,
    handleSubmit,
    handleAddExercise,
    handleDuplicateExercise,
    handleModifyExercise,
    handleRemoveExercise
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    const user = useSelector(state => state.user);
    
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
                    <Title
                        headingNumber={3}
                        text={t("stepExercises")}
                    />

                    <Stack>
                        <DndContextContainer
                            stackDirection={
                                width <= 640 ? (                                
                                    trainingStep.exercises.length <= 2
                                    ? "row"
                                    : "column"
                                ) : (
                                    trainingStep.exercises.length <= 3 
                                    ? "row" 
                                    : "column"
                                )
                            }
                            itemsClassName={styles.exercises}
                            items={trainingStep.exercises}
                            orderPropName="orderInStep"
                            setObjectWithSortables={setTrainingStep}
                            sortablesPropName="exercises"
                        >
                            {trainingStep.exercises
                                .sort((a, b) => a.orderInStep - b.orderInStep)
                                .map(exercise => (
                                    <SortableItem
                                        key={exercise.ID} 
                                        id={String(exercise.ID)}
                                    >
                                        <ExerciseCard
                                            sets={exercise.sets}
                                            exerciseName={
                                                exercise.exercise?.ID
                                                ? (
                                                    user.config.isEnglish 
                                                    ? t(`databaseData.exercises.${exercise.exercise.ID}.name`) 
                                                    : exercise.exercise.name
                                                )
                                                : undefined
                                            }
                                            exerciseEquipmentName={
                                                exercise.exerciseEquipment?.ID
                                                ? (
                                                    user.config.isEnglish 
                                                    ? t(`databaseData.exerciseEquipments.${exercise.exerciseEquipment.ID}.name`) 
                                                    : exercise.exerciseEquipment.name
                                                )
                                                : undefined
                                            }
                                            pulleyHeightDescription={
                                                exercise.pulleyHeight?.ID
                                                ? (
                                                    user.config.isEnglish 
                                                    ? t(`databaseData.pulleyHeights.${exercise.pulleyHeight.ID}.description`) 
                                                    : exercise.pulleyHeight.description
                                                )
                                                : undefined
                                            }
                                            pulleyAttachmentName={
                                                exercise.pulleyAttachment?.ID
                                                ? (
                                                    user.config.isEnglish 
                                                    ? t(`databaseData.pulleyAttachments.${exercise.pulleyAttachment.ID}.name`) 
                                                    : exercise.pulleyAttachment.name
                                                )
                                                : undefined
                                            }
                                            gripTypeName={
                                                exercise.gripType?.ID
                                                ? (
                                                    user.config.isEnglish 
                                                    ? t(`databaseData.gripTypes.${exercise.gripType.ID}.name`) 
                                                    : exercise.gripType.name
                                                )
                                                : undefined
                                            }
                                            gripWidthDescription={
                                                exercise.gripWidth?.ID
                                                ? (
                                                    user.config.isEnglish 
                                                    ? t(`databaseData.gripWidths.${exercise.gripWidth.ID}.description`) 
                                                    : exercise.gripWidth.description
                                                )
                                                : undefined
                                            }
                                            bodyPositionDescription={
                                                exercise.bodyPosition?.ID
                                                ? (
                                                    user.config.isEnglish 
                                                    ? t(`databaseData.bodyPositions.${exercise.bodyPosition.ID}.description`) 
                                                    : exercise.bodyPosition.description
                                                )
                                                : undefined
                                            }
                                            lateralityType={
                                                exercise.laterality?.ID
                                                ? (
                                                    user.config.isEnglish 
                                                    ? t(`databaseData.lateralities.${exercise.laterality.ID}.type`) 
                                                    : exercise.laterality.type
                                                )
                                                : undefined
                                            }
                                            note={exercise.note}
                                            headingNumber={4}
                                            handleModifyExercise={() => handleModifyExercise(exercise)}
                                            handleRemoveExercise={() => handleRemoveExercise(exercise.orderInStep)}
                                            handleDuplicateExercise={() => handleDuplicateExercise(exercise)}
                                        />
                                    </SortableItem>
                                ))
                            }
                        </DndContextContainer>

                        <ClickableIcon
                            iconSrc="/images/icons/add.png"
                            name={t("addExercise")}
                            handleClick={handleAddExercise}
                        />
                    </Stack>
                </Stack>

                <SubmitFormButton
                    text={t("createTrainingStep")}
                />
            </Stack>
        </form>
    );
}

export default TrainingStepForm;