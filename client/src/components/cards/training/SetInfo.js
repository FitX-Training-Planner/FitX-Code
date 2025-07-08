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
    return (
        <Stack>
            <Stack
                gap="0.2em"
                className={styles.item_title}
            >
                <span>
                    Série {orderInExercise}
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
                        {`${minReps} - ${maxReps} repetições`}
                    </span>    
                ) : durationSeconds && (
                    <span>
                        {`${convertTime(durationSeconds, "second")} em isometria`}
                    </span>  
                )}   

                {trainingTechniqueName && 
                    <Stack
                        gap="0.2em"
                        className={styles.descriptioned_item}
                    >
                        <span>
                            Técnica:
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
                        Descanso:
                    </span>

                    <span>
                        {convertTime(restSeconds, "second")}
                    </span>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default SetInfo;