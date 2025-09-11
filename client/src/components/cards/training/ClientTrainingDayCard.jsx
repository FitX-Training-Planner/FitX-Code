import React, { useEffect, useState } from "react";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import Title from "../../text/Title";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useWindowSize from "../../../hooks/useWindowSize";
import styles from "./ClientTrainingCards.module.css";
import convertTime from "../../../utils/formatters/text/convertTime";
import ClientTrainingItem from "./ClientTrainingItem";
import { translateDatabaseData } from "../../../utils/formatters/text/translate";
import ClientTrainingCardioSessionCard from "./ClientTrainingCardioSessionCard";
import ClientTrainingExerciseCard from "./ClientTrainingExerciseCard";

function ClientTrainingDayCard({
    dayID,
    name,
    isRestDay,
    orderInPlan,
    note,
    trainingSteps,
    cardioSessions
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    const user = useSelector(state => state.user);

    const [expandedCardio, setExpandedCardio] = useState(null);
    const [expandedStep, setExpandedStep] = useState(null);

    useEffect(() => {
        setExpandedCardio(null);

        setExpandedStep(null);
    }, [dayID]);

    return (
        <Stack  
            className={styles.training_card}
        >
            <Stack
                direction="row"
                className={styles.day_name_container}
                extraStyles={{ 
                    backgroundColor: isRestDay ? "var(--dark-theme-color)" : "var(--light-theme-color)", 
                    color: isRestDay ? "var(--white-color)" : "var(--dark-color)"
                }}
            >
                <Stack
                    alignItems="start"
                    gap="0"
                >
                    <span>
                        {t("day")} {orderInPlan}
                    </span>

                    <Title
                        headingNumber={2}
                        varColor={isRestDay ? "--white-color" : "--text-color"}
                        text={isRestDay ? t("rest") : name}
                        textAlign="start"
                    />
                </Stack>

                {isRestDay && (
                    <img
                        src="/images/icons/rest.png"
                        alt=""
                        style={{ height: "5em" }}
                    />  
                )}
            </Stack>

            {!(cardioSessions?.length === 0 && !note && isRestDay) && (
                <Stack
                    className={styles.training_card_body}
                >
                    <Stack
                        gap="2em"
                    >
                        {(!isRestDay && trainingSteps?.length !== 0) && (
                            <Stack
                                alignItems={width <= 440 ? "center" : "start"}
                            >
                                <Title
                                    headingNumber={3}
                                    text={t("exercises")}
                                    varColor="--theme-color"
                                />
                                
                                <Stack
                                    direction="row"
                                    justifyContent={width <= 440 ? "center" : "start"}
                                    alignItems="start"
                                    className={styles.items_container}
                                >
                                    {expandedStep ? (
                                        <Stack>
                                            <Stack>
                                                {expandedStep.exercises?.map((ex, index) => (
                                                    <React.Fragment
                                                        key={index}
                                                    >
                                                        <ClientTrainingExerciseCard
                                                            exerciseName={translateDatabaseData(ex.exercise, "exercises", "name", user, t)}
                                                            exerciseDescription={translateDatabaseData(ex.exercise, "exercises", "description", user, t)}
                                                            exerciseMedia={ex.exercise?.media.url}
                                                            exerciseMuscleGroups={ex.exercise?.muscleGroups}
                                                            equipmentName={translateDatabaseData(ex.exerciseEquipment, "exerciseEquipments", "name", user, t)}
                                                            equipmentDescription={translateDatabaseData(ex.exerciseEquipment, "exerciseEquipments", "description", user, t)}
                                                            positionDescription={translateDatabaseData(ex.bodyPosition, "bodyPositions", "description", user, t)}
                                                            gripTypeName={translateDatabaseData(ex.gripType, "gripTypes", "name", user, t)}
                                                            gripWidthDescription={translateDatabaseData(ex.gripWidth, "gripWidths", "description", user, t)}
                                                            lateralityType={translateDatabaseData(ex.laterality, "lateralities", "type", user, t)}
                                                            pulleyAttachmentName={translateDatabaseData(ex.pulleyAttachment, "pulleyAttachments", "name", user, t)}
                                                            pulleyHeightDescription={translateDatabaseData(ex.pulleyHeight, "pulleyHeights", "description", user, t)}
                                                            note={ex.note}
                                                            orderInStep={ex.orderInStep}
                                                            stepOrder={expandedStep.orderInDay}
                                                            sets={ex.sets}
                                                            isStep={expandedStep.exercises?.length > 1}
                                                        />
                                                    </React.Fragment>
                                                ))}
                                            </Stack>

                                            <ClickableIcon
                                                iconSrc="/images/icons/back.png"
                                                size="small"
                                                handleClick={() => setExpandedStep(null)}
                                                name={t("viewOtherSteps")}
                                            />
                                        </Stack>
                                    ) : (
                                        trainingSteps.map((step, index) => (
                                            <React.Fragment
                                                key={index}
                                            >
                                                <ClientTrainingItem
                                                    style={{ 
                                                        width: width <= 440 ? "80%" : "max-content"
                                                    }}
                                                    handleExpand={() => setExpandedStep(step)}
                                                >
                                                    <Stack
                                                        gap="0.5em"
                                                        alignItems="start"
                                                    >   
                                                        <span
                                                            className={styles.item_order}
                                                        >
                                                            {step.orderInDay}  
                                                        </span>
    
                                                        <Stack
                                                            justifyContent="center"
                                                        >
                                                            {step.exercises?.length > 1 ? (
                                                                <>
                                                                    <Stack
                                                                        gap="0.5em"
                                                                    >
                                                                        {step.exercises?.map((ex, index) => (
                                                                            <span
                                                                                style={{ textAlign: "center", fontSize: width <= 440 ? "var(--text-size)" : "var(--small-text-size)" }}
                                                                                key={index}
                                                                            >
                                                                                {translateDatabaseData(ex.exercise, "exercises", "name", user, t)}
                                                                            </span>
                                                                        ))}
                                                                    </Stack>
    
                                                                    <Stack
                                                                        gap="0.5em"
                                                                    >
                                                                        <span>
                                                                            {step.exercises?.map((ex, index) => (
                                                                                <span
                                                                                    key={index}
                                                                                >
                                                                                    {ex.orderInStep !== 1 && "-"}
    
                                                                                    {ex.sets?.length}
                                                                                </span>
                                                                            ))}
                                                                        </span>
    
                                                                        <span>
                                                                            {t("sets")}
                                                                        </span>
                                                                    </Stack>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span
                                                                        style={{ textAlign: "center" }}
                                                                    >
                                                                        {translateDatabaseData(step.exercises[0], "exercises", "name", user, t)}
                                                                    </span>
                                                                    
                                                                    <span>
                                                                        {step.exercises[0].sets?.length} {t("sets")}
                                                                    </span>
                                                                </>
                                                            )}
    
                                                        </Stack>
                                                    </Stack>
                                                </ClientTrainingItem>
                                            </React.Fragment>
                                        )))
                                    }
                                </Stack>
                            </Stack>
                        )}
                        
                        {cardioSessions?.length !== 0 && (
                            <Stack
                                alignItems={width <= 440 ? "center" : "start"}
                            >
                                <Title
                                    headingNumber={3}
                                    text={t("cardioSessions")}
                                    varColor="--theme-color"
                                />

                                <Stack
                                    direction="row"
                                    justifyContent={width <= 440 ? "center" : "start"}
                                    alignItems="start"
                                    className={styles.items_container}
                                >
                                    {expandedCardio ? (
                                        <Stack>
                                            <ClientTrainingCardioSessionCard
                                                optionMedia={expandedCardio.cardioOption?.media.url}
                                                optionName={translateDatabaseData(expandedCardio.cardioOption, "cardioOptions", "name", user, t)}
                                                intensityType={translateDatabaseData(expandedCardio.cardioIntensity, "cardioIntensities", "type", user, t)}
                                                intensityDescription={translateDatabaseData(expandedCardio.cardioIntensity, "cardioIntensities", "description", user, t)}
                                                durationMinutes={expandedCardio.durationMinutes}
                                                sessionTime={expandedCardio.sessionTime}
                                                note={expandedCardio.note}
                                                order={expandedCardio.usedID}
                                            />  

                                            <ClickableIcon
                                                iconSrc="/images/icons/back.png"
                                                size="small"
                                                handleClick={() => setExpandedCardio(null)}
                                                name={t("viewOtherCardioSessions")}
                                            />
                                        </Stack>
                                    ) : (
                                        cardioSessions.map((session, index) => (
                                            <React.Fragment
                                                key={index}
                                            >
                                                <ClientTrainingItem
                                                    style={{ 
                                                        width: width <= 440 ? "80%" : "max-content"
                                                    }}
                                                    handleExpand={() => setExpandedCardio(session)}
                                                >
                                                    <Stack>
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="center"
                                                        >
                                                            <ClickableIcon
                                                                iconSrc={`/${session.cardioOption.media.url}`}
                                                            />
    
                                                            <span>
                                                                {translateDatabaseData(session.cardioOption, "cardioOptions", "name", user, t)}
                                                            </span>
                                                        </Stack>
    
                                                        <span>
                                                            {convertTime(session.durationMinutes, "minute", t)}
                                                        </span>
                                                    </Stack>
                                                </ClientTrainingItem>
                                            </React.Fragment>
                                        ))
                                    )}
                                </Stack>
                            </Stack>
                        )} 
                    </Stack>

                    {note && (
                        <Stack>
                            <hr/>
                            
                            <p
                                style={{ fontSize: "var(--small-text-size)", hyphens: "none" }}
                            >
                                {note}
                            </p>
                        </Stack>
                    )}
                </Stack>
            )}
        </Stack>
    );
}

export default ClientTrainingDayCard;