import convertTime from "../../../utils/formatters/text/convertTime";
import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import styles from "./TrainingCards.module.css";

function CardioSessionInfo({
    usedID,
    note,
    cardioOptionName,
    cardioIntensityType,
    durationMinutes,
    sessionTime,
    headingNumber,
    titleColor = "--text-color", 
}) {
    return (
        <Stack>
            <Stack
                gap="0.2em"
                className={styles.item_title}
            >
                <span>
                    {`Cardio ${usedID}`}
                </span>

                <Title
                    text={cardioOptionName}
                    headingNumber={headingNumber}
                    varColor={titleColor}
                />

                <hr/>
            </Stack>

            <Stack
                gap="0.5em"
            >
                <span>
                    {convertTime(durationMinutes, "minute")}
                </span>

                <span>
                    {cardioIntensityType}
                </span>
                
                <Stack
                    gap="0.2em"
                    className={styles.descriptioned_item}
                >
                    <span>
                        Horário:
                    </span>

                    <span>
                        {
                            sessionTime 
                            ? sessionTime
                            : "indeterminado"
                        }
                    </span>
                </Stack>
            </Stack>

            {note && 
                <p
                    className={styles.note}
                >
                    <span>
                        Nota da sessão: 
                    </span>
                    
                    {` ${note}`}
                </p>
            }
        </Stack>
    );
}

export default CardioSessionInfo;