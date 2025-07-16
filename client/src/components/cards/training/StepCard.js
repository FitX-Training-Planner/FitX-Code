import React from "react";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import Title from "../../text/Title";
import styles from "./TrainingCards.module.css";
import { useTranslation } from "react-i18next";

function StepCard({
    exercises,
    orderInDay,
    headingNumber,
    handleModifyStep,
    handleRemoveStep,
    handleDuplicateStep
}) {
    const { t }= useTranslation();

    return (
        <Stack>
            <Stack
                direction="row"
                gap="0.5em"
            >
                <ClickableIcon
                    iconSrc="/images/icons/edit.png"
                    name={t("edit")}
                    handleClick={handleModifyStep}
                    size="small"
                />

                <ClickableIcon
                    iconSrc="/images/icons/remove.png"
                    name={t("remove")}
                    handleClick={handleRemoveStep}
                    size="small"
                />
            </Stack>

            <hr/>

            <Stack
                gap="0.2em"
                className={styles.item_title}
            >
                <Title
                    text={`${exercises.length > 1 ? t("step") : t("exercise")} ${orderInDay}`}
                    headingNumber={headingNumber}
                />

                {exercises.length === 1 &&
                    <span>
                        {exercises[0].exercise.name}
                    </span>
                }
            </Stack>

            <hr/>

            <Stack
                direction="column"
                alignItems="start"
                gap="2em"
            >
                {exercises.length === 0 ? (
                    t("undefined")
                ) : (
                    exercises.map((exercise, index) => (
                        <React.Fragment
                            key={index}
                        >
                            <Stack>
                                {exercises.length !== 1 &&
                                    <Title
                                        text={exercise.exercise.name}
                                        headingNumber={headingNumber + 1}
                                    /> 
                                }

                                <Stack
                                    gap="0.5em"
                                >
                                    {exercise.exerciseEquipment?.name && (
                                        <span>
                                            {exercise.exerciseEquipment.name}
                                        </span>
                                    )}

                                    <span>
                                        {exercise.sets.length} {t("sets")}
                                    </span>  
                                </Stack>
                            </Stack>
                        </React.Fragment>
                    ))
                )}
            </Stack>

            <hr/>
            
            <ClickableIcon
                iconSrc="/images/icons/duplicate.png"
                name={t("duplicate")}
                handleClick={handleDuplicateStep}
                size="small"
            />
        </Stack>
    );
}

export default StepCard;