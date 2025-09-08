import React from "react";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import Title from "../../text/Title";
import getStepType from "../../../utils/generators/stepType";
import TrainingDayInfo from "./TrainingDayInfo";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useWindowSize from "../../../hooks/useWindowSize";

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
    handleDuplicateTrainingDay
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    const user = useSelector(state => state.user);

    return (
        <Stack>
            <Stack
                direction="row"
                gap="0.5em"
            >
                <ClickableIcon
                    iconSrc="/images/icons/edit.png"
                    name={t("edit")}
                    handleClick={handleModifyTrainingDay}
                    size="small"
                />

                <ClickableIcon
                    iconSrc="/images/icons/remove.png"
                    name={t("remove")}
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
                    direction={width <= 440 ? "column" : "row"}
                    alignItems="start"
                    gap="2em"
                >
                    {!isRestDay && trainingSteps.length > 0 && (
                        <>
                            <Stack>
                                <Title
                                    text={t("exercises")}
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
                                                    text={getStepType(step.exercises, user.config.isEnglish && t)}
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
                                                                {user.config.isEnglish ? t(`databaseData.exercises.${exercise.exercise.ID}.name`) : exercise.exercise.name}
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
                                {width <= 440 && (
                                    <hr/>
                                )}

                                <Title
                                    text={t("cardioSessions")}
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
                                                    text={`${t("session")} ${session.usedID}`}
                                                    headingNumber={headingNumber + 2}
                                                    textAlign="left"
                                                />

                                                <Stack
                                                    gap="0.5em"
                                                    alignItems="start"
                                                >
                                                     <span>
                                                        {user.config.isEnglish ? t(`databaseData.cardioOptions.${session.cardioOption.ID}.name`) : session.cardioOption.name}
                                                    </span>

                                                    <span>
                                                        {user.config.isEnglish ? t(`databaseData.cardioIntensities.${session.cardioIntensity.ID}.type`) : session.cardioIntensity.type}
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
                name={t("duplicate")}
                handleClick={handleDuplicateTrainingDay}
                size="small"
            />
        </Stack>
    );
}

export default TrainingDayCard;