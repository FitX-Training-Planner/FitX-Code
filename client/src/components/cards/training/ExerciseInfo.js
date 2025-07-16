import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import styles from "./TrainingCards.module.css";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

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
                                ${t("pulley")} 
                                ${pulleyHeightDescription ? `${t("at")} ${pulleyHeightDescription}` : ""} 
                                ${pulleyAttachmentName ? `${t("with")} ${pulleyAttachmentName}` : ""} 
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
                            {t("grip")}:
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
                            {t("movement")}:
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
                            {t("position")}:
                        </span>

                        <span>
                            {bodyPositionDescription}
                        </span>
                    </Stack>
                }

                <span>
                    {sets.length} {t("sets")}
                </span>  
            </Stack>

            {children}

            {note && (
                <p
                    className={styles.note}
                    style={{ lineClamp: maxNoteLines, WebkitLineClamp: maxNoteLines }}
                >
                    <span>
                        {t("exerciseNote")}: 
                    </span>
                    
                    {` ${note}`}
                </p>
            )}
        </Stack>
    );
}

export default ExerciseInfo;