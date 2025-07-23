import { useTranslation } from "react-i18next";
import convertTime from "../../../utils/formatters/text/convertTime";
import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import styles from "./TrainingCards.module.css";

function SetInfo({
    orderInExercise,
    minReps,
    maxReps,
    durationSeconds,
    restSeconds,
    setTypeName,
    trainingTechniqueName,
    headingNumber
}) {
    const { t } = useTranslation();

    return (
        <Stack>
            <Stack
                gap="0.2em"
                className={styles.item_title}
            >
                <span>
                    {t("set")} {orderInExercise}
                </span>

                <Title
                    headingNumber={headingNumber}
                    text={setTypeName}
                />

                <hr/>
            </Stack>

            <Stack
                gap="0.5em"
            >                                            
                {minReps && maxReps ? (
                    <span>
                        {minReps} - {maxReps} {t("reps")}
                    </span>    
                ) : durationSeconds && (
                    <span>
                        {convertTime(durationSeconds, "second", t)} {t("inIsometry")}
                    </span>  
                )}   

                {trainingTechniqueName && 
                    <Stack
                        gap="0.2em"
                        className={styles.descriptioned_item}
                    >
                        <span>
                            {t("technique")}:
                        </span>

                        <span>
                            {trainingTechniqueName}
                        </span>
                    </Stack>
                }

                <Stack
                    gap="0.2em"
                    className={styles.descriptioned_item}
                >
                    <span>
                        {t("rest")}:
                    </span>

                    <span>
                        {convertTime(restSeconds, "second", t)}
                    </span>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default SetInfo;