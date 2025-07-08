import React from "react";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import Title from "../../text/Title";
import getStepType from "../../../utils/generators/stepType";
import TrainingDayInfo from "./TrainingDayInfo";

function TrainingDayCard({
    name,
    isRestDay,
    orderInPlan,
    note,
    trainingSteps,
    cardioSessions,
    headingNumber,
    handleModifyTrainingDay,
    handleRemoveTrainingDay,
    handleDuplicateTrainingDay,
    viewWidth
}) {
    return (
        <Stack>
            <Stack
                direction="row"
                gap="0.5em"
            >
                <ClickableIcon
                    iconSrc="/images/icons/edit.png"
                    name="Editar"
                    handleClick={handleModifyTrainingDay}
                    size="small"
                />

                <ClickableIcon
                    iconSrc="/images/icons/remove.png"
                    name="Remover"
                    handleClick={handleRemoveTrainingDay}
                    size="small"
                />
            </Stack>

            <hr/>
            
            <TrainingDayInfo
                name={name}
                orderInPlan={orderInPlan}
                note={note}
                headingNumber={headingNumber}
            >
                <Stack
                    direction={viewWidth <= 440 ? "column" : "row"}
                    alignItems="start"
                    gap="2em"
                >
                    {!isRestDay && trainingSteps.length > 0 && (
                        <>
                            <Stack>
                                <Title
                                    text="Exercícios"
                                    headingNumber={headingNumber + 1}
                                    varColor="--theme-color"
                                />

                                <hr/>

                                <Stack>
                                    {trainingSteps.map((step, index) => (
                                        <React.Fragment
                                            key={index}
                                        >
                                            <Stack
                                                alignItems="start"
                                                gap="0.5em"
                                            >
                                                <Title
                                                    text={getStepType(step.exercises)}
                                                    headingNumber={headingNumber + 2}
                                                    textAlign="left"
                                                />

                                                {step.exercises.length > 1 &&
                                                    <Stack
                                                        gap="0.5em"
                                                        alignItems="start"
                                                    >
                                                        {step.exercises.map((exercise, index) => (
                                                            <span
                                                                key={index}
                                                            >
                                                                {exercise.exercise.name}
                                                            </span>
                                                        ))}
                                                    </Stack>
                                                }
                                            </Stack>
                                        </React.Fragment>
                                    ))}
                                </Stack>
                            </Stack>
                        </>
                    )}

                    {cardioSessions.length > 0 && (
                        <>
                            <Stack>
                                {viewWidth <= 440 && (
                                    <hr/>
                                )}

                                <Title
                                    text="Sessões de Cardio"
                                    headingNumber={headingNumber + 1}
                                    varColor="--theme-color"
                                />

                                <hr/>

                                <Stack>
                                    {cardioSessions.map((session, index) => (
                                        <React.Fragment
                                            key={index}
                                        >
                                            <Stack
                                                alignItems="start"
                                                gap="0.5em"
                                            >
                                                <Title
                                                    text={`Sessão ${session.usedID}`}
                                                    headingNumber={headingNumber + 2}
                                                    textAlign="left"
                                                />

                                                <Stack
                                                    gap="0.5em"
                                                    alignItems="start"
                                                >
                                                    <span>
                                                        {session.cardioOption.name}
                                                    </span>

                                                    <span>
                                                        {session.cardioIntensity.type}
                                                    </span>
                                                </Stack>
                                            </Stack>
                                        </React.Fragment>
                                    ))}
                                </Stack>
                            </Stack>
                        </>
                    )}
                </Stack>
            </TrainingDayInfo>

            <hr/>
            
            <ClickableIcon
                iconSrc="/images/icons/duplicate.png"
                name="Duplicar"
                handleClick={handleDuplicateTrainingDay}
                size="small"
            />
        </Stack>
    );
}

export default TrainingDayCard;