import React from "react";
import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import styles from "./TrainingPlanExpandedCard.module.css";
import getStepType from "../../../utils/generators/stepType";
import FlexWrap from "../../containers/FlexWrap";
import SetInfo from "./SetInfo";
import ExerciseInfo from "./ExerciseInfo";
import CardioSessionInfo from "./CardioSessionInfo";
import TrainingDayInfo from "./TrainingDayInfo";
import TrainingPlanInfo from "./TrainingPlanInfo";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function TrainingPlanExpandedCard({
    planID,
    name,
    trainingNote,
    trainingDays = [],
    width
}) {
    const { t } = useTranslation();

    const user = useSelector(state => state.user);

    return (
        <Stack
            className={styles.training_plan_card}
        >
            <TrainingPlanInfo
                planID={planID}
                name={name}
                note={trainingNote}
                headingNumber={1}
                bgTitleColor="--theme-color"
            >
                <Stack
                    gap="0"
                >
                    {[...trainingDays]
                        .sort((a, b) => a.orderInPlan - b.orderInPlan)
                        .map((trainingDay, index) => (
                            <React.Fragment 
                                key={index}
                            >
                                <Stack
                                    justifyContent="start"
                                    className={styles.training_day} 
                                >
                                    <TrainingDayInfo
                                        name={trainingDay.name}
                                        orderInPlan={trainingDay.orderInPlan}
                                        note={trainingDay.note}
                                        headingNumber={2}
                                        bgTitleColor="--light-theme-color"
                                    >
                                        <Stack
                                            direction="column"
                                            alignItems="start"
                                        >
                                            {trainingDay.trainingSteps.length !== 0 && (
                                                <Stack>
                                                    <Title
                                                        headingNumber={3}
                                                        text={t("exercises")}
                                                    />

                                                    <hr/>

                                                    <Stack
                                                        gap="2em"
                                                        className={styles.steps}
                                                    >
                                                        {[...trainingDay.trainingSteps]
                                                            .sort((a, b) => a.orderInDay - b.orderInDay)
                                                            .map((step, index) => (
                                                                <React.Fragment 
                                                                    key={index}
                                                                >
                                                                    <Stack
                                                                        className={styles.step}
                                                                    >
                                                                        <Title
                                                                            headingNumber={4}
                                                                            text={`${step.orderInDay} - ${getStepType(step.exercises, user.config.isEnglish && t)}`}
                                                                            varColor="--theme-color"
                                                                        />

                                                                        <Stack
                                                                            gap="2em"
                                                                        >
                                                                            {[...step.exercises]
                                                                                .sort((a, b) => a.orderInStep - b.orderInStep)
                                                                                .map((exercise, index) => (
                                                                                    <React.Fragment 
                                                                                        key={index}
                                                                                    >
                                                                                        <ExerciseInfo
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
                                                                                            titleColor="--light-theme-color"
                                                                                            headingNumber={5}
                                                                                        >
                                                                                            <FlexWrap
                                                                                                direction="row"
                                                                                                gap="2em"
                                                                                                maxElements={width <= 640 ? "2" : "4"}
                                                                                            >
                                                                                                {[...exercise.sets]
                                                                                                    .sort((a, b) => a.orderInExercise - b.orderInExercise)
                                                                                                    .map((set, index) => (
                                                                                                        <React.Fragment 
                                                                                                            key={index}
                                                                                                        >
                                                                                                            <SetInfo
                                                                                                                orderInExercise={set.orderInExercise}
                                                                                                                minReps={set.minReps}
                                                                                                                maxReps={set.maxReps}
                                                                                                                durationSeconds={set.durationSeconds}
                                                                                                                restSeconds={set.restSeconds}
                                                                                                                setTypeName={
                                                                                                                    set.setType?.ID
                                                                                                                    ? (
                                                                                                                        user.config.isEnglish 
                                                                                                                        ? t(`databaseData.setTypes.${set.setType.ID}.name`) 
                                                                                                                        : set.setType.name
                                                                                                                    )
                                                                                                                    : undefined
                                                                                                                }
                                                                                                                trainingTechniqueName={
                                                                                                                    set.trainingTechnique?.ID
                                                                                                                    ? (
                                                                                                                        user.config.isEnglish 
                                                                                                                        ? t(`databaseData.trainingTechniques.${set.trainingTechnique.ID}.name`) 
                                                                                                                        : set.trainingTechnique.name
                                                                                                                    )
                                                                                                                    : undefined
                                                                                                                }
                                                                                                                headingNumber={6}
                                                                                                            />
                                                                                                        </React.Fragment>
                                                                                                    ))
                                                                                                }
                                                                                            </FlexWrap>
                                                                                        </ExerciseInfo>
                                                                                    </React.Fragment>
                                                                                ))
                                                                            }
                                                                        </Stack>
                                                                    </Stack>
                                                                </React.Fragment>
                                                            ))
                                                        }
                                                    </Stack>
                                                </Stack>
                                            )}
                                            
                                            {trainingDay.cardioSessions.length !== 0 && trainingDay.trainingSteps.length !== 0 && (
                                                <hr/>
                                            )}

                                            {trainingDay.cardioSessions.length !== 0 && (
                                                <Stack>
                                                    <Title
                                                        headingNumber={3}
                                                        text={t("cardioSessions")}
                                                    />

                                                    <hr/>

                                                    <Stack
                                                        gap="2em"
                                                    >
                                                        {[...trainingDay.cardioSessions].map((session, index) => (
                                                            <React.Fragment 
                                                                key={index}
                                                            >
                                                                <Stack
                                                                    className={styles.step}
                                                                >
                                                                    <CardioSessionInfo
                                                                        usedID={session.usedID}
                                                                        note={session.note}
                                                                        cardioOptionName={
                                                                            session.cardioOption?.ID
                                                                            ? (
                                                                                user.config.isEnglish 
                                                                                ? t(`databaseData.cardioOptions.${session.cardioOption.ID}.name`) 
                                                                                : session.cardioOption.name
                                                                            )
                                                                            : undefined
                                                                        }
                                                                        cardioIntensityType={
                                                                            session.cardioIntensity?.ID
                                                                            ? (
                                                                                user.config.isEnglish 
                                                                                ? t(`databaseData.cardioIntensities.${session.cardioIntensity.ID}.type`) 
                                                                                : session.cardioIntensity.type
                                                                            )
                                                                            : undefined
                                                                        }
                                                                        durationMinutes={session.durationMinutes}
                                                                        sessionTime={session.sessionTime}
                                                                        headingNumber={4}
                                                                        titleColor="--light-theme-color"
                                                                    />
                                                                </Stack>
                                                            </React.Fragment>
                                                        ))}
                                                    </Stack>
                                                </Stack>
                                            )}
                                        </Stack>
                                    </TrainingDayInfo>
                                </Stack>
                            </React.Fragment>
                        ))
                    }
                </Stack>
            </TrainingPlanInfo>
        </Stack>
    );
}

export default TrainingPlanExpandedCard;