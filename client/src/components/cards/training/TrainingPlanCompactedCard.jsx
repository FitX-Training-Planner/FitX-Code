import React from "react";
import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import styles from "./TrainingPlanCompactedCard.module.css";
import FlexWrap from "../../containers/FlexWrap";
import convertTime from "../../../utils/formatters/text/convertTime";
import getStepType from "../../../utils/generators/stepType";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { translateDatabaseData } from "../../../utils/formatters/text/translate";

function TrainingPlanCompactedCard({
    headingNumber,
    planID,
    name,
    trainingDays,
    handleModifyPlan,
    handleRemovePlan,
    handleExpandPlan,
    width
}) {
    const { t } = useTranslation();

    const user = useSelector(state => state.user);

    return (
        <Stack
            className={styles.training_plan_card}
        >
            <Stack
                gap="0.5em"
                className={styles.training_plan_actions}
            >
                <Stack
                    direction="row"
                    gap="2em"
                >
                    <Stack
                        direction="row"
                        justifyContent="start"
                    >
                        <ClickableIcon
                            iconSrc="/images/icons/expand.png"
                            name={t("expand")}
                            handleClick={handleExpandPlan}
                            size="small"
                        />

                        <ClickableIcon
                            iconSrc="/images/icons/edit.png"
                            name={t("edit")}
                            handleClick={handleModifyPlan}
                            size="small"
                        />
                    </Stack>

                    <ClickableIcon
                        iconSrc="/images/icons/remove.png"
                        name={t("remove")}
                        handleClick={handleRemovePlan}
                        size="small"
                    />
                </Stack>

                <Title
                    headingNumber={headingNumber}
                    text={name}
                />

                <Stack
                    className={styles.training_plan_id}
                    alignItems="start"
                >
                    <span>
                        ID: {planID}
                    </span>
                </Stack>
            </Stack>

            <FlexWrap
                direction="row"
                justifyContent="start"
                maxElements={width <= 640 ? (width <= 440 ? 1 : 2) : 3}
                className={styles.training_plan_info}
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
                                <Stack
                                    className={styles.training_day_title}
                                    gap="0.2em"
                                >                                    
                                    <span>
                                        {t("day")} {trainingDay.orderInPlan}
                                    </span>
                                    
                                    <Title
                                        headingNumber={headingNumber + 1}
                                        text={trainingDay.name}
                                    />
                                </Stack>

                                <Stack
                                    className={styles.training_day_info}
                                >
                                    {trainingDay.trainingSteps.length !== 0 && (
                                        <Stack>
                                            <Title
                                                headingNumber={headingNumber + 2}
                                                text={t("exercises")}
                                                varColor="--light-theme-color"
                                            />

                                            <hr/>

                                            <Stack
                                                gap="1.5em"
                                            >
                                                {[...trainingDay.trainingSteps]
                                                    .sort((a, b) => a.orderInDay - b.orderInDay)
                                                    .map((step, index) => (
                                                        <React.Fragment 
                                                            key={index}
                                                        >
                                                            <Stack
                                                                gap={step.exercises.length > 1 ? "1em" : "0.5em"}
                                                            >
                                                                <Title
                                                                    headingNumber={headingNumber + 3}
                                                                    text={`${step.orderInDay} - ${getStepType(step.exercises, user.config.isEnglish && t)}`}
                                                                />
                                                                
                                                                {[...step.exercises]
                                                                    .sort((a, b) => a.orderInStep - b.orderInStep)
                                                                    .map((exercise, index) => (
                                                                        <React.Fragment 
                                                                            key={index}
                                                                        >
                                                                            <Stack
                                                                                className={styles.exercise}
                                                                                gap="0.5em"
                                                                            >
                                                                                {step.exercises.length > 1 && (
                                                                                    <span>
                                                                                        {translateDatabaseData(exercise.exercise, "exercises", "name", user, t)}
                                                                                    </span>
                                                                                )}

                                                                                <span>
                                                                                    {exercise.sets.length} {t("sets")}
                                                                                </span>
                                                                            </Stack>
                                                                        </React.Fragment>
                                                                    ))
                                                                }
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
                                                headingNumber={headingNumber + 2}
                                                text={t("cardioSessions")}
                                                varColor="--light-theme-color"
                                            />

                                            <hr/>

                                            <Stack>
                                                {[...trainingDay.cardioSessions].map((session, index) => (
                                                    <React.Fragment 
                                                        key={index}
                                                    >
                                                        <Stack
                                                            gap="0.5em"
                                                            className={styles.cardio_session}
                                                        >
                                                            <Title
                                                                headingNumber={headingNumber + 3}
                                                                text={translateDatabaseData(session.cardioOption, "cardioOptions", "name", user, t)}
                                                            />
                                                          
                                                            <span>
                                                                {translateDatabaseData(session.cardioIntensity, "cardioIntensities", "type", user, t)}
                                                            </span>

                                                            <span>
                                                                {convertTime(session.durationMinutes, "minute", t)}
                                                            </span>
                                                        </Stack>
                                                    </React.Fragment>
                                                ))}
                                            </Stack>
                                        </Stack>
                                    )}
                                </Stack>
                            </Stack>
                        </React.Fragment>
                    ))
                }
            </FlexWrap>
        </Stack>
    );
}

export default TrainingPlanCompactedCard;