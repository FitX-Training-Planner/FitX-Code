import React from "react";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import Title from "../../text/Title";
import styles from "./TrainingCards.module.css";

function StepCard({ exercises, orderInDay, headingNumber, handleModifyStep, handleRemoveStep, handleDuplicateStep }) {
    return (
        <Stack>
            <Stack
                direction="row"
                gap="0.5em"
            >
                <ClickableIcon
                    iconSrc="/images/icons/edit.png"
                    name="Editar"
                    handleClick={handleModifyStep}
                    size="small"
                />

                <ClickableIcon
                    iconSrc="/images/icons/remove.png"
                    name="Remover"
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
                    text={`${exercises.length > 1 ? "Sequência" : "Exercício"} ${orderInDay}`}
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
                    "Indefinido"
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
                                        {`${exercise.sets.length} séries`}
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
                name="Duplicar"
                handleClick={handleDuplicateStep}
                size="small"
            />
        </Stack>
    );
}

export default StepCard;