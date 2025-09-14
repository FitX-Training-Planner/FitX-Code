import React, { useCallback, useRef, useState } from "react";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import Title from "../../text/Title";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useWindowSize from "../../../hooks/useWindowSize";
import styles from "./ClientTrainingCards.module.css";
import convertTime from "../../../utils/formatters/text/convertTime";
import ClientTrainingItem from "./ClientTrainingItem";
import Alert from "../../messages/Alert";
import { translateDatabaseData } from "../../../utils/formatters/text/translate";

function ClientTrainingExerciseCard({
    exerciseName,
    exerciseDescription,
    exerciseMedia,
    exerciseMuscleGroups,
    equipmentName,
    equipmentDescription,
    positionDescription,
    gripTypeName,
    gripWidthDescription,
    lateralityType,
    pulleyAttachmentName,
    pulleyHeightDescription,
    note,
    orderInStep,
    stepOrder,
    sets,
    isStep
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    const user = useSelector(state => state.user);
    
    const videoRef = useRef(null);

    const [isMusclesVisible, setIsMuscleVisible] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleOnFullscreenVideo = useCallback(() => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.webkitRequestFullscreen) {
                videoRef.current.webkitRequestFullscreen();
            } else if (videoRef.current.msRequestFullscreen) {
                videoRef.current.msRequestFullscreen();
            }
        }
    }, []);

    return (
        <Stack  
            className={styles.training_card}
            gap="0"
        >
            <Stack
                className={styles.day_name_container}
                gap="0"
                alignItems="start"
            >
                <Stack
                    alignItems="start"
                    gap="0"
                >
                    {isStep ? (
                        <>
                            <span>
                                {t("step")} {stepOrder}
                            </span>
                            
                            <span>
                                {t("exercise")} {orderInStep}
                            </span>
                        </>
                    ) : (
                        <span>
                            {t("exercise")} {stepOrder}
                        </span>
                    )}
                </Stack>

                <Title
                    headingNumber={2}
                    text={exerciseName}
                    textAlign="start"
                />
            </Stack>

            <Stack
                className={styles.training_card_body}
                gap="2em"
            >
                <Stack
                    direction={width <= 640 ? "column" : "row"}
                    alignItems="start"
                    gap="2em"
                >
                    <Stack
                        alignItems="start"
                        gap="3em"
                    >
                        <Stack
                            alignItems="start"
                        >
                            <Stack
                                alignItems="start"
                                gap="0.5em"
                                className={styles.descriptioned_item}
                            >
                                <span>
                                    {t("howToDo")}
                                </span>

                                <p
                                    style={{ hyphens: "none" }}
                                >
                                    {exerciseDescription}
                                </p>
                            </Stack>

                            {(equipmentDescription && equipmentName) && (
                                <Stack
                                    direction="row-reverse"
                                    gap="0.5em"
                                    justifyContent="start"
                                    className={styles.descriptioned_item}
                                >
                                    <span>
                                        {equipmentName}
                                    </span>

                                    <Alert
                                        alertMessage={equipmentDescription}
                                    />
                                </Stack>
                            )}
                        </Stack>

                        <Stack
                            alignItems="start"
                        >
                            {positionDescription && (
                                <Stack
                                    direction="row"
                                    gap="0.5em"
                                    justifyContent="start"
                                >
                                    <ClickableIcon
                                        iconSrc="/images/icons/bench.png"
                                        hasTheme={false}
                                    />

                                    <Stack
                                        alignItems="start"
                                        gap="0.5em"
                                        className={styles.descriptioned_item}
                                    >
                                        <span>
                                            {t("bodyPosition")}
                                        </span>

                                        <span>
                                            {positionDescription}
                                        </span>
                                    </Stack>
                                </Stack>
                            )}

                            {(gripTypeName || gripWidthDescription) && (
                                <Stack
                                    direction="row"
                                    gap="0.5em"
                                    justifyContent="start"
                                >
                                    <ClickableIcon
                                        iconSrc="/images/icons/grip.png"
                                        hasTheme={false}
                                    />

                                    <Stack
                                        alignItems="start"
                                        gap="0.5em"
                                        className={styles.descriptioned_item}
                                    >
                                        <span>
                                            {t("grip")}
                                        </span>

                                        <Stack
                                            direction="row"
                                            gap="0.4em"
                                        >
                                            {gripTypeName && (
                                                <span>
                                                    {gripTypeName}
                                                </span>
                                            )}

                                            {(gripTypeName && gripWidthDescription) && (
                                                <span>
                                                    &
                                                </span>
                                            )}

                                            {gripWidthDescription && (
                                                <span>
                                                    {gripWidthDescription}
                                                </span>
                                            )}
                                        </Stack>
                                    </Stack>
                                </Stack>
                            )}
                            
                            {(pulleyAttachmentName || pulleyHeightDescription) && (
                                <Stack
                                    direction="row"
                                    gap="0.5em"
                                    justifyContent="start"
                                >
                                    <ClickableIcon
                                        iconSrc="/images/icons/pulley.png"
                                        hasTheme={false}
                                    />

                                    <Stack
                                        alignItems="start"
                                        gap="0.5em"
                                        className={styles.descriptioned_item}
                                    >
                                        <span>
                                            {t("pulley")}
                                        </span>

                                        <Stack
                                            direction="row"
                                            gap="0.4em"
                                        >
                                            <span>
                                                {pulleyHeightDescription ? pulleyHeightDescription : t("pulley")}

                                                {pulleyAttachmentName && ` ${t("with")} `}

                                                {pulleyAttachmentName && pulleyAttachmentName}
                                            </span>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            )}

                            {lateralityType && (
                                <Stack
                                    direction="row"
                                    gap="0.5em"
                                    justifyContent="start"
                                >
                                    <ClickableIcon
                                        iconSrc="/images/icons/laterality.png"
                                        hasTheme={false}
                                    />

                                    <Stack
                                        alignItems="start"
                                        gap="0.5em"
                                        className={styles.descriptioned_item}
                                    >
                                        <span>
                                            {t("laterality")}
                                        </span>

                                        <span>
                                            {lateralityType}
                                        </span>
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>

                    <Stack
                        extraStyles={{ minWidth: "50%" }}
                        gap="0.2em"
                    >
                        <Stack 
                            alignItems="center" 
                            justifyContent="center"
                            className={styles.exercise_media}
                        >
                            {!videoError ? (
                                <>
                                    <video
                                        src={exerciseMedia}
                                        ref={videoRef}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        onError={() => setVideoError(true)}
                                    />

                                    <ClickableIcon
                                        iconSrc="/images/icons/expand.png"
                                        handleClick={handleOnFullscreenVideo}
                                        size="small"
                                        name={t("expand")}
                                        hasTheme={false}
                                    />
                                </>
                            ) : (
                                !imageError ? (
                                    <img
                                        src={exerciseMedia}
                                        alt={t("executionVideo")}
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <span>
                                        {t("unavailableMedia")}
                                    </span>
                                )
                            )}
                        </Stack>

                        <p
                            style={{ fontSize: "var(--small-text-size)" }}
                        >
                            {t("exerciseVideoAlert")}
                        </p>
                    </Stack>
                </Stack>

                <hr/>

                <Stack
                    gap="2em"
                >                    
                    {sets?.length !== 0 && (
                        <Stack
                            alignItems={width <= 440 ? "center" : "start"}
                        >
                            <Title
                                headingNumber={3}
                                text={t("sets")}
                                varColor="--theme-color"
                            />

                            <Stack
                                direction="row"
                                justifyContent={width <= 440 ? "center" : "start"}
                                alignItems="start"
                                className={styles.items_container}
                            >
                                {sets.map((set, index) => (
                                    <React.Fragment
                                        key={index}
                                    >
                                        <ClientTrainingItem
                                            style={{ 
                                                width: width <= 440 ? "80%" : "max-content"
                                            }}
                                        >
                                            <Stack
                                                gap="0.5em"
                                                alignItems="start"
                                            >   
                                                <span
                                                    className={styles.item_order}
                                                >
                                                    {set.orderInExercise}  
                                                </span>

                                                <Stack
                                                    justifyContent="center"
                                                >
                                                    <Stack>
                                                        {set.durationSeconds ? (
                                                            <span>
                                                                {convertTime(set.durationSeconds, "second", t)} {t("inIsometry")}
                                                            </span>
                                                        ) : (
                                                            <Stack
                                                                gap="0.5em"
                                                            >
                                                                <span>
                                                                    {set.minReps} - {set.maxReps}
                                                                </span>

                                                                <span>
                                                                    {t("reps")}
                                                                </span>
                                                            </Stack>
                                                        )}

                                                        <Stack
                                                            gap="0.5em"
                                                            className={styles.descriptioned_item}
                                                        >
                                                            <span>
                                                                {t("rest")}:
                                                            </span>

                                                            <span>
                                                                {convertTime(set.restSeconds, "second", t)}
                                                            </span>
                                                        </Stack>
                                                    </Stack>

                                                    <Stack>
                                                        <Stack
                                                            gap="0.5em"
                                                        >
                                                            <Stack
                                                                direction="row-reverse"
                                                                gap="0.5em"
                                                                justifyContent="start"
                                                                className={styles.descriptioned_item}
                                                            >
                                                                <span>
                                                                    {translateDatabaseData(set.setType, "setTypes", "name", user, t)}
                                                                </span>

                                                                <Alert
                                                                    alertMessage={translateDatabaseData(set.setType, "setTypes", "description", user, t)}
                                                                />
                                                            </Stack>

                                                            <span>
                                                                {t("intensity")} {set.setType.intensityLevel}/5
                                                            </span>
                                                        </Stack>

                                                        {set.trainingTechnique?.ID && (
                                                            <Stack
                                                                gap="0.5em"
                                                                direction="column-reverse"
                                                                className={styles.descriptioned_item}
                                                            >
                                                                <Stack
                                                                    direction="row-reverse"
                                                                    gap="0.5em"
                                                                    justifyContent="center"
                                                                >
                                                                    <span>
                                                                        {translateDatabaseData(set.trainingTechnique, "trainingTechniques", "name", user, t)}
                                                                    </span>

                                                                    <Alert
                                                                        alertMessage={translateDatabaseData(set.trainingTechnique, "trainingTechniques", "description", user, t)}
                                                                    />
                                                                </Stack>

                                                                <span>
                                                                    {t("trainingTechnique")}:
                                                                </span>
                                                            </Stack>
                                                        )}
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </ClientTrainingItem>
                                    </React.Fragment>
                                ))}
                            </Stack>
                        </Stack>
                    )} 
                </Stack>

                <hr/>

                <Stack>
                    {isMusclesVisible && (
                        <Stack
                            direction="row"
                            gap="0"
                        >
                            <Stack
                                className={styles.muscle_groups_select}
                            >
                                <img
                                    src={`/images/body/${user.sex !== "female" ? "male" : "female"}/anterior_view.png`}
                                    alt={t("anteriorBodyView")}
                                    title={t("anteriorBodyView")}
                                    style={{ filter: user.config.isDarkTheme ? "invert(1)" : "none" }}
                                />

                                {exerciseMuscleGroups?.filter(group => !group.isPosteriorMuscle).map((group, index) => (
                                    <img
                                        key={index}
                                        src={`/${user.sex !== "female" ? group.maleMedia?.url : group.femaleMedia?.url}${group.isPrimary ? "primary" : "secondary"}.png`}
                                        title={translateDatabaseData(group, "muscleGroups", "name", user, t)}
                                        alt={translateDatabaseData(group, "muscleGroups", "name", user, t)}
                                    />                    
                                ))}
                            </Stack>

                            <Stack
                                className={styles.muscle_groups_select}
                            >
                                <img
                                    src={`/images/body/${user.sex !== "female" ? "male" : "female"}/posterior_view.png`}
                                    alt={t("posteriorBodyView")}
                                    title={t("posteriorBodyView")}
                                    style={{ filter: user.config.isDarkTheme ? "invert(1)" : "none" }}
                                />

                                {exerciseMuscleGroups?.filter(group => group.isPosteriorMuscle).map((group, index) => (
                                    <img
                                        key={index}
                                        src={`/${user.sex !== "female" ? group.maleMedia?.url : group.femaleMedia?.url}${group.isPrimary ? "primary" : "secondary"}.png`}
                                        title={translateDatabaseData(group, "muscleGroups", "name", user, t)}
                                        alt={translateDatabaseData(group, "muscleGroups", "name", user, t)}
                                        style={{ zIndex: !user.sex !== "female" && group.name === "Glúteos" ? "2" : "1"}}
                                    />                    
                                ))}
                            </Stack>
                        </Stack>
                    )}

                    <Stack
                        gap="0.5em"
                    >
                        <span
                            style={{ textAlign: "center" }}
                        >
                            {isMusclesVisible ? t("hideActivateMuscles") : t("viewActivateMuscles")}
                        </span>

                        <div
                            className={`${styles.view_muscles} ${isMusclesVisible ? styles.active : undefined}`}
                        >
                            <ClickableIcon
                                iconSrc="/images/icons/arrow_to_bottom.png"
                                size="small"
                                handleClick={() => setIsMuscleVisible(prevVisible => !prevVisible)}
                                name={isMusclesVisible ? t("hideActivateMuscles") : t("viewActivateMuscles")}
                            />
                        </div>
                    </Stack>
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
        </Stack>
    );
}

export default ClientTrainingExerciseCard;