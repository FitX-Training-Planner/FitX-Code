import React from "react";
import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import styles from "./TrainingPlanCompactedCard.module.css";
import FlexWrap from "../../containers/FlexWrap";
import convertTime from "../../../utils/formatters/text/convertTime";
import getStepType from "../../../utils/generators/stepType";

function TrainingPlanCompactedCard({ headingNumber, planID, name, trainingDays, handleModifyPlan, handleRemovePlan, handleExpandPlan, width }) {
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
                            name="Expandir"
                            handleClick={handleExpandPlan}
                            size="small"
                        />

                        <ClickableIcon
                            iconSrc="/images/icons/edit.png"
                            name="Editar"
                            handleClick={handleModifyPlan}
                            size="small"
                        />
                    </Stack>

                    <ClickableIcon
                        iconSrc="/images/icons/remove.png"
                        name="Remover"
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
                                        Dia {trainingDay.orderInPlan}
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
                                                text="Exercícios"
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
                                                                    text={`${step.orderInDay} - ${getStepType(step.exercises)}`}
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
                                                                                        {exercise.exercise.name}
                                                                                    </span>
                                                                                )}

                                                                                <span>
                                                                                    {exercise.sets.length} Séries
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
                                                text="Sessões de Cardio"
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
                                                            <span>
                                                                {session.cardioOption.name}
                                                            </span>

                                                            <span>
                                                                {session.cardioIntensity.type}
                                                            </span>

                                                            <span>
                                                                {convertTime(session.durationMinutes, "minute")}
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