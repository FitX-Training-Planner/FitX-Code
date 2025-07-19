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
                                            exerciseName={exercise.exercise?.name}
                                            exerciseEquipmentName={exercise.exerciseEquipment?.name}
                                            pulleyHeightDescription={exercise.pulleyHeight?.description}
                                            pulleyAttachmentName={exercise.pulleyAttachment?.name}
                                            gripTypeName={exercise.gripType?.name}
                                            gripWidthDescription={exercise.gripWidth?.description}
                                            bodyPositionDescription={exercise.bodyPosition?.description}
                                            lateralityType={exercise.laterality?.type}
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