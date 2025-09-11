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
import { translateDatabaseData } from "../../../utils/formatters/text/translate";

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
                                                                                            exerciseName={translateDatabaseData(exercise.exercise, "exercises", "name", user, t)}
                                                                                            exerciseEquipmentName={translateDatabaseData(exercise.exerciseEquipment, "exerciseEquipments", "name", user, t)}
                                                                                            pulleyHeightDescription={translateDatabaseData(exercise.pulleyHeight, "pulleyHeights", "description", user, t)}
                                                                                            pulleyAttachmentName={translateDatabaseData(exercise.pulleyAttachment, "pulleyAttachments", "name", user, t)}
                                                                                            gripTypeName={translateDatabaseData(exercise.gripType, "gripTypes", "name", user, t)}
                                                                                            gripWidthDescription={translateDatabaseData(exercise.gripWidth, "gripWidths", "description", user, t)}
                                                                                            bodyPositionDescription={translateDatabaseData(exercise.bodyPosition, "bodyPositions", "description", user, t)}
                                                                                            lateralityType={translateDatabaseData(exercise.laterality, "lateralities", "type", user, t)}
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
                                                                                                                setTypeName={translateDatabaseData(set.setType, "setTypes", "name", user, t)}
                                                                                                                trainingTechniqueName={translateDatabaseData(set.trainingTechnique, "trainingTechniques", "name", user, t)}
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
                                                                        cardioOptionName={translateDatabaseData(session.cardioOption, "cardioOptions", "name", user, t)}
                                                                        cardioIntensityType={translateDatabaseData(session.cardioIntensity, "cardioIntensities", "type", user, t)}
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