import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import styles from "./TrainingCards.module.css";

function ExerciseInfo({ 
    children,
    sets, 
    exerciseName, 
    exerciseEquipmentName, 
    pulleyHeightDescription, 
    pulleyAttachmentName, 
    gripTypeName, 
    gripWidthDescription, 
    bodyPositionDescription, 
    lateralityType, 
    note, 
    maxNoteLines = "unset",
    headingNumber, 
    titleColor = "--text-color", 
}) {
    return (
        <Stack>
            <Stack
                gap="0.2em"
                className={styles.item_title}
            >             
                <Title
                    text={exerciseName}
                    headingNumber={headingNumber}
                    varColor={titleColor}
                />

                {exerciseEquipmentName && (
                    <span>
                        {exerciseEquipmentName}
                    </span>
                )}

                <hr/>
            </Stack>

            <Stack
                gap="0.5em"
            >                                            
                {
                    exerciseEquipmentName?.toLowerCase() === "polia" 
                    && (pulleyHeightDescription || pulleyAttachmentName) && (
                        <span>
                            {`
                                Polia 
                                ${pulleyHeightDescription ? `na ${pulleyHeightDescription}` : ""} 
                                ${pulleyAttachmentName ? `com ${pulleyAttachmentName}` : ""} 
                            `}
                        </span>
                    )
                }

                {(gripTypeName || gripWidthDescription) && 
                    <Stack
                        gap="0.2em"
                        className={styles.descriptioned_item}
                    >
                        <span>
                            Pegada:
                        </span>

                        <span>
                            {`
                                ${gripWidthDescription || ""}
                                ${gripTypeName || ""}
                            `}
                        </span>
                    </Stack>
                }

                {lateralityType && 
                    <Stack
                        gap="0.2em"
                        className={styles.descriptioned_item}
                    >
                        <span>
                            Movimento:
                        </span>

                        <span>
                            {lateralityType}
                        </span>
                    </Stack>
                }

                {bodyPositionDescription &&
                    <Stack
                        gap="0.2em"
                        className={styles.descriptioned_item}
                    >
                        <span>
                            Posição:
                        </span>

                        <span>
                            {bodyPositionDescription}
                        </span>
                    </Stack>
                }

                <span>
                    {`${sets.length} séries`}
                </span>  
            </Stack>

            {children}

            {note && (
                <p
                    className={styles.note}
                    style={{ lineClamp: maxNoteLines, WebkitLineClamp: maxNoteLines }}
                >
                    <span>
                        Nota do exercício: 
                    </span>
                    
                    {` ${note}`}
                </p>
            )}
        </Stack>
    );
}

export default ExerciseInfo;